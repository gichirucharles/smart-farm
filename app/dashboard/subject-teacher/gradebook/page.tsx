import { SubjectTeacherWorkspace } from "@/components/dashboard/subject-teacher/workspace"

export const metadata = { title: "Gradebook | ShuleVerse", description: "Record assessment marks and review subject performance in your assigned classes." }

export default function GradebookPage() {
  return <SubjectTeacherWorkspace view="gradebook" />
}
