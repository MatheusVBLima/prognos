"use client"
import { SidebarTrigger } from "@/components/ui/sidebar"


export function HeaderDashboard() {
	return (
		<header className="flex items-center justify-between w-full py-4">
			<div className="flex items-center space-x-4">
				<SidebarTrigger className="-ml-1" />
			</div>

			
		</header>
	)
}