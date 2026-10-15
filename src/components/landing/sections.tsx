import Link from "next/link"
import {
  Check,
  Clapperboard,
  FileText,
  GalleryHorizontal,
  Link2,
  PenLine,
  Plus,
  Sparkles,
  Users,
  Wand2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Logo } from "./logo"
import { StudioShowcase } from "./studio-showcase"
import { AppWindow, Bubble, Eyebrow, Scallop, gradientFill, gradientText, pastel, styles, type Pastel } from "./ui"

const PLATFORMS = ["Instagram", "TikTok", "YouTube Shorts", "LinkedIn", "X", "Threads", "Pinterest"]

export function Platforms() {
  const row = [...PLATFORMS, ...PLATFORMS]
  return (
    <section className="py-14">
      <p className="text-center text-sm uppercase tracking-widest text-muted-foreground">
        Made for every feed your audience scrolls
      </p>
      <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <ul className={cn("flex w-max gap-14 text-2xl tracking-tight text-foreground/40", styles.marquee)}>
          {row.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function SectionHeading({
  eyebrow,
  title,
  body,
  center = true,
  invert = false,
}: {
  eyebrow: string
  title: React.ReactNode
  body?: string
  center?: boolean
  invert?: boolean
}) {
  return (
    <div className={cn("max-w-3xl", center && "mx-auto text-center")}>
      <Eyebrow className={cn(invert && "text-primary-foreground/80")}>{eyebrow}</Eyebrow>
      <h2 className="mt-3 text-4xl leading-[1.05] tracking-tight text-balance sm:text-6xl">{title}</h2>
      {body && (
        <p className={cn("mt-5 text-lg leading-snug text-balance sm:text-xl", invert ? "text-primary-foreground/85" : "text-foreground/75")}>
          {body}
        </p>
      )}
    </div>
  )
}

export function TrendRadar() {
  return (
    <section id="trend-radar" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-20 sm:px-6">
      <SectionHeading
        eyebrow="Trend radar"
        title={
          <>
            Spot the wave, <span className={gradientText}>then ride it.</span>
          </>
        }
        body="Prognos tracks what's rising in your niche every day and drafts content for it in the format you need."
      />
      <div className="mt-14">
        <StudioShowcase />
      </div>
    </section>
  )
}

const STEPS: { icon: React.ComponentType<{ className?: string }>; title: string; body: string; tone: Pastel }[] = [
  {
    icon: Link2,
    title: "Connect your accounts",
    body: "Link Instagram, TikTok, YouTube and more so Prognos learns your voice and what already works.",
    tone: "sky",
  },
  {
    icon: PenLine,
    title: "Tell us about your project",
    body: "Paste a link or write a few lines. Prognos maps your niche and the topics around it.",
    tone: "peach",
  },
  {
    icon: Sparkles,
    title: "Generate, tweak, post",
    body: "Pick a rising trend, get a draft in any format and polish it in the mini editor.",
    tone: "mint",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-28 pt-10">
      <Scallop edge="top" />
      <div className="bg-primary px-4 py-20 text-primary-foreground sm:px-6">
        <div className="mx-auto max-w-6xl">
          <SectionHeading eyebrow="How it works" title="Three steps. Zero blank pages." invert />
          <ol className="mt-14 grid gap-6 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="rounded-[var(--radius)] bg-card p-7 text-card-foreground shadow-xl">
                <div className="flex items-center gap-3">
                  <span className="grid size-12 place-items-center rounded-full text-primary" style={pastel(step.tone)}>
                    <step.icon className="size-5" />
                  </span>
                  <span className={cn("text-4xl", gradientText)}>{i + 1}</span>
                </div>
                <h3 className="mt-6 text-2xl tracking-tight">{step.title}</h3>
                <p className="mt-2 leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <Scallop edge="bottom" />
    </section>
  )
}

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-24 sm:px-6">
      <SectionHeading
        eyebrow="Features"
        title={
          <>
            Everything between an idea <span className={gradientText}>and a post.</span>
          </>
        }
      />

      <div className="mt-14 grid gap-5 md:grid-cols-3">
        <FeatureCard tone="peach" icon={FileText} title="Scripts with a hook" body="Timed beats, a first line that stops the scroll and a clear call to action.">
          <AppWindow className="mt-6 shadow-[4px_4px_0_0_var(--foreground)]">
            <div className="space-y-2 p-4 text-xs">
              <p><span className="text-primary">0:00 HOOK</span> I spent $0 on this desk setup.</p>
              <p className="text-muted-foreground"><span className="text-primary">0:04</span> Before: cables everywhere...</p>
            </div>
          </AppWindow>
        </FeatureCard>

        <FeatureCard tone="lilac" icon={GalleryHorizontal} title="Carousels that get saved" body="Slide-by-slide copy and layout, sized for Instagram and LinkedIn.">
          <div className="mt-6 flex justify-center">
            {["Hook", "Tip", "Save!"].map((t, i) => (
              <div
                key={t}
                className={cn(
                  "-mx-2 grid aspect-[4/5] w-24 place-items-center rounded-xl border-2 border-foreground/90 text-sm shadow-[3px_3px_0_0_var(--foreground)]",
                  i === 0 ? "bg-primary text-primary-foreground" : "bg-card",
                )}
                style={{ transform: `rotate(${(i - 1) * 7}deg)` }}
              >
                {t}
              </div>
            ))}
          </div>
        </FeatureCard>

        <FeatureCard tone="sky" icon={Clapperboard} title="Reels, shot by shot" body="A shot list with on-screen text and timing, ready to film.">
          <div className="mt-6 grid grid-cols-4 gap-2">
            {["Hook", "B-roll", "Reveal", "CTA"].map((t, i) => (
              <div key={t} className="grid aspect-[9/16] place-items-end rounded-lg border-2 border-foreground/90 bg-card p-1.5 text-[10px]">
                <span className="w-full rounded bg-foreground/10 px-1">{i + 1}. {t}</span>
              </div>
            ))}
          </div>
        </FeatureCard>

        <FeatureCard tone="mint" icon={Wand2} title="A mini editor built in" body="Rewrite a line, change the tone or swap a slide without leaving the draft." className="md:col-span-2">
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex-1 rounded-xl border-2 border-foreground/90 bg-card p-4 text-sm shadow-[4px_4px_0_0_var(--foreground)]">
              Unpopular opinion: you don&apos;t need a new desk.{" "}
              <mark className="rounded bg-chart-3/30 px-1 text-foreground">You need a better lamp.</mark>
            </div>
            <div className="flex flex-wrap gap-2">
              {["Shorter", "Funnier", "More direct", "Add emoji 🎉"].map((t) => (
                <span key={t} className="rounded-full border-2 border-foreground/90 bg-card px-3 py-1 text-xs">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </FeatureCard>

        <FeatureCard tone="sun" icon={Users} title="Knows your voice" body="Connected accounts and your project brief keep every draft on brand.">
          <div className="mt-6 flex -space-x-3">
            {["var(--primary)", "var(--chart-3)", "var(--chart-1)", "var(--chart-4)"].map((c) => (
              <span key={c} className="size-11 rounded-full border-4 border-card" style={{ background: c }} />
            ))}
            <span className="grid size-11 place-items-center rounded-full border-4 border-card bg-foreground text-xs text-background">+2</span>
          </div>
        </FeatureCard>
      </div>
    </section>
  )
}

function FeatureCard({
  tone,
  icon: Icon,
  title,
  body,
  className,
  children,
}: {
  tone: Pastel
  icon: React.ComponentType<{ className?: string }>
  title: string
  body: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn("overflow-hidden rounded-[var(--radius)] p-7", className)} style={pastel(tone)}>
      <span className="grid size-11 place-items-center rounded-full bg-card text-primary shadow-sm">
        <Icon className="size-5" />
      </span>
      <h3 className="mt-5 text-2xl tracking-tight">{title}</h3>
      <p className="mt-2 leading-relaxed text-foreground/70">{body}</p>
      {children}
    </div>
  )
}

const PLANS = [
  {
    name: "Free",
    price: "$0",
    blurb: "Try Prognos on one project.",
    features: ["1 project", "Daily trend digest", "10 drafts a month", "Scripts and posts"],
    cta: "Start free",
  },
  {
    name: "Creator",
    price: "$19",
    blurb: "For creators posting every week.",
    features: ["5 projects", "Real-time trend radar", "Unlimited drafts", "Carousels and reels", "Mini editor"],
    cta: "Try Creator free",
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
    <section id="pricing" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-24 sm:px-6">
      <SectionHeading eyebrow="Pricing" title="Pick a plan, start posting." />
      <div className="mt-14 grid items-center gap-6 md:grid-cols-3">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "rounded-[var(--radius)]",
              plan.popular ? "bg-gradient-to-br from-primary to-chart-3 p-1 shadow-2xl md:scale-105" : "border bg-card",
            )}
          >
            <div className="flex h-full flex-col rounded-[calc(var(--radius)-0.25rem)] bg-card p-7">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl tracking-tight">{plan.name}</h3>
                {plan.popular && (
                  <span className={cn("-rotate-3 rounded-full px-3 py-1 text-xs uppercase tracking-wide", gradientFill)}>
                    Most popular
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{plan.blurb}</p>
              <p className="mt-6 flex items-baseline gap-1">
                <span className={cn("text-6xl tracking-tight", plan.popular && gradientText)}>{plan.price}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </p>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5">
                    <span className="grid size-5 shrink-0 place-items-center rounded-full text-primary" style={pastel("lilac")}>
                      <Check className="size-3" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                size="lg"
                variant={plan.popular ? "default" : "secondary"}
                className={cn("mt-8 w-full rounded-full uppercase tracking-wide", plan.popular && `hover:opacity-90 ${gradientFill}`)}
              >
                <Link href="/dashboard">{plan.cta}</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

const FAQS = [
  {
    q: "Which platforms does Prognos support?",
    a: "You can create content for Instagram, TikTok, YouTube Shorts, LinkedIn, X and Threads. Connecting accounts is optional, but it helps Prognos match your voice.",
  },
  {
    q: "Where do the trends come from?",
    a: "Prognos combines search trends with what's gaining traction on social platforms, then filters everything down to the topics around your project.",
  },
  {
    q: "Will the content sound like me?",
    a: "Each project keeps its own brief and voice. The more you edit drafts in the mini editor, the closer new drafts get to how you write.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Plans are monthly and you can go back to Free whenever you want without losing your projects.",
  },
]

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-28 px-4 py-24 sm:px-6">
      <SectionHeading eyebrow="FAQs" title="Questions? We've got you." />
      <div className="mt-12 space-y-3">
        {FAQS.map((item) => (
          <details key={item.q} className="group rounded-[var(--radius)] border bg-card px-6 py-5 open:shadow-md">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg tracking-tight [&::-webkit-details-marker]:hidden">
              {item.q}
              <span className="grid size-8 shrink-0 place-items-center rounded-full text-primary transition-transform duration-150 group-open:rotate-45" style={pastel("lilac")}>
                <Plus className="size-4" />
              </span>
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
    <section className="px-3 pb-16 sm:px-6">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[calc(var(--radius)*2)] bg-gradient-to-br from-primary via-chart-2 to-chart-3 px-6 py-20 text-center text-primary-foreground">
        <Bubble className="absolute left-8 top-10 hidden -rotate-6 lg:block">Posted 3 reels this week 🔥</Bubble>
        <Bubble tail="right" className="absolute bottom-10 right-8 hidden rotate-3 lg:block">My hooks finally land 🙌</Bubble>
        <h2 className="mx-auto max-w-3xl text-4xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
          Your next post is already trending.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-primary-foreground/85 sm:text-xl">Find it before everyone else does.</p>
        <Button asChild size="lg" variant="secondary" className="mt-8 h-14 rounded-full px-8 text-base uppercase tracking-wide">
          <Link href="/dashboard">Try Prognos free</Link>
        </Button>
      </div>
    </section>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Logo className="text-lg" />
        <nav className="flex flex-wrap gap-6">
          <a href="#features" className="hover:text-primary">Features</a>
          <a href="#trend-radar" className="hover:text-primary">Trend radar</a>
          <a href="#pricing" className="hover:text-primary">Pricing</a>
          <a href="#faq" className="hover:text-primary">FAQs</a>
        </nav>
        <p>&copy; {new Date().getFullYear()} Prognos. Made for creators.</p>
      </div>
    </footer>
  )
}
