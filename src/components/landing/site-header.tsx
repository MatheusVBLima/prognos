import Link from "next/link"

import { cn } from "@/lib/utils"
import { ManualButton, mono } from "./primitives"

const NAV = [
  { href: "#schedule", label: "Tools" },
  { href: "#procedure", label: "Procedure" },
  { href: "#kits", label: "Kits" },
  { href: "#troubleshooting", label: "Manual" },
]

export function Logo() {
  return (
    <span className="flex items-center gap-2.5 text-[17px] font-[600] tracking-tight">
      <span aria-hidden className="relative grid size-6 place-items-center">
        <span className="absolute inset-x-[-4px] top-1/2 h-px bg-foreground" />
        <span className="absolute inset-y-[-4px] left-1/2 w-px bg-foreground" />
        <span className="relative size-4 border border-foreground bg-background p-[3px]">
          <span className="block size-full bg-[color:var(--accent)]" />
        </span>
      </span>
      Prognos
    </span>
  )
}

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-14 max-w-[1180px] items-center gap-4 px-4 sm:h-[72px] sm:px-6">
        <Link href="/" aria-label="Prognos home">
          <Logo />
        </Link>
        <span className={cn(mono, "hidden border-l border-border pl-4 text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:block")}>
          PG-140 · Rev. D
        </span>
        <nav className={cn(mono, "ml-auto hidden items-center gap-8 text-[12px] uppercase tracking-[0.2em] text-muted-foreground md:flex")}>
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-foreground">
              {item.label}
            </a>
          ))}
        </nav>
        <ManualButton href="/dashboard" className="ml-auto h-10 px-4 md:ml-6">
          Start a project <span aria-hidden>→</span>
        </ManualButton>
      </div>
    </header>
  )
}
