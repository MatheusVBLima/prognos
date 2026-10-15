"use client"

import Link from "next/link"
import { useActionState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LANGUAGES } from "@/lib/projects/schema"
import type { ProjectFormState } from "@/app/dashboard/projects/actions"
import type { Project } from "@/lib/projects/queries"

type Props = {
  action: (state: ProjectFormState, formData: FormData) => Promise<ProjectFormState>
  project?: Project
  submitLabel: string
}

function Field({
  id,
  label,
  hint,
  errors,
  children,
}: {
  id: string
  label: string
  hint?: string
  errors?: string[]
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {errors?.length ? (
        <p className="text-sm text-destructive">{errors[0]}</p>
      ) : hint ? (
        <p className="text-sm text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

export function ProjectForm({ action, project, submitLabel }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined)
  const errors = state?.fieldErrors ?? {}
  // After a failed submit React resets the form, so defaults come from what was submitted
  const value = (field: keyof Project & string, fallback = "") =>
    state?.values?.[field] ?? (project?.[field] as string | null | undefined) ?? fallback

  return (
    <form action={formAction}>
      <Card>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <Field id="name" label="Project name" errors={errors.name}>
            <Input id="name" name="name" defaultValue={value("name")} placeholder="e.g. Ace the SAT" required />
          </Field>

          <Field
            id="website_url"
            label="Website (optional)"
            hint="If your project has a landing page, we'll use it to learn about your brand."
            errors={errors.website_url}
          >
            <Input
              id="website_url"
              name="website_url"
              type="text"
              inputMode="url"
              defaultValue={value("website_url")}
              placeholder="example.com"
            />
          </Field>

          <div className="md:col-span-2">
            <Field
              id="description"
              label="What is it?"
              hint="Describe the product, channel or idea in a few sentences."
              errors={errors.description}
            >
              <Textarea
                id="description"
                name="description"
                rows={4}
                defaultValue={value("description")}
                placeholder="An app with every past exam question, organized by topic, with video explanations."
                required
              />
            </Field>
          </div>

          <Field id="niche" label="Niche" errors={errors.niche}>
            <Input id="niche" name="niche" defaultValue={value("niche")} placeholder="e.g. test prep, education" />
          </Field>

          <Field id="audience" label="Target audience" errors={errors.audience}>
            <Input
              id="audience"
              name="audience"
              defaultValue={value("audience")}
              placeholder="e.g. high school seniors preparing for college"
            />
          </Field>

          <div className="md:col-span-2">
            <Field id="goals" label="Content goals" errors={errors.goals}>
              <Textarea
                id="goals"
                name="goals"
                rows={2}
                defaultValue={value("goals")}
                placeholder="e.g. grow on Instagram and TikTok, drive app sign-ups"
              />
            </Field>
          </div>

          <Field id="language" label="Content language" errors={errors.language}>
            <Select key={value("language", "en")} name="language" defaultValue={value("language", "en")}>
              <SelectTrigger id="language" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((language) => (
                  <SelectItem key={language.value} value={language.value}>
                    {language.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field id="country" label="Main market (optional)" errors={errors.country}>
            <Input id="country" name="country" defaultValue={value("country")} placeholder="e.g. Brazil" />
          </Field>

          {state?.error && <p className="text-sm text-destructive md:col-span-2">{state.error}</p>}
        </CardContent>
        <CardFooter className="justify-end gap-2">
          <Button variant="ghost" asChild>
            <Link href="/dashboard/projects">Cancel</Link>
          </Button>
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            {submitLabel}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
