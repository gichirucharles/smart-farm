"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Shield, Mail, Database, Bell, Save, AlertTriangle } from "lucide-react"

export function SystemSettings() {
  const [settings, setSettings] = useState({
    // General Settings
    systemName: "ShuleVerse Management System",
    systemDescription: "Comprehensive school management platform",
    maintenanceMode: false,

    // Security Settings
    passwordMinLength: 8,
    sessionTimeout: 30,
    twoFactorAuth: true,
    loginAttempts: 5,

    // Email Settings
    smtpServer: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "system@shuleverse.com",
    smtpPassword: "",
    emailNotifications: true,

    // Database Settings
    backupRetention: 30,
    autoBackup: true,
    backupTime: "02:00",

    // Notification Settings
    systemAlerts: true,
    userNotifications: true,
    emailReports: true,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsSaving(false)
    alert("Settings saved successfully!")
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            System Settings
          </CardTitle>
          <CardDescription>Configure system-wide settings and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="database">Database</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="systemName">System Name</Label>
                      <Input
                        id="systemName"
                        value={settings.systemName}
                        onChange={(e) => updateSetting("systemName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="systemDescription">System Description</Label>
                      <Textarea
                        id="systemDescription"
                        value={settings.systemDescription}
                        onChange={(e) => updateSetting("systemDescription", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Maintenance Mode</Label>
                      <p className="text-sm text-gray-500">Enable to prevent user access during system updates</p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) => updateSetting("maintenanceMode", checked)}
                    />
                  </div>

                  {settings.maintenanceMode && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Maintenance mode is enabled. Only system administrators can access the system.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                      <Input
                        id="passwordMinLength"
                        type="number"
                        value={settings.passwordMinLength}
                        onChange={(e) => updateSetting("passwordMinLength", Number.parseInt(e.target.value))}
                        min="6"
                        max="20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => updateSetting("sessionTimeout", Number.parseInt(e.target.value))}
                        min="5"
                        max="120"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="loginAttempts">Max Login Attempts</Label>
                      <Input
                        id="loginAttempts"
                        type="number"
                        value={settings.loginAttempts}
                        onChange={(e) => updateSetting("loginAttempts", Number.parseInt(e.target.value))}
                        min="3"
                        max="10"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-gray-500">Require 2FA for all administrator accounts</p>
                    </div>
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => updateSetting("twoFactorAuth", checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="email" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtpServer">SMTP Server</Label>
                      <Input
                        id="smtpServer"
                        value={settings.smtpServer}
                        onChange={(e) => updateSetting("smtpServer", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input
                        id="smtpPort"
                        type="number"
                        value={settings.smtpPort}
                        onChange={(e) => updateSetting("smtpPort", Number.parseInt(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpUsername">SMTP Username</Label>
                      <Input
                        id="smtpUsername"
                        value={settings.smtpUsername}
                        onChange={(e) => updateSetting("smtpUsername", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpPassword">SMTP Password</Label>
                      <Input
                        id="smtpPassword"
                        type="password"
                        value={settings.smtpPassword}
                        onChange={(e) => updateSetting("smtpPassword", e.target.value)}
                        placeholder="Enter SMTP password"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Enable system email notifications</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => updateSetting("emailNotifications", checked)}
                    />
                  </div>

                  <Button variant="outline">Test Email Configuration</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="database" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Database Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="backupRetention">Backup Retention (days)</Label>
                      <Input
                        id="backupRetention"
                        type="number"
                        value={settings.backupRetention}
                        onChange={(e) => updateSetting("backupRetention", Number.parseInt(e.target.value))}
                        min="7"
                        max="365"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backupTime">Daily Backup Time</Label>
                      <Input
                        id="backupTime"
                        type="time"
                        value={settings.backupTime}
                        onChange={(e) => updateSetting("backupTime", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Automatic Backups</Label>
                      <p className="text-sm text-gray-500">Enable daily automatic database backups</p>
                    </div>
                    <Switch
                      checked={settings.autoBackup}
                      onCheckedChange={(checked) => updateSetting("autoBackup", checked)}
                    />
                  </div>

                  <Alert>
                    <Database className="h-4 w-4" />
                    <AlertDescription>
                      Database backups are stored securely and encrypted. Retention period affects storage usage.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>System Alerts</Label>
                        <p className="text-sm text-gray-500">Receive alerts for system errors and warnings</p>
                      </div>
                      <Switch
                        checked={settings.systemAlerts}
                        onCheckedChange={(checked) => updateSetting("systemAlerts", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>User Notifications</Label>
                        <p className="text-sm text-gray-500">Send notifications to users for important updates</p>
                      </div>
                      <Switch
                        checked={settings.userNotifications}
                        onCheckedChange={(checked) => updateSetting("userNotifications", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email Reports</Label>
                        <p className="text-sm text-gray-500">Send daily/weekly system reports via email</p>
                      </div>
                      <Switch
                        checked={settings.emailReports}
                        onCheckedChange={(checked) => updateSetting("emailReports", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end pt-6">
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Saving..." : "Save Settings"}
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
