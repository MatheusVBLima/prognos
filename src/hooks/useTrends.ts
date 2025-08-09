"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TrendItem } from '@/types/trends'
import { toast } from 'sonner'

// Tipos para a nova estrutura de dados
interface ScrapedTrend {
  trend: string
  searches: string
  category: string
  region: string
  time: string
  description: string
  hints: string[]
}

interface TrendsFilters {
  country: string
  period: string
  category: string
  sort: string
}

// Função para converter dados do scraping para o formato esperado pela UI
function convertScrapedToTrendData(scrapedTrends: ScrapedTrend[]): TrendItem[] {
  return scrapedTrends.map((trend, index) => ({
    rank: index + 1,
    term: trend.trend,
    value: parseInt(trend.searches.replace(/[^\d]/g, '')) || Math.floor(Math.random() * 900000) + 100000,
    timestamp: trend.time || new Date().toISOString(),
    percentage_increase: `${Math.floor(Math.random() * 900 + 100)}%`,
    time_started: `${Math.floor(Math.random() * 23 + 1)} hours ago`,
    description: trend.description,
    hint: trend.hints || [`${trend.trend} está em alta`, 'Tendência popular', 'Viral nas redes sociais']
  }))
}

// Hook para buscar tendências
export const useTrends = (filters: TrendsFilters, enabled: boolean = false) => {
  return useQuery({
    queryKey: ['trends', filters],
    queryFn: async () => {
      if (!enabled) return null // Não buscar se não estiver habilitado
      
      const params = new URLSearchParams({
        country: filters.country,
        period: filters.period,
        category: filters.category,
        sort: filters.sort,
        browserbase: 'true'
      })

      const response = await fetch(`/api/trends?${params}`)
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao buscar tendências')
      }

      const data = await response.json()
      
      if (data.success && Array.isArray(data.data)) {
        return convertScrapedToTrendData(data.data)
      }
      
      if (Array.isArray(data)) {
        return data as TrendItem[]
      }
      
      throw new Error('Formato de dados inválido')
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false, // O scraping pode falhar, melhor tentar manualmente
  })
}

// Hook para refresh das tendências
export const useRefreshTrends = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (filters: TrendsFilters) => {
      const promise = fetch('/api/trends/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      }).then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.message || 'Falha no scraping do Google Trends')
        }
        const data = await res.json()
        if (!data.success) {
          throw new Error(data.message || 'Erro ao processar dados do scraping')
        }
        return convertScrapedToTrendData(data.data)
      })

      toast.promise(promise, {
        loading: 'Buscando tendências em tempo real...',
        success: (data) => `Sucesso! ${data.length} tendências encontradas.`,
        error: (err) => err.message || 'Ocorreu um erro ao buscar as tendências.',
      })

      return promise
    },
    onSuccess: (data, variables) => {
      queryClient.setQueryData(['trends', variables], data)
      queryClient.invalidateQueries({ queryKey: ['trends'] })
    },
    onError: () => {
      // O toast.promise já lida com a exibição do erro
    }
  })
} 