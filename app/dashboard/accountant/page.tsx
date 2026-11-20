import Link from "next/link"
import { ArrowDownLeft, ArrowUpRight, FileText, Wallet } from "lucide-react"
import { FinanceOverview } from "@/components/dashboard/finance-overview"
import { FinanceOperations } from "@/components/dashboard/finance-operations"
import { Button } from "@/components/ui/button"

const dashboardSections = [
  { href: "#fee-management", label: "Fees & collections", icon: ArrowDownLeft },
  { href: "#finance-operations", label: "Accounts & budgets", icon: Wallet },
  { href: "#finance-operations", label: "Reports & controls", icon: FileText },
]

export default function AccountantDashboardPage() {
  return (
    <main className="flex flex-col gap-6" id="accountant-dashboard">
      <header className="flex flex-col gap-4 rounded-xl border bg-card p-5 sm:p-6">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-primary">School finance</p>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">Accountant dashboard</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Track fee collections, reconcile school accounts, and keep budgets, procurement, and payroll summaries in view. All amounts are shown in Kenyan shillings (KSh).
            </p>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link href="#finance-operations"><ArrowUpRight data-icon="inline-start" />Open finance operations</Link>
          </Button>
        </div>
        <nav aria-label="Accountant dashboard sections" className="flex flex-wrap gap-2 border-t pt-4">
          {dashboardSections.map(({ href, label, icon: Icon }) => (
            <Button key={label} asChild variant="secondary" size="sm">
              <a href={href}><Icon data-icon="inline-start" />{label}</a>
            </Button>
          ))}
        </nav>
      </header>
      <FinanceOverview lockedPreview />
      <FinanceOperations lockedPreview />
    </main>
  )
}
