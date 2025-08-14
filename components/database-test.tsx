"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Database,
  Users,
  Settings,
  Play,
  ExternalLink,
} from "lucide-react"
import { testDatabaseConnection } from "@/lib/actions/patients"
import { getPatientCases, getPatientTemplates, getModuleDefinitions } from "@/lib/actions/modular-patients"

interface DatabaseStatus {
  connection: { success: boolean; message: string; details?: any }
  patientCases: { count: number; error?: string }
  templates: { count: number; error?: string }
  modules: { count: number; error?: string }
  lastChecked: Date
}

export default function DatabaseTest() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    runDatabaseTest()
  }, [])

  const runDatabaseTest = async () => {
    setIsLoading(true)
    try {
      // Test database connection
      const connectionResult = await testDatabaseConnection()

      // Test modular data access
      const [casesResult, templatesResult, modulesResult] = await Promise.allSettled([
        getPatientCases(),
        getPatientTemplates(),
        getModuleDefinitions(),
      ])

      const newStatus: DatabaseStatus = {
        connection: connectionResult,
        patientCases: {
          count: casesResult.status === "fulfilled" ? casesResult.value.length : 0,
          error: casesResult.status === "rejected" ? String(casesResult.reason) : undefined,
        },
        templates: {
          count: templatesResult.status === "fulfilled" ? templatesResult.value.length : 0,
          error: templatesResult.status === "rejected" ? String(templatesResult.reason) : undefined,
        },
        modules: {
          count: modulesResult.status === "fulfilled" ? modulesResult.value.length : 0,
          error: modulesResult.status === "rejected" ? String(modulesResult.reason) : undefined,
        },
        lastChecked: new Date(),
      }

      setStatus(newStatus)
    } catch (error) {
      console.error("Database test failed:", error)
      setStatus({
        connection: { success: false, message: "Test failed", details: error },
        patientCases: { count: 0, error: String(error) },
        templates: { count: 0, error: String(error) },
        modules: { count: 0, error: String(error) },
        lastChecked: new Date(),
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (success: boolean, hasError?: boolean) => {
    if (hasError) return <XCircle className="h-4 w-4 text-red-500" />
    if (success) return <CheckCircle className="h-4 w-4 text-green-500" />
    return <AlertCircle className="h-4 w-4 text-yellow-500" />
  }

  const getStatusColor = (success: boolean, hasError?: boolean) => {
    if (hasError) return "border-red-200 bg-red-50"
    if (success) return "border-green-200 bg-green-50"
    return "border-yellow-200 bg-yellow-50"
  }

  const isSystemHealthy =
    status &&
    status.connection.success &&
    !status.patientCases.error &&
    !status.templates.error &&
    !status.modules.error

  return (
    <Card
      className={`rounded-organic-xl transition-all duration-300 ${
        status ? getStatusColor(isSystemHealthy || false) : "border-sage-200 bg-sage-50"
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`p-2 rounded-organic-md ${
                isSystemHealthy ? "bg-green-100" : status?.connection.success === false ? "bg-red-100" : "bg-yellow-100"
              }`}
            >
              <Database
                className={`h-5 w-5 ${
                  isSystemHealthy
                    ? "text-green-600"
                    : status?.connection.success === false
                      ? "text-red-600"
                      : "text-yellow-600"
                }`}
              />
            </div>
            <div>
              <CardTitle className="text-lg font-medium text-sage-900">Modular Database System</CardTitle>
              <p className="text-sm text-sage-600 mt-1">
                {status
                  ? isSystemHealthy
                    ? "All systems operational"
                    : "Issues detected - check details below"
                  : "Checking database connectivity..."}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {status && (
              <Badge variant={isSystemHealthy ? "default" : "destructive"} className="text-xs">
                {isSystemHealthy ? "Healthy" : "Issues"}
              </Badge>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={runDatabaseTest}
              disabled={isLoading}
              className="rounded-organic-md bg-transparent"
            >
              {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Connection Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-organic-lg border border-sage-100">
            {getStatusIcon(status?.connection.success || false)}
            <div>
              <p className="text-sm font-medium text-sage-900">Connection</p>
              <p className="text-xs text-sage-600">{status?.connection.success ? "Connected" : "Failed"}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-organic-lg border border-sage-100">
            {getStatusIcon(true, !!status?.patientCases.error)}
            <div>
              <p className="text-sm font-medium text-sage-900">Patient Cases</p>
              <p className="text-xs text-sage-600">{status?.patientCases.count || 0} cases</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-organic-lg border border-sage-100">
            {getStatusIcon(true, !!status?.templates.error)}
            <div>
              <p className="text-sm font-medium text-sage-900">Templates</p>
              <p className="text-xs text-sage-600">{status?.templates.count || 0} templates</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-white/60 rounded-organic-lg border border-sage-100">
            {getStatusIcon(true, !!status?.modules.error)}
            <div>
              <p className="text-sm font-medium text-sage-900">Modules</p>
              <p className="text-xs text-sage-600">{status?.modules.count || 0} modules</p>
            </div>
          </div>
        </div>

        {/* System Status Summary */}
        {status && (
          <div className="p-4 bg-white/80 rounded-organic-lg border border-sage-100">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-sage-900">System Status</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs text-sage-600"
              >
                {showDetails ? "Hide Details" : "Show Details"}
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-sage-600">Database Architecture:</span>
                <Badge variant="outline" className="text-xs">
                  Modular System
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-sage-600">Last Checked:</span>
                <span className="text-sage-900 text-xs">{status.lastChecked.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-sage-600">System Health:</span>
                <Badge variant={isSystemHealthy ? "default" : "destructive"} className="text-xs">
                  {isSystemHealthy ? "All Systems Go" : "Needs Attention"}
                </Badge>
              </div>
            </div>

            {showDetails && (
              <div className="mt-4 pt-4 border-t border-sage-100 space-y-3">
                <div className="text-xs text-sage-600">
                  <strong>Connection Details:</strong>
                  <pre className="mt-1 p-2 bg-sage-50 rounded text-xs overflow-auto">
                    {JSON.stringify(status.connection.details, null, 2)}
                  </pre>
                </div>

                {(status.patientCases.error || status.templates.error || status.modules.error) && (
                  <div className="text-xs text-red-600">
                    <strong>Errors:</strong>
                    <ul className="mt-1 space-y-1">
                      {status.patientCases.error && <li>• Patient Cases: {status.patientCases.error}</li>}
                      {status.templates.error && <li>• Templates: {status.templates.error}</li>}
                      {status.modules.error && <li>• Modules: {status.modules.error}</li>}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-sage-100">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("/admin/patient-architecture", "_blank")}
              className="text-xs rounded-organic-md"
            >
              <Settings className="h-3 w-3 mr-1" />
              Configure Modules
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open("/admin/all-cases", "_blank")}
              className="text-xs rounded-organic-md"
            >
              <Users className="h-3 w-3 mr-1" />
              Manage Cases
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          </div>

          {isSystemHealthy && (
            <Button
              size="sm"
              onClick={() => window.open("/admin/chat-interface", "_blank")}
              className="bg-sage-600 hover:bg-sage-700 text-white text-xs rounded-organic-md"
            >
              <Play className="h-3 w-3 mr-1" />
              Start Session
              <ExternalLink className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>

        {/* Migration Notice */}
        {!isSystemHealthy && status?.connection.success && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-organic-lg">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Migration Required</p>
                <p className="text-xs text-blue-700 mt-1">
                  Run the complete modular migration script to set up all required tables and data.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
