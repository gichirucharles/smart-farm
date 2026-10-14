'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SchoolManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">School Management</h1>
        <p className="text-muted-foreground">Configure and manage school settings</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>School Information</CardTitle>
            <CardDescription>Basic school details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">School Name</label>
              <p className="text-muted-foreground">Sunshine Academy</p>
            </div>
            <div>
              <label className="text-sm font-medium">Registration Number</label>
              <p className="text-muted-foreground">ED/001/2015</p>
            </div>
            <Button variant="outline">Edit School Details</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>School Facilities</CardTitle>
            <CardDescription>Infrastructure and resources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Total Classrooms</label>
              <p className="text-muted-foreground">24</p>
            </div>
            <div>
              <label className="text-sm font-medium">Laboratories</label>
              <p className="text-muted-foreground">3 (Science, Computer, Language)</p>
            </div>
            <Button variant="outline">Manage Facilities</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
