'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

export default function FinancialOverviewPage() {
  const data = [
    { name: 'Salaries', value: 45 },
    { name: 'Infrastructure', value: 25 },
    { name: 'Utilities', value: 15 },
    { name: 'Supplies', value: 15 },
  ]

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Financial Overview</h1>
        <p className="text-muted-foreground">School budget and financial management</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Budget Allocation</CardTitle>
            <CardDescription>Total annual budget: KES 50M</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}%`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary</CardTitle>
            <CardDescription>Year to date</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Total Revenue</span>
              <span className="font-bold">KES 45M</span>
            </div>
            <div className="flex justify-between">
              <span>Total Expenditure</span>
              <span className="font-bold">KES 42M</span>
            </div>
            <div className="flex justify-between border-t pt-2">
              <span>Balance</span>
              <span className="font-bold text-green-600">KES 3M</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
