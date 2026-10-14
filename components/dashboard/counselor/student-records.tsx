"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function StudentRecords() {
  const records = [
    { id: 1, student: "John Muigai", grade: "Grade 9", issues: "Anxiety", lastVisit: "2024-01-10" },
    { id: 2, student: "Sarah Omondi", grade: "Grade 10", issues: "Bullying", lastVisit: "2024-01-08" },
    { id: 3, student: "Alex Kariuki", grade: "Grade 9", issues: "Career Concerns", lastVisit: "2024-01-05" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Records</CardTitle>
        <CardDescription>Counselor student database</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead>Last Visit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.student}</TableCell>
                  <TableCell>{record.grade}</TableCell>
                  <TableCell>{record.issues}</TableCell>
                  <TableCell>{record.lastVisit}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
