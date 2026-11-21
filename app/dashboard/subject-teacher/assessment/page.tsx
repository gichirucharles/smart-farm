import { SubjectTeacherWorkspace } from "@/components/dashboard/subject-teacher/workspace"

export const metadata = { title: "Assessment & Marks | ShuleVerse", description: "Enter assessment marks for your assigned subject classes." }

export default function AssessmentPage() {
  return <SubjectTeacherWorkspace view="gradebook" />
}
