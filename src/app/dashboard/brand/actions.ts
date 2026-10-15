"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { requireUser } from "@/lib/auth"
import { analyzeWebsite, proposeBrandDirections, sanitizeDirection } from "@/lib/brand/ai"
import { deleteBrandKit, saveBrandKit, updateBrandKit } from "@/lib/brand/queries"
import { brandDirectionSchema, brandKitFormSchema, wizardAnswersSchema, type BrandDirection } from "@/lib/brand/schema"
import { readWebsite, WebsiteError } from "@/lib/brand/website"
import { requireActiveProject } from "@/lib/projects/active"
import { updateProject } from "@/lib/projects/queries"
import type { Json } from "@/types/database"

const AI_ERROR = "Our AI couldn't finish this time. Please try again in a moment."

function logAndExplain(scope: string, error: unknown) {
  console.error(`[brand] ${scope} failed:`, error)
  return error instanceof WebsiteError ? error.message : AI_ERROR
}

export type ImportState = { error?: string; url?: string } | undefined

export async function importFromWebsiteAction(_: ImportState, formData: FormData): Promise<ImportState> {
  await requireUser()
  const project = await requireActiveProject()

  const raw = String(formData.get("url") ?? "").trim()
  const parsed = z
    .url({ protocol: /^https?$/ })
    .safeParse(raw && !/^https?:\/\//i.test(raw) ? `https://${raw}` : raw)
  if (!parsed.success) return { error: "Enter your website address, like example.com", url: raw }

  try {
    const signals = await readWebsite(parsed.data)
    const analysis = await analyzeWebsite(signals, project)
    const { brand } = analysis

    await saveBrandKit(project.id, {
      source: "website",
      logo_url: signals.logo ?? signals.icon,
      colors: brand.colors,
      heading_font: brand.heading_font,
      body_font: brand.body_font,
      tone_of_voice: brand.tone_of_voice,
      voice_traits: brand.voice_traits,
      keywords: analysis.keywords.slice(0, 15),
      value_proposition: analysis.value_proposition,
      audience_summary: analysis.audience,
      website_snapshot: signals as unknown as Json,
    })

    // Fill in what the owner left blank, never overwrite what they wrote
    if (!project.website_url || !project.niche || !project.audience) {
      await updateProject(project.id, {
        website_url: project.website_url ?? signals.url,
        niche: project.niche ?? analysis.niche.slice(0, 200),
        audience: project.audience ?? analysis.audience.slice(0, 500),
      })
    }
  } catch (error) {
    return { error: logAndExplain("website import", error), url: raw }
  }

  revalidatePath("/dashboard", "layout")
  redirect("/dashboard/brand")
}

export type DirectionsState =
  | { error?: string; fieldErrors?: Record<string, string[] | undefined>; directions?: BrandDirection[] }
  | undefined

export async function generateDirectionsAction(_: DirectionsState, formData: FormData): Promise<DirectionsState> {
  await requireUser()
  const project = await requireActiveProject()

  const parsed = wizardAnswersSchema.safeParse({
    personality: formData.getAll("personality").map(String),
    style: String(formData.get("style") ?? ""),
    avoid: String(formData.get("avoid") ?? ""),
    inspiration: String(formData.get("inspiration") ?? ""),
  })
  if (!parsed.success) return { fieldErrors: parsed.error.flatten().fieldErrors }

  try {
    const directions = await proposeBrandDirections(project, parsed.data)
    if (!directions.length) return { error: AI_ERROR }
    return { directions }
  } catch (error) {
    return { error: logAndExplain("brand directions", error) }
  }
}

export async function chooseDirectionAction(direction: unknown) {
  await requireUser()
  const project = await requireActiveProject()

  const parsed = brandDirectionSchema.safeParse(direction)
  if (!parsed.success) return { error: "That direction is no longer valid. Generate new ones." }
  const brand = sanitizeDirection(parsed.data)

  await saveBrandKit(project.id, {
    source: "generated",
    colors: brand.colors,
    heading_font: brand.heading_font,
    body_font: brand.body_font,
    tone_of_voice: brand.tone_of_voice,
    voice_traits: brand.voice_traits,
  })
  revalidatePath("/dashboard/brand")
  redirect("/dashboard/brand")
}

export async function startFromScratchAction() {
  await requireUser()
  const project = await requireActiveProject()

  await saveBrandKit(project.id, {
    source: "manual",
    colors: [
      { name: "Primary", hex: "#7C3AED", role: "primary" },
      { name: "Accent", hex: "#F59E0B", role: "accent" },
      { name: "Background", hex: "#FFFFFF", role: "background" },
      { name: "Text", hex: "#111827", role: "text" },
    ],
  })
  revalidatePath("/dashboard/brand")
  redirect("/dashboard/brand")
}

export type SaveBrandResult = { ok?: boolean; error?: string; fieldErrors?: Record<string, string[] | undefined> }

export async function saveBrandKitAction(values: unknown): Promise<SaveBrandResult> {
  await requireUser()
  const project = await requireActiveProject()

  const parsed = brandKitFormSchema.safeParse(values)
  if (!parsed.success) return { error: "Some fields need a look.", fieldErrors: parsed.error.flatten().fieldErrors }

  const kit = await updateBrandKit(project.id, parsed.data)
  if (!kit) return { error: "This project has no brand kit yet." }

  revalidatePath("/dashboard/brand")
  return { ok: true }
}

export async function resetBrandKitAction() {
  await requireUser()
  const project = await requireActiveProject()
  await deleteBrandKit(project.id)
  revalidatePath("/dashboard/brand")
  redirect("/dashboard/brand")
}
