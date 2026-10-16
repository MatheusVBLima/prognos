import type { Metadata } from "next"
import { OpportunitiesClient } from "@/components/trends/OpportunitiesClient"
import { requireUser } from "@/lib/auth"
import { requireActiveProject } from "@/lib/projects/active"
import { latestRun, listIdeas, listKeywords } from "@/lib/trends/queries"

export const metadata: Metadata = { title: "Opportunities | Prognos" }

// A refresh calls several APIs and the AI, so the action needs more than the default time
export const maxDuration = 300

export default async function TrendsPage() {
  await requireUser()
  const project = await requireActiveProject()
  const [ideas, keywords, lastRun] = await Promise.all([
    listIdeas(project.id),
    listKeywords(project.id),
    latestRun(project.id),
  ])

  return (
    <OpportunitiesClient
      key={project.id}
      projectName={project.name}
      ideas={ideas}
      keywords={keywords}
      lastRun={lastRun}
    />
  )
}
