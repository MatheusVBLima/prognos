import { HydrationBoundary, dehydrate, QueryClient } from "@tanstack/react-query"
import { fetchTrendsServer, TrendsFilters, trendsKeys } from "@/lib/api"
import DashboardClient from "@/components/dashboard/DashboardClient"

// Filtros padrão
const defaultFilters: TrendsFilters = {
  country: "Brasil",
  period: "Últimas 24 horas", 
  category: "Todas as categorias",
  sort: "Por relevância"
}

// Server Component - busca dados no servidor com prefetch
export default async function DashboardPage() {
  // Criar QueryClient no servidor
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // Configure o staleTime para evitar refetch desnecessário
        staleTime: 60 * 1000, // 1 minuto
        gcTime: 5 * 60 * 1000, // 5 minutos
      },
    },
  })

  try {
    // Prefetch dos dados de tendências - isso roda no servidor
    // O cliente receberá os dados hidratados instantaneamente
    await queryClient.prefetchQuery({
      queryKey: trendsKeys.list(defaultFilters),
      queryFn: () => fetchTrendsServer(defaultFilters),
      staleTime: 60 * 1000, // 1 minuto
    })

    console.log("✅ Prefetch concluído no servidor para filtros:", defaultFilters)
  } catch (error) {
    // Se o prefetch falhar, não quebramos a página
    // O cliente tentará buscar os dados novamente
    console.error("❌ Erro no prefetch do servidor:", error)
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardClient 
        initialFilters={defaultFilters}
      />
    </HydrationBoundary>
  )
} 