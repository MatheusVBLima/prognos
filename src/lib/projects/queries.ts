import "server-only"
import { createClient } from "@/lib/supabase/server"
import type { Tables, TablesInsert } from "@/types/database"

// Runs as the signed-in user, so RLS limits every query to their own projects

export type Project = Tables<"projects">
export type ProjectInput = Omit<TablesInsert<"projects">, "id" | "user_id" | "created_at" | "updated_at">

export async function listProjects() {
  const supabase = await createClient()
  const { data, error } = await supabase.from("projects").select("*").order("created_at")
  if (error) throw error
  return data
}

export async function getProject(id: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).maybeSingle()
  if (error) throw error
  return data
}

export async function createProject(input: ProjectInput) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("projects").insert(input).select().single()
  if (error) throw error
  return data
}

export async function updateProject(id: string, input: Partial<ProjectInput>) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("projects").update(input).eq("id", id).select().maybeSingle()
  if (error) throw error
  return data
}

export async function deleteProject(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("projects").delete().eq("id", id)
  if (error) throw error
}
