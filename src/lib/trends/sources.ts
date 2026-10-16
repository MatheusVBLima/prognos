import "server-only"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateText } from "ai"

// Each source turns a list of keywords into normalized signals; missing API keys just skip a source

export type TrendSource = "google_trends" | "youtube" | "web"

export type InterestPoint = { date: string; value: number }

export type GoogleTrendsSignal = {
  source: "google_trends"
  keyword: string
  interest: InterestPoint[]
  rising: { query: string; growth: number | "breakout" }[]
  top: { query: string; value: number }[]
}

export type YouTubeVideo = {
  id: string
  title: string
  channel: string
  publishedAt: string
  views: number
  likes: number
  comments: number
  durationSeconds: number
  viewsPerDay: number
}

export type YouTubeSignal = { source: "youtube"; keyword: string; videos: YouTubeVideo[] }

export type WebSignal = {
  source: "web"
  keyword: string
  summary: string
  articles: { title: string; url: string }[]
}

export type Signal = GoogleTrendsSignal | YouTubeSignal | WebSignal

export type SourceContext = { region: string | null; language: string; hl: string }

export function availableSources(): TrendSource[] {
  const sources: TrendSource[] = []
  if (process.env.SERPAPI_API_KEY) sources.push("google_trends")
  if (process.env.YOUTUBE_API_KEY) sources.push("youtube")
  if (process.env.GEMINI_API_KEY) sources.push("web")
  return sources
}

async function getJson<T>(url: URL, label: string): Promise<T> {
  const response = await fetch(url, { signal: AbortSignal.timeout(20_000), cache: "no-store" })
  if (!response.ok) {
    const body = await response.text().catch(() => "")
    throw new Error(`${label} answered ${response.status}: ${body.slice(0, 200)}`)
  }
  return response.json() as Promise<T>
}

// ---- Google Trends via SerpAPI ----

type SerpTimeseries = {
  interest_over_time?: {
    timeline_data?: { timestamp: string; values: { query: string; extracted_value: number }[] }[]
  }
}
type SerpRelated = {
  related_queries?: {
    rising?: { query: string; value: string; extracted_value: number }[]
    top?: { query: string; extracted_value: number }[]
  }
}

function serpUrl(params: Record<string, string>) {
  const url = new URL("https://serpapi.com/search.json")
  for (const [key, value] of Object.entries({ engine: "google_trends", api_key: process.env.SERPAPI_API_KEY!, ...params })) {
    url.searchParams.set(key, value)
  }
  return url
}

export async function fetchGoogleTrends(keywords: string[], ctx: SourceContext): Promise<GoogleTrendsSignal[]> {
  const base = { hl: ctx.hl, ...(ctx.region && { geo: ctx.region }) }
  const interest = new Map<string, InterestPoint[]>(keywords.map((k) => [k.toLowerCase(), []]))

  // The timeseries endpoint compares up to 5 queries per call
  for (let i = 0; i < keywords.length; i += 5) {
    const batch = keywords.slice(i, i + 5)
    const data = await getJson<SerpTimeseries>(
      serpUrl({ ...base, q: batch.join(","), data_type: "TIMESERIES", date: "today 3-m" }),
      "Google Trends",
    )
    for (const point of data.interest_over_time?.timeline_data ?? []) {
      const date = new Date(Number(point.timestamp) * 1000).toISOString().slice(0, 10)
      for (const value of point.values) interest.get(value.query.toLowerCase())?.push({ date, value: value.extracted_value })
    }
  }

  const related = await Promise.all(
    keywords.map((keyword) =>
      getJson<SerpRelated>(serpUrl({ ...base, q: keyword, data_type: "RELATED_QUERIES", date: "now 7-d" }), "Google Trends")
        .then((data) => data.related_queries ?? {})
        .catch(() => ({}) as NonNullable<SerpRelated["related_queries"]>),
    ),
  )

  return keywords.map((keyword, index) => ({
    source: "google_trends",
    keyword,
    interest: interest.get(keyword.toLowerCase()) ?? [],
    rising: (related[index].rising ?? []).slice(0, 8).map((r) => ({
      query: r.query,
      growth: /breakout/i.test(r.value) ? "breakout" : r.extracted_value,
    })),
    top: (related[index].top ?? []).slice(0, 8).map((t) => ({ query: t.query, value: t.extracted_value })),
  }))
}

