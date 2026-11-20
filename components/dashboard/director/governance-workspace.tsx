"use client"

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react"
import useSWR from "swr"
import { Activity, ArrowDownToLine, Check, ClipboardList, Download, FileUp, LoaderCircle, ShieldCheck, Users, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const fetcher = async (url: string) => {
  const response = await fetch(url, { cache: "no-store" })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || "Unable to load governance data")
  return data
}
const post = async (method: "POST" | "PATCH" | "PUT", payload: unknown) => {
  const response = await fetch("/api/governance", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || "Unable to save changes")
  return data
}
const roles = ["head_teacher", "deputy_head_teacher", "class_teacher", "subject_teacher", "accountant", "librarian", "school_nurse", "school_counselor"]
const modules = ["students", "staff", "attendance", "academics", "finance", "library", "health", "communications", "operations", "school_settings"]
const roleLabel = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
const money = (value: number) => new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 0 }).format(value)

export function GovernanceWorkspace() {
  const { data, error, isLoading, mutate } = useSWR("/api/governance", fetcher, { revalidateOnFocus: false })
  const [busy, setBusy] = useState(false)
  const [requestType, setRequestType] = useState("large_expenditure")
  const [schoolId, setSchoolId] = useState("")
  const [preferences, setPreferences] = useState<Record<string, boolean> | null>(null)
  const [profile, setProfile] = useState<Record<string, string> | null>(null)

  async function save(payload: unknown, success: string) {
    setBusy(true)
    try { await post("PATCH", payload); await mutate(); toast({ title: success }) }
    catch (reason) { toast({ title: "Unable to save", description: reason instanceof Error ? reason.message : "Please try again.", variant: "destructive" }) }
    finally { setBusy(false) }
  }

  async function submitApproval(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formElement = event.currentTarget
    const form = new FormData(formElement)
    try {
      setBusy(true)
      await post("POST", { action: "request_approval", schoolId: schoolId || data.schools[0]?.id, requestType, subject: String(form.get("subject") || ""), details: String(form.get("details") || ""), amount: form.get("amount") ? Number(form.get("amount")) : null })
      formElement.reset()
      await mutate()
      toast({ title: "Approval request submitted" })
    } catch (reason) { toast({ title: "Unable to submit request", description: reason instanceof Error ? reason.message : "Please try again.", variant: "destructive" }) }
    finally { setBusy(false) }
  }

  async function submitEscalation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    try {
      setBusy(true)
      await post("POST", { action: "escalate", schoolId: data.schools[0]?.id, subject: String(fields.get("escalation-subject") || ""), details: String(fields.get("escalation-details") || "") })
      form.reset()
      await mutate()
      toast({ title: "Issue escalated for director review" })
    } catch (reason) { toast({ title: "Unable to escalate this issue", description: reason instanceof Error ? reason.message : "Please try again.", variant: "destructive" }) }
    finally { setBusy(false) }
  }

  async function exportBackup() {
    try {
      const backup = { exportedAt: new Date().toISOString(), app: "ShuleVerse", ...data }
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `shuleverse-governance-backup-${new Date().toISOString().slice(0, 10)}.json`
      link.click()
      URL.revokeObjectURL(url)
      toast({ title: "Governance backup downloaded" })
    } catch { toast({ title: "Unable to create a backup", variant: "destructive" }) }
  }

  async function importAssignments(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const lines = (await file.text()).trim().split(/\r?\n/)
      const headers = lines.shift()?.split(",").map((item) => item.trim().toLowerCase()) ?? []
      const emailIndex = headers.indexOf("email")
      const schoolIndex = headers.indexOf("schoolid")
      const roleIndex = headers.indexOf("role")
      if ([emailIndex, schoolIndex, roleIndex].some((index) => index < 0)) throw new Error("CSV headers must be email, schoolId, role")
      const assignments = lines.filter(Boolean).map((line) => {
        const cells = line.split(",").map((item) => item.trim())
        return { email: cells[emailIndex], schoolId: cells[schoolIndex], role: cells[roleIndex] }
      })
      const result = await post("PUT", { assignments })
      await mutate()
      toast({ title: `${result.imported} assignments imported`, description: `${result.skipped} skipped` })
    } catch (reason) { toast({ title: "Unable to import assignments", description: reason instanceof Error ? reason.message : "Please check the CSV and try again.", variant: "destructive" }) }
    finally { event.target.value = "" }
  }

  if (isLoading) return <div className="flex min-h-64 items-center justify-center text-muted-foreground"><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Loading governance workspace</div>
  if (error) return <Card><CardContent className="flex flex-col items-start gap-3 p-6"><p role="alert" className="text-sm text-destructive">{error.message === "Authentication required" ? "Sign in with a director or head-teacher account to open governance controls." : error.message}</p><Button variant="outline" onClick={() => mutate()}>Try again</Button></CardContent></Card>
  if (!data) return null

  const currentProfile = profile ?? { firstName: data.profile?.first_name ?? "", lastName: data.profile?.last_name ?? "", phone: data.profile?.phone ?? "", tscNumber: data.profile?.tsc_number ?? "", photoUrl: data.profile?.photo_url ?? "" }
  const currentPreferences = preferences ?? data.preferences
  const access = (role: string, module: string) => data.permissions.find((item: any) => item.role === role && item.module_key === module)?.access_level ?? (role === "head_teacher" ? "edit" : "view")
  const formatDate = (value: string) => new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))

  return <section className="space-y-5">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div><p className="text-sm font-medium text-primary">School governance</p><h2 className="text-2xl font-semibold tracking-tight">Access, oversight &amp; approvals</h2><p className="mt-1 text-sm text-muted-foreground">Manage account controls, review requests, and keep a clear record of decisions.</p></div>
      <Button variant="outline" onClick={exportBackup}><Download className="mr-2 h-4 w-4" />Download backup</Button>
    </div>
    <div className="grid gap-3 sm:grid-cols-3">
      <Metric icon={<Users className="h-4 w-4" />} label="Schools in scope" value={data.schools.length} />
      <Metric icon={<ClipboardList className="h-4 w-4" />} label="Pending approvals" value={data.summary.pendingApprovals} />
      <Metric icon={<Activity className="h-4 w-4" />} label="Escalations" value={data.summary.escalations} />
    </div>
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList className="h-auto flex-wrap justify-start"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="access">Roles &amp; access</TabsTrigger><TabsTrigger value="approvals">Approvals</TabsTrigger><TabsTrigger value="profile">Profile &amp; alerts</TabsTrigger><TabsTrigger value="audit">Audit trail</TabsTrigger><TabsTrigger value="data">Data tools</TabsTrigger></TabsList>
      <TabsContent value="overview" className="space-y-4">
        <Card><CardHeader><CardTitle>School comparison</CardTitle><CardDescription>Live enrolment and recorded fee payments for schools assigned to your director account.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-sm"><thead><tr className="border-b text-left text-muted-foreground"><th className="pb-3 font-medium">School</th><th className="pb-3 font-medium">County</th><th className="pb-3 text-right font-medium">Enrolment</th><th className="pb-3 text-right font-medium">Attendance · 30d</th><th className="pb-3 text-right font-medium">Fees collected</th><th className="pb-3 text-right font-medium">Mean score</th></tr></thead><tbody>{data.schools.map((school: any) => <tr className="border-b last:border-0" key={school.id}><td className="py-3 font-medium">{school.name}</td><td className="py-3 text-muted-foreground">{school.county || "—"}</td><td className="py-3 text-right tabular-nums">{school.enrolment.toLocaleString()}</td><td className="py-3 text-right tabular-nums">{school.attendanceRate == null ? "—" : `${school.attendanceRate}%`}</td><td className="py-3 text-right tabular-nums">{money(school.feesCollected)}</td><td className="py-3 text-right tabular-nums">{school.meanScore == null ? "—" : `${school.meanScore}%`}</td></tr>)}</tbody></table>{!data.schools.length && <p className="py-6 text-center text-sm text-muted-foreground">No schools are currently assigned to this director account.</p>}</div><p className="mt-3 text-xs text-muted-foreground">Mean score is the average percentage across valid recorded assessment results; schools without recorded results show —.</p></CardContent></Card>
        <div className="grid gap-4 lg:grid-cols-2"><Card><CardHeader><CardTitle>Director approvals</CardTitle><CardDescription>Requests awaiting director review.</CardDescription></CardHeader><CardContent className="space-y-3">{data.approvals.filter((item: any) => item.status === "pending").slice(0, 5).map((item: any) => <div className="flex items-start justify-between gap-3 rounded-lg border p-3" key={item.id}><div><p className="font-medium">{item.subject}</p><p className="mt-1 text-xs text-muted-foreground">{roleLabel(item.request_type)} · {formatDate(item.requested_at)}</p></div><Badge variant="secondary">Pending</Badge></div>)}{!data.approvals.some((item: any) => item.status === "pending") && <p className="text-sm text-muted-foreground">No pending requests.</p>}</CardContent></Card><Card><CardHeader><CardTitle>Recent escalations</CardTitle><CardDescription>Issues raised by school leaders for director visibility.</CardDescription></CardHeader><CardContent className="space-y-3">{data.audit.filter((item: any) => item.action === "escalated").slice(0, 5).map((item: any) => <div className="rounded-lg border p-3" key={item.id}><p className="text-sm">{item.summary}</p><p className="mt-1 text-xs text-muted-foreground">{formatDate(item.created_at)}</p></div>)}{!data.audit.some((item: any) => item.action === "escalated") && <p className="text-sm text-muted-foreground">No escalations have been recorded.</p>}</CardContent></Card></div>
        {data.role !== "director" && <Card><CardHeader><CardTitle>Escalate an issue</CardTitle><CardDescription>Raise a concern that needs director attention. The escalation is recorded in the audit trail.</CardDescription></CardHeader><CardContent><form onSubmit={submitEscalation} className="grid gap-4 md:grid-cols-[1fr_2fr_auto] md:items-end"><div className="space-y-2"><Label htmlFor="escalation-subject">Issue</Label><Input id="escalation-subject" name="escalation-subject" required maxLength={160} placeholder="What needs attention?" /></div><div className="space-y-2"><Label htmlFor="escalation-details">Context</Label><Input id="escalation-details" name="escalation-details" required maxLength={3000} placeholder="Provide enough detail for follow-up" /></div><Button type="submit" disabled={busy || !data.schools.length}>Escalate</Button></form></CardContent></Card>}
      </TabsContent>
      <TabsContent value="access"><div className="grid gap-4 lg:grid-cols-[1fr_320px]"><Card><CardHeader><CardTitle>Module permissions</CardTitle><CardDescription>Director-controlled defaults for school staff. Head teachers can view or edit according to each module setting.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full min-w-[600px] text-sm"><thead><tr className="border-b text-left text-muted-foreground"><th className="pb-3 font-medium">Role</th>{modules.map((module) => <th key={module} className="px-2 pb-3 text-center font-medium">{roleLabel(module)}</th>)}</tr></thead><tbody>{roles.map((role) => <tr className="border-b last:border-0" key={role}><th className="py-3 text-left font-medium">{roleLabel(role)}</th>{modules.map((module) => <td key={module} className="px-2 py-2"><Select disabled={data.role !== "director" || busy} value={access(role, module)} onValueChange={(value) => save({ action: "permission", role, module, access: value }, "Permission updated")}><SelectTrigger aria-label={`${roleLabel(role)} ${roleLabel(module)} access`} className="mx-auto h-8 w-[86px]"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">None</SelectItem><SelectItem value="view">View</SelectItem><SelectItem value="edit">Edit</SelectItem></SelectContent></Select></td>)}</tr>)}</tbody></table></div>{data.role !== "director" && <p className="mt-3 text-xs text-muted-foreground">Only the director can change permission levels.</p>}</CardContent></Card><Card><CardHeader><CardTitle>Assigned school roles</CardTitle><CardDescription>Existing staff assignments across your schools.</CardDescription></CardHeader><CardContent className="space-y-3">{data.assignments.slice(0, 8).map((assignment: any) => <div className="flex items-center justify-between gap-2 text-sm" key={assignment.id}><span className="truncate">{roleLabel(assignment.assigned_role)}</span><Badge variant="outline">Assigned</Badge></div>)}{!data.assignments.length && <p className="text-sm text-muted-foreground">No additional role assignments yet.</p>}</CardContent></Card></div></TabsContent>
      <TabsContent value="approvals" className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]"><Card><CardHeader><CardTitle>Approval queue</CardTitle><CardDescription>Large expenditure, staff changes and fee updates submitted by school leaders.</CardDescription></CardHeader><CardContent className="space-y-3">{data.approvals.map((item: any) => <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-start sm:justify-between" key={item.id}><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><p className="font-medium">{item.subject}</p><Badge variant={item.status === "pending" ? "secondary" : item.status === "approved" ? "default" : "destructive"}>{roleLabel(item.status)}</Badge></div><p className="mt-1 text-xs text-muted-foreground">{roleLabel(item.request_type)} · {formatDate(item.requested_at)}{item.amount != null ? ` · ${money(Number(item.amount))}` : ""}</p>{item.details && <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{item.details}</p>}{item.review_note && <p className="mt-2 text-sm">Review note: {item.review_note}</p>}</div>{item.status === "pending" && data.role === "director" && <div className="flex shrink-0 gap-2"><Button size="sm" onClick={() => save({ action: "review", id: item.id, status: "approved", note: "" }, "Request approved")} disabled={busy}><Check className="mr-1 h-4 w-4" />Approve</Button><Button size="sm" variant="outline" onClick={() => save({ action: "review", id: item.id, status: "rejected", note: "Declined by director" }, "Request declined")} disabled={busy}><X className="mr-1 h-4 w-4" />Decline</Button></div>}</div>)}{!data.approvals.length && <p className="py-8 text-center text-sm text-muted-foreground">No approval requests have been submitted.</p>}</CardContent></Card><Card><CardHeader><CardTitle>Submit for approval</CardTitle><CardDescription>Route a decision to the director before the change proceeds.</CardDescription></CardHeader><CardContent><form className="space-y-4" onSubmit={submitApproval}><div className="space-y-2"><Label htmlFor="approval-type">Request type</Label><Select value={requestType} onValueChange={setRequestType}><SelectTrigger id="approval-type"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="large_expenditure">Large expenditure</SelectItem><SelectItem value="staff_hiring">Staff hiring</SelectItem><SelectItem value="staff_dismissal">Staff dismissal</SelectItem><SelectItem value="fee_change">Fee change</SelectItem></SelectContent></Select></div>{data.schools.length > 1 && <div className="space-y-2"><Label htmlFor="approval-school">School</Label><Select value={schoolId || data.schools[0]?.id} onValueChange={setSchoolId}><SelectTrigger id="approval-school"><SelectValue /></SelectTrigger><SelectContent>{data.schools.map((school: any) => <SelectItem key={school.id} value={school.id}>{school.name}</SelectItem>)}</SelectContent></Select></div>}<div className="space-y-2"><Label htmlFor="approval-subject">Subject</Label><Input id="approval-subject" name="subject" required maxLength={160} placeholder="Briefly describe the request" /></div><div className="space-y-2"><Label htmlFor="approval-amount">Amount (optional)</Label><Input id="approval-amount" name="amount" type="number" min="0" step="1" /></div><div className="space-y-2"><Label htmlFor="approval-details">Details</Label><textarea id="approval-details" name="details" maxLength={3000} rows={4} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring" placeholder="Include context the director needs to decide." /></div><Button type="submit" disabled={busy || !data.schools.length} className="w-full">Submit request</Button></form></CardContent></Card></TabsContent>
      <TabsContent value="profile" className="grid gap-4 lg:grid-cols-2"><Card><CardHeader><CardTitle>Head-teacher profile</CardTitle><CardDescription>Keep the contact and professional details associated with your account current.</CardDescription></CardHeader><CardContent><form className="space-y-4" onSubmit={(event) => { event.preventDefault(); save({ action: "profile", ...currentProfile }, "Profile updated") }}><div className="grid gap-4 sm:grid-cols-2"><div className="space-y-2"><Label htmlFor="profile-first-name">First name</Label><Input id="profile-first-name" value={currentProfile.firstName} onChange={(event) => setProfile({ ...currentProfile, firstName: event.target.value })} required /></div><div className="space-y-2"><Label htmlFor="profile-last-name">Last name</Label><Input id="profile-last-name" value={currentProfile.lastName} onChange={(event) => setProfile({ ...currentProfile, lastName: event.target.value })} required /></div><div className="space-y-2"><Label htmlFor="profile-phone">Phone</Label><Input id="profile-phone" value={currentProfile.phone} onChange={(event) => setProfile({ ...currentProfile, phone: event.target.value })} /></div><div className="space-y-2"><Label htmlFor="profile-tsc">TSC number</Label><Input id="profile-tsc" value={currentProfile.tscNumber} onChange={(event) => setProfile({ ...currentProfile, tscNumber: event.target.value })} /></div><div className="space-y-2 sm:col-span-2"><Label htmlFor="profile-photo">Photo URL</Label><Input id="profile-photo" type="url" value={currentProfile.photoUrl} onChange={(event) => setProfile({ ...currentProfile, photoUrl: event.target.value })} placeholder="https://…" /></div></div><p className="text-xs text-muted-foreground">Account email: {data.profile?.email ?? "—"}. Assigned schools are managed by the director.</p><Button type="submit" disabled={busy}>Save profile</Button></form></CardContent></Card><Card><CardHeader><CardTitle>Notification preferences</CardTitle><CardDescription>Choose which governance updates reach you.</CardDescription></CardHeader><CardContent className="space-y-4">{[["email", "Email notifications"], ["in_app", "In-app notifications"], ["approval_updates", "Approval decisions"], ["escalations", "Escalated issues"], ["weekly_digest", "Weekly summary"]].map(([key, label]) => <div className="flex items-center justify-between gap-4" key={key}><Label htmlFor={`pref-${key}`}>{label}</Label><Switch id={`pref-${key}`} checked={Boolean(currentPreferences[key])} onCheckedChange={(checked) => setPreferences({ ...currentPreferences, [key]: checked })} /></div>)}<Separator /><Button disabled={busy} onClick={() => save({ action: "preferences", preferences: currentPreferences }, "Notification preferences saved")}>Save preferences</Button></CardContent></Card></TabsContent>
      <TabsContent value="audit"><Card><CardHeader><CardTitle>Audit history</CardTitle><CardDescription>Governance changes with actor and timestamp, newest first.</CardDescription></CardHeader><CardContent><div className="space-y-3">{data.audit.map((item: any) => <div className="flex gap-3" key={item.id}><div className="mt-0.5 rounded-full bg-muted p-2"><ShieldCheck className="h-4 w-4 text-primary" /></div><div className="min-w-0 flex-1"><p className="text-sm">{item.summary}</p><p className="mt-1 text-xs text-muted-foreground">{item.actor_id === data.profile?.id ? "You" : `User ${item.actor_id ?? "removed"}`} · {formatDate(item.created_at)}</p></div><Badge variant="outline">{roleLabel(item.action)}</Badge></div>)}{!data.audit.length && <p className="py-8 text-center text-sm text-muted-foreground">No governance changes recorded yet.</p>}</div></CardContent></Card></TabsContent>
      <TabsContent value="data" className="grid gap-4 lg:grid-cols-2"><Card><CardHeader><CardTitle>Governance backup</CardTitle><CardDescription>Download a point-in-time JSON export of the data visible in this workspace.</CardDescription></CardHeader><CardContent><p className="mb-4 text-sm text-muted-foreground">Includes school comparison data, access settings, your profile, approval requests, notifications, and audit entries. Store the downloaded file securely.</p><Button onClick={exportBackup}><ArrowDownToLine className="mr-2 h-4 w-4" />Download JSON backup</Button></CardContent></Card><Card><CardHeader><CardTitle>Import staff assignments</CardTitle><CardDescription>Match existing accounts to school roles from a CSV file.</CardDescription></CardHeader><CardContent><p className="mb-3 text-sm text-muted-foreground">Required columns: <code>email,schoolId,role</code>. Imports only existing users and schools already assigned to your director account; unmatched rows are skipped.</p><Label htmlFor="assignment-import" className="sr-only">Choose staff assignment CSV</Label><Input id="assignment-import" type="file" accept=".csv,text/csv" onChange={importAssignments} disabled={data.role !== "director" || busy} /><p className="mt-3 text-xs text-muted-foreground">Roles: {roles.map(roleLabel).join(", ")}</p><div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><FileUp className="h-4 w-4" />No passwords or account credentials are included in imports.</div></CardContent></Card></TabsContent>
    </Tabs>
  </section>
}

function Metric({ icon, label, value }: { icon: ReactNode; label: string; value: number }) {
  return <Card><CardContent className="flex items-center gap-3 p-4"><div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div><div><p className="text-xs text-muted-foreground">{label}</p><p className="text-xl font-semibold tabular-nums">{value}</p></div></CardContent></Card>
}
