'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function StudentsPage() {
  const students = [
    { id: 1, name: 'Alice Kimani', admNo: '001', grade: 'A', status: 'Active' },
    { id: 2, name: 'Brian Omondi', admNo: '002', grade: 'B+', status: 'Active' },
    { id: 3, name: 'Catherine Njeri', admNo: '003', grade: 'A-', status: 'Active' },
    { id: 4, name: 'David Kipchoge', admNo: '004', grade: 'B', status: 'Active' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">All students in your class</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class Roster</CardTitle>
          <CardDescription>38 students in Grade 6A</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Admission No.</TableHead>
                <TableHead>Average Grade</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.admNo}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{student.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
