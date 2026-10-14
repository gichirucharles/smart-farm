"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Download, TrendingUp, TrendingDown, DollarSign, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function DirectorFinancialOverview() {
  // Mock financial data for the director
  const overviewData = {
    totalRevenue: 2570000,
    totalExpenses: 1940000,
    balance: 630000,
    revenueGrowth: 12.5,
    expenseGrowth: 8.2,
    profitMargin: 24.5,
    budgetUtilization: 85.7,
    outstandingFees: 345000,
    feeCollectionRate: 78.6,
  }

  const monthlyTrendsData = [
    { month: "Jan", revenue: 198000, expenses: 152000 },
    { month: "Feb", revenue: 195000, expenses: 148000 },
    { month: "Mar", revenue: 210000, expenses: 160000 },
    { month: "Apr", revenue: 205000, expenses: 155000 },
    { month: "May", revenue: 220000, expenses: 165000 },
    { month: "Jun", revenue: 215000, expenses: 163000 },
    { month: "Jul", revenue: 225000, expenses: 168000 },
    { month: "Aug", revenue: 230000, expenses: 170000 },
    { month: "Sep", revenue: 235000, expenses: 174000 },
    { month: "Oct", revenue: 245000, expenses: 180000 },
    { month: "Nov", revenue: 240000, expenses: 178000 },
    { month: "Dec", revenue: 250000, expenses: 185000 },
  ]

  const expenseBreakdownData = [
    { name: "Salaries", value: 1150000 },
    { name: "Operations", value: 310000 },
    { name: "Facilities", value: 230000 },
    { name: "Teaching Materials", value: 180000 },
    { name: "Administrative", value: 70000 },
  ]

  const schoolComparisonData = [
    { name: "Unity Primary", revenue: 410000, expenses: 325000, profit: 85000 },
    { name: "Excellence Academy", revenue: 520000, expenses: 390000, profit: 130000 },
    { name: "Heritage Int'l", revenue: 350000, expenses: 275000, profit: 75000 },
    { name: "Pioneer Secondary", revenue: 480000, expenses: 355000, profit: 125000 },
    { name: "Greenview Primary", revenue: 290000, expenses: 240000, profit: 50000 },
    { name: "Lakeside Int'l", revenue: 320000, expenses: 260000, profit: 60000 },
  ]

  const revenueStreamsData = [
    { name: "Tuition Fees", value: 1850000 },
    { name: "Registration", value: 320000 },
    { name: "Extracurricular", value: 180000 },
    { name: "Books & Materials", value: 150000 },
    { name: "Donations", value: 70000 },
  ]

  // Colors for pie charts
  const EXPENSE_COLORS = ["#4f46e5", "#22c55e", "#eab308", "#f97316", "#ef4444"]
  const REVENUE_COLORS = ["#3b82f6", "#8b5cf6", "#06b6d4", "#14b8a6", "#f43f5e"]

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Network Financial Overview</CardTitle>
            <CardDescription>Consolidated financial data across all schools</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select defaultValue="current-year">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current-year">2023 - 2024</SelectItem>
                <SelectItem value="previous-year">2022 - 2023</SelectItem>
                <SelectItem value="last-5-years">Last 5 Years</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="comparisons">School Comparisons</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
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
                      <DollarSign className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{formatCurrency(overviewData.totalRevenue)}</div>
                      <div className="flex items-center text-xs text-green-600">
                        <TrendingUp className="mr-1 h-4 w-4" />+{overviewData.revenueGrowth}% from previous year
                      </div>
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
                      <div className="text-2xl font-bold">{formatCurrency(overviewData.totalExpenses)}</div>
                      <div className="flex items-center text-xs text-red-600">
                        <TrendingUp className="mr-1 h-4 w-4" />+{overviewData.expenseGrowth}% from previous year
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Net Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="mr-4 rounded-full bg-blue-100 p-2">
                      <DollarSign className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{formatCurrency(overviewData.balance)}</div>
                      <div className="flex items-center text-xs text-blue-600">
                        Profit Margin: {overviewData.profitMargin}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Revenue vs Expenses (Monthly)</CardTitle>
                  <CardDescription>Trends over the current fiscal year</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrendsData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        name="Revenue"
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
                  <CardTitle className="text-lg">Fee Collection Status</CardTitle>
                  <CardDescription>Overview of fee collection across all schools</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Fee Collection Rate</span>
                        <span className="font-bold">{overviewData.feeCollectionRate}%</span>
                      </div>
                      <Progress value={overviewData.feeCollectionRate} className="h-2" />
                    </div>

                    <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 mr-2 text-amber-500 mt-0.5" />
                        <div>
                          <h4 className="font-semibold text-amber-800">Outstanding Fees</h4>
                          <p className="text-sm text-amber-700 mt-1">
                            Total outstanding fees across all schools: {formatCurrency(overviewData.outstandingFees)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Budget Utilization</span>
                        <span className="font-bold">{overviewData.budgetUtilization}%</span>
                      </div>
                      <Progress value={overviewData.budgetUtilization} className="h-2" />
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
                        data={expenseBreakdownData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {expenseBreakdownData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={EXPENSE_COLORS[index % EXPENSE_COLORS.length]} />
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
                  <CardTitle className="text-lg">Revenue Streams</CardTitle>
                  <CardDescription>Sources of revenue across all schools</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={revenueStreamsData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {revenueStreamsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={REVENUE_COLORS[index % REVENUE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="comparisons">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">School Financial Comparison</CardTitle>
                <CardDescription>Financial performance across all schools</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={schoolComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="revenue" name="Revenue" fill="#3b82f6" />
                    <Bar dataKey="expenses" name="Expenses" fill="#ef4444" />
                    <Bar dataKey="profit" name="Profit" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Financial Trends</CardTitle>
                <CardDescription>Monthly financial performance</CardDescription>
              </CardHeader>
              <CardContent className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      name="Revenue"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Metrics</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Revenue Growth</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        +{overviewData.revenueGrowth}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Expense Growth</span>
                      <Badge variant="outline" className="bg-red-50 text-red-700">
                        +{overviewData.expenseGrowth}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Profit Margin</span>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        {overviewData.profitMargin}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Budget Utilization</span>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">
                        {overviewData.budgetUtilization}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Fee Collection Rate</span>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">
                        {overviewData.feeCollectionRate}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recommendations</CardTitle>
                  <CardDescription>Financial insights and action items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4 py-2">
                      <h4 className="font-semibold">Improve Fee Collection</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Implement a standardized fee collection process across all schools to improve the current rate
                        of {overviewData.feeCollectionRate}%.
                      </p>
                    </div>

                    <div className="border-l-4 border-green-500 pl-4 py-2">
                      <h4 className="font-semibold">Optimize Resource Allocation</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Review expenses across schools to identify cost-saving opportunities, especially in
                        administrative costs.
                      </p>
                    </div>

                    <div className="border-l-4 border-amber-500 pl-4 py-2">
                      <h4 className="font-semibold">Diversify Revenue Streams</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Explore additional revenue sources such as extracurricular programs, summer schools, and
                        facility rentals.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export const FinancialOverview = DirectorFinancialOverview
