export interface SearchHistoryItem {
    id: string;
    userId: string;
    timestamp: string;

    // Parâmetros da busca
    queryParams: {
        country: string;
        period: string;
        category: string;
        sort: string;
    };

    // Resultado da busca
    resultsCount: number;
    topResults?: {
        term: string;
        value: number;
    }[];

    // Status da busca
    status: 'success' | 'error' | 'partial';
    errorMessage?: string;

    // Metadados
    source: 'web' | 'api' | 'scheduled';
    device?: string;
    ip?: string;
}

export interface SearchHistoryResponse {
    success: boolean;
    data: SearchHistoryItem[];
    pagination?: {
        total: number;
        page: number;
        pageSize: number;
        totalPages: number;
    };
    error?: string;
}

// Tipos para filtros de histórico
export interface HistoryFilters {
    startDate?: string;
    endDate?: string;
    country?: string;
    category?: string;
    status?: 'success' | 'error' | 'partial';
    sortBy?: 'timestamp' | 'country' | 'category';
    sortDirection?: 'asc' | 'desc';
    page?: number;
    pageSize?: number;
} 