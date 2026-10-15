import { Hero } from "./hero"
import { Faq, Features, FinalCta, HowItWorks, Platforms, Pricing, SiteFooter } from "./sections"
import { SiteHeader } from "./site-header"

// Layout and motion follow the "ElevenBlabs" flavor from flavors.design: warm paper,
// light grotesk headlines, pill buttons, cream bento cards and grainy gradient orbs.
// Every colour comes from the shadcn theme variables so a tweakcn theme can replace it.
export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main>
        <Hero />
        <Platforms />
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
