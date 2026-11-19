import { FinanceOperations } from '@/components/dashboard/finance-operations'

export default function FinancialOverviewPage() {
  return (
    <main className="flex flex-col gap-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Financial Overview</h1>
        <p className="mt-1 text-sm text-muted-foreground">School accounts, budget control, grants, procurement, and payroll summaries.</p>
      </header>
      <FinanceOperations />
    </main>
  )
}
