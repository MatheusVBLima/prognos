"use client"

import * as React from "react"
import { Brain, FolderKanban, LayoutDashboard, Palette, TrendingUp } from "lucide-react"
import { NavMain, type NavItem } from "@/components/nav-main"
import { NavUser, type NavUserData } from "@/components/nav-user"
import { ProjectSwitcher, type ProjectSummary } from "@/components/project-switcher"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"

const navItems: NavItem[] = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard, exact: true },
  { title: "Projects", url: "/dashboard/projects", icon: FolderKanban },
  { title: "Brand", url: "/dashboard/brand", icon: Palette },
  { title: "Opportunities", url: "/dashboard/trends", icon: TrendingUp },
  { title: "Studio", url: "/dashboard/studio", icon: Brain },
]

type Props = React.ComponentProps<typeof Sidebar> & {
  user: NavUserData
  projects: ProjectSummary[]
  activeProjectId: string | null
}

export function AppSidebar({ user, projects, activeProjectId, ...props }: Props) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <ProjectSwitcher projects={projects} activeId={activeProjectId} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
