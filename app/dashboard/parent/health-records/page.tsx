"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Heart, Pill, Syringe, FileText, Calendar } from "lucide-react"

const mockHealthRecords = {
  child: "Alice Doe",
  class: "Grade 7A",
  dateOfBirth: "2010-05-15",
  bloodType: "O+",
  allergies: [
    { id: 1, allergen: "Peanuts", severity: "High", reaction: "Anaphylaxis risk" },
    { id: 2, allergen: "Shellfish", severity: "Medium", reaction: "Mild swelling" },
  ],
  currentMedications: [
    { id: 1, name: "Inhalers", dosage: "As needed", purpose: "Asthma management", prescribedDate: "2024-01-10" },
    { id: 2, name: "Antihistamine", dosage: "Once daily", purpose: "Allergies", prescribedDate: "2023-12-20" },
  ],
  immunizations: [
    { id: 1, vaccine: "COVID-19 Booster", date: "2024-01-08", status: "Complete", validUntil: "2025-01-08" },
    { id: 2, vaccine: "MMR", date: "2023-06-15", status: "Complete", validUntil: null },
    { id: 3, vaccine: "Tetanus/Diphtheria", date: "2023-09-20", status: "Complete", validUntil: "2033-09-20" },
    { id: 4, vaccine: "Influenza", date: "2023-10-12", status: "Complete", validUntil: "2024-10-12" },
  ],
  medicalHistory: [
    {
      id: 1,
      condition: "Asthma",
      diagnosed: "2020-03-15",
      status: "Active",
      notes: "Mild persistent asthma, triggered by exercise and cold air",
    },
    {
      id: 2,
      condition: "Eczema",
      diagnosed: "2019-08-20",
      status: "Active",
      notes: "Seasonal flare-ups during dry months",
    },
    {
      id: 3,
      condition: "Hay Fever",
      diagnosed: "2021-04-10",
      status: "Active",
      notes: "Seasonal allergic rhinitis",
    },
  ],
  recentCheckups: [
    {
      id: 1,
      type: "General Health Checkup",
      date: "2024-01-15",
      doctor: "Dr. John Smith",
      findings: "Normal - No concerns noted",
      nextCheckup: "2024-07-15",
    },
    {
      id: 2,
      type: "Eye Examination",
      date: "2023-11-20",
      doctor: "Dr. Sarah Johnson",
      findings: "Vision: 20/20, No prescription needed",
      nextCheckup: "2024-11-20",
    },
    {
      id: 3,
      type: "Dental Checkup",
      date: "2023-12-10",
      doctor: "Dr. Michael Brown",
      findings: "Good oral health, slight plaque buildup",
      nextCheckup: "2024-06-10",
    },
  ],
}

const getSeverityColor = (severity: string) => {
  const colors: { [key: string]: string } = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-green-100 text-green-800",
  }
  return colors[severity] || "bg-gray-100 text-gray-800"
}

const getStatusColor = (status: string) => {
  const colors: { [key: string]: string } = {
    Active: "bg-red-100 text-red-800",
    Complete: "bg-green-100 text-green-800",
    Inactive: "bg-gray-100 text-gray-800",
  }
  return colors[status] || "bg-gray-100 text-gray-800"
}

export default function HealthRecordsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Health Records</h1>
        <p className="text-muted-foreground">Medical information and health history for {mockHealthRecords.child}</p>
      </div>

      {/* Critical Allergies Alert */}
      {mockHealthRecords.allergies.some((a) => a.severity === "High") && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <strong>Critical Allergies:</strong>{" "}
            {mockHealthRecords.allergies
              .filter((a) => a.severity === "High")
              .map((a) => a.allergen)
              .join(", ")}{" "}
            - Please ensure school staff are aware of these allergies.
          </AlertDescription>
        </Alert>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Health Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date of Birth</p>
              <p className="font-semibold">{mockHealthRecords.dateOfBirth}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Blood Type</p>
              <p className="font-semibold">{mockHealthRecords.bloodType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Grade</p>
              <p className="font-semibold">{mockHealthRecords.class}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Allergies */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Known Allergies
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockHealthRecords.allergies.length > 0 ? (
            <div className="space-y-3">
              {mockHealthRecords.allergies.map((allergy) => (
                <div key={allergy.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{allergy.allergen}</p>
                    <p className="text-xs text-muted-foreground mt-1">Reaction: {allergy.reaction}</p>
                  </div>
                  <Badge className={getSeverityColor(allergy.severity)}>{allergy.severity}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No known allergies recorded</p>
          )}
        </CardContent>
      </Card>

      {/* Current Medications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-blue-500" />
            Current Medications
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mockHealthRecords.currentMedications.length > 0 ? (
            <div className="space-y-3">
              {mockHealthRecords.currentMedications.map((med) => (
                <div key={med.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <p className="font-semibold text-sm">{med.name}</p>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs text-muted-foreground">
                    <p>Dosage: {med.dosage}</p>
                    <p>Purpose: {med.purpose}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Prescribed: {med.prescribedDate}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No current medications</p>
          )}
        </CardContent>
      </Card>

      {/* Immunizations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Syringe className="h-5 w-5 text-green-500" />
            Immunization Records
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockHealthRecords.immunizations.map((vacc) => (
              <div key={vacc.id} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{vacc.vaccine}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    <Calendar className="inline h-3 w-3 mr-1" />
                    {vacc.date}
                  </p>
                  {vacc.validUntil && <p className="text-xs text-muted-foreground">Valid until: {vacc.validUntil}</p>}
                </div>
                <Badge className="bg-green-100 text-green-800">{vacc.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Medical History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Medical History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockHealthRecords.medicalHistory.map((history) => (
              <div key={history.id} className="border-l-4 border-red-500 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-sm">{history.condition}</p>
                  <Badge className={getStatusColor(history.status)}>{history.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Diagnosed: {history.diagnosed}</p>
                <p className="text-xs text-muted-foreground mt-1">{history.notes}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Checkups */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-500" />
            Recent Checkups & Examinations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockHealthRecords.recentCheckups.map((checkup) => (
              <div key={checkup.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-sm">{checkup.type}</p>
                  <p className="text-xs text-muted-foreground">{checkup.date}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-2">Doctor: {checkup.doctor}</p>
                <p className="text-sm bg-blue-50 p-2 rounded mb-2">Findings: {checkup.findings}</p>
                <p className="text-xs text-muted-foreground">Next Checkup: {checkup.nextCheckup}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
