"use client"

import { useMemo, useState, type FormEvent, type ReactNode } from "react"
import { CalendarDays, Check, CircleAlert, Clock3, FileText, Mail, MessageSquare, Plus, Search, Send, ShieldCheck } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

const initialAnnouncements = [
  { id: 1, title: "Term 2 closing day and collection times", audience: "All parents", channels: ["In-app", "SMS", "Email"], sent: "Today, 9:12 AM", status: "Delivered", delivered: "96%" },
  { id: 2, title: "Staff briefing: Friday assembly", audience: "Teaching staff", channels: ["In-app", "Email"], sent: "Yesterday, 3:40 PM", status: "Delivered", delivered: "100%" },
  { id: 3, title: "Grade 6 science fair reminder", audience: "Grade 6 parents", channels: ["In-app", "SMS"], sent: "Nov 16, 2026", status: "Sending", delivered: "78%" },
]
const meetings = [
  { family: "Wanjiku family", student: "Amina Wanjiku · Grade 5 East", teacher: "Ms. A. Njeri", date: "Nov 24, 2026", time: "9:00 AM", status: "Confirmed" },
  { family: "Otieno family", student: "Brian Otieno · Grade 3 West", teacher: "Mr. P. Ouma", date: "Nov 24, 2026", time: "10:30 AM", status: "Awaiting reply" },
  { family: "Kamau family", student: "Leah Kamau · Grade 7", teacher: "Ms. L. Wairimu", date: "Nov 25, 2026", time: "2:00 PM", status: "Confirmed" },
]
const initialFeedback = [
  { from: "Parent · Grade 4", subject: "Request for bus route update", received: "Today, 8:42 AM", priority: "Normal", status: "Open" },
  { from: "Anonymous submission", subject: "Suggestion: more shade near the playground", received: "Yesterday, 4:18 PM", priority: "Low", status: "Open" },
  { from: "Parent · Grade 2", subject: "Follow-up on lost property process", received: "Nov 17, 2026", priority: "Normal", status: "In review" },
]
const templates = [
  { title: "School closure notice", detail: "Weather, public holiday or urgent closure" },
  { title: "Parent-teacher meeting invitation", detail: "Invite a family to book a meeting slot" },
  { title: "Attendance follow-up", detail: "Notify families about an unexplained absence" },
  { title: "Staff briefing reminder", detail: "Share agenda, venue and preparation notes" },
]

const channelLabel = (channel: string) => channel === "In-app" ? "In-app" : channel

