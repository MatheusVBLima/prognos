"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireUser } from "@/lib/auth"
import { requireActiveProject } from "@/lib/projects/active"
import { createClient } from "@/lib/supabase/server"
import { refreshTrends, TrendRefreshError } from "@/lib/trends/pipeline"
import { IDEA_STATUSES } from "@/lib/trends/queries"

const MANUAL_COOLDOWN_MS = 10 * 60_000
// A run that never finished (crashed function) stops blocking after this
const STALE_RUN_MS = 5 * 60_000

export type RefreshResult = { ok?: boolean; ideas?: number; error?: string }

export async function refreshTrendsAction(): Promise<RefreshResult> {
  const user = await requireUser()
  const project = await requireActiveProject()
  const supabase = await createClient()

  const { data: recent } = await supabase
    .from("trend_runs")
    .select("status, trigger, started_at")
    .eq("project_id", project.id)
    .gte("started_at", new Date(Date.now() - MANUAL_COOLDOWN_MS).toISOString())
    .order("started_at", { ascending: false })

  const age = (run: { started_at: string }) => Date.now() - Date.parse(run.started_at)
  if (recent?.some((run) => run.status === "running" && age(run) < STALE_RUN_MS)) {
    return { error: "We're already researching this project. Give it a minute." }
  }
  const lastManual = recent?.find((run) => run.trigger === "manual" && run.status === "succeeded")
  if (lastManual) {
    const minutes = Math.ceil((MANUAL_COOLDOWN_MS - age(lastManual)) / 60_000)
    return { error: `Trends were just refreshed. You can refresh again in ${minutes} min.` }
  }

  try {
    const result = await refreshTrends(supabase, project, { trigger: "manual", userId: user.id })
    revalidatePath("/dashboard/trends")
    return { ok: true, ideas: result.ideas }
  } catch (error) {
    revalidatePath("/dashboard/trends")
    return { error: error instanceof TrendRefreshError ? error.message : "Something went wrong. Please try again." }
  }
}

const keywordSchema = z.string().trim().min(1, "Type a keyword").max(80, "Keep it under 80 characters")

export async function addKeywordAction(term: string): Promise<{ error?: string }> {
  await requireUser()
  const project = await requireActiveProject()
  const parsed = keywordSchema.safeParse(term)
  if (!parsed.success) return { error: parsed.error.issues[0].message }

  const supabase = await createClient()
  const { count } = await supabase
    .from("keywords")
    .select("id", { count: "exact", head: true })
    .eq("project_id", project.id)
    .eq("active", true)
  if ((count ?? 0) >= 10) return { error: "You can track up to 10 keywords per project." }

  // Re-adding a keyword that was removed switches it back on
  const { data: existing } = await supabase
    .from("keywords")
    .select("id")
    .eq("project_id", project.id)
    .ilike("term", parsed.data.replace(/[%_\\]/g, "\\$&"))
    .maybeSingle()

  const { error } = existing
    ? await supabase.from("keywords").update({ active: true }).eq("id", existing.id)
    : await supabase.from("keywords").insert({ project_id: project.id, term: parsed.data, source: "user" })
  if (error) return { error: "Couldn't add that keyword." }

  revalidatePath("/dashboard/trends")
  return {}
}

// Soft delete so the AI doesn't suggest it again
export async function removeKeywordAction(id: string) {
  await requireUser()
  const supabase = await createClient()
  await supabase.from("keywords").update({ active: false }).eq("id", id)
  revalidatePath("/dashboard/trends")
}

export async function setIdeaStatusAction(id: string, status: string) {
  await requireUser()
  const parsed = z.enum(IDEA_STATUSES).safeParse(status)
  if (!parsed.success) return
  const supabase = await createClient()
  await supabase.from("trend_ideas").update({ status: parsed.data }).eq("id", id)
  revalidatePath("/dashboard/trends")
}
