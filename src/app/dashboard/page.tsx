"use client"

import * as React from "react"
import { SearchFilters } from "@/components/trends/SearchFilters"
import { TrendChart } from "@/components/trends/TrendChart"
import { TrendList } from "@/components/trends/TrendList"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, Loader2, InfoIcon } from "lucide-react"
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
  const [shouldAutoFetch, setShouldAutoFetch] = React.useState(false)

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
    setIsLoading(true)
    const toastId = toast.loading('Buscando tendências...')
    
    try {
      // Adicionar timestamp na URL para evitar cache no navegador
      // E adicionar os parâmetros de filtro
      const params = new URLSearchParams();
      params.append('t', Date.now().toString());
      params.append('country', selectedCountry);
      params.append('period', selectedPeriod);
      params.append('category', selectedCategory);
      params.append('sort', selectedSort);
      
      const response = await fetch(`/api/trends?${params.toString()}`)
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.userMessage || `Error: ${response.status}`);
      }
      const result = await response.json()
      setError(null)
      
      if (result?.data?.length > 0) {
        // Ordenar os dados de acordo com a seleção do usuário
        let processedData = result.data.map((item: any) => ({
          term: item.term,
          value: item.value || 100,
          timestamp: item.timestamp
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
        
        setTrendData(processedData);
        saveSearchToHistory(processedData, 'success');
        
        // Verificar se estamos usando dados de cache devido a rate limiting
        if (result.cached && result.rateLimit) {
          toast.success(result.userMessage || 'Mostrando dados em cache devido a limites de API', {
            id: toastId,
            duration: 5000
          });
        } else if (result.cached) {
          toast.success(result.userMessage || 'Mostrando dados em cache', {
            id: toastId
          });
        } else {
          toast.success('Tendências atualizadas!', {
            id: toastId
          });
        }
      } else {
        // Usar dados de fallback se API retornar vazio
        setTrendData(fallbackData)
        saveSearchToHistory(fallbackData, 'partial', 'Nenhum dado retornado da API');
        toast.error('Nenhuma tendência encontrada, exibindo dados de exemplo', {
          id: toastId
        });
      }
    } catch (error) {
      console.error("Failed to fetch trends:", error)
      // Usar dados de fallback em caso de erro
      setTrendData(fallbackData)
      const errorMessage = error instanceof Error ? error.message : "Erro ao buscar tendências";
      setError(errorMessage)
      saveSearchToHistory(fallbackData, 'error', errorMessage);
      toast.error(errorMessage, {
        id: toastId,
        duration: 5000
      });
    } finally {
      setIsLoading(false)
    }
  }, [selectedCountry, selectedPeriod, selectedCategory, selectedSort]);

 
  
  // Carregar dados iniciais apenas quando a página carrega pela primeira vez
  React.useEffect(() => {
    // Carregar dados iniciais quando o componente monta
    fetchTrends();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const handleCountryChange = (country: string) => {
    console.log("handleCountryChange chamado com:", country);
    setSelectedCountry(country);
  }

  const handlePeriodChange = (period: string) => {
    console.log("handlePeriodChange chamado com:", period);
    setSelectedPeriod(period);
  }

  const handleCategoryChange = (category: string) => {
    console.log("handleCategoryChange chamado com:", category);
    setSelectedCategory(category);
  }

  const handleSortChange = (sort: string) => {
    console.log("handleSortChange chamado com:", sort);
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
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard de Tendências</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchTrends} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Carregando...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Atualizar
              </>
            )}
          </Button>
        </div>
      </div>
      
      {!trendData.length && !isLoading && (
        <div className="flex flex-col items-center justify-center p-8 border rounded-lg border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50">
          <InfoIcon className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Nenhum dado carregado</h3>
          <p className="text-center text-muted-foreground mb-4">
            Clique no botão "Atualizar" acima para buscar as tendências mais recentes.
          </p>
        </div>
      )}

      <div className="mb-6">
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
      </div>

      {/* Filtros aplicados */}
      {trendData.length > 0 && (
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-medium">Filtros aplicados:</span>
          <div className="flex flex-wrap gap-2">
            <Badge >
              {selectedCountry}
            </Badge>
            <Badge>
              {selectedPeriod}
            </Badge>
              <Badge>
                {selectedCategory}
              </Badge>
            <Badge>
              Ordenado: {selectedSort}
            </Badge>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Visão Geral - {selectedCountry}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  Carregando...
                </div>
              ) : (
                <TrendList 
                  data={trendData} 
                  maxItems={48}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>
              {selectedPeriod} - {selectedCategory !== "Todas as categorias" ? selectedCategory : "Geral"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  Carregando...
                </div>
              ) : trendData.length > 0 ? (
                <TrendList 
                  data={trendData}
                  maxItems={48}
                />
              ) : (
                <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                  Nenhum dado disponível para os filtros selecionados
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              Análise Detalhada - {selectedCountry}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  Carregando...
                </div>
              ) : trendData.length > 0 ? (
                <TrendChart data={trendData} />
              ) : (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  Nenhum dado disponível para os filtros selecionados
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 