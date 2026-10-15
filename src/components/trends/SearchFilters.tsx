'use client';

import { Globe, Calendar, Grid3X3, ArrowDownAZ } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel
} from "@/components/ui/select";

interface SearchFiltersProps {
  onRegionChange?: (region: string) => void
  onPeriodChange?: (period: string) => void
  onCategoryChange?: (category: string) => void
  onSortChange?: (sort: string) => void
  selectedCountry?: string
  selectedPeriod?: string
  selectedCategory?: string
  selectedSort?: string
}

const countries = [
  "Brazil",
  "United States",
  "Portugal",
  "Argentina",
  "Spain",
  "Mexico",
  "Colombia",
  "Chile",
  "Peru"
]

const periods = [
  "Past 24 hours",
  "Past 7 days",
  "Past month",
  "Past 3 months",
  "Past year",
  "Since 2004"
]

const categories = [
  "All categories",
  "Shopping",
  "News",
  "Entertainment",
  "Sports",
  "Food & drink",
  "Travel",
  "Science",
  "Finance",
  "Health"
]

const sortOptions = [
  "Relevance",
  "Search volume",
  "Alphabetical",
  "Ascending",
  "Descending"
]

export function SearchFilters({
  onRegionChange,
  onPeriodChange,
  onCategoryChange,
  onSortChange,
  selectedCountry,
  selectedPeriod,
  selectedCategory,
  selectedSort
}: SearchFiltersProps) {

  return (
    <div className="flex flex-wrap gap-2 items-center mb-4 justify-start">
      {/* Country */}
      <div className="relative">
        <Select
          value={selectedCountry || ""}
          onValueChange={(value) => onRegionChange?.(value)}
        >
          <SelectTrigger className="min-w-[120px]">
            <Globe className="h-4 w-4 " />
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent >
            <SelectGroup>
              <SelectLabel >Countries</SelectLabel>
              {countries.map((country) => (
                <SelectItem 
                  key={country} 
                  value={country}
                 
                >
                  {country}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Period */}
      <div className="relative">
        <Select
          value={selectedPeriod || ""}
          onValueChange={(value) => onPeriodChange?.(value)}
        >
          <SelectTrigger className="min-w-[180px]">
            <Calendar className="h-4 w-4 " />
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent >
            <SelectGroup>
              <SelectLabel >Periods</SelectLabel>
              {periods.map((period) => (
                <SelectItem 
                  key={period} 
                  value={period}
                 
                >
                  {period}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div className="relative">
        <Select
          value={selectedCategory || ""}
          onValueChange={(value) => onCategoryChange?.(value)}
        >
          <SelectTrigger className="min-w-[200px]">
            <Grid3X3 className="h-4 w-4 " />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent >
            <SelectGroup>
              <SelectLabel >Categories</SelectLabel>
              {categories.map((category) => (
                <SelectItem 
                  key={category} 
                  value={category}
                  
                >
                  {category}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Sort */}
      <div className="relative">
        <Select
          value={selectedSort || ""}
          onValueChange={(value) => onSortChange?.(value)}
        >
          <SelectTrigger className="min-w-[160px]">
            <ArrowDownAZ className="h-4 w-4 " />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent >
            <SelectGroup>
              <SelectLabel >Sort</SelectLabel>
              {sortOptions.map((option) => (
                <SelectItem 
                  key={option} 
                  value={option}
                  
                >
                  {option}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
} 