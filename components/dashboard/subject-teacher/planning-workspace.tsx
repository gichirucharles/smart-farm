"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { AlertCircle, BookOpenCheck, CalendarDays, ClipboardList, FilePlus2, Layers3, Send } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

type Assignment = { key: string; classId: string; className: string; gradeLevel: string; stream: string | null; academicYear: string | null; subjectId: string; subjectName: string }
type Scheme = { id: string; class_id: string; subject_id: string; academic_year: string; term: string; title: string; unit_title: string; week_start: number; week_end: number; learning_outcomes: string; content_outline: string; resources: string; status: string; review_feedback: string | null; created_at: string }
type Lesson = { id: string; scheme_id: string | null; class_id: string; subject_id: string; lesson_date: string; week_number: number | null; lesson_number: number | null; topic: string; learning_objectives: string; activities: string; resources: string; assessment_notes: string; status: string; review_feedback: string | null; created_at: string }
type PlanningData = { teacher: { firstName: string; lastName: string }; assignments: Assignment[]; schemes: Scheme[]; lessons: Lesson[] }
type PlanningPayload = Record<string, unknown> & { kind: "scheme" | "lesson"; status: "draft" | "submitted" }

const fetcher = async (url: string): Promise<PlanningData> => {
  const response = await fetch(url, { credentials: "same-origin", cache: "no-store" })
  const body = await response.json()
  if (!response.ok) throw new Error(body.error || "Unable to load planning records")
  return body
}

const statusVariant = (status: string) => status === "approved" ? "default" : status === "returned" ? "destructive" : "secondary"

