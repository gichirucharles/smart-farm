'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function AssignmentsPage() {
  const assignments = [
    { id: 1, title: 'Chapter 5 Exercises', subject: 'Mathematics', dueDate: '2024-01-25', status: 'Active' },
    { id: 2, title: 'Essay on Kenyan History', subject: 'History', dueDate: '2024-01-26', status: 'Active' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Assignments</h1>
          <p className="text-muted-foreground">Create and manage student assignments</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Assignment
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Assignments</CardTitle>
          <CardDescription>Assignments given to your class</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.map((assign) => (
                <TableRow key={assign.id}>
                  <TableCell className="font-medium">{assign.title}</TableCell>
                  <TableCell>{assign.subject}</TableCell>
                  <TableCell>{assign.dueDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{assign.status}</Badge>
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
