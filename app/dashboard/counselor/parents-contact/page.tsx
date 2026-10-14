'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Phone, Mail } from 'lucide-react'

export default function ParentsContactPage() {
  const parents = [
    { name: 'Jane Kipchoge', student: 'Alice Kimani', phone: '0712345678', email: 'jane@email.com' },
    { name: 'John Omondi', student: 'Brian Omondi', phone: '0723456789', email: 'john@email.com' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Parents Contact</h1>
        <p className="text-muted-foreground">Contact information for student parents and guardians</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Parent Directory</CardTitle>
          <CardDescription>All registered parents and guardians</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Parent Name</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {parents.map((parent, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-medium">{parent.name}</TableCell>
                  <TableCell>{parent.student}</TableCell>
                  <TableCell>
                    <a href={`tel:${parent.phone}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                      <Phone className="h-4 w-4" />
                      {parent.phone}
                    </a>
                  </TableCell>
                  <TableCell>
                    <a href={`mailto:${parent.email}`} className="flex items-center gap-2 text-blue-600 hover:underline">
                      <Mail className="h-4 w-4" />
                      {parent.email}
                    </a>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">Contact</Button>
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
