import "server-only"
import { lookup } from "node:dns/promises"
import { BlockList, isIP } from "node:net"

// Reads a user-supplied website server-side, so every hop is checked against private networks

const PAGE_LIMIT = 1_500_000
const CSS_LIMIT = 400_000
const MAX_STYLESHEETS = 4
const MAX_REDIRECTS = 4
const TIMEOUT_MS = 8_000

export class WebsiteError extends Error {}

const blocked = new BlockList()
for (const [net, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
] as const) {
  blocked.addSubnet(net, prefix, "ipv4")
}
for (const [net, prefix] of [
  ["::", 128],
  ["::1", 128],
  ["64:ff9b::", 96],
  ["100::", 64],
  ["2001:db8::", 32],
  ["fc00::", 7],
  ["fe80::", 10],
  ["ff00::", 8],
] as const) {
  blocked.addSubnet(net, prefix, "ipv6")
}

export function isPrivateAddress(address: string) {
  const mapped = address.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i)
  if (mapped) return isPrivateAddress(mapped[1])
  const family = isIP(address)
  if (!family) return true
  return blocked.check(address, family === 4 ? "ipv4" : "ipv6")
}

export async function assertPublicUrl(raw: string) {
  let url: URL
  try {
    url = new URL(raw)
  } catch {
    throw new WebsiteError("That doesn't look like a valid URL.")
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new WebsiteError("Only http and https links work.")
  if (url.username || url.password) throw new WebsiteError("Links with credentials aren't supported.")
  if (url.port && url.port !== "80" && url.port !== "443") throw new WebsiteError("Only standard web ports are supported.")

  const host = url.hostname.replace(/^\[|\]$/g, "")
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".internal") || host.endsWith(".local")) {
    throw new WebsiteError("That address isn't publicly reachable.")
  }

  const addresses = isIP(host) ? [host] : (await lookup(host, { all: true }).catch(() => [])).map((a) => a.address)
  if (!addresses.length) throw new WebsiteError("We couldn't find that website. Check the address.")
  if (addresses.some(isPrivateAddress)) throw new WebsiteError("That address isn't publicly reachable.")
  return url
}

async function readLimited(response: Response, limit: number) {
  if (!response.body) return ""
  const reader = response.body.getReader()
  const chunks: Uint8Array[] = []
  let size = 0
  while (size < limit) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
    size += value.byteLength
  }
  await reader.cancel().catch(() => {})
  return new TextDecoder().decode(Buffer.concat(chunks).subarray(0, limit))
}

async function safeFetch(raw: string, limit: number, accept: string) {
  let current = raw
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    const url = await assertPublicUrl(current)
    const response = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        accept,
        "user-agent": "Mozilla/5.0 (compatible; PrognosBot/1.0; +https://prognos.app)",
      },
    }).catch((error) => {
      throw new WebsiteError(
        error?.name === "TimeoutError" ? "The website took too long to respond." : "We couldn't reach that website.",
      )
    })

    const location = response.headers.get("location")
    if (response.status >= 300 && response.status < 400 && location) {
      current = new URL(location, url).toString()
      continue
    }
    if (!response.ok) throw new WebsiteError(`The website answered with an error (${response.status}).`)
    return { url: url.toString(), contentType: response.headers.get("content-type") ?? "", body: await readLimited(response, limit) }
  }
  throw new WebsiteError("The website redirected too many times.")
}

export type WebsiteSignals = {
  url: string
  title: string | null
  description: string | null
  siteName: string | null
  lang: string | null
  themeColor: string | null
  ogImage: string | null
  logo: string | null
  icon: string | null
  headings: string[]
  text: string
  colors: { hex: string; count: number }[]
  colorVariables: { name: string; hex: string }[]
  fonts: { family: string; count: number }[]
}

const decodeEntities = (text: string) =>
  text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))

const clean = (text: string) => decodeEntities(text.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim()

function attr(tag: string, name: string) {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"))
  return match ? decodeEntities(match[2] ?? match[3] ?? match[4] ?? "").trim() : null
}

function tags(html: string, name: string) {
  return html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) ?? []
}

function meta(html: string, key: string) {
  const tag = tags(html, "meta").find((t) => (attr(t, "name") ?? attr(t, "property"))?.toLowerCase() === key)
  return tag ? attr(tag, "content") || null : null
}

function absolute(href: string | null, base: string) {
  if (!href || href.startsWith("data:")) return null
  try {
    const url = new URL(href, base)
    return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : null
  } catch {
    return null
  }
}

function normalizeHex(hex: string) {
  let value = hex.replace("#", "").toLowerCase()
  if (value.length === 3 || value.length === 4) value = [...value.slice(0, 3)].map((c) => c + c).join("")
  return `#${value.slice(0, 6).toUpperCase()}`
}

const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0")

