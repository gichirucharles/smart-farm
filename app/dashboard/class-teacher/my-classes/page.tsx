'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function MyClassesPage() {
  const classes = [
    { id: 1, name: 'Grade 6A', students: 38, subject: 'Mathematics', time: '8:00 AM - 8:45 AM' },
    { id: 2, name: 'Grade 6A', students: 38, subject: 'English', time: '9:00 AM - 9:45 AM' },
    { id: 3, name: 'Grade 6B', students: 35, subject: 'Mathematics', time: '10:00 AM - 10:45 AM' },
    { id: 4, name: 'Grade 6B', students: 35, subject: 'Science', time: '11:00 AM - 11:45 AM' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
        <p className="text-muted-foreground">All classes assigned to you this term</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class Schedule</CardTitle>
          <CardDescription>Click on a class to view details and manage students</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classes.map((cls) => (
                <TableRow key={cls.id}>
                  <TableCell className="font-medium">{cls.name}</TableCell>
                  <TableCell>{cls.subject}</TableCell>
                  <TableCell>{cls.students}</TableCell>
                  <TableCell>{cls.time}</TableCell>
                  <TableCell>
                    <Badge>Active</Badge>
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
