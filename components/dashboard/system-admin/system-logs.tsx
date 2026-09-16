"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, AlertCircle, CheckCircle, XCircle, Info } from "lucide-react"

const mockLogs = [
  {
    id: 1,
    timestamp: "2024-01-15 10:30:25",
    level: "INFO",
    category: "Authentication",
    message: "User login successful: john.doe@email.com",
    source: "auth-service",
  },
  {
    id: 2,
    timestamp: "2024-01-15 10:28:15",
    level: "ERROR",
    category: "Database",
    message: "Connection timeout to primary database",
    source: "db-connector",
  },
  {
    id: 3,
    timestamp: "2024-01-15 10:25:10",
    level: "WARNING",
    category: "Security",
    message: "Multiple failed login attempts detected",
    source: "security-monitor",
  },
  {
    id: 4,
    timestamp: "2024-01-15 10:20:05",
    level: "INFO",
    category: "System",
    message: "Scheduled backup completed successfully",
    source: "backup-service",
  },
  {
    id: 5,
    timestamp: "2024-01-15 10:15:30",
    level: "ERROR",
    category: "API",
    message: "External service API rate limit exceeded",
    source: "api-gateway",
  },
]

export function SystemLogs() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedLevel, setSelectedLevel] = useState("ALL")

  const filteredLogs = mockLogs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === "ALL" || log.level === selectedLevel
    return matchesSearch && matchesLevel
  })

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "ERROR":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "WARNING":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "INFO":
        return <Info className="h-4 w-4 text-blue-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case "ERROR":
        return "destructive"
      case "WARNING":
        return "secondary"
      case "INFO":
        return "default"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            System Logs
          </CardTitle>
          <CardDescription>Monitor system activities, errors, and security events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedLevel === "ALL" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel("ALL")}
              >
                All
              </Button>
              <Button
                variant={selectedLevel === "ERROR" ? "destructive" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel("ERROR")}
              >
                Errors
              </Button>
              <Button
                variant={selectedLevel === "WARNING" ? "secondary" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel("WARNING")}
              >
                Warnings
              </Button>
              <Button
                variant={selectedLevel === "INFO" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLevel("INFO")}
              >
                Info
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Source</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm">{log.timestamp}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getLevelIcon(log.level)}
                        <Badge variant={getLevelBadgeVariant(log.level) as any}>{log.level}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.category}</Badge>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="truncate" title={log.message}>
                        {log.message}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">{log.source}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
