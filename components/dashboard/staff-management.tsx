"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileUp, Plus, Search, ShieldCheck, UserRound } from "lucide-react"

type StaffRecord = {
  id: string
  name: string
  gender: string
  dob: string
  nationalId: string
  tsc: string
  kra: string
  nssf: string
  sha: string
  employment: "Teaching" | "Non-teaching"
  employer: "TSC" | "BOM" | "Private contract"
  qualification: string
  subjects: string
  classes: string
  jobTitle: string
  department: string
  joined: string
  contract: string
  contractExpiry: string
  phone: string
  email: string
  nextOfKin: string
  address: string
  salary: string
  payrollNumber: string
  status: "Active" | "On leave" | "Inactive"
  documents: string[]
}

const initialStaff: StaffRecord[] = [
  { id: "st-01", name: "Sarah Njoroge", gender: "Female", dob: "1987-04-12", nationalId: "•••••••••42", tsc: "TSC-••••184", kra: "•••••••••K", nssf: "•••••381", sha: "•••••092", employment: "Teaching", employer: "TSC", qualification: "B.Ed. Mathematics", subjects: "Mathematics", classes: "Grade 7A, Grade 8B", jobTitle: "Senior Teacher", department: "Mathematics", joined: "2018-01-15", contract: "Permanent", contractExpiry: "", phone: "+254 712 000 184", email: "sarah.njoroge@school.ac.ke", nextOfKin: "On file", address: "Nairobi County", salary: "", payrollNumber: "", status: "Active", documents: ["Teaching certificate.pdf", "Employment contract.pdf"] },
  { id: "st-02", name: "Peter Omondi", gender: "Male", dob: "1991-09-22", nationalId: "•••••••••17", tsc: "TSC-••••627", kra: "•••••••••O", nssf: "•••••554", sha: "•••••107", employment: "Teaching", employer: "BOM", qualification: "B.Sc. Biology, PGDE", subjects: "Biology, Chemistry", classes: "Grade 9A, Grade 10A", jobTitle: "Teacher", department: "Sciences", joined: "2021-05-03", contract: "Fixed term", contractExpiry: "2027-12-31", phone: "+254 723 000 627", email: "peter.omondi@school.ac.ke", nextOfKin: "On file", address: "Kiambu County", salary: "KSh 54,000", payrollNumber: "PAY-00627", status: "Active", documents: ["Degree certificate.pdf"] },
  { id: "st-03", name: "Grace Wanjiku", gender: "Female", dob: "1984-02-08", nationalId: "•••••••••63", tsc: "—", kra: "•••••••••W", nssf: "•••••741", sha: "•••••335", employment: "Non-teaching", employer: "Private contract", qualification: "Diploma in Procurement", subjects: "—", classes: "—", jobTitle: "Procurement Officer", department: "Operations", joined: "2022-08-01", contract: "Fixed term", contractExpiry: "2027-08-01", phone: "+254 701 000 963", email: "grace.wanjiku@school.ac.ke", nextOfKin: "On file", address: "Nairobi County", salary: "KSh 47,500", payrollNumber: "PAY-00963", status: "On leave", documents: ["ID copy.pdf", "Employment contract.pdf"] },
  { id: "st-04", name: "Daniel Mwangi", gender: "Male", dob: "1993-11-17", nationalId: "•••••••••09", tsc: "—", kra: "•••••••••M", nssf: "•••••819", sha: "•••••416", employment: "Non-teaching", employer: "BOM", qualification: "Certificate in ICT", subjects: "—", classes: "—", jobTitle: "ICT Support Officer", department: "ICT", joined: "2023-01-09", contract: "Permanent", contractExpiry: "", phone: "+254 733 000 409", email: "daniel.mwangi@school.ac.ke", nextOfKin: "On file", address: "Machakos County", salary: "KSh 42,000", payrollNumber: "PAY-00409", status: "Active", documents: ["ICT certificate.pdf"] },
]

const emptyStaff: StaffRecord = {
  id: "", name: "", gender: "", dob: "", nationalId: "", tsc: "", kra: "", nssf: "", sha: "", employment: "Teaching", employer: "TSC", qualification: "", subjects: "", classes: "", jobTitle: "", department: "", joined: "", contract: "Permanent", contractExpiry: "", phone: "", email: "", nextOfKin: "", address: "", salary: "", payrollNumber: "", status: "Active", documents: [],
}

