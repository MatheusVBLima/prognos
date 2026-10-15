import "server-only"
import { cookies } from "next/headers"
import type { Project } from "@/db/schema"

export const ACTIVE_PROJECT_COOKIE = "prognos_project"

// The project the app is currently working on; falls back to the first one
export async function pickActiveProject(projects: Project[]) {
  const id = (await cookies()).get(ACTIVE_PROJECT_COOKIE)?.value
  return projects.find((p) => p.id === id) ?? projects[0] ?? null
}
