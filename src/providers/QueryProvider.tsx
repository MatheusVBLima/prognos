"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState } from "react"

// Criar uma única instância do QueryClient por sessão
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Com SSR, queremos definir um staleTime padrão acima de 0
        // para evitar refetch imediato no cliente
        staleTime: 60 * 1000, // 1 minuto
        gcTime: 1000 * 60 * 60 * 24, // 24 horas
        retry: 3,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined = undefined

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: sempre criar um novo query client
    return makeQueryClient()
  } else {
    // Browser: criar o query client apenas uma vez
    if (!browserQueryClient) browserQueryClient = makeQueryClient()
    return browserQueryClient
  }
}

interface QueryProviderProps {
  children: React.ReactNode
}

export function QueryProvider({ children }: QueryProviderProps) {
  // Não usar useState para criar o query client no servidor
  // pois isso causaria hidratação diferente entre server e client
  const [queryClient] = useState(() => getQueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools 
        initialIsOpen={false} 
        position="right"
        buttonPosition="bottom-right"
      />
    </QueryClientProvider>
  )
} 