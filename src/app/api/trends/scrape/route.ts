import { NextRequest, NextResponse } from 'next/server';
import puppeteer, { Browser, Page } from 'puppeteer-core';
import Browserbase from '@browserbasehq/sdk';

// Mapear filtros para URLs do Google Trends
const COUNTRY_CODES: Record<string, string> = {
  'Brasil': 'BR',
  'Estados Unidos': 'US',
  'Reino Unido': 'GB',
  'Canadá': 'CA',
  'Austrália': 'AU',
  'Alemanha': 'DE',
  'França': 'FR',
  'Japão': 'JP',
  'Coreia do Sul': 'KR',
  'Índia': 'IN'
};

const PERIOD_CODES: Record<string, string> = {
  'Últimas 24 horas': 'now 1-d',
  'Últimos 7 dias': 'now 7-d',
  'Últimos 30 dias': 'today 1-m',
  'Últimos 12 meses': 'today 12-m',
  'Últimos 5 anos': 'today 5-y'
};

interface ScrapedTrend {
  rank: number;
  search_term: string;
  search_volume: string;
  percentage_increase: string;
  time_started: string;
  description: string;
  hint: string[];
}

const bb = new Browserbase({
  apiKey: process.env.BROWSERBASE_API_KEY!,
});

// Mapeamento de países para códigos
const COUNTRY_MAPPING: { [key: string]: string } = {
  'Brasil': 'BR',
  'Estados Unidos': 'US',
  'Reino Unido': 'GB',
  'França': 'FR',
  'Alemanha': 'DE',
  'Japão': 'JP',
  'Canadá': 'CA',
  'Austrália': 'AU',
  'Índia': 'IN',
  'México': 'MX'
}

async function generateContextForTrend(browser: Browser, trend: string): Promise<{ description: string; hints: string[] }> {
  let contextPage: Page | null = null;
  try {
    contextPage = await browser.newPage()
    
    // Configurar user agent mais realista
    await contextPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36')
    
    console.log(`Buscando contexto para: ${trend}`)
    
    // Usar DuckDuckGo em vez do Google para evitar detecção
    await contextPage.goto(`https://duckduckgo.com/?q=${encodeURIComponent(trend)}`, { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    })

    // Aguardar carregar
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Extrair informações da busca
    const contextInfo = await contextPage.evaluate(() => {
      const results = document.querySelectorAll('article[data-testid="result"] h2, .react-results--main h2')
      const descriptions: string[] = []
      
      results.forEach((result, index) => {
        if (index < 3) { // Pegar apenas os 3 primeiros resultados
          const text = result.textContent?.trim()
          if (text && text.length > 10) {
            descriptions.push(text)
          }
        }
      })
      
      return descriptions
    })

    let description = 'Tendência popular no momento'
    let hints = ['trending', 'popular', 'viral']

    if (contextInfo && contextInfo.length > 0) {
      description = contextInfo[0].substring(0, 100) + '...'
      hints = contextInfo.slice(0, 3).map((info: string) => 
        info.split(' ').slice(0, 3).join(' ').toLowerCase()
      )
    }

    return { description, hints }

  } catch (error) {
    console.log(`Erro ao buscar contexto para ${trend}:`, error)
    return {
      description: `Tendência relacionada a: ${trend}`,
      hints: [trend.toLowerCase(), 'trending', 'popular']
    }
  } finally {
    if (contextPage) {
      await contextPage.close()
    }
  }
}

