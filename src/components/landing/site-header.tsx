import Link from "next/link"

import { PrognosMark } from "@/components/brand/prognos-mark"
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
    <span className="flex items-center gap-2 text-[18px] font-[600] tracking-[-0.02em]">
      <PrognosMark className="h-[22px] w-auto" />
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
