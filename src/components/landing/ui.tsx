import { cn } from "@/lib/utils"
import styles from "./landing.module.css"

// Small building blocks for the Hay-flavored landing. Every colour comes from theme
// variables (pastels are theme colours mixed with the background) so tweakcn themes apply.

export const gradientText =
  "bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent"

export const gradientFill = "bg-gradient-to-r from-primary to-chart-3 text-primary-foreground"

const PASTELS = {
  sky: "color-mix(in oklch, var(--chart-4) 22%, var(--background))",
  mint: "color-mix(in oklch, var(--chart-1) 22%, var(--background))",
  peach: "color-mix(in oklch, var(--chart-3) 22%, var(--background))",
  lilac: "color-mix(in oklch, var(--primary) 16%, var(--background))",
  sun: "color-mix(in oklch, var(--chart-3) 12%, color-mix(in oklch, var(--chart-1) 14%, var(--background)))",
} as const

export type Pastel = keyof typeof PASTELS

export function pastel(name: Pastel) {
  return { backgroundColor: PASTELS[name] }
}

export function NewStamp({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        styles.wiggle,
        "-rotate-8 rounded-full bg-chart-3 px-1.5 py-0.5 text-[10px] uppercase leading-none tracking-wide text-primary-foreground",
        className,
      )}
    >
      New!
    </span>
  )
}

export function AppWindow({
  title,
  className,
  children,
}: {
  title?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("overflow-hidden rounded-[var(--radius)] border-2 border-foreground/90 bg-card shadow-[6px_6px_0_0_var(--foreground)]", className)}>
      <div className="flex items-center gap-1.5 border-b-2 border-foreground/90 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-chart-3" />
        <span className="size-2.5 rounded-full bg-chart-1" />
        <span className="size-2.5 rounded-full bg-chart-4" />
        {title && <span className="ml-3 truncate text-xs text-muted-foreground">{title}</span>}
      </div>
      {children}
    </div>
  )
}

export function Bubble({
  className,
  tail = "left",
  children,
}: {
  className?: string
  tail?: "left" | "right"
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "relative w-max max-w-56 rounded-2xl px-4 py-2.5 text-sm leading-snug text-foreground shadow-lg",
        tail === "left" ? "rounded-bl-sm" : "rounded-br-sm",
        className,
      )}
      style={pastel("sky")}
    >
      {children}
    </div>
  )
}

export function Scallop({ edge }: { edge: "top" | "bottom" }) {
  return <div aria-hidden className={edge === "top" ? styles.scallopTop : styles.scallopBottom} />
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("text-sm uppercase tracking-widest text-primary", className)}>{children}</p>
  )
}

export { styles }
