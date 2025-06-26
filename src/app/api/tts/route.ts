import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { text, voice } = await req.json()

    if (!text || !voice) {
      return new Response('Text and voice are required', { status: 400 })
    }

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice,
      input: text,
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())

    return new Response(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="roteiro-audio.mp3"',
      },
    })

  } catch (error) {
    console.error('Erro no TTS:', error)
    return new Response('Erro interno do servidor', { status: 500 })
  }
} 