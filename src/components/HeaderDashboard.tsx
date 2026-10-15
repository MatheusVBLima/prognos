"use client"

import { usePathname } from "next/navigation"
import { useQueryState } from "nuqs"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher"
import { BreadcrumbSection } from "@/components/BreadcrumbSection"

const SECTIONS: { prefix: string; label: string }[] = [
  { prefix: "/dashboard/projects", label: "Projects" },
  { prefix: "/dashboard/trends", label: "Trends" },
  { prefix: "/dashboard/studio", label: "Script Studio" },
]

export function HeaderDashboard() {
  const pathname = usePathname()
  const [trend] = useQueryState("trend")

  const breadcrumbs: { label: string; href?: string }[] = [{ label: "Dashboard", href: "/dashboard" }]
  const section = SECTIONS.find((s) => pathname.startsWith(s.prefix))
  if (section) breadcrumbs.push({ label: section.label, href: section.prefix })
  if (pathname === "/dashboard/projects/new") breadcrumbs.push({ label: "New project" })
  else if (pathname.startsWith("/dashboard/projects/")) breadcrumbs.push({ label: "Edit project" })
  if (section?.prefix === "/dashboard/studio" && trend) breadcrumbs.push({ label: trend })

  return (
    <header className="flex w-full items-center justify-between py-4">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="-ml-1" />
        <BreadcrumbSection items={breadcrumbs} />
      </div>
      <div className="flex items-center space-x-4">
        <ThemeSwitcher />
      </div>
    </header>
  )
}
