import { GoogleGenerativeAI } from '@google/generative-ai'
import { streamText } from 'ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function POST(req: Request) {
  try {
    const { trend, tone, rank, volume, description, hints } = await req.json()

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Formatando as hints para o prompt
    const hintsText = hints && hints.length > 0 
      ? hints.map((hint: string, index: number) => `${index + 1}. ${hint}`).join('\n')
      : 'Nenhuma informação adicional disponível'

    const prompt = `
Crie um roteiro de vídeo para TikTok sobre a tendência "${trend}".

CONTEXTO DA TENDÊNCIA:
${description}

INFORMAÇÕES ESPECÍFICAS:
${hintsText}

CONFIGURAÇÕES DO ROTEIRO:
- Posição no ranking: #${rank}
- Volume de pesquisas: ${volume}+
- Tom desejado: ${tone}

INSTRUÇÕES IMPORTANTES:
1. Use ESPECIFICAMENTE as informações listadas acima nas "INFORMAÇÕES ESPECÍFICAS"
2. O roteiro deve ter entre 30-60 segundos (ideal para TikTok)
3. Use o tom ${tone} solicitado
4. Seja criativo e engajante, mas baseie-se nos FATOS fornecidos
5. Inclua ganchos para prender a atenção nos primeiros 3 segundos
6. Use linguagem casual e direta
7. Adicione elementos visuais sugeridos entre [colchetes]
8. Estruture em cenas curtas e dinâmicas
9. IMPORTANTE: Não invente informações, use apenas os dados fornecidos

FORMATO DO ROTEIRO:
**GANCHO (0-3s):**
[Descrição visual]
Texto/narração baseado nas informações específicas...

**DESENVOLVIMENTO (3-45s):**
[Descrição visual]
Texto/narração explorando os pontos das informações específicas...

**CALL TO ACTION (45-60s):**
[Descrição visual]
Texto/narração final relacionado ao assunto...

Gere um roteiro completo seguindo essas diretrizes:
`

    const result = await model.generateContentStream(prompt)
    
    // Converter o stream do Gemini para o formato do AI SDK
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text()
            if (text) {
              controller.enqueue(new TextEncoder().encode(text))
            }
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    })

  } catch (error) {
    console.error('Erro na API:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
} 