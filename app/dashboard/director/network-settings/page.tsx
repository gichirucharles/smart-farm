'use client'

import { useEffect, useState } from 'react'
import { NetworkSettings } from '@/components/dashboard/director/network-settings'
import { SystemLogs } from '@/components/dashboard/system-admin/system-logs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type ActivePanel = 'configuration' | 'logs' | null

export default function NetworkSettingsPage() {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null)

  useEffect(() => {
    if (!activePanel) return

    const panel = document.getElementById('network-tools-panel')
    panel?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    panel?.focus({ preventScroll: true })
  }, [activePanel])

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Network Settings</h1>
        <p className="text-muted-foreground">IT and system configuration</p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Internet Connectivity</CardTitle>
            <CardDescription>Network status and settings</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-medium">ISP</p>
              <p className="text-muted-foreground">Safaricom Business</p>
            </div>
            <div>
              <p className="text-sm font-medium">Bandwidth</p>
              <p className="text-muted-foreground">10 Mbps</p>
            </div>
            <Button
              type="button"
              variant="outline"
              aria-expanded={activePanel === 'configuration'}
              aria-controls="network-tools-panel"
              onClick={() => setActivePanel(activePanel === 'configuration' ? null : 'configuration')}
            >
              {activePanel === 'configuration' ? 'Hide Network Configuration' : 'Configure Network'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
            <CardDescription>Current dashboard connectivity</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex justify-between gap-4">
              <span>Dashboard</span>
              <span className="font-medium text-green-700">Available</span>
            </div>
            <div className="flex justify-between gap-4">
              <span>Database</span>
              <span className="font-medium text-amber-700">Not connected</span>
            </div>
            <Button
              type="button"
              variant="outline"
              aria-expanded={activePanel === 'logs'}
              aria-controls="network-tools-panel"
              onClick={() => setActivePanel(activePanel === 'logs' ? null : 'logs')}
            >
              {activePanel === 'logs' ? 'Hide System Logs' : 'View System Logs'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {activePanel && (
        <section
          id="network-tools-panel"
          tabIndex={-1}
          aria-labelledby="network-tools-title"
          className="scroll-mt-6 outline-none"
        >
          <div className="mb-4">
            <h2 id="network-tools-title" className="text-xl font-semibold">
              {activePanel === 'configuration' ? 'Network configuration' : 'System logs'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {activePanel === 'configuration'
                ? 'Settings remain on this browser and do not sync across users.'
                : 'Sample log entries are shown; a live log source is not connected.'}
            </p>
          </div>
          {activePanel === 'configuration' ? <NetworkSettings /> : <SystemLogs />}
        </section>
      )}
    </div>
  )
}
