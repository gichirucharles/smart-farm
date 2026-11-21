import { SubjectTeacherWorkspace } from "@/components/dashboard/subject-teacher/workspace"

export const metadata = { title: "My Classes | ShuleVerse", description: "View your assigned classes and teaching timetable." }

export default function MyClassesPage() {
  return <SubjectTeacherWorkspace view="classes" />
}
