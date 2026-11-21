import { SubjectTeacherWorkspace } from "@/components/dashboard/subject-teacher/workspace"

export const metadata = { title: "Class Lists | ShuleVerse", description: "View student lists for your assigned subject classes." }

export default function StudentsPage() {
  return <SubjectTeacherWorkspace view="students" />
}
