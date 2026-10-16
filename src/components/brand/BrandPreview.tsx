"use client"

import { Heart, MessageCircle, Send } from "lucide-react"
import { fontStack, googleFontsHref } from "@/lib/brand/fonts"
import type { BrandColor, ColorRole } from "@/lib/brand/schema"
import { cn } from "@/lib/utils"

export type PreviewBrand = {
  colors: BrandColor[]
  heading_font: string
  body_font: string
  logo_url?: string | null
}

export function pickColor(colors: BrandColor[], role: ColorRole, fallback: string) {
  return colors.find((c) => c.role === role)?.hex ?? fallback
}

// Black or white, whichever reads better on the given color
export function readableOn(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return luminance > 0.6 ? "#111111" : "#FFFFFF"
}

export function BrandFonts({ families }: { families: string[] }) {
  const href = googleFontsHref(families)
  // React 19 hoists and dedupes stylesheet links that carry a precedence
  return href ? <link rel="stylesheet" href={href} precedence="default" /> : null
}

function Logo({ brand, name, color }: { brand: PreviewBrand; name: string; color: string }) {
  if (brand.logo_url) {
    return <img src={brand.logo_url} alt="" className="size-6 rounded object-contain" />
  }
  return (
    <span
      className="flex size-6 items-center justify-center rounded text-[11px] font-bold"
      style={{ background: color, color: readableOn(color) }}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  )
}

type Props = {
  brand: PreviewBrand
  projectName: string
  headline?: string
  body?: string
  compact?: boolean
  className?: string
}

// A sample Instagram post and reel cover in the brand's colors and fonts
export function BrandPreview({ brand, projectName, headline, body, compact, className }: Props) {
  const primary = pickColor(brand.colors, "primary", "#7C3AED")
  const accent = pickColor(brand.colors, "accent", pickColor(brand.colors, "secondary", primary))
  const background = pickColor(brand.colors, "background", "#FFFFFF")
  const text = pickColor(brand.colors, "text", readableOn(background))
  const heading = { fontFamily: fontStack(brand.heading_font) }
  const copy = { fontFamily: fontStack(brand.body_font) }
  const title = headline || `3 things nobody tells you about ${projectName}`

  return (
    <div className={cn("grid grid-cols-[3fr_2fr] gap-3", className)}>
      <BrandFonts families={[brand.heading_font, brand.body_font]} />
      <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
        <div className="flex items-center gap-2 px-3 py-2 text-xs font-semibold">
          <Logo brand={brand} name={projectName} color={primary} />
          <span className="truncate">{projectName.toLowerCase().replace(/\s+/g, "")}</span>
        </div>
        <div className={cn("relative flex aspect-square flex-col justify-between", compact ? "p-3" : "p-5")} style={{ background, color: text }}>
          <span
            className="w-fit rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-wide uppercase"
            style={{ background: accent, color: readableOn(accent), ...copy }}
          >
            Swipe →
          </span>
          <h3 className={cn("leading-tight font-bold", compact ? "text-base" : "text-xl sm:text-2xl")} style={heading}>
            {title}
          </h3>
          <div className="flex items-center justify-between gap-2 text-xs" style={copy}>
            <span className="truncate opacity-70">{body || "Save this for later"}</span>
            <span className="h-1.5 w-10 shrink-0 rounded-full" style={{ background: primary }} />
          </div>
        </div>
        <div className="flex gap-3 px-3 py-2 text-muted-foreground">
          <Heart className="size-4" />
          <MessageCircle className="size-4" />
          <Send className="size-4" />
        </div>
      </div>

      <div
        className={cn("relative flex aspect-[9/16] flex-col justify-end overflow-hidden rounded-xl shadow-sm", compact ? "p-3" : "p-4")}
        style={{ background: primary, color: readableOn(primary) }}
      >
        <div className="absolute -top-10 -right-10 size-24 rounded-full opacity-50" style={{ background: accent }} />
        <p className="text-[10px] font-semibold tracking-widest uppercase opacity-80" style={copy}>
          New reel
        </p>
        <p className={cn("relative mt-1 leading-tight font-bold", compact ? "text-sm" : "text-lg")} style={heading}>
          Watch this before you start
        </p>
      </div>
    </div>
  )
}

export function Swatches({ colors, className }: { colors: BrandColor[]; className?: string }) {
  return (
    <div className={cn("flex", className)}>
      {colors.map((color) => (
        <span
          key={color.hex + color.role}
          title={`${color.name} ${color.hex}`}
          className="h-6 flex-1 first:rounded-l-md last:rounded-r-md"
          style={{ background: color.hex }}
        />
      ))}
    </div>
  )
}
