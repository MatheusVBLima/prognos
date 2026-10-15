import { cn } from "@/lib/utils"
import { FinalAssembly } from "./drawings"
import styles from "./manual.module.css"
import { Plate } from "./plates"
import { ManualButton, SectionRule, Stamp, Tag, mono } from "./primitives"
import { Logo } from "./site-header"

function Container({ id, children, className }: { id?: string; children: React.ReactNode; className?: string }) {
  return (
    <section id={id} className={cn("mx-auto max-w-[1180px] scroll-mt-6 px-4 pt-24 sm:px-6", className)}>
      {children}
    </section>
  )
}

function Heading({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px] lg:items-end">
      <h2 className="text-[40px] font-[600] leading-[0.98] tracking-[-0.035em] sm:text-[56px]">{children}</h2>
      {sub && <p className="text-[16px] leading-[1.6] text-foreground/80">{sub}</p>}
    </div>
  )
}

const PARTS = [
  { code: "PG-01", name: "Trend radar", plate: "radar", body: "Watches search and social trends in your niche every day and tells you why each one is rising.", spec: "Refresh · 24 h" },
  { code: "PG-02", name: "Project brief", plate: "brief", body: "Paste a link or describe what you make. Every idea starts from your project, not the whole internet.", spec: "Inputs · link or text" },
  { code: "PG-03", name: "Script engine", plate: "script", body: "Timed beats, a hook in the first line and a clear call to action, written in your voice.", spec: "Length · 15–90 s" },
  { code: "PG-04", name: "Carousel press", plate: "carousel", body: "Slide-by-slide copy and layout, sized for Instagram and LinkedIn, ready to export.", spec: "Slides · 3–10", highlight: true },
  { code: "PG-05", name: "Reel storyboard", plate: "reel", body: "A shot list with on-screen text and timing, so filming takes one take instead of five.", spec: "Shots · 4–12" },
  { code: "PG-06", name: "Mini editor", plate: "editor", body: "Rewrite a line, change the tone or swap a slide without leaving the draft.", spec: "Undo · unlimited" },
] as const

export function Schedule() {
  return (
    <Container id="schedule">
      <SectionRule n={2} label="Component schedule" sheet="Sheet 2 / 6" />
      <Heading sub="Six parts, each replaceable on its own. Use the whole kit or only the parts you need this week.">
        Every part,
        <br />
        on the bench.
      </Heading>
      <div className="mt-12 grid border-l border-t border-foreground sm:grid-cols-2 lg:grid-cols-3">
        {PARTS.map((part) => (
          <article key={part.code} className="flex flex-col border-b border-r border-foreground">
            <div className={cn(styles.paper, "border-b border-foreground px-4 py-3")}>
              <Plate kind={part.plate} className="h-40 w-full text-foreground" />
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center gap-3">
                {"highlight" in part ? <Tag>{part.code}</Tag> : <span className={cn(mono, "text-[11px] tracking-[0.18em]")}>{part.code}</span>}
                <span className={cn(mono, "text-[11px] uppercase tracking-[0.2em] text-muted-foreground")}>{part.name}</span>
              </div>
              <h3 className="mt-4 text-[22px] font-[600] tracking-[-0.02em]">{part.name}</h3>
              <p className="mt-2 flex-1 text-[15px] leading-[1.6] text-foreground/80">{part.body}</p>
              <p className={cn(mono, "mt-5 border-t border-dashed border-border pt-3 text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground")}>
                {part.spec} · Qty 1
              </p>
            </div>
          </article>
        ))}
      </div>
    </Container>
  )
}

const STEPS = [
  { title: "Connect your accounts", body: "Link Instagram, TikTok, YouTube, LinkedIn, X or Threads so Prognos learns your voice and what already works.", tools: "Your logins", time: "2 min" },
  { title: "Describe the project", body: "Paste your channel, product or site, or write three lines about it. Prognos maps your niche and its neighbours.", tools: "PG-02 brief", time: "1 min" },
  { title: "Pick a rising trend", body: "Open the radar, sort by momentum and pick the trend that fits. Each one shows why it is rising right now.", tools: "PG-01 radar", time: "1 min" },
  { title: "Generate, adjust, post", body: "Choose a format and get a draft. Swap the hook, tighten a beat in the editor, then copy it to your platform.", tools: "PG-03 to PG-06", time: "5 min" },
]

