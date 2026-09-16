"use client"

import { useState } from "react"

export function StudentHealthRecords() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedGrade, setSelectedGrade] = useState("all")
  const [selectedHealthStatus, setSelectedHealthStatus] = useState("all")
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  
  // Mock data for student health records
  const students = [
    {
      id: "student1",
      name: "Ahmed Mohamed",
      avatar: "/placeholder.svg?height=40&width=40",
      grade: "Grade 5A",
      age: 10,
      gender: "Male",
      bloodType: "O+",
      allergies: ["Peanuts", "Penicillin"],
      chronicConditions: ["Asthma"],
      lastExamDate: "2023-05-12",
      height: 142,
      weight: 35,
      bmi: 17.4,
      vision: "20/20",
      immunizationStatus: "complete",\
      emergencyContact: "Sarah Mohame
