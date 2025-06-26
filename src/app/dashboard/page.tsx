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
import { toast } from "sonner"

// Dados de fallback para o caso de erro na API
const fallbackData = [
  { term: "Tendência 1", timestamp: new Date().toISOString(), value: 100 },
  { term: "Tendência 2", timestamp: new Date().toISOString(), value: 80 },
  { term: "Tendência 3", timestamp: new Date().toISOString(), value: 60 },
  { term: "Tendência 4", timestamp: new Date().toISOString(), value: 40 },
  { term: "Tendência 5", timestamp: new Date().toISOString(), value: 20 },
]

export default function DashboardPage() {
  const [selectedCountry, setSelectedCountry] = React.useState<string>("Brasil")
  const [selectedPeriod, setSelectedPeriod] = React.useState<string>("Últimas 24 horas")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("Todas as categorias")
  const [selectedSort, setSelectedSort] = React.useState<string>("Por relevância")
  const [trendData, setTrendData] = React.useState<any[]>(fallbackData)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [chartType, setChartType] = React.useState<'bar' | 'line'>('bar')

  // Referência para o timer de debounce
  const timerRef = React.useRef<NodeJS.Timeout | null>(null)

  // Função para salvar a pesquisa no histórico
  const saveSearchToHistory = async (data: any[], status: 'success' | 'error' | 'partial' = 'success', errorMsg?: string) => {
    try {
      const historyData = {
        queryParams: {
          country: selectedCountry,
          period: selectedPeriod,
          category: selectedCategory,
          sort: selectedSort
        },
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
  };

  // Função para buscar tendências com os filtros atuais
  const fetchTrends = React.useCallback(async () => {
    console.log("[DashboardPage] fetchTrends iniciado.");
    setIsLoading(true)
    const toastId = toast.loading('Buscando tendências...')
    
    try {
      const params = new URLSearchParams();
      params.append('t', Date.now().toString());
      params.append('country', selectedCountry);
      params.append('period', selectedPeriod);
      params.append('category', selectedCategory);
      params.append('sort', selectedSort);
      
      console.log(`[DashboardPage] Enviando requisição para /api/trends com parâmetros: ${params.toString()}`);
      const response = await fetch(`/api/trends?${params.toString()}`);
      console.log(`[DashboardPage] Resposta recebida da API /api/trends. Status: ${response.status}`);
      
      const result = await response.json();
      console.log("[DashboardPage] Corpo da resposta (JSON parseado):", JSON.stringify(result, null, 2));

      if (!response.ok) {
        console.error(`[DashboardPage] Erro na resposta da API: ${response.status}. Mensagem: ${result.userMessage || result.error}`);
        throw new Error(result.userMessage || `Erro ao buscar dados: ${response.status}`);
      }
      
      setError(null)
      
      if (result?.data?.length > 0) {
        console.log(`[DashboardPage] API retornou ${result.data.length} itens de dados.`);
        let processedData = result.data.map((item: any) => ({
          term: item.term,
          value: item.value || 100,
          timestamp: item.timestamp,
          rank: item.rank,
          description: item.description,
          hint: item.hint,
          percentage_increase: item.percentage_increase,
          time_started: item.time_started
        }));
        
        // Aplicar a ordenação selecionada
        if (selectedSort === "Ordem alfabética") {
          processedData.sort((a: any, b: any) => a.term.localeCompare(b.term));
        } else if (selectedSort === "Por volume de pesquisa") {
          processedData.sort((a: any, b: any) => b.value - a.value);
        } else if (selectedSort === "Crescente") {
          processedData.sort((a: any, b: any) => a.value - b.value);
        } else if (selectedSort === "Decrescente") {
          processedData.sort((a: any, b: any) => b.value - a.value);
        }
        
        console.log("[DashboardPage] Atualizando estado trendData com dados reais.");
        setTrendData(processedData);
        saveSearchToHistory(processedData, 'success');
        
        toast.success('Tendências atualizadas com sucesso!', {
          id: toastId
        });
      } else {
        console.warn("[DashboardPage] API retornou sucesso, mas sem dados (result.data está vazio ou nulo). Usando fallbackData.");
        setTrendData(fallbackData)
        saveSearchToHistory(fallbackData, 'partial', 'Nenhum dado retornado da API');
        toast.error('Nenhuma tendência encontrada para os filtros selecionados, exibindo dados de exemplo.', {
            id: toastId
        });
      }
    } catch (error) {
      console.error("[DashboardPage] Erro capturado no bloco catch do fetchTrends:", error);
      console.warn("[DashboardPage] Usando fallbackData devido ao erro.");
      setTrendData(fallbackData)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao buscar tendências";
      setError(errorMessage)
      saveSearchToHistory(fallbackData, 'error', errorMessage);
      toast.error(errorMessage, {
        id: toastId,
        duration: 5000
      });
    } finally {
      console.log("[DashboardPage] fetchTrends finalizado.");
      setIsLoading(false)
    }
  }, [selectedCountry, selectedPeriod, selectedCategory, selectedSort]);

  // Carregar dados iniciais quando a página carrega
  React.useEffect(() => {
    fetchTrends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleCountryChange = (country: string) => {
    setSelectedCountry(country);
  }

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  }

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    
    // Aplicar a ordenação aos dados existentes sem fazer nova busca
    let sortedData = [...trendData];
    
    if (sort === "Ordem alfabética") {
      sortedData.sort((a, b) => a.term.localeCompare(b.term));
    } else if (sort === "Por volume de pesquisa") {
      sortedData.sort((a, b) => b.value - a.value);
    } else if (sort === "Crescente") {
      sortedData.sort((a, b) => a.value - b.value);
    } else if (sort === "Decrescente") {
      sortedData.sort((a, b) => b.value - a.value);
    }
    
    setTrendData(sortedData);
    toast.success('Ordenação aplicada com sucesso!');
  }

  // Estatísticas dos dados
  const totalVolume = trendData.reduce((sum, item) => sum + item.value, 0);
  const averageVolume = trendData.length > 0 ? Math.round(totalVolume / trendData.length) : 0;
  const topTrend = trendData.length > 0 ? trendData[0] : null;

  const formatNumber = (num: number) => {
    return num.toLocaleString('pt-BR');
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
        <Button variant="outline" onClick={fetchTrends} disabled={isLoading} className="gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          {isLoading ? 'Carregando...' : 'Atualizar'}
        </Button>
      </div>

      {/* Filtros */}
      <div className="space-y-4">
        <SearchFilters 
          onRegionChange={handleCountryChange}
          onPeriodChange={handlePeriodChange}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
          selectedCountry={selectedCountry}
          selectedPeriod={selectedPeriod}
          selectedCategory={selectedCategory}
          selectedSort={selectedSort}
        />

        {/* Filtros aplicados */}
        {trendData.length > 0 && (
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-muted-foreground">Filtros aplicados:</span>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{selectedCountry}</Badge>
              <Badge variant="secondary">{selectedPeriod}</Badge>
              <Badge variant="secondary">{selectedCategory}</Badge>
              <Badge variant="outline">Ordenado: {selectedSort}</Badge>
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

      {error && (
        <div className="p-4 text-red-600 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
          {error}
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
            <div className="flex items-center justify-center p-12">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-muted-foreground">Carregando tendências...</p>
              </div>
            </div>
          ) : trendData.length > 0 ? (
            <div className="grid gap-4">
              {trendData.map((trend, index) => (
                <TrendCard
                  key={index}
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
                  Análise de Volume - {selectedCountry}
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