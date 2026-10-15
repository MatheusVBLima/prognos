import { cn } from "@/lib/utils"
import styles from "./landing.module.css"

// Film grain laid over every gradient surface, like the "voice orbs" of the flavor.
export const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.6'/%3E%3C/svg%3E\")"

// Each tone mixes theme chart colors, so a new tweakcn theme recolors the orbs too.
const TONES = {
  ember: "radial-gradient(circle at 35% 30%, color-mix(in oklch, var(--chart-3) 45%, white) 0%, var(--chart-3) 45%, color-mix(in oklch, var(--chart-3) 70%, black) 100%)",
  violet: "radial-gradient(circle at 35% 30%, color-mix(in oklch, var(--chart-2) 35%, white) 0%, var(--chart-2) 50%, var(--chart-4) 100%)",
  sky: "radial-gradient(circle at 35% 30%, color-mix(in oklch, var(--chart-4) 30%, white) 0%, var(--chart-4) 60%, color-mix(in oklch, var(--chart-4) 70%, black) 100%)",
  moss: "radial-gradient(circle at 40% 30%, color-mix(in oklch, var(--chart-2) 60%, white) 0%, color-mix(in oklch, var(--chart-1) 60%, black) 70%, color-mix(in oklch, var(--chart-1) 40%, black) 100%)",
  pearl: "radial-gradient(circle at 35% 30%, var(--background) 0%, var(--muted) 55%, color-mix(in oklch, var(--muted-foreground) 35%, var(--muted)) 100%)",
} as const

export type OrbTone = keyof typeof TONES

export function Orb({
  tone,
  breathe = false,
  className,
  children,
}: {
  tone: OrbTone
  breathe?: boolean
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      aria-hidden={children ? undefined : true}
      className={cn(
        "relative isolate grid shrink-0 place-items-center overflow-hidden rounded-full",
        breathe && styles.breathe,
        className,
      )}
      style={{ backgroundImage: TONES[tone] }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
        style={{ backgroundImage: GRAIN }}
      />
      {children}
    </div>
  )
}

// A blurred, grainy colour field used behind cards (the flavor's "grainy gradient" art).
export function GrainField({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <div className="absolute -left-1/4 top-1/3 size-[70%] rounded-full bg-chart-1/70 blur-3xl" />
      <div className="absolute -right-1/4 -top-1/4 size-[70%] rounded-full bg-chart-3/70 blur-3xl" />
      <div className="absolute bottom-[-30%] right-0 size-[60%] rounded-full bg-chart-4/60 blur-3xl" />
      <div className="absolute inset-0 opacity-50 mix-blend-overlay" style={{ backgroundImage: GRAIN }} />
    </div>
  )
}
