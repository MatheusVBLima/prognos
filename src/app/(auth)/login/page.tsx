import type { Metadata } from "next"
import { AuthForm } from "@/components/auth/AuthForm"

export const metadata: Metadata = { title: "Sign in | Prognos" }

const ERRORS: Record<string, string> = {
  oauth: "Could not start Google sign-in. Please try again.",
  callback: "That sign-in link is invalid or expired. Please try again.",
}

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next, error } = await searchParams
  return (
    <AuthForm
      mode="login"
      next={typeof next === "string" ? next : undefined}
      initialError={typeof error === "string" ? ERRORS[error] : undefined}
    />
  )
}
