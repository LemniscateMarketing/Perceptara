"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Users,
  Search,
  Database,
  ChevronDown,
  ChevronRight,
  Calendar,
  User,
  Brain,
  Heart,
  Briefcase,
  Home,
  AlertTriangle,
  Loader2,
  CheckCircle,
} from "lucide-react"
import { getSimplePatientCases, extractPatientSummary, type SimplePatientCase } from "@/lib/actions/simple-patients"

const MODULE_ICONS = {
  basic_information: User,
  behavioral_patterns: Brain,
  cognitive_emotional_patterns: Heart,
  work_career: Briefcase,
  family_dynamics: Home,
  trauma_history: AlertTriangle,
  mental_health_history: Brain,
}

const MODULE_COLORS = {
  basic_information: "bg-sage-100 text-sage-700",
  behavioral_patterns: "bg-therapeutic-blue/20 text-therapeutic-blue",
  cognitive_emotional_patterns: "bg-therapeutic-green/20 text-therapeutic-green",
  work_career: "bg-warm-100 text-warm-700",
  family_dynamics: "bg-therapeutic-lavender/20 text-therapeutic-lavender",
  trauma_history: "bg-red-100 text-red-700",
  mental_health_history: "bg-therapeutic-blue/20 text-therapeutic-blue",
}

interface PatientDataViewerProps {
  refreshTrigger?: number
}

