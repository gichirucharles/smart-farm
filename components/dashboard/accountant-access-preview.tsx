import Link from "next/link"
import { Banknote, BriefcaseBusiness, Building2, ClipboardList, FileText, ReceiptText, Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const previews = {
  collections: {
    title: "Fee collections & student accounts",
    description: "Review fee schedules, invoices, arrears, receipts, bursaries, and waivers.",
    metrics: [
      { label: "Collected", icon: Banknote },
      { label: "Outstanding", icon: Wallet },
      { label: "Invoices", icon: FileText },
      { label: "Receipts", icon: ReceiptText },
    ],
    areas: ["Invoices & arrears", "Payments & receipts", "Fee schedules", "Bursaries & waivers"],
  },
  operations: {
    title: "School finance operations",
    description: "Manage school accounts, budgets, grants, procurement, petty cash, and payroll summaries.",
    metrics: [
      { label: "Accounts", icon: Building2 },
      { label: "Budgets", icon: BriefcaseBusiness },
      { label: "Approvals", icon: ClipboardList },
      { label: "Payroll", icon: Banknote },
    ],
    areas: ["Accounts & transactions", "Budgets & grants", "Procurement & approvals", "Petty cash & payroll"],
  },
} as const

type PreviewMode = keyof typeof previews

export function AccountantAccessPreview({ mode }: { mode: PreviewMode }) {
  const preview = previews[mode]

  return (
    <section aria-label={preview.title}>
      <Card className="border-primary/20">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>{preview.title}</CardTitle>
            <CardDescription>{preview.description}</CardDescription>
          </div>
          <Button asChild className="shrink-0">
            <Link href="/login/accountant">Sign in as accountant</Link>
          </Button>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {preview.metrics.map(({ label, icon: Icon }) => (
              <Card key={label} className="bg-muted/30 shadow-none">
                <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
                  <CardDescription>{label}</CardDescription>
                  <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold tabular-nums">—</p>
                  <p className="mt-1 text-xs text-muted-foreground">Available after sign-in</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {preview.areas.map((area) => (
              <div key={area} className="rounded-lg border px-4 py-3 text-sm font-medium">{area}</div>
            ))}
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            Financial figures and records are private to your school account. Sign in to load live data; no sample figures are shown here.
          </p>
        </CardContent>
      </Card>
    </section>
  )
}
