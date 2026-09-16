"use client"

import { useState } from "react"

export function PaymentPlan() {
  const [activeTab, setActiveTab] = useState("fee-structure")
  const [selectedTerm, setSelectedTerm] = useState("current-term")
  const [selectedYear, setSelectedYear] = useState("2023")
  const [selectedClass, setSelectedClass] = useState("all")
  const [isAddFeeOpen, setIsAddFeeOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for school
  const schoolInfo = {
    id: "school1",
    name: "Sunshine Academy",
    logo: "/placeholder.svg?height=40&width=40",
  }

  // Mock data for fee structure
  const feeStructure = [
    {
      id: "fee1",
      name: "Tuition Fee",
      class: "Grade 1",
      amount: 50000,
      dueDate: "2023-05-15",
      description: "Regular tuition fee for Term 2, 2023",
      isRequired: true,
    },
    {
      id: "fee2",
      name: "Tuition Fee",
      class: "Grade 2",
      amount: 55000,
      dueDate: "2023-05-15",
      description: "Regular tuition fee for Term 2, 2023",
      isRequired: true,
    },
    {
      id: "fee3",
      name: "Tuition Fee",
      class: "Grade 3",
      amount: 60000,
      dueDate: "2023-05-15",
      description: "Regular tuition fee for Term 2, 2023",
      isRequired: true,
    },
    {
      id: "fee4",
      name: "Tuition Fee",
      class: "Grade 4",
      amount: 65000,
      dueDate: "2023-05-15",
      description: "Regular tuition fee for Term 2, 2023",
      isRequired: true,
    },
    {
      id: "fee5",
      name: "Tuition Fee",
      class: "Grade 5",
      amount: 70000,
      dueDate: "2023-05-15",
      description: "Regular tuition fee for Term 2, 2023",
      isRequired: true,
    },
    {
      id: "fee6",
      name: "Development Fee",
      class: "All Classes",
      amount: 10000,
      dueDate: "2023-05-15",
      description: "One-time development fee for Term 2, 2023",
      isRequired: true,
    },
    {
      id: "fee7",
      name: "Library Fee",
      class: "All Classes",
      amount: 5000,
      dueDate: "2023-05-15",
      description: "Library maintenance and book acquisition fee",
      isRequired: true,
    },
    {
      id: "fee8",
      name: "Computer Lab Fee",
      class: "Grade 3-9",
      amount: 8000,
      dueDate: "2023-05-15",
      description: "Computer lab usage and maintenance fee",
      isRequired: true,
    },
    {
      id: "fee9",
      name: "Sports Fee",
      class: "All Classes",
      amount: 5000,
      dueDate: "2023-05-15",
      description: "Sports equipment and activities fee",
      isRequired: true,
    },
    {
      id: "fee10",
      name: "School Trip",
      class: "Grade 5-9",
      amount: 15000,
      dueDate: "2023-06-30",
      description: "Optional educational trip fee",
      isRequired: false,
    },
  ]

  // Mock data for payment plans
  const paymentPlans = [
    {
      id: "plan1",
      name: "Full Payment",
      description: "Pay the full amount at once",
      discount: 5,
      installments: 1,
      isDefault: true,
    },
    {
      id: "plan2",
      name: "Two Installments",
      description: "Pay in two equal installments",
      discount: 0,
      installments: 2,
      isDefault: false,
    },
    {
      id: "plan3",
      name: "Three Installments",
      description: "Pay in three equal installments",
      discount: 0,
      installments: 3,
      isDefault: false,
    },
  ]

  // Mock data for payment transactions
  const paymentTransactions = [
    {
      id: "trans1",
      studentName: "Alice Cooper",
      class: "Grade 5",
      amount: 75000,
      date: "2023-05-10",
      method: "Bank Transfer",
      status: "completed",
      reference: "REF123456",
    },
    {
      id: "trans2",
      studentName: "Bob Johnson",
      class: "Grade 3",
      amount: 65000,
      date: "2023-05-12",
      method: "Cash",
      status: "completed",
      reference: "REF234567",
    },
    {
      id: "trans3",
      studentName: "Charlie Brown",\
      class: "Grade
