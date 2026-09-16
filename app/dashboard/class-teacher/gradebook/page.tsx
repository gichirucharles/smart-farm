'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function GradebookPage() {
  const grades = [
    { student: 'Alice Kimani', math: 'A', english: 'A-', science: 'A', average: 'A' },
    { student: 'Brian Omondi', math: 'B+', english: 'B', science: 'B+', average: 'B+' },
    { student: 'Catherine Njeri', math: 'A', english: 'A', science: 'A-', average: 'A' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gradebook</h1>
        <p className="text-muted-foreground">View and manage student grades</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Grade Summary</CardTitle>
          <CardDescription>Current grades for all subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Mathematics</TableHead>
                <TableHead>English</TableHead>
                <TableHead>Science</TableHead>
                <TableHead>Average</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grade, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{grade.student}</TableCell>
                  <TableCell>{grade.math}</TableCell>
                  <TableCell>{grade.english}</TableCell>
                  <TableCell>{grade.science}</TableCell>
                  <TableCell className="font-bold">{grade.average}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
