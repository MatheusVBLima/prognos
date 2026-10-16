import "server-only"
import { createClient } from "@/lib/supabase/server"
import type { Evidence } from "@/lib/trends/ai"
import type { InterestPoint } from "@/lib/trends/sources"
import type { Tables } from "@/types/database"

// Runs as the signed-in user, so RLS limits every query to their own projects

export type Keyword = Tables<"keywords">
export type TrendRun = Tables<"trend_runs">
export type TrendIdea = Omit<Tables<"trend_ideas">, "evidence" | "interest"> & {
  evidence: Evidence[]
  interest: InterestPoint[]
}
export const IDEA_STATUSES = ["new", "saved", "dismissed", "used"] as const
export type IdeaStatus = (typeof IDEA_STATUSES)[number]

export async function listKeywords(projectId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("keywords")
    .select("*")
    .eq("project_id", projectId)
    .eq("active", true)
    .order("created_at")
  if (error) throw error
  return data
}

export async function listIdeas(projectId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("trend_ideas")
    .select("*")
    .eq("project_id", projectId)
    .neq("status", "dismissed")
    .order("score", { ascending: false })
  if (error) throw error
  return data.map((idea) => ({
    ...idea,
    evidence: (Array.isArray(idea.evidence) ? idea.evidence : []) as Evidence[],
    interest: (Array.isArray(idea.interest) ? idea.interest : []) as InterestPoint[],
  })) as TrendIdea[]
}

export async function latestRun(projectId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("trend_runs")
    .select("*")
    .eq("project_id", projectId)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data
}
