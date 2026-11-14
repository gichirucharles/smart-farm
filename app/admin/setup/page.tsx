import Link from "next/link"

export default function AdminSetupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-lg rounded-xl border bg-card p-8 text-card-foreground shadow-sm">
        <h1 className="text-2xl font-semibold">Administrator setup unavailable</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Public administrator setup has been disabled. Contact your system administrator to provision an account
          through an approved, secure process.
        </p>
        <Link className="mt-6 inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline" href="/">
          Return to home
        </Link>
      </section>
    </main>
  )
}
