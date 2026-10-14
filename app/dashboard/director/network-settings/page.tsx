'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function NetworkSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Network Settings</h1>
        <p className="text-muted-foreground">IT and system configuration</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Internet Connectivity</CardTitle>
            <CardDescription>Network status and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">ISP</label>
              <p className="text-muted-foreground">Safaricom Business</p>
            </div>
            <div>
              <label className="text-sm font-medium">Bandwidth</label>
              <p className="text-muted-foreground">10 Mbps</p>
            </div>
            <Button variant="outline">Configure Network</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Server and infrastructure health</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Server Status</span>
              <span className="text-green-600 font-medium">Online</span>
            </div>
            <div className="flex justify-between">
              <span>Database Status</span>
              <span className="text-green-600 font-medium">Healthy</span>
            </div>
            <Button variant="outline">View System Logs</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
