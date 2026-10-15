"use client"

import { useState } from "react"
import { Clapperboard, FileText, GalleryHorizontal, MessageSquareText } from "lucide-react"

import { cn } from "@/lib/utils"
import { AppWindow, Bubble, pastel, type Pastel } from "./ui"

type Format = {
  id: string
  label: string
  pastel: Pastel
  icon: React.ComponentType<{ className?: string }>
  trend: string
  output: React.ReactNode
}

const FORMATS: Format[] = [
  {
    id: "scripts",
    label: "Scripts",
    pastel: "peach",
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
    pastel: "lilac",
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
                i === 0 ? "bg-primary text-primary-foreground" : "bg-card",
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
    pastel: "sky",
    icon: Clapperboard,
    trend: "Short tutorials under 30s are winning in your niche",
    output: (
      <div className="grid grid-cols-4 gap-2">
        {["Hook close-up", "B-roll: cables", "Reveal pan", "Text overlay"].map((shot, i) => (
          <div key={shot} className="space-y-1.5">
            <div className="relative aspect-[9/16] overflow-hidden rounded-lg bg-card">
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
    pastel: "mint",
    icon: MessageSquareText,
    trend: "Questions get 2.4× more replies than statements",
    output: (
      <div className="space-y-3 text-sm leading-relaxed">
        <p>Unpopular opinion: you don&apos;t need a new desk. You need a better lamp.</p>
        <p>I tested 4 lighting setups for a week. The $12 one won. Here is why it matters for focus.</p>
        <p className="text-primary">What is the cheapest upgrade that changed your workspace?</p>
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

const TRENDS = [
  ["desk setup tour", "+312%"],
  ["budget productivity", "+148%"],
  ["5am routine", "+96%"],
  ["cable management", "+71%"],
]

export function StudioShowcase() {
  const [active, setActive] = useState(FORMATS[0].id)
  const format = FORMATS.find((f) => f.id === active) ?? FORMATS[0]
  const Icon = format.icon

  return (
    <div className="relative mx-auto mt-14 max-w-4xl text-left">
      <Bubble className="absolute -left-4 -top-6 z-10 hidden -rotate-3 md:block">
        Hook ready in 4 seconds 👋
      </Bubble>
      <Bubble tail="right" className="absolute -bottom-6 -right-4 z-10 hidden rotate-2 md:block">
        This one fits your channel ✌️
      </Bubble>

      <AppWindow title="Prognos Studio · My desk channel">
        <div className="grid md:grid-cols-[14rem_1fr]">
          <aside className="hidden border-r-2 border-foreground/90 p-4 md:block" style={pastel("lilac")}>
            <p className="text-xs uppercase tracking-widest text-primary">Rising in your niche</p>
            <ul className="mt-3 space-y-2 text-sm">
              {TRENDS.map(([term, delta], i) => (
                <li
                  key={term}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-lg px-2.5 py-2",
                    i === 0 && "bg-card shadow-sm",
                  )}
                >
                  <span className="truncate">{term}</span>
                  <span className="shrink-0 text-xs text-chart-1">{delta}</span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="p-4 sm:p-6">
            <div role="tablist" aria-label="Content formats" className="flex flex-wrap gap-2">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  role="tab"
                  type="button"
                  aria-selected={f.id === active}
                  aria-controls={`showcase-${f.id}`}
                  onClick={() => setActive(f.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-full border-2 px-3.5 py-1.5 text-sm transition-colors duration-150",
                    f.id === active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground/40",
                  )}
                >
                  <f.icon className="size-4" />
                  {f.label}
                </button>
              ))}
            </div>

            <div id={`showcase-${format.id}`} role="tabpanel" className="mt-5 rounded-xl p-4 sm:p-5" style={pastel(format.pastel)}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="flex items-center gap-2 text-sm">
                  <Icon className="size-4" />
                  Generated {format.label.toLowerCase().replace(/s$/, "")}
                </span>
                <span className="hidden text-right text-xs text-muted-foreground sm:block">{format.trend}</span>
              </div>
              {format.output}
            </div>
          </div>
        </div>
      </AppWindow>
    </div>
  )
}
