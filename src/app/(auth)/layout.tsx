import Link from "next/link"
import { TrendingUp } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-muted/40 p-6">
      <Link href="/" className="flex items-center gap-2 font-semibold">
        <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <TrendingUp className="size-4" />
        </span>
        Prognos
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
