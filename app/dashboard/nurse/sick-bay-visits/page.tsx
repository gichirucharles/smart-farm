'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function SickBayVisitsPage() {
  const visits = [
    { student: 'John Kipchoge', complaint: 'Headache', time: '09:30 AM', status: 'Treated' },
    { student: 'Jane Kipchoge', complaint: 'Stomach pain', time: '10:15 AM', status: 'Pending' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Sick Bay Visits</h1>
        <p className="text-muted-foreground">Track student visits to the sick bay</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Today's Visits</CardTitle>
          <CardDescription>Student health complaints and treatments</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Complaint</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visits.map((visit, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{visit.student}</TableCell>
                  <TableCell>{visit.complaint}</TableCell>
                  <TableCell>{visit.time}</TableCell>
                  <TableCell>
                    <Badge variant={visit.status === 'Treated' ? 'outline' : 'secondary'}>{visit.status}</Badge>
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
