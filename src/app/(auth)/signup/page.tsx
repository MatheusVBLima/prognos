import type { Metadata } from "next"
import { AuthForm } from "@/components/auth/AuthForm"

export const metadata: Metadata = { title: "Sign up | Prognos" }

export default function SignupPage() {
  return <AuthForm mode="signup" />
}
