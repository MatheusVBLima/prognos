"use client"

import Link from "next/link"
import { useActionState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { signIn, signInWithGoogle, signUp, type AuthFormState } from "@/app/(auth)/actions"

type Mode = "login" | "signup"

const copy = {
  login: {
    title: "Welcome back",
    description: "Sign in to keep creating content that rides the trends.",
    submit: "Sign in",
    switchText: "Don't have an account?",
    switchLink: { href: "/signup", label: "Sign up" },
  },
  signup: {
    title: "Create your account",
    description: "Turn what's trending in your niche into ready-to-post content.",
    submit: "Create account",
    switchText: "Already have an account?",
    switchLink: { href: "/login", label: "Sign in" },
  },
}

export function AuthForm({ mode, next, initialError }: { mode: Mode; next?: string; initialError?: string }) {
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(
    mode === "login" ? signIn : signUp,
    initialError ? { error: initialError } : undefined
  )
  const text = copy[mode]

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">{text.title}</CardTitle>
        <CardDescription>{text.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={signInWithGoogle}>
          <input type="hidden" name="next" value={next ?? ""} />
          <Button type="submit" variant="outline" className="w-full">
            Continue with Google
          </Button>
        </form>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Separator className="flex-1" />
          or
          <Separator className="flex-1" />
        </div>

        <form action={formAction} className="space-y-4">
          <input type="hidden" name="next" value={next ?? ""} />
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" autoComplete="name" defaultValue={state?.name} required />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" defaultValue={state?.email} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              minLength={mode === "signup" ? 8 : undefined}
              required
            />
          </div>

          {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
          {state?.message && <p className="text-sm text-muted-foreground">{state.message}</p>}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            {text.submit}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {text.switchText}{" "}
          <Link href={text.switchLink.href} className="font-medium text-foreground underline underline-offset-4">
            {text.switchLink.label}
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
