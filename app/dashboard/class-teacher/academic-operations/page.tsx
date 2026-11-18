import { AcademicOperations } from "@/components/dashboard/academic-operations"

export const metadata = {
  title: "Teaching & Learning | ShuleVerse",
  description: "Class teacher timetable, planning submissions, and syllabus coverage.",
}

export default function ClassTeacherAcademicOperationsPage() {
  return <AcademicOperations role="teacher" />
}
