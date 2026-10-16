import "server-only"
import { generateText, Output, type LanguageModel } from "ai"
import { z } from "zod"
import { defaultModel } from "@/lib/brand/ai"
import type { BrandKit } from "@/lib/brand/queries"
import type { Project } from "@/lib/projects/queries"
import { LANGUAGES } from "@/lib/projects/schema"
import type { InterestPoint, Signal } from "@/lib/trends/sources"

export const PLATFORMS = ["instagram", "tiktok", "youtube", "x"] as const
export const FORMATS = ["reel", "short", "carousel", "post", "youtube_video", "thread"] as const

export type Evidence = { type: "query" | "video" | "article"; label: string; url?: string; metric?: string }

function describe(project: Project, kit: BrandKit | null) {
  return [
    `Name: ${project.name}`,
    `About: ${project.description}`,
    project.niche && `Niche: ${project.niche}`,
    (kit?.audience_summary ?? project.audience) && `Audience: ${kit?.audience_summary ?? project.audience}`,
    project.goals && `Goals: ${project.goals}`,
    project.country && `Market: ${project.country}`,
    kit?.keywords.length && `Brand topics: ${kit.keywords.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n")
}

const languageName = (code: string) => LANGUAGES.find((l) => l.value === code)?.label ?? "English"

export async function suggestKeywords(project: Project, kit: BrandKit | null, model: LanguageModel = defaultModel()) {
  const { output } = await generateText({
    model,
    output: Output.object({
      schema: z.object({ keywords: z.array(z.string()).describe("6 search terms, 1 to 3 words each") }),
    }),
    prompt: `Pick the 6 search terms that best capture what this project's audience searches for and watches. They will be tracked on Google Trends and YouTube, so use short, popular phrasing people actually type (1 to 3 words), written in ${languageName(project.language)}. Mix the core topic with adjacent interests; avoid the brand name itself.

PROJECT
${describe(project, kit)}`,
  })
  const unique = new Map(output.keywords.map((k) => k.trim().slice(0, 80)).filter(Boolean).map((k) => [k.toLowerCase(), k]))
  return [...unique.values()].slice(0, 6)
}

// Recent interest compared with the weeks before it, as a percentage
export function interestGrowth(points: InterestPoint[]) {
  if (points.length < 4) return null
  const recent = points.slice(-2)
  const before = points.slice(0, -2)
  const avg = (list: InterestPoint[]) => list.reduce((sum, p) => sum + p.value, 0) / list.length
  const base = avg(before)
  if (!base) return avg(recent) > 0 ? 100 : 0
  return Math.round(((avg(recent) - base) / base) * 100)
}

const compact = (n: number) => new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n)

// Gives every piece of evidence a short id the model can cite back
export function digestSignals(signals: Signal[]) {
  const evidence = new Map<string, Evidence>()
  const lines: string[] = []

  signals.forEach((signal, i) => {
    if (signal.source === "google_trends") {
      const growth = interestGrowth(signal.interest)
      lines.push(
        `[Google Trends] "${signal.keyword}": ${growth === null ? "no interest data" : `interest ${growth >= 0 ? "+" : ""}${growth}% in the last 2 weeks vs the 10 before`}`,
      )
      signal.rising.forEach((r, j) => {
        const id = `G${i}.${j}`
        const metric = r.growth === "breakout" ? "Breakout" : `+${r.growth}%`
        evidence.set(id, { type: "query", label: r.query, metric: `${metric} searches` })
        lines.push(`  ${id} rising search "${r.query}" ${metric}`)
      })
      if (signal.top.length) lines.push(`  top searches: ${signal.top.map((t) => t.query).join(", ")}`)
    } else if (signal.source === "youtube") {
      lines.push(`[YouTube, last 14 days] "${signal.keyword}":`)
      signal.videos.slice(0, 6).forEach((v, j) => {
        const id = `Y${i}.${j}`
        const kind = v.durationSeconds <= 180 ? "Short" : `${Math.round(v.durationSeconds / 60)} min video`
        evidence.set(id, {
          type: "video",
          label: v.title,
          url: `https://www.youtube.com/watch?v=${v.id}`,
          metric: `${compact(v.views)} views · ${compact(v.viewsPerDay)}/day`,
        })
        lines.push(`  ${id} ${kind} "${v.title}" by ${v.channel}: ${compact(v.views)} views (${compact(v.viewsPerDay)}/day), ${compact(v.comments)} comments`)
      })
    } else {
      lines.push(`[Web news] "${signal.keyword}": ${signal.summary.replace(/\s+/g, " ")}`)
      signal.articles.forEach((a, j) => {
        const id = `W${i}.${j}`
        evidence.set(id, { type: "article", label: a.title, url: a.url })
        lines.push(`  ${id} source: ${a.title}`)
      })
    }
  })

  return { text: lines.join("\n"), evidence }
}

