"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"

interface StudentReferralsProps {
  compact?: boolean
}

export function StudentReferrals({ compact }: StudentReferralsProps) {
  const referrals = [
    { id: 1, student: "David Kipchoge", reason: "Behavioral Issues", priority: "High", date: "2024-01-10" },
    { id: 2, student: "Grace Mwangi", reason: "Academic Performance", priority: "Medium", date: "2024-01-09" },
    { id: 3, student: "Tom Njoroge", reason: "Attendance Problem", priority: "High", date: "2024-01-08" },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-500"
      case "Medium":
        return "bg-yellow-500"
      case "Low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Referrals</CardTitle>
        <CardDescription>Pending referrals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`space-y-3 ${compact ? "max-h-64 overflow-y-auto" : ""}`}>
          {referrals.map((referral) => (
            <div key={referral.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-accent">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">{referral.student}</p>
                  <p className="text-xs text-muted-foreground">{referral.reason}</p>
                  <p className="text-xs text-muted-foreground">{referral.date}</p>
                </div>
              </div>
              <Badge className={getPriorityColor(referral.priority)}>{referral.priority}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
