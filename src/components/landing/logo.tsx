import { cn } from "@/lib/utils"

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2 text-lg tracking-tight", className)}>
      <span aria-hidden className="flex h-4 items-end gap-[3px]">
        <span className="h-2 w-[3px] rounded-full bg-foreground" />
        <span className="h-3 w-[3px] rounded-full bg-foreground" />
        <span className="h-4 w-[3px] rounded-full bg-primary" />
      </span>
      Prognos
    </span>
  )
}
