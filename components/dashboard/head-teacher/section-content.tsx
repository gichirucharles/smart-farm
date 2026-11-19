import { ClassStructureOverview } from "@/components/dashboard/head-teacher/class-structure-overview"
import { MessagesPanel } from "@/components/dashboard/messages-panel"
import { CommunicationCenter } from "@/components/dashboard/head-teacher/communication-center"
import { StudentManagement } from "@/components/dashboard/students/student-management"
import { SchoolCalendar } from "@/components/dashboard/school-calendar"
import { StaffManagement } from "@/components/dashboard/staff-management"
import { HROperations } from "@/components/dashboard/head-teacher/hr-operations"
import { AcademicOperations } from "@/components/dashboard/academic-operations"
import { ExamManagementDashboard } from "@/components/dashboard/head-teacher/exam-management"
import { AttendanceDashboard } from "@/components/dashboard/attendance-dashboard"
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
  "hr-operations",
  "students",
  "academics",
  "classes",
  "attendance",
  "exams",
  "reports",
  "calendar",
  "messages",
  "communication",
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
  return <AttendanceDashboard role="headteacher" />
}

function ExaminationsSection() {
  return <ExamManagementDashboard />
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
    case "hr-operations":
      return <HROperations />
    case "students":
      return <StudentsSection />
    case "academics":
      return <AcademicOperations role="headteacher" />
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
    case "communication":
      return <CommunicationCenter />
  }
}
