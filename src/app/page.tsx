import Link from "next/link"
import {
  ArrowRight,
  FolderPlus,
  LayoutTemplate,
  Palette,
  PenLine,
  Send,
  Sparkles,
  TrendingUp,
  Wand2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCurrentUser } from "@/lib/auth"

const steps = [
  {
    icon: FolderPlus,
    title: "Tell us about your project",
    description: "Paste your website or describe your product, brand or channel. No project yet? We'll help you shape one.",
  },
  {
    icon: TrendingUp,
    title: "See what's trending in your niche",
    description: "We track rising searches and topics across Google, YouTube, TikTok, Instagram and X, filtered for your audience.",
  },
  {
    icon: Wand2,
    title: "Create with AI",
    description: "Generate video scripts, posts, carousels and Reels that match your brand's voice and visual identity.",
  },
  {
    icon: PenLine,
    title: "Polish and publish",
    description: "Fine-tune every creative in a simple editor, then publish to your connected accounts.",
  },
]

const features = [
  {
    icon: Palette,
    title: "On-brand by default",
    description: "Colors, fonts and tone of voice are picked up from your site, so every piece looks and sounds like you.",
  },
  {
    icon: Sparkles,
    title: "Ideas with a reason",
    description: "Every suggestion comes with why it's trending and the hook to open with.",
  },
  {
    icon: LayoutTemplate,
    title: "Every format",
    description: "YouTube scripts, short-form video, single posts, carousels and threads from the same idea.",
  },
  {
    icon: Send,
    title: "One place to ship",
    description: "Connect Instagram, TikTok, X and YouTube and keep your content calendar in one spot.",
  },
]

export default async function Home() {
  const user = await getCurrentUser().catch(() => null)
  const primaryCta = user
    ? { href: "/dashboard", label: "Go to dashboard" }
    : { href: "/signup", label: "Get started for free" }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <TrendingUp className="size-4" />
            </span>
            Prognos
          </Link>
          <nav className="flex items-center gap-2">
            {!user && (
              <Button variant="ghost" asChild>
                <Link href="/login">Sign in</Link>
              </Button>
            )}
            <Button asChild>
              <Link href={primaryCta.href}>{user ? "Dashboard" : "Get started"}</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 -z-10 h-[480px] bg-gradient-to-b from-primary/10 to-transparent" />
          <div className="mx-auto flex max-w-4xl flex-col items-center px-4 py-24 text-center md:py-32">
            <span className="mb-6 rounded-full border border-primary/30 px-3 py-1 text-xs font-medium text-primary">
              For creators, founders and small brands
            </span>
            <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
              Turn what&apos;s trending in your niche into content that fits your brand
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Prognos learns what your project is about, finds the topics that are taking off right now, and helps you
              create scripts, posts and carousels around them in minutes.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href={primaryCta.href}>
                  {primaryCta.label}
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#how-it-works">See how it works</a>
              </Button>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-t bg-muted/30">
          <div className="mx-auto max-w-6xl px-4 py-20">
            <h2 className="text-center text-3xl font-bold tracking-tight">How it works</h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-muted-foreground">
              From &ldquo;what should I post?&rdquo; to a finished creative, in one flow.
            </p>
            <ol className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <li key={step.title} className="rounded-xl border bg-background p-6">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <step.icon className="size-5" />
                    </span>
                    <span className="text-sm font-medium text-muted-foreground">Step {index + 1}</span>
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight">Built for consistent, on-trend content</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {features.map((feature) => (
              <div key={feature.title} className="flex gap-4 rounded-xl border p-6">
                <feature.icon className="mt-1 size-6 shrink-0 text-primary" />
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t">
          <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Stop guessing what to post</h2>
            <p className="mt-3 text-muted-foreground">Set up your first project in a couple of minutes.</p>
            <Button size="lg" className="mt-8" asChild>
              <Link href={primaryCta.href}>
                {primaryCta.label}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Prognos</span>
          <span>Trend-driven content for creators</span>
        </div>
      </footer>
    </div>
  )
}
