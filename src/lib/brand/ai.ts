import "server-only"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText, Output, type LanguageModel } from "ai"
import { z } from "zod"
import { FONT_FAMILIES, matchFont } from "@/lib/brand/fonts"
import {
  brandDirectionSchema,
  COLOR_ROLES,
  VISUAL_STYLES,
  websiteAnalysisSchema,
  type BrandColor,
  type BrandDirection,
  type WizardAnswers,
} from "@/lib/brand/schema"
import type { WebsiteSignals } from "@/lib/brand/website"
import type { Project } from "@/lib/projects/queries"

export function defaultModel(): LanguageModel {
  return createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY })("gemini-flash-latest")
}

const FONT_RULE = `Fonts must come from this list, spelled exactly: ${FONT_FAMILIES.join(", ")}.`

function describeProject(project: Project) {
  return [
    `Name: ${project.name}`,
    `Description: ${project.description}`,
    project.niche && `Niche: ${project.niche}`,
    project.audience && `Audience: ${project.audience}`,
    project.goals && `Content goals: ${project.goals}`,
    project.country && `Main market: ${project.country}`,
  ]
    .filter(Boolean)
    .join("\n")
}

// Models sometimes return off-list fonts or short hex codes; keep the result usable
export function sanitizeDirection(direction: BrandDirection, fallbackFont = "Inter"): BrandDirection {
  const seen = new Set<string>()
  const colors: BrandColor[] = []
  for (const color of direction.colors) {
    const match = color.hex.trim().match(/^#?([0-9a-f]{6}|[0-9a-f]{3})$/i)
    if (!match) continue
    const raw = match[1].length === 3 ? [...match[1]].map((c) => c + c).join("") : match[1]
    const hex = `#${raw.toUpperCase()}`
    if (seen.has(hex)) continue
    seen.add(hex)
    colors.push({ name: color.name.trim().slice(0, 40) || hex, hex, role: COLOR_ROLES.includes(color.role) ? color.role : "accent" })
  }

  return {
    ...direction,
    colors: colors.slice(0, 8),
    heading_font: matchFont(direction.heading_font, fallbackFont),
    body_font: matchFont(direction.body_font, fallbackFont),
    voice_traits: direction.voice_traits.map((t) => t.trim()).filter(Boolean).slice(0, 8),
  }
}

export async function analyzeWebsite(signals: WebsiteSignals, project: Project, model = defaultModel()) {
  const { output } = await generateText({
    model,
    output: Output.object({ schema: websiteAnalysisSchema, name: "website_analysis" }),
    system:
      "You are a brand strategist. You study a company's website and describe its brand so a content team can create on-brand social media posts. Be specific and concrete; never invent facts the website doesn't support. Write in English.",
    prompt: `Analyze this website and extract the brand identity it already uses.

PROJECT (as described by the owner)
${describeProject(project)}

WEBSITE SIGNALS
URL: ${signals.url}
Title: ${signals.title ?? "-"}
Meta description: ${signals.description ?? "-"}
Site name: ${signals.siteName ?? "-"}
Theme color: ${signals.themeColor ?? "-"}
Headings: ${signals.headings.join(" | ") || "-"}
Most used colors in CSS (hex: count): ${signals.colors.map((c) => `${c.hex}: ${c.count}`).join(", ") || "-"}
Named color variables: ${signals.colorVariables.map((v) => `--${v.name}: ${v.hex}`).join(", ") || "-"}
Most used fonts (family: count): ${signals.fonts.map((f) => `${f.family}: ${f.count}`).join(", ") || "-"}
Page text:
${signals.text}

RULES
- Colors: use the website's real colors. Prefer named brand variables and the theme color, then the most used non-gray colors for primary and accent. Pick the actual page background and text colors.
- ${FONT_RULE} If the site's font isn't in the list, pick the closest match from it.
- If the site is sparse, infer carefully from the project description.`,
  })

  const fallbackFont = matchFont(signals.fonts[0]?.family)
  return { ...output, brand: sanitizeDirection(output.brand, fallbackFont) }
}

export async function proposeBrandDirections(project: Project, answers: WizardAnswers, model = defaultModel()) {
  const style = VISUAL_STYLES.find((s) => s.value === answers.style)
  const { output } = await generateText({
    model,
    output: Output.object({
      schema: z.object({ directions: z.array(brandDirectionSchema).describe("Exactly 3 distinct directions") }),
      name: "brand_directions",
    }),
    system:
      "You are a senior brand designer creating visual identities for content creators and small businesses. Your palettes are accessible (text readable on background) and your font pairings are tasteful. Write in English.",
    prompt: `Create 3 distinct brand identity directions for this project. Each must be a complete, usable identity, and the three should feel clearly different from one another while all respecting the owner's answers.

PROJECT
${describeProject(project)}

OWNER'S ANSWERS
Personality: ${answers.personality.join(", ")}
Visual style: ${style ? `${style.label} (${style.description})` : answers.style}
Avoid: ${answers.avoid ?? "-"}
Brands they admire: ${answers.inspiration ?? "-"}

RULES
- 4 to 6 colors each, with exactly one primary, one background and one text color.
- ${FONT_RULE}
- Tone of voice should suit short-form social content for this audience.`,
  })

  return output.directions.slice(0, 3).map((direction) => sanitizeDirection(direction))
}
