import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight, Brain, FolderPlus, Globe, Pencil, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { requireUser } from "@/lib/auth"
import { listProjects } from "@/db/queries/projects"
import { pickActiveProject } from "@/lib/projects/active"
import { LANGUAGES } from "@/lib/projects/schema"

export const metadata: Metadata = { title: "Overview | Prognos" }

export default async function OverviewPage() {
  const user = await requireUser()
  const active = await pickActiveProject(await listProjects(user.id))
  const firstName = user.name?.split(" ")[0]

  if (!active) {
    return (
      <div className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
          <FolderPlus className="size-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Welcome{firstName ? `, ${firstName}` : ""}!</h1>
          <p className="text-muted-foreground">
            Start by telling us about what you create content for: a product, a brand or a channel. We&apos;ll use it to
            find what&apos;s trending in your niche and write content that fits.
          </p>
        </div>
        <Button size="lg" asChild>
          <Link href="/dashboard/projects/new">
            Set up your first project
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    )
  }

  const language = LANGUAGES.find((l) => l.value === active.language)?.label

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back{firstName ? `, ${firstName}` : ""}</h1>
        <p className="mt-1 text-muted-foreground">Here&apos;s the project you&apos;re working on.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle className="text-2xl">{active.name}</CardTitle>
            {active.websiteUrl && (
              <a
                href={active.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-sm text-muted-foreground hover:underline"
              >
                <Globe className="size-3.5" />
                {active.websiteUrl.replace(/^https?:\/\//, "")}
              </a>
            )}
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href={`/dashboard/projects/${active.id}`}>
              <Pencil className="size-4" />
              Edit
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed">{active.description}</p>
          <div className="flex flex-wrap gap-2">
            {active.niche && <Badge variant="secondary">{active.niche}</Badge>}
            {active.audience && <Badge variant="outline">Audience: {active.audience}</Badge>}
            {language && <Badge variant="outline">{language}</Badge>}
            {active.country && <Badge variant="outline">{active.country}</Badge>}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <TrendingUp className="size-6 text-primary" />
            <CardTitle>Explore trends</CardTitle>
            <CardDescription>See what people are searching for right now.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/dashboard/trends">Open trends</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Brain className="size-6 text-primary" />
            <CardTitle>Write a script</CardTitle>
            <CardDescription>Turn a trend into a short-form video script with AI.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" asChild>
              <Link href="/dashboard/studio">Open studio</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
