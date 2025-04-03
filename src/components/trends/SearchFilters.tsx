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
  "Brasil",
  "Estados Unidos",
  "Portugal",
  "Argentina",
  "Espanha",
  "México",
  "Colômbia",
  "Chile",
  "Peru"
]

const periods = [
  "Últimas 24 horas",
  "Últimos 7 dias",
  "Último mês",
  "Últimos 3 meses",
  "Último ano",
  "Desde 2004"
]

const categories = [
  "Todas as categorias",
  "Compras",
  "Notícias",
  "Entretenimento",
  "Esportes",
  "Alimentos e bebidas",
  "Viagens",
  "Ciência",
  "Finanças",
  "Saúde"
]

const sortOptions = [
  "Por relevância",
  "Por volume de pesquisa",
  "Ordem alfabética",
  "Crescente",
  "Decrescente"
]

export function SearchFilters({
  onRegionChange,
  onPeriodChange,
  onCategoryChange,
  onSortChange,
  selectedCountry = "Brasil",
  selectedPeriod = "Últimas 24 horas",
  selectedCategory = "Todas as categorias",
  selectedSort = "Por relevância"
}: SearchFiltersProps) {

  return (
    <div className="flex flex-wrap gap-2 items-center mb-4 justify-start">
      {/* País */}
      <div className="relative">
        <Select
          value={selectedCountry}
          onValueChange={(value) => onRegionChange?.(value)}
        >
          <SelectTrigger className="min-w-[120px]">
            <Globe className="h-4 w-4 " />
            <SelectValue placeholder="País" />
          </SelectTrigger>
          <SelectContent >
            <SelectGroup>
              <SelectLabel >Países</SelectLabel>
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

      {/* Período */}
      <div className="relative">
        <Select
          value={selectedPeriod}
          onValueChange={(value) => onPeriodChange?.(value)}
        >
          <SelectTrigger className="min-w-[180px]">
            <Calendar className="h-4 w-4 " />
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent >
            <SelectGroup>
              <SelectLabel >Períodos</SelectLabel>
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

      {/* Categoria */}
      <div className="relative">
        <Select
          value={selectedCategory}
          onValueChange={(value) => onCategoryChange?.(value)}
        >
          <SelectTrigger className="min-w-[200px]">
            <Grid3X3 className="h-4 w-4 " />
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent >
            <SelectGroup>
              <SelectLabel >Categorias</SelectLabel>
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

      {/* Ordenação */}
      <div className="relative">
        <Select
          value={selectedSort}
          onValueChange={(value) => onSortChange?.(value)}
        >
          <SelectTrigger className="min-w-[160px]">
            <ArrowDownAZ className="h-4 w-4 " />
            <SelectValue placeholder="Ordenação" />
          </SelectTrigger>
          <SelectContent >
            <SelectGroup>
              <SelectLabel >Ordenação</SelectLabel>
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