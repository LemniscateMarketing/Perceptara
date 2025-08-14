"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, RefreshCw, Database, AlertTriangle } from "lucide-react"
import { testDatabaseConnection } from "@/lib/actions/patients"
import { getPatientCases, getPatientTemplates, getModuleDefinitions } from "@/lib/actions/modular-patients"

interface TestResult {
  name: string
  status: "success" | "error" | "pending"
  message: string
  details?: any
}

export default function DatabaseTestPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Database Connection", status: "pending", message: "Testing..." },
    { name: "Patient Cases Table", status: "pending", message: "Testing..." },
    { name: "Patient Templates Table", status: "pending", message: "Testing..." },
    { name: "Module Definitions Table", status: "pending", message: "Testing..." },
  ])
  const [isRunning, setIsRunning] = useState(false)

  const runTests = async () => {
    setIsRunning(true)
    const newTests: TestResult[] = []

    try {
      // Test 1: Database Connection
      console.log("🔍 Testing database connection...")
      const dbTest = await testDatabaseConnection()
      newTests.push({
        name: "Database Connection",
        status: dbTest.success ? "success" : "error",
        message: dbTest.message,
        details: dbTest.details,
      })

      if (dbTest.success) {
        // Test 2: Patient Cases
        try {
          console.log("🔍 Testing patient cases table...")
          const cases = await getPatientCases()
          newTests.push({
            name: "Patient Cases Table",
            status: "success",
            message: `Found ${cases.length} patient cases`,
            details: { count: cases.length },
          })
        } catch (error) {
          newTests.push({
            name: "Patient Cases Table",
            status: "error",
            message: `Error: ${error}`,
            details: error,
          })
        }

        // Test 3: Patient Templates
        try {
          console.log("🔍 Testing patient templates table...")
          const templates = await getPatientTemplates()
          newTests.push({
            name: "Patient Templates Table",
            status: "success",
            message: `Found ${templates.length} templates`,
            details: { count: templates.length },
          })
        } catch (error) {
          newTests.push({
            name: "Patient Templates Table",
            status: "error",
            message: `Error: ${error}`,
            details: error,
          })
        }

        // Test 4: Module Definitions
        try {
          console.log("🔍 Testing module definitions table...")
          const modules = await getModuleDefinitions()
          newTests.push({
            name: "Module Definitions Table",
            status: "success",
            message: `Found ${modules.length} modules`,
            details: { count: modules.length },
          })
        } catch (error) {
          newTests.push({
            name: "Module Definitions Table",
            status: "error",
            message: `Error: ${error}`,
            details: error,
          })
        }
      } else {
        // If database connection failed, mark other tests as error
        newTests.push(
          {
            name: "Patient Cases Table",
            status: "error",
            message: "Cannot test - database connection failed",
          },
          {
            name: "Patient Templates Table",
            status: "error",
            message: "Cannot test - database connection failed",
          },
          {
            name: "Module Definitions Table",
            status: "error",
            message: "Cannot test - database connection failed",
          },
        )
      }
    } catch (error) {
      console.error("❌ Test suite failed:", error)
      newTests.push({
        name: "Test Suite",
        status: "error",
        message: `Test suite failed: ${error}`,
        details: error,
      })
    }

    setTests(newTests)
    setIsRunning(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  const allTestsPassed = tests.every((test) => test.status === "success")
  const hasErrors = tests.some((test) => test.status === "error")

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-sage-900">Database Connection Test</h1>
          <p className="text-sage-600 mt-2">Verify database connectivity and table access</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant={allTestsPassed ? "default" : hasErrors ? "destructive" : "secondary"}>
            {isRunning ? "Testing..." : allTestsPassed ? "All Tests Passed" : hasErrors ? "Tests Failed" : "Unknown"}
          </Badge>
          <Button
            onClick={runTests}
            disabled={isRunning}
            className="bg-sage-600 hover:bg-sage-700 text-white rounded-organic-md"
          >
            {isRunning ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Run Tests
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card
        className={`rounded-organic-xl ${allTestsPassed ? "border-green-200 bg-green-50" : hasErrors ? "border-red-200 bg-red-50" : "border-yellow-200 bg-yellow-50"}`}
      >
        <CardContent className="p-6">
          <div className="flex items-center space-x-3">
            {allTestsPassed ? (
              <CheckCircle className="h-6 w-6 text-green-600" />
            ) : hasErrors ? (
              <XCircle className="h-6 w-6 text-red-600" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            )}
            <div>
              <h3 className="text-lg font-semibold">
                {allTestsPassed
                  ? "Database System Operational"
                  : hasErrors
                    ? "Database Issues Detected"
                    : "Testing in Progress"}
              </h3>
              <p className="text-sm text-sage-600">
                {allTestsPassed
                  ? "All database connections and tables are working correctly"
                  : hasErrors
                    ? "Some database tests failed - check details below"
                    : "Running connectivity tests..."}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map((test, index) => (
          <Card key={index} className="rounded-organic-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base">
                {test.status === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : test.status === "error" ? (
                  <XCircle className="h-4 w-4 text-red-500" />
                ) : (
                  <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />
                )}
                <span>{test.name}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-sage-600 mb-2">{test.message}</p>
              {test.details && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-sage-500 hover:text-sage-700">Show Details</summary>
                  <pre className="mt-2 p-2 bg-sage-50 rounded text-xs overflow-auto">
                    {JSON.stringify(test.details, null, 2)}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Actions */}
      <Card className="rounded-organic-xl">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5" />
            <span>Next Steps</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {allTestsPassed ? (
            <div className="space-y-2">
              <p className="text-sm text-sage-600">✅ Database is ready! You can now:</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("/", "_blank")}
                  className="rounded-organic-md bg-transparent"
                >
                  Go to Dashboard
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("/admin/all-cases", "_blank")}
                  className="rounded-organic-md bg-transparent"
                >
                  Manage Patient Cases
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("/admin/chat-interface", "_blank")}
                  className="rounded-organic-md bg-transparent"
                >
                  Test Chat Interface
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-sage-600">❌ Database setup required. Try:</p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("/admin/database-setup", "_blank")}
                  className="rounded-organic-md bg-transparent"
                >
                  Database Setup
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open("/admin/patient-architecture", "_blank")}
                  className="rounded-organic-md bg-transparent"
                >
                  Configure Modules
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