export function PatientDataViewer({ refreshTrigger }: PatientDataViewerProps) {
  const [patients, setPatients] = useState<SimplePatientCase[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<SimplePatientCase | null>(null)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  useEffect(() => {
    loadPatients()
  }, [refreshTrigger])

  const loadPatients = async () => {
    setLoading(true)
    try {
      const data = await getSimplePatientCases()
      setPatients(data)
      console.log("📊 Loaded patients with structured data:", data.length)
    } catch (error) {
      console.error("Error loading patients:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter((patient) => {
    const summary = extractPatientSummary(patient)
    const searchLower = searchTerm.toLowerCase()

    return (
      summary.case_name.toLowerCase().includes(searchLower) ||
      summary.full_name.toLowerCase().includes(searchLower) ||
      summary.id.toLowerCase().includes(searchLower) ||
      summary.presenting_concern.toLowerCase().includes(searchLower)
    )
  })

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }))
  }

  const renderFieldValue = (key: string, value: any): string => {
    if (value === null || value === undefined) return "Not specified"
    if (typeof value === "boolean") return value ? "Yes" : "No"
    if (typeof value === "object") {
      if (Array.isArray(value)) return value.join(", ")
      return JSON.stringify(value, null, 2)
    }
    return String(value)
  }

  // NEW: Read structured data directly - no more guessing!
  const getStructuredModuleData = (fieldData: Record<string, any>) => {
    const moduleData: Record<string, Record<string, any>> = {}
    const metadata = fieldData._metadata || {}
    const isStructuredData = metadata.data_structure_version === "2.0"

    if (isStructuredData) {
      // Data is already structured by modules
      console.log("📊 Reading structured data v2.0")
      Object.entries(fieldData).forEach(([key, value]) => {
        if (!key.startsWith("_") && typeof value === "object" && value !== null && !Array.isArray(value)) {
          moduleData[key] = value
        }
      })
    } else {
      // Legacy flat data - convert using the old logic for backward compatibility
      console.log("📊 Converting legacy flat data")
      const modulesUsed = fieldData._modules_used || []

      // Initialize module groups
      modulesUsed.forEach((moduleId: string) => {
        moduleData[moduleId] = {}
      })

      // Group fields by likely module (legacy support)
      Object.entries(fieldData).forEach(([key, value]) => {
        if (key.startsWith("_")) return // Skip metadata

        // Try to assign to appropriate module based on field name
        let assigned = false

        if (
          key.includes("name") ||
          key.includes("age") ||
          key.includes("gender") ||
          key.includes("contact") ||
          key.includes("presenting_concern")
        ) {
          if (moduleData.basic_information) {
            moduleData.basic_information[key] = value
            assigned = true
          }
        } else if (
          key.includes("behavior") ||
          key.includes("habit") ||
          key.includes("routine") ||
          key.includes("pattern")
        ) {
          if (moduleData.behavioral_patterns) {
            moduleData.behavioral_patterns[key] = value
            assigned = true
          }
        } else if (
          key.includes("emotion") ||
          key.includes("cognitive") ||
          key.includes("thought") ||
          key.includes("feeling")
        ) {
          if (moduleData.cognitive_emotional_patterns) {
            moduleData.cognitive_emotional_patterns[key] = value
            assigned = true
          }
        } else if (
          key.includes("work") ||
          key.includes("career") ||
          key.includes("job") ||
          key.includes("employment")
        ) {
          if (moduleData.work_career) {
            moduleData.work_career[key] = value
            assigned = true
          }
        } else if (
          key.includes("family") ||
          key.includes("relationship") ||
          key.includes("parent") ||
          key.includes("sibling")
        ) {
          if (moduleData.family_dynamics) {
            moduleData.family_dynamics[key] = value
            assigned = true
          }
        } else if (
          key.includes("trauma") ||
          key.includes("abuse") ||
          key.includes("incident") ||
          key.includes("ptsd")
        ) {
          if (moduleData.trauma_history) {
            moduleData.trauma_history[key] = value
            assigned = true
          }
        } else if (
          key.includes("mental") ||
          key.includes("diagnosis") ||
          key.includes("therapy") ||
          key.includes("medication")
        ) {
          if (moduleData.mental_health_history) {
            moduleData.mental_health_history[key] = value
            assigned = true
          }
        }

        // If not assigned, put in basic_information as fallback
        if (!assigned) {
          if (!moduleData.basic_information) moduleData.basic_information = {}
          moduleData.basic_information[key] = value
        }
      })
    }

    return { moduleData, metadata, isStructuredData }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-sage-600" />
        <span className="ml-2 text-sage-600">Loading patient data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-sage-100 rounded-organic-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-sage-100 rounded-organic-md">
                <Database className="h-5 w-5 text-sage-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-medium text-sage-900">Patient Database</CardTitle>
                <CardDescription className="text-sage-600">
                  View all patient cases with structured module data organization
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="bg-sage-50">
                {patients.length} Total Cases
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Structured Data v2.0
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Search */}
      <Card className="border-sage-100 rounded-organic-lg">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-sage-600" />
            <Input
              placeholder="Search by case name, patient name, ID, or concern..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Patient List</TabsTrigger>
          <TabsTrigger value="detailed">Detailed View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {filteredPatients.map((patient) => {
            const summary = extractPatientSummary(patient)
            const { metadata, isStructuredData } = getStructuredModuleData(patient.field_data || {})

            return (
              <Card key={patient.id} className="border-sage-100 rounded-organic-lg">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-therapeutic-blue/20 rounded-organic-md">
                        <User className="h-5 w-5 text-therapeutic-blue" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-medium text-sage-900">{summary.case_name}</CardTitle>
                        <CardDescription className="text-sage-600">
                          {summary.full_name} • {summary.age} years old • {summary.gender}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {summary.id}
                      </Badge>
                      {isStructuredData ? (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Structured v2.0
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                          Legacy Data
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Badge variant="outline" className="text-xs bg-sage-50">
                      {summary.total_fields} Fields
                    </Badge>
                    <Badge variant="outline" className="text-xs bg-therapeutic-green/20 text-therapeutic-green">
                      {summary.modules_used.length} Modules
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(summary.created_at).toLocaleDateString()}
                    </Badge>
                    {metadata.template_used && (
                      <Badge variant="outline" className="text-xs bg-therapeutic-beige/20 text-warm-700">
                        Template: {metadata.template_used}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="detailed" className="space-y-4">
          {filteredPatients.map((patient) => {
            const summary = extractPatientSummary(patient)
            const { moduleData, metadata, isStructuredData } = getStructuredModuleData(patient.field_data || {})

            return (
              <Card key={patient.id} className="border-sage-100 rounded-organic-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-therapeutic-blue/20 rounded-organic-md">
                        <User className="h-5 w-5 text-therapeutic-blue" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-medium text-sage-900">{summary.case_name}</CardTitle>
                        <CardDescription className="text-sage-600">
                          Patient profile with {isStructuredData ? "structured" : "legacy"} data organization
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {summary.id}
                      </Badge>
                      {isStructuredData ? (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Structured v2.0
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                          Legacy Data
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Module Groups - Now reading directly from structured data */}
                  {Object.entries(moduleData).map(([moduleId, fields]) => {
                    if (!fields || Object.keys(fields).length === 0) return null

                    const IconComponent = MODULE_ICONS[moduleId as keyof typeof MODULE_ICONS] || Brain
                    const colorClass =
                      MODULE_COLORS[moduleId as keyof typeof MODULE_COLORS] || "bg-sage-100 text-sage-700"

                    return (
                      <Collapsible
                        key={moduleId}
                        open={expandedSections[`${patient.id}-${moduleId}`]}
                        onOpenChange={() => toggleSection(`${patient.id}-${moduleId}`)}
                      >
                        <CollapsibleTrigger asChild>
                          <Card className="border-sage-100 rounded-organic-lg cursor-pointer hover:bg-sage-50/50 transition-colors">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className={`p-2 rounded-organic-md ${colorClass}`}>
                                    <IconComponent className="h-4 w-4" />
                                  </div>
                                  <div>
                                    <CardTitle className="text-base font-medium text-sage-900">
                                      {moduleId.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </CardTitle>
                                    <CardDescription className="text-sage-600">
                                      {Object.keys(fields).length} fields
                                      {isStructuredData && (
                                        <span className="ml-2 text-green-600">• Structured Data</span>
                                      )}
                                    </CardDescription>
                                  </div>
                                </div>
                                {expandedSections[`${patient.id}-${moduleId}`] ? (
                                  <ChevronDown className="h-4 w-4 text-sage-600" />
                                ) : (
                                  <ChevronRight className="h-4 w-4 text-sage-600" />
                                )}
                              </div>
                            </CardHeader>
                          </Card>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <Card className="border-sage-100 rounded-organic-lg mt-2">
                            <CardContent className="p-4">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(fields).map(([key, value]) => (
                                  <div key={key} className="space-y-1">
                                    <Label className="text-xs font-medium text-sage-700">
                                      {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                    </Label>
                                    <div className="text-sm text-sage-600 p-2 bg-sage-50 rounded-organic-sm">
                                      {renderFieldValue(key, value)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </CollapsibleContent>
                      </Collapsible>
                    )
                  })}

                  {/* Metadata Section */}
                  {Object.keys(metadata).length > 0 && (
                    <Collapsible
                      open={expandedSections[`${patient.id}-metadata`]}
                      onOpenChange={() => toggleSection(`${patient.id}-metadata`)}
                    >
                      <CollapsibleTrigger asChild>
                        <Card className="border-sage-100 rounded-organic-lg cursor-pointer hover:bg-sage-50/50 transition-colors">
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-organic-md">
                                  <Database className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <CardTitle className="text-base font-medium text-sage-900">System Metadata</CardTitle>
                                  <CardDescription className="text-sage-600">
                                    Internal system fields and generation info
                                  </CardDescription>
                                </div>
                              </div>
                              {expandedSections[`${patient.id}-metadata`] ? (
                                <ChevronDown className="h-4 w-4 text-sage-600" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-sage-600" />
                              )}
                            </div>
                          </CardHeader>
                        </Card>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <Card className="border-sage-100 rounded-organic-lg mt-2">
                          <CardContent className="p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {Object.entries(metadata).map(([key, value]) => (
                                <div key={key} className="space-y-1">
                                  <Label className="text-xs font-medium text-blue-700">
                                    {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                  </Label>
                                  <div className="text-sm text-blue-600 p-2 bg-blue-50 rounded-organic-sm">
                                    {renderFieldValue(key, value)}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>

      {filteredPatients.length === 0 && (
        <Card className="border-sage-100 rounded-organic-lg">
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-sage-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-sage-900 mb-2">No patients found</h3>
            <p className="text-sage-600">
              {searchTerm ? "Try adjusting your search terms" : "Create your first patient case to get started"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
