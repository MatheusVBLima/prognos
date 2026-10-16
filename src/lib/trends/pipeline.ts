import "server-only"
import type { SupabaseClient } from "@supabase/supabase-js"
import type { LanguageModel } from "ai"
import { toBrandKit } from "@/lib/brand/queries"
import type { Project } from "@/lib/projects/queries"
import { buildIdeas, suggestKeywords } from "@/lib/trends/ai"
import { LANGUAGE_HL, regionCode } from "@/lib/trends/regions"
import {
  availableSources,
  fetchGoogleTrends,
  fetchWeb,
  fetchYouTube,
  type GoogleTrendsSignal,
  type Signal,
  type SourceContext,
  type TrendSource,
} from "@/lib/trends/sources"
import type { Database, Json } from "@/types/database"

// Collects signals for a project's keywords, asks the AI for ideas and replaces the unsaved ones.
// Works with the signed-in user's client (manual refresh) or the admin client (daily job).

type Client = SupabaseClient<Database>

const MAX_KEYWORDS = 6
// YouTube search costs 100 quota units per call and web search is slow, so they get fewer keywords
const KEYWORDS_PER_SOURCE: Record<TrendSource, number> = { google_trends: 6, youtube: 4, web: 3 }

export class TrendRefreshError extends Error {}

type Options = {
  trigger: "manual" | "schedule"
  userId: string
  sources?: TrendSource[]
  model?: LanguageModel
}

export async function ensureKeywords(supabase: Client, project: Project, userId: string, model?: LanguageModel) {
  const { data, error } = await supabase.from("keywords").select("term, active").eq("project_id", project.id).order("created_at")
  if (error) throw error
  const active = data.filter((k) => k.active).map((k) => k.term)
  if (active.length) return active.slice(0, MAX_KEYWORDS)

  const { data: kitRow } = await supabase.from("brand_kits").select("*").eq("project_id", project.id).maybeSingle()
  // Keywords the user switched off stay off
  const known = new Set(data.map((k) => k.term.toLowerCase()))
  const terms = (await suggestKeywords(project, kitRow ? toBrandKit(kitRow) : null, model)).filter(
    (term) => !known.has(term.toLowerCase()),
  )
  if (!terms.length) throw new TrendRefreshError("We couldn't come up with keywords for this project. Add a few yourself.")

  const { error: insertError } = await supabase
    .from("keywords")
    .insert(terms.map((term) => ({ project_id: project.id, user_id: userId, term, source: "ai" })))
  if (insertError) throw insertError
  return terms
}

export async function refreshTrends(supabase: Client, project: Project, options: Options) {
  const { data: run, error: runError } = await supabase
    .from("trend_runs")
    .insert({ project_id: project.id, user_id: options.userId, trigger: options.trigger })
    .select("id")
    .single()
  if (runError) throw runError

  const finish = (fields: Database["public"]["Tables"]["trend_runs"]["Update"]) =>
    supabase.from("trend_runs").update({ ...fields, finished_at: new Date().toISOString() }).eq("id", run.id)

  try {
    const sources = options.sources ?? availableSources()
    if (!sources.length) throw new TrendRefreshError("Trend sources aren't set up yet.")

    const keywords = await ensureKeywords(supabase, project, options.userId, options.model)
    const region = regionCode(project.country)
    const ctx: SourceContext = { region, language: project.language, hl: LANGUAGE_HL[project.language] ?? "en" }
    const niche = project.niche ?? project.description.slice(0, 120)

    const results = await Promise.allSettled(
      sources.map((source): Promise<Signal[]> => {
        const terms = keywords.slice(0, KEYWORDS_PER_SOURCE[source])
        if (source === "google_trends") return fetchGoogleTrends(terms, ctx)
        if (source === "youtube") return fetchYouTube(terms, ctx)
        return fetchWeb(terms, ctx, niche)
      }),
    )

    const signals: Signal[] = []
    const used: TrendSource[] = []
    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        signals.push(...result.value)
        used.push(sources[index])
      } else {
        console.error(`[trends] ${sources[index]} failed for project ${project.id}:`, result.reason)
      }
    })
    if (!signals.length) throw new TrendRefreshError("None of the trend sources answered. Try again in a few minutes.")

    const { error: signalError } = await supabase.from("trend_signals").insert(
      signals.map((signal) => ({
        project_id: project.id,
        user_id: options.userId,
        run_id: run.id,
        source: signal.source,
        keyword: signal.keyword,
        region,
        payload: signal as unknown as Json,
      })),
    )
    if (signalError) throw signalError

    const { data: kitRow } = await supabase.from("brand_kits").select("*").eq("project_id", project.id).maybeSingle()
    const ideas = await buildIdeas(project, kitRow ? toBrandKit(kitRow) : null, signals, options.model)
    if (!ideas.length) throw new TrendRefreshError("No strong opportunities this time. Try adding more keywords.")

    // The chart on each idea follows the first of its keywords that has Google Trends data
    const interestFor = (terms: string[]) => {
      const series = signals.filter((s): s is GoogleTrendsSignal => s.source === "google_trends" && s.interest.length > 0)
      const match = terms.map((t) => series.find((s) => s.keyword.toLowerCase() === t.toLowerCase())).find(Boolean)
      return match?.interest ?? []
    }

    // Saved, used and dismissed ideas stay; only last run's untouched suggestions are replaced
    const { error: deleteError } = await supabase.from("trend_ideas").delete().eq("project_id", project.id).eq("status", "new")
    if (deleteError) throw deleteError

    const { error: ideasError } = await supabase.from("trend_ideas").insert(
      ideas.map((idea) => ({
        project_id: project.id,
        user_id: options.userId,
        run_id: run.id,
        title: idea.title,
        summary: idea.summary,
        why_now: idea.why_now,
        score: idea.score,
        momentum: idea.momentum,
        fit: idea.fit,
        competition: idea.competition,
        platforms: idea.platforms,
        formats: idea.formats,
        keywords: idea.keywords,
        hooks: idea.hooks,
        evidence: idea.evidence as unknown as Json,
        interest: interestFor(idea.keywords) as unknown as Json,
      })),
    )
    if (ideasError) throw ideasError

    await finish({ status: "succeeded", sources: used })
    return { ideas: ideas.length, sources: used }
  } catch (error) {
    const message = error instanceof TrendRefreshError ? error.message : "Something went wrong while researching trends."
    await finish({ status: "failed", error: message })
    if (!(error instanceof TrendRefreshError)) console.error(`[trends] refresh failed for project ${project.id}:`, error)
    throw error instanceof TrendRefreshError ? error : new TrendRefreshError(message)
  }
}
