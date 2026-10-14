'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function StudentSessionsPage() {
  const sessions = [
    { student: 'Alice Kimani', date: '2024-01-24', topic: 'Academic Pressure', status: 'Completed' },
    { student: 'Brian Omondi', date: '2024-01-25', topic: 'Career Guidance', status: 'Scheduled' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Sessions</h1>
          <p className="text-muted-foreground">Counseling sessions with students</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Schedule Session
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Counseling Sessions</CardTitle>
          <CardDescription>Past and upcoming student counseling sessions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Topic</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{session.student}</TableCell>
                  <TableCell>{session.date}</TableCell>
                  <TableCell>{session.topic}</TableCell>
                  <TableCell>
                    <Badge variant={session.status === 'Completed' ? 'outline' : 'secondary'}>{session.status}</Badge>
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
