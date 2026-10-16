import { timingSafeEqual } from "node:crypto"
import { createAdminClient } from "@/lib/supabase/admin"
import { refreshTrends } from "@/lib/trends/pipeline"
import { availableSources } from "@/lib/trends/sources"

// Daily refresh for every project that tracks keywords. Called by Vercel Cron (see vercel.json).

export const maxDuration = 300

const STALE_AFTER_MS = 20 * 3_600_000
// Leave headroom so the last project can finish before the function is stopped
const TIME_BUDGET_MS = 240_000

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET
  const header = req.headers.get("authorization") ?? ""
  const expected = `Bearer ${secret}`
  return !!secret && header.length === expected.length && timingSafeEqual(Buffer.from(header), Buffer.from(expected))
}

export async function GET(req: Request) {
  if (!authorized(req)) return new Response("Unauthorized", { status: 401 })

  const supabase = createAdminClient()
  if (!supabase) return Response.json({ skipped: "SUPABASE_SECRET_KEY is not set" })
  if (!availableSources().length) return Response.json({ skipped: "no trend sources configured" })

  const started = Date.now()

  // Projects that opted into trends by having at least one active keyword
  const { data: tracked, error } = await supabase.from("keywords").select("project_id").eq("active", true)
  if (error) throw error
  const projectIds = [...new Set(tracked.map((k) => k.project_id))]
  if (!projectIds.length) return Response.json({ refreshed: 0 })

  const [{ data: projects }, { data: recentRuns }] = await Promise.all([
    supabase.from("projects").select("*").in("id", projectIds),
    supabase
      .from("trend_runs")
      .select("project_id")
      .in("project_id", projectIds)
      .in("status", ["succeeded", "running"])
      .gte("started_at", new Date(started - STALE_AFTER_MS).toISOString()),
  ])
  const fresh = new Set((recentRuns ?? []).map((r) => r.project_id))
  const due = (projects ?? []).filter((p) => !fresh.has(p.id))

  const results: { project: string; ok: boolean; ideas?: number }[] = []
  for (const project of due) {
    if (Date.now() - started > TIME_BUDGET_MS) break
    try {
      const result = await refreshTrends(supabase, project, { trigger: "schedule", userId: project.user_id })
      results.push({ project: project.id, ok: true, ideas: result.ideas })
    } catch {
      results.push({ project: project.id, ok: false })
    }
  }

  return Response.json({ due: due.length, refreshed: results.filter((r) => r.ok).length, results })
}
