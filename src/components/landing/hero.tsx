import { cn } from "@/lib/utils"
import { ExplodedPost } from "./drawings"
import styles from "./manual.module.css"
import { ManualButton, Stamp, Tag, mono } from "./primitives"

const TITLE_BLOCK = [
  ["Scale", "9:16"],
  ["Sheet", "1 / 6"],
  ["Explode", "×1.00"],
  ["Drawn", "Prognos AI"],
]

export function Hero() {
  return (
    <section className="mx-auto max-w-[1180px] px-4 pt-6 sm:px-6 sm:pt-5">
      <div className={cn(styles.paper, styles.plate, "relative border border-foreground")}>
        {/* Zone ruler */}
        <div className={cn(mono, "grid grid-cols-8 border-b border-foreground text-center text-[9px] text-muted-foreground")}>
          {[8, 7, 6, 5, 4, 3, 2, 1].map((n) => (
            <span key={n} className="border-r border-foreground py-1 last:border-r-0">
              {n}
            </span>
          ))}
        </div>

        <div className="relative grid lg:grid-cols-[minmax(0,540px)_1fr]">
          <div className="relative z-10 px-6 pb-8 pt-8 sm:px-10 sm:pt-9">
            <div className="flex flex-wrap items-center gap-3">
              <p className={cn(mono, "text-[11px] uppercase tracking-[0.22em] text-muted-foreground")}>
                §1 · Content kit no. 14
              </p>
              <Tag>Remixable</Tag>
            </div>

            <h1 className="mt-6 text-[56px] font-[600] leading-[0.92] tracking-[-0.045em] sm:text-[84px]">
              Posts you
              <br />
              can take
              <br />
              <span className="inline-block border-b-[10px] border-[color:var(--accent)] pb-1">apart.</span>
            </h1>

            <div className={cn(mono, "mt-3 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground")}>
              <span className="flex w-28 items-center">
                <span className="h-2.5 w-px bg-muted-foreground" />
                <span className="h-px flex-1 bg-muted-foreground" />
                <span className="h-2.5 w-px bg-muted-foreground" />
              </span>
              7 parts · 1 trend · 30 sec
            </div>

            <p className="mt-7 max-w-[430px] text-[18px] leading-[1.55] text-foreground/85">
              Every Prognos draft ships with its exploded view: the trend behind it, the hook, the beats and the
              call to action. Swap any part, then post it before lunch.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <ManualButton href="/dashboard">
                Start project no. 14 <span aria-hidden>→</span>
              </ManualButton>
              <ManualButton href="#procedure" variant="outline">
                Read the manual
              </ManualButton>
            </div>

            <div className={cn(mono, "mt-7 flex gap-3 border-t border-border pt-3 text-[10.5px] uppercase leading-relaxed tracking-[0.2em] text-muted-foreground")}>
              <span className="text-[color:var(--accent)]">[01]</span>
              <span>
                Tuned for <b className="font-[600] text-foreground">6 platforms</b> and any niche ·{" "}
                <b className="font-[600] text-foreground">0 blank pages</b> since rev. A
              </span>
            </div>
          </div>

          <div className="relative min-h-[340px] lg:min-h-[560px]">
            <ExplodedPost className="absolute inset-x-0 top-2 h-[330px] w-full text-foreground lg:top-6 lg:h-[520px]" />
            <Stamp
              title="Approved for posting"
              line="QC-7 · 15 Oct 2026"
              className="absolute bottom-24 right-6 hidden sm:block lg:bottom-[132px] lg:right-16"
            />
          </div>
        </div>

        {/* Title block */}
        <div className={cn(mono, "grid grid-cols-3 border-t border-foreground text-[9px] uppercase tracking-[0.2em] text-muted-foreground lg:absolute lg:bottom-0 lg:right-0 lg:w-[330px] lg:border-l")}>
          <div className="row-span-2 border-r border-foreground p-2.5">
            <p>Drawing</p>
            <p className="mt-1.5 text-[22px] font-[500] tracking-tight text-foreground [font-family:inherit]">PG-140</p>
          </div>
          {TITLE_BLOCK.map(([k, v], i) => (
            <div key={k} className={cn("p-2.5", i % 2 === 0 && "border-r border-foreground", i < 2 && "border-b border-foreground")}>
              <p>{k}</p>
              <p className="mt-1 text-[12px] normal-case tracking-normal text-foreground">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
