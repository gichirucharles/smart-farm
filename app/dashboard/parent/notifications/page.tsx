"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, AlertCircle, Info, CheckCircle, Trash2 } from "lucide-react"

const mockNotifications = {
  child: "Alice Doe",
  unread: [
    {
      id: 1,
      type: "alert",
      title: "Assignment Due Soon",
      message: "English essay for 'The Great Gatsby' is due in 3 days",
      timestamp: "Today, 2:30 PM",
      icon: AlertCircle,
    },
    {
      id: 2,
      type: "info",
      title: "Grade Released",
      message: "Alice's Mathematics test score (92%) has been uploaded",
      timestamp: "Today, 10:15 AM",
      icon: CheckCircle,
    },
    {
      id: 3,
      type: "alert",
      title: "Upcoming Event",
      message: "Science Fair coming up on January 25th. Please ensure materials are ready.",
      timestamp: "Yesterday, 4:00 PM",
      icon: AlertCircle,
    },
  ],
  read: [
    {
      id: 4,
      type: "info",
      title: "Monthly Newsletter",
      message: "January school newsletter is now available in documents section",
      timestamp: "3 days ago",
      icon: Info,
    },
    {
      id: 5,
      type: "info",
      title: "Class Update",
      message: "New class rules and guidelines have been posted",
      timestamp: "1 week ago",
      icon: Info,
    },
    {
      id: 6,
      type: "alert",
      title: "Absence Notification",
      message: "Alice was absent on January 5th. Please provide an explanation.",
      timestamp: "2 weeks ago",
      icon: AlertCircle,
    },
  ],
}

const getNotificationColor = (type: string) => {
  const colors: { [key: string]: string } = {
    alert: "border-red-200 bg-red-50",
    info: "border-blue-200 bg-blue-50",
    success: "border-green-200 bg-green-50",
  }
  return colors[type] || "border-gray-200 bg-gray-50"
}

const getIconColor = (type: string) => {
  const colors: { [key: string]: string } = {
    alert: "text-red-600",
    info: "text-blue-600",
    success: "text-green-600",
  }
  return colors[type] || "text-gray-600"
}

const NotificationCard = ({ notification, showActions = true }: { notification: any; showActions?: boolean }) => {
  const Icon = notification.icon

  return (
    <Card className={getNotificationColor(notification.type)}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${getIconColor(notification.type)}`} />
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">{notification.title}</h4>
            <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
            <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
          </div>
          {showActions && (
            <Button variant="ghost" size="sm" className="flex-shrink-0">
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with important school announcements</p>
      </div>

      <Tabs defaultValue="unread" className="w-full">
        <TabsList>
          <TabsTrigger value="unread">Unread ({mockNotifications.unread.length})</TabsTrigger>
          <TabsTrigger value="read">Read ({mockNotifications.read.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="unread" className="space-y-3">
          {mockNotifications.unread.length > 0 ? (
            mockNotifications.unread.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} showActions={true} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No unread notifications</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="read" className="space-y-3">
          {mockNotifications.read.length > 0 ? (
            mockNotifications.read.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} showActions={false} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">No read notifications</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
