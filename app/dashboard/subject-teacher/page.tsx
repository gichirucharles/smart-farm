import { SubjectTeacherWorkspace } from "@/components/dashboard/subject-teacher/workspace"

export const metadata = { title: "Subject Teacher | ShuleVerse", description: "Assigned classes, timetable, learners, and subject performance." }

export default function SubjectTeacherDashboard() {
  return <SubjectTeacherWorkspace view="overview" />
}
