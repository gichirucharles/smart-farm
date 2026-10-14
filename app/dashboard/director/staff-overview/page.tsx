'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

export default function StaffOverviewPage() {
  const staff = [
    { name: 'John Kipchoge', position: 'Head Teacher', experience: '12 years', status: 'Active' },
    { name: 'Sarah Njoroge', position: 'Deputy Head', experience: '8 years', status: 'Active' },
    { name: 'Peter Omondi', position: 'Mathematics Teacher', experience: '5 years', status: 'Active' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff Overview</h1>
        <p className="text-muted-foreground">View and manage school staff</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teaching Staff</CardTitle>
          <CardDescription>All teachers and support staff</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staff.map((member, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{member.name}</TableCell>
                  <TableCell>{member.position}</TableCell>
                  <TableCell>{member.experience}</TableCell>
                  <TableCell>{member.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
