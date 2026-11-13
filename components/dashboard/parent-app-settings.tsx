"use client"

import { useEffect, useState } from "react"
import { Bell, CalendarDays, Mail, Moon, Sun } from "lucide-react"

type PreferenceKey = "emailUpdates" | "attendanceAlerts" | "schoolMessages" | "eventReminders"
type Preferences = Record<PreferenceKey, boolean>

const defaults: Preferences = {
  emailUpdates: true,
  attendanceAlerts: true,
  schoolMessages: true,
  eventReminders: true,
}

const preferenceItems: { key: PreferenceKey; title: string; description: string; icon: typeof Mail }[] = [
  { key: "emailUpdates", title: "Email updates", description: "Receive important school announcements by email.", icon: Mail },
  { key: "attendanceAlerts", title: "Attendance alerts", description: "Get notified about absences and attendance changes.", icon: Bell },
  { key: "schoolMessages", title: "Teacher messages", description: "Keep message notifications enabled for school staff.", icon: Mail },
  { key: "eventReminders", title: "Calendar reminders", description: "Be reminded about upcoming school events.", icon: CalendarDays },
]

export function ParentAppSettings() {
  const [appTheme, setAppTheme] = useState("system")
  const [preferences, setPreferences] = useState(defaults)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("shuleverse-parent-preferences")
      const savedTheme = localStorage.getItem("shuleverse-app-theme")
      if (stored) setPreferences({ ...defaults, ...JSON.parse(stored) })
      if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") setAppTheme(savedTheme)
    } catch {
      localStorage.removeItem("shuleverse-parent-preferences")
    }
    setReady(true)
  }, [])

  function updatePreference(key: PreferenceKey, value: boolean) {
    const updated = { ...preferences, [key]: value }
    setPreferences(updated)
    localStorage.setItem("shuleverse-parent-preferences", JSON.stringify(updated))
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6">
      <header className="space-y-1">
        <p className="text-sm font-medium text-primary">Preferences</p>
        <h1 className="text-3xl font-semibold tracking-tight">Parent settings</h1>
        <p className="text-muted-foreground">Choose how ShuleVerse looks and which school updates matter to you.</p>
      </header>

      <section className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm sm:p-6" aria-labelledby="appearance-heading">
        <div className="mb-5 flex items-start gap-3">
          <div className="rounded-lg bg-muted p-2.5"><Sun className="size-5" aria-hidden="true" /></div>
          <div>
            <h2 id="appearance-heading" className="font-semibold">Appearance</h2>
            <p className="text-sm text-muted-foreground">Set a comfortable light or dark app theme.</p>
          </div>
        </div>
        <label htmlFor="appearance" className="mb-2 block text-sm font-medium">App brightness</label>
        <select id="appearance" value={appTheme} onChange={(event) => {
          const preference = event.target.value
          setAppTheme(preference)
          localStorage.setItem("shuleverse-app-theme", preference)
          const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches
          document.documentElement.classList.toggle("dark", preference === "dark" || (preference === "system" && systemDark))
        }} disabled={!ready} className="h-10 w-full max-w-sm rounded-md border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60">
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">Match device</option>
        </select>
        <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><Moon className="size-3.5" aria-hidden="true" />This changes the app theme, not your device screen brightness.</p>
      </section>

      <section className="rounded-xl border bg-card p-5 text-card-foreground shadow-sm sm:p-6" aria-labelledby="notifications-heading">
        <div className="mb-5 flex items-start gap-3">
          <div className="rounded-lg bg-muted p-2.5"><Bell className="size-5" aria-hidden="true" /></div>
          <div>
            <h2 id="notifications-heading" className="font-semibold">School notifications</h2>
            <p className="text-sm text-muted-foreground">Choose the updates you want to keep enabled.</p>
          </div>
        </div>
        <div className="divide-y">
          {preferenceItems.map(({ key, title, description, icon: Icon }) => (
            <div key={key} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div className="flex min-w-0 items-start gap-3">
                <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <div>
                  <label htmlFor={`preference-${key}`} className="text-sm font-medium">{title}</label>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </div>
              </div>
              <input id={`preference-${key}`} type="checkbox" checked={preferences[key]} disabled={!ready} onChange={(event) => updatePreference(key, event.target.checked)} className="size-4 shrink-0 accent-primary" />
            </div>
          ))}
        </div>
        <p className="mt-5 rounded-lg bg-muted/60 p-3 text-sm text-muted-foreground">These preferences are stored on this device. Notification delivery is managed by your school account.</p>
      </section>
    </main>
  )
}
