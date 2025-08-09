"use client"

import * as React from "react"
import { SearchFilters } from "@/components/trends/SearchFilters"
import { TrendChart } from "@/components/trends/TrendChart"
import { TrendCard } from "@/components/trends/TrendCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCw, Loader2, InfoIcon, BarChart3, TrendingUp, Eye, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TrendItem } from "@/types/trends"
import { data } from "@/data/data"
import { TrendCardSkeletonList } from "@/components/trends/TrendCardSkeleton"
import { useDashboard } from "@/contexts/DashboardContext"

interface TrendsFilters {
  country: string
  period: string
  category: string
  sort: string
}

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
  const {
    filters,
    setFilters,
    activeTab,
    setActiveTab,
    chartType,
    setChartType,
    hasSearched,
    setHasSearched,
    isLoading,
    setIsLoading,
    trendData,
    setTrendData,
  } = useDashboard()

  const transformMockData = (): TrendItem[] => {
    return data.google_trends_brazil_top_10.top_trending_searches.map((item) => ({
      term: item.search_term,
      value: parseInt(item.search_volume.replace(/\D/g, '')) || Math.floor(Math.random() * 100000) + 1000,
      timestamp: new Date().toISOString(),
      rank: item.rank,
      description: item.description,
      hint: item.hint,
      percentage_increase: item.percentage_increase,
      time_started: item.time_started
    }))
  }
  
  const isInitialLoading = isLoading && !trendData
  const isRefreshing = isLoading && !!trendData
  
  const shouldShowInitialMessage = !hasSearched && !isInitialLoading && !isLoading
  const shouldShowData = hasSearched && trendData && trendData.length > 0 && !isInitialLoading
  const shouldShowError = false

  const handleApplyFilters = async () => {
    if (!filters.country || !filters.period) return
    
    setIsLoading(true)
    
    setTimeout(() => {
      const mockData = transformMockData()
      setTrendData(mockData)
      setHasSearched(true)
      setIsLoading(false)
    }, 1500)
  }

  const handleFilterChange = (newFilters: Partial<TrendsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }
  
  const safeData = trendData || []
  const totalVolume = safeData.reduce((sum, item) => sum + item.value, 0)
  const averageVolume = safeData.length > 0 ? Math.round(totalVolume / safeData.length) : 0
  const topTrend = safeData.length > 0 ? safeData[0] : null

  const formatNumber = (num: number) => num.toLocaleString('pt-BR')
  
  return (
    <div className="space-y-8" style={{ opacity: isRefreshing ? 0.8 : 1 }}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Dashboard de Tendências</h1>
          <p className="text-muted-foreground mt-2">Explore as tendências mais populares em tempo real</p>
        </div>
        <Button 
          variant="default" 
          onClick={handleApplyFilters} 
          disabled={isLoading || !filters.country || !filters.period} 
          className="gap-2"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
          {isLoading ? 'Buscando...' : 'Aplicar Filtros'}
        </Button>
      </div>

      <SearchFilters 
        onRegionChange={(country) => handleFilterChange({ country })}
        onPeriodChange={(period) => handleFilterChange({ period })}
        onCategoryChange={(category) => handleFilterChange({ category })}
        onSortChange={(sort) => handleFilterChange({ sort })}
        selectedCountry={filters.country}
        selectedPeriod={filters.period}
        selectedCategory={filters.category}
        selectedSort={filters.sort}
      />
      
      {isInitialLoading && <TrendCardSkeletonList />}


      {shouldShowInitialMessage && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Globe className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Selecione os filtros para começar</h3>
          <p className="text-muted-foreground mb-4">Escolha um país e um período para ver as tendências.</p>
        </div>
      )}
      
      {shouldShowData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2"><TrendingUp className="h-5 w-5 text-green-600" /><div><p className="text-sm font-medium text-muted-foreground">Top Tendência</p><p className="text-2xl font-bold">{topTrend?.term}</p><p className="text-sm text-muted-foreground">{formatNumber(topTrend?.value || 0)}+ pesquisas</p></div></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2"><Eye className="h-5 w-5 text-blue-600" /><div><p className="text-sm font-medium text-muted-foreground">Volume Total</p><p className="text-2xl font-bold">{formatNumber(totalVolume)}</p><p className="text-sm text-muted-foreground">pesquisas combinadas</p></div></div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2"><BarChart3 className="h-5 w-5 text-purple-600" /><div><p className="text-sm font-medium text-muted-foreground">Média por Tendência</p><p className="text-2xl font-bold">{formatNumber(averageVolume)}</p><p className="text-sm text-muted-foreground">pesquisas em média</p></div></div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'list' | 'charts')} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">Lista Detalhada</TabsTrigger>
              <TabsTrigger value="charts">Visualizações</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {safeData.map((item, index) => (
                  <TrendCard key={`${item.term}-${index}`} {...item} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              <Card>
                <CardHeader><CardTitle>Volume de Pesquisas por Tendência</CardTitle></CardHeader>
                <CardContent><TrendChart data={safeData} type={chartType} /></CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
} 