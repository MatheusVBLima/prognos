import Link from "next/link"
import { Check, Link2, PenLine, Plus, Sparkles, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Logo } from "./logo"
import { GrainField, Orb } from "./orb"

const PLATFORMS = ["Instagram", "TikTok", "YouTube", "LinkedIn", "X", "Threads"]

export function Platforms() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-center text-sm text-muted-foreground">Plan once, publish where your audience already is</p>
      <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xl tracking-tight text-foreground/50">
        {PLATFORMS.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    </section>
  )
}

function SectionHeading({ eyebrow, title, body }: { eyebrow: string; title: string; body?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="size-1.5 rounded-full bg-chart-3" />
        {eyebrow}
      </p>
      <h2 className="mt-4 font-light text-4xl leading-tight tracking-tight text-balance sm:text-5xl">{title}</h2>
      {body && <p className="mt-4 text-lg leading-relaxed text-foreground/70">{body}</p>}
    </div>
  )
}

const STEPS = [
  {
    icon: Link2,
    title: "Connect your accounts",
    body: "Link Instagram, TikTok, YouTube and more so Prognos learns your voice and what already works for you.",
  },
  {
    icon: PenLine,
    title: "Describe your project",
    body: "Paste a link or write a few lines about what you make. Prognos maps your niche and the topics around it.",
  },
  {
    icon: Sparkles,
    title: "Generate and polish",
    body: "Pick a rising trend and get a script, post, carousel or reel draft. Tweak it in the editor and ship.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="How it works"
        title="From blank page to publish-ready in three steps"
      />
      <ol className="mt-12 grid gap-4 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <li key={step.title} className="rounded-[var(--radius)] border bg-card p-6">
            <div className="flex items-center justify-between">
              <span className="grid size-10 place-items-center rounded-full bg-muted">
                <step.icon className="size-4" />
              </span>
              <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
            </div>
            <h3 className="mt-8 text-xl tracking-tight">{step.title}</h3>
            <p className="mt-2 leading-relaxed text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

const TREND_BARS = [28, 34, 31, 42, 39, 55, 61, 58, 72, 86, 94, 100]

function BentoCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("relative overflow-hidden rounded-[var(--radius)] border bg-card p-6", className)}>
      {children}
    </div>
  )
}

function BentoText({ title, body }: { title: string; body: string }) {
  return (
    <div className="relative">
      <h3 className="text-xl tracking-tight">{title}</h3>
      <p className="mt-2 leading-relaxed text-muted-foreground">{body}</p>
    </div>
  )
}

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="Features"
        title="Everything between an idea and a post"
        body="Trend research, writing and editing live in one place, tuned to your niche instead of the whole internet."
      />

      <div className="mt-12 grid gap-4 md:grid-cols-6">
        <BentoCard className="md:col-span-4">
          <BentoText
            title="Trend radar for your niche"
            body="Real-time search and social trends, filtered to the topics your audience cares about, with the reason each one is rising."
          />
          <div className="mt-8 flex items-end gap-4">
            <div className="flex h-32 flex-1 items-end gap-1.5">
              {TREND_BARS.map((h, i) => (
                <div
                  key={i}
                  className={cn("flex-1 rounded-t-md", i >= 9 ? "bg-chart-3" : "bg-muted")}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="hidden shrink-0 space-y-2 text-sm sm:block">
              {[
                ["desk setup tour", "+312%"],
                ["budget productivity", "+148%"],
                ["morning routine 2026", "+96%"],
              ].map(([term, delta]) => (
                <div key={term} className="flex items-center justify-between gap-6 rounded-full border px-3 py-1.5">
                  <span>{term}</span>
                  <span className="flex items-center gap-1 text-chart-1">
                    <TrendingUp className="size-3.5" />
                    {delta}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </BentoCard>

        <BentoCard className="md:col-span-2">
          <BentoText title="Knows your project" body="Drop a link or a short brief. Every idea starts from what you actually make." />
          <div className="mt-8 rounded-full border bg-background px-4 py-2.5 text-sm text-muted-foreground">
            prognos.app/my-channel
            <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-foreground" />
          </div>
        </BentoCard>

        <BentoCard className="md:col-span-2">
          <BentoText title="Scripts with a hook" body="Timed beats, a first line that stops the scroll, and a clear call to action." />
          <div className="mt-8 space-y-2">
            {["w-full", "w-4/5", "w-3/5"].map((w) => (
              <div key={w} className={cn("h-2.5 rounded-full bg-muted", w)} />
            ))}
          </div>
        </BentoCard>

        <BentoCard className="md:col-span-2">
          <BentoText title="Carousels and reels" body="Slide-by-slide carousels and shot lists for reels, sized for every platform." />
          <div className="mt-8 flex justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="-mx-3 aspect-[4/5] w-20 rounded-xl border bg-background shadow-sm"
                style={{ transform: `rotate(${(i - 1) * 8}deg) translateY(${i === 1 ? -6 : 0}px)` }}
              />
            ))}
          </div>
        </BentoCard>

        <BentoCard className="isolate md:col-span-2">
          <GrainField className="-z-10 opacity-70" />
          <BentoText title="A mini editor built in" body="Rewrite a line, change the tone, or swap a slide without leaving the draft." />
          <div className="mt-8 flex flex-wrap gap-2">
            {["Shorter", "Funnier", "More direct", "Add emoji"].map((t) => (
              <span key={t} className="rounded-full bg-background/80 px-3 py-1 text-xs backdrop-blur">
                {t}
              </span>
            ))}
          </div>
        </BentoCard>
      </div>
    </section>
  )
}

const PLANS = [
  {
    name: "Free",
    price: "$0",
    blurb: "Try Prognos on one project.",
    features: ["1 project", "Daily trend digest", "10 generations a month", "Scripts and posts"],
    cta: "Start free",
  },
  {
    name: "Creator",
    price: "$19",
    blurb: "For creators posting every week.",
    features: ["5 projects", "Real-time trend radar", "Unlimited generations", "Carousels and reels", "Mini editor"],
    cta: "Start 7-day trial",
    popular: true,
  },
  {
    name: "Studio",
    price: "$49",
    blurb: "For teams and agencies.",
    features: ["Unlimited projects", "Up to 5 seats", "Shared brand voices", "Priority support"],
    cta: "Talk to us",
  },
]

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-24 sm:px-6">
      <SectionHeading eyebrow="Pricing" title="Simple plans that grow with your channel" />
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative isolate flex flex-col overflow-hidden rounded-[var(--radius)] border bg-card p-6",
              plan.popular && "border-transparent",
            )}
          >
            {plan.popular && <GrainField className="-z-10" />}
            <div className="flex items-center justify-between">
              <h3 className="text-xl tracking-tight">{plan.name}</h3>
              {plan.popular && (
                <span className="rounded-full bg-background/80 px-3 py-1 text-xs backdrop-blur">Most popular</span>
              )}
            </div>
            <p className={cn("mt-2 text-sm", plan.popular ? "text-foreground/80" : "text-muted-foreground")}>
              {plan.blurb}
            </p>
            <p className="mt-6 flex items-baseline gap-1">
              <span className="font-light text-5xl tracking-tight">{plan.price}</span>
              <span className={cn("text-sm", plan.popular ? "text-foreground/70" : "text-muted-foreground")}>/month</span>
            </p>
            <ul className="mt-6 flex-1 space-y-2.5 text-sm">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <Check className="size-4 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Button
              asChild
              variant={plan.popular ? "default" : "outline"}
              className="mt-8 w-full rounded-full"
            >
              <Link href="/dashboard">{plan.cta}</Link>
            </Button>
          </div>
        ))}
      </div>
    </section>
  )
}