function StaffField({ label, value, onChange, type = "text", required = false }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean }) {
  const id = `staff-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
  return <div className="flex flex-col gap-2"><Label htmlFor={id}>{label}{required ? " *" : ""}</Label><Input id={id} type={type} value={value} required={required} onChange={(event) => onChange(event.target.value)} /></div>
}

export function StaffManagement() {
  const [staff, setStaff] = useState(initialStaff)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("all")
  const [selected, setSelected] = useState<StaffRecord | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<StaffRecord>(emptyStaff)
  const [activeTab, setActiveTab] = useState("all")

  const filteredStaff = useMemo(() => staff.filter((member) => {
    const normalizedQuery = query.trim().toLowerCase()
    const matchesQuery = !normalizedQuery || [member.name, member.jobTitle, member.department, member.email].some((value) => value.toLowerCase().includes(normalizedQuery))
    const matchesCategory = category === "all" || member.employment.toLowerCase().replace("-", " ") === category
    const matchesTab = activeTab === "all" || member.status.toLowerCase().replace(" ", "-") === activeTab
    return matchesQuery && matchesCategory && matchesTab
  }), [staff, query, category, activeTab])

  const updateField = (field: keyof StaffRecord, value: string) => setEditing((current) => ({ ...current, [field]: value }))
  const openNewForm = () => { setEditing({ ...emptyStaff, id: `st-${Date.now()}` }); setFormOpen(true) }
  const saveStaff = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStaff((current) => editing.id && current.some((member) => member.id === editing.id)
      ? current.map((member) => member.id === editing.id ? editing : member)
      : [...current, editing])
    setFormOpen(false)
  }
  const setEnumField = (field: "employment" | "employer" | "contract" | "status", value: string) => setEditing((current) => ({ ...current, [field]: value } as StaffRecord))

  return (
    <section className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-1"><h1 className="text-3xl font-bold tracking-tight">Staff management</h1><p className="text-muted-foreground">Manage teaching and non-teaching staff records, contracts, assignments, and documents.</p></div>
        <Button onClick={openNewForm}><Plus data-icon="inline-start" /> Add staff member</Button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[{ label: "Total staff", value: staff.length, note: "Across all departments" }, { label: "Teaching staff", value: staff.filter((member) => member.employment === "Teaching").length, note: "Teachers and academic leads" }, { label: "Non-teaching", value: staff.filter((member) => member.employment === "Non-teaching").length, note: "Operations and support" }, { label: "Contracts to review", value: staff.filter((member) => member.contractExpiry && new Date(member.contractExpiry) < new Date("2027-02-01")).length, note: "Expiring within 90 days" }].map((stat) => <Card key={stat.label}><CardHeader className="pb-2"><CardDescription>{stat.label}</CardDescription><CardTitle className="text-3xl">{stat.value}</CardTitle></CardHeader><CardContent className="text-sm text-muted-foreground">{stat.note}</CardContent></Card>)}
      </div>

      <Card>
        <CardHeader><div className="flex flex-col gap-1"><CardTitle>Staff directory</CardTitle><CardDescription>Personal identifiers and payroll are masked in this directory. Open a profile to review authorized details.</CardDescription></div></CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <Tabs value={activeTab} onValueChange={setActiveTab}><TabsList><TabsTrigger value="all">All staff</TabsTrigger><TabsTrigger value="active">Active</TabsTrigger><TabsTrigger value="on-leave">On leave</TabsTrigger><TabsTrigger value="inactive">Inactive</TabsTrigger></TabsList></Tabs>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative sm:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search staff" className="pl-9" placeholder="Search name, role, email..." value={query} onChange={(event) => setQuery(event.target.value)} /></div>
              <Select value={category} onValueChange={setCategory}><SelectTrigger className="sm:w-48" aria-label="Filter by staff category"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All staff types</SelectItem><SelectItem value="teaching">Teaching</SelectItem><SelectItem value="non teaching">Non-teaching</SelectItem></SelectContent></Select>
            </div>
          </div>
          <div className="overflow-x-auto rounded-md border"><Table><TableHeader><TableRow><TableHead>Staff member</TableHead><TableHead>Role / department</TableHead><TableHead>Employer</TableHead><TableHead>Classes & subjects</TableHead><TableHead>Joined</TableHead><TableHead>Status</TableHead><TableHead><span className="sr-only">Actions</span></TableHead></TableRow></TableHeader><TableBody>
            {filteredStaff.length ? filteredStaff.map((member) => <TableRow key={member.id}><TableCell><div className="flex items-center gap-3"><Avatar><AvatarFallback>{member.name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</AvatarFallback></Avatar><div className="min-w-44"><div className="font-medium">{member.name}</div><div className="text-sm text-muted-foreground">{member.email}</div></div></div></TableCell><TableCell><div className="font-medium">{member.jobTitle}</div><div className="text-sm text-muted-foreground">{member.department} · {member.employment}</div></TableCell><TableCell>{member.employer}</TableCell><TableCell><div className="max-w-56 text-sm">{member.subjects === "—" ? "Support role" : member.subjects}<div className="text-muted-foreground">{member.classes}</div></div></TableCell><TableCell>{member.joined || "—"}</TableCell><TableCell><Badge variant={member.status === "Active" ? "default" : "secondary"}>{member.status}</Badge></TableCell><TableCell><Button variant="outline" size="sm" onClick={() => setSelected(member)}>View profile</Button></TableCell></TableRow>) : <TableRow><TableCell colSpan={7} className="h-24 text-center text-muted-foreground">No staff match these filters.</TableCell></TableRow>}
          </TableBody></Table></div>
          <p className="text-xs text-muted-foreground">{filteredStaff.length} of {staff.length} staff members</p>
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}><DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto"><DialogHeader><DialogTitle>{staff.some((member) => member.id === editing.id) ? "Edit staff profile" : "Add staff member"}</DialogTitle><DialogDescription>Complete employment and contact details. Fields marked * are required.</DialogDescription></DialogHeader>
        <form className="flex flex-col gap-6" onSubmit={saveStaff}>
          <fieldset className="flex flex-col gap-4"><legend className="mb-3 font-semibold">Personal details</legend><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><StaffField label="Full name" value={editing.name} onChange={(value) => updateField("name", value)} required /><div className="flex flex-col gap-2"><Label htmlFor="staff-gender">Gender</Label><Select value={editing.gender} onValueChange={(value) => updateField("gender", value)}><SelectTrigger id="staff-gender"><SelectValue placeholder="Select gender" /></SelectTrigger><SelectContent><SelectItem value="Female">Female</SelectItem><SelectItem value="Male">Male</SelectItem><SelectItem value="Prefer not to say">Prefer not to say</SelectItem></SelectContent></Select></div><StaffField label="Date of birth" type="date" value={editing.dob} onChange={(value) => updateField("dob", value)} /><StaffField label="National ID number" value={editing.nationalId} onChange={(value) => updateField("nationalId", value)} /><StaffField label="Phone" value={editing.phone} onChange={(value) => updateField("phone", value)} /><StaffField label="Email" type="email" value={editing.email} onChange={(value) => updateField("email", value)} /><StaffField label="Next of kin" value={editing.nextOfKin} onChange={(value) => updateField("nextOfKin", value)} /><StaffField label="Address / county" value={editing.address} onChange={(value) => updateField("address", value)} /></div></fieldset>
          <fieldset className="flex flex-col gap-4"><legend className="mb-3 font-semibold">Employment & assignment</legend><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><div className="flex flex-col gap-2"><Label htmlFor="staff-type">Staff category</Label><Select value={editing.employment} onValueChange={(value) => setEnumField("employment", value)}><SelectTrigger id="staff-type"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Teaching">Teaching</SelectItem><SelectItem value="Non-teaching">Non-teaching</SelectItem></SelectContent></Select></div><div className="flex flex-col gap-2"><Label htmlFor="staff-employer">Employer type</Label><Select value={editing.employer} onValueChange={(value) => setEnumField("employer", value)}><SelectTrigger id="staff-employer"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="TSC">TSC</SelectItem><SelectItem value="BOM">BOM</SelectItem><SelectItem value="Private contract">Private contract</SelectItem></SelectContent></Select></div><StaffField label="Job title" value={editing.jobTitle} onChange={(value) => updateField("jobTitle", value)} required /><StaffField label="Department" value={editing.department} onChange={(value) => updateField("department", value)} /><StaffField label="Qualifications" value={editing.qualification} onChange={(value) => updateField("qualification", value)} /><StaffField label="Subjects taught" value={editing.subjects} onChange={(value) => updateField("subjects", value)} /><StaffField label="Classes assigned" value={editing.classes} onChange={(value) => updateField("classes", value)} /><StaffField label="Date joined" type="date" value={editing.joined} onChange={(value) => updateField("joined", value)} /><div className="flex flex-col gap-2"><Label htmlFor="staff-contract">Contract type</Label><Select value={editing.contract} onValueChange={(value) => setEnumField("contract", value)}><SelectTrigger id="staff-contract"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Permanent">Permanent</SelectItem><SelectItem value="Fixed term">Fixed term</SelectItem><SelectItem value="Part time">Part time</SelectItem><SelectItem value="Casual">Casual</SelectItem></SelectContent></Select></div><StaffField label="Contract expiry" type="date" value={editing.contractExpiry} onChange={(value) => updateField("contractExpiry", value)} /></div></fieldset>
          <fieldset className="flex flex-col gap-4"><legend className="mb-3 font-semibold">Statutory identifiers</legend><p className="-mt-2 text-sm text-muted-foreground">Keep identity numbers private and share only with authorized administrators.</p><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><StaffField label="TSC number" value={editing.tsc} onChange={(value) => updateField("tsc", value)} /><StaffField label="KRA PIN" value={editing.kra} onChange={(value) => updateField("kra", value)} /><StaffField label="NSSF number" value={editing.nssf} onChange={(value) => updateField("nssf", value)} /><StaffField label="SHA / NHIF number" value={editing.sha} onChange={(value) => updateField("sha", value)} /></div></fieldset>
          <fieldset className="flex flex-col gap-4"><legend className="mb-3 font-semibold">Payroll & documents</legend><p className="-mt-2 flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck /> Payroll data should only be accessible to authorized school administrators.</p><div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">Salary and payroll identifiers are intentionally not collected here. Add them only after finance-role authorization and protected server-side storage are configured.</div><div className="flex flex-col gap-2"><Label htmlFor="staff-documents">Certificates, contracts, or ID copies</Label><Input id="staff-documents" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={(event) => setEditing((current) => ({ ...current, documents: Array.from(event.target.files ?? []).map((file) => file.name) }))} /><p className="text-xs text-muted-foreground">File names are listed for this session only; secure document storage is not enabled in this prototype.</p></div></fieldset>
          <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setFormOpen(false)}>Cancel</Button><Button type="submit">Save staff profile</Button></div>
        </form>
      </DialogContent></Dialog>

      <Dialog open={Boolean(selected)} onOpenChange={(open) => { if (!open) setSelected(null) }}><DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto"><DialogHeader><DialogTitle>{selected?.name}</DialogTitle><DialogDescription>{selected?.jobTitle} · {selected?.department} · Staff profile</DialogDescription></DialogHeader>
        {selected && <div className="flex flex-col gap-6"><div className="flex items-center gap-3 rounded-lg border p-4"><Avatar className="size-12"><AvatarFallback><UserRound /></AvatarFallback></Avatar><div className="min-w-0 flex-1"><p className="font-medium">{selected.email}</p><p className="text-sm text-muted-foreground">{selected.phone}</p></div><Badge variant={selected.status === "Active" ? "default" : "secondary"}>{selected.status}</Badge></div>
          <div className="grid gap-6 sm:grid-cols-2"><div className="flex flex-col gap-3"><h3 className="font-semibold">Personal & statutory</h3><p className="text-sm">Gender: {selected.gender || "—"}</p><p className="text-sm">Date of birth: {selected.dob || "—"}</p><p className="text-sm">National ID: {selected.nationalId || "Not recorded"}</p><p className="text-sm">TSC: {selected.tsc || "—"} · KRA: {selected.kra || "—"}</p><p className="text-sm">NSSF: {selected.nssf || "—"} · SHA/NHIF: {selected.sha || "—"}</p><p className="text-sm">Next of kin: {selected.nextOfKin || "—"}</p><p className="text-sm">Address: {selected.address || "—"}</p></div><div className="flex flex-col gap-3"><h3 className="font-semibold">Employment</h3><p className="text-sm">Category: {selected.employment} · Employer: {selected.employer}</p><p className="text-sm">Joined: {selected.joined || "—"} · Contract: {selected.contract}</p><p className="text-sm">Contract expiry: {selected.contractExpiry || "Not applicable"}</p><p className="text-sm">Qualification: {selected.qualification || "—"}</p><p className="text-sm">Subjects: {selected.subjects} · Classes: {selected.classes}</p><h3 className="pt-2 font-semibold">Documents</h3>{selected.documents.length ? selected.documents.map((document) => <p className="flex items-center gap-2 text-sm" key={document}><FileUp />{document}</p>) : <p className="text-sm text-muted-foreground">No documents listed</p>}</div></div>
          <div className="rounded-lg border p-4"><div className="mb-3 flex items-center justify-between gap-3"><div><h3 className="font-semibold">Payroll details</h3><p className="text-sm text-muted-foreground">Salary and payroll identifiers are withheld from this dashboard.</p></div><Badge variant="secondary">Restricted</Badge></div><p className="text-sm text-muted-foreground">Payroll records require server-enforced finance permissions and private storage. This preview does not expose or collect compensation values.</p></div>
          <div className="flex justify-end"><Button variant="outline" onClick={() => { setEditing(selected); setSelected(null); setFormOpen(true) }}>Edit profile</Button></div>
        </div>}
      </DialogContent></Dialog>
    </section>
  )
}
