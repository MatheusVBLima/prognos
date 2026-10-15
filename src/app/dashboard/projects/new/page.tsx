import type { Metadata } from "next"
import { ProjectForm } from "@/components/projects/ProjectForm"
import { createProjectAction } from "../actions"

export const metadata: Metadata = { title: "New project | Prognos" }

export default function NewProjectPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">New project</h1>
        <p className="mt-1 text-muted-foreground">
          Tell us what you create content for. The more context you give, the better the ideas and scripts.
        </p>
      </div>
      <ProjectForm action={createProjectAction} submitLabel="Create project" />
    </div>
  )
}
