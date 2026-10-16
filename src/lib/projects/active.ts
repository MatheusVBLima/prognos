import "server-only"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { listProjects, type Project } from "@/lib/projects/queries"

export const ACTIVE_PROJECT_COOKIE = "prognos_project"

// The project the app is currently working on; falls back to the first one
export async function pickActiveProject(projects: Project[]) {
  const id = (await cookies()).get(ACTIVE_PROJECT_COOKIE)?.value
  return projects.find((p) => p.id === id) ?? projects[0] ?? null
}

// For pages that only make sense inside a project
export async function requireActiveProject() {
  const project = await pickActiveProject(await listProjects())
  if (!project) redirect("/dashboard/projects/new")
  return project
}
