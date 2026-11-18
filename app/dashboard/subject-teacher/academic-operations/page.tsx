import { AcademicOperations } from "@/components/dashboard/academic-operations"

export const metadata = {
  title: "Teaching & Learning | ShuleVerse",
  description: "Subject teacher timetable, planning submissions, and syllabus coverage.",
}

export default function SubjectTeacherAcademicOperationsPage() {
  return <AcademicOperations role="teacher" />
}
