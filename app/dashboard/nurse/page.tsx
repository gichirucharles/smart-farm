import type { Metadata } from "next"
import { UserProfileHeader } from "@/components/layout/user-profile-header"
import { NurseClinicDashboard } from "@/components/dashboard/nurse/clinic-dashboard"
import { getSessionActor } from "@/lib/auth-session"

export const metadata: Metadata = {
  title: "School Clinic | ShuleVerse",
  description: "School clinic visits, checkups, medication administration, and health reporting.",
}

export default async function NurseDashboardPage() {
  const actor = await getSessionActor()
  const roleNames: Record<string, string> = { school_nurse: "School Nurse", nurse: "School Nurse" }
  const name = actor ? `${actor.firstName} ${actor.lastName}`.trim() : undefined

  return (
    <div className="flex min-h-screen flex-col">
      <UserProfileHeader name={name} role={actor ? roleNames[actor.role] ?? actor.role : "School Nurse"} school="School clinic" />
      <main className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 sm:p-6">
        <header>
          <p className="text-sm font-medium text-primary">CLINICAL OPERATIONS</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">School clinic</h1>
          <p className="mt-2 text-muted-foreground">Manage sick-bay visits, student checkups, medication plans, and school health activity.</p>
        </header>
        <NurseClinicDashboard />
      </main>
    </div>
  )
}
