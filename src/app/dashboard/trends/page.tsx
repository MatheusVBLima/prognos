import type { Metadata } from "next"
import DashboardClient from "@/components/dashboard/DashboardClient"

export const metadata: Metadata = { title: "Trends | Prognos" }

export default function TrendsPage() {
  return <DashboardClient />
}
