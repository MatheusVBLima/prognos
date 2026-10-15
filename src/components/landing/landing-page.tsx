import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google"

import { cn } from "@/lib/utils"
import { Hero } from "./hero"
import styles from "./manual.module.css"
import { Kits, OrderAuthorization, Procedure, Schedule, SiteFooter, Specifications, Troubleshooting } from "./sections"
import { SiteHeader } from "./site-header"

const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--wm-sans" })
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--wm-mono" })

// Layout, type and palette follow the "Workshop Manual" flavor from flavors.design:
// warm paper, graph-paper plates, IBM Plex, square edges, one safety-orange part and
// exploded hairline drawings. Copy and drawings are Prognos-specific.
export function LandingPage() {
  return (
    <div className={cn(styles.root, sans.variable, plexMono.variable, "min-h-screen")}>
      <SiteHeader />
      <main>
        <Hero />
        <Schedule />
        <Procedure />
        <Specifications />
        <Kits />
        <Troubleshooting />
        <OrderAuthorization />
      </main>
      <SiteFooter />
    </div>
  )
}
