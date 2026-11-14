"use client"

import { useMemo, useState, type FormEvent } from "react"
import { Plus, Send } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

type MessageFolder = "inbox" | "sent"
type ReadStatus = "unread" | "read"

type DirectorMessage = {
  id: string
  from: string
  to: string
  subject: string
  body: string
  folder: MessageFolder
  readStatus: ReadStatus
  sentAt: string
}

type MessageDraft = {
  to: string
  subject: string
  body: string
}

const INITIAL_MESSAGES: DirectorMessage[] = [
  {
    id: "message-1",
    from: "Ministry of Education",
    to: "Dr. James Mwangi",
    subject: "Curriculum update guidelines",
    body: "Please review the updated curriculum guidance for the next academic term and share it with your school leadership team.",
    folder: "inbox",
    readStatus: "unread",
    sentAt: "2026-10-28T09:15:00.000Z",
  },
  {
    id: "message-2",
    from: "Head Teacher",
    to: "Dr. James Mwangi",
    subject: "Staff meeting minutes",
    body: "The minutes from this week's staff meeting are ready for review. The team discussed term planning and parent engagement.",
    folder: "inbox",
    readStatus: "read",
    sentAt: "2026-10-25T13:30:00.000Z",
  },
  {
    id: "message-3",
    from: "County Education Office",
    to: "Dr. James Mwangi",
    subject: "School inspection schedule",
    body: "Your school has been scheduled for a routine inspection. Please confirm that the records and facilities checklist are up to date.",
    folder: "inbox",
    readStatus: "unread",
    sentAt: "2026-10-22T07:45:00.000Z",
  },
]

const EMPTY_DRAFT: MessageDraft = { to: "", subject: "", body: "" }

function formatMessageDate(value: string) {
  return new Intl.DateTimeFormat("en-KE", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value))
}

interface MessageListProps {
  messages: DirectorMessage[]
  onOpen: (id: string) => void
}

function MessageList({ messages, onOpen }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="rounded-lg border border-dashed px-4 py-10 text-center">
        <p className="font-medium">No messages in this view</p>
        <p className="mt-1 text-sm text-muted-foreground">Messages will appear here when they are available.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {messages.map((message) => (
        <Button
          key={message.id}
          type="button"
          variant="ghost"
          className="h-auto w-full justify-start whitespace-normal rounded-lg border px-4 py-3 text-left"
          onClick={() => onOpen(message.id)}
        >
          <div className="flex w-full min-w-0 items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">
                  {message.folder === "sent" ? `To: ${message.to}` : message.from}
                </span>
                {message.readStatus === "unread" && <Badge>Unread</Badge>}
              </div>
              <p className="mt-1 truncate text-sm">{message.subject}</p>
              <p className="mt-1 line-clamp-2 text-sm font-normal text-muted-foreground">{message.body}</p>
            </div>
            <time className="shrink-0 pt-1 text-xs text-muted-foreground" dateTime={message.sentAt}>
              {formatMessageDate(message.sentAt)}
            </time>
          </div>
        </Button>
      ))}
    </div>
  )
}

export function MessagesCenter() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)
  const [draft, setDraft] = useState<MessageDraft>(EMPTY_DRAFT)
  const [statusMessage, setStatusMessage] = useState("")

  const inboxMessages = useMemo(() => messages.filter((message) => message.folder === "inbox"), [messages])
  const unreadMessages = useMemo(() => inboxMessages.filter((message) => message.readStatus === "unread"), [inboxMessages])
  const readMessages = useMemo(() => inboxMessages.filter((message) => message.readStatus === "read"), [inboxMessages])
  const sentMessages = useMemo(() => messages.filter((message) => message.folder === "sent"), [messages])
  const selectedMessage = messages.find((message) => message.id === selectedMessageId) ?? null

  const openMessage = (id: string) => {
    setSelectedMessageId(id)
    setMessages((current) =>
      current.map((message) =>
        message.id === id && message.folder === "inbox"
          ? { ...message, readStatus: "read" }
          : message,
      ),
    )
  }

  const handleSend = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const sentMessage: DirectorMessage = {
      id: `message-${Date.now()}`,
      from: "You",
      to: draft.to.trim(),
      subject: draft.subject.trim(),
      body: draft.body.trim(),
      folder: "sent",
      readStatus: "read",
      sentAt: new Date().toISOString(),
    }

    setMessages((current) => [...current, sentMessage])
    setStatusMessage("Message saved to Sent for this session. It was not delivered externally.")
    setDraft(EMPTY_DRAFT)
    setIsComposeOpen(false)
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">Official communications and correspondence</p>
        </div>
        <Button type="button" onClick={() => setIsComposeOpen(true)}>
          <Plus data-icon="inline-start" />
          New Message
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>
            {unreadMessages.length} unread {unreadMessages.length === 1 ? "message" : "messages"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="inbox">
            <TabsList className="mb-4 grid h-auto w-full grid-cols-2 gap-1 p-1 sm:grid-cols-4">
              <TabsTrigger value="inbox">Inbox ({inboxMessages.length})</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadMessages.length})</TabsTrigger>
              <TabsTrigger value="read">Read ({readMessages.length})</TabsTrigger>
              <TabsTrigger value="sent">Sent ({sentMessages.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="inbox">
              <MessageList messages={inboxMessages} onOpen={openMessage} />
            </TabsContent>
            <TabsContent value="unread">
              <MessageList messages={unreadMessages} onOpen={openMessage} />
            </TabsContent>
            <TabsContent value="read">
              <MessageList messages={readMessages} onOpen={openMessage} />
            </TabsContent>
            <TabsContent value="sent">
              <MessageList messages={sentMessages} onOpen={openMessage} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {statusMessage && (
        <p role="status" aria-live="polite" className="text-sm text-muted-foreground">
          {statusMessage}
        </p>
      )}

      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>New message</DialogTitle>
            <DialogDescription>
              Draft a message for this session. This preview does not deliver email or SMS.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSend}>
            <FieldGroup className="gap-4">
              <Field>
                <FieldLabel htmlFor="message-recipient">Recipient</FieldLabel>
                <Input
                  id="message-recipient"
                  type="email"
                  autoComplete="email"
                  placeholder="name@school.example"
                  value={draft.to}
                  onChange={(event) => setDraft((current) => ({ ...current, to: event.target.value }))}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="message-subject">Subject</FieldLabel>
                <Input
                  id="message-subject"
                  value={draft.subject}
                  onChange={(event) => setDraft((current) => ({ ...current, subject: event.target.value }))}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="message-body">Message</FieldLabel>
                <Textarea
                  id="message-body"
                  rows={5}
                  value={draft.body}
                  onChange={(event) => setDraft((current) => ({ ...current, body: event.target.value }))}
                  required
                />
              </Field>
            </FieldGroup>
            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={() => setIsComposeOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Send data-icon="inline-start" />
                Save to Sent
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(selectedMessage)} onOpenChange={(open) => !open && setSelectedMessageId(null)}>
        <DialogContent className="sm:max-w-xl">
          {selectedMessage && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedMessage.subject}</DialogTitle>
                <DialogDescription>
                  {selectedMessage.folder === "sent" ? `To: ${selectedMessage.to}` : `From: ${selectedMessage.from}`} · {formatMessageDate(selectedMessage.sentAt)}
                </DialogDescription>
              </DialogHeader>
              <p className="whitespace-pre-wrap text-sm leading-6">{selectedMessage.body}</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
