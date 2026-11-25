import type { Metadata } from "next"
import { SystemAdminDashboardWorkspace } from "@/components/dashboard/system-admin/system-admin-dashboard-workspace"

export const metadata: Metadata = {
  title: "System Administrator Dashboard | ShuleVerse",
  description: "Platform-wide school administration, security, governance, and operations.",
}

export default function SystemAdminDashboardPage() {
  return <SystemAdminDashboardWorkspace />
}
