import Link from "next/link"
import { TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ReelFan } from "./reel-fan"
import { gradientFill, gradientText } from "./ui"

const RISING = [
  ["desk setup tour", "+312%"],
  ["budget productivity", "+148%"],
  ["5am routine", "+96%"],
]

export function Hero() {
  return (
    <section className="-mt-10 px-3 sm:-mt-12 sm:px-6">
      <div className="mx-auto max-w-6xl rounded-[calc(var(--radius)*2)] bg-muted/70 px-2 pb-2 pt-20 sm:pt-24">
        <div className="rounded-[calc(var(--radius)*1.6)] bg-card px-4 pb-14 pt-10 text-center shadow-sm sm:px-10 sm:pt-14">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
            {RISING.map(([term, delta]) => (
              <li key={term} className="flex items-center gap-2">
                <TrendingUp className="size-4 text-chart-1" />
                <span className="italic text-muted-foreground">&ldquo;{term}&rdquo;</span>
                <span className="text-chart-1">{delta}</span>
              </li>
            ))}
          </ul>

          <h1 className={`mx-auto mt-8 max-w-4xl text-5xl leading-[1.02] tracking-tight text-balance sm:text-7xl ${gradientText}`}>
            Know what&apos;s trending. Post it first!
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-snug text-balance sm:text-2xl">
            Prognos finds what&apos;s rising in your niche and turns it into scripts, posts, carousels and reels
            that sound like you.
          </p>
          <Button asChild size="lg" className={`mt-8 h-14 rounded-full px-8 text-base uppercase tracking-wide hover:opacity-90 ${gradientFill}`}>
            <Link href="/dashboard">Try Prognos free</Link>
          </Button>
          <p className="mt-3 text-sm text-muted-foreground">No credit card. Your first 10 drafts are on us.</p>

          <ReelFan />
        </div>
      </div>
    </section>
  )
}