const FAQS = [
  {
    q: "Which platforms does Prognos support?",
    a: "You can generate content for Instagram, TikTok, YouTube Shorts, LinkedIn, X and Threads. Connecting accounts is optional, but it helps Prognos match your voice.",
  },
  {
    q: "Where do the trends come from?",
    a: "Prognos combines search trends with what is gaining traction on social platforms, then filters everything down to the topics around your project.",
  },
  {
    q: "Will the content sound like me?",
    a: "Each project keeps its own brief and voice. The more you edit drafts in the mini editor, the closer new drafts get to how you write.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Plans are monthly and you can downgrade to Free whenever you want without losing your projects.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="mx-auto grid max-w-6xl scroll-mt-20 gap-10 px-4 py-24 sm:px-6 md:grid-cols-[1fr_1.4fr]">
      <SectionHeading eyebrow="FAQ" title="Questions, answered" />
      <div className="divide-y border-y">
        {FAQS.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg tracking-tight [&::-webkit-details-marker]:hidden">
              {item.q}
              <Plus className="size-4 shrink-0 transition-transform duration-150 group-open:rotate-45" />
            </summary>
            <p className="mt-3 leading-relaxed text-muted-foreground">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

export function FinalCta() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
      <div className="relative isolate flex flex-col items-center overflow-hidden rounded-[calc(var(--radius)+0.5rem)] bg-muted/60 px-6 pb-40 pt-20 text-center">
        <Orb tone="ember" breathe className="absolute -bottom-48 left-1/2 -z-10 size-72 -translate-x-1/2 opacity-90" />
        <h2 className="max-w-xl font-light text-4xl leading-tight tracking-tight text-balance sm:text-5xl">
          Your next post is already trending.
        </h2>
        <p className="mt-4 max-w-md text-lg text-foreground/70">Find it before everyone else does.</p>
        <Button asChild size="lg" className="mt-8 rounded-full px-6">
          <Link href="/dashboard">Start creating free</Link>
        </Button>
      </div>
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Logo className="text-base text-foreground" />
        <nav className="flex flex-wrap gap-6">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="#faq" className="hover:text-foreground">FAQ</a>
        </nav>
        <p>&copy; {new Date().getFullYear()} Prognos</p>
      </div>
    </footer>
  )
}