const ideaSchema = z.object({
  title: z.string().describe("The content idea as a punchy working title, max 80 characters"),
  summary: z.string().describe("What the piece of content would say, 1-2 sentences"),
  why_now: z.string().describe("Why this is timely, citing the numbers from the signals"),
  momentum: z.number().describe("0-10: how fast interest is growing right now"),
  fit: z.number().describe("0-10: how well it fits this project and audience"),
  competition: z.number().describe("0-10: how crowded the topic already is (10 = saturated)"),
  platforms: z.array(z.enum(PLATFORMS)).describe("Where it would perform best"),
  formats: z.array(z.enum(FORMATS)).describe("Best formats, most suitable first"),
  keywords: z.array(z.string()).describe("Which tracked keywords this idea comes from, spelled exactly"),
  hooks: z.array(z.string()).describe("3 opening lines for a video or post, in the content language"),
  evidence_ids: z.array(z.string()).describe("Ids like G0.1 or Y2.0 of the signals that support this idea"),
})

export function scoreIdea(idea: { momentum: number; fit: number; competition: number }) {
  const clamp = (n: number) => Math.max(0, Math.min(10, Math.round(n)))
  const momentum = clamp(idea.momentum)
  const fit = clamp(idea.fit)
  const competition = clamp(idea.competition)
  const score = Math.round(10 * (0.45 * momentum + 0.4 * fit + 0.15 * (10 - competition)))
  return { momentum, fit, competition, score }
}

export async function buildIdeas(
  project: Project,
  kit: BrandKit | null,
  signals: Signal[],
  model: LanguageModel = defaultModel(),
) {
  const digest = digestSignals(signals)
  const { output } = await generateText({
    model,
    output: Output.object({ schema: z.object({ ideas: z.array(ideaSchema).describe("6 to 10 ideas, best first") }) }),
    system:
      "You are a content strategist for creators. You turn raw trend data into specific, timely content ideas that a creator can film or post this week. You never invent numbers: every claim about growth or views must come from the signals.",
    prompt: `Find the best content opportunities for this project in the trend signals below.

PROJECT
${describe(project, kit)}
${kit?.tone_of_voice ? `Voice: ${kit.tone_of_voice}` : ""}

SIGNALS
${digest.text}

RULES
- Each idea must be grounded in at least one signal and cite its ids in evidence_ids.
- Prefer rising topics and fast-growing videos over evergreen ones, but only if they fit the audience.
- Merge signals about the same theme into one idea; skip anything off-niche, unsafe or tragic news.
- Write title, summary, why_now and hooks in ${languageName(project.language)}.`,
  })

  return output.ideas.slice(0, 10).map((idea) => {
    const { evidence_ids, ...rest } = idea
    return {
      ...rest,
      ...scoreIdea(idea),
      title: idea.title.slice(0, 120),
      hooks: idea.hooks.slice(0, 5),
      platforms: [...new Set(idea.platforms)],
      formats: [...new Set(idea.formats)],
      evidence: [...new Set(evidence_ids)].flatMap((id) => digest.evidence.get(id) ?? []).slice(0, 6),
    }
  })
}
