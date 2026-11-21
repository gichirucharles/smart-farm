import { SubjectTeacherWorkspace } from "@/components/dashboard/subject-teacher/workspace"

export const metadata = {
  title: "Teaching & Learning | ShuleVerse",
  description: "Subject teacher timetable and assigned classes.",
}

export default function SubjectTeacherAcademicOperationsPage() {
  return <SubjectTeacherWorkspace view="classes" />
}
