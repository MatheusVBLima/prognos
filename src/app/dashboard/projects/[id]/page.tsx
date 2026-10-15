import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProjectForm } from "@/components/projects/ProjectForm"
import { DeleteProjectButton } from "@/components/projects/DeleteProjectButton"
import { requireUser } from "@/lib/auth"
import { getProject } from "@/db/queries/projects"
import { updateProjectAction } from "../actions"

export const metadata: Metadata = { title: "Edit project | Prognos" }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default async function EditProjectPage({ params }: PageProps<"/dashboard/projects/[id]">) {
  const { id } = await params
  if (!UUID.test(id)) notFound()

  const user = await requireUser()
  const project = await getProject(user.id, id)
  if (!project) notFound()

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="mt-1 text-muted-foreground">Update the details we use to tailor trends and content.</p>
        </div>
        <DeleteProjectButton id={project.id} name={project.name} />
      </div>
      <ProjectForm action={updateProjectAction.bind(null, project.id)} project={project} submitLabel="Save changes" />
    </div>
  )
}
