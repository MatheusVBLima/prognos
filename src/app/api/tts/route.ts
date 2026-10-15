import OpenAI from 'openai'


export async function POST(req: Request) {
  try {
    const { text, voice } = await req.json()

    if (!text || !voice) {
      return new Response('Text and voice are required', { status: 400 })
    }

    // Created per request so builds don't require the API key
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice,
      input: text,
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())

    return new Response(buffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': 'attachment; filename="script-audio.mp3"',
      },
    })

  } catch (error) {
    console.error('[api/tts] Failed to generate audio:', error)
    return new Response('Internal server error', { status: 500 })
  }
} 