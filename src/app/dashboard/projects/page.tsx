import Link from "next/link"
import type { Metadata } from "next"
import { Globe, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { requireUser } from "@/lib/auth"
import { listProjects } from "@/lib/projects/queries"

export const metadata: Metadata = { title: "Projects | Prognos" }

export default async function ProjectsPage() {
  await requireUser()
  const projects = await listProjects()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="mt-1 text-muted-foreground">The products, brands and channels you create content for.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/projects/new">
            <Plus className="size-4" />
            New project
          </Link>
        </Button>
      </div>

      {projects.length === 0 ? (
        <Card>
          <CardHeader className="items-center py-12 text-center">
            <CardTitle>No projects yet</CardTitle>
            <CardDescription>Create your first project to start getting trend-based content ideas.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link key={project.id} href={`/dashboard/projects/${project.id}`} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/50">
                <CardHeader className="space-y-2">
                  <CardTitle>{project.name}</CardTitle>
                  {project.website_url && (
                    <span className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Globe className="size-3.5" />
                      {project.website_url.replace(/^https?:\/\//, "")}
                    </span>
                  )}
                  <CardDescription className="line-clamp-3">{project.description}</CardDescription>
                  {project.niche && (
                    <div>
                      <Badge variant="secondary">{project.niche}</Badge>
                    </div>
                  )}
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
