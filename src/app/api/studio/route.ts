import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { streamText } from 'ai'
import { getCurrentUser } from '@/lib/auth'
import { getBrandKit } from '@/lib/brand/queries'
import { listProjects } from '@/lib/projects/queries'
import { pickActiveProject } from '@/lib/projects/active'
import { LANGUAGES } from '@/lib/projects/schema'

const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY })

// What the script should sound like, from the active project and its brand kit
async function brandContext() {
  const project = await pickActiveProject(await listProjects())
  if (!project) return { language: 'English', text: '' }

  const kit = await getBrandKit(project.id)
  const language = LANGUAGES.find((l) => l.value === project.language)?.label ?? 'English'
  const lines = [
    `Creator / brand: ${project.name}`,
    `About: ${project.description}`,
    project.niche && `Niche: ${project.niche}`,
    (kit?.audience_summary ?? project.audience) && `Audience: ${kit?.audience_summary ?? project.audience}`,
    kit?.value_proposition && `Value proposition: ${kit.value_proposition}`,
    kit?.tone_of_voice && `Tone of voice: ${kit.tone_of_voice}`,
    kit?.voice_traits.length && `Personality: ${kit.voice_traits.join(', ')}`,
    kit?.keywords.length && `Topics they own: ${kit.keywords.join(', ')}`,
  ].filter(Boolean)

  return { language, text: lines.join('\n') }
}

export async function POST(req: Request) {
  if (!(await getCurrentUser())) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { trend, tone, rank, volume, description, hints } = await req.json()

    const hintsText = hints && hints.length > 0
      ? hints.map((hint: string, index: number) => `${index + 1}. ${hint}`).join('\n')
      : 'No additional information available'

    const brand = await brandContext()

    const prompt = `
Write a TikTok video script about the trend "${trend}".
${brand.text ? `
WHO IS POSTING (connect the trend to them naturally and match their voice):
${brand.text}
` : ''}
TREND CONTEXT:
${description}

SPECIFIC FACTS:
${hintsText}

SCRIPT SETTINGS:
- Ranking position: #${rank}
- Search volume: ${volume}+
- Desired tone: ${tone}

IMPORTANT INSTRUCTIONS:
1. Use the facts listed under "SPECIFIC FACTS"
2. The script should run 30-60 seconds (ideal for TikTok)
3. Use the requested tone: ${tone}
4. Be creative and engaging, but stay grounded in the facts provided
5. Hook the viewer in the first 3 seconds
6. Use casual, direct language
7. Add suggested visuals in [brackets]
8. Structure it as short, dynamic scenes
9. Do not invent information; only use the data provided
10. REQUIRED FORMAT: always prefix text to be read aloud with "Narration:". Anything that is not narrated (such as on-screen text) must use a different marker, like "On-screen text:".
11. Write the narration and on-screen text in ${brand.language}; keep the section labels and the "Narration:" / "On-screen text:" markers in English

SCRIPT FORMAT:
**HOOK (0-3s):**
[Visual description]
Narration: ...

**BODY (3-45s):**
[Visual description]
Narration: ...

**CALL TO ACTION (45-60s):**
[Visual description]
Narration: ...

Write the complete script following these guidelines:
`

    const result = streamText({
      model: google('gemini-flash-latest'),
      prompt,
    })

    return result.toTextStreamResponse()

  } catch (error) {
    console.error('[api/studio] Failed to generate script:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
} 