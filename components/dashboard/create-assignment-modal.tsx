"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface CreateAssignmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  classes: Array<{ id: string; name: string }>
  subjects: Array<{ id: string; name: string }>
}

export function CreateAssignmentModal({ isOpen, onClose, onSubmit, classes, subjects }: CreateAssignmentModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [totalPoints, setTotalPoints] = useState("100")
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      onSubmit({
        title,
        description,
        classId: selectedClass,
        subjectId: selectedSubject,
        totalPoints: Number.parseInt(totalPoints),
        dueDate,
        attachments,
      })

      // Reset form
      setTitle("")
      setDescription("")
      setSelectedClass("")
      setSelectedSubject("")
      setTotalPoints("100")
      setDueDate(undefined)
      setAttachments([])
      setIsSubmitting(false)

      onClose()
    }, 1000)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files)
      setAttachments([...attachments, ...fileArray])
    }
  }

  const removeAttachment = (index: number) => {
    const newAttachments = [...attachments]
    newAttachments.splice(index, 1)
    setAttachments(newAttachments)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Assignment</DialogTitle>
          <DialogDescription>
            Create a new assignment for your students. Fill in all the required fields.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Assignment Title</Label>
            <Input
              id="title"
              placeholder="Enter assignment title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="class">Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="points">Total Points</Label>
              <Input
                id="points"
                type="number"
                placeholder="100"
                value={totalPoints}
                onChange={(e) => setTotalPoints(e.target.value)}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !dueDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Select due date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="description">Assignment Description</Label>
            <Textarea
              id="description"
              placeholder="Enter detailed instructions for the assignment"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="attachments">Attachments</Label>
            <div className="border rounded-md p-4">
              <div className="flex flex-col space-y-2">
                <div
                  className="flex items-center justify-center border-2 border-dashed rounded-md p-6 cursor-pointer"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm font-medium">Click to upload files</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, DOCX, XLSX, JPG, PNG (max 10MB)</p>
                    <Input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
                  </div>
                </div>

                {attachments.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Uploaded Files:</p>
                    <ul className="space-y-2">
                      {attachments.map((file, index) => (
                        <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                          <span className="text-sm truncate">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAttachment(index)}
                            className="h-6 w-6 p-0"
                          >
                            &times;
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Assignment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
