import "server-only"
import { createClient } from "@/lib/supabase/server"
import { brandColorSchema, type BrandColor } from "@/lib/brand/schema"
import type { Json, Tables, TablesInsert } from "@/types/database"

// Runs as the signed-in user, so RLS limits every query to their own kits

export type BrandKit = Omit<Tables<"brand_kits">, "colors"> & { colors: BrandColor[] }
export type BrandKitInput = Omit<TablesInsert<"brand_kits">, "id" | "user_id" | "project_id" | "created_at" | "updated_at" | "colors"> & {
  colors: BrandColor[]
}

function toBrandKit(row: Tables<"brand_kits">): BrandKit {
  const colors = Array.isArray(row.colors) ? row.colors.flatMap((c) => brandColorSchema.safeParse(c).data ?? []) : []
  return { ...row, colors }
}

export async function getBrandKit(projectId: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from("brand_kits").select("*").eq("project_id", projectId).maybeSingle()
  if (error) throw error
  return data ? toBrandKit(data) : null
}

// One kit per project: importing or regenerating replaces it
export async function saveBrandKit(projectId: string, input: BrandKitInput) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("brand_kits")
    .upsert({ ...input, colors: input.colors as unknown as Json, project_id: projectId }, { onConflict: "project_id" })
    .select()
    .single()
  if (error) throw error
  return toBrandKit(data)
}

export async function updateBrandKit(projectId: string, input: Partial<BrandKitInput>) {
  const supabase = await createClient()
  const { colors, ...rest } = input
  const { data, error } = await supabase
    .from("brand_kits")
    .update({ ...rest, ...(colors && { colors: colors as unknown as Json }) })
    .eq("project_id", projectId)
    .select()
    .maybeSingle()
  if (error) throw error
  return data ? toBrandKit(data) : null
}

export async function deleteBrandKit(projectId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("brand_kits").delete().eq("project_id", projectId)
  if (error) throw error
}
