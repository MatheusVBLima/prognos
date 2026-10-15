// Google Fonts the editor offers; the AI is asked to pick from the same list
export const FONTS = [
  { family: "Inter", category: "sans-serif", weights: "400;600;700" },
  { family: "Poppins", category: "sans-serif", weights: "400;600;700" },
  { family: "Montserrat", category: "sans-serif", weights: "400;600;700" },
  { family: "DM Sans", category: "sans-serif", weights: "400;600;700" },
  { family: "Manrope", category: "sans-serif", weights: "400;600;700" },
  { family: "Plus Jakarta Sans", category: "sans-serif", weights: "400;600;700" },
  { family: "Space Grotesk", category: "sans-serif", weights: "400;600;700" },
  { family: "Outfit", category: "sans-serif", weights: "400;600;700" },
  { family: "Work Sans", category: "sans-serif", weights: "400;600;700" },
  { family: "Nunito", category: "sans-serif", weights: "400;600;700" },
  { family: "Rubik", category: "sans-serif", weights: "400;600;700" },
  { family: "Lato", category: "sans-serif", weights: "400;700" },
  { family: "Open Sans", category: "sans-serif", weights: "400;600;700" },
  { family: "Roboto", category: "sans-serif", weights: "400;600;700" },
  { family: "Raleway", category: "sans-serif", weights: "400;600;700" },
  { family: "Sora", category: "sans-serif", weights: "400;600;700" },
  { family: "Archivo", category: "sans-serif", weights: "400;600;700" },
  { family: "Bebas Neue", category: "display", weights: "400" },
  { family: "Anton", category: "display", weights: "400" },
  { family: "Oswald", category: "display", weights: "400;600;700" },
  { family: "Righteous", category: "display", weights: "400" },
  { family: "Bricolage Grotesque", category: "display", weights: "400;600;700" },
  { family: "Playfair Display", category: "serif", weights: "400;600;700" },
  { family: "DM Serif Display", category: "serif", weights: "400" },
  { family: "Lora", category: "serif", weights: "400;600;700" },
  { family: "Merriweather", category: "serif", weights: "400;700" },
  { family: "Fraunces", category: "serif", weights: "400;600;700" },
  { family: "Libre Baskerville", category: "serif", weights: "400;700" },
  { family: "Cormorant Garamond", category: "serif", weights: "400;600;700" },
  { family: "Space Mono", category: "monospace", weights: "400;700" },
  { family: "JetBrains Mono", category: "monospace", weights: "400;600;700" },
  { family: "Caveat", category: "handwriting", weights: "400;600;700" },
] as const

export const FONT_FAMILIES: string[] = FONTS.map((f) => f.family)

// Matches what a website or the AI calls a font to an entry in the list
export function matchFont(name: string | null | undefined, fallback = "Inter") {
  if (!name) return fallback
  const wanted = name.toLowerCase().replace(/["']/g, "").trim()
  return FONT_FAMILIES.find((family) => family.toLowerCase() === wanted) ?? fallback
}

export function fontStack(family: string) {
  const category = FONTS.find((f) => f.family === family)?.category ?? "sans-serif"
  const generic = category === "display" || category === "handwriting" ? "sans-serif" : category
  return `"${family}", ${generic}`
}

// One stylesheet for the fonts a preview needs
export function googleFontsHref(families: string[]) {
  const unique = [...new Set(families.filter((family) => FONT_FAMILIES.includes(family)))]
  if (!unique.length) return null
  // css2 rejects the whole request if a family lacks one of the weights asked for
  const params = unique.map((family) => {
    const weights = FONTS.find((f) => f.family === family)?.weights
    return `family=${encodeURIComponent(family).replace(/%20/g, "+")}:wght@${weights}`
  })
  return `https://fonts.googleapis.com/css2?${params.join("&")}&display=swap`
}