export function TeacherPlanningWorkspace() {
  const { data, error, isLoading, mutate } = useSWR<PlanningData>("/api/subject-teacher/planning", fetcher)
  const assignments = data?.assignments ?? []
  const [selectedKey, setSelectedKey] = useState("")
  const selected = assignments.find((item) => item.key === selectedKey) ?? assignments[0]
  const [year, setYear] = useState(() => String(new Date().getFullYear()))
  const [term, setTerm] = useState("Term 1")
  const [schemeTitle, setSchemeTitle] = useState("")
  const [unitTitle, setUnitTitle] = useState("")
  const [weekStart, setWeekStart] = useState("1")
  const [weekEnd, setWeekEnd] = useState("4")
  const [outcomes, setOutcomes] = useState("")
  const [outline, setOutline] = useState("")
  const [schemeResources, setSchemeResources] = useState("")
  const [lessonDate, setLessonDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [lessonWeek, setLessonWeek] = useState("1")
  const [lessonNumber, setLessonNumber] = useState("1")
  const [schemeId, setSchemeId] = useState("none")
  const [topic, setTopic] = useState("")
  const [objectives, setObjectives] = useState("")
  const [activities, setActivities] = useState("")
  const [lessonResources, setLessonResources] = useState("")
  const [assessment, setAssessment] = useState("")
  const [message, setMessage] = useState("")
  const [saving, setSaving] = useState(false)

  const visibleSchemes = useMemo(() => (data?.schemes ?? []).filter((item) => selected && item.class_id === selected.classId && item.subject_id === selected.subjectId), [data?.schemes, selected])
  const visibleLessons = useMemo(() => (data?.lessons ?? []).filter((item) => selected && item.class_id === selected.classId && item.subject_id === selected.subjectId), [data?.lessons, selected])
  const submittedCount = (data?.schemes ?? []).filter((item) => item.status === "submitted").length + (data?.lessons ?? []).filter((item) => item.status === "submitted").length

  async function savePlan(event: React.FormEvent<HTMLFormElement>, kind: PlanningPayload["kind"], status: PlanningPayload["status"]) {
    event.preventDefault()
    if (!selected) return
    setSaving(true)
    setMessage("")
    const common = { classId: selected.classId, subjectId: selected.subjectId, academicYear: year, term, status }
    const payload: PlanningPayload = kind === "scheme" ? {
      kind, ...common, title: schemeTitle, unitTitle, weekStart: Number(weekStart), weekEnd: Number(weekEnd),
      learningOutcomes: outcomes, contentOutline: outline, resources: schemeResources,
    } : {
      kind, ...common, schemeId: schemeId === "none" ? null : schemeId, lessonDate, weekNumber: lessonWeek ? Number(lessonWeek) : null,
      lessonNumber: lessonNumber ? Number(lessonNumber) : null, topic, learningObjectives: objectives, activities,
      resources: lessonResources, assessmentNotes: assessment,
    }

    try {
      const response = await fetch("/api/subject-teacher/planning", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || "Unable to save planning record")
      setMessage(status === "submitted" ? "Planning record submitted for review." : "Planning record saved as a draft.")
      if (kind === "scheme") {
        setSchemeTitle(""); setUnitTitle(""); setOutcomes(""); setOutline(""); setSchemeResources("")
      } else {
        setTopic(""); setObjectives(""); setActivities(""); setLessonResources(""); setAssessment("")
      }
      await mutate()
    } catch (saveError) {
      setMessage(saveError instanceof Error ? saveError.message : "Unable to save planning record")
    } finally {
      setSaving(false)
    }
  }

  return <main className="flex min-w-0 flex-col gap-6">
    <header className="flex flex-col gap-1">
      <div className="flex flex-wrap items-center gap-3"><h1 className="text-3xl font-bold tracking-tight">Planning &amp; lessons</h1><Badge variant="outline">Teacher workspace</Badge></div>
      <p className="text-muted-foreground">Build schemes of work and lesson plans from your assigned classes, then save drafts or submit them for review.</p>
    </header>
    {error && <Alert variant="destructive"><AlertCircle className="size-4" /><AlertDescription>{error.message}</AlertDescription></Alert>}
    {isLoading && <div className="grid gap-4 sm:grid-cols-3">{Array.from({ length: 3 }, (_, index) => <Card key={index} className="h-28 animate-pulse" />)}</div>}
    {data && assignments.length === 0 && <Card><CardContent className="py-10 text-center"><BookOpenCheck className="mx-auto mb-3 size-8 text-muted-foreground" /><h2 className="font-semibold">No active teaching assignments</h2><p className="mt-1 text-sm text-muted-foreground">Your planning workspace becomes available after a class and subject are assigned to you.</p></CardContent></Card>}
    {data && assignments.length > 0 && <>
      <section className="grid gap-4 sm:grid-cols-3" aria-label="Planning summary">
        <Metric label="Schemes of work" value={data.schemes.length} caption="Across your assigned classes" icon={<Layers3 className="size-4" />} />
        <Metric label="Lesson plans" value={data.lessons.length} caption="Saved teaching sessions" icon={<CalendarDays className="size-4" />} />
        <Metric label="Awaiting review" value={submittedCount} caption="Submitted to school leadership" icon={<ClipboardList className="size-4" />} />
      </section>
      <Card><CardHeader><CardTitle>Planning context</CardTitle><CardDescription>Choose the class and subject for the scheme or lesson you are preparing.</CardDescription></CardHeader><CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2"><Label htmlFor="planning-assignment">Class and subject</Label><Select value={selected?.key} onValueChange={(value) => { setSelectedKey(value); setSchemeId("none") }}><SelectTrigger id="planning-assignment"><SelectValue /></SelectTrigger><SelectContent>{assignments.map((item) => <SelectItem key={item.key} value={item.key}>{item.className} · {item.subjectName}</SelectItem>)}</SelectContent></Select></div>
        <div className="space-y-2"><Label htmlFor="planning-year">Academic year</Label><Input id="planning-year" maxLength={20} value={year} onChange={(event) => setYear(event.target.value)} /></div>
        <div className="space-y-2"><Label htmlFor="planning-term">Term</Label><Select value={term} onValueChange={setTerm}><SelectTrigger id="planning-term"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Term 1">Term 1</SelectItem><SelectItem value="Term 2">Term 2</SelectItem><SelectItem value="Term 3">Term 3</SelectItem></SelectContent></Select></div>
      </CardContent></Card>
      {message && <Alert role="status"><AlertDescription>{message}</AlertDescription></Alert>}
      <Tabs defaultValue="lesson" className="flex flex-col gap-4">
        <TabsList className="w-fit"><TabsTrigger value="lesson">Lesson plan</TabsTrigger><TabsTrigger value="scheme">Scheme of work</TabsTrigger><TabsTrigger value="records">Saved records</TabsTrigger></TabsList>
        <TabsContent value="lesson">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><FilePlus2 className="size-5" />Create a lesson plan</CardTitle><CardDescription>Prepare a focused lesson with clear learning intentions, activities, materials, and checks for understanding.</CardDescription></CardHeader><CardContent><form className="space-y-5" onSubmit={(event) => savePlan(event, "lesson", "submitted")}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2"><Label htmlFor="lesson-topic">Topic</Label><Input id="lesson-topic" required maxLength={160} value={topic} onChange={(event) => setTopic(event.target.value)} placeholder="e.g. Fractions and equivalent values" /></div>
              <div className="space-y-2"><Label htmlFor="lesson-date">Lesson date</Label><Input id="lesson-date" type="date" required value={lessonDate} onChange={(event) => setLessonDate(event.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="lesson-scheme">Related scheme</Label><Select value={schemeId} onValueChange={setSchemeId}><SelectTrigger id="lesson-scheme"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">No linked scheme</SelectItem>{visibleSchemes.map((item) => <SelectItem key={item.id} value={item.id}>{item.unit_title} · weeks {item.week_start}–{item.week_end}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-2"><Label htmlFor="lesson-week">Week number</Label><Input id="lesson-week" type="number" min="1" max="60" value={lessonWeek} onChange={(event) => setLessonWeek(event.target.value)} /></div>
              <div className="space-y-2"><Label htmlFor="lesson-number">Lesson number</Label><Input id="lesson-number" type="number" min="1" max="20" value={lessonNumber} onChange={(event) => setLessonNumber(event.target.value)} /></div>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <TextField id="lesson-objectives" label="Learning objectives" value={objectives} onChange={setObjectives} placeholder="By the end of the lesson, learners will be able to…" />
              <TextField id="lesson-activities" label="Teaching and learning activities" value={activities} onChange={setActivities} placeholder="Introduction, guided practice, group work, and closure…" />
              <TextField id="lesson-resources" label="Learning resources" value={lessonResources} onChange={setLessonResources} placeholder="Texts, materials, equipment, or digital resources…" />
              <TextField id="lesson-assessment" label="Assessment and reflection notes" value={assessment} onChange={setAssessment} placeholder="How will you check understanding and respond to misconceptions?" />
            </div>
            <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" disabled={saving} onClick={(event) => { const form = event.currentTarget.form; if (form?.reportValidity()) void savePlan({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>, "lesson", "draft") }}><ClipboardList data-icon="inline-start" />Save draft</Button><Button type="submit" disabled={saving}>{saving ? "Submitting…" : "Submit lesson plan"}<Send data-icon="inline-end" /></Button></div>
          </form></CardContent></Card>
        </TabsContent>
        <TabsContent value="scheme">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Layers3 className="size-5" />Create a scheme of work</CardTitle><CardDescription>Map a unit across the term so lesson plans have a clear place in the learning sequence.</CardDescription></CardHeader><CardContent><form className="space-y-5" onSubmit={(event) => savePlan(event, "scheme", "submitted")}>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"><div className="space-y-2"><Label htmlFor="scheme-title">Scheme title</Label><Input id="scheme-title" required maxLength={160} value={schemeTitle} onChange={(event) => setSchemeTitle(event.target.value)} placeholder="e.g. Number and operations" /></div><div className="space-y-2"><Label htmlFor="unit-title">Unit or strand</Label><Input id="unit-title" required maxLength={160} value={unitTitle} onChange={(event) => setUnitTitle(event.target.value)} placeholder="e.g. Fractions" /></div><div className="space-y-2"><Label htmlFor="scheme-week-start">Start week</Label><Input id="scheme-week-start" required type="number" min="1" max="60" value={weekStart} onChange={(event) => setWeekStart(event.target.value)} /></div><div className="space-y-2"><Label htmlFor="scheme-week-end">End week</Label><Input id="scheme-week-end" required type="number" min={weekStart} max="60" value={weekEnd} onChange={(event) => setWeekEnd(event.target.value)} /></div></div>
            <div className="grid gap-4 lg:grid-cols-3"><TextField id="scheme-outcomes" label="Learning outcomes" value={outcomes} onChange={setOutcomes} placeholder="What learners should know or be able to do…" /><TextField id="scheme-outline" label="Content outline" value={outline} onChange={setOutline} placeholder="Key concepts and weekly progression…" /><TextField id="scheme-resources" label="Resources" value={schemeResources} onChange={setSchemeResources} placeholder="Books, materials, equipment, or links…" /></div>
            <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" disabled={saving} onClick={(event) => { const form = event.currentTarget.form; if (form?.reportValidity()) void savePlan({ preventDefault: () => {} } as React.FormEvent<HTMLFormElement>, "scheme", "draft") }}><ClipboardList data-icon="inline-start" />Save draft</Button><Button type="submit" disabled={saving}>{saving ? "Submitting…" : "Submit scheme"}<Send data-icon="inline-end" /></Button></div>
          </form></CardContent></Card>
        </TabsContent>
        <TabsContent value="records" className="space-y-4">
          <Card><CardHeader><CardTitle>Schemes of work</CardTitle><CardDescription>Plans for {selected?.className} · {selected?.subjectName}.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Scheme / unit</TableHead><TableHead>Weeks</TableHead><TableHead>Year · term</TableHead><TableHead>Status</TableHead><TableHead>Review note</TableHead></TableRow></TableHeader><TableBody>{visibleSchemes.length ? visibleSchemes.map((item) => <TableRow key={item.id}><TableCell className="font-medium">{item.title}<div className="text-xs text-muted-foreground">{item.unit_title}</div></TableCell><TableCell>{item.week_start}–{item.week_end}</TableCell><TableCell>{item.academic_year} · {item.term}</TableCell><TableCell><Badge variant={statusVariant(item.status)}>{item.status}</Badge></TableCell><TableCell className="max-w-64 whitespace-normal text-sm text-muted-foreground">{item.review_feedback || "—"}</TableCell></TableRow>) : <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No schemes of work saved for this assignment yet.</TableCell></TableRow>}</TableBody></Table></div></CardContent></Card>
          <Card><CardHeader><CardTitle>Lesson plans</CardTitle><CardDescription>Individual lesson preparation for {selected?.className} · {selected?.subjectName}.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Lesson</TableHead><TableHead>Week</TableHead><TableHead>Status</TableHead><TableHead>Review note</TableHead></TableRow></TableHeader><TableBody>{visibleLessons.length ? visibleLessons.map((item) => <TableRow key={item.id}><TableCell className="whitespace-nowrap">{item.lesson_date}</TableCell><TableCell className="font-medium">{item.topic}<div className="max-w-sm whitespace-normal text-xs font-normal text-muted-foreground">{item.learning_objectives}</div></TableCell><TableCell>{item.week_number ?? "—"}{item.lesson_number ? ` · Lesson ${item.lesson_number}` : ""}</TableCell><TableCell><Badge variant={statusVariant(item.status)}>{item.status}</Badge></TableCell><TableCell className="max-w-64 whitespace-normal text-sm text-muted-foreground">{item.review_feedback || "—"}</TableCell></TableRow>) : <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No lesson plans saved for this assignment yet.</TableCell></TableRow>}</TableBody></Table></div></CardContent></Card>
        </TabsContent>
      </Tabs>
    </>}
  </main>
}

function Metric({ label, value, caption, icon }: { label: string; value: number; caption: string; icon: React.ReactNode }) {
  return <Card><CardHeader className="flex flex-row items-center justify-between gap-3 pb-2"><CardDescription>{label}</CardDescription><span className="text-muted-foreground" aria-hidden="true">{icon}</span></CardHeader><CardContent><p className="text-3xl font-semibold tabular-nums">{value}</p><p className="mt-1 text-xs text-muted-foreground">{caption}</p></CardContent></Card>
}

function TextField({ id, label, value, onChange, placeholder }: { id: string; label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return <div className="space-y-2"><Label htmlFor={id}>{label}</Label><Textarea id={id} maxLength={4000} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={4} /></div>
}
