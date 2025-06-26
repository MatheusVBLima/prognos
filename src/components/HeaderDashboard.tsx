"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher"
import { BreadcrumbSection } from "@/components/BreadcrumbSection"
import { usePathname } from "next/navigation"
import { useQueryState } from "nuqs"

export function HeaderDashboard() {
	const pathname = usePathname()
	const [trend] = useQueryState('trend')

	// Gerar breadcrumbs baseado na rota atual
	const getBreadcrumbs = () => {
		const breadcrumbs = [
			{ label: "Dashboard", href: "/dashboard" }
		]

		if (pathname.includes("/studio")) {
			breadcrumbs.push({ 
				label: trend ? `Studio - ${trend}` : "Studio de Roteiros",
				href: pathname // Use a rota atual como href
			})
		}

		return breadcrumbs
	}

	return (
		<header className="flex items-center justify-between w-full py-4">
			<div className="flex items-center space-x-4">
				<SidebarTrigger className="-ml-1" />
				<BreadcrumbSection items={getBreadcrumbs()} />
			</div>
			<div className="flex items-center space-x-4">
				<ThemeSwitcher />
			</div>
		</header>
	)
}