"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { Bookmark, BookmarkCheck, ChevronDown, ExternalLink, PenLine, Play, Search, Newspaper, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { InterestChart } from "@/components/trends/InterestChart"
import { setIdeaStatusAction } from "@/app/dashboard/trends/actions"
import type { TrendIdea } from "@/lib/trends/queries"
import { cn } from "@/lib/utils"

export const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
}

const FORMAT_LABELS: Record<string, string> = {
  reel: "Reel",
  short: "Short",
  carousel: "Carousel",
  post: "Post",
  youtube_video: "YouTube video",
  thread: "Thread",
}

const EVIDENCE_ICONS = { query: Search, video: Play, article: Newspaper }

function ScoreBadge({ score }: { score: number }) {
  const tone =
    score >= 75
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400"
      : score >= 55
        ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
        : "bg-muted text-muted-foreground"
  return (
    <div className={cn("flex size-12 shrink-0 flex-col items-center justify-center rounded-full", tone)}>
      <span className="text-lg leading-none font-bold">{score}</span>
      <span className="text-[9px] tracking-wide uppercase opacity-80">score</span>
    </div>
  )
}

function Meter({ label, value, invert }: { label: string; value: number; invert?: boolean }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{label}</span>
        <span>{value}/10</span>
      </div>
      <div className="h-1.5 rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", invert ? "bg-amber-500" : "bg-primary")}
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  )
}

function studioHref(idea: TrendIdea) {
  const facts = [
    idea.why_now,
    ...idea.evidence.map((e) => (e.metric ? `${e.label} (${e.metric})` : e.label)),
    ...idea.hooks.map((hook) => `Possible hook: ${hook}`),
  ]
  const params = new URLSearchParams({
    trend: idea.title,
    description: idea.summary,
    score: String(idea.score),
    hints: JSON.stringify(facts),
  })
  return `/dashboard/studio?${params}`
}

export function IdeaCard({ idea }: { idea: TrendIdea }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const saved = idea.status === "saved"
  const setStatus = (status: string) => startTransition(() => setIdeaStatusAction(idea.id, status))

  return (
    <Card className={cn("gap-4", pending && "opacity-60")}>
      <CardHeader className="flex flex-row items-start gap-3">
        <ScoreBadge score={idea.score} />
        <div className="min-w-0 flex-1 space-y-1.5">
          <h3 className="leading-snug font-semibold">{idea.title}</h3>
          <div className="flex flex-wrap gap-1.5">
            {idea.platforms.map((platform) => (
              <Badge key={platform} variant="secondary">
                {PLATFORM_LABELS[platform] ?? platform}
              </Badge>
            ))}
            {idea.formats.slice(0, 2).map((format) => (
              <Badge key={format} variant="outline">
                {FORMAT_LABELS[format] ?? format}
              </Badge>
            ))}
            {idea.status === "used" && <Badge variant="outline">Script written</Badge>}
          </div>
        </div>
        <div className="flex shrink-0 gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label={saved ? "Remove from saved" : "Save idea"}
            aria-pressed={saved}
            onClick={() => setStatus(saved ? "new" : "saved")}
          >
            {saved ? <BookmarkCheck className="size-4 text-primary" /> : <Bookmark className="size-4" />}
          </Button>
          <Button variant="ghost" size="icon" aria-label="Dismiss idea" onClick={() => setStatus("dismissed")}>
            <X className="size-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm">{idea.why_now}</p>
        {idea.interest.length > 1 && <InterestChart points={idea.interest} keyword={idea.keywords[0]} />}

        <Collapsible open={open} onOpenChange={setOpen}>
          <CollapsibleTrigger asChild>
            <button type="button" className="flex items-center gap-1 text-sm font-medium text-primary">
              {open ? "Hide details" : "Hooks, evidence and score"}
              <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-4 space-y-5">
            <p className="text-sm text-muted-foreground">{idea.summary}</p>

            {idea.hooks.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Opening hooks</h4>
                <ul className="space-y-1.5 text-sm">
                  {idea.hooks.map((hook) => (
                    <li key={hook} className="rounded-md bg-muted px-3 py-2">
                      “{hook}”
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {idea.evidence.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Why we think so</h4>
                <ul className="space-y-1.5 text-sm">
                  {idea.evidence.map((item, index) => {
                    const Icon = EVIDENCE_ICONS[item.type] ?? Search
                    const body = (
                      <>
                        <Icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                        <span className="min-w-0 flex-1">
                          <span className="line-clamp-2">{item.label}</span>
                          {item.metric && <span className="text-xs text-muted-foreground">{item.metric}</span>}
                        </span>
                        {item.url && <ExternalLink className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />}
                      </>
                    )
                    return (
                      <li key={index}>
                        {item.url ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex gap-2 rounded-md p-1 -m-1 hover:bg-accent"
                          >
                            {body}
                          </a>
                        ) : (
                          <div className="flex gap-2">{body}</div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-3">
              <Meter label="Momentum" value={idea.momentum} />
              <Meter label="Fit" value={idea.fit} />
              <Meter label="Competition" value={idea.competition} invert />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>

      <CardFooter className="mt-auto">
        <Button asChild className="w-full sm:w-auto">
          <Link href={studioHref(idea)} onClick={() => idea.status === "new" && setIdeaStatusAction(idea.id, "used")}>
            <PenLine className="size-4" />
            Write script
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