export function extractColors(css: string) {
  const counts = new Map<string, number>()
  const add = (hex: string) => counts.set(hex, (counts.get(hex) ?? 0) + 1)

  for (const [, hex] of css.matchAll(/#([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/gi)) add(normalizeHex(hex))
  for (const [, body] of css.matchAll(/rgba?\(([^)]+)\)/gi)) {
    const parts = body.split(/[\s,/]+/).filter(Boolean)
    if (parts.length < 3 || parts.slice(0, 3).some((p) => !/^\d+(\.\d+)?$/.test(p))) continue
    const alpha = parts[3] ? parseFloat(parts[3]) / (parts[3].endsWith("%") ? 100 : 1) : 1
    if (alpha < 0.5) continue
    add(`#${parts.slice(0, 3).map((p) => toHex(Number(p))).join("").toUpperCase()}`)
  }

  const variables = new Map<string, string>()
  for (const [, name, hex] of css.matchAll(/--([\w-]+)\s*:\s*(#[0-9a-f]{3,8})\b/gi)) {
    if (/primary|secondary|accent|brand|main|highlight/i.test(name) && !variables.has(name)) variables.set(name, normalizeHex(hex))
  }

  return {
    colors: [...counts].map(([hex, count]) => ({ hex, count })).sort((a, b) => b.count - a.count),
    colorVariables: [...variables].map(([name, hex]) => ({ name, hex })),
  }
}

// Generic stacks plus icon and math fonts, which say nothing about the brand
const GENERIC_FONTS =
  /katex|icon|awesome|feather|material symbols|glyph|^(inherit|initial|unset|revert|sans-serif|serif|monospace|cursive|fantasy|system-ui|ui-\w+|-apple-system|blinkmacsystemfont|segoe ui|helvetica( neue)?|arial|var\(.*|apple color emoji|segoe ui (emoji|symbol)|noto color emoji|emoji)$/i

export function extractFonts(css: string, html: string) {
  const counts = new Map<string, number>()
  const add = (raw: string, weight = 1) => {
    let family = raw.replace(/["']/g, "").trim()
    // next/font renames families to e.g. __Inter_d65c78
    const nextFont = family.match(/^__(.+?)(_Fallback)?_[0-9a-f]{5,}$/i)
    if (nextFont) {
      if (nextFont[2]) return
      family = nextFont[1].replace(/_/g, " ")
    }
    if (!family || family.length > 40 || GENERIC_FONTS.test(family)) return
    counts.set(family, (counts.get(family) ?? 0) + weight)
  }

  for (const [, value] of css.matchAll(/font-family\s*:\s*([^;}{]+)/gi)) add(value.split(",")[0])
  // Design systems often keep the family in a variable, e.g. --font-sans: "Inter Variable", sans-serif
  for (const [, value] of css.matchAll(/--[\w-]*font[\w-]*\s*:\s*(["']?[a-z][^;}{,]*,[^;}{]*)/gi)) add(value.split(",")[0].replace(/ Variable$/i, ""))
  for (const [, families] of html.matchAll(/fonts\.googleapis\.com\/css2?\?([^"'\s>]+)/gi)) {
    for (const [, family] of decodeEntities(families).matchAll(/family=([^:&]+)/g)) add(decodeURIComponent(family.replace(/\+/g, " ")), 5)
  }

  return [...counts].map(([family, count]) => ({ family, count })).sort((a, b) => b.count - a.count)
}

export function extractPageSignals(html: string, url: string) {
  const head = html.match(/<head[\s\S]*?<\/head>/i)?.[0] ?? html.slice(0, 50_000)
  const body = (html.match(/<body[\s\S]*<\/body>/i)?.[0] ?? html)
    .replace(/<(script|style|noscript|svg|template)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")

  const links = tags(head, "link")
  const linkHref = (rel: RegExp) => {
    const tag = links.find((t) => rel.test(attr(t, "rel") ?? ""))
    return tag ? absolute(attr(tag, "href"), url) : null
  }

  // Only the site header counts; logos further down the page are usually customers'
  const header = body.match(/<(header|nav)\b[\s\S]*?<\/\1>/i)?.[0] ?? ""
  const logoTag = tags(header, "img").find((t) =>
    /logo|brand/i.test(`${attr(t, "src") ?? ""} ${attr(t, "alt") ?? ""} ${attr(t, "class") ?? ""} ${attr(t, "id") ?? ""}`),
  )

  const stylesheets = links
    .filter((t) => /stylesheet/i.test(attr(t, "rel") ?? ""))
    .map((t) => absolute(attr(t, "href"), url))
    .filter((href): href is string => !!href && !href.includes("fonts.googleapis.com"))
    .slice(0, MAX_STYLESHEETS)

  const inlineCss = [
    ...[...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]),
    ...[...html.matchAll(/\sstyle\s*=\s*"([^"]*)"/gi)].map((m) => m[1]),
  ].join("\n")

  const headings = [
    ...new Set(
      [...body.matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi)]
        .map((m) => clean(m[2]))
        .filter((text) => text.length > 1 && text.length < 200),
    ),
  ].slice(0, 12)

  return {
    title: clean(head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "") || null,
    description: meta(head, "description") ?? meta(head, "og:description"),
    siteName: meta(head, "og:site_name"),
    lang: html.match(/<html\b[^>]*\slang\s*=\s*["']?([\w-]+)/i)?.[1] ?? null,
    themeColor: meta(head, "theme-color"),
    ogImage: absolute(meta(head, "og:image"), url),
    logo: logoTag ? absolute(attr(logoTag, "src"), url) : null,
    icon: linkHref(/apple-touch-icon/i) ?? linkHref(/icon/i),
    headings,
    text: clean(body).slice(0, 3000),
    stylesheets,
    inlineCss,
  }
}

export async function readWebsite(rawUrl: string): Promise<WebsiteSignals> {
  const page = await safeFetch(rawUrl, PAGE_LIMIT, "text/html,application/xhtml+xml")
  if (!/html/i.test(page.contentType)) throw new WebsiteError("That link isn't a web page.")

  const { stylesheets, inlineCss, ...signals } = extractPageSignals(page.body, page.url)
  const sheets = await Promise.all(
    stylesheets.map((href) => safeFetch(href, CSS_LIMIT, "text/css").then((r) => r.body).catch(() => "")),
  )
  const css = [inlineCss, ...sheets].join("\n")
  const { colors, colorVariables } = extractColors(css)

  return {
    url: page.url,
    ...signals,
    colors: colors.slice(0, 16),
    colorVariables: colorVariables.slice(0, 10),
    fonts: extractFonts(css, page.body).slice(0, 8),
  }
}
