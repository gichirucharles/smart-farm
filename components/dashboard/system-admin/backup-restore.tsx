"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Database, Download, Upload, Calendar, CheckCircle, AlertCircle, Clock, HardDrive } from "lucide-react"

const mockBackups = [
  {
    id: 1,
    name: "daily-backup-2024-01-15",
    type: "Automatic",
    size: "2.4 GB",
    date: "2024-01-15 02:00:00",
    status: "Completed",
    duration: "45 minutes",
  },
  {
    id: 2,
    name: "manual-backup-2024-01-14",
    type: "Manual",
    size: "2.3 GB",
    date: "2024-01-14 14:30:00",
    status: "Completed",
    duration: "38 minutes",
  },
  {
    id: 3,
    name: "weekly-backup-2024-01-08",
    type: "Automatic",
    size: "2.1 GB",
    date: "2024-01-08 02:00:00",
    status: "Completed",
    duration: "52 minutes",
  },
]

export function BackupRestore() {
  const [isBackingUp, setIsBackingUp] = useState(false)
  const [backupProgress, setBackupProgress] = useState(0)
  const [isRestoring, setIsRestoring] = useState(false)

  const handleCreateBackup = async () => {
    setIsBackingUp(true)
    setBackupProgress(0)

    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsBackingUp(false)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const handleRestore = async (backupId: number) => {
    if (confirm("Are you sure you want to restore from this backup? This action cannot be undone.")) {
      setIsRestoring(true)
      // Simulate restore process
      setTimeout(() => {
        setIsRestoring(false)
        alert("Backup restored successfully!")
      }, 3000)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case "In Progress":
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
      case "Failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Backup Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Create Backup
            </CardTitle>
            <CardDescription>Create a manual backup of the entire system</CardDescription>
          </CardHeader>
          <CardContent>
            {isBackingUp ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Creating backup...</span>
                </div>
                <Progress value={backupProgress} className="w-full" />
                <p className="text-sm text-gray-500">{backupProgress}% complete</p>
              </div>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    This will create a complete backup of all system data including databases, user files, and
                    configuration settings.
                  </AlertDescription>
                </Alert>
                <Button onClick={handleCreateBackup} className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Create Manual Backup
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Backup
            </CardTitle>
            <CardDescription>Upload and restore from an external backup file</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Only upload backup files created by this system. Restoring will overwrite all current data.
                </AlertDescription>
              </Alert>
              <Button variant="outline" className="w-full bg-transparent" disabled={isRestoring}>
                <Upload className="h-4 w-4 mr-2" />
                {isRestoring ? "Restoring..." : "Upload Backup File"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HardDrive className="h-5 w-5" />
            Backup History
          </CardTitle>
          <CardDescription>View and manage existing backups</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Backup Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Date Created</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBackups.map((backup) => (
                <TableRow key={backup.id}>
                  <TableCell className="font-medium">{backup.name}</TableCell>
                  <TableCell>
                    <Badge variant={backup.type === "Automatic" ? "default" : "secondary"}>{backup.type}</Badge>
                  </TableCell>
                  <TableCell>{backup.size}</TableCell>
                  <TableCell className="font-mono text-sm">{backup.date}</TableCell>
                  <TableCell>{getStatusBadge(backup.status)}</TableCell>
                  <TableCell className="text-sm text-gray-500">{backup.duration}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRestore(backup.id)}
                        disabled={isRestoring}
                      >
                        Restore
                      </Button>
                      <Button size="sm" variant="outline">
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Backup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Backup Schedule
          </CardTitle>
          <CardDescription>Configure automatic backup settings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Daily Backups</h4>
              <p className="text-sm text-gray-500">Every day at 2:00 AM</p>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Enabled
              </Badge>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Weekly Backups</h4>
              <p className="text-sm text-gray-500">Every Sunday at 1:00 AM</p>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Enabled
              </Badge>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">Monthly Backups</h4>
              <p className="text-sm text-gray-500">1st of every month</p>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Enabled
              </Badge>
            </div>
          </div>
          <div className="mt-6">
            <Button variant="outline">Configure Schedule</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
