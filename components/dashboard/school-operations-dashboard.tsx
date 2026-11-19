"use client"

import { useMemo, useState, type FormEvent, type ReactNode } from "react"
import useSWR from "swr"
import {
  BookMarked, Building2, Bus, CalendarClock, CheckCircle2, CircleAlert, ClipboardList, FlaskConical,
  HardHat, Library, MapPinned, Package, Plus, Search, ShieldCheck, Utensils, Warehouse,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Category = "assets" | "library" | "laboratories" | "stores" | "infrastructure" | "maintenance" | "safety" | "land" | "transport" | "boarding" | "meals"
type Status = "active" | "open" | "in_progress" | "completed" | "overdue" | "inactive" | "checked_out" | "returned" | "needs_restock"
type OperationRecord = {
  id: string
  category: Category
  record_type: string
  name: string
  location: string | null
  status: Status
  quantity: number | null
  due_date: string | null
  details: Record<string, string | number | boolean>
  created_at: string
}
type DashboardData = {
  records: OperationRecord[]
  summary: { totalRecords: number; openMaintenance: number; dueSoon: number; libraryTitles: number; vehicles: number; boardingSpaces: number }
}
type DetailField = { key: string; label: string; placeholder?: string; type?: "text" | "date" | "number" }

const categories: { id: Category; label: string; description: string; icon: typeof Package; types: string[]; fields: DetailField[] }[] = [
  { id: "assets", label: "Assets & inventory", description: "Furniture, equipment and ICT devices", icon: Package, types: ["Furniture", "Equipment", "ICT device", "Textbook set"], fields: [{ key: "assetTag", label: "Asset tag / serial number" }, { key: "condition", label: "Condition" }, { key: "assignedTo", label: "Assigned to" }] },
  { id: "library", label: "Library", description: "Books, loans, returns and fines", icon: Library, types: ["Book", "Borrowing", "Return", "Fine"], fields: [{ key: "author", label: "Author / ISBN" }, { key: "borrower", label: "Borrower" }, { key: "issueDate", label: "Issue date", type: "date" }, { key: "returnDate", label: "Return date", type: "date" }, { key: "fineAmount", label: "Fine amount", type: "number" }] },
  { id: "laboratories", label: "Labs & consumables", description: "Lab equipment, stock and replenishment", icon: FlaskConical, types: ["Equipment", "Consumable", "Chemical", "Practical session"], fields: [{ key: "unit", label: "Unit / pack size" }, { key: "reorderLevel", label: "Reorder level", type: "number" }, { key: "supplier", label: "Supplier" }, { key: "expiryDate", label: "Expiry date", type: "date" }] },
  { id: "stores", label: "Stores", description: "Food, stationery and cleaning supplies", icon: Warehouse, types: ["Food", "Stationery", "Cleaning supplies", "Other stock"], fields: [{ key: "unit", label: "Unit of measure" }, { key: "reorderLevel", label: "Reorder level", type: "number" }, { key: "supplier", label: "Supplier" }, { key: "expiryDate", label: "Expiry date", type: "date" }] },
  { id: "infrastructure", label: "Infrastructure", description: "Classrooms, labs, dorms, toilets and water", icon: Building2, types: ["Classroom", "Laboratory", "Dormitory", "Toilet", "Water source", "Other facility"], fields: [{ key: "capacity", label: "Capacity", type: "number" }, { key: "condition", label: "Condition" }, { key: "lastCheck", label: "Last inspection", type: "date" }] },
  { id: "maintenance", label: "Maintenance", description: "Requests, ownership and progress", icon: HardHat, types: ["Repair request", "Preventive maintenance", "Work order"], fields: [{ key: "priority", label: "Priority" }, { key: "requestedBy", label: "Requested by" }, { key: "assignedTo", label: "Assigned to" }, { key: "resolution", label: "Work / resolution notes" }] },
  { id: "safety", label: "Safety checks", description: "Fire equipment and compliance checks", icon: ShieldCheck, types: ["Fire extinguisher", "First aid kit", "Safety inspection", "Emergency exit"], fields: [{ key: "equipmentType", label: "Equipment / check type" }, { key: "lastInspection", label: "Last inspection", type: "date" }, { key: "inspector", label: "Checked by" }] },
  { id: "land", label: "Land & titles", description: "Land parcels and title documents", icon: MapPinned, types: ["Land parcel", "Title deed", "Lease", "Survey document"], fields: [{ key: "titleNumber", label: "Title / document number" }, { key: "tenure", label: "Tenure" }, { key: "area", label: "Area / acreage" }, { key: "documentLocation", label: "Document location" }] },
  { id: "transport", label: "Transport", description: "Vehicles, drivers, routes and compliance", icon: Bus, types: ["Vehicle", "Route", "Driver", "Insurance", "Inspection"], fields: [{ key: "registration", label: "Registration number" }, { key: "driver", label: "Driver" }, { key: "route", label: "Route" }, { key: "insurer", label: "Insurer / policy number" }, { key: "inspectionDate", label: "Inspection / insurance expiry", type: "date" }] },
  { id: "boarding", label: "Boarding", description: "Dormitory allocation and duty staff", icon: Building2, types: ["Dormitory", "Allocation", "Matrons / patrons"], fields: [{ key: "dormitory", label: "Dormitory / room" }, { key: "student", label: "Student / allocation" }, { key: "matron", label: "Matron / patron" }, { key: "bedCapacity", label: "Bed capacity", type: "number" }] },
  { id: "meals", label: "Meals & menus", description: "Meal plans, menus and service dates", icon: Utensils, types: ["Meal plan", "Menu", "Dietary requirement", "Supplier"], fields: [{ key: "mealType", label: "Meal / plan type" }, { key: "menu", label: "Menu" }, { key: "serviceDate", label: "Service date", type: "date" }, { key: "dietaryNotes", label: "Dietary notes" }] },
]

const statusOptions: { value: Status; label: string }[] = [
  { value: "active", label: "Active" }, { value: "open", label: "Open" }, { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" }, { value: "overdue", label: "Overdue" }, { value: "inactive", label: "Inactive" },
  { value: "checked_out", label: "Checked out" }, { value: "returned", label: "Returned" }, { value: "needs_restock", label: "Needs restock" },
]

const fetcher = async (url: string): Promise<DashboardData> => {
  const response = await fetch(url, { credentials: "same-origin" })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error ?? "Could not load the school operations register")
  return body
}

function labelForStatus(status: string) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function statusVariant(status: Status): "default" | "secondary" | "destructive" | "outline" {
  if (["overdue", "needs_restock"].includes(status)) return "destructive"
  if (["completed", "returned"].includes(status)) return "secondary"
  if (["open", "in_progress", "checked_out"].includes(status)) return "outline"
  return "default"
}

function displayDate(value: string | null) {
  if (!value) return "—"
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${value.slice(0, 10)}T00:00:00`))
}

export function SchoolOperationsDashboard() {
  const { data, error, isLoading, mutate } = useSWR<DashboardData>("/api/school-operations", fetcher)
  const [category, setCategory] = useState<Category | "all">("all")
  const [search, setSearch] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formCategory, setFormCategory] = useState<Category>("assets")
  const [recordType, setRecordType] = useState("Furniture")
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [quantity, setQuantity] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [details, setDetails] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<Status>("active")
  const [formError, setFormError] = useState("")
  const [saving, setSaving] = useState(false)
  const selectedCategory = categories.find((item) => item.id === formCategory) ?? categories[0]
  const activeCategory = categories.find((item) => item.id === category)

  const filteredRecords = useMemo(() => (data?.records ?? []).filter((record) => {
    const matchesCategory = category === "all" || record.category === category
    const query = search.trim().toLocaleLowerCase()
    const matchesSearch = !query || [record.name, record.record_type, record.location, ...Object.values(record.details).map(String)]
      .some((value) => value?.toLocaleLowerCase().includes(query))
    return matchesCategory && matchesSearch
  }), [data?.records, category, search])

  const openCreateDialog = () => {
    setFormCategory(category === "all" ? "assets" : category)
    const initialCategory = categories.find((item) => item.id === (category === "all" ? "assets" : category)) ?? categories[0]
    setRecordType(initialCategory.types[0])
    setName("")
    setLocation("")
    setQuantity("")
    setDueDate("")
    setDetails({})
    setStatus("active")
    setFormError("")
    setDialogOpen(true)
  }

  const handleCategoryChange = (value: string) => {
    const next = categories.find((item) => item.id === value)
    if (!next) return
    setFormCategory(next.id)
    setRecordType(next.types[0])
    setDetails({})
  }

  const saveRecord = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setFormError("")
    const cleanDetails = Object.fromEntries(Object.entries(details).filter(([, value]) => value.trim() !== ""))
    try {
      const response = await fetch("/api/school-operations", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: formCategory, recordType, name, location: location || null, quantity: quantity === "" ? null : Number(quantity), dueDate: dueDate || null, status, details: cleanDetails }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? "Could not save the record")
      await mutate()
      setDialogOpen(false)
    } catch (caught) {
      setFormError(caught instanceof Error ? caught.message : "Could not save the record")
    } finally {
      setSaving(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    const previous = data
    if (data) void mutate({ ...data, records: data.records.map((record) => record.id === id ? { ...record, status: status as Status } : record) }, false)
    const response = await fetch("/api/school-operations", {
      method: "PATCH", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }),
    })
    if (!response.ok) {
      void mutate(previous, false)
      void mutate()
    } else {
      void mutate()
    }
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <Badge variant="outline" className="w-fit gap-1.5 rounded-full px-3 py-1"><ClipboardList className="size-3.5" /> School operations</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">Resources & facilities</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">A single register for school assets, spaces, services and the checks that keep them ready.</p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2"><Plus data-icon="inline-start" /> Add a record</Button>
      </div>

      {error && <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error.message}</div>}

      <section aria-label="Operations summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard icon={Package} label="Tracked records" value={data?.summary.totalRecords ?? 0} note="Assets, spaces and services" />
        <SummaryCard icon={HardHat} label="Open maintenance" value={data?.summary.openMaintenance ?? 0} note="Requests still in progress" />
        <SummaryCard icon={CalendarClock} label="Checks due soon" value={data?.summary.dueSoon ?? 0} note="Within the next 30 days" alert={(data?.summary.dueSoon ?? 0) > 0} />
        <SummaryCard icon={BookMarked} label="Library titles" value={data?.summary.libraryTitles ?? 0} note="Books and learning materials" />
        <SummaryCard icon={Bus} label="Transport & boarding" value={`${data?.summary.vehicles ?? 0} / ${data?.summary.boardingSpaces ?? 0}`} note="Vehicles / recorded bed capacity" />
      </section>

      {(data?.summary.dueSoon ?? 0) > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-sm">
          <CircleAlert className="size-4 shrink-0 text-amber-700" />
          <span><strong>{data?.summary.dueSoon} upcoming checks</strong> need attention across safety, vehicle compliance and maintenance.</span>
        </div>
      )}

      <Card className="overflow-hidden">
        <CardHeader className="gap-4 border-b bg-muted/20 pb-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-1"><CardTitle>Operations register</CardTitle><CardDescription>{activeCategory?.description ?? "Browse every operational area and keep records up to date."}</CardDescription></div>
            <div className="relative w-full sm:max-w-xs"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search records" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search records..." className="pl-9" /></div>
          </div>
          <Tabs value={category} onValueChange={(value) => setCategory(value as Category | "all")}>
            <TabsList className="h-auto w-full justify-start gap-1 overflow-x-auto bg-transparent p-0">
              <TabsTrigger value="all" className="shrink-0 rounded-full px-3">All areas</TabsTrigger>
              {categories.map((item) => <TabsTrigger key={item.id} value={item.id} className="shrink-0 rounded-full px-3">{item.label}</TabsTrigger>)}
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? <div className="px-6 py-14 text-center text-sm text-muted-foreground">Loading school records…</div> : filteredRecords.length === 0 ? (
            <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-muted">{activeCategory ? <activeCategory.icon className="size-5 text-muted-foreground" /> : <BookMarked className="size-5 text-muted-foreground" />}</div>
              <div className="flex flex-col gap-1"><p className="font-medium">{search ? "No matching records" : "Your operations register is ready"}</p><p className="max-w-md text-sm text-muted-foreground">{search ? "Try a different search term." : "Start by adding an asset, book, facility, vehicle or service record. Records are private to your school."}</p></div>
              {!search && <Button variant="outline" onClick={openCreateDialog} className="mt-1 gap-2"><Plus data-icon="inline-start" /> Add your first record</Button>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader><TableRow><TableHead>Record</TableHead><TableHead>Area</TableHead><TableHead>Location / details</TableHead><TableHead>Qty</TableHead><TableHead>Due / return</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
                <TableBody>
                  {filteredRecords.map((record) => {
                    const recordCategory = categories.find((item) => item.id === record.category)
                    const Icon = recordCategory?.icon ?? Package
                    const detailEntries = Object.entries(record.details ?? {}).filter(([, value]) => value !== "" && value !== null && value !== undefined)
                    return <TableRow key={record.id}>
                      <TableCell className="min-w-48"><div className="flex items-center gap-3"><div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary"><Icon className="size-4" /></div><div className="flex min-w-0 flex-col gap-0.5"><span className="truncate font-medium">{record.name}</span><span className="text-xs text-muted-foreground">{record.record_type}</span></div></div></TableCell>
                      <TableCell className="whitespace-nowrap text-sm">{recordCategory?.label ?? record.category}</TableCell>
                      <TableCell className="min-w-40"><div className="flex flex-col gap-1 text-sm"><span>{record.location || "—"}</span>{detailEntries.map(([key, value]) => <span key={key} className="text-xs text-muted-foreground">{detailLabel(key)}: {String(value)}</span>)}</div></TableCell>
                      <TableCell>{record.quantity ?? "—"}</TableCell><TableCell className="whitespace-nowrap text-sm">{displayDate(record.due_date)}</TableCell>
                      <TableCell><Select value={record.status} onValueChange={(value) => void updateStatus(record.id, value)}><SelectTrigger className="h-8 w-36" aria-label={`Update status for ${record.name}`}><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{statusOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectGroup></SelectContent></Select><Badge className="sr-only" variant={statusVariant(record.status)}>{labelForStatus(record.status)}</Badge></TableCell>
                    </TableRow>
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-2">
        <Card><CardContent className="flex items-start gap-3 p-4"><CheckCircle2 className="mt-0.5 size-4 text-primary" /><div className="flex flex-col gap-1"><p className="text-sm font-medium">Library & learning materials</p><p className="text-xs text-muted-foreground">Track books, textbook issues, returns and fines alongside equipment and consumables.</p></div></CardContent></Card>
        <Card><CardContent className="flex items-start gap-3 p-4"><ShieldCheck className="mt-0.5 size-4 text-primary" /><div className="flex flex-col gap-1"><p className="text-sm font-medium">Facilities, transport & boarding</p><p className="text-xs text-muted-foreground">Keep inspections, title references, route details, dormitory capacity and menu plans together.</p></div></CardContent></Card>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="flex max-h-[90dvh] flex-col overflow-hidden sm:max-w-2xl">
          <DialogHeader><DialogTitle>Add an operations record</DialogTitle><DialogDescription>Choose an area, then capture its core details and any relevant identifiers or dates.</DialogDescription></DialogHeader>
          <form onSubmit={saveRecord} className="flex min-h-0 flex-col gap-4 overflow-hidden">
            <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto pr-2 sm:grid-cols-2">
              <FormField label="Area"><Select value={formCategory} onValueChange={handleCategoryChange}><SelectTrigger id={fieldId("Area")} aria-labelledby={fieldId("Area")}><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{categories.map((item) => <SelectItem key={item.id} value={item.id}>{item.label}</SelectItem>)}</SelectGroup></SelectContent></Select></FormField>
              <FormField label="Record type"><select id={fieldId("Record type")} value={recordType} onChange={(event) => setRecordType(event.target.value)} className="h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring">{selectedCategory.types.map((type) => <option key={type} value={type}>{type}</option>)}</select></FormField>
              <FormField label="Name / reference"><Input id={fieldId("Name / reference")} aria-labelledby={fieldId("Name / reference")} required maxLength={180} value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Science lab microscope" /></FormField>
              <FormField label="Location"><Input id={fieldId("Location")} aria-labelledby={fieldId("Location")} maxLength={180} value={location} onChange={(event) => setLocation(event.target.value)} placeholder="e.g. Block A, room 2" /></FormField>
              <FormField label={formCategory === "boarding" ? "Capacity / number of beds" : "Quantity"}><Input id={fieldId(formCategory === "boarding" ? "Capacity / number of beds" : "Quantity")} aria-labelledby={fieldId(formCategory === "boarding" ? "Capacity / number of beds" : "Quantity")} type="number" min="0" step="any" value={quantity} onChange={(event) => setQuantity(event.target.value)} placeholder="Optional" /></FormField>
              <FormField label={formCategory === "library" ? "Return / review date" : "Next due / expiry date"}><Input id={fieldId(formCategory === "library" ? "Return / review date" : "Next due / expiry date")} aria-labelledby={fieldId(formCategory === "library" ? "Return / review date" : "Next due / expiry date")} type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} /></FormField>
              {selectedCategory.fields.map((field) => <FormField key={field.key} label={field.label}><Input id={fieldId(field.label)} aria-labelledby={fieldId(field.label)} type={field.type ?? "text"} min={field.type === "number" ? "0" : undefined} step={field.type === "number" ? "any" : undefined} maxLength={field.type === "text" ? 500 : undefined} value={details[field.key] ?? ""} onChange={(event) => setDetails((current) => ({ ...current, [field.key]: event.target.value }))} placeholder={field.placeholder} /></FormField>)}
              <FormField label="Status"><Select value={status} onValueChange={(value) => setStatus(value as Status)}><SelectTrigger id={fieldId("Status")} aria-labelledby={fieldId("Status")}><SelectValue /></SelectTrigger><SelectContent><SelectGroup>{statusOptions.map((option) => <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>)}</SelectGroup></SelectContent></Select></FormField>
            </div>
            {formError && <p role="alert" className="text-sm text-destructive">{formError}</p>}
            <DialogFooter className="shrink-0 border-t bg-background pt-4"><Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving ? "Saving…" : "Save record"}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </main>
  )
}

function SummaryCard({ icon: Icon, label, value, note, alert = false }: { icon: typeof Package; label: string; value: string | number; note: string; alert?: boolean }) {
  return <Card><CardContent className="flex items-start justify-between gap-3 p-4 sm:p-5"><div className="flex flex-col gap-1"><span className="text-sm text-muted-foreground">{label}</span><span className="text-2xl font-semibold tracking-tight">{value}</span><span className="text-xs text-muted-foreground">{note}</span></div><div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${alert ? "bg-amber-500/10 text-amber-700" : "bg-primary/5 text-primary"}`}><Icon className="size-4" /></div></CardContent></Card>
}

function fieldId(label: string) {
  return `field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  const id = fieldId(label)
  return <div className="flex min-w-0 flex-col gap-2"><Label htmlFor={id}>{label}</Label>{children}</div>
}

function detailLabel(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (letter) => letter.toUpperCase())
}
