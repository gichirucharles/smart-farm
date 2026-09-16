"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { AlertCircle, CheckCircle2, Clock, MessageSquare } from "lucide-react"

interface IncidentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  incident: {
    id: string
    title: string
    description: string
    date: string
    status: "pending" | "resolved" | "in-progress"
    priority: "low" | "medium" | "high"
    category: string
    reportedBy: {
      name: string
      role: string
      avatar?: string
    }
    assignedTo?: {
      name: string
      role: string
      avatar?: string
    }
    updates: Array<{
      id: string
      content: string
      timestamp: string
      author: {
        name: string
        role: string
        avatar?: string
      }
    }>
  }
}

export function IncidentDetailsModal({ isOpen, onClose, incident }: IncidentDetailsModalProps) {
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!incident) return null

  const handleAddComment = () => {
    if (!comment.trim()) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setComment("")
      setIsSubmitting(false)
      // In a real app, you would add the comment to the incident updates
    }, 1000)
  }

  const handleResolveIncident = () => {
    // In a real app, you would update the incident status
    console.log("Resolving incident:", incident.id)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "in-progress":
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case "resolved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "in-progress":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "resolved":
        return "bg-green-50 text-green-700 border-green-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-green-50 text-green-700 border-green-200"
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "high":
        return "bg-red-50 text-red-700 border-red-200"
      default:
        return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{incident.title}</DialogTitle>
          <DialogDescription>Incident reported on {new Date(incident.date).toLocaleDateString()}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Incident Details */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
              <p className="text-sm">{incident.description}</p>
            </div>
            <div className="md:w-64 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}
                >
                  {getStatusIcon(incident.status)}
                  <span className="ml-1 capitalize">{incident.status.replace("-", " ")}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Priority</h3>
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(incident.priority)}`}
                >
                  <span className="capitalize">{incident.priority}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                <Badge variant="outline">{incident.category}</Badge>
              </div>
            </div>
          </div>

          {/* People */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Reported By</h3>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={incident.reportedBy.avatar || "/placeholder.svg"} alt={incident.reportedBy.name} />
                  <AvatarFallback>{incident.reportedBy.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{incident.reportedBy.name}</p>
                  <p className="text-xs text-gray-500">{incident.reportedBy.role}</p>
                </div>
              </div>
            </div>

            {incident.assignedTo && (
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Assigned To</h3>
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={incident.assignedTo.avatar || "/placeholder.svg"}
                      alt={incident.assignedTo.name}
                    />
                    <AvatarFallback>{incident.assignedTo.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{incident.assignedTo.name}</p>
                    <p className="text-xs text-gray-500">{incident.assignedTo.role}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Updates */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">Updates & Comments</h3>
            <div className="space-y-4">
              {incident.updates.map((update) => (
                <Card key={update.id}>
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={update.author.avatar || "/placeholder.svg"} alt={update.author.name} />
                        <AvatarFallback>{update.author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-sm font-medium">{update.author.name}</span>
                            <span className="text-xs text-gray-500 ml-2">{update.author.role}</span>
                          </div>
                          <span className="text-xs text-gray-500">{new Date(update.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-sm mt-1">{update.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Add Comment */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-500">Add Comment</h3>
            <Textarea
              placeholder="Type your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <div className="space-x-2">
                {incident.status !== "resolved" && (
                  <Button variant="outline" onClick={handleResolveIncident}>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark as Resolved
                  </Button>
                )}
                <Button onClick={handleAddComment} disabled={!comment.trim() || isSubmitting}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Sending..." : "Add Comment"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
