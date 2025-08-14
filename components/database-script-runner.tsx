"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Loader2, CheckCircle, AlertCircle, Database, Zap, RefreshCw } from "lucide-react"
import { setupDatabaseDirectly } from "@/lib/actions/simple-patients"

export function DatabaseScriptRunner() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const runSetup = async () => {
    setIsRunning(true)
    setError(null)
    setResults(null)

    try {
      console.log("🚀 Starting direct database setup...")
      const result = await setupDatabaseDirectly()

      if (result.success) {
        setResults(result)
        console.log("✅ Setup completed:", result)
      } else {
        setError(result.message)
        console.error("❌ Setup failed:", result.message)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(errorMessage)
      console.error("❌ Setup error:", err)
    } finally {
      setIsRunning(false)
    }
  }

  const resetAndRun = async () => {
    setResults(null)
    setError(null)
    await runSetup()
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-sage-600" />
            <span>Database Setup Runner</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Button onClick={runSetup} disabled={isRunning} className="bg-sage-600 hover:bg-sage-700 text-white">
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Running Setup...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Run Database Setup
                </>
              )}
            </Button>

            {(results || error) && (
              <Button onClick={resetAndRun} disabled={isRunning} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset & Run Again
              </Button>
            )}
          </div>

          <div className="text-sm text-sage-600">
            This will:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Clear existing module settings</li>
              <li>Insert default module configurations</li>
              <li>Create a test patient case</li>
              <li>Verify the database is working</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      {results && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              <span>Setup Successful!</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-green-700">{results.message}</p>

              {results.results && results.results.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium text-green-800">Patient Cases in Database:</h4>
                  {results.results.map((case_: any, index: number) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{case_.case_name}</div>
                          <div className="text-sm text-gray-600">{case_.case_summary}</div>
                          <div className="text-xs text-gray-400">
                            ID: {case_.id} | Created: {new Date(case_.created_at).toLocaleString()}
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-100 text-green-700">
                          {case_.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2">
                <Badge variant="outline" className="bg-green-100 text-green-700">
                  <Zap className="h-3 w-3 mr-1" />
                  Database Ready
                </Badge>
                <Badge variant="outline" className="bg-blue-100 text-blue-700">
                  Module Settings OK
                </Badge>
                <Badge variant="outline" className="bg-purple-100 text-purple-700">
                  Test Data Created
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <span>Setup Failed</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-red-700">{error}</p>

              <div className="bg-white p-3 rounded border">
                <h4 className="font-medium text-red-800 mb-2">Troubleshooting:</h4>
                <ul className="text-sm text-red-700 space-y-1">
                  <li>• Check if Supabase connection is working</li>
                  <li>• Verify database permissions</li>
                  <li>• Make sure tables exist (patient_cases, module_settings)</li>
                  <li>• Check browser console for detailed errors</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* What This Does */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-sage-700">What This Setup Does</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-sage-600 space-y-2">
            <p>
              <strong>1. Module Settings:</strong> Configures which patient modules are enabled
            </p>
            <p>
              <strong>2. Test Case:</strong> Creates a sample patient case to verify everything works
            </p>
            <p>
              <strong>3. Verification:</strong> Checks that data can be inserted and retrieved
            </p>
            <p>
              <strong>4. Ready to Use:</strong> After this runs, you can create and manage patient cases
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
