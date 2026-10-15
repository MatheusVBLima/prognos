"use client"

import { useState } from "react"
import { Clapperboard, FileText, GalleryHorizontal, MessageSquareText } from "lucide-react"

import { cn } from "@/lib/utils"
import { Orb, type OrbTone } from "./orb"

type Format = {
  id: string
  label: string
  dot: string
  tone: OrbTone
  icon: React.ComponentType<{ className?: string }>
  trend: string
  output: React.ReactNode
}

const FORMATS: Format[] = [
  {
    id: "scripts",
    label: "Scripts",
    dot: "bg-chart-3",
    tone: "ember",
    icon: FileText,
    trend: "“desk setup tour” is up 312% this week",
    output: (
      <ol className="space-y-3 text-sm">
        <ScriptLine time="0:00" label="Hook">
          I spent $0 on this desk setup. Here is what changed my workday.
        </ScriptLine>
        <ScriptLine time="0:04" label="Beat 1">
          Before: cables everywhere, one sad lamp. Cut to the reveal.
        </ScriptLine>
        <ScriptLine time="0:12" label="Beat 2">
          Three swaps that cost nothing: light, height, and one shelf.
        </ScriptLine>
        <ScriptLine time="0:25" label="CTA">
          Save this for your next weekend reset.
        </ScriptLine>
      </ol>
    ),
  },
  {
    id: "carousels",
    label: "Carousels",
    dot: "bg-chart-2",
    tone: "violet",
    icon: GalleryHorizontal,
    trend: "Saves on “budget productivity” posts doubled",
    output: (
      <div className="flex gap-3 overflow-hidden">
        {["5 free tools that replaced my $200 stack", "1. Notes that link themselves", "2. A calendar that plans for you"].map(
          (text, i) => (
            <div
              key={text}
              className={cn(
                "flex aspect-[4/5] w-36 shrink-0 flex-col justify-between rounded-xl border p-3 text-xs",
                i === 0 ? "bg-foreground text-background" : "bg-card",
              )}
            >
              <span className="opacity-60">{i + 1}/7</span>
              <span className="text-sm leading-snug">{text}</span>
            </div>
          ),
        )}
      </div>
    ),
  },
  {
    id: "reels",
    label: "Reels",
    dot: "bg-chart-4",
    tone: "sky",
    icon: Clapperboard,
    trend: "Short tutorials under 30s are winning in your niche",
    output: (
      <div className="grid grid-cols-4 gap-2">
        {["Hook close-up", "B-roll: cables", "Reveal pan", "Text overlay"].map((shot, i) => (
          <div key={shot} className="space-y-1.5">
            <div className="relative aspect-[9/16] overflow-hidden rounded-lg bg-muted">
              <div className="absolute inset-x-2 bottom-2 h-1 rounded-full bg-foreground/10">
                <div className="h-full rounded-full bg-chart-4" style={{ width: `${(i + 1) * 25}%` }} />
              </div>
            </div>
            <p className="text-[11px] leading-tight text-muted-foreground">{shot}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "posts",
    label: "Posts",
    dot: "bg-chart-1",
    tone: "moss",
    icon: MessageSquareText,
    trend: "Questions get 2.4× more replies than statements",
    output: (
      <div className="space-y-3 text-sm leading-relaxed">
        <p>Unpopular opinion: you don&apos;t need a new desk. You need a better lamp.</p>
        <p>I tested 4 lighting setups for a week. The $12 one won. Here is why it matters for focus.</p>
        <p className="text-muted-foreground">What is the cheapest upgrade that changed your workspace?</p>
      </div>
    ),
  },
]

function ScriptLine({ time, label, children }: { time: string; label: string; children: React.ReactNode }) {
  return (
    <li className="grid grid-cols-[3rem_1fr] gap-3">
      <span className="font-mono text-xs text-muted-foreground">{time}</span>
      <span>
        <span className="mr-2 text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        {children}
      </span>
    </li>
  )
}

const SIDE_TONES: OrbTone[] = ["pearl", "violet", "moss", "pearl"]

export function StudioShowcase() {
  const [active, setActive] = useState(FORMATS[0].id)
  const format = FORMATS.find((f) => f.id === active) ?? FORMATS[0]
  const Icon = format.icon

  return (
    <div className="mt-14 rounded-[calc(var(--radius)+0.5rem)] border bg-muted/60 p-1.5 md:mt-20">
      <div role="tablist" aria-label="Content formats" className="grid grid-cols-2 gap-1 sm:grid-cols-4">
        {FORMATS.map((f) => (
          <button
            key={f.id}
            role="tab"
            type="button"
            aria-selected={f.id === active}
            aria-controls={`showcase-${f.id}`}
            onClick={() => setActive(f.id)}
            className={cn(
              "flex items-center justify-center gap-2 rounded-[var(--radius)] px-4 py-2.5 text-sm transition-colors duration-150",
              f.id === active
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className={cn("size-2 rounded-full", f.dot)} />
            {f.label}
          </button>
        ))}
      </div>

      <div
        id={`showcase-${format.id}`}
        role="tabpanel"
        className="relative grid gap-8 overflow-hidden px-4 py-10 sm:px-8 md:grid-cols-[1fr_1.1fr] md:items-center md:py-14"
      >
        <div className="relative flex items-center justify-center">
          <Orb tone={SIDE_TONES[0]} className="absolute -left-10 hidden size-28 opacity-80 lg:grid" />
          <Orb tone={SIDE_TONES[1]} className="absolute left-6 size-24 opacity-90 sm:size-32 lg:left-12" />
          <Orb tone={format.tone} breathe className="z-10 size-52 sm:size-60">
            <span className="grid size-14 place-items-center rounded-full bg-background text-foreground shadow-md">
              <Icon className="size-5" />
            </span>
          </Orb>
          <Orb tone={SIDE_TONES[2]} className="absolute right-6 size-24 opacity-90 sm:size-32 lg:right-12" />
          <Orb tone={SIDE_TONES[3]} className="absolute -right-10 hidden size-28 opacity-80 lg:grid" />
        </div>

        <div className="relative z-10 rounded-[var(--radius)] border bg-card p-5 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-4 border-b pb-4">
            <span className="text-sm">Generated {format.label.toLowerCase().replace(/s$/, "")}</span>
            <span className="flex items-center gap-1.5 text-right text-xs text-muted-foreground">
              <span className={cn("size-1.5 shrink-0 rounded-full", format.dot)} />
              {format.trend}
            </span>
          </div>
          {format.output}
        </div>
      </div>
    </div>
  )
}
