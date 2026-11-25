"use client"

import { useMemo, useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  Activity,
  BarChart3,
  Building2,
  ChevronRight,
  CircleCheck,
  CreditCard,
  Database,
  Headset,
  LayoutDashboard,
  LockKeyhole,
  Megaphone,
  Plug,
  Rocket,
  ScrollText,
  Search,
  Settings,
  Shield,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface AdminSection {
  id: string
  title: string
  summary: string
  group: string
  icon: LucideIcon
  stage: "Prototype UI" | "Added to scope"
  capabilities: string[]
}

const sections: AdminSection[] = [
  {
    id: "tenants",
    title: "Tenants & schools",
    summary: "Onboarding, verification, lifecycle, and school-level limits.",
    group: "Platform",
    icon: Building2,
    stage: "Prototype UI",
    capabilities: [
      "Onboard directors and school groups as tenants.",
      "Approve or reject registrations after checking NEMIS, licence, and KRA documents.",
      "Set status to pending verification, active, suspended, or archived.",
      "Merge duplicate registrations, correct school details, and transfer ownership.",
      "Set student, staff, storage, and SMS quotas per school.",
      "Enable or disable modules such as finance, nursing, counselling, and transport.",
      "Handle school closure, data export, and deletion requests.",
    ],
  },
  {
    id: "accounts",
    title: "Users & accounts",
    summary: "Account lifecycle, recovery, identity, and guardian relationships.",
    group: "Platform",
    icon: Users,
    stage: "Prototype UI",
    capabilities: [
      "Create, deactivate, and reactivate director, staff, parent, and student accounts.",
      "Reset passwords, unlock accounts, and revoke sessions.",
      "Enforce MFA for privileged school roles.",
      "Resolve duplicate users and accounts shared across schools.",
      "Review guardian-to-child links and handle merge or unlink disputes.",
      "Govern supported sign-in methods such as phone OTP, email, and SSO.",
      "Provide consent-based, time-limited support impersonation with an audit record.",
    ],
  },
  {
    id: "access",
    title: "Roles & permissions",
    summary: "System roles, school-specific permissions, and access reviews.",
    group: "Platform",
    icon: Shield,
    stage: "Prototype UI",
    capabilities: [
      "Define default system roles and their permissions.",
      "Create school-specific roles where enabled.",
      "Manage roles and permission assignments.",
      "Review and approve permission changes.",
      "Set break-glass access rules and review each emergency event.",
      "Run periodic reviews of who can access each area.",
    ],
  },
  {
    id: "billing",
    title: "Billing & subscriptions",
    summary: "Plans, invoices, payment reconciliation, and revenue visibility.",
    group: "Platform",
    icon: CreditCard,
    stage: "Added to scope",
    capabilities: [
      "Define per-student, per-term plans, tiers, and trials.",
      "Generate invoices for directors and schools.",
      "Track M-Pesa and bank payments, renewals, arrears, and grace periods.",
      "Suspend or restore service for non-payment.",
      "Manage discounts, promo codes, partner, and reseller pricing.",
      "Report on recurring revenue, churn, active schools, and active students.",
      "Reconcile SMS credits and usage costs.",
    ],
  },
  {
    id: "configuration",
    title: "Platform configuration",
    summary: "Shared reference data, defaults, localization, and staged releases.",
    group: "Operations",
    icon: Settings,
    stage: "Prototype UI",
    capabilities: [
      "Maintain counties, sub-counties, wards, school types, curricula, and grading templates.",
      "Set default calendars, term dates, report cards, fee categories, and class structures.",
      "Configure English and Swahili, currency, and time zone defaults.",
      "Stage feature rollouts for selected schools.",
      "Version terms of service, privacy notices, and consent text.",
      "Manage global email, SMS, and notification templates.",
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    summary: "Payment, messaging, government, storage, and partner connections.",
    group: "Operations",
    icon: Plug,
    stage: "Added to scope",
    capabilities: [
      "Configure M-Pesa Daraja paybill or till details and monitor callbacks.",
      "Manage SMS sender IDs, balances, and delivery reports.",
      "Monitor email, push, and WhatsApp services where enabled.",
      "Manage NEMIS and KNEC formats and approved API access.",
      "Support bank integrations and statement imports.",
      "Monitor cloud storage, maps, analytics, API keys, webhooks, and rate limits.",
      "Track integration health and failures.",
    ],
  },
  {
    id: "security",
    title: "Security & data protection",
    summary: "Security controls, investigations, privacy requests, and retention.",
    group: "Trust & reliability",
    icon: LockKeyhole,
    stage: "Prototype UI",
    capabilities: [
      "Set password rules, session timeouts, and administrator IP restrictions.",
      "Govern encryption-key and secret rotation.",
      "Review audit and sensitive-read events for suspicious activity.",
      "Coordinate breach response and required notifications.",
      "Track penetration testing, vulnerability remediation, and RLS reviews.",
      "Manage data access, correction, deletion, and export requests.",
      "Maintain processing records, retention schedules, and legal holds.",
    ],
  },
  {
    id: "data",
    title: "Data management",
    summary: "Imports, data quality, backups, archiving, and migrations.",
    group: "Trust & reliability",
    icon: Database,
    stage: "Prototype UI",
    capabilities: [
      "Import students, staff, and fee balances from Excel or CSV with validation reports.",
      "Find duplicate records, incorrect admission numbers, and orphaned records.",
      "Schedule backups, verify them, and test restores.",
      "Maintain disaster recovery plans and recovery targets.",
      "Archive academic years and apply retention or deletion jobs.",
      "Export school data on request.",
      "Manage migrations between environments or versions.",
    ],
  },
  {
    id: "monitoring",
    title: "Monitoring & reliability",
    summary: "Service health, incidents, performance, queues, and capacity.",
    group: "Trust & reliability",
    icon: Activity,
    stage: "Added to scope",
    capabilities: [
      "Monitor API, database, job queues, SMS, and payment callback health.",
      "Track errors, alerts, slow queries, and peak-hour performance.",
      "Inspect queues for SMS delivery, report generation, and scheduled reports.",
      "Plan capacity for term openings and results-release periods.",
      "Track storage usage by school.",
      "Coordinate incidents and publish service status updates.",
    ],
  },
  {
    id: "support",
    title: "Support & helpdesk",
    summary: "Support requests, service levels, onboarding, and feedback.",
    group: "Service & governance",
    icon: Headset,
    stage: "Added to scope",
    capabilities: [
      "Receive requests from directors, head teachers, staff, and parents.",
      "Triage, assign, and track tickets against service-level targets.",
      "Maintain a knowledge base and in-app help.",
      "Publish role-specific training and onboarding checklists.",
      "Track announcements, product feedback, and feature requests.",
      "Escalate complaints and abuse reports.",
    ],
  },
  {
    id: "communications",
    title: "Communications",
    summary: "Platform-wide announcements and governed message delivery.",
    group: "Service & governance",
    icon: Megaphone,
    stage: "Added to scope",
    capabilities: [
      "Broadcast messages to all directors or selected schools.",
      "Schedule maintenance and downtime notices.",
      "Monitor SMS and email delivery, bounces, and failures.",
      "Govern notification templates.",
      "Investigate spam and misuse of bulk messaging.",
    ],
  },
  {
    id: "governance",
    title: "Compliance & audit",
    summary: "Tamper-evident activity, compliance reporting, and governance.",
    group: "Service & governance",
    icon: ScrollText,
    stage: "Prototype UI",
    capabilities: [
      "Keep an append-only platform audit trail of who did what and when.",
      "Prepare compliance reports for regulators, auditors, and partners.",
      "Verify school licences and flag expirations.",
      "Govern safeguarding escalations and child-protection reporting.",
      "Review abuse reports and moderate announcements or messages.",
      "Maintain school contracts and data-processing agreements.",
      "Review government and partner access requests.",
    ],
  },
  {
    id: "analytics",
    title: "Analytics & reporting",
    summary: "Aggregated product and service insights without student-level records.",
    group: "Service & governance",
    icon: BarChart3,
    stage: "Added to scope",
    capabilities: [
      "Report active schools, users, logins, and feature adoption.",
      "Compare adoption by county, school type, and curriculum.",
      "Track fee collection volumes in aggregate.",
      "Review support response and satisfaction measures.",
      "Use anonymized product analytics to guide the roadmap.",
      "Keep student-level records out of platform-wide analytics.",
    ],
  },
  {
    id: "releases",
    title: "Development & releases",
    summary: "Environment governance, schema releases, rollback, and demo tenants.",
    group: "Service & governance",
    icon: Rocket,
    stage: "Added to scope",
    capabilities: [
      "Separate development, staging, and production environments.",
      "Coordinate releases, database migrations, and rollback plans.",
      "Version database schemas and API documentation.",
      "Maintain safe test data and sandbox tenants.",
      "Provide a demo school with synthetic data for training and sales.",
      "Publish changelogs and release notes.",
    ],
  },
]

const prototypeSectionIds = new Set([
  "tenants",
  "accounts",
  "access",
  "configuration",
  "security",
  "data",
  "governance",
])

const groups = ["Platform", "Operations", "Trust & reliability", "Service & governance"]

function SectionStatus({ stage }: { stage: AdminSection["stage"] }) {
  return (
    <Badge variant={stage === "Prototype UI" ? "secondary" : "outline"} className="shrink-0 self-start font-medium">
      {stage}
    </Badge>
  )
}

function SectionButton({
  section,
  active,
  onSelect,
  compact = false,
}: {
  section: AdminSection
  active: boolean
  onSelect: (id: string) => void
  compact?: boolean
}) {
  const Icon = section.icon

  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="sm"
      aria-current={active ? "page" : undefined}
      onClick={() => onSelect(section.id)}
      className={`w-full justify-start gap-3 text-left ${compact ? "min-w-max px-3" : "min-h-10 px-3"}`}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className="truncate">{section.title}</span>
      {prototypeSectionIds.has(section.id) && !compact && (
        <span className="ml-auto size-1.5 shrink-0 rounded-full bg-primary/60" aria-label="Prototype interface exists" />
      )}
    </Button>
  )
}

function SectionNavigation({
  activeSection,
  onSelect,
  search,
  onSearchChange,
}: {
  activeSection: string
  onSelect: (id: string) => void
  search: string
  onSearchChange: (value: string) => void
}) {
  const filteredSections = useMemo(
    () => sections.filter((section) => section.title.toLowerCase().includes(search.toLowerCase())),
    [search],
  )

  return (
    <>
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          aria-label="Search admin areas"
          placeholder="Find an admin area"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          className="pl-9"
        />
      </div>
      <nav aria-label="System administration areas" className="flex flex-col gap-5">
        {groups.map((group) => {
          const groupSections = filteredSections.filter((section) => section.group === group)
          if (groupSections.length === 0) return null
          return (
            <div key={group}>
              <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">{group}</h2>
              <div className="flex flex-col gap-1">
                {groupSections.map((section) => (
                  <SectionButton
                    key={section.id}
                    section={section}
                    active={activeSection === section.id}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </nav>
      {filteredSections.length === 0 && (
        <p className="px-3 py-4 text-sm text-muted-foreground">No admin areas match that search.</p>
      )}
    </>
  )
}

function Overview({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-card via-card to-primary/5">
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="max-w-2xl">
            <Badge variant="secondary" className="mb-3">System administration</Badge>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">A clear view of the whole platform.</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
              Explore the 14 administration areas from your scope list, from school onboarding to release operations.
            </p>
          </div>
          <div className="flex size-16 shrink-0 items-center justify-center self-start rounded-2xl bg-primary/10 text-primary sm:size-20 sm:self-center">
            <LayoutDashboard className="size-8" aria-hidden="true" />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Coverage</CardDescription>
            <CardTitle className="text-2xl">14 areas</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Every domain from the requested admin scope is represented.</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Prototype screens</CardDescription>
            <CardTitle className="text-2xl">7 areas</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Existing admin UI is marked clearly where it is still prototype-only.</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Production workflows</CardDescription>
            <CardTitle className="text-2xl">Not wired</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">This update organizes the requested areas; it does not activate database-backed admin actions.</CardContent>
        </Card>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">All administration areas</h2>
          <p className="text-sm text-muted-foreground">Select a section to review its responsibilities.</p>
        </div>
        <span className="hidden text-xs text-muted-foreground sm:block">14 sections</span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect(section.id)}
              className="group rounded-xl border bg-card p-4 text-left transition-colors hover:border-primary/30 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <ChevronRight className="mt-1 size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium">{section.title}</h3>
                <SectionStatus stage={section.stage} />
              </div>
              <p className="mt-2 text-sm leading-5 text-muted-foreground">{section.summary}</p>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SectionDetails({ section }: { section: AdminSection }) {
  const Icon = section.icon

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">{section.group}</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">{section.title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{section.summary}</p>
          </div>
        </div>
        <SectionStatus stage={section.stage} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scope and responsibilities</CardTitle>
            <CardDescription>{section.capabilities.length} responsibilities from the attached scope list</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-3">
              {section.capabilities.map((capability) => (
                <li key={capability} className="flex items-start gap-3 text-sm leading-6">
                  <CircleCheck className="mt-1 size-4 shrink-0 text-primary" aria-hidden="true" />
                  <span>{capability}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Implementation status</CardTitle>
            <CardDescription>Current state of this area in the dashboard</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-amber-500" aria-hidden="true" />
              <span className="text-sm font-medium">{section.stage}</span>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {section.stage === "Prototype UI"
                ? "A related screen exists in the project, but it uses sample or local-only behavior and is not a production control surface."
                : "This area is now listed and organized in the dashboard. Operational workflows and live data connections are not part of this update."}
            </p>
            <div className="rounded-lg bg-muted/60 p-3 text-xs leading-5 text-muted-foreground">
              No real accounts, payments, notifications, school records, or system settings are changed from this section yet.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export function SystemAdminDashboardWorkspace() {
  const [activeSection, setActiveSection] = useState("overview")
  const [search, setSearch] = useState("")
  const currentSection = sections.find((section) => section.id === activeSection)

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-muted/20">
      <div className="mx-auto max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-primary">ShuleVerse control room</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">System administrator</h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Platform-wide oversight for schools, accounts, safety, support, and operations.
            </p>
          </div>
          <Badge variant="outline" className="w-fit gap-2 bg-background px-3 py-1.5">
            <span className="size-2 rounded-full bg-amber-500" aria-hidden="true" />
            Scope directory
          </Badge>
        </header>

        <div className="mt-6 grid gap-6 md:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="hidden self-start rounded-xl border bg-card p-3 md:sticky md:top-20 md:block md:max-h-[calc(100vh-6rem)] md:overflow-y-auto">
            <div className="mb-4 px-3 pt-2">
              <p className="text-sm font-semibold">Admin workspace</p>
              <p className="mt-1 text-xs text-muted-foreground">Navigate the full platform scope</p>
            </div>
            <Button
              type="button"
              variant={activeSection === "overview" ? "secondary" : "ghost"}
              size="sm"
              aria-current={activeSection === "overview" ? "page" : undefined}
              onClick={() => setActiveSection("overview")}
              className="mb-4 min-h-10 w-full justify-start gap-3 px-3"
            >
              <LayoutDashboard className="size-4" aria-hidden="true" />
              Overview
            </Button>
            <SectionNavigation
              activeSection={activeSection}
              onSelect={setActiveSection}
              search={search}
              onSearchChange={setSearch}
            />
            <div className="mt-5 border-t px-3 pt-4">
              <p className="text-xs leading-5 text-muted-foreground">
                Prototype markers identify areas with existing non-production screens.
              </p>
            </div>
          </aside>

          <div className="min-w-0">
            <nav aria-label="Mobile system administration areas" className="mb-4 flex gap-2 overflow-x-auto pb-2 md:hidden">
              <Button
                type="button"
                variant={activeSection === "overview" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setActiveSection("overview")}
                className="min-w-max"
              >
                <LayoutDashboard className="size-4" data-icon="inline-start" aria-hidden="true" />
                Overview
              </Button>
              {sections.map((section) => (
                <SectionButton
                  key={section.id}
                  section={section}
                  active={activeSection === section.id}
                  onSelect={setActiveSection}
                  compact
                />
              ))}
            </nav>

            <section aria-label="Selected administration area" aria-live="polite" className="min-w-0">
              {currentSection ? (
                <SectionDetails section={currentSection} />
              ) : (
                <Overview onSelect={setActiveSection} />
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
