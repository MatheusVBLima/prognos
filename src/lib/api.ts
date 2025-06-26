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

// Função para salvar no histórico
export async function saveSearchToHistory(
  data: TrendItem[], 
  filters: TrendsFilters,
  status: 'success' | 'error' | 'partial' = 'success', 
  errorMsg?: string
) {
  try {
    const historyData = {
      queryParams: filters,
      resultsCount: data?.length || 0,
      topResults: data?.slice(0, 3).map(item => ({
        term: item.term,
        value: item.value
      })),
      status,
      errorMessage: errorMsg,
      source: 'web',
      device: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
    };

    const response = await fetch('/api/history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(historyData),
    });

    if (!response.ok) {
      console.error('Falha ao salvar no histórico');
    }
  } catch (err) {
    console.error('Erro ao registrar histórico:', err);
  }
} 