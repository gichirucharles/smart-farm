"use client"

import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

const mockMessages = {
  child: "Alice Doe",
  inbox: [
    {
      id: 1,
      from: "Mrs. Sarah Johnson",
      role: "Mathematics Teacher",
      subject: "Alice's recent test performance",
      preview: "Hi, I wanted to reach out regarding Alice's recent algebra test...",
      fullMessage:
        "Hi, I wanted to reach out regarding Alice's recent algebra test. She scored 92%, which is excellent! She's showing great progress in understanding quadratic equations.",
      date: "2024-01-14",
      time: "2:30 PM",
      read: false,
    },
    {
      id: 2,
      from: "Mr. James Okonkwo",
      role: "Class Teacher",
      subject: "Monthly class update",
      preview: "Dear parents, I'm writing to share updates about our class activities this month...",
      fullMessage:
        "Dear parents, I'm writing to share updates about our class activities this month. All students are performing well and showing great enthusiasm in their studies.",
      date: "2024-01-13",
      time: "10:15 AM",
      read: true,
    },
    {
      id: 3,
      from: "Dr. Emily Kipchoge",
      role: "School Nurse",
      subject: "Health screening reminder",
      preview: "Please remember to bring Alice for the scheduled health screening...",
      fullMessage:
        "Please remember to bring Alice for the scheduled health screening next week. It's important for monitoring students' health development.",
      date: "2024-01-12",
      time: "9:00 AM",
      read: true,
    },
  ],
  sent: [
    {
      id: 4,
      to: "Mrs. Sarah Johnson",
      role: "Mathematics Teacher",
      subject: "Re: Alice's recent test performance",
      message:
        "Thank you for the update. We're pleased with Alice's progress. Is there anything we can do to support her further?",
      date: "2024-01-14",
      time: "4:00 PM",
    },
  ],
}

function MessagesContent() {
  const unreadCount = mockMessages.inbox.filter((m) => !m.read).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Messages</h1>
        <p className="text-muted-foreground">Communicate with teachers and school staff</p>
      </div>

      <Tabs defaultValue="inbox" className="w-full">
        <TabsList>
          <TabsTrigger value="inbox">Inbox ({unreadCount} unread)</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>

        <TabsContent value="inbox" className="space-y-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-10" />
          </div>

          {mockMessages.inbox.map((message) => (
            <Card key={message.id} className={message.read ? "" : "border-blue-200 bg-blue-50/30"}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-base">{message.from}</CardTitle>
                      {!message.read && <Badge className="bg-blue-600">New</Badge>}
                    </div>
                    <CardDescription>{message.role}</CardDescription>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {message.date} {message.time}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm mb-1">{message.subject}</h4>
                  <p className="text-sm text-muted-foreground">{message.fullMessage}</p>
                </div>
                <Button variant="outline" size="sm">
                  Reply
                </Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {mockMessages.sent.map((message) => (
            <Card key={message.id}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-base mb-1">To: {message.to}</CardTitle>
                    <CardDescription>{message.role}</CardDescription>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {message.date} {message.time}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm mb-1">{message.subject}</h4>
                  <p className="text-sm text-muted-foreground">{message.message}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={null}>
      <MessagesContent />
    </Suspense>
  )
}
