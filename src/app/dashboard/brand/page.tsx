import type { Metadata } from "next"
import { BrandEditor } from "@/components/brand/BrandEditor"
import { BrandSetup } from "@/components/brand/BrandSetup"
import { requireUser } from "@/lib/auth"
import { getBrandKit } from "@/lib/brand/queries"
import { requireActiveProject } from "@/lib/projects/active"

export const metadata: Metadata = { title: "Brand | Prognos" }

export default async function BrandPage() {
  await requireUser()
  const project = await requireActiveProject()
  const kit = await getBrandKit(project.id)

  if (!kit) return <BrandSetup key={project.id} projectName={project.name} websiteUrl={project.website_url} />
  // Keyed so switching projects or saving a new kit resets the editor's local state
  return <BrandEditor key={`${kit.id}-${kit.created_at}`} kit={kit} projectName={project.name} />
}
