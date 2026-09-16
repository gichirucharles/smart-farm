"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  FileText,
  Search,
  Filter,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"

export function FinanceOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState("current-term")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock financial data
  const financialSummary = {
    totalRevenue: 125000,
    totalExpenses: 98500,
    balance: 26500,
    feeCollection: 112000,
    feeTarget: 150000,
    collectionRate: 74.67,
    outstandingFees: 38000,
    recentTransactions: [
      {
        id: "tr1",
        date: "2023-06-15",
        description: "Fee Payment - Grade 5",
        amount: 5000,
        type: "income",
        category: "fees",
        status: "completed",
      },
      {
        id: "tr2",
        date: "2023-06-14",
        description: "Stationery Supplies",
        amount: 1200,
        type: "expense",
        category: "supplies",
        status: "completed",
      },
      {
        id: "tr3",
        date: "2023-06-12",
        description: "Staff Salaries",
        amount: 45000,
        type: "expense",
        category: "salaries",
        status: "completed",
      },
      {
        id: "tr4",
        date: "2023-06-10",
        description: "Fee Payment - Grade 3",
        amount: 4500,
        type: "income",
        category: "fees",
        status: "completed",
      },
      {
        id: "tr5",
        date: "2023-06-08",
        description: "Maintenance",
        amount: 2500,
        type: "expense",
        category: "maintenance",
        status: "completed",
      },
    ],
    expenseBreakdown: [
      { name: "Salaries", value: 65000 },
      { name: "Supplies", value: 12000 },
      { name: "Maintenance", value: 8500 },
      { name: "Utilities", value: 7000 },
      { name: "Other", value: 6000 },
    ],
    incomeBreakdown: [
      { name: "Tuition Fees", value: 112000 },
      { name: "Registration", value: 8000 },
      { name: "Donations", value: 3000 },
      { name: "Other", value: 2000 },
    ],
    monthlyTrend: [
      { month: "Jan", income: 42000, expenses: 35000 },
      { month: "Feb", income: 38000, expenses: 32000 },
      { month: "Mar", income: 45000, expenses: 36000 },
      { month: "Apr", income: 40000, expenses: 34000 },
      { month: "May", income: 43000, expenses: 37000 },
      { month: "Jun", income: 47000, expenses: 39000 },
    ],
    feesByClass: [
      { class: "Grade 1", collected: 18000, target: 25000, rate: 72 },
      { class: "Grade 2", collected: 16500, target: 22000, rate: 75 },
      { class: "Grade 3", collected: 19000, target: 24000, rate: 79.2 },
      { class: "Grade 4", collected: 17500, target: 23000, rate: 76.1 },
      { class: "Grade 5", collected: 20000, target: 28000, rate: 71.4 },
      { class: "Grade 6", collected: 21000, target: 28000, rate: 75 },
    ],
  }

  // Colors for pie chart
  const COLORS = ["#4f46e5", "#22c55e", "#eab308", "#f97316", "#ef4444", "#8b5cf6"]

  // Filter transactions based on search query and category
  const filteredTransactions = financialSummary.recentTransactions.filter((transaction) => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || transaction.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Finance Overview</CardTitle>
              <CardDescription>School financial summary and management</CardDescription>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current-term">Current Term</SelectItem>
                  <SelectItem value="previous-term">Previous Term</SelectItem>
                  <SelectItem value="current-year">Current Year</SelectItem>
                  <SelectItem value="previous-year">Previous Year</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Custom Range
              </Button>

              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="fee-collection">Fee Collection</TabsTrigger>
              <TabsTrigger value="reports">Financial Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="mr-4 rounded-full bg-green-100 p-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{formatCurrency(financialSummary.totalRevenue)}</div>
                        <p className="text-xs text-gray-500">Current Term</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Expenses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="mr-4 rounded-full bg-red-100 p-2">
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{formatCurrency(financialSummary.totalExpenses)}</div>
                        <p className="text-xs text-gray-500">Current Term</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <div className="mr-4 rounded-full bg-blue-100 p-2">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold">{formatCurrency(financialSummary.balance)}</div>
                        <p className="text-xs text-gray-500">Current Term</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Income vs Expenses</CardTitle>
                    <CardDescription>Monthly financial trend</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={financialSummary.monthlyTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="income"
                          name="Income"
                          stroke="#22c55e"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                        <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Fee Collection</CardTitle>
                    <CardDescription>Current term fee collection status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">Collection Rate</p>
                          <p className="text-2xl font-bold">{financialSummary.collectionRate}%</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">Collected / Target</p>
                          <p className="text-sm">
                            {formatCurrency(financialSummary.feeCollection)} /{" "}
                            {formatCurrency(financialSummary.feeTarget)}
                          </p>
                        </div>
                      </div>

                      <Progress value={financialSummary.collectionRate} className="h-2" />

                      <div className="pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium">Outstanding Fees</p>
                          <p className="text-sm font-bold text-red-600">
                            {formatCurrency(financialSummary.outstandingFees)}
                          </p>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <FileText className="h-4 w-4 mr-2" />
                          View Fee Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Expense Breakdown</CardTitle>
                    <CardDescription>Distribution of expenses by category</CardDescription>
                  </CardHeader>
                  <CardContent className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={financialSummary.expenseBreakdown}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {financialSummary.expenseBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recent Transactions</CardTitle>
                    <CardDescription>Latest financial activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {financialSummary.recentTransactions.slice(0, 4).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className={`mr-3 rounded-full p-2 ${
                                transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                              }`}
                            >
                              {transaction.type === "income" ? (
                                <ArrowUpRight className="h-4 w-4 text-green-600" />
                              ) : (
                                <ArrowDownRight className="h-4 w-4 text-red-600" />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{transaction.description}</p>
                              <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                            </div>
                          </div>
                          <p
                            className={`font-medium ${
                              transaction.type === "income" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </p>
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setActiveTab("transactions")}
                      >
                        View All Transactions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">All Transactions</CardTitle>
                      <CardDescription>View and manage financial transactions</CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search transactions..."
                          className="pl-8"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>

                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Categories</SelectItem>
                          <SelectItem value="fees">Fees</SelectItem>
                          <SelectItem value="salaries">Salaries</SelectItem>
                          <SelectItem value="supplies">Supplies</SelectItem>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>

                      <Button size="sm">
                        <CreditCard className="h-4 w-4 mr-2" />
                        New Transaction
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>{formatDate(transaction.date)}</TableCell>
                          <TableCell className="font-medium">{transaction.description}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {transaction.category}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={transaction.type === "income" ? "default" : "destructive"}
                              className="capitalize"
                            >
                              {transaction.type}
                            </Badge>
                          </TableCell>
                          <TableCell
                            className={`font-medium ${
                              transaction.type === "income" ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="fee-collection" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Fee Collection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-sm">Total Collected</p>
                        <p className="font-bold">{formatCurrency(financialSummary.feeCollection)}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm">Collection Target</p>
                        <p className="font-medium">{formatCurrency(financialSummary.feeTarget)}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm">Outstanding Fees</p>
                        <p className="font-medium text-red-600">{formatCurrency(financialSummary.outstandingFees)}</p>
                      </div>
                      <div className="pt-2">
                        <p className="text-sm mb-1">Collection Progress</p>
                        <Progress value={financialSummary.collectionRate} className="h-2" />
                        <p className="text-xs text-right mt-1">{financialSummary.collectionRate}% collected</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Fee Collection by Class</CardTitle>
                    <CardDescription>Collection rates across different classes</CardDescription>
                  </CardHeader>
                  <CardContent className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={financialSummary.feesByClass}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="class" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Legend />
                        <Bar dataKey="collected" name="Collected" fill="#4f46e5" />
                        <Bar dataKey="target" name="Target" fill="#94a3b8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Fee Collection Details by Class</CardTitle>
                  <CardDescription>Detailed breakdown of fee collection status</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Class</TableHead>
                        <TableHead>Collected</TableHead>
                        <TableHead>Target</TableHead>
                        <TableHead>Outstanding</TableHead>
                        <TableHead>Collection Rate</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {financialSummary.feesByClass.map((classData) => (
                        <TableRow key={classData.class}>
                          <TableCell className="font-medium">{classData.class}</TableCell>
                          <TableCell>{formatCurrency(classData.collected)}</TableCell>
                          <TableCell>{formatCurrency(classData.target)}</TableCell>
                          <TableCell className="text-red-600">
                            {formatCurrency(classData.target - classData.collected)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <Progress value={classData.rate} className="h-2 w-24" />
                              <span className="text-sm">{classData.rate}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Financial Reports</CardTitle>
                  <CardDescription>Access and generate financial reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Income Statement</CardTitle>
                        <CardDescription>Summary of income and expenses</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <p className="text-sm">Total Income</p>
                            <p className="font-bold text-green-600">{formatCurrency(financialSummary.totalRevenue)}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm">Total Expenses</p>
                            <p className="font-bold text-red-600">{formatCurrency(financialSummary.totalExpenses)}</p>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t">
                            <p className="text-sm font-medium">Net Income</p>
                            <p className="font-bold">{formatCurrency(financialSummary.balance)}</p>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Download Report
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Fee Collection Report</CardTitle>
                        <CardDescription>Detailed fee collection status</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <p className="text-sm">Total Collected</p>
                            <p className="font-bold">{formatCurrency(financialSummary.feeCollection)}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm">Outstanding Fees</p>
                            <p className="font-bold text-red-600">{formatCurrency(financialSummary.outstandingFees)}</p>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm">Collection Rate</p>
                            <p className="font-bold">{financialSummary.collectionRate}%</p>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Download Report
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Expense Report</CardTitle>
                        <CardDescription>Breakdown of expenses by category</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <p className="text-sm">Total Expenses</p>
                            <p className="font-bold text-red-600">{formatCurrency(financialSummary.totalExpenses)}</p>
                          </div>
                          <div className="space-y-2">
                            {financialSummary.expenseBreakdown.map((expense, index) => (
                              <div key={index} className="flex justify-between items-center">
                                <p className="text-sm">{expense.name}</p>
                                <p className="font-medium">{formatCurrency(expense.value)}</p>
                              </div>
                            ))}
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Download Report
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Budget Analysis</CardTitle>
                        <CardDescription>Comparison of actual vs budgeted expenses</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <p className="text-sm">Budget Utilization</p>
                            <p className="font-bold">82%</p>
                          </div>
                          <div className="pt-2">
                            <p className="text-sm mb-1">Budget Progress</p>
                            <Progress value={82} className="h-2" />
                            <p className="text-xs text-right mt-1">82% of budget utilized</p>
                          </div>
                          <Button variant="outline" size="sm" className="w-full">
                            <Download className="h-4 w-4 mr-2" />
                            Download Report
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <h3 className="text-sm font-medium mb-3">Generate Custom Report</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="report-type">Report Type</Label>
                        <Select>
                          <SelectTrigger id="report-type">
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="income-statement">Income Statement</SelectItem>
                            <SelectItem value="fee-collection">Fee Collection</SelectItem>
                            <SelectItem value="expense-report">Expense Report</SelectItem>
                            <SelectItem value="budget-analysis">Budget Analysis</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="report-period">Period</Label>
                        <Select>
                          <SelectTrigger id="report-period">
                            <SelectValue placeholder="Select period" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="current-term">Current Term</SelectItem>
                            <SelectItem value="previous-term">Previous Term</SelectItem>
                            <SelectItem value="current-year">Current Year</SelectItem>
                            <SelectItem value="custom">Custom Range</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="report-format">Format</Label>
                        <Select>
                          <SelectTrigger id="report-format">
                            <SelectValue placeholder="Select format" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pdf">PDF</SelectItem>
                            <SelectItem value="excel">Excel</SelectItem>
                            <SelectItem value="csv">CSV</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button className="mt-4">
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
