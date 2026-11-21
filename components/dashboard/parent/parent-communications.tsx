"use client"

import { useState } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type MessageData = {
  students: { id: string; name: string; admissionNumber: string }[]
  messages: { id: string; student_id: string; category: string; title: string; body: string; created_by_role: string; created_at: string }[]
}
const fetcher = async (url: string): Promise<MessageData> => {
  const response = await fetch(url, { credentials: "same-origin" })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error ?? "Unable to load messages")
  return data
}

export function ParentCommunications() {
  const { data, error, isLoading, mutate } = useSWR("/api/parent/messages", fetcher, { revalidateOnFocus: false })
  const [studentId, setStudentId] = useState("")
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [saving, setSaving] = useState(false)
  async function sendMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    try {
      const response = await fetch("/api/parent/messages", { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ studentId, title, body }) })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? "Unable to send message")
      setTitle(""); setBody(""); await mutate(); toast.success("Message sent to the class teacher")
    } catch (sendError) { toast.error(sendError instanceof Error ? sendError.message : "Unable to send message") }
    finally { setSaving(false) }
  }
  return <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
    <header><p className="text-sm font-medium text-primary">Family connection</p><h1 className="mt-1 text-3xl font-semibold tracking-tight">Messages</h1><p className="mt-2 text-sm text-muted-foreground">A direct message thread with your child&apos;s class teacher.</p></header>
    <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
      <Card><CardHeader><CardTitle>Conversation history</CardTitle><CardDescription>Messages and meeting requests for children linked to your account.</CardDescription></CardHeader><CardContent className="flex flex-col gap-4">
        {isLoading ? <p className="text-sm text-muted-foreground">Loading your messages…</p> : error ? <p role="alert" className="text-sm text-destructive">{error.message}</p> : data?.messages.length ? data.messages.map((message) => <article key={message.id} className="rounded-lg border p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="font-medium">{message.title}</h2><time className="text-xs text-muted-foreground">{new Date(message.created_at).toLocaleString()}</time></div><p className="mt-2 text-xs text-muted-foreground">{data.students.find((student) => student.id === message.student_id)?.name ?? "Child"} · {message.created_by_role === "parent" ? "You" : "Class teacher"}</p><p className="mt-3 whitespace-pre-wrap text-sm">{message.body}</p></article>) : <p className="text-sm text-muted-foreground">No messages yet. Send a note to start the conversation.</p>}
      </CardContent></Card>
      <Card><CardHeader><CardTitle>Write to the class teacher</CardTitle><CardDescription>For urgent concerns, contact the school directly.</CardDescription></CardHeader><CardContent><form className="flex flex-col gap-4" onSubmit={sendMessage}>
        <label className="grid gap-2 text-sm font-medium">Child<Select value={studentId} onValueChange={setStudentId}><SelectTrigger><SelectValue placeholder="Select a child" /></SelectTrigger><SelectContent><SelectGroup>{(data?.students ?? []).map((student) => <SelectItem key={student.id} value={student.id}>{student.name}</SelectItem>)}</SelectGroup></SelectContent></Select></label>
        <label className="grid gap-2 text-sm font-medium">Subject<Input required maxLength={160} value={title} onChange={(event) => setTitle(event.target.value)} /></label>
        <label className="grid gap-2 text-sm font-medium">Message<Textarea required maxLength={4000} rows={5} value={body} onChange={(event) => setBody(event.target.value)} /></label>
        <Button type="submit" disabled={saving || !studentId || !data?.students.length}>{saving ? "Sending…" : "Send message"}</Button>
        {!data?.students.length && !isLoading && <p className="text-xs text-muted-foreground">No student profile is linked to this parent account yet.</p>}
      </form></CardContent></Card>
    </div>
  </main>
}
