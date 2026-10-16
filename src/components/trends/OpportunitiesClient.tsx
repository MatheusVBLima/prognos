"use client"

import { useMemo, useState, useTransition } from "react"
import { toast } from "sonner"
import { AlertCircle, Loader2, Plus, RefreshCw, Sparkles, TrendingUp, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { IdeaCard, PLATFORM_LABELS } from "@/components/trends/IdeaCard"
import { addKeywordAction, refreshTrendsAction, removeKeywordAction } from "@/app/dashboard/trends/actions"
import type { Keyword, TrendIdea, TrendRun } from "@/lib/trends/queries"
import { cn } from "@/lib/utils"

const SOURCE_LABELS: Record<string, string> = { google_trends: "Google Trends", youtube: "YouTube", web: "the web" }

function timeAgo(iso: string) {
  const minutes = Math.round((Date.now() - Date.parse(iso)) / 60_000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} h ago`
  return `${Math.round(hours / 24)} d ago`
}

function KeywordBar({ keywords, disabled }: { keywords: Keyword[]; disabled: boolean }) {
  const [draft, setDraft] = useState("")
  const [pending, startTransition] = useTransition()

  const add = () =>
    startTransition(async () => {
      const result = await addKeywordAction(draft)
      if (result.error) toast.error(result.error)
      else setDraft("")
    })

  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="text-base">Tracked keywords</CardTitle>
        <CardDescription>
          {keywords.length
            ? "We research these every day. Add the topics your audience cares about."
            : "No keywords yet. We'll suggest some from your project on the first refresh, or add your own."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {keywords.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {keywords.map((keyword) => (
              <Badge key={keyword.id} variant="secondary" className="gap-1 py-1 pl-2.5 text-sm">
                {keyword.source === "ai" && <Sparkles className="size-3 text-primary" aria-label="Suggested by AI" />}
                {keyword.term}
                <button
                  type="button"
                  aria-label={`Stop tracking ${keyword.term}`}
                  className="rounded-full p-0.5 hover:bg-background"
                  disabled={disabled}
                  onClick={() => startTransition(() => removeKeywordAction(keyword.id))}
                >
                  <X className="size-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault()
            add()
          }}
        >
          <Input
            aria-label="New keyword"
            value={draft}
            maxLength={80}
            placeholder="e.g. study tips"
            onChange={(e) => setDraft(e.target.value)}
            disabled={disabled}
            className="max-w-xs"
          />
          <Button type="submit" variant="outline" disabled={disabled || pending || !draft.trim()}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
            Add
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

type Props = {
  projectName: string
  ideas: TrendIdea[]
  keywords: Keyword[]
  lastRun: TrendRun | null
}

export function OpportunitiesClient({ projectName, ideas, keywords, lastRun }: Props) {
  const [refreshing, startRefresh] = useTransition()
  const [platform, setPlatform] = useState<string>("all")
  const [savedOnly, setSavedOnly] = useState(false)

  const refresh = () =>
    startRefresh(async () => {
      const result = await refreshTrendsAction()
      if (result.error) toast.error(result.error)
      else toast.success(`Found ${result.ideas} opportunities`)
    })

  const platforms = useMemo(
    () => Object.keys(PLATFORM_LABELS).filter((p) => ideas.some((idea) => idea.platforms.includes(p))),
    [ideas],
  )
  const visible = ideas.filter(
    (idea) => (platform === "all" || idea.platforms.includes(platform)) && (!savedOnly || idea.status === "saved"),
  )
  const failed = lastRun?.status === "failed"
  const lastSuccess = lastRun?.status === "succeeded" ? lastRun : null

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Opportunities</h1>
          <p className="text-muted-foreground">What&apos;s trending right now that {projectName} can talk about.</p>
          {lastSuccess?.finished_at && (
            <p className="text-sm text-muted-foreground">
              Updated {timeAgo(lastSuccess.finished_at)}
              {lastSuccess.sources.length > 0 &&
                ` from ${lastSuccess.sources.map((s) => SOURCE_LABELS[s] ?? s).join(", ")}`}
            </p>
          )}
        </div>
        <Button onClick={refresh} disabled={refreshing}>
          {refreshing ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          {refreshing ? "Researching…" : "Refresh trends"}
        </Button>
      </div>

      {refreshing && (
        <p className="rounded-lg border bg-muted/50 px-4 py-3 text-sm text-muted-foreground">
          Checking Google Trends, YouTube and the news for your keywords, then picking the best ideas. This can take up
          to a minute.
        </p>
      )}
      {failed && !refreshing && lastRun?.error && (
        <p className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0" />
          The last refresh didn&apos;t finish: {lastRun.error}
        </p>
      )}

      <KeywordBar keywords={keywords} disabled={refreshing} />

      {ideas.length === 0 ? (
        <Card className="items-center py-14 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10">
            <TrendingUp className="size-7 text-primary" />
          </div>
          <div className="max-w-md space-y-2 px-6">
            <h2 className="text-xl font-semibold">Find your first opportunities</h2>
            <p className="text-sm text-muted-foreground">
              We&apos;ll look at what people are searching and watching around your niche and turn it into content
              ideas, each with a score and ready-made hooks.
            </p>
          </div>
          <Button size="lg" onClick={refresh} disabled={refreshing}>
            {refreshing ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {refreshing ? "Researching…" : "Find opportunities"}
          </Button>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Filter opportunities">
            {["all", ...platforms].map((value) => (
              <Button
                key={value}
                size="sm"
                variant={platform === value ? "default" : "outline"}
                aria-pressed={platform === value}
                onClick={() => setPlatform(value)}
              >
                {value === "all" ? "All platforms" : PLATFORM_LABELS[value]}
              </Button>
            ))}
            <span className="mx-1 h-5 w-px bg-border" />
            <Button
              size="sm"
              variant={savedOnly ? "default" : "outline"}
              aria-pressed={savedOnly}
              onClick={() => setSavedOnly((v) => !v)}
            >
              Saved
            </Button>
          </div>

          {visible.length ? (
            <div className={cn("grid gap-4 md:grid-cols-2", refreshing && "pointer-events-none opacity-60")}>
              {visible.map((idea) => (
                <IdeaCard key={idea.id} idea={idea} />
              ))}
            </div>
          ) : (
            <p className="py-10 text-center text-sm text-muted-foreground">No opportunities match these filters.</p>
          )}
        </>
      )}
    </div>
  )
}
