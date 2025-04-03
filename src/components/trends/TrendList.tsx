"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface TrendDataPoint {
  term: string
  value: number
  timestamp: string
}

interface TrendListProps {
  data: TrendDataPoint[]
  title?: string
  maxItems?: number
}

export function TrendList({ data, title, maxItems = 50 }: TrendListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Nenhuma tendência disponível
      </div>
    )
  }
  
  // Filtrar e limitar dados
  const filteredData = data
    .filter(item => item.term.toLowerCase().includes(searchTerm.toLowerCase()))
    .slice(0, maxItems);

  // Cores variadas para os links
  const getColorClass = (index: number) => {
    const colors = [
      "text-blue-500 hover:text-blue-700",
      "text-green-500 hover:text-green-700",
      "text-orange-500 hover:text-orange-700",
      "text-purple-500 hover:text-purple-700",
      "text-pink-500 hover:text-pink-700",
      "text-cyan-500 hover:text-cyan-700",
      "text-red-500 hover:text-red-700",
      "text-lime-500 hover:text-lime-700",
      "text-indigo-500 hover:text-indigo-700",
      "text-amber-500 hover:text-amber-700",
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="h-full flex flex-col">
      {title && (
        <h3 className="text-lg font-medium mb-3">{title}</h3>
      )}

      {data.length > 10 && (
        <div className="mb-3">
          <input
            type="text"
            placeholder="Filtrar tendências..."
            className="w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1.5 overflow-y-auto pb-2 h-full">
        {filteredData.map((item, index) => (
          <div key={index} className="flex items-center">
            <Link
              href={`https://trends.google.com/trends/explore?q=${encodeURIComponent(item.term)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "text-sm truncate transition-colors font-medium whitespace-nowrap", 
                getColorClass(index)
              )}
            >
              {item.term}
            </Link>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && searchTerm && (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Nenhuma tendência encontrada para "{searchTerm}"
        </div>
      )}
    </div>
  )
} 