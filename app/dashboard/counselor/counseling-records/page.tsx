import { StudentRecords } from "@/components/dashboard/counselor/student-records"

export default function CounselingRecordsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Counseling Records</h1>
        <p className="text-muted-foreground">Open private session records available to your counselor account</p>
      </div>
      <StudentRecords />
    </div>
  )
}
