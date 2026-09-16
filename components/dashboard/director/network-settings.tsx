"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Save,
  Laptop,
  Lock,
  Mail,
  Bell,
  Users,
  Globe,
  FileText,
  AlertTriangle,
  Download,
  Upload,
  BarChart4,
  BookOpen,
  Calendar,
  MessageSquare,
  User,
  Clock,
  UploadCloud,
  HelpCircle,
  Trash2,
  RefreshCw,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

export function NetworkSettings() {
  const [backupFrequency, setBackupFrequency] = useState(7)
  const [notificationLevel, setNotificationLevel] = useState(2)
  const [isTestEmailDialogOpen, setIsTestEmailDialogOpen] = useState(false)

  // Mock settings data
  const generalSettings = {
    networkName: "ShuleVerse Education Network",
    adminEmail: "admin@shuleverse.edu.tz",
    contactPhone: "+255 123 456 789",
    timezone: "Africa/Dar_es_Salaam",
    dateFormat: "DD/MM/YYYY",
    language: "en-US",
    fiscalYearStart: "January",
    academicYearStart: "September",
    termsPerYear: 3,
    lastUpdated: "2023-06-15T10:30:00Z",
  }

  const securitySettings = {
    passwordPolicy: {
      minLength: 10,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecial: true,
      expiryDays: 90,
    },
    twoFactorAuth: true,
    sessionTimeout: 30,
    loginAttempts: 5,
    ipRestriction: false,
    dataEncryption: "AES-256",
    lastSecurityAudit: "2023-05-28",
  }

  const notificationSettings = {
    emailNotifications: true,
    smsNotifications: true,
    appNotifications: true,
    notificationEvents: [
      { id: "event1", name: "Academic Reports", email: true, sms: true, app: true },
      { id: "event2", name: "Fee Reminders", email: true, sms: true, app: true },
      { id: "event3", name: "Staff Meetings", email: true, sms: false, app: true },
      { id: "event4", name: "System Updates", email: true, sms: false, app: true },
      { id: "event5", name: "Security Alerts", email: true, sms: true, app: true },
      { id: "event6", name: "Parent Messages", email: true, sms: true, app: true },
    ],
  }

  const integrationSettings = {
    emailService: {
      provider: "SMTP",
      server: "smtp.shuleverse.edu.tz",
      port: 587,
      username: "notifications@shuleverse.edu.tz",
      encryption: "TLS",
      status: "Connected",
    },
    smsService: {
      provider: "AfricasTalking",
      apiKey: "••••••••••••••••",
      senderId: "ShuleVerse",
      status: "Connected",
    },
    paymentGateways: [
      { id: "pay1", name: "M-Pesa", status: "Active", lastTransaction: "2023-06-12" },
      { id: "pay2", name: "Tigo Pesa", status: "Active", lastTransaction: "2023-06-10" },
      { id: "pay3", name: "Bank Transfer", status: "Active", lastTransaction: "2023-06-05" },
    ],
    backupService: {
      provider: "Google Drive",
      frequency: "Daily",
      retention: "30 days",
      lastBackup: "2023-06-15 02:00 AM",
      status: "Successful",
    },
  }

  const systemModules = [
    { id: "mod1", name: "Academic Management", status: "Enabled", icon: <BookOpen className="h-5 w-5" /> },
    { id: "mod2", name: "Student Records", status: "Enabled", icon: <Users className="h-5 w-5" /> },
    { id: "mod3", name: "Financial Management", status: "Enabled", icon: <BarChart4 className="h-5 w-5" /> },
    { id: "mod4", name: "Calendar & Events", status: "Enabled", icon: <Calendar className="h-5 w-5" /> },
    { id: "mod5", name: "Communication", status: "Enabled", icon: <MessageSquare className="h-5 w-5" /> },
    { id: "mod6", name: "Staff Management", status: "Enabled", icon: <User className="h-5 w-5" /> },
    { id: "mod7", name: "Reporting", status: "Enabled", icon: <FileText className="h-5 w-5" /> },
    { id: "mod8", name: "Attendance", status: "Enabled", icon: <Clock className="h-5 w-5" /> },
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Network Settings</CardTitle>
            <CardDescription>Configure system-wide settings for all schools</CardDescription>
          </div>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-6 mb-4">
            <TabsTrigger value="general">
              <Laptop className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="security">
              <Lock className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="integrations">
              <Globe className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Integrations</span>
            </TabsTrigger>
            <TabsTrigger value="modules">
              <BookOpen className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Modules</span>
            </TabsTrigger>
            <TabsTrigger value="backup">
              <UploadCloud className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Backup</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="network-name">Network Name</Label>
                    <Input
                      id="network-name"
                      defaultValue={generalSettings.networkName}
                      placeholder="Enter network name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Administrator Email</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      defaultValue={generalSettings.adminEmail}
                      placeholder="Enter admin email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact-phone">Contact Phone</Label>
                    <Input
                      id="contact-phone"
                      defaultValue={generalSettings.contactPhone}
                      placeholder="Enter contact phone"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue={generalSettings.timezone}>
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Africa/Dar_es_Salaam">East Africa Time (EAT)</SelectItem>
                        <SelectItem value="Africa/Lagos">West Africa Time (WAT)</SelectItem>
                        <SelectItem value="Africa/Cairo">Eastern European Time (EET)</SelectItem>
                        <SelectItem value="UTC">Coordinated Universal Time (UTC)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select defaultValue={generalSettings.dateFormat}>
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="language">System Language</Label>
                    <Select defaultValue={generalSettings.language}>
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en-US">English (US)</SelectItem>
                        <SelectItem value="en-GB">English (UK)</SelectItem>
                        <SelectItem value="sw">Swahili</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fiscal-year">Fiscal Year Start</Label>
                    <Select defaultValue={generalSettings.fiscalYearStart}>
                      <SelectTrigger id="fiscal-year">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="January">January</SelectItem>
                        <SelectItem value="July">July</SelectItem>
                        <SelectItem value="September">September</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="academic-year">Academic Year Start</Label>
                    <Select defaultValue={generalSettings.academicYearStart}>
                      <SelectTrigger id="academic-year">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="January">January</SelectItem>
                        <SelectItem value="June">June</SelectItem>
                        <SelectItem value="September">September</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="terms-per-year">Terms Per Academic Year</Label>
                <Select defaultValue={generalSettings.termsPerYear.toString()}>
                  <SelectTrigger id="terms-per-year">
                    <SelectValue placeholder="Select number of terms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 Terms</SelectItem>
                    <SelectItem value="3">3 Terms</SelectItem>
                    <SelectItem value="4">4 Terms</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted/50 p-4 rounded-md">
                <p className="text-sm text-muted-foreground">
                  Last updated: {new Date(generalSettings.lastUpdated).toLocaleString()}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Password Policy</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="min-length">Minimum Password Length</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="min-length"
                        type="number"
                        defaultValue={securitySettings.passwordPolicy.minLength}
                        min={8}
                        max={20}
                      />
                      <span className="text-sm text-muted-foreground">characters</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Password Requirements</Label>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="require-uppercase"
                        defaultChecked={securitySettings.passwordPolicy.requireUppercase}
                      />
                      <Label htmlFor="require-uppercase" className="font-normal">
                        Require uppercase letters
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        id="require-lowercase"
                        defaultChecked={securitySettings.passwordPolicy.requireLowercase}
                      />
                      <Label htmlFor="require-lowercase" className="font-normal">
                        Require lowercase letters
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="require-numbers" defaultChecked={securitySettings.passwordPolicy.requireNumbers} />
                      <Label htmlFor="require-numbers" className="font-normal">
                        Require numbers
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch id="require-special" defaultChecked={securitySettings.passwordPolicy.requireSpecial} />
                      <Label htmlFor="require-special" className="font-normal">
                        Require special characters
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password-expiry">Password Expiry</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="password-expiry"
                        type="number"
                        defaultValue={securitySettings.passwordPolicy.expiryDays}
                        min={30}
                        max={365}
                      />
                      <span className="text-sm text-muted-foreground">days</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-attempts">Maximum Login Attempts</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="login-attempts"
                        type="number"
                        defaultValue={securitySettings.loginAttempts}
                        min={3}
                        max={10}
                      />
                      <span className="text-sm text-muted-foreground">attempts</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="session-timeout"
                        type="number"
                        defaultValue={securitySettings.sessionTimeout}
                        min={5}
                        max={120}
                      />
                      <span className="text-sm text-muted-foreground">minutes</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Authentication</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <Label htmlFor="two-factor-auth" className="font-medium">
                        Two-Factor Authentication
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground ml-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Require two-factor authentication for all administrator accounts</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Enhance security by requiring a second verification method
                    </p>
                  </div>
                  <Switch id="two-factor-auth" defaultChecked={securitySettings.twoFactorAuth} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center">
                      <Label htmlFor="ip-restriction" className="font-medium">
                        IP Restriction
                      </Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-muted-foreground ml-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Restrict admin access to specific IP addresses</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <p className="text-sm text-muted-foreground">Limit access to the system based on IP addresses</p>
                  </div>
                  <Switch id="ip-restriction" defaultChecked={securitySettings.ipRestriction} />
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Last Security Audit</h4>
                    <p className="text-sm text-muted-foreground">
                      {new Date(securitySettings.lastSecurityAudit).toLocaleDateString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Run Security Audit
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h3 className="text-lg font-medium">Notification Channels</h3>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                    </div>
                    <Switch id="email-notifications" defaultChecked={notificationSettings.emailNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4" />
                      <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    </div>
                    <Switch id="sms-notifications" defaultChecked={notificationSettings.smsNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bell className="h-4 w-4" />
                      <Label htmlFor="app-notifications">In-App Notifications</Label>
                    </div>
                    <Switch id="app-notifications" defaultChecked={notificationSettings.appNotifications} />
                  </div>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <h3 className="text-lg font-medium">Notification Preferences</h3>
                  <p className="text-sm text-muted-foreground">
                    Control which notifications are sent through each channel
                  </p>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Event Type</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>SMS</TableHead>
                          <TableHead>In-App</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {notificationSettings.notificationEvents.map((event) => (
                          <TableRow key={event.id}>
                            <TableCell>{event.name}</TableCell>
                            <TableCell>
                              <Switch defaultChecked={event.email} />
                            </TableCell>
                            <TableCell>
                              <Switch defaultChecked={event.sms} />
                            </TableCell>
                            <TableCell>
                              <Switch defaultChecked={event.app} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Notification Level</h3>
                <p className="text-sm text-muted-foreground">Control the frequency and priority of notifications</p>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Notification Frequency</Label>
                    <span className="text-sm">
                      {notificationLevel === 1 ? "Low" : notificationLevel === 2 ? "Medium" : "High"}
                    </span>
                  </div>
                  <Slider
                    value={[notificationLevel]}
                    onValueChange={(value) => setNotificationLevel(value[0])}
                    max={3}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low (Critical Only)</span>
                    <span>Medium (Important)</span>
                    <span>High (All)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Test Notifications</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsTestEmailDialogOpen(true)}>
                    <Mail className="mr-2 h-4 w-4" />
                    Send Test Email
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Send Test SMS
                  </Button>
                </div>
              </div>
            </div>

            <Dialog open={isTestEmailDialogOpen} onOpenChange={setIsTestEmailDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Send Test Email</DialogTitle>
                  <DialogDescription>Send a test email to verify your email configuration.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="test-email">Email Address</Label>
                    <Input id="test-email" type="email" placeholder="Enter email address" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="test-subject">Subject</Label>
                    <Input id="test-subject" defaultValue="ShuleVerse Test Email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="test-message">Message</Label>
                    <Textarea id="test-message" defaultValue="This is a test email from ShuleVerse system." rows={3} />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsTestEmailDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsTestEmailDialogOpen(false)}>Send Test Email</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="integrations">
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Service Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-provider">Email Provider</Label>
                    <Select defaultValue={integrationSettings.emailService.provider}>
                      <SelectTrigger id="email-provider">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SMTP">SMTP Server</SelectItem>
                        <SelectItem value="SendGrid">SendGrid</SelectItem>
                        <SelectItem value="Mailgun">Mailgun</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtp-server">SMTP Server</Label>
                    <Input
                      id="smtp-server"
                      defaultValue={integrationSettings.emailService.server}
                      placeholder="mail.example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">Port</Label>
                    <Input
                      id="smtp-port"
                      type="number"
                      defaultValue={integrationSettings.emailService.port}
                      placeholder="587"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtp-encryption">Encryption</Label>
                    <Select defaultValue={integrationSettings.emailService.encryption}>
                      <SelectTrigger id="smtp-encryption">
                        <SelectValue placeholder="Select encryption" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="None">None</SelectItem>
                        <SelectItem value="SSL">SSL</SelectItem>
                        <SelectItem value="TLS">TLS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtp-username">Username</Label>
                    <Input
                      id="smtp-username"
                      defaultValue={integrationSettings.emailService.username}
                      placeholder="username@example.com"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">Password</Label>
                    <Input id="smtp-password" type="password" placeholder="••••••••••••" />
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {integrationSettings.emailService.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">Last tested: Today, 09:45 AM</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Test Connection
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">SMS Service Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sms-provider">SMS Provider</Label>
                    <Select defaultValue={integrationSettings.smsService.provider}>
                      <SelectTrigger id="sms-provider">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AfricasTalking">Africa's Talking</SelectItem>
                        <SelectItem value="Twilio">Twilio</SelectItem>
                        <SelectItem value="Vonage">Vonage</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sms-api-key">API Key</Label>
                    <Input
                      id="sms-api-key"
                      type="password"
                      defaultValue="••••••••••••••••"
                      placeholder="Enter API Key"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sms-sender-id">Sender ID</Label>
                    <Input
                      id="sms-sender-id"
                      defaultValue={integrationSettings.smsService.senderId}
                      placeholder="Your sender ID"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-muted/50 rounded-md">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      {integrationSettings.smsService.status}
                    </Badge>
                    <span className="text-sm text-muted-foreground">Balance: 5,230 SMS credits</span>
                  </div>
                  <Button variant="outline" size="sm">
                    Test SMS
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Gateways</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Provider</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Transaction</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {integrationSettings.paymentGateways.map((gateway) => (
                        <TableRow key={gateway.id}>
                          <TableCell className="font-medium">{gateway.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {gateway.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{gateway.lastTransaction}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              Configure
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Button variant="outline">
                  <Globe className="mr-2 h-4 w-4" />
                  Add Payment Gateway
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="modules">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">System Modules</h3>
              <p className="text-sm text-muted-foreground">
                Configure which modules are available across all schools in the network
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {systemModules.map((module) => (
                  <Card key={module.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="bg-primary/10 p-2 rounded-md">{module.icon}</div>
                          <CardTitle className="text-lg">{module.name}</CardTitle>
                        </div>
                        <Switch defaultChecked={module.status === "Enabled"} />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <Badge
                          variant="outline"
                          className={
                            module.status === "Enabled"
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }
                        >
                          {module.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="bg-muted/50 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">Module Permissions</h4>
                    <p className="text-sm text-muted-foreground">Configure role-based access to modules</p>
                  </div>
                  <Button variant="outline">Manage Permissions</Button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="backup">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Backup Settings</h3>

                  <div className="space-y-2">
                    <Label htmlFor="backup-provider">Backup Provider</Label>
                    <Select defaultValue={integrationSettings.backupService.provider}>
                      <SelectTrigger id="backup-provider">
                        <SelectValue placeholder="Select provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Google Drive">Google Drive</SelectItem>
                        <SelectItem value="Dropbox">Dropbox</SelectItem>
                        <SelectItem value="OneDrive">OneDrive</SelectItem>
                        <SelectItem value="AWS S3">AWS S3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Backup Frequency</Label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={backupFrequency === 1 ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setBackupFrequency(1)}
                      >
                        Daily
                      </Button>
                      <Button
                        variant={backupFrequency === 7 ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setBackupFrequency(7)}
                      >
                        Weekly
                      </Button>
                      <Button
                        variant={backupFrequency === 30 ? "default" : "outline"}
                        className="w-full"
                        onClick={() => setBackupFrequency(30)}
                      >
                        Monthly
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backup-retention">Backup Retention Period</Label>
                    <Select defaultValue="30">
                      <SelectTrigger id="backup-retention">
                        <SelectValue placeholder="Select retention period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="365">1 year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-backup">Automatic Backups</Label>
                      <Switch id="auto-backup" defaultChecked />
                    </div>
                    <p className="text-xs text-muted-foreground">Enable or disable scheduled automatic backups</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Manual Backup & Restore</h3>

                  <div className="space-y-3">
                    <div className="bg-muted/50 p-4 rounded-md">
                      <h4 className="font-medium">Last Backup</h4>
                      <div className="flex justify-between mt-2">
                        <div className="text-sm">
                          <p className="font-medium">{integrationSettings.backupService.lastBackup}</p>
                          <p className="text-muted-foreground">
                            Status: <span className="text-green-600">{integrationSettings.backupService.status}</span>
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          View Backups
                        </Button>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Backup Now
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <Upload className="mr-2 h-4 w-4" />
                        Restore Backup
                      </Button>
                    </div>

                    <div className="rounded-md border p-4">
                      <h4 className="font-medium mb-2">Database Restore</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Upload a previous backup file to restore the system
                      </p>

                      <div className="border-2 border-dashed rounded-md p-6 text-center">
                        <UploadCloud className="h-8 w-8 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-sm font-medium">
                          Drag and drop backup file, or <span className="text-primary">browse</span>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">Supported formats: .zip, .sql, .tar.gz</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0 md:space-x-4">
                <div className="flex-1">
                  <Button className="w-full" variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    System Reset
                  </Button>
                </div>

                <div className="flex-1">
                  <Button className="w-full" variant="outline">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete All Data
                  </Button>
                </div>

                <div className="flex-1">
                  <Button className="w-full">
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </Button>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800">Important Notice</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      System resets and data deletion are irreversible actions. Please ensure you have a recent backup
                      before proceeding with these operations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
