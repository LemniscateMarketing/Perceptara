"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Clock, TrendingUp, Database, AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { getPatientsLegacyFormat, testDatabaseConnection } from "@/lib/actions/patients"
import type { Patient } from "@/lib/actions/patients"

interface DashboardStats {
  totalPatients: number
  activeSessions: number
  completedSessions: number
  avgSessionTime: string
}

interface DatabaseStatus {
  connected: boolean
  message: string
  details?: any
}

export default function Dashboard() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    activeSessions: 0,
    completedSessions: 0,
    avgSessionTime: "0 min",
  })
  const [dbStatus, setDbStatus] = useState<DatabaseStatus>({
    connected: false,
    message: "Checking connection...",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadDashboardData = async () => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("🔄 Loading dashboard data...")

      // Test database connection first
      const connectionTest = await testDatabaseConnection()
      console.log("📊 Database connection test:", connectionTest)
      setDbStatus({
        connected: connectionTest.success,
        message: connectionTest.message,
        details: connectionTest.details,
      })

      if (!connectionTest.success) {
        setError(`Database connection failed: ${connectionTest.message}`)
        return
      }

      // Load patients
      const patientsData = await getPatientsLegacyFormat()
      console.log("👥 Loaded patients:", patientsData.length)
      setPatients(patientsData)

      // Calculate stats
      const totalPatients = patientsData.length
      const activeSessions = patientsData.filter((p) => p.status === "active").length
      const completedSessions = patientsData.reduce((sum, p) => sum + (p.session_count || 0), 0)

      setStats({
        totalPatients,
        activeSessions,
        completedSessions,
        avgSessionTime: "25 min", // Simulated average
      })

      console.log("✅ Dashboard data loaded successfully")
    } catch (err) {
      console.error("❌ Error loading dashboard data:", err)
      setError(`Failed to load dashboard data: ${err}`)
      setDbStatus({
        connected: false,
        message: "Connection error",
        details: err,
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-50 to-warm-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="flex items-center space-x-3">
              <RefreshCw className="h-6 w-6 animate-spin text-sage-600" />
              <p className="text-sage-600">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-warm-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-sage-900">Psychology Simulation Dashboard</h1>
            <p className="text-sage-600 mt-2">Manage your therapeutic training sessions</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {dbStatus.connected ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-500" />
              )}
              <span className="text-sm text-sage-600">
                {dbStatus.connected ? "Database Connected" : "Database Disconnected"}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={loadDashboardData}
              className="rounded-organic-md bg-transparent"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Database Status Alert */}
        {!dbStatus.connected && (
          <Card className="border-red-200 bg-red-50 rounded-organic-xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Database Connection Issue</p>
                  <p className="text-sm text-red-700">{dbStatus.message}</p>
                  <p className="text-xs text-red-600 mt-1">
                    Please check your database configuration or run the setup scripts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Alert */}
        {error && (
          <Card className="border-red-200 bg-red-50 rounded-organic-xl">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Error Loading Data</p>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-organic-xl border-sage-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-sage-700">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-sage-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sage-900">{stats.totalPatients}</div>
              <p className="text-xs text-sage-600">Available for sessions</p>
            </CardContent>
          </Card>

          <Card className="rounded-organic-xl border-sage-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-sage-700">Active Sessions</CardTitle>
              <Clock className="h-4 w-4 text-sage-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sage-900">{stats.activeSessions}</div>
              <p className="text-xs text-sage-600">Currently in progress</p>
            </CardContent>
          </Card>

          <Card className="rounded-organic-xl border-sage-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-sage-700">Completed Sessions</CardTitle>
              <TrendingUp className="h-4 w-4 text-sage-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sage-900">{stats.completedSessions}</div>
              <p className="text-xs text-sage-600">Total sessions completed</p>
            </CardContent>
          </Card>

          <Card className="rounded-organic-xl border-sage-200 bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-sage-700">Avg Session Time</CardTitle>
              <Clock className="h-4 w-4 text-sage-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-sage-900">{stats.avgSessionTime}</div>
              <p className="text-xs text-sage-600">Per session</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Patients */}
        <Card className="rounded-organic-xl border-sage-200 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-sage-900">Recent Patients</CardTitle>
            <p className="text-sm text-sage-600">Select a patient to start a new session</p>
          </CardHeader>
          <CardContent>
            {patients.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-sage-400 mx-auto mb-4" />
                <p className="text-sage-600">No patients available</p>
                <p className="text-sm text-sage-500 mt-1">
                  {dbStatus.connected
                    ? "Create some patient cases to get started"
                    : "Please check your database connection"}
                </p>
                <Button
                  variant="outline"
                  className="mt-4 rounded-organic-md bg-transparent"
                  onClick={() => window.open("/admin/all-cases", "_blank")}
                >
                  Manage Patient Cases
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {patients.slice(0, 6).map((patient) => (
                  <Card
                    key={patient.id}
                    className="rounded-organic-lg border-sage-100 hover:border-sage-300 transition-all duration-200 cursor-pointer hover:shadow-md"
                    onClick={() => window.open(`/simulation?patient=${patient.id}`, "_blank")}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                          <AvatarFallback className="bg-sage-100 text-sage-700">
                            {patient.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sage-900 truncate">{patient.name}</p>
                          <p className="text-sm text-sage-600">Age {patient.age}</p>
                          <p className="text-xs text-sage-500 truncate mt-1">{patient.primaryConcern}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {patient.session_count || 0} sessions
                        </Badge>
                        <Badge variant={patient.status === "active" ? "default" : "secondary"} className="text-xs">
                          {patient.status || "ready"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="rounded-organic-xl border-sage-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base font-medium text-sage-900">Start New Session</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-sage-600 mb-4">Begin a therapeutic simulation with an AI patient</p>
              <Button
                className="w-full bg-sage-600 hover:bg-sage-700 text-white rounded-organic-md"
                onClick={() => window.open("/simulation", "_blank")}
                disabled={!dbStatus.connected}
              >
                Start Session
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-organic-xl border-sage-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base font-medium text-sage-900">Manage Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-sage-600 mb-4">Create and manage patient cases</p>
              <Button
                variant="outline"
                className="w-full rounded-organic-md bg-transparent"
                onClick={() => window.open("/admin/all-cases", "_blank")}
              >
                Manage Cases
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-organic-xl border-sage-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base font-medium text-sage-900">System Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-sage-600 mb-4">Configure AI models and system settings</p>
              <Button
                variant="outline"
                className="w-full rounded-organic-md bg-transparent"
                onClick={() => window.open("/admin/settings", "_blank")}
              >
                Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Database Status Details */}
        {dbStatus.details && (
          <Card className="rounded-organic-xl border-sage-200 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-base font-medium text-sage-900 flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Database Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-sage-50 p-3 rounded-organic-md overflow-auto">
                {JSON.stringify(dbStatus.details, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
