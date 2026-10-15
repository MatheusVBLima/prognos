import Link from "next/link"

import { Button } from "@/components/ui/button"
import { StudioShowcase } from "./studio-showcase"

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 md:pt-24">
      <div className="grid gap-10 md:grid-cols-2 md:items-end">
        <div>
          <h1 className="font-light text-5xl leading-[1.05] tracking-tight text-balance sm:text-6xl">
            Know what&apos;s next.
            <br />
            Post it first.
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="/dashboard">Start creating free</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-6">
              <a href="#how-it-works">See how it works</a>
            </Button>
          </div>
        </div>
        <div className="max-w-md md:justify-self-end">
          <p className="text-lg leading-relaxed text-foreground/80">
            Prognos watches the trends in your niche, learns what your project is about, and turns both into
            scripts, posts, carousels and reels you can polish in a built-in editor.
          </p>
          <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <span className="size-1.5 rounded-full bg-chart-3" />
            For creators who would rather film than brainstorm.
          </p>
        </div>
      </div>
      <StudioShowcase />
    </section>
  )
}
