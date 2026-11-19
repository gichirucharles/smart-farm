import { FinanceOverview } from "@/components/dashboard/finance-overview"
import { FinanceOperations } from "@/components/dashboard/finance-operations"

export default function AccountantDashboardPage() {
  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">Accountant Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Financial reporting in Kenyan shillings (KSh).
        </p>
        <p className="text-sm text-muted-foreground">
          Fee collection, school accounts, budgets, grants, procurement, petty cash, and payroll summaries.
        </p>
      </header>
      <FinanceOverview />
      <FinanceOperations />
    </main>
  )
}
