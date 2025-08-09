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
        const useBrowserbase = url.searchParams.get('browserbase') === 'true';

        console.log(`[API /trends] Parâmetros: country=${country}, period=${period}, category=${category}, sort=${sortOption}, browserbase=${useBrowserbase}`);

        // Se browserbase estiver habilitado, chamar a API de scraping
        if (useBrowserbase) {
            try {
                console.log(`[API /trends] Usando Browserbase para scraping`);
                
                const scrapeResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/trends/scrape`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ country, period, category }),
                });

                if (scrapeResponse.ok) {
                    const scrapeData = await scrapeResponse.json();
                    
                    if (scrapeData.success) {
                        // Transformar dados do scraping para o formato esperado
                        const trendsData = scrapeData.data.map((trend: any) => ({
                            term: trend.search_term,
                            value: parseSearchVolume(trend.search_volume),
                            timestamp: new Date().toISOString(),
                            rank: trend.rank,
                            description: trend.description,
                            hint: trend.hint,
                            percentage_increase: trend.percentage_increase,
                            time_started: trend.time_started
                        }));

                        // Aplicar ordenação
                        const sortedTrends = applySorting(trendsData, sortOption);

                        console.log(`[API /trends] Retornando ${sortedTrends.length} tendências do Browserbase`);

                        return NextResponse.json({
                            data: sortedTrends,
                            message: "Tendências obtidas via Browserbase (dados reais)",
                            filters: { country, period, category, sort: sortOption },
                            cached: false,
                            source: "browserbase_scraping",
                            extraction_date: scrapeData.metadata.extraction_date,
                            data_source: `Google Trends ${country}`,
                            metadata: scrapeData.metadata
                        });
                    }
                }
                
                console.log(`[API /trends] Erro no scraping, usando dados estáticos como fallback`);
            } catch (error) {
                console.error('[API /trends] Erro ao chamar API de scraping:', error);
                console.log(`[API /trends] Usando dados estáticos como fallback`);
            }
        }

        // Converter dados estáticos para o formato esperado (fallback ou quando browserbase não está habilitado)
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
            message: useBrowserbase 
                ? "Fallback para dados estáticos (erro no Browserbase)" 
                : "Tendências obtidas dos dados estáticos",
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