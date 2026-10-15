import { Suspense } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { HeaderDashboard } from "@/components/HeaderDashboard"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardProvider } from "@/contexts/DashboardContext"
import { requireUser } from "@/lib/auth"
import { listProjects } from "@/db/queries/projects"
import { pickActiveProject } from "@/lib/projects/active"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser()
  const projects = await listProjects(user.id)
  const active = await pickActiveProject(projects)

  return (
    <DashboardProvider>
      <SidebarProvider>
        <AppSidebar
          user={{ name: user.name, email: user.email, avatarUrl: user.avatarUrl }}
          projects={projects.map(({ id, name, niche }) => ({ id, name, niche }))}
          activeProjectId={active?.id ?? null}
        />
        <SidebarInset>
          <Suspense>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear">
              <div className="flex w-full items-center gap-2 px-4">
                <HeaderDashboard />
              </div>
            </header>
            <Separator />
            <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
          </Suspense>
        </SidebarInset>
      </SidebarProvider>
    </DashboardProvider>
  )
}
