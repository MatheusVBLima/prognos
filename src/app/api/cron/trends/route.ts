import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';
import { ScrapingResult } from '@/types/trends';
import { cacheService } from '@/lib/cache';

// Constantes
const GOOGLE_TRENDS_URL = 'https://trends.google.com/trending?geo=BR&hl=pt-BR&hours=24';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

// Função auxiliar para delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeTrends(): Promise<ScrapingResult> {
    let retries = 0;

    while (retries < MAX_RETRIES) {
        const browser = await puppeteer.launch({
            headless: true,
        });

        try {
            const page = await browser.newPage();

            // Configurações básicas
            await page.setViewport({ width: 1280, height: 800 });
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

            // Navega para a página
            await page.goto(GOOGLE_TRENDS_URL, {
                waitUntil: 'networkidle0',
                timeout: 30000,
            });

            // Aguarda um pouco para garantir que o conteúdo carregou
            await delay(2000);

            // Coleta os dados
            const trends = await page.evaluate(() => {
                // Aqui vamos pegar todos os itens da lista de tendências
                const trendItems = Array.from(document.querySelectorAll('div[role="listitem"]'));

                return trendItems.map(item => {
                    const titleElement = item.querySelector('div[role="heading"]');
                    const trafficElement = item.querySelector('div[role="contentinfo"]');
                    const trafficText = trafficElement?.textContent?.trim();

                    // Tenta extrair o número do texto de tráfego
                    let traffic: number | undefined = undefined;
                    if (trafficText) {
                        const match = trafficText.match(/\d+/);
                        if (match) {
                            traffic = parseInt(match[0], 10);
                        }
                    }

                    return {
                        title: titleElement?.textContent?.trim() || '',
                        traffic,
                        relatedQueries: [], // Inicialmente vazio, podemos implementar depois
                    };
                });
            });

            const result = {
                success: true,
                data: trends,
                timestamp: new Date().toISOString(),
            };

            // Salva no cache
            await cacheService.set(result);

            return result;

        } catch (error) {
            retries++;
            console.error(`Tentativa ${retries} falhou:`, error);

            if (retries === MAX_RETRIES) {
                return {
                    success: false,
                    error: error instanceof Error ? error.message : 'Erro desconhecido',
                    timestamp: new Date().toISOString(),
                };
            }

            await delay(RETRY_DELAY * retries); // Delay exponencial
        } finally {
            await browser.close();
        }
    }

    return {
        success: false,
        error: 'Número máximo de tentativas excedido',
        timestamp: new Date().toISOString(),
    };
}

export async function GET(request: Request) {
    try {
        // Verifica se é uma requisição forçada
        const { searchParams } = new URL(request.url);
        const forceUpdate = searchParams.get('force') === 'true';

        if (!forceUpdate) {
            // Tenta pegar do cache primeiro
            const cachedData = await cacheService.get();
            if (cachedData) {
                return NextResponse.json(cachedData);
            }
        }

        // Se não tem cache ou é forçado, faz o scraping
        const result = await scrapeTrends();

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        return NextResponse.json(result);

    } catch (error) {
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        );
    }
} 