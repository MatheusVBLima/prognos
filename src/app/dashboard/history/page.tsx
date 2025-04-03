"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Filter, X, RefreshCw, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"

// Tipagem simplificada do histórico para compatibilidade com a API
interface HistoryItem {
  id: string;
  userId: string;
  timestamp: string;
  queryParams: {
    country: string;
    period: string;
    category: string;
    sort: string;
  };
  resultsCount: number;
  status: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  });

  // Filtros
  const [filters, setFilters] = useState({
    country: "",
    category: "",
    startDate: "",
    endDate: "",
    status: "",
    sortBy: "timestamp",
    sortDirection: "desc"
  });

  // Controle de exibição dos filtros
  const [showFilters, setShowFilters] = useState(false);

  // Carregar histórico
  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Construir URL com filtros
      const params = new URLSearchParams();
      
      if (filters.country) params.append("country", filters.country);
      if (filters.category) params.append("category", filters.category);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.status) params.append("status", filters.status);
      
      params.append("sortBy", filters.sortBy);
      params.append("sortDirection", filters.sortDirection);
      params.append("page", pagination.page.toString());
      params.append("pageSize", pagination.pageSize.toString());

      const toastId = toast.loading('Carregando histórico...');
      
      const response = await fetch(`/api/history?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Erro ao buscar histórico: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        setHistory(data.data);
        setPagination({
          page: data.pagination?.page || 1,
          pageSize: data.pagination?.pageSize || 10,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 0
        });
        toast.success('Histórico carregado com sucesso!', { id: toastId });
      } else {
        throw new Error(data.error || "Erro desconhecido ao buscar histórico");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar histórico");
      console.error("Erro ao buscar histórico:", err);
      toast.error(err instanceof Error ? err.message : "Erro ao carregar histórico");
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar histórico na inicialização e quando a página mudar
  useEffect(() => {
    fetchHistory();
  }, [pagination.page]);

  // Aplicar filtros
  const handleApplyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 })); // Voltar para a primeira página
    toast.success('Filtros aplicados');
    fetchHistory();
  };

  // Limpar filtros
  const handleClearFilters = () => {
    setFilters({
      country: "",
      category: "",
      startDate: "",
      endDate: "",
      status: "",
      sortBy: "timestamp",
      sortDirection: "desc"
    });
    setPagination(prev => ({ ...prev, page: 1 }));
    toast.success('Filtros limpos');
    fetchHistory();
  };

  // Excluir um item do histórico
  const handleDeleteItem = async (id: string) => {
    try {
      const toastId = toast.loading('Excluindo registro...');
      
      const response = await fetch(`/api/history/${id}`, {
        method: "DELETE"
      });
      
      if (!response.ok) {
        throw new Error(`Erro ao excluir item: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // Atualizar lista localmente
        setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
        setPagination(prev => ({
          ...prev,
          total: prev.total - 1
        }));
        toast.success('Registro excluído com sucesso!', { id: toastId });
      } else {
        throw new Error(data.error || "Erro desconhecido ao excluir item");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao excluir item");
      console.error("Erro ao excluir item:", err);
      toast.error(err instanceof Error ? err.message : "Erro ao excluir item");
    }
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Obter status em formato de badge
  const getStatusBadge = (status: string) => {
    let color = "";
    let label = status;

    switch (status) {
      case "success":
        color = "bg-green-100 text-green-800";
        label = "Sucesso";
        break;
      case "error":
        color = "bg-red-100 text-red-800";
        label = "Erro";
        break;
      case "partial":
        color = "bg-yellow-100 text-yellow-800";
        label = "Parcial";
        break;
      default:
        color = "bg-gray-100 text-gray-800";
    }

    return <Badge className={color}>{label}</Badge>;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Histórico de Buscas</h1>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? <X className="mr-2 h-4 w-4" /> : <Filter className="mr-2 h-4 w-4" />}
            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
          </Button>
          <Button 
            variant="outline" 
            onClick={fetchHistory}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Atualizar
          </Button>
        </div>
      </div>

      {/* Área de Filtros */}
      {showFilters && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">País</label>
                <Input
                  placeholder="Filtrar por país"
                  value={filters.country}
                  onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <Input
                  placeholder="Filtrar por categoria"
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os status</SelectItem>
                    <SelectItem value="success">Sucesso</SelectItem>
                    <SelectItem value="error">Erro</SelectItem>
                    <SelectItem value="partial">Parcial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Inicial</label>
                <Input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Final</label>
                <Input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
              >
                Limpar Filtros
              </Button>
              <Button onClick={handleApplyFilters}>
                Aplicar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-md bg-red-50 text-red-600">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Buscas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Carregando histórico...</span>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum registro encontrado.
            </div>
          ) : (
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="[&_tr]:border-b">
                  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Data
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Região
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Categoria
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Período
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Resultados
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {history.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                    >
                      <td className="p-4 align-middle">
                        {formatDate(item.timestamp)}
                      </td>
                      <td className="p-4 align-middle">
                        {item.queryParams.country}
                      </td>
                      <td className="p-4 align-middle">
                        {item.queryParams.category}
                      </td>
                      <td className="p-4 align-middle">
                        {item.queryParams.period}
                      </td>
                      <td className="p-4 align-middle">
                        {item.resultsCount}
                      </td>
                      <td className="p-4 align-middle">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="p-4 align-middle">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Paginação */}
          {!isLoading && history.length > 0 && (
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-muted-foreground">
                Mostrando {history.length} de {pagination.total} registros
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page <= 1}
                >
                  Anterior
                </Button>
                <span className="text-sm">
                  Página {pagination.page} de {pagination.totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 