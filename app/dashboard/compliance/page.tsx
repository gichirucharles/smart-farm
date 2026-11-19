import type { Metadata } from "next"
import { SchoolComplianceActivities } from "@/components/dashboard/school-compliance-activities"

export const metadata: Metadata = {
  title: "Compliance & Reporting | ShuleVerse",
  description: "Manage government returns, inspections, school safety, governance records and plans.",
}

export default function CompliancePage() {
  return <div className="min-h-screen bg-muted/20 p-4 md:p-6 lg:p-8"><SchoolComplianceActivities /></div>
}
