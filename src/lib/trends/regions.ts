// Projects store the market as free text ("Brazil", "Brasil", "BR"); trend APIs want ISO codes
const CODES =
  "AR AT AU BE BO BR CA CH CL CN CO CR CZ DE DK DO EC EG ES FI FR GB GR GT HK HU ID IE IL IN IT JP KE KR MA MX MY NG NL NO NZ PA PE PH PK PL PT PY RO RU SA SE SG TH TR TW UA US UY VE VN ZA".split(" ")

const ALIASES: Record<string, string> = {
  usa: "US",
  "united states of america": "US",
  america: "US",
  uk: "GB",
  england: "GB",
  "great britain": "GB",
  eua: "US",
  "estados unidos": "US",
}

let lookup: Map<string, string> | null = null

function names() {
  if (lookup) return lookup
  lookup = new Map(Object.entries(ALIASES))
  for (const locale of ["en", "pt", "es"]) {
    const display = new Intl.DisplayNames([locale], { type: "region" })
    for (const code of CODES) {
      const name = display.of(code)
      if (name) lookup.set(normalize(name), code)
    }
  }
  return lookup
}

const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()

export function regionCode(country: string | null | undefined) {
  if (!country) return null
  const value = country.trim()
  if (/^[a-z]{2}$/i.test(value)) return value.toUpperCase()
  return names().get(normalize(value)) ?? null
}

export const LANGUAGE_HL: Record<string, string> = { en: "en", pt: "pt-BR", es: "es" }
