import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Logo } from "./logo"
import { NewStamp, gradientFill, styles } from "./ui"

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#trend-radar", label: "Trend radar", isNew: true },
  { href: "#how-it-works", label: "How it works" },
  { href: "#pricing", label: "Pricing" },
  { href: "#faq", label: "FAQs" },
]

export function SiteHeader() {
  return (
    <header className="sticky top-3 z-40 px-3 sm:top-4">
      <div className="mx-auto flex h-14 max-w-4xl items-center gap-6 rounded-full border bg-card/95 pl-5 pr-2 shadow-lg backdrop-blur sm:h-16">
        <Link href="/" aria-label="Prognos home">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-5 text-sm lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`relative transition-colors hover:text-primary ${item.isNew ? styles.wiggleHost : ""}`}
            >
              {item.label}
              {item.isNew && <NewStamp className="absolute -right-5 -top-4" />}
            </a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="secondary" className="hidden rounded-full uppercase tracking-wide sm:inline-flex">
            <Link href="/dashboard">Sign in</Link>
          </Button>
          <Button asChild className={`rounded-full uppercase tracking-wide hover:opacity-90 ${gradientFill}`}>
            <Link href="/dashboard">Try it free</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
