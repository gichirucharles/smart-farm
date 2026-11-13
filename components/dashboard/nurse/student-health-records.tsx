"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const healthRecords = [
  {
    id: "ST-1042",
    student: "Sample learner A",
    className: "Grade 5A",
    healthNote: "Peanut allergy",
    carePlan: "Avoid exposure",
    lastVisit: "12 Nov 2026",
    status: "Follow-up due",
  },
  {
    id: "ST-1128",
    student: "Sample learner B",
    className: "Grade 3B",
    healthNote: "Asthma",
    carePlan: "Inhaler stored at clinic",
    lastVisit: "10 Nov 2026",
    status: "Follow-up due",
  },
  {
    id: "ST-1206",
    student: "Sample learner C",
    className: "Grade 4C",
    healthNote: "No known allergies",
    carePlan: "None on file",
    lastVisit: "7 Nov 2026",
    status: "Up to date",
  },
  {
    id: "ST-1317",
    student: "Sample learner D",
    className: "Grade 6B",
    healthNote: "Seasonal allergies",
    carePlan: "Antihistamine as needed",
    lastVisit: "3 Nov 2026",
    status: "Up to date",
  },
]

export function StudentHealthRecords() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Health Records</CardTitle>
        <CardDescription>Sample records only; these are not connected to live student health data.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table className="min-w-[760px]">
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Health note</TableHead>
                <TableHead>Care plan</TableHead>
                <TableHead>Last visit</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {healthRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.id}</TableCell>
                  <TableCell>{record.student}</TableCell>
                  <TableCell>{record.className}</TableCell>
                  <TableCell>{record.healthNote}</TableCell>
                  <TableCell>{record.carePlan}</TableCell>
                  <TableCell>{record.lastVisit}</TableCell>
                  <TableCell>
                    <Badge variant={record.status === "Follow-up due" ? "secondary" : "outline"}>
                      {record.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