export function Procedure() {
  return (
    <Container id="procedure">
      <SectionRule n={3} label="Assembly procedure" sheet="Sheet 3 / 6" />
      <Heading sub="Four steps from a blank page to a finished post. No special tools required.">
        Assemble a post
        <br />
        in 9 minutes.
      </Heading>
      <ol className="mt-12 border-t border-foreground">
        {STEPS.map((step, i) => (
          <li key={step.title} className="grid gap-4 border-b border-foreground py-7 sm:grid-cols-[90px_1fr] lg:grid-cols-[90px_1fr_260px]">
            <span className={cn(mono, "text-[40px] font-[500] leading-none tracking-tight", i === 0 && "text-[color:var(--accent)]")}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h3 className="text-[22px] font-[600] tracking-[-0.02em]">{step.title}</h3>
              <p className="mt-2 max-w-[560px] text-[15px] leading-[1.6] text-foreground/80">{step.body}</p>
            </div>
            <dl className={cn(mono, "grid grid-cols-2 gap-x-4 gap-y-1 self-start text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground sm:col-start-2 lg:col-start-3")}>
              <dt>Tools</dt>
              <dd className="text-foreground">{step.tools}</dd>
              <dt>Time</dt>
              <dd className="text-foreground">{step.time}</dd>
            </dl>
          </li>
        ))}
      </ol>
    </Container>
  )
}

const SPECS = [
  ["Script", "TikTok · Reels · Shorts", "15–90 s", "Hook, beats, CTA", "In service"],
  ["Post", "LinkedIn · X · Threads", "50–300 words", "Copy + first comment", "In service"],
  ["Carousel", "Instagram · LinkedIn", "3–10 slides", "Slide copy + layout", "In service"],
  ["Reel", "Instagram · TikTok", "4–12 shots", "Shot list + overlays", "In service"],
  ["Thread", "X · Threads", "4–12 parts", "Numbered parts", "Rev. E"],
]

