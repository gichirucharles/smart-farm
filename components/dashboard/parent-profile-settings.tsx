"use client"

import { useEffect, useState, type FormEvent } from "react"
import { LockKeyhole, Mail, Phone, ShieldCheck, UserRound } from "lucide-react"

interface ParentProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
}

const emptyProfile: ParentProfile = { firstName: "", lastName: "", email: "", phone: "" }

function readProfile(): ParentProfile {
  try {
    const stored = localStorage.getItem("userSession") ?? localStorage.getItem("user")
    if (!stored) return emptyProfile
    const user = JSON.parse(stored)
    return {
      firstName: user.firstName ?? user.first_name ?? "",
      lastName: user.lastName ?? user.last_name ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
    }
  } catch {
    return emptyProfile
  }
}

export function ParentProfileSettings() {
  const [profile, setProfile] = useState(emptyProfile)
  const [saved, setSaved] = useState(false)

  useEffect(() => setProfile(readProfile()), [])

  function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const updateStoredUser = (key: string) => {
      const stored = localStorage.getItem(key)
      if (!stored) return
      try {
        const user = JSON.parse(stored)
        localStorage.setItem(key, JSON.stringify({ ...user, email: profile.email.trim(), phone: profile.phone.trim() }))
      } catch {
        // Ignore malformed browser-only session data.
      }
    }

    if (localStorage.getItem("userSession")) updateStoredUser("userSession")
    if (localStorage.getItem("user")) updateStoredUser("user")
    if (!localStorage.getItem("userSession") && !localStorage.getItem("user")) {
      localStorage.setItem("userSession", JSON.stringify(profile))
    }
    setProfile((current) => ({ ...current, email: current.email.trim(), phone: current.phone.trim() }))
    setSaved(true)
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6">
      <header className="space-y-1">
        <p className="text-sm font-medium text-primary">Account</p>
        <h1 className="text-3xl font-semibold tracking-tight">Parent profile</h1>
        <p className="text-muted-foreground">Manage the contact details used to reach you about your child.</p>
      </header>

      <form onSubmit={saveProfile} className="space-y-6">
        <section className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm sm:p-6" aria-labelledby="identity-heading">
          <div className="mb-6 flex items-start gap-3">
            <div className="rounded-lg bg-muted p-2.5"><UserRound className="size-5" aria-hidden="true" /></div>
            <div>
              <h2 id="identity-heading" className="font-semibold">Personal details</h2>
              <p className="text-sm text-muted-foreground">Your name is managed by your school and cannot be edited here.</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="parent-first-name" className="text-sm font-medium">First name</label>
              <div className="relative">
                <input id="parent-first-name" value={profile.firstName} readOnly aria-readonly="true" className="h-10 w-full rounded-md border bg-muted px-3 pr-10 text-sm text-muted-foreground" />
                <LockKeyhole className="absolute right-3 top-3 size-4 text-muted-foreground" aria-label="Locked" />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="parent-last-name" className="text-sm font-medium">Last name</label>
              <div className="relative">
                <input id="parent-last-name" value={profile.lastName} readOnly aria-readonly="true" className="h-10 w-full rounded-md border bg-muted px-3 pr-10 text-sm text-muted-foreground" />
                <LockKeyhole className="absolute right-3 top-3 size-4 text-muted-foreground" aria-label="Locked" />
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="parent-email" className="flex items-center gap-2 text-sm font-medium"><Mail className="size-4 text-muted-foreground" aria-hidden="true" />Email address</label>
              <input id="parent-email" type="email" autoComplete="email" required value={profile.email} onChange={(event) => { setProfile({ ...profile, email: event.target.value }); setSaved(false) }} className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
            <div className="space-y-2">
              <label htmlFor="parent-phone" className="flex items-center gap-2 text-sm font-medium"><Phone className="size-4 text-muted-foreground" aria-hidden="true" />Phone number</label>
              <input id="parent-phone" type="tel" autoComplete="tel" required value={profile.phone} onChange={(event) => { setProfile({ ...profile, phone: event.target.value }); setSaved(false) }} className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>
          </div>

          <p className="mt-4 rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">
            Contact edits are saved on this device only. They do not change your school account or sign-in details.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="submit" className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Save contact details</button>
            {saved && <p role="status" className="inline-flex items-center gap-2 text-sm text-emerald-700"><ShieldCheck className="size-4" aria-hidden="true" />Saved on this device.</p>}
          </div>
        </section>
      </form>
    </main>
  )
}
