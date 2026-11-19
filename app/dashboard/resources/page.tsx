import type { Metadata } from "next"
import { SchoolOperationsDashboard } from "@/components/dashboard/school-operations-dashboard"

export const metadata: Metadata = {
  title: "Resources & Facilities | ShuleVerse",
  description: "Manage school assets, library, laboratories, facilities, safety, transport, boarding and meals.",
}

export default function SchoolResourcesPage() {
  return <div className="min-h-screen bg-muted/20 p-4 md:p-6 lg:p-8"><SchoolOperationsDashboard /></div>
}
