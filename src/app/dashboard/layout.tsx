"use client"

import * as React from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"


import { HeaderDashboard } from "@/components/HeaderDashboard"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { Suspense } from "react"


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      
        <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-16">
          <div className="flex items-center w-full gap-2 px-4">
          <Suspense>
            <HeaderDashboard />
          </Suspense>
          </div>
        </header>
        <Separator />
        <div className="flex flex-col flex-1 gap-4 p-4">
          {children}
        </div>
     
    </SidebarInset>
  </SidebarProvider>
  )
} 