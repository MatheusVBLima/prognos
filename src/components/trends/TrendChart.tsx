"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Shape of the chart data
interface TrendDataPoint {
  term: string
  value: number
  timestamp: string
  rank?: number
  percentage_increase?: string
}

interface TrendChartProps {
  data: TrendDataPoint[]
  type?: 'bar' | 'line'
}

// Number formatting
const formatNumber = (num: number) => {
  return num.toLocaleString('en-US');
}

// Chart config using theme CSS colors
const chartConfig = {
  volume: {
    label: "Search volume",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function TrendChart({ data }: TrendChartProps) {
  // Bail out when there is nothing to plot
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        No data available
      </div>
    )
  }

  // Map items to the shadcn/ui chart format
  const chartData = data
    .slice(0, 10)
    .map((item) => ({
      name: item.term.length > 20 ? `${item.term.substring(0, 20)}...` : item.term,
      volume: item.value,
      fill: "var(--color-chart-2)"
    }))

  return (
    <div className="w-full h-full">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
            top: 12,
            bottom: 60,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            angle={-45}
            textAnchor="end"
            height={80}
            fontSize={12}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={formatNumber}
            fontSize={12}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="volume" fill="var(--color-volume)" radius={8} />
        </BarChart>
      </ChartContainer>
    </div>
  )
} 