"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { getSiteUrl } from "@/lib/site-url"
import { safeNextPath } from "@/lib/safe-redirect"

// email/name are echoed back so a failed submit doesn't clear them
export type AuthFormState = { error?: string; message?: string; email?: string; name?: string } | undefined

const signInSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(1, "Enter your password"),
})

const signUpSchema = z.object({
  name: z.string().trim().min(1, "Enter your name").max(100),
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Use at least 8 characters"),
})

export async function signIn(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "")
  const parsed = signInSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0].message, email }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)
  if (error) return { error: error.message, email }

  redirect(safeNextPath(formData.get("next") as string | null))
}

export async function signUp(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const echo = { email: String(formData.get("email") ?? ""), name: String(formData.get("name") ?? "") }
  const parsed = signUpSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) return { error: parsed.error.issues[0].message, ...echo }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.name },
      emailRedirectTo: `${await getSiteUrl()}/auth/callback`,
    },
  })
  if (error) return { error: error.message, ...echo }

  // No session means the project requires email confirmation
  if (!data.session) return { message: "Check your inbox to confirm your email, then sign in." }

  redirect("/dashboard")
}

export async function signInWithGoogle(formData: FormData) {
  const next = safeNextPath(formData.get("next") as string | null)
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${await getSiteUrl()}/auth/callback?next=${encodeURIComponent(next)}` },
  })
  if (error || !data.url) redirect("/login?error=oauth")

  redirect(data.url)
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/login")
}
