import { Hero } from "./hero"
import { Faq, Features, FinalCta, HowItWorks, Platforms, Pricing, SiteFooter, TrendRadar } from "./sections"
import { SiteHeader } from "./site-header"

// Layout follows the "Hay" flavor from flavors.design (floating pill nav, gradient
// headlines, drawn app windows, quote bubbles, scalloped bands) with a fan of reel
// cards inspired by motionsites' "Nouver" hero. Every colour comes from the shadcn
// theme variables so a tweakcn theme can replace it.
export function LandingPage() {
  return (
    <div className="min-h-screen bg-background pt-3 text-foreground sm:pt-4">
      <SiteHeader />
      <main>
        <Hero />
        <Platforms />
        <TrendRadar />
        <HowItWorks />
        <Features />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}
