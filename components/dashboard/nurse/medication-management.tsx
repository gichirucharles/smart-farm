"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export function MedicationManagement() {
  const medications = [
    {
      id: 1,
      student: "John Muigai",
      medication: "Asthma Inhaler",
      dosage: "2 puffs",
      frequency: "As needed",
      status: "Active",
    },
    {
      id: 2,
      student: "Sarah Omondi",
      medication: "Antihistamine",
      dosage: "1 tablet",
      frequency: "Daily",
      status: "Active",
    },
    {
      id: 3,
      student: "Alex Kariuki",
      medication: "Pain Relief",
      dosage: "2 tablets",
      frequency: "Every 4 hours",
      status: "Temporary",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medication Management</CardTitle>
        <CardDescription>Current student medications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Medication</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medications.map((med) => (
                <TableRow key={med.id}>
                  <TableCell className="font-medium">{med.student}</TableCell>
                  <TableCell>{med.medication}</TableCell>
                  <TableCell>{med.dosage}</TableCell>
                  <TableCell>{med.frequency}</TableCell>
                  <TableCell>
                    <Badge variant={med.status === "Active" ? "default" : "secondary"}>{med.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
