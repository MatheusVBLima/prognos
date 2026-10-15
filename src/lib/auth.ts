import "server-only"
import { cache } from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export type CurrentUser = {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
}

// Verified against the Auth server; deduplicated per request
export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null

  const meta = data.user.user_metadata ?? {}
  return {
    id: data.user.id,
    email: data.user.email ?? "",
    name: meta.full_name ?? meta.name ?? null,
    avatarUrl: meta.avatar_url ?? null,
  }
})

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) redirect("/login")
  return user
}
