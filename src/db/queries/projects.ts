import "server-only"
import { and, asc, eq } from "drizzle-orm"
import { getDb } from "@/db"
import { projects, type NewProject } from "@/db/schema"

// Every query is scoped to the owner; the server connection bypasses RLS

export type ProjectInput = Omit<NewProject, "id" | "userId" | "createdAt" | "updatedAt">

export function listProjects(userId: string) {
  return getDb().select().from(projects).where(eq(projects.userId, userId)).orderBy(asc(projects.createdAt))
}

export async function getProject(userId: string, id: string) {
  const [project] = await getDb()
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))
    .limit(1)
  return project ?? null
}

export async function createProject(userId: string, input: ProjectInput) {
  const [project] = await getDb().insert(projects).values({ ...input, userId }).returning()
  return project
}

export async function updateProject(userId: string, id: string, input: ProjectInput) {
  const [project] = await getDb()
    .update(projects)
    .set(input)
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))
    .returning()
  return project ?? null
}

export async function deleteProject(userId: string, id: string) {
  const deleted = await getDb()
    .delete(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))
    .returning({ id: projects.id })
  return deleted.length > 0
}
