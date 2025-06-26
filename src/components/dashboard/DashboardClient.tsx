"use client"

import * as React from "react"
import { SearchFilters } from "@/components/trends/SearchFilters"
import { TrendChart } from "@/components/trends/TrendChart"
import { TrendCard } from "@/components/trends/TrendCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Loader2, InfoIcon, BarChart3, TrendingUp, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TrendItem } from "@/types/trends"
import { TrendsFilters } from "@/lib/api"
import { useTrends, useRefreshTrends, useApplySort } from "@/hooks/useTrends"
import { TrendCardSkeletonList } from "@/components/trends/TrendCardSkeleton"

// Dados de fallback para o caso de erro na API
const fallbackData: TrendItem[] = [
  { term: "Tendência 1", timestamp: new Date().toISOString(), value: 100 },
  { term: "Tendência 2", timestamp: new Date().toISOString(), value: 80 },
  { term: "Tendência 3", timestamp: new Date().toISOString(), value: 60 },
  { term: "Tendência 4", timestamp: new Date().toISOString(), value: 40 },
  { term: "Tendência 5", timestamp: new Date().toISOString(), value: 20 },
]

interface DashboardClientProps {
  initialFilters?: TrendsFilters
}

export default function DashboardClient({ 
  initialFilters = {
    country: "Brasil",
    period: "Últimas 24 horas",
    category: "Todas as categorias",
    sort: "Por relevância"
  } 
}: DashboardClientProps) {
  // Inicializar com filtros vazios para mostrar placeholders
  const [filters, setFilters] = React.useState<TrendsFilters>({
    country: "",
    period: "",
    category: "",
    sort: ""
  })
  const [chartType, setChartType] = React.useState<'bar' | 'line'>('bar')

  // Usar filtros padrão se os filtros atuais estiverem vazios
  const queryFilters = React.useMemo(() => {
    const hasEmptyFilters = !filters.country || !filters.period || !filters.category || !filters.sort
    return hasEmptyFilters ? initialFilters : filters
  }, [filters, initialFilters])

  // Hooks do TanStack Query
  const { 
    data: trendsResponse, 
    isLoading, 
    error,
    refetch
  } = useTrends(queryFilters)

  const refreshTrends = useRefreshTrends()
  const applySort = useApplySort()

  // Extrair dados da resposta ou usar fallback
  const trendData = trendsResponse?.data || fallbackData
  const hasError = error || trendsResponse?.success === false

  const handleRefresh = () => {
    refreshTrends.mutate(queryFilters)
  }

  const handleFilterChange = (newFilters: Partial<TrendsFilters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
  }

  const handleSortChange = (newSort: string) => {
    // Atualizar filtros locais primeiro
    setFilters(prev => ({ ...prev, sort: newSort }))
    
    // Para ordenação, fazemos localmente sem nova requisição
    applySort.mutate({ 
      filters: queryFilters, 
      newSort 
    })
  }

  // Estatísticas dos dados
  const totalVolume = trendData.reduce((sum, item) => sum + item.value, 0)
  const averageVolume = trendData.length > 0 ? Math.round(totalVolume / trendData.length) : 0
  const topTrend = trendData.length > 0 ? trendData[0] : null

  const formatNumber = (num: number) => {
    return num.toLocaleString('pt-BR')
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Dashboard de Tendências
          </h1>
          <p className="text-muted-foreground mt-2">
            Explore as tendências mais populares em tempo real
          </p>
        </div>
        <Button 
          variant="outline" 
          onClick={handleRefresh} 
          disabled={isLoading || refreshTrends.isPending} 
          className="gap-2"
        >
          {isLoading || refreshTrends.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isLoading || refreshTrends.isPending ? 'Carregando...' : 'Atualizar'}
        </Button>
      </div>

      {/* Filtros */}
      <div className="space-y-4">
        <SearchFilters 
          onRegionChange={(country) => handleFilterChange({ country })}
          onPeriodChange={(period) => handleFilterChange({ period })}
          onCategoryChange={(category) => handleFilterChange({ category })}
          onSortChange={handleSortChange}
          selectedCountry={filters.country}
          selectedPeriod={filters.period}
          selectedCategory={filters.category}
          selectedSort={filters.sort}
        />

        {/* Filtros aplicados */}
        {trendData.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-muted-foreground">Filtros aplicados:</span>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{queryFilters.country}</Badge>
              <Badge variant="secondary">{queryFilters.period}</Badge>
              <Badge variant="secondary">{queryFilters.category}</Badge>
              <Badge variant="outline">Ordenado: {queryFilters.sort}</Badge>
            </div>
          </div>
        )}
      </div>

      {/* Estatísticas */}
      {trendData.length > 0 && !isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Top Tendência</p>
                  <p className="text-2xl font-bold">{topTrend?.term}</p>
                  <p className="text-sm text-muted-foreground">{formatNumber(topTrend?.value || 0)}+ pesquisas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <Eye className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Volume Total</p>
                  <p className="text-2xl font-bold">{formatNumber(totalVolume)}</p>
                  <p className="text-sm text-muted-foreground">pesquisas combinadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Média por Tendência</p>
                  <p className="text-2xl font-bold">{formatNumber(averageVolume)}</p>
                  <p className="text-sm text-muted-foreground">pesquisas em média</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {hasError && (
        <div className="p-4 text-red-600 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
          {error?.message || 'Erro ao carregar tendências'}
        </div>
      )}

      {/* Conteúdo Principal */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analysis">Análise Detalhada</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {isLoading ? (
            <TrendCardSkeletonList count={5} />
          ) : trendData.length > 0 ? (
            <div className="grid gap-4">
              {trendData.map((trend, index) => (
                <TrendCard
                  key={`${trend.term}-${index}`}
                  term={trend.term}
                  value={trend.value}
                  rank={trend.rank}
                  description={trend.description}
                  hint={trend.hint}
                  percentage_increase={trend.percentage_increase}
                  time_started={trend.time_started}
                  timestamp={trend.timestamp}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 border rounded-lg border-dashed">
              <InfoIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum dado carregado</h3>
              <p className="text-center text-muted-foreground mb-4">
                Clique no botão "Atualizar" para buscar as tendências mais recentes.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  Análise de Volume - {queryFilters.country}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="w-full h-[500px] overflow-hidden">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <p className="text-muted-foreground">Carregando gráfico...</p>
                    </div>
                  </div>
                ) : trendData.length > 0 ? (
                  <TrendChart data={trendData} type={chartType} />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    Nenhum dado disponível para análise
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 