import type { Metadata } from "next"
import { ClassTeacherLiveDashboard } from "@/components/dashboard/class-teacher/live-dashboard"

export const metadata: Metadata = {
  title: "Class Teacher Dashboard | ShuleVerse",
  description: "Live class roster, attendance, student progress, wellbeing and communication for class teachers.",
}

export default function ClassTeacherDashboardPage() {
  return <main className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8"><ClassTeacherLiveDashboard /></main>
}
