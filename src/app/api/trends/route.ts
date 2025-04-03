import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { getCache, setCache } from "@/lib/cache";

// Variáveis para controle de rate limiting
const MIN_REQUEST_INTERVAL = 60000; // 1 minuto entre requisições
let lastRequestTime = 0;
let consecutiveErrors = 0;
const MAX_RETRY_COUNT = 3;

export async function GET(request: Request) {
    try {
        // Obter parâmetros da URL
        const url = new URL(request.url)
        const ignoreCache = url.searchParams.has('t')
        const country = url.searchParams.get('country') || 'Brasil'
        const period = url.searchParams.get('period') || 'Últimas 24 horas'
        const category = url.searchParams.get('category') || 'Todas as categorias'
        const sortOption = url.searchParams.get('sort') || 'Por relevância'

        // Forçar uso do cache por mais tempo
        const forceCache = url.searchParams.has('force_cache')

        // Criar uma chave de cache que inclui os parâmetros de filtro
        const cacheKey = `trends-${country}-${period}-${category}`.toLowerCase().replace(/\s+/g, '-')

        // Verificar cache primeiro (independente do parâmetro ignoreCache)
        const cached = getCache(cacheKey)
        if (cached) {
            console.log("Retornando dados do cache para:", cacheKey)

            // Se não estamos forçando uma atualização ou se estamos forçando o uso do cache
            if (!ignoreCache || forceCache) {
                // Aplicar ordenação aos dados do cache
                const sortedData = applySorting([...cached], sortOption)

                return NextResponse.json({
                    data: sortedData,
                    message: "Tendências obtidas do cache",
                    filters: { country, period, category, sort: sortOption },
                    cached: true
                })
            }
        }

        // Verificar o rate limiting
        const now = Date.now();
        const timeSinceLastRequest = now - lastRequestTime;

        // Calcular o tempo de espera baseado no número de erros consecutivos (exponencial backoff)
        const waitTime = Math.min(MIN_REQUEST_INTERVAL * Math.pow(2, consecutiveErrors), 600000); // Máximo de 10 minutos

        // Se ainda não passou tempo suficiente desde a última requisição
        if (timeSinceLastRequest < waitTime) {
            console.log(`Rate limiting aplicado. Aguardando ${Math.ceil((waitTime - timeSinceLastRequest) / 1000)} segundos.`);

            // Se temos cache, usar mesmo vencido
            if (cached) {
                const sortedData = applySorting([...cached], sortOption)
                return NextResponse.json({
                    data: sortedData,
                    message: "Rate limit atingido. Retornando dados do cache",
                    filters: { country, period, category, sort: sortOption },
                    cached: true,
                    rateLimit: true
                })
            }

            // Se não temos cache, retornar erro de rate limiting
            return NextResponse.json({
                error: "Limite de requisições atingido. Tente novamente mais tarde.",
                retryAfter: Math.ceil((waitTime - timeSinceLastRequest) / 1000),
                waitTime: Math.ceil(waitTime / 1000)
            }, { status: 429 })
        }

        // Atualizar o momento da última requisição
        lastRequestTime = now;

        console.log("Iniciando Puppeteer para buscar tendências com filtros:",
            { country, period, category })

        // Configurar o Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            timeout: 30000 // 30 segundos de timeout para iniciar o navegador
        })

        const page = await browser.newPage()

        // Configurar um user agent mais comum
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

        // Aumentar timeout de navegação e configurar viewport
        page.setDefaultNavigationTimeout(60000) // 60 segundos
        await page.setViewport({ width: 1280, height: 800 })

        // Mapear país para código do Google Trends
        let countryCode = "BR" // padrão: Brasil
        if (country === "Estados Unidos") countryCode = "US"
        else if (country === "Portugal") countryCode = "PT"
        else if (country === "Argentina") countryCode = "AR"
        else if (country === "Espanha") countryCode = "ES"
        else if (country === "México") countryCode = "MX"
        else if (country === "Colômbia") countryCode = "CO"
        else if (country === "Chile") countryCode = "CL"
        else if (country === "Peru") countryCode = "PE"

        // Mapear período para parâmetro de URL do Google Trends
        let periodParam = "24" // padrão: últimas 24 horas
        if (period === "Últimos 7 dias") periodParam = "7d"
        else if (period === "Último mês") periodParam = "30d"
        else if (period === "Últimos 3 meses") periodParam = "90d"
        else if (period === "Último ano") periodParam = "12m"
        else if (period === "Desde 2004") periodParam = "all"

        // Mapear categoria para códigos do Google Trends
        let categoryParam = "" // padrão: Todas as categorias
        if (category === "Compras") categoryParam = "&category=1"
        else if (category === "Notícias") categoryParam = "&category=7"
        else if (category === "Entretenimento") categoryParam = "&category=2"
        else if (category === "Esportes") categoryParam = "&category=3"
        else if (category === "Alimentos e bebidas") categoryParam = "&category=4"
        else if (category === "Viagens") categoryParam = "&category=5"
        else if (category === "Ciência") categoryParam = "&category=6"
        else if (category === "Finanças") categoryParam = "&category=8"
        else if (category === "Saúde") categoryParam = "&category=9"

        // Construir URL com os parâmetros
        let trendsUrl
        if (period === "Últimas 24 horas" || period === "Últimos 7 dias") {
            trendsUrl = `https://trends.google.com/trending?geo=${countryCode}&hl=pt-BR&hours=${periodParam}${categoryParam}`
        } else {
            // Fallback para o explore se o período for maior que 7 dias
            trendsUrl = `https://trends.google.com/trends/explore?date=${periodParam}&geo=${countryCode}&hl=pt-BR${categoryParam}`
        }

        console.log("Acessando URL:", trendsUrl)

        try {
            // Acessar página de tendências do Google Trends com parâmetros
            await page.goto(trendsUrl, {
                waitUntil: 'networkidle0',
                timeout: 30000
            })

            // Verificar se a página retornou erro 429
            const content = await page.content();
            if (content.includes('429') && (content.includes('Too Many Requests') || content.includes('many requests'))) {
                consecutiveErrors++;
                throw new Error('Google retornou erro 429: Too Many Requests');
            }

            // Esperar um tempo adicional para garantir que a página renderize
            await new Promise(resolve => setTimeout(resolve, 5000))

            // Tentar rolar a página para forçar o carregamento de todos os elementos
            await page.evaluate(() => {
                window.scrollBy(0, 500)
                return new Promise(resolve => setTimeout(resolve, 1000))
            })

            // Tomar screenshot para debug
            await page.screenshot({ path: 'trends-screenshot.png', fullPage: true })

            console.log("Extraindo tendências...")

            // Extrair as tendências diretamente da tabela de tendências
            const trends = await page.evaluate(() => {
                // Tentar primeiro com o seletor para a página de trending
                const trendItems = Array.from(document.querySelectorAll('div[role="listitem"]'));

                if (trendItems.length > 0) {
                    return trendItems.map((item, index) => {
                        const titleElement = item.querySelector('div[role="heading"]');
                        const trafficElement = item.querySelector('div[role="contentinfo"]');
                        const title = titleElement?.textContent?.trim() || `Tendência ${index + 1}`;

                        // Tenta extrair o número do texto de tráfego
                        let value = 100 - (index * 10); // Valor padrão
                        if (trafficElement) {
                            const trafficText = trafficElement.textContent || '';
                            const match = trafficText.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?)\s*[kmb]?[+]?/i);
                            if (match) {
                                let extractedValue = match[1].replace(/[^0-9]/g, "");
                                value = parseInt(extractedValue) || value;
                            }
                        }

                        return {
                            term: title,
                            timestamp: new Date().toISOString(),
                            value: value
                        };
                    });
                }

                // Alternativa: procurar por elementos na tabela de tendências da página explore
                const rows = document.querySelectorAll('tr[class*="row"]');

                if (rows && rows.length > 0) {
                    return Array.from(rows).slice(0, 10).map((row, index) => {
                        // Extrair o termo de pesquisa
                        const queryCell = row.querySelector('td');
                        const queryText = queryCell ? queryCell.textContent || '' : `Tendência ${index + 1}`;

                        // Extrair o volume de pesquisa (procurar um número no texto)
                        const volumeCell = row.querySelector('td:nth-child(2)');
                        const volumeText = volumeCell ? volumeCell.textContent || '' : '';

                        let value = 100 - (index * 10); // Valor padrão decrescente

                        // Tentar extrair um número do texto do volume
                        const volumeMatch = volumeText.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?)\s*[kmb]?[+]?/i);
                        if (volumeMatch) {
                            let extractedValue = volumeMatch[1].replace(/[^0-9]/g, "");
                            value = parseInt(extractedValue) || value;
                        }

                        return {
                            term: queryText.trim(),
                            timestamp: new Date().toISOString(),
                            value: value
                        };
                    });
                }

                // Último fallback: tentar links
                return Array.from(document.querySelectorAll('a[href*="trends/explore"]')).map((link, index) => {
                    const text = link.textContent || `Tendência ${index + 1}`;

                    // Tentar encontrar um número próximo (volume de pesquisa)
                    let value = 100 - (index * 10); // Valor padrão decrescente
                    const parentElement = link.parentElement;
                    if (parentElement) {
                        const volumeText = parentElement.textContent || '';
                        const volumeMatch = volumeText.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?)\s*[kmb]?[+]?/i);
                        if (volumeMatch) {
                            let extractedValue = volumeMatch[1].replace(/[^0-9]/g, "");
                            value = parseInt(extractedValue) || value;
                        }
                    }

                    return {
                        term: text.trim(),
                        timestamp: new Date().toISOString(),
                        value: value
                    };
                });
            });

            // Se não encontrou tendências, tentar uma abordagem alternativa
            if (!trends || trends.length === 0) {
                console.log("Tentando abordagem alternativa para extrair tendências...");

                // Navegar para a página de tendências diárias (outro formato)
                await page.goto(`https://trends.google.com/trends/trendingsearches/daily?geo=${countryCode}&hl=pt-BR`, {
                    waitUntil: 'networkidle0',
                    timeout: 30000
                });

                // Esperar elementos carregarem
                await new Promise(resolve => setTimeout(resolve, 5000));

                // Extrair tendências da página de tendências diárias
                const dailyTrends = await page.evaluate(() => {
                    // Tentar encontrar os itens de tendência
                    const items = document.querySelectorAll('div[class*="feed-item"], div[class*="list-item"]');

                    if (!items || items.length === 0) {
                        return [];
                    }

                    return Array.from(items).slice(0, 10).map((item, index) => {
                        // Tentar extrair o título e o volume
                        const titleEl = item.querySelector('div[class*="title"], span[class*="title"]');
                        const title = titleEl ? titleEl.textContent : `Tendência ${index + 1}`;

                        // Tentar extrair o volume de pesquisa
                        const trafficEl = item.querySelector('div[class*="traffic"], span[class*="traffic"]');
                        let value = 100 - (index * 10); // Valor padrão

                        if (trafficEl && trafficEl.textContent) {
                            const trafficText = trafficEl.textContent;
                            const match = trafficText.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?)\s*[kmb]?[+]?/i);
                            if (match) {
                                let extractedValue = match[1].replace(/[^0-9]/g, "");
                                value = parseInt(extractedValue) || value;
                            }
                        }

                        return {
                            term: title ? title.trim() : `Tendência ${index + 1}`,
                            timestamp: new Date().toISOString(),
                            value: value
                        };
                    });
                });

                // Usar resultados da abordagem alternativa se encontrou algo
                if (dailyTrends && dailyTrends.length > 0) {
                    await browser.close();
                    console.log("Encontradas", dailyTrends.length, "tendências na abordagem alternativa");

                    // Processar dados para garantir formato consistente
                    const processedTrends = dailyTrends.map((item: any) => ({
                        term: String(item.term || "Tendência"),
                        timestamp: item.timestamp || new Date().toISOString(),
                        value: Number(item.value || 0)
                    }));

                    // Salvar no cache
                    setCache(cacheKey, processedTrends);

                    // Aplicar ordenação
                    const sortedTrends = applySorting(processedTrends, sortOption);

                    // Reiniciar o contador de erros consecutivos
                    consecutiveErrors = 0;

                    return NextResponse.json({
                        data: sortedTrends,
                        message: "Tendências obtidas com sucesso (abordagem alternativa)",
                        filters: { country, period, category, sort: sortOption }
                    });
                }
            }

            await browser.close();
            console.log("Encontradas", trends.length, "tendências");

            // Processar os dados para garantir formato consistente
            let processedTrends = trends.map((item: any) => ({
                term: String(item.term || "Tendência"),
                timestamp: item.timestamp || new Date().toISOString(),
                value: Number(item.value || 0)
            }));

            // Aplicar ordenação
            processedTrends = applySorting(processedTrends, sortOption)

            // Salvar no cache com a chave baseada nos filtros
            setCache(cacheKey, processedTrends);

            // Reiniciar o contador de erros consecutivos
            consecutiveErrors = 0;

            return NextResponse.json({
                data: processedTrends,
                message: "Tendências obtidas com sucesso",
                filters: { country, period, category, sort: sortOption }
            });

        } catch (error) {
            await browser.close();

            // Se o erro for 429, incrementar consecutiveErrors e responder adequadamente
            if (error instanceof Error && error.message.includes('429')) {
                console.error("Erro 429 (Too Many Requests) recebido do Google Trends");
                consecutiveErrors++;

                // Se temos dados em cache, retorná-los mesmo que estejam "vencidos"
                if (cached) {
                    const sortedData = applySorting([...cached], sortOption)
                    return NextResponse.json({
                        data: sortedData,
                        message: "Dados em cache devido a limite de requisições",
                        userMessage: "Estamos usando dados em cache porque o Google Trends limitou nossas requisições. Os dados podem não estar atualizados.",
                        filters: { country, period, category, sort: sortOption },
                        cached: true,
                        rateLimit: true
                    })
                }

                // Se não temos cache, retornar erro com tempo de espera sugerido
                const waitTime = MIN_REQUEST_INTERVAL * Math.pow(2, consecutiveErrors);
                return NextResponse.json({
                    error: "Erro 429: Muitas requisições. Tente novamente mais tarde.",
                    details: "O Google Trends está limitando as requisições. Tente novamente após um tempo.",
                    userMessage: `O Google Trends está limitando nossas requisições. Por favor, tente novamente em ${Math.ceil(waitTime / 60000)} minutos.`,
                    retryAfter: Math.ceil(waitTime / 1000)
                }, { status: 429 })
            }

            // Para outros erros, propagar normalmente
            throw error;
        }

    } catch (error) {
        console.error("Erro ao buscar tendências:", error);

        // Verificar se temos dados em cache para retornar como fallback
        const url = new URL(request.url);
        const country = url.searchParams.get('country') || 'Brasil';
        const period = url.searchParams.get('period') || 'Últimas 24 horas';
        const category = url.searchParams.get('category') || 'Todas as categorias';
        const sortOption = url.searchParams.get('sort') || 'Por relevância';

        const cacheKey = `trends-${country}-${period}-${category}`.toLowerCase().replace(/\s+/g, '-');
        const cached = getCache(cacheKey);

        if (cached) {
            console.log("Erro ao buscar dados atualizados. Retornando dados do cache para:", cacheKey);
            const sortedData = applySorting([...cached], sortOption);

            return NextResponse.json({
                data: sortedData,
                message: "Erro na busca. Usando dados em cache.",
                userMessage: "Não foi possível buscar dados atualizados. Estamos mostrando dados armazenados em cache.",
                filters: { country, period, category, sort: sortOption },
                cached: true,
                error: error instanceof Error ? error.message : "Erro desconhecido"
            });
        }

        // Mensagens amigáveis para erros comuns
        let userMessage = "Houve um erro ao consultar as tendências. Tente novamente mais tarde.";

        if (error instanceof Error) {
            if (error.message.includes('ETIMEDOUT') || error.message.includes('timeout')) {
                userMessage = "Tempo limite excedido ao consultar o Google Trends. A conexão pode estar instável.";
            } else if (error.message.includes('403')) {
                userMessage = "O acesso ao Google Trends foi bloqueado. Tente novamente em alguns minutos.";
            } else if (error.message.includes('blocked')) {
                userMessage = "Seu endereço IP pode ter sido temporariamente bloqueado pelo Google Trends. Tente novamente mais tarde.";
            }
        }

        return NextResponse.json(
            {
                error: "Erro ao buscar tendências",
                details: error instanceof Error ? error.message : String(error),
                userMessage
            },
            { status: 500 }
        );
    }
}

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