"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, MapPin, Users, Download, Share2, Bell } from "lucide-react"

interface EventDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  event: {
    id: string
    title: string
    description: string
    startDate: string
    endDate: string
    location: string
    category: string
    organizer: {
      name: string
      role: string
      avatar?: string
    }
    attendees: Array<{
      id: string
      name: string
      role: string
      avatar?: string
      status: "confirmed" | "pending" | "declined"
    }>
    attachments?: Array<{
      id: string
      name: string
      type: string
      url: string
    }>
  }
}

export function EventDetailsModal({ isOpen, onClose, event }: EventDetailsModalProps) {
  if (!event) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "academic":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "sports":
        return "bg-green-50 text-green-700 border-green-200"
      case "cultural":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "meeting":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "holiday":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 text-green-700 border-green-200"
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "declined":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
          <DialogDescription>{formatDate(event.startDate)}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Event Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
              <p className="text-sm">{event.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Date & Time</h3>
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{formatDate(event.startDate)}</span>
                </div>
                <div className="flex items-center text-sm mt-1">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  <span>
                    {formatTime(event.startDate)} - {formatTime(event.endDate)}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Location</h3>
                <div className="flex items-center text-sm">
                  <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                  <span>{event.location}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}
                >
                  <span className="capitalize">{event.category}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Organizer</h3>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} alt={event.organizer.name} />
                    <AvatarFallback>{event.organizer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">{event.organizer.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attendees */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-500">Attendees ({event.attendees.length})</h3>
              <Badge variant="outline" className="flex items-center">
                <Users className="h-3 w-3 mr-1" />
                <span>{event.attendees.filter((a) => a.status === "confirmed").length} Confirmed</span>
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {event.attendees.map((attendee) => (
                <div key={attendee.id} className="flex items-center justify-between p-2 rounded-md border">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={attendee.avatar || "/placeholder.svg"} alt={attendee.name} />
                      <AvatarFallback>{attendee.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{attendee.name}</p>
                      <p className="text-xs text-gray-500">{attendee.role}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(attendee.status)}`}>
                    <span className="capitalize">{attendee.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Attachments */}
          {event.attachments && event.attachments.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-3">Attachments</h3>
              <div className="space-y-2">
                {event.attachments.map((attachment) => (
                  <div key={attachment.id} className="flex items-center justify-between p-2 rounded-md border">
                    <div className="flex items-center space-x-2">
                      <div className="h-8 w-8 bg-gray-100 rounded-md flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-500">{attachment.type.toUpperCase()}</span>
                      </div>
                      <span className="text-sm">{attachment.name}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            <div className="space-x-2">
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button>
                <Bell className="h-4 w-4 mr-2" />
                Set Reminder
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
