import { TrendItem } from "@/types/trends"

export interface TrendsFilters {
  country: string
  period: string
  category: string
  sort: string
}

export interface TrendsResponse {
  data: TrendItem[]
  success: boolean
  error?: string
  userMessage?: string
}

// Função para buscar tendências (server-side)
export async function fetchTrendsServer(filters: TrendsFilters): Promise<TrendsResponse> {
  const params = new URLSearchParams({
    t: Date.now().toString(),
    country: filters.country,
    period: filters.period,
    category: filters.category,
    sort: filters.sort,
  })

  // Para server-side, usamos a URL completa
  const baseUrl = process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'http://localhost:3000'
  
  const response = await fetch(`${baseUrl}/api/trends?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    // No servidor, não precisamos de cache do navegador
    cache: 'no-store',
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.userMessage || `Erro ao buscar dados: ${response.status}`)
  }

  return result
}

// Função para buscar tendências (client-side)
export async function fetchTrendsClient(filters: TrendsFilters): Promise<TrendsResponse> {
  const params = new URLSearchParams({
    t: Date.now().toString(),
    country: filters.country,
    period: filters.period,
    category: filters.category,
    sort: filters.sort,
  })

  const response = await fetch(`/api/trends?${params.toString()}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.userMessage || `Erro ao buscar dados: ${response.status}`)
  }

  return result
}

// Query key factory para consistência
export const trendsKeys = {
  all: ['trends'] as const,
  lists: () => [...trendsKeys.all, 'list'] as const,
  list: (filters: TrendsFilters) => [...trendsKeys.lists(), filters] as const,
}

// Função para salvar no histórico (desabilitada - API removida)
export async function saveSearchToHistory(
  data: TrendItem[], 
  filters: TrendsFilters,
  status: 'success' | 'error' | 'partial' = 'success', 
  errorMsg?: string
) {
  // API de histórico foi removida por não estar sendo usada
  console.log('📝 Histórico de pesquisa (desabilitado):', {
    resultsCount: data?.length || 0,
    filters,
    status
  });
} 