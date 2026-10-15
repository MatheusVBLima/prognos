import Link from "next/link"

import { cn } from "@/lib/utils"
import styles from "./manual.module.css"

export const mono = styles.mono

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn(mono, "text-[11px] uppercase tracking-[0.22em] text-muted-foreground", className)}>{children}</p>
  )
}

export function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        mono,
        "inline-block border border-accent px-2 py-0.5 text-[10px] font-[500] uppercase tracking-[0.18em] text-[color:var(--accent)]",
        className,
      )}
    >
      {children}
    </span>
  )
}

export function ManualButton({
  href,
  variant = "solid",
  children,
  className,
}: {
  href: string
  variant?: "solid" | "outline"
  children: React.ReactNode
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        mono,
        "inline-flex h-11 items-center justify-center gap-3 border px-5 text-[12px] font-[500] uppercase tracking-[0.16em] transition-colors duration-[420ms]",
        variant === "solid"
          ? "border-foreground bg-primary text-primary-foreground hover:bg-[color:var(--accent)] hover:text-accent-foreground hover:border-[color:var(--accent)]"
          : "border-foreground text-foreground hover:bg-foreground hover:text-background",
        className,
      )}
    >
      {children}
    </Link>
  )
}

// Section header: "§2 · Component schedule" on a hairline with the sheet number.
export function SectionRule({ n, label, sheet }: { n: number; label: string; sheet: string }) {
  return (
    <div className={cn(mono, "flex items-center gap-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground")}>
      <span>
        §{n} · {label}
      </span>
      <span className="h-px flex-1 bg-border" />
      <span>{sheet}</span>
    </div>
  )
}

export function Stamp({ title, line, className }: { title: string; line: string; className?: string }) {
  return (
    <div className={cn("pointer-events-none -rotate-[8deg]", className)}>
      <div className={cn(styles.stamp, "border-2 border-destructive p-[3px] text-destructive opacity-90")}>
        <div className={cn(mono, "border border-destructive px-4 py-1.5 text-center uppercase leading-tight")}>
          <p className="text-[13px] font-[600] tracking-[0.2em]">{title}</p>
          <p className="text-[10px] tracking-[0.2em]">{line}</p>
        </div>
      </div>
    </div>
  )
}
