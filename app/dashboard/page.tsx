import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Dashboard | ShuleVerse",
  description: "ShuleVerse School Management System Dashboard",
}

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Dashboard Selection</h1>
      <p className="mt-2 text-muted-foreground">Choose a dashboard to continue.</p>
      <nav className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["director", "head-teacher", "class-teacher", "nurse", "counselor"].map((role) => (
          <Link key={role} href={`/dashboard/${role}`} className="rounded-lg border p-6 hover:bg-muted">
            <span className="font-medium">{role.replaceAll("-", " ")}</span>
          </Link>
        ))}
      </nav>
    </main>
  )
}