export function CommunicationCenter() {
  const [tab, setTab] = useState("announcements")
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [feedback, setFeedback] = useState(initialFeedback)
  const [search, setSearch] = useState("")
  const [title, setTitle] = useState("")
  const [message, setMessage] = useState("")
  const [audience, setAudience] = useState("All parents")
  const [channels, setChannels] = useState<string[]>(["In-app", "Email"])
  const [notice, setNotice] = useState("")
  const [meetingFamily, setMeetingFamily] = useState("")
  const [meetingDate, setMeetingDate] = useState("")
  const [meetingTime, setMeetingTime] = useState("")
  const [meetingSaved, setMeetingSaved] = useState(false)

  const filteredAnnouncements = useMemo(() => announcements.filter((item) => `${item.title} ${item.audience}`.toLowerCase().includes(search.toLowerCase())), [announcements, search])
  const openFeedback = feedback.filter((item) => item.status !== "Resolved").length

  function toggleChannel(channel: string) {
    setChannels((current) => current.includes(channel) ? current.filter((item) => item !== channel) : [...current, channel])
  }

  function publishAnnouncement(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!title.trim() || !message.trim() || channels.length === 0) return
    setAnnouncements((current) => [{ id: Date.now(), title: title.trim(), audience, channels, sent: "Just now", status: "Queued", delivered: "0%" }, ...current])
    setTitle("")
    setMessage("")
    setNotice("Announcement queued in this preview. Connect a delivery provider to send SMS or email to real recipients.")
  }

  function applyTemplate(templateTitle: string) {
    setTitle(templateTitle)
    setTab("announcements")
    setNotice(`Template selected: ${templateTitle}. Add your school-specific details before sending.`)
  }

  function markResolved(subject: string) {
    setFeedback((items) => items.map((item) => item.subject === subject ? { ...item, status: "Resolved" } : item))
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-primary">School community</p>
          <h1 className="text-3xl font-bold tracking-tight">Communication</h1>
          <p className="text-muted-foreground">Keep families, learners and staff informed and heard.</p>
        </div>
        <Badge variant="outline" className="w-fit gap-2"><CircleAlert /> Preview mode · delivery provider not connected</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric icon={<Send />} label="Announcements this term" value={String(announcements.length + 38)} detail="Across all channels" />
        <Metric icon={<Check />} label="Average delivery" value="97.4%" detail="SMS and email receipts" />
        <Metric icon={<CalendarDays />} label="Meetings this week" value="12" detail="3 awaiting parent reply" />
        <Metric icon={<MessageSquare />} label="Open feedback" value={String(openFeedback)} detail="Complaints and suggestions" />
      </div>

      <Tabs value={tab} onValueChange={(next) => { setTab(next); setNotice("") }}>
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:grid-cols-3 xl:grid-cols-6">
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="circulars">Circulars</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="feedback">Feedback <span className="ml-1 rounded-full bg-muted px-1.5 py-0.5 text-xs">{openFeedback}</span></TabsTrigger>
          <TabsTrigger value="audit">Communication log</TabsTrigger>
        </TabsList>

        <TabsContent value="announcements" className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.85fr)]">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div><CardTitle>Recent announcements</CardTitle><CardDescription>Check audience reach and channel delivery status.</CardDescription></div>
              <div className="relative w-44"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input aria-label="Search announcements" className="pl-9" placeholder="Search" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {filteredAnnouncements.map((item) => <article key={item.id} className="rounded-xl border p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="flex flex-col gap-2"><h3 className="font-semibold">{item.title}</h3><div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"><span>{item.audience}</span><span aria-hidden="true">·</span><span>{item.sent}</span></div><div className="flex flex-wrap gap-1.5">{item.channels.map((channel) => <Badge key={channel} variant="secondary">{channelLabel(channel)}</Badge>)}</div></div>
                  <div className="flex items-center gap-2 sm:flex-col sm:items-end"><Badge variant={item.status === "Delivered" ? "default" : "outline"}>{item.status}</Badge><span className="text-xs text-muted-foreground">{item.delivered} delivered</span></div>
                </div>
              </article>)}
              {filteredAnnouncements.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No announcements match your search.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Plus /> Compose announcement</CardTitle><CardDescription>Prepare a school-wide or targeted message.</CardDescription></CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4" onSubmit={publishAnnouncement}>
                <div className="flex flex-col gap-2"><Label htmlFor="announcement-title">Subject</Label><Input id="announcement-title" required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Sports day arrangements" /></div>
                <div className="flex flex-col gap-2"><Label htmlFor="announcement-audience">Audience</Label><Select value={audience} onValueChange={setAudience}><SelectTrigger id="announcement-audience"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="All parents">All parents</SelectItem><SelectItem value="Teaching staff">Teaching staff</SelectItem><SelectItem value="All students">All students</SelectItem><SelectItem value="Grade 6 parents">Grade 6 parents</SelectItem><SelectItem value="All school community">All school community</SelectItem></SelectContent></Select></div>
                <fieldset className="flex flex-col gap-2"><legend className="text-sm font-medium">Delivery channels</legend><div className="flex flex-wrap gap-2">{["In-app", "SMS", "Email"].map((channel) => <Button key={channel} type="button" size="sm" variant={channels.includes(channel) ? "default" : "outline"} aria-pressed={channels.includes(channel)} onClick={() => toggleChannel(channel)}>{channel}</Button>)}</div></fieldset>
                <div className="flex flex-col gap-2"><Label htmlFor="announcement-body">Message</Label><Textarea id="announcement-body" required rows={4} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Write a clear message for your school community..." /></div>
                <Button type="submit" className="w-full"><Send data-icon="inline-start" /> Queue announcement</Button>
                {notice && <p role="status" className="text-sm text-muted-foreground">{notice}</p>}
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings" className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(300px,0.85fr)]">
          <Card><CardHeader><CardTitle>Upcoming parent-teacher meetings</CardTitle><CardDescription>Coordinate family conversations with teachers.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3">{[...meetings, ...(meetingSaved && meetingFamily ? [{ family: meetingFamily, student: "Family meeting · School office", teacher: "Head teacher", date: meetingDate, time: meetingTime, status: "Requested" }] : [])].map((meeting) => <div key={`${meeting.family}-${meeting.time}`} className="flex flex-col justify-between gap-3 rounded-xl border p-4 sm:flex-row sm:items-center"><div><p className="font-semibold">{meeting.family}</p><p className="text-sm text-muted-foreground">{meeting.student}</p><p className="mt-1 text-sm">{meeting.teacher}</p></div><div className="flex items-center gap-3 sm:flex-col sm:items-end"><span className="text-sm">{meeting.date} · {meeting.time}</span><Badge variant={meeting.status === "Confirmed" ? "default" : "outline"}>{meeting.status}</Badge></div></div>)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><CalendarDays /> Schedule a meeting</CardTitle><CardDescription>Send a meeting request to a parent or guardian.</CardDescription></CardHeader><CardContent><form className="flex flex-col gap-4" onSubmit={(event) => { event.preventDefault(); setMeetingSaved(true) }}><div className="flex flex-col gap-2"><Label htmlFor="meeting-family">Parent / family</Label><Input id="meeting-family" value={meetingFamily} onChange={(event) => setMeetingFamily(event.target.value)} placeholder="Family or parent name" required /></div><div className="flex flex-col gap-2"><Label htmlFor="meeting-date">Date</Label><Input id="meeting-date" type="date" value={meetingDate} onChange={(event) => setMeetingDate(event.target.value)} required /></div><div className="flex flex-col gap-2"><Label htmlFor="meeting-time">Time</Label><Input id="meeting-time" type="time" value={meetingTime} onChange={(event) => setMeetingTime(event.target.value)} required /></div><Button type="submit">Request meeting</Button>{meetingSaved && <p role="status" className="text-sm text-muted-foreground">Meeting request added to this preview.</p>}</form></CardContent></Card>
        </TabsContent>

        <TabsContent value="circulars" className="mt-5"><Card><CardHeader><CardTitle>School circulars & newsletters</CardTitle><CardDescription>Published notices shared with your school community.</CardDescription></CardHeader><CardContent className="grid gap-3 md:grid-cols-2">{[{ title: "Term 2 newsletter", date: "Nov 14, 2026", tag: "Newsletter", audience: "Families and staff" }, { title: "End-of-term transport arrangements", date: "Nov 12, 2026", tag: "Circular", audience: "All parents" }, { title: "Inter-school athletics day", date: "Nov 8, 2026", tag: "Circular", audience: "Grades 4–8" }, { title: "November staff bulletin", date: "Nov 2, 2026", tag: "Newsletter", audience: "Staff" }].map((item) => <article key={item.title} className="flex items-start gap-4 rounded-xl border p-4"><span className="rounded-lg bg-muted p-2"><FileText /></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold">{item.title}</h3><Badge variant="secondary">{item.tag}</Badge></div><p className="mt-1 text-sm text-muted-foreground">{item.audience} · {item.date}</p></div><Button variant="outline" size="sm" onClick={() => setNotice(`${item.title} opened in the preview.`)}>View</Button></article>)}</CardContent></Card>{notice && <p role="status" className="mt-3 text-sm text-muted-foreground">{notice}</p>}</TabsContent>

        <TabsContent value="templates" className="mt-5"><Card><CardHeader><CardTitle>Message templates</CardTitle><CardDescription>Start with consistent, school-ready communication.</CardDescription></CardHeader><CardContent className="grid gap-3 md:grid-cols-2">{templates.map((template) => <article key={template.title} className="flex items-start gap-4 rounded-xl border p-4"><span className="rounded-lg bg-muted p-2"><Mail /></span><div className="flex-1"><h3 className="font-semibold">{template.title}</h3><p className="mt-1 text-sm text-muted-foreground">{template.detail}</p></div><Button size="sm" variant="outline" onClick={() => applyTemplate(template.title)}>Use template</Button></article>)}</CardContent></Card>{notice && <p role="status" className="mt-3 text-sm text-muted-foreground">{notice}</p>}</TabsContent>

        <TabsContent value="feedback" className="mt-5"><Card><CardHeader><CardTitle>Complaints & feedback inbox</CardTitle><CardDescription>Track concerns, suggestions and follow-up requests.</CardDescription></CardHeader><CardContent className="flex flex-col gap-3">{feedback.map((item) => <article key={item.subject} className="flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center"><div className="flex items-start gap-3"><span className="rounded-lg bg-muted p-2"><MessageSquare /></span><div><h3 className="font-semibold">{item.subject}</h3><p className="text-sm text-muted-foreground">{item.from} · {item.received}</p></div></div><div className="flex items-center gap-2"><Badge variant={item.status === "Resolved" ? "secondary" : "outline"}>{item.status}</Badge><Badge variant="outline">{item.priority}</Badge>{item.status !== "Resolved" && <Button size="sm" variant="outline" onClick={() => markResolved(item.subject)}>Resolve</Button>}</div></article>)}</CardContent></Card></TabsContent>

        <TabsContent value="audit" className="mt-5"><Card><CardHeader><CardTitle className="flex items-center gap-2"><ShieldCheck /> Communication activity log</CardTitle><CardDescription>Review recent school notices and delivery outcomes.</CardDescription></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full min-w-[680px] text-left text-sm"><thead><tr className="border-b text-muted-foreground"><th className="pb-3 pr-4 font-medium">Activity</th><th className="pb-3 pr-4 font-medium">Audience</th><th className="pb-3 pr-4 font-medium">Channels</th><th className="pb-3 pr-4 font-medium">Timestamp</th><th className="pb-3 font-medium">Outcome</th></tr></thead><tbody>{announcements.map((item) => <tr key={item.id} className="border-b last:border-0"><td className="py-3 pr-4 font-medium">{item.title}</td><td className="py-3 pr-4">{item.audience}</td><td className="py-3 pr-4">{item.channels.join(", ")}</td><td className="py-3 pr-4">{item.sent}</td><td className="py-3"><Badge variant={item.status === "Delivered" ? "default" : "outline"}>{item.status} · {item.delivered}</Badge></td></tr>)}</tbody></table></div><p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Clock3 /> Delivery outcomes shown here are illustrative until a provider is connected.</p></CardContent></Card></TabsContent>
      </Tabs>
    </section>
  )
}

function Metric({ icon, label, value, detail }: { icon: ReactNode; label: string; value: string; detail: string }) {
  return <Card><CardContent className="flex items-start justify-between gap-3 p-5"><div><p className="text-sm text-muted-foreground">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight">{value}</p><p className="mt-1 text-xs text-muted-foreground">{detail}</p></div><span className="rounded-lg bg-muted p-2 text-primary">{icon}</span></CardContent></Card>
}