// ---- YouTube Data API ----

type YouTubeSearch = { items?: { id: { videoId?: string } }[] }
type YouTubeVideos = {
  items?: {
    id: string
    snippet: { title: string; channelTitle: string; publishedAt: string }
    statistics: { viewCount?: string; likeCount?: string; commentCount?: string }
    contentDetails: { duration: string }
  }[]
}

export function parseDuration(iso: string) {
  const match = iso.match(/P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!match) return 0
  const [, d, h, m, s] = match.map((part) => Number(part ?? 0))
  return d * 86400 + h * 3600 + m * 60 + s
}

function youtubeUrl(path: string, params: Record<string, string>) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`)
  for (const [key, value] of Object.entries({ ...params, key: process.env.YOUTUBE_API_KEY! })) url.searchParams.set(key, value)
  return url
}

export async function fetchYouTube(keywords: string[], ctx: SourceContext, now = Date.now()): Promise<YouTubeSignal[]> {
  const publishedAfter = new Date(now - 14 * 86_400_000).toISOString()

  return Promise.all(
    keywords.map(async (keyword) => {
      const search = await getJson<YouTubeSearch>(
        youtubeUrl("search", {
          part: "id",
          q: keyword,
          type: "video",
          order: "viewCount",
          publishedAfter,
          maxResults: "10",
          relevanceLanguage: ctx.language,
          ...(ctx.region && { regionCode: ctx.region }),
        }),
        "YouTube",
      )
      const ids = (search.items ?? []).map((item) => item.id.videoId).filter(Boolean)
      if (!ids.length) return { source: "youtube" as const, keyword, videos: [] }

      const details = await getJson<YouTubeVideos>(
        youtubeUrl("videos", { part: "snippet,statistics,contentDetails", id: ids.join(",") }),
        "YouTube",
      )
      const videos = (details.items ?? []).map((video) => {
        const views = Number(video.statistics.viewCount ?? 0)
        const ageDays = Math.max((now - Date.parse(video.snippet.publishedAt)) / 86_400_000, 0.5)
        return {
          id: video.id,
          title: video.snippet.title,
          channel: video.snippet.channelTitle,
          publishedAt: video.snippet.publishedAt,
          views,
          likes: Number(video.statistics.likeCount ?? 0),
          comments: Number(video.statistics.commentCount ?? 0),
          durationSeconds: parseDuration(video.contentDetails.duration),
          viewsPerDay: Math.round(views / ageDays),
        }
      })
      videos.sort((a, b) => b.viewsPerDay - a.viewsPerDay)
      return { source: "youtube" as const, keyword, videos }
    }),
  )
}

// ---- Web news via Gemini with Google Search grounding ----

export async function fetchWeb(keywords: string[], ctx: SourceContext, niche: string): Promise<WebSignal[]> {
  const google = createGoogleGenerativeAI({ apiKey: process.env.GEMINI_API_KEY })
  const where = ctx.region ? ` in ${new Intl.DisplayNames(["en"], { type: "region" }).of(ctx.region)}` : ""

  return Promise.all(
    keywords.map(async (keyword) => {
      const result = await generateText({
        model: google("gemini-flash-latest"),
        tools: { google_search: google.tools.googleSearch({}) },
        prompt: `Search the web for what changed in the last 14 days about "${keyword}" (niche: ${niche})${where}. List the 3 to 5 most talked-about news items, launches, controversies or discussions, one line each with the date when known. Be factual and only report what the search results support.`,
      })
      const seen = new Set<string>()
      const articles = result.sources
        .flatMap((s) => (s.sourceType === "url" ? [{ title: s.title ?? new URL(s.url).hostname, url: s.url }] : []))
        .filter((a) => !seen.has(a.url) && seen.add(a.url))
        .slice(0, 6)
      return { source: "web" as const, keyword, summary: result.text.slice(0, 2000), articles }
    }),
  )
}
