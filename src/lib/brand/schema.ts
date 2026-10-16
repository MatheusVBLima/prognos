import { z } from "zod"

export const COLOR_ROLES = ["primary", "secondary", "accent", "background", "text"] as const
export type ColorRole = (typeof COLOR_ROLES)[number]

export const hexColor = z
  .string()
  .trim()
  .regex(/^#?[0-9a-f]{6}$/i, "Use a 6-digit hex color like #7C3AED")
  .transform((value) => `#${value.replace("#", "").toUpperCase()}`)

export const brandColorSchema = z.object({
  name: z.string().trim().min(1).max(40),
  hex: hexColor,
  role: z.enum(COLOR_ROLES),
})
export type BrandColor = z.infer<typeof brandColorSchema>

const tagList = (max: number) => z.array(z.string().trim().min(1).max(40)).max(max)

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((value) => value || null)

// What the brand editor submits
export const brandKitFormSchema = z.object({
  colors: z.array(brandColorSchema).min(1, "Add at least one color").max(8),
  heading_font: z.string().trim().min(1).max(60),
  body_font: z.string().trim().min(1).max(60),
  logo_url: z
    .string()
    .trim()
    .nullish()
    .transform((value) => value ?? "")
    .pipe(z.union([z.literal(""), z.url({ protocol: /^https?$/, message: "Enter a valid image URL" })]))
    .transform((value) => value || null),
  tone_of_voice: optionalText(500),
  voice_traits: tagList(8),
  keywords: tagList(15),
  value_proposition: optionalText(500),
  audience_summary: optionalText(500),
})
export type BrandKitFormValues = z.infer<typeof brandKitFormSchema>

// A full identity proposal; what the AI returns for both the website import and the wizard
export const brandDirectionSchema = z.object({
  name: z.string().describe("A short evocative name for this direction, e.g. 'Calm Authority'"),
  summary: z.string().describe("One or two sentences on the feeling this direction creates"),
  colors: z
    .array(
      z.object({
        name: z.string().describe("Human name for the color, e.g. 'Deep Indigo'"),
        hex: z.string().describe("6-digit hex, e.g. #4F46E5"),
        role: z.enum(COLOR_ROLES),
      }),
    )
    .describe("4 to 6 colors; include exactly one primary, one background and one text color"),
  heading_font: z.string().describe("A Google Fonts family from the allowed list"),
  body_font: z.string().describe("A Google Fonts family from the allowed list"),
  tone_of_voice: z.string().describe("How the brand talks, in one or two sentences"),
  voice_traits: z.array(z.string()).describe("3 to 5 single-word or two-word traits"),
})
export type BrandDirection = z.infer<typeof brandDirectionSchema>

export const websiteAnalysisSchema = z.object({
  niche: z.string().describe("The market niche in a few words, e.g. 'test prep for college admissions'"),
  audience: z.string().describe("Who the product is for, in one sentence"),
  value_proposition: z.string().describe("The core promise of the product, in one sentence"),
  keywords: z.array(z.string()).describe("5 to 10 topics and search terms the brand should own"),
  brand: brandDirectionSchema.describe("The identity the website already uses; keep its real colors and fonts"),
})
export type WebsiteAnalysis = z.infer<typeof websiteAnalysisSchema>

// The questions asked when the user has no identity yet
export const PERSONALITY_OPTIONS = [
  "Friendly",
  "Bold",
  "Playful",
  "Trustworthy",
  "Premium",
  "Minimal",
  "Energetic",
  "Calm",
  "Rebellious",
  "Expert",
  "Warm",
  "Futuristic",
] as const

export const VISUAL_STYLES = [
  { value: "clean", label: "Clean & minimal", description: "Lots of white space, one strong accent" },
  { value: "vibrant", label: "Vibrant & bold", description: "Saturated colors, big type, high contrast" },
  { value: "elegant", label: "Elegant & premium", description: "Muted tones, serif headings, refined" },
  { value: "earthy", label: "Warm & natural", description: "Earth tones, soft shapes, approachable" },
  { value: "techy", label: "Dark & techy", description: "Dark backgrounds, neon accents, sharp" },
  { value: "retro", label: "Retro & fun", description: "Nostalgic palettes, chunky type, quirky" },
] as const

export const wizardAnswersSchema = z.object({
  personality: z
    .array(z.enum(PERSONALITY_OPTIONS))
    .min(1, "Pick at least one word")
    .max(3, "Pick up to three words"),
  style: z.enum(VISUAL_STYLES.map((s) => s.value) as [string, ...string[]], { message: "Pick a visual style" }),
  avoid: optionalText(300),
  inspiration: optionalText(300),
})
export type WizardAnswers = z.infer<typeof wizardAnswersSchema>
