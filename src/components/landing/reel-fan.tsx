import { Heart, Play } from "lucide-react"

import { cn } from "@/lib/utils"

// A fan of vertical reel cards, like the portrait row in motionsites' "Nouver" hero.
// Cards are pure CSS gradients from theme colours; swap in real thumbnails later.
const REELS = [
  { hook: "I tried the 5am routine for 30 days", tag: "Reel", views: "48k", from: "var(--chart-4)", to: "var(--primary)" },
  { hook: "3 free swaps for a better desk", tag: "TikTok", views: "212k", from: "var(--chart-3)", to: "var(--chart-2)" },
  { hook: "Stop buying productivity apps", tag: "Short", views: "1.2M", from: "var(--primary)", to: "var(--chart-3)", main: true },
  { hook: "My $12 lamp beat a $200 one", tag: "Carousel", views: "87k", from: "var(--chart-1)", to: "var(--chart-4)" },
  { hook: "Cable management in 60 seconds", tag: "Reel", views: "33k", from: "var(--chart-2)", to: "var(--chart-1)" },
]

const TILT = ["-rotate-12 translate-y-10", "-rotate-6 translate-y-3", "z-10 scale-110", "rotate-6 translate-y-3", "rotate-12 translate-y-10"]

export function ReelFan() {
  return (
    <div aria-hidden className="mx-auto mt-14 flex max-w-4xl items-end justify-center pb-10">
      {REELS.map((reel, i) => (
        <div
          key={reel.hook}
          className={cn(
            "relative -mx-3 aspect-[9/16] w-28 shrink-0 overflow-hidden rounded-2xl border-4 border-card text-left text-white shadow-xl transition-transform duration-300 hover:-translate-y-2 sm:-mx-4 sm:w-44",
            TILT[i],
            (i === 0 || i === 4) && "hidden sm:block",
          )}
          style={{ backgroundImage: `linear-gradient(160deg, ${reel.from}, ${reel.to})` }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgb(255_255_255/0.35),transparent_55%)]" />
          <span className="absolute left-2.5 top-2.5 rounded-full bg-black/30 px-2 py-0.5 text-[10px] uppercase tracking-wide backdrop-blur">
            {reel.tag}
          </span>
          {reel.main && (
            <span className="absolute left-1/2 top-[38%] grid size-12 -translate-x-1/2 place-items-center rounded-full bg-white/90 text-black">
              <Play className="size-5 translate-x-0.5 fill-current" />
            </span>
          )}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-10">
            <p className="text-xs leading-snug sm:text-sm">{reel.hook}</p>
            <p className="mt-1.5 flex items-center gap-1 text-[10px] opacity-80">
              <Heart className="size-3 fill-current" /> {reel.views}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