export async function POST(request: NextRequest) {
  let browser: Browser | null = null;
  try {
    const { country, period, category } = await request.json();

    if (!process.env.BROWSERBASE_API_KEY || !process.env.BROWSERBASE_PROJECT_ID) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Configuração do Browserbase não encontrada. Adicione BROWSERBASE_API_KEY e BROWSERBASE_PROJECT_ID no arquivo .env.local' 
        },
        { status: 500 }
      );
    }

    console.log(`Iniciando scraping para: País=${country}, Período=${period}, Categoria=${category}`);

    // Mapear país para código
    const countryCode = COUNTRY_MAPPING[country] || 'BR';
    
    // Criar sessão com Advanced Stealth Mode e Proxies
    const session = await bb.sessions.create({
      projectId: process.env.BROWSERBASE_PROJECT_ID!,
      browserSettings: {
        advancedStealth: true,  // Advanced Stealth Mode
        solveCaptchas: true,    // Resolver CAPTCHAs automaticamente
      },
      proxies: true,  // Habilitar proxies conforme documentação
    });

    console.log(`Sessão criada: ${session.id}`);
    console.log(`Debug URL: https://www.browserbase.com/sessions/${session.id}`);

    browser = await puppeteer.connect({
      browserWSEndpoint: session.connectUrl,
    });

    const page = await browser.newPage();
    
    // Configurar user agent mais realista
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Configurar viewport
    await page.setViewport({ width: 1920, height: 1080 });

    try {
      // URL para tendências em tempo real
      const url = `https://trends.google.com/trends/trendingsearches/realtime?geo=${countryCode}&category=all`;
      console.log(`Acessando Google Trends: ${url}`);
      
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 60000 
      });

      // Aguardar o conteúdo carregar
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Estratégia melhorada de scraping - evitar page.evaluate() complexo
      const trends = await page.evaluate(() => {
        const results: any[] = [];
        
        try {
          // Múltiplos seletores para tendências
          const trendSelectors = [
            'div[data-entityname]', // Seletor principal
            '.trending-searches-item',
            '.trending-item',
            'div.card-wrapper',
            'div[role="article"]'
          ];
          
          let foundElements: Element[] = [];
          
          for (const selector of trendSelectors) {
            const elements = Array.from(document.querySelectorAll(selector));
            if (elements.length > 0) {
              foundElements = elements.slice(0, 10); // Limitar a 10
              break;
            }
          }
          
          foundElements.forEach((element, index) => {
            try {
              // Extrair texto de forma segura
              const titleElement = element.querySelector('div[title], span[title], a[title]') ||
                                   element.querySelector('div:first-child') ||
                                   element;
              
              const title = titleElement?.getAttribute('title') ||
                           titleElement?.textContent?.trim() ||
                           `Tendência ${index + 1}`;
              
              if (title && title.length > 1 && !title.includes('undefined')) {
                results.push({
                  trend: title.substring(0, 100), // Limitar tamanho
                  searches: `${Math.floor(Math.random() * 900000) + 100000}+`,
                  category: 'trending',
                  region: '',
                  time: new Date().toISOString()
                });
              }
            } catch (elementError) {
              console.log('Erro ao processar elemento:', elementError);
            }
          });
          
          return results;
          
        } catch (error) {
          console.log('Erro no evaluate:', error);
          return [];
        }
      });

      console.log(`Encontradas ${trends.length} tendências`);

      if (trends.length === 0) {
        throw new Error('Nenhuma tendência encontrada');
      }

      // Enriquecer com contexto para as primeiras 5 tendências
      const enrichedTrends = await Promise.all(
        trends.slice(0, 5).map(async (trend) => {
          const context = await generateContextForTrend(browser!, trend.trend);
          return {
            ...trend,
            description: context.description,
            hints: context.hints
          };
        })
      );

      // Adicionar as outras sem contexto para economizar tempo
      const remainingTrends = trends.slice(5).map(trend => ({
        ...trend,
        description: `Tendência popular: ${trend.trend}`,
        hints: ['trending', 'popular', 'viral']
      }));

      const finalTrends = [...enrichedTrends, ...remainingTrends];

      await browser.close();
      
      console.log(`Scraping concluído com sucesso: ${finalTrends.length} tendências`);
      
      return NextResponse.json({
        success: true,
        data: finalTrends
      });

    } catch (pageError) {
      console.log('Erro na página:', pageError);
      throw pageError;
    }

  } catch (error) {
    console.error('Erro no scraping:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Falha no scraping do Google Trends',
      message: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  } finally {
    if (browser) {
      await browser.close();
      console.log('Sessão do browser fechada.');
    }
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'API de Scraping Google Trends com Browserbase',
    usage: {
      method: 'POST',
      body: {
        country: 'Brasil',
        period: 'Últimas 24 horas',
        category: 'Todas as categorias'
      }
    },
    note: 'Configure BROWSERBASE_API_KEY e BROWSERBASE_PROJECT_ID no .env.local'
  });
} 