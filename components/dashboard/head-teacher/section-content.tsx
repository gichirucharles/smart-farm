import { AcademicPerformance } from "@/components/dashboard/academic-performance"
import { ClassStructureOverview } from "@/components/dashboard/head-teacher/class-structure-overview"
import { MessagesPanel } from "@/components/dashboard/messages-panel"
import { StudentManagement } from "@/components/dashboard/students/student-management"
import { SchoolCalendar } from "@/components/dashboard/school-calendar"
import { StaffManagement } from "@/components/dashboard/staff-management"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export const headTeacherSections = [
  "staff",
  "students",
  "academics",
  "classes",
  "attendance",
  "exams",
  "reports",
  "calendar",
  "messages",
] as const

export type HeadTeacherSection = (typeof headTeacherSections)[number]

type SectionTableProps = {
  title: string
  description: string
  columns: string[]
  rows: { id: string; cells: string[] }[]
}

function SectionTable({ title, description, columns, rows }: SectionTableProps) {
  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col items-start gap-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
        <Badge variant="outline">Sample data</Badge>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{rows.length} sample records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column}>{column}</TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.cells.map((cell, index) => (
                      <TableCell key={`${row.id}-${index}`}>{cell}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

function StudentsSection() {
  return <StudentManagement title="Student management" description="School-wide student profiles, admission information, family contacts and support records." />
}

function ClassesSection() {
  return <ClassStructureOverview />
}

function AttendanceSection() {
  return (
    <SectionTable
      title="Attendance"
      description="Daily attendance snapshot across school classes."
      columns={["Date", "Class", "Present", "Absent", "Rate"]}
      rows={[
        { id: "att-1a", cells: ["Today", "Grade 1A", "30 / 32", "2", "93.8%"] },
        { id: "att-3b", cells: ["Today", "Grade 3B", "34 / 35", "1", "97.1%"] },
        { id: "att-5a", cells: ["Today", "Grade 5A", "36 / 38", "2", "94.7%"] },
        { id: "att-7a", cells: ["Today", "Grade 7A", "33 / 34", "1", "97.1%"] },
      ]}
    />
  )
}

function ExaminationsSection() {
  return (
    <SectionTable
      title="Examinations"
      description="Upcoming examinations and candidate counts."
      columns={["Examination", "Classes", "Date", "Candidates", "Status"]}
      rows={[
        { id: "exam-term", cells: ["End-of-term exams", "Grades 4–8", "Nov 18, 2026", "184", "Scheduled"] },
        { id: "exam-practical", cells: ["Practical assessments", "Grades 3–6", "Nov 20, 2026", "147", "Scheduled"] },
        { id: "exam-reading", cells: ["Reading assessment", "Grades 1–2", "Nov 24, 2026", "64", "Draft"] },
      ]}
    />
  )
}

function ReportsSection() {
  return (
    <SectionTable
      title="Reports"
      description="Academic, attendance, and class summaries for school leadership."
      columns={["Report", "Period", "Contents", "Generated"]}
      rows={[
        { id: "report-term", cells: ["Term performance", "Term 2, 2026", "Academic outcomes", "Nov 10, 2026"] },
        { id: "report-attendance", cells: ["Weekly attendance", "Nov 2–6, 2026", "Attendance by class", "Nov 7, 2026"] },
        { id: "report-classes", cells: ["Class enrolment", "Term 2, 2026", "Class and student counts", "Nov 1, 2026"] },
      ]}
    />
  )
}

export function HeadTeacherSectionContent({ section }: { section: HeadTeacherSection }) {
  switch (section) {
    case "staff":
      return <StaffManagement />
    case "students":
      return <StudentsSection />
    case "academics":
      return <AcademicPerformance />
    case "classes":
      return <ClassesSection />
    case "attendance":
      return <AttendanceSection />
    case "exams":
      return <ExaminationsSection />
    case "reports":
      return <ReportsSection />
    case "calendar":
      return <SchoolCalendar />
    case "messages":
      return <MessagesPanel />
  }
}
