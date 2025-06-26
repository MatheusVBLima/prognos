import { NextResponse } from "next/server";
import { data } from "@/data/data";

// Função auxiliar para aplicar ordenação
function applySorting(data: any[], sortOption: string) {
    let sortedData = [...data];

    if (sortOption === "Ordem alfabética") {
        sortedData.sort((a, b) => a.term.localeCompare(b.term));
    } else if (sortOption === "Por volume de pesquisa") {
        sortedData.sort((a, b) => b.value - a.value);
    } else if (sortOption === "Crescente") {
        sortedData.sort((a, b) => a.value - b.value);
    } else if (sortOption === "Decrescente") {
        sortedData.sort((a, b) => b.value - a.value);
    }

    return sortedData;
} 

// Função para converter search_volume em número
function parseSearchVolume(volume: string): number {
    const cleanVolume = volume.toLowerCase().replace(/\s/g, '').replace('+', '');
    const multiplier = cleanVolume.slice(-1);
    
    let num = parseFloat(cleanVolume);

    if (multiplier === 'k') {
        num = parseFloat(cleanVolume.slice(0, -1)) * 1000;
    } else if (multiplier === 'm') {
        num = parseFloat(cleanVolume.slice(0, -1)) * 1000000;
    }

    return isNaN(num) ? 0 : num;
}

// Função para converter dados estáticos no formato esperado
function convertStaticDataToTrends() {
    const googleTrendsData = data.google_trends_brazil_top_10;
    
    return googleTrendsData.top_trending_searches.map((item) => ({
        term: item.search_term,
        value: parseSearchVolume(item.search_volume),
        timestamp: new Date().toISOString(),
        rank: item.rank,
        description: item.description,
        hint: item.hint,
        percentage_increase: item.percentage_increase,
        time_started: item.time_started
    }));
}

export async function GET(request: Request) {
    console.log(`[API /trends] Recebida requisição GET: ${request.url}`);
    
    try {
        // Obter parâmetros da URL
        const url = new URL(request.url);
        const country = url.searchParams.get('country') || 'Brasil';
        const period = url.searchParams.get('period') || 'Últimas 24 horas';
        const category = url.searchParams.get('category') || 'Todas as categorias';
        const sortOption = url.searchParams.get('sort') || 'Por relevância';

        console.log(`[API /trends] Parâmetros: country=${country}, period=${period}, category=${category}, sort=${sortOption}`);

        // Converter dados estáticos para o formato esperado
        const trends = convertStaticDataToTrends();
        
        // Aplicar filtros básicos (simulação)
        let filteredTrends = trends;
        
        // Simular filtro por categoria (manter todos por enquanto)
        if (category !== 'Todas as categorias') {
            // Para uma implementação futura, poderia filtrar por categoria
            console.log(`[API /trends] Filtro por categoria '${category}' aplicado (simulado)`);
        }
        
        // Aplicar ordenação
        const sortedTrends = applySorting(filteredTrends, sortOption);

        console.log(`[API /trends] Retornando ${sortedTrends.length} tendências dos dados estáticos`);

        return NextResponse.json({
            data: sortedTrends,
            message: "Tendências obtidas dos dados estáticos",
            filters: { country, period, category, sort: sortOption },
            cached: false,
            source: "static_data",
            extraction_date: data.google_trends_brazil_top_10.extraction_date,
            data_source: data.google_trends_brazil_top_10.source
        });

    } catch (error) {
        console.error("[API /trends] Erro na rota GET:", error);
        
        return NextResponse.json({
            error: "Erro interno do servidor",
            userMessage: "Houve um erro ao carregar as tendências. Tente novamente mais tarde.",
        }, { status: 500 });
    }
}