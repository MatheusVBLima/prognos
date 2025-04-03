import { NextRequest, NextResponse } from "next/server";
import { SearchHistoryItem, HistoryFilters } from "@/types/history";
import { v4 as uuidv4 } from "uuid";

// Mock de armazenamento de histórico - em produção seria integrado com o Supabase
const searchHistoryStore = new Map<string, SearchHistoryItem[]>();

// Dados de demonstração para testes
const demoHistory: SearchHistoryItem[] = [
    {
        id: uuidv4(),
        userId: "default-user",
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
        queryParams: {
            country: "Brasil",
            period: "Últimas 24 horas",
            category: "Todas as categorias",
            sort: "Por relevância"
        },
        resultsCount: 15,
        topResults: [
            { term: "Futebol", value: 100 },
            { term: "Eleições", value: 85 },
            { term: "Clima", value: 70 }
        ],
        status: "success",
        source: "web"
    },
    {
        id: uuidv4(),
        userId: "default-user",
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
        queryParams: {
            country: "Estados Unidos",
            period: "Últimos 7 dias",
            category: "Tecnologia",
            sort: "Por volume de pesquisa"
        },
        resultsCount: 12,
        topResults: [
            { term: "iPhone", value: 100 },
            { term: "Samsung", value: 80 },
            { term: "Android", value: 65 }
        ],
        status: "success",
        source: "web"
    },
    {
        id: uuidv4(),
        userId: "default-user",
        timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
        queryParams: {
            country: "Portugal",
            period: "Último mês",
            category: "Esportes",
            sort: "Ordem alfabética"
        },
        resultsCount: 8,
        topResults: [
            { term: "Cristiano Ronaldo", value: 100 },
            { term: "Benfica", value: 75 },
            { term: "UEFA", value: 60 }
        ],
        status: "success",
        source: "web"
    }
];

// Inicializar a store com dados de demonstração
searchHistoryStore.set("default-user", [...demoHistory]);

// Função auxiliar para obter o ID do usuário da request
function getUserId(req: NextRequest): string {
    const userId = req.headers.get("x-user-id") || "default-user";
    return userId;
}

// GET /api/history - Obter histórico de buscas
export async function GET(req: NextRequest) {
    try {
        const userId = getUserId(req);
        const url = new URL(req.url);

        // Extrai filtros da URL
        const filters: HistoryFilters = {
            startDate: url.searchParams.get("startDate") || undefined,
            endDate: url.searchParams.get("endDate") || undefined,
            country: url.searchParams.get("country") || undefined,
            category: url.searchParams.get("category") || undefined,
            status: url.searchParams.get("status") as 'success' | 'error' | 'partial' || undefined,
            sortBy: url.searchParams.get("sortBy") as 'timestamp' | 'country' | 'category' || 'timestamp',
            sortDirection: url.searchParams.get("sortDirection") as 'asc' | 'desc' || 'desc',
            page: parseInt(url.searchParams.get("page") || "1", 10),
            pageSize: parseInt(url.searchParams.get("pageSize") || "10", 10)
        };

        // Obtém histórico do usuário (ou array vazio se não existir)
        let userHistory = searchHistoryStore.get(userId) || [];

        // Se não houver histórico e for o usuário default, inicializa com dados de exemplo
        if (userHistory.length === 0 && userId === "default-user") {
            userHistory = [...demoHistory];
            searchHistoryStore.set(userId, userHistory);
        }

        // Aplicar filtros
        let filteredHistory = [...userHistory];

        // Filtra por data
        if (filters.startDate) {
            filteredHistory = filteredHistory.filter(
                item => new Date(item.timestamp) >= new Date(filters.startDate!)
            );
        }

        if (filters.endDate) {
            filteredHistory = filteredHistory.filter(
                item => new Date(item.timestamp) <= new Date(filters.endDate!)
            );
        }

        // Filtra por país
        if (filters.country) {
            filteredHistory = filteredHistory.filter(
                item => item.queryParams.country.toLowerCase().includes(filters.country!.toLowerCase())
            );
        }

        // Filtra por categoria
        if (filters.category) {
            filteredHistory = filteredHistory.filter(
                item => item.queryParams.category.toLowerCase().includes(filters.category!.toLowerCase())
            );
        }

        // Filtra por status
        if (filters.status) {
            filteredHistory = filteredHistory.filter(item => item.status === filters.status);
        }

        // Ordenação
        filteredHistory.sort((a, b) => {
            let comparison = 0;

            if (filters.sortBy === 'timestamp') {
                comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            } else if (filters.sortBy === 'country') {
                comparison = a.queryParams.country.localeCompare(b.queryParams.country);
            } else if (filters.sortBy === 'category') {
                comparison = a.queryParams.category.localeCompare(b.queryParams.category);
            }

            return filters.sortDirection === 'asc' ? comparison : -comparison;
        });

        // Paginação
        const totalItems = filteredHistory.length;
        const totalPages = Math.ceil(totalItems / filters.pageSize!);
        const startIndex = (filters.page! - 1) * filters.pageSize!;
        const paginatedHistory = filteredHistory.slice(
            startIndex,
            startIndex + filters.pageSize!
        );

        return NextResponse.json({
            success: true,
            data: paginatedHistory,
            pagination: {
                total: totalItems,
                page: filters.page,
                pageSize: filters.pageSize,
                totalPages
            }
        });
    } catch (error) {
        console.error("Erro ao obter histórico de buscas:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Erro ao obter histórico de buscas"
            },
            { status: 500 }
        );
    }
}

