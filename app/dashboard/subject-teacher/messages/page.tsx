'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare } from 'lucide-react'

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-2">Communicate with students and parents</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messaging
          </CardTitle>
          <CardDescription>Send and receive messages</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Messaging interface</p>
        </CardContent>
      </Card>
    </div>
  )
}
