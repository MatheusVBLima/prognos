"use client"

import * as React from "react"
import { TrendItem } from "@/types/trends"

interface TrendsFilters {
  country: string
  period: string
  category: string
  sort: string
}

interface DashboardContextType {
  filters: TrendsFilters
  setFilters: React.Dispatch<React.SetStateAction<TrendsFilters>>
  activeTab: 'list' | 'charts'
  setActiveTab: React.Dispatch<React.SetStateAction<'list' | 'charts'>>
  chartType: 'bar' | 'line'
  setChartType: React.Dispatch<React.SetStateAction<'bar' | 'line'>>
  hasSearched: boolean
  setHasSearched: React.Dispatch<React.SetStateAction<boolean>>
  isLoading: boolean
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  trendData: TrendItem[] | null
  setTrendData: React.Dispatch<React.SetStateAction<TrendItem[] | null>>
}

const DashboardContext = React.createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [filters, setFilters] = React.useState<TrendsFilters>({
    country: "",
    period: "",
    category: "",
    sort: ""
  })
  const [activeTab, setActiveTab] = React.useState<'list' | 'charts'>('list')
  const [chartType, setChartType] = React.useState<'bar' | 'line'>('bar')
  const [hasSearched, setHasSearched] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [trendData, setTrendData] = React.useState<TrendItem[] | null>(null)

  const value = {
    filters,
    setFilters,
    activeTab,
    setActiveTab,
    chartType,
    setChartType,
    hasSearched,
    setHasSearched,
    isLoading,
    setIsLoading,
    trendData,
    setTrendData,
  }

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = React.useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}