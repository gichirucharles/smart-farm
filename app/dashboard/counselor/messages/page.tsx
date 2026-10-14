'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function CounselorMessagesPage() {
  const messages = [
    { id: 1, from: 'Student - Alice Kimani', subject: 'Request for session', unread: true },
    { id: 2, from: 'Parent - John Kipchoge', subject: 'Concerned about child progress', unread: false },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
          <p className="text-muted-foreground">Communications with students and parents</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Message
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inbox</CardTitle>
          <CardDescription>You have {messages.filter(m => m.unread).length} unread messages</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{msg.from}</p>
                  <p className="text-sm text-muted-foreground">{msg.subject}</p>
                </div>
                {msg.unread && <Badge>Unread</Badge>}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
