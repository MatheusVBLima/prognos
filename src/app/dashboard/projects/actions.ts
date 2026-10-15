"use server"

import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { requireUser } from "@/lib/auth"
import { projectFormSchema } from "@/lib/projects/schema"
import { ACTIVE_PROJECT_COOKIE } from "@/lib/projects/active"
import { createProject, deleteProject, getProject, updateProject } from "@/lib/projects/queries"

export type ProjectFormState =
  | {
      error?: string
      fieldErrors?: Record<string, string[] | undefined>
      // Echoed back so the form keeps what the user typed after a failed submit
      values?: Record<string, string>
    }
  | undefined

const FIELDS = ["name", "website_url", "description", "niche", "audience", "goals", "language", "country"] as const

function submittedValues(formData: FormData) {
  return Object.fromEntries(FIELDS.map((field) => [field, String(formData.get(field) ?? "")]))
}

const cookieOptions = { path: "/", httpOnly: true, sameSite: "lax" as const, maxAge: 60 * 60 * 24 * 365 }

function parse(formData: FormData) {
  return projectFormSchema.safeParse(submittedValues(formData))
}

export async function createProjectAction(_: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  await requireUser()
  const parsed = parse(formData)
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, values: submittedValues(formData) }
  }

  const project = await createProject(parsed.data)
  ;(await cookies()).set(ACTIVE_PROJECT_COOKIE, project.id, cookieOptions)
  revalidatePath("/dashboard", "layout")
  redirect("/dashboard")
}

export async function updateProjectAction(id: string, _: ProjectFormState, formData: FormData): Promise<ProjectFormState> {
  await requireUser()
  const parsed = parse(formData)
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors, values: submittedValues(formData) }
  }

  const project = await updateProject(id, parsed.data)
  if (!project) return { error: "Project not found", values: submittedValues(formData) }

  revalidatePath("/dashboard", "layout")
  redirect("/dashboard/projects")
}

export async function deleteProjectAction(id: string) {
  await requireUser()
  await deleteProject(id)

  const store = await cookies()
  if (store.get(ACTIVE_PROJECT_COOKIE)?.value === id) store.delete(ACTIVE_PROJECT_COOKIE)
  revalidatePath("/dashboard", "layout")
  redirect("/dashboard/projects")
}

export async function setActiveProjectAction(id: string) {
  await requireUser()
  if (!(await getProject(id))) return

  ;(await cookies()).set(ACTIVE_PROJECT_COOKIE, id, cookieOptions)
  revalidatePath("/dashboard", "layout")
}