export function Specifications() {
  return (
    <Container id="specs">
      <SectionRule n={4} label="Specifications" sheet="Sheet 4 / 6" />
      <Heading>Output tolerances.</Heading>
      <div className="mt-12 overflow-x-auto border border-foreground">
        <table className="w-full min-w-[720px] text-left">
          <thead className={cn(mono, "bg-secondary text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground")}>
            <tr>
              {["Format", "Platforms", "Range", "Ships with", "Status"].map((h) => (
                <th key={h} className="border-b border-foreground px-4 py-3 font-[500]">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[15px]">
            {SPECS.map(([format, platforms, range, ships, status]) => (
              <tr key={format} className="border-b border-border last:border-b-0">
                <td className="px-4 py-3.5 font-[600]">{format}</td>
                <td className="px-4 py-3.5 text-foreground/80">{platforms}</td>
                <td className={cn(mono, "px-4 py-3.5 text-[13px]")}>{range}</td>
                <td className="px-4 py-3.5 text-foreground/80">{ships}</td>
                <td className={cn(mono, "px-4 py-3.5 text-[11px] uppercase tracking-[0.2em]", status !== "In service" && "text-[color:var(--accent)]")}>{status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Container>
  )
}

const KITS = [
  { code: "KIT-01", name: "Bench", price: "$0", note: "One project, to try the kit.", parts: ["1 project", "Daily trend digest", "10 drafts / month", "PG-03 scripts and posts"], cta: "Start free" },
  { code: "KIT-02", name: "Creator", price: "$19", note: "For creators posting every week.", parts: ["5 projects", "Real-time trend radar", "Unlimited drafts", "All formats, PG-01 to PG-06", "Mini editor"], cta: "Order KIT-02", highlight: true },
  { code: "KIT-03", name: "Studio", price: "$49", note: "For teams and agencies.", parts: ["Unlimited projects", "Up to 5 seats", "Shared brand voices", "Priority support"], cta: "Talk to us" },
]

export function Kits() {
  return (
    <Container id="kits">
      <SectionRule n={5} label="Kits" sheet="Sheet 5 / 6" />
      <Heading sub="Monthly, cancel any time. Every kit includes the manual and free revisions.">Pick a kit.</Heading>
      <div className="mt-12 grid border-l border-t border-foreground lg:grid-cols-3">
        {KITS.map((kit) => (
          <div key={kit.code} className={cn("relative flex flex-col border-b border-r border-foreground p-6", kit.highlight && "bg-secondary")}>
            {kit.highlight && <span className="absolute inset-x-0 top-0 h-1.5 bg-[color:var(--accent)]" />}
            <div className="flex items-center justify-between">
              <span className={cn(mono, "text-[11px] uppercase tracking-[0.2em] text-muted-foreground")}>{kit.code}</span>
              {kit.highlight && <Tag>Most ordered</Tag>}
            </div>
            <h3 className="mt-6 text-[26px] font-[600] tracking-[-0.02em]">{kit.name}</h3>
            <p className="mt-1 text-[15px] text-foreground/75">{kit.note}</p>
            <p className="mt-6 flex items-baseline gap-2">
              <span className="text-[56px] font-[600] leading-none tracking-[-0.04em]">{kit.price}</span>
              <span className={cn(mono, "text-[11px] uppercase tracking-[0.2em] text-muted-foreground")}>/ month</span>
            </p>
            <ul className="mt-6 flex-1 border-t border-border">
              {kit.parts.map((p, i) => (
                <li key={p} className="flex gap-3 border-b border-dashed border-border py-2.5 text-[15px]">
                  <span className={cn(mono, "text-[11px] leading-[22px] text-muted-foreground")}>{String(i + 1).padStart(2, "0")}</span>
                  {p}
                </li>
              ))}
            </ul>
            <ManualButton href="/dashboard" variant={kit.highlight ? "solid" : "outline"} className="mt-8 w-full">
              {kit.cta} <span aria-hidden>→</span>
            </ManualButton>
          </div>
        ))}
      </div>
    </Container>
  )
}

const FAQ = [
  ["T-01", "Which platforms does Prognos support?", "Instagram, TikTok, YouTube Shorts, LinkedIn, X and Threads. Connecting accounts is optional, but it helps Prognos match your voice."],
  ["T-02", "Where do the trends come from?", "Search trends plus what is gaining traction on social platforms, filtered down to the topics around your project."],
  ["T-03", "Will the drafts sound like me?", "Each project keeps its own brief and voice. The more you edit in the mini editor, the closer new drafts get to how you write."],
  ["T-04", "Can I cancel any time?", "Yes. Kits are monthly and you can go back to KIT-01 whenever you want without losing your projects."],
]

export function Troubleshooting() {
  return (
    <Container id="troubleshooting">
      <SectionRule n={6} label="Troubleshooting" sheet="Sheet 6 / 6" />
      <Heading>Before you call us.</Heading>
      <div className="mt-12 border-t border-foreground">
        {FAQ.map(([code, q, a]) => (
          <details key={code} className="group border-b border-foreground">
            <summary className="grid cursor-pointer list-none grid-cols-[60px_1fr_24px] items-center gap-4 py-5 [&::-webkit-details-marker]:hidden">
              <span className={cn(mono, "text-[11px] tracking-[0.18em] text-muted-foreground group-open:text-[color:var(--accent)]")}>{code}</span>
              <span className="text-[18px] font-[600] tracking-[-0.01em]">{q}</span>
              <span className={cn(mono, "text-[18px] transition-transform duration-[420ms] group-open:rotate-45")}>+</span>
            </summary>
            <p className="pb-6 pl-[76px] pr-10 text-[15px] leading-[1.6] text-foreground/80">{a}</p>
          </details>
        ))}
      </div>
    </Container>
  )
}

export function OrderAuthorization() {
  return (
    <Container className="pb-24">
      <div className={cn(styles.paper, "relative grid border border-foreground lg:grid-cols-[1fr_1.1fr]")}>
        <div className="border-b border-foreground p-6 lg:border-b-0 lg:border-r">
          <p className={cn(mono, "text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground")}>Fig. 7 — Final assembly</p>
          <FinalAssembly className="mx-auto mt-4 h-[280px] w-full max-w-[380px] text-foreground" />
        </div>
        <div className="relative p-6 sm:p-10">
          <p className={cn(mono, "text-[11px] uppercase tracking-[0.22em] text-muted-foreground")}>Order authorization</p>
          <h2 className="mt-5 text-[40px] font-[600] leading-[0.98] tracking-[-0.035em] sm:text-[52px]">
            Your next post is already trending.
          </h2>
          <p className="mt-5 max-w-[440px] text-[17px] leading-[1.6] text-foreground/80">
            Open a project, pick the trend and take the first draft apart. KIT-01 is free and needs no card.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ManualButton href="/dashboard">
              Authorize project <span aria-hidden>→</span>
            </ManualButton>
            <ManualButton href="#kits" variant="outline">
              Compare kits
            </ManualButton>
          </div>
          <div className={cn(mono, "mt-10 grid grid-cols-2 gap-6 text-[10px] uppercase tracking-[0.2em] text-muted-foreground")}>
            <div className="border-t border-foreground pt-2">Authorized by</div>
            <div className="border-t border-foreground pt-2">Date</div>
          </div>
          <Stamp title="Cleared to post" line="QC-7 · Rev. D" className="absolute right-6 top-6 hidden sm:block" />
        </div>
      </div>
    </Container>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-foreground">
      <div className={cn(mono, "mx-auto grid max-w-[1180px] gap-6 px-4 py-8 text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground sm:grid-cols-[1fr_auto_auto] sm:items-center sm:px-6")}>
        <span className="normal-case tracking-normal text-foreground [font-family:var(--wm-sans)]">
          <Logo />
        </span>
        <nav className="flex flex-wrap gap-6">
          <a href="#schedule" className="hover:text-foreground">Tools</a>
          <a href="#procedure" className="hover:text-foreground">Procedure</a>
          <a href="#kits" className="hover:text-foreground">Kits</a>
          <a href="#troubleshooting" className="hover:text-foreground">Manual</a>
        </nav>
        <span>PG-140 · Rev. D · © {new Date().getFullYear()} Prognos</span>
      </div>
    </footer>
  )
}
