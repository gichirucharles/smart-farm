import type { Metadata } from "next"
import { SchoolComplianceActivities } from "@/components/dashboard/school-compliance-activities"

export const metadata: Metadata = {
  title: "Co-curricular & Events | ShuleVerse",
  description: "Manage clubs, sports, school events, trips and student leadership records.",
}

export default function ActivitiesPage() {
  return <div className="min-h-screen bg-muted/20 p-4 md:p-6 lg:p-8"><SchoolComplianceActivities initialModule="activities" /></div>
}
