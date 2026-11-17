"use client"

import useSWR from "swr"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SchoolProfileResponse {
  profile: {
    schoolName: string
    schoolType: string
    governmentId: string
    registrationNumber: string
    motto: string
    description: string
    address: string
    city: string
    county: string
    postalCode: string
    phone: string
    email: string
    website: string
    establishedYear: number | string
    studentCapacity: number | string
    directorName: string
    directorEmail: string
    directorPhone: string
    headTeacherName: string
    headTeacherEmail: string
    headTeacherPhone: string
    staff: Array<{ id: string; name: string; position: string; email: string; phone: string }>
  }
  settings: {
    facilities: {
      classrooms: number
      scienceLab: boolean
      computerLab: boolean
      languageLab: boolean
      library: boolean
      sportsGround: boolean
    }
  }
}

const fetcher = async (url: string) => {
  const response = await fetch(url, { credentials: "same-origin", cache: "no-store" })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error ?? "Unable to load school profile")
  return body
}

const facilityLabels = [
  ["scienceLab", "Science laboratory"],
  ["computerLab", "Computer laboratory"],
  ["languageLab", "Language laboratory"],
  ["library", "Library"],
  ["sportsGround", "Sports ground"],
] as const

export function SchoolProfileManager() {
  const { data, error, isLoading } = useSWR<SchoolProfileResponse>("/api/school-settings", fetcher)

  if (isLoading) return <p role="status" className="text-sm text-muted-foreground">Loading school profile…</p>
  if (error) return <Alert variant="destructive"><AlertDescription>{error.message}. Sign in with your school account to view this profile.</AlertDescription></Alert>
  if (!data) return null

  const { profile, settings } = data
  const facilities = facilityLabels.filter(([key]) => settings.facilities?.[key]).map(([, label]) => label)
  const details = [
    ["School type", profile.schoolType],
    ["Government ID / NEMIS", profile.governmentId],
    ["Registration number", profile.registrationNumber],
    ["Motto", profile.motto],
    ["Location", [profile.address, profile.city, profile.county, profile.postalCode].filter(Boolean).join(", ")],
    ["Contact", [profile.email, profile.phone].filter(Boolean).join(" · ")],
    ["Website", profile.website],
    ["Established", profile.establishedYear],
    ["Student capacity", profile.studentCapacity],
    ["Director", [profile.directorName, profile.directorEmail, profile.directorPhone].filter(Boolean).join(" · ")],
    ["Head teacher", [profile.headTeacherName, profile.headTeacherEmail, profile.headTeacherPhone].filter(Boolean).join(" · ")],
  ] as const

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-sm text-muted-foreground">This school profile is shared with head teacher and school dashboards.</p>
        <Badge variant="outline">View only</Badge>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>School information</CardTitle><CardDescription>{profile.schoolName || "School profile"}</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-4">
            {details.map(([label, value]) => <div key={label} className="grid gap-1"><span className="text-sm font-medium">{label}</span><p className="text-sm text-muted-foreground">{value || "Not set"}</p></div>)}
            {profile.description && <div className="grid gap-1"><span className="text-sm font-medium">Description</span><p className="whitespace-pre-wrap text-sm text-muted-foreground">{profile.description}</p></div>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Facilities</CardTitle><CardDescription>Shared school resources</CardDescription></CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid gap-1"><span className="text-sm font-medium">Classrooms</span><p className="text-sm text-muted-foreground">{settings.facilities?.classrooms ?? 0}</p></div>
            <div className="grid gap-1"><span className="text-sm font-medium">Available facilities</span><p className="text-sm text-muted-foreground">{facilities.length ? facilities.join(", ") : "No facilities recorded"}</p></div>
            <div className="grid gap-1"><span className="text-sm font-medium">Registered staff</span><p className="text-sm text-muted-foreground">{profile.staff?.length ?? 0}</p></div>
          </CardContent>
        </Card>
      </div>
      <p className="text-xs text-muted-foreground">The head teacher can update school details and facilities from School Settings.</p>
    </div>
  )
}
