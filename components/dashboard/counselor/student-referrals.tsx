"use client"

import { Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface StudentReferralsProps {
  compact?: boolean
}

export function StudentReferrals({ compact }: StudentReferralsProps) {
  return (
    <Card>
      <CardHeader className={compact ? "pb-3" : undefined}>
        <CardTitle>Counselor referrals</CardTitle>
        <CardDescription>Referral records routed to counseling</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-3 rounded-lg border border-dashed p-4">
          <Info className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">No dedicated counselor referral source is connected. Clinic referrals belong to the nurse workflow and are not displayed as counseling cases.</p>
        </div>
      </CardContent>
    </Card>
  )
}
