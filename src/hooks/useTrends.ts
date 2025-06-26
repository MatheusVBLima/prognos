"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { fetchTrendsClient, trendsKeys, saveSearchToHistory, TrendsFilters } from "@/lib/api"
import { TrendItem } from "@/types/trends"
import { toast } from "sonner"

// Hook para buscar tendências
export function useTrends(filters: TrendsFilters) {
  return useQuery({
    queryKey: trendsKeys.list(filters),
    queryFn: () => fetchTrendsClient(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
    refetchOnMount: false, // Não refetch no mount pois temos dados prefetch
    select: (data) => ({
      ...data,
      data: data.data?.map((item, index) => ({
        ...item,
        rank: item.rank || index + 1
      })) || []
    })
  })
}

// Hook para refrescar tendências
export function useRefreshTrends() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (filters: TrendsFilters) => {
      const result = await fetchTrendsClient(filters)
      return { result, filters }
    },
    onSuccess: ({ result, filters }) => {
      // Atualizar o cache
      queryClient.setQueryData(trendsKeys.list(filters), result)
      
      // Salvar no histórico
      saveSearchToHistory(result.data, filters, 'success')
      
      toast.success('Tendências atualizadas com sucesso!')
    },
    onError: (error: Error, filters) => {
      console.error('Erro ao atualizar tendências:', error)
      
      // Salvar no histórico mesmo em caso de erro
      saveSearchToHistory([], filters, 'error', error.message)
      
      toast.error(error.message || 'Erro ao buscar tendências')
    },
  })
}

// Hook para invalidar cache de tendências
export function useInvalidateTrends() {
  const queryClient = useQueryClient()

  return () => {
    queryClient.invalidateQueries({ 
      queryKey: trendsKeys.lists() 
    })
  }
}

// Hook para aplicar ordenação local (sem nova requisição)
export function useApplySort() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ filters, newSort }: { filters: TrendsFilters, newSort: string }) => {
      const currentData = queryClient.getQueryData(trendsKeys.list(filters)) as any
      
      if (!currentData || !currentData.data || !Array.isArray(currentData.data)) {
        throw new Error('Nenhum dado encontrado para ordenar')
      }

      const newFilters = { ...filters, sort: newSort }
      let sortedData = [...(currentData.data as TrendItem[])]

      // Aplicar ordenação
      if (newSort === "Ordem alfabética") {
        sortedData.sort((a, b) => a.term.localeCompare(b.term))
      } else if (newSort === "Por volume de pesquisa") {
        sortedData.sort((a, b) => b.value - a.value)
      } else if (newSort === "Crescente") {
        sortedData.sort((a, b) => a.value - b.value)
      } else if (newSort === "Decrescente") {
        sortedData.sort((a, b) => b.value - a.value)
      }

      return { 
        data: sortedData, 
        success: true,
        filters: newFilters 
      }
    },
    onSuccess: ({ data, filters }) => {
      // Atualizar cache com dados ordenados
      queryClient.setQueryData(trendsKeys.list(filters), {
        data,
        success: true
      })
      
      toast.success('Ordenação aplicada com sucesso!')
    },
    onError: (error: Error) => {
      toast.error('Erro ao aplicar ordenação: ' + error.message)
    },
  })
} 