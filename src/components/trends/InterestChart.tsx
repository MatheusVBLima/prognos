"use client"

import { useId } from "react"
import { Area, AreaChart, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import type { InterestPoint } from "@/lib/trends/sources"

const config = { value: { label: "Search interest", color: "var(--primary)" } } satisfies ChartConfig

const formatDate = (date: string) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" })

// Google Trends interest for the idea's main keyword over the last 3 months
export function InterestChart({ points, keyword }: { points: InterestPoint[]; keyword?: string }) {
  const fillId = `interest-${useId().replace(/:/g, "")}`
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">
        Search interest{keyword ? ` for “${keyword}”` : ""}, last 3 months
      </p>
      <ChartContainer config={config} className="aspect-auto h-24 w-full">
        <AreaChart data={points} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent labelFormatter={(value) => formatDate(String(value))} />}
          />
          <Area
            dataKey="value"
            type="monotone"
            stroke="var(--color-value)"
            strokeWidth={2}
            fill={`url(#${fillId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