// POST /api/history - Registrar nova busca no histórico
export async function POST(req: NextRequest) {
    try {
        const userId = getUserId(req);
        const requestData = await req.json();

        const newHistoryItem: SearchHistoryItem = {
            id: uuidv4(),
            userId,
            timestamp: new Date().toISOString(),
            queryParams: {
                country: requestData.queryParams.country || "Brasil",
                period: requestData.queryParams.period || "Últimas 24 horas",
                category: requestData.queryParams.category || "Todas as categorias",
                sort: requestData.queryParams.sort || "Por relevância"
            },
            resultsCount: requestData.resultsCount || 0,
            topResults: requestData.topResults || [],
            status: requestData.status || "success",
            source: requestData.source || "web",
            device: requestData.device,
            ip: requestData.ip
        };

        // Obter histórico existente ou criar novo array
        const userHistory = searchHistoryStore.get(userId) || [];

        // Adicionar novo item
        userHistory.unshift(newHistoryItem); // Adicionar no início do array

        // Limitar o histórico a 100 itens
        if (userHistory.length > 100) {
            userHistory.pop(); // Remover o item mais antigo
        }

        // Salvar histórico atualizado
        searchHistoryStore.set(userId, userHistory);

        return NextResponse.json({
            success: true,
            data: newHistoryItem
        });
    } catch (error) {
        console.error("Erro ao registrar busca no histórico:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Erro ao registrar busca no histórico"
            },
            { status: 500 }
        );
    }
}

// DELETE /api/history/:id - Excluir item do histórico
export async function DELETE(req: NextRequest) {
    try {
        const userId = getUserId(req);
        const url = new URL(req.url);
        const path = url.pathname.split('/');
        const itemId = path[path.length - 1];

        if (!itemId || itemId === 'history') {
            return NextResponse.json(
                {
                    success: false,
                    error: "ID do item não fornecido"
                },
                { status: 400 }
            );
        }

        // Obter histórico do usuário
        const userHistory = searchHistoryStore.get(userId) || [];

        // Encontrar índice do item
        const itemIndex = userHistory.findIndex(item => item.id === itemId);

        if (itemIndex === -1) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Item não encontrado no histórico"
                },
                { status: 404 }
            );
        }

        // Remover item
        userHistory.splice(itemIndex, 1);

        // Salvar histórico atualizado
        searchHistoryStore.set(userId, userHistory);

        return NextResponse.json({
            success: true,
            message: "Item removido com sucesso do histórico"
        });
    } catch (error) {
        console.error("Erro ao excluir item do histórico:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Erro ao excluir item do histórico"
            },
            { status: 500 }
        );
    }
}

// DELETE /api/history - Limpar todo o histórico
export async function DELETEALL(req: NextRequest) {
    try {
        const userId = getUserId(req);

        // Limpar histórico do usuário
        searchHistoryStore.set(userId, []);

        return NextResponse.json({
            success: true,
            message: "Histórico limpo com sucesso"
        });
    } catch (error) {
        console.error("Erro ao limpar histórico:", error);
        return NextResponse.json(
            {
                success: false,
                error: "Erro ao limpar histórico"
            },
            { status: 500 }
        );
    }
} 