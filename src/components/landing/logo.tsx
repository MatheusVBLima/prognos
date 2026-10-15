import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 text-xl tracking-tight", className)}>
      <span aria-hidden className="flex h-5 items-end gap-[3px]">
        <span className="h-2 w-1 rounded-full bg-chart-3" />
        <span className="h-3.5 w-1 rounded-full bg-chart-2" />
        <span className="h-5 w-1 rounded-full bg-primary" />
      </span>
      <span className="text-primary">Prognos</span>
    </span>
  )
}
