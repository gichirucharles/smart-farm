"use client"

import { useMemo, useState } from "react"
import { Check, ClipboardList, Save } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type TeacherRole = "class" | "subject"
type Learner = { id: string; name: string; mark: string }

const sampleLearners: Learner[] = [
  { id: "l1", name: "Amina Hassan", mark: "78" },
  { id: "l2", name: "Brian Mwangi", mark: "64" },
  { id: "l3", name: "Faith Achieng", mark: "86" },
  { id: "l4", name: "Kevin Otieno", mark: "71" },
]
const competencies = [
  { name: "Problem solving", level: "Applying" },
  { name: "Communication", level: "Meeting expectations" },
  { name: "Collaboration", level: "Exceeding expectations" },
]

export function TeacherAssessmentWorkspace({ role }: { role: TeacherRole }) {
  const [assessmentType, setAssessmentType] = useState("CAT")
  const [className, setClassName] = useState("Grade 7A")
  const [subject, setSubject] = useState("Mathematics")
  const [maximum, setMaximum] = useState("100")
  const [learners, setLearners] = useState(sampleLearners)
  const [state, setState] = useState<"Draft" | "Submitted">("Draft")
  const isSubjectTeacher = role === "subject"
  const enteredCount = learners.filter((learner) => learner.mark !== "").length
  const mean = useMemo(() => {
    const scores = learners.map((learner) => Number(learner.mark)).filter(Number.isFinite)
    return scores.length ? Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length) : 0
  }, [learners])
  const maxScore = Math.max(1, Number(maximum) || 1)
  const rankByLearner = useMemo(() => {
    return new Map(
      [...learners]
        .filter((learner) => learner.mark !== "")
        .sort((left, right) => Number(right.mark) - Number(left.mark))
        .map((learner, index) => [learner.id, index + 1]),
    )
  }, [learners])

  function updateMark(id: string, value: string) {
    if (value !== "" && (!/^\d+$/.test(value) || Number(value) > maxScore)) return
    setLearners((current) => current.map((learner) => learner.id === id ? { ...learner, mark: value } : learner))
    setState("Draft")
  }

  return (
    <main className="flex flex-col gap-6">
      <header className="flex flex-col gap-1">
        <div className="flex flex-wrap items-center gap-3"><h1 className="text-3xl font-bold tracking-tight">Assessment &amp; marks</h1><Badge variant="outline">Sample workspace</Badge></div>
        <p className="text-muted-foreground">Enter marks for your classes, record CBC competency evidence, and track assessment submission status.</p>
      </header>

      <Alert>
        <ClipboardList />
        <AlertTitle>Preview-only records</AlertTitle>
        <AlertDescription>These learners and scores are illustrative. Saving or submitting only changes this page state; no marks are written to the school database.</AlertDescription>
      </Alert>

      <section aria-label="Assessment selection" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="flex flex-col gap-2"><Label htmlFor="assessment-type">Assessment type</Label><Select value={assessmentType} onValueChange={(value) => { setAssessmentType(value); setState("Draft") }}><SelectTrigger id="assessment-type"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="CBC">CBC assessment</SelectItem><SelectItem value="CAT">CAT</SelectItem><SelectItem value="End-term">End-term exam</SelectItem></SelectContent></Select></div>
        <div className="flex flex-col gap-2"><Label htmlFor="assessment-class">Class</Label><Select value={className} onValueChange={setClassName}><SelectTrigger id="assessment-class"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Grade 7A">Grade 7A</SelectItem><SelectItem value="Grade 7B">Grade 7B</SelectItem><SelectItem value="Grade 6A">Grade 6A</SelectItem></SelectContent></Select></div>
        <div className="flex flex-col gap-2"><Label htmlFor="assessment-subject">Subject</Label><Select value={subject} onValueChange={setSubject}><SelectTrigger id="assessment-subject"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Mathematics">Mathematics</SelectItem><SelectItem value="English">English</SelectItem><SelectItem value="Integrated Science">Integrated Science</SelectItem><SelectItem value="Kiswahili">Kiswahili</SelectItem></SelectContent></Select></div>
        <div className="flex flex-col gap-2"><Label htmlFor="maximum-mark">Maximum mark</Label><Input id="maximum-mark" type="number" min="1" max="1000" value={maximum} onChange={(event) => { setMaximum(event.target.value); setState("Draft") }} /></div>
      </section>

      <section aria-label="Assessment progress" className="grid gap-4 sm:grid-cols-3"><Card><CardHeader className="pb-2"><CardDescription>Marks entered</CardDescription><CardTitle>{enteredCount} / {learners.length}</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">Learners with a score</p></CardContent></Card><Card><CardHeader className="pb-2"><CardDescription>Class mean</CardDescription><CardTitle>{mean}%</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{assessmentType} · {className}</p></CardContent></Card><Card><CardHeader className="pb-2"><CardDescription>Submission</CardDescription><CardTitle className="flex items-center gap-2 text-xl"><Badge variant={state === "Submitted" ? "default" : "secondary"}>{state}</Badge></CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{subject} · Term 2, 2026</p></CardContent></Card></section>

      <Tabs defaultValue="marks" className="flex flex-col gap-4">
        <TabsList className="w-fit"><TabsTrigger value="marks">Marks entry</TabsTrigger><TabsTrigger value="competencies">CBC competencies</TabsTrigger></TabsList>
        <TabsContent value="marks">
          <Card><CardHeader><CardTitle>{subject} marks · {className}</CardTitle><CardDescription>Enter a score from 0 to {maximum || "—"} for each learner.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Learner</TableHead><TableHead>Score</TableHead><TableHead>Percentage</TableHead><TableHead>Grade</TableHead><TableHead>Class rank</TableHead></TableRow></TableHeader><TableBody>{learners.map((learner) => { const score = Number(learner.mark); const percentage = learner.mark === "" ? null : Math.round((score / maxScore) * 100); const grade = percentage === null ? "—" : percentage >= 80 ? "A" : percentage >= 70 ? "B" : percentage >= 60 ? "C" : percentage >= 50 ? "D" : "E"; return <TableRow key={learner.id}><TableCell className="font-medium">{learner.name}</TableCell><TableCell><Input aria-label={`Score for ${learner.name}`} className="w-24" type="number" min="0" max={maximum} value={learner.mark} onChange={(event) => updateMark(learner.id, event.target.value)} /></TableCell><TableCell>{percentage === null ? "—" : `${percentage}%`}</TableCell><TableCell><Badge variant="outline">{grade}</Badge></TableCell><TableCell>{rankByLearner.get(learner.id) ?? "—"}</TableCell></TableRow> })}</TableBody></Table></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted-foreground">Ranks and grades are recalculated from the entered scores.</p><div className="flex gap-2"><Button variant="outline" onClick={() => setState("Draft")}><Save data-icon="inline-start" />Save draft</Button><Button onClick={() => setState("Submitted")} disabled={enteredCount === 0}><Check data-icon="inline-start" />Submit marks</Button></div></div></CardContent></Card>
        </TabsContent>
        <TabsContent value="competencies">
          <Card><CardHeader><CardTitle>CBC competency evidence</CardTitle><CardDescription>Review rubric levels for {className}. Select the assessment above to contextualize the evidence.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><Table><TableHeader><TableRow><TableHead>Competency</TableHead><TableHead>Emerging</TableHead><TableHead>Approaching</TableHead><TableHead>Meeting</TableHead><TableHead>Exceeding</TableHead><TableHead>Sample evidence</TableHead></TableRow></TableHeader><TableBody>{competencies.map((competency) => <TableRow key={competency.name}><TableCell className="font-medium">{competency.name}</TableCell><TableCell>Needs support</TableCell><TableCell>Developing</TableCell><TableCell>Meeting expectations</TableCell><TableCell>Exceeding expectations</TableCell><TableCell><Badge variant="secondary">{competency.level}</Badge></TableCell></TableRow>)}</TableBody></Table></div><p className="mt-4 text-sm text-muted-foreground">Use the rubric levels as evidence descriptors, not as a replacement for your school&apos;s approved CBC rubric.</p></CardContent></Card>
        </TabsContent>
      </Tabs>

      {isSubjectTeacher && <p className="text-sm text-muted-foreground">Subject-teacher view: marks shown are limited to the selected teaching subject in this sample workflow.</p>}
    </main>
  )
}
