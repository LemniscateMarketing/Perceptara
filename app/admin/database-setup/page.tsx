"use client"

import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Database, Play, CheckCircle, XCircle, Loader2, AlertTriangle } from "lucide-react"
import { createServerSupabaseClient } from "@/lib/supabase"

export default function DatabaseSetupPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<string[]>([])
  const [errors, setErrors] = useState<string[]>([])
  const { toast } = useToast()

  const runDatabaseSetup = async () => {
    setIsRunning(true)
    setResults([])
    setErrors([])

    try {
      const supabase = createServerSupabaseClient()

      // Step 1: Check if module_settings table exists
      setResults((prev) => [...prev, "Checking module_settings table..."])

      const { data: tables, error: tablesError } = await supabase
        .from("information_schema.tables")
        .select("table_name")
        .eq("table_schema", "public")
        .eq("table_name", "module_settings")

      if (tablesError) {
        setErrors((prev) => [...prev, `Error checking tables: ${tablesError.message}`])
      }

      // Step 2: Insert default module settings
      setResults((prev) => [...prev, "Setting up default module settings..."])

      const defaultModules = [
        { module_id: "basic_information", enabled: true, display_order: 1 },
        { module_id: "behavioral_patterns", enabled: true, display_order: 2 },
        { module_id: "cognitive_emotional_patterns", enabled: true, display_order: 3 },
        { module_id: "work_career", enabled: true, display_order: 4 },
        { module_id: "mental_health_history", enabled: true, display_order: 5 },
        { module_id: "family_dynamics", enabled: true, display_order: 6 },
        { module_id: "trauma_history", enabled: true, display_order: 7 },
      ]

      let successCount = 0
      for (const module of defaultModules) {
        try {
          // Check if module already exists
          const { data: existing, error: fetchError } = await supabase
            .from("module_settings")
            .select("*")
            .eq("module_id", module.module_id)
            .single()

          if (fetchError && fetchError.code !== "PGRST116") {
            setErrors((prev) => [...prev, `Error checking ${module.module_id}: ${fetchError.message}`])
            continue
          }

          if (existing) {
            setResults((prev) => [...prev, `✅ Module ${module.module_id} already exists`])
            successCount++
          } else {
            // Insert new module
            const { error: insertError } = await supabase.from("module_settings").insert({
              ...module,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })

            if (insertError) {
              setErrors((prev) => [...prev, `Error inserting ${module.module_id}: ${insertError.message}`])
            } else {
              setResults((prev) => [...prev, `✅ Module ${module.module_id} created successfully`])
              successCount++
            }
          }
        } catch (error) {
          setErrors((prev) => [...prev, `Unexpected error with ${module.module_id}: ${error}`])
        }
      }

      setResults((prev) => [...prev, `Setup complete! ${successCount}/${defaultModules.length} modules configured.`])

      if (errors.length === 0) {
        toast({
          title: "Database Setup Complete",
          description: `Successfully configured ${successCount} modules`,
        })
      } else {
        toast({
          title: "Setup Complete with Warnings",
          description: `${successCount} modules configured, ${errors.length} errors occurred`,
          variant: "destructive",
        })
      }
    } catch (error) {
      setErrors((prev) => [...prev, `Fatal error: ${error}`])
      toast({
        title: "Setup Failed",
        description: "An unexpected error occurred during setup",
        variant: "destructive",
      })
    } finally {
      setIsRunning(false)
    }
  }

  return (
    <AdminLayout title="Database Setup">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light text-gray-900">Database Setup</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Initialize the database with default module settings and ensure all required tables are properly configured.
          </p>
        </div>

        <Card className="border-sage-200 rounded-organic-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Database className="h-6 w-6 text-sage-600" />
              <span>Module Settings Setup</span>
            </CardTitle>
            <CardDescription>
              This will create default settings for all patient architecture modules. Safe to run multiple times.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-center">
              <Button
                onClick={runDatabaseSetup}
                disabled={isRunning}
                className="bg-sage-600 hover:bg-sage-700 text-white px-8 py-3 rounded-organic-lg"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Running Setup...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5 mr-2" />
                    Run Database Setup
                  </>
                )}
              </Button>
            </div>

            {(results.length > 0 || errors.length > 0) && (
              <div className="space-y-4">
                {results.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-organic-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2 flex items-center">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Setup Results
                    </h3>
                    <div className="space-y-1">
                      {results.map((result, index) => (
                        <div key={index} className="text-sm text-green-800 font-mono">
                          {result}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {errors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-organic-lg p-4">
                    <h3 className="font-semibold text-red-900 mb-2 flex items-center">
                      <XCircle className="h-5 w-5 mr-2" />
                      Errors ({errors.length})
                    </h3>
                    <div className="space-y-1">
                      {errors.map((error, index) => (
                        <div key={index} className="text-sm text-red-800 font-mono">
                          {error}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-blue-200 rounded-organic-xl bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-organic-md">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">What This Does</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Checks if the module_settings table exists and is accessible</li>
                  <li>• Creates default settings for all 7 core patient modules</li>
                  <li>• Sets appropriate display order and enabled status</li>
                  <li>• Safe to run multiple times - won't duplicate existing data</li>
                  <li>• Required for the Patient Architecture page to work properly</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
