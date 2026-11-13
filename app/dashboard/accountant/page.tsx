import { FinanceOverview } from "@/components/dashboard/finance-overview"

export default function AccountantDashboardPage() {
  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Accountant Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Financial reporting in Kenyan shillings (KSh).
        </p>
        <p className="text-sm text-muted-foreground">
          The figures shown here are sample data and are not connected to live school accounts.
        </p>
      </header>
      <FinanceOverview />
    </main>
  )
}
