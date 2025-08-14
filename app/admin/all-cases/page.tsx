"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Database,
  FileText,
  Edit,
  Trash2,
  Calendar,
  User,
  Brain,
  Clock,
  ArrowRight,
  Hash,
  Heart,
  Briefcase,
  Home,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { useState, useEffect } from "react"
import { CaseGenerationForm } from "@/components/patient-modules/patient-cases/CaseGenerationForm"
import {
  getSimplePatientCases,
  updateSimplePatientCase,
  deleteSimplePatientCase,
  type SimplePatientCase,
} from "@/lib/actions/simple-patients"

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

export default function AllCasesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showArchiveDialog, setShowArchiveDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCase, setSelectedCase] = useState<SimplePatientCase | null>(null)
  const [patientCases, setPatientCases] = useState<SimplePatientCase[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  // Load cases on mount
  useEffect(() => {
    loadCases()
  }, [])

  const loadCases = async () => {
    setIsLoading(true)
    try {
      const cases = await getSimplePatientCases()
      setPatientCases(cases)
      console.log(
        "📊 Loaded cases with structured data:",
        cases.map((c) => ({
          id: c.id,
          case_name: c.case_name,
          total_fields: Object.keys(c.field_data || {}).length,
          is_structured: c.field_data?._metadata?.data_structure_version === "2.0",
        })),
      )
    } catch (error) {
      console.error("Error loading cases:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCaseGenerated = () => {
    // Reload cases when a new one is generated or edited
    loadCases()
    // Close any open modals
    setShowCreateModal(false)
    setShowEditModal(false)
    setSelectedCase(null)
  }

  const handleEditCase = (patientCase: SimplePatientCase) => {
    console.log("🔄 Opening edit modal for case:", patientCase.id)
    setSelectedCase(patientCase)
    setShowEditModal(true)
  }

  const handleArchiveCase = (patientCase: SimplePatientCase) => {
    setSelectedCase(patientCase)
    setShowArchiveDialog(true)
  }

  const confirmArchiveCase = async () => {
    if (!selectedCase) return

    try {
      const success = await updateSimplePatientCase(selectedCase.id, { status: "archived" })
      if (success) {
        loadCases() // Refresh the list
        setShowArchiveDialog(false)
        setSelectedCase(null)
      } else {
        console.error("Failed to archive case")
      }
    } catch (error) {
      console.error("Error archiving case:", error)
    }
  }

  const handleDeleteCase = (patientCase: SimplePatientCase) => {
    setSelectedCase(patientCase)
    setShowDeleteDialog(true)
  }

  const confirmDeleteCase = async () => {
    if (!selectedCase) return

    try {
      const success = await deleteSimplePatientCase(selectedCase.id)
      if (success) {
        loadCases() // Refresh the list
        setShowDeleteDialog(false)
        setSelectedCase(null)
      } else {
        console.error("Failed to delete case")
      }
    } catch (error) {
      console.error("Error deleting case:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-sage-100 text-sage-700"
      case "draft":
        return "bg-gray-100 text-gray-700"
      case "archived":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

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

      // Group fields by likely module (legacy support only)
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

  const extractBasicInfo = (fieldData: Record<string, any>) => {
    const { moduleData, isStructuredData } = getStructuredModuleData(fieldData)

    if (isStructuredData && moduleData.basic_information) {
      // Read from structured data
      const basicInfo = moduleData.basic_information
      return {
        full_name: basicInfo.full_name || basicInfo.name || "Unknown Patient",
        age: basicInfo.age_and_birth?.age || basicInfo.age || "Unknown",
        gender: basicInfo.gender || "Unknown",
        presenting_concern: basicInfo.presenting_concern || "Not specified",
      }
    } else {
      // Fallback to legacy extraction
      return {
        full_name: fieldData.full_name || fieldData.name || "Unknown Patient",
        age: fieldData.age_and_birth?.age || fieldData.age || "Unknown",
        gender: fieldData.gender || "Unknown",
        presenting_concern: fieldData.presenting_concern || "Not specified",
      }
    }
  }

  return (
    <AdminLayout title="All Cases">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-sage-900">All Cases</h1>
            <p className="text-sage-600 mt-1">Manage all patient case instances with structured data organization</p>
          </div>
          <Button
            className="bg-sage-600 hover:bg-sage-700 text-white rounded-organic-md"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Generate New Case
          </Button>
        </div>

        {/* Architecture Context */}
        <Card className="border-sage-100 rounded-organic-lg bg-gradient-to-r from-therapeutic-beige/20 to-sage-50">
          <CardContent className="p-4">
            <div className="flex items-center text-sm text-sage-700">
              <Brain className="h-4 w-4 mr-2" />
              <span className="font-medium">Modules</span>
              <ArrowRight className="h-3 w-3 mx-2" />
              <FileText className="h-4 w-4 mr-2" />
              <span className="font-medium">Templates</span>
              <ArrowRight className="h-3 w-3 mx-2" />
              <Database className="h-4 w-4 mr-2" />
              <span className="font-medium text-sage-900">All Cases</span>
              <span className="ml-2 text-sage-600">(Structured Data v2.0)</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-sage-100 rounded-organic-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Database className="h-4 w-4 text-sage-600" />
                <span className="text-sm text-sage-600">Total Cases</span>
              </div>
              <p className="text-2xl font-light text-sage-900 mt-1">{patientCases.length}</p>
            </CardContent>
          </Card>

          <Card className="border-sage-100 rounded-organic-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-therapeutic-blue" />
                <span className="text-sm text-sage-600">Active Cases</span>
              </div>
              <p className="text-2xl font-light text-sage-900 mt-1">
                {patientCases.filter((c) => c.status === "active").length}
              </p>
            </CardContent>
          </Card>

          <Card className="border-sage-100 rounded-organic-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-sage-600">Structured Cases</span>
              </div>
              <p className="text-2xl font-light text-sage-900 mt-1">
                {patientCases.filter((c) => c.field_data?._metadata?.data_structure_version === "2.0").length}
              </p>
            </CardContent>
          </Card>

          <Card className="border-sage-100 rounded-organic-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-warm-600" />
                <span className="text-sm text-sage-600">Avg Fields/Case</span>
              </div>
              <p className="text-2xl font-light text-sage-900 mt-1">
                {patientCases.length > 0
                  ? Math.round(
                      patientCases.reduce((sum, c) => sum + Object.keys(c.field_data || {}).length, 0) /
                        patientCases.length,
                    )
                  : 0}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cases List */}
        <div className="space-y-4">
          {isLoading ? (
            <Card className="border-sage-100 rounded-organic-lg">
              <CardContent className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mx-auto mb-4"></div>
                <p className="text-sage-600">Loading cases...</p>
              </CardContent>
            </Card>
          ) : patientCases.length === 0 ? (
            <Card className="border-sage-100 rounded-organic-lg">
              <CardContent className="p-8 text-center">
                <Database className="h-12 w-12 text-sage-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-sage-900 mb-2">No Patient Cases Yet</h3>
                <p className="text-sage-600 mb-4">
                  The system is ready for structured case generation. Enable modules in Patient Architecture and
                  generate your first case with organized data.
                </p>
                <Button
                  className="bg-sage-600 hover:bg-sage-700 text-white rounded-organic-md"
                  onClick={() => setShowCreateModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Generate First Case
                </Button>
              </CardContent>
            </Card>
          ) : (
            patientCases.map((patientCase) => {
              const basicInfo = extractBasicInfo(patientCase.field_data || {})
              const { metadata, isStructuredData } = getStructuredModuleData(patientCase.field_data || {})
              const totalFields = Object.keys(patientCase.field_data || {}).length
              const modulesUsed = metadata.modules_used || patientCase.field_data?._modules_used || []

              return (
                <Card
                  key={patientCase.id}
                  className="border-sage-100 rounded-organic-lg hover:shadow-md transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <CardTitle className="text-lg font-medium text-sage-900">{patientCase.case_name}</CardTitle>
                          <Badge className={`text-xs ${getStatusColor(patientCase.status)}`}>
                            {patientCase.status}
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
                        <div className="flex items-center space-x-4 text-sm text-sage-600 mb-2">
                          <span className="flex items-center">
                            <FileText className="h-3 w-3 mr-1" />
                            Case ID: {patientCase.id}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            Created: {new Date(patientCase.created_at).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Hash className="h-3 w-3 mr-1" />
                            {totalFields} Fields
                          </span>
                          <span className="flex items-center">
                            <Brain className="h-3 w-3 mr-1" />
                            {modulesUsed.length} Modules
                          </span>
                          {metadata.template_used && (
                            <span className="flex items-center">
                              <FileText className="h-3 w-3 mr-1" />
                              Template: {metadata.template_used}
                            </span>
                          )}
                        </div>
                        <CardDescription className="text-sage-600">{patientCase.case_summary}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-sage-700 hover:bg-sage-50"
                          onClick={() => handleEditCase(patientCase)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleArchiveCase(patientCase)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Archive
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-700 hover:bg-red-50"
                          onClick={() => handleDeleteCase(patientCase)}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-sm font-medium text-sage-900 mb-2">Patient Information:</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-sage-500">Name:</span>
                            <span className="ml-2 text-sage-900">{basicInfo.full_name}</span>
                          </div>
                          <div>
                            <span className="text-sage-500">Age:</span>
                            <span className="ml-2 text-sage-900">{basicInfo.age}</span>
                          </div>
                          <div>
                            <span className="text-sage-500">Gender:</span>
                            <span className="ml-2 text-sage-900">{basicInfo.gender}</span>
                          </div>
                          <div className="col-span-2">
                            <span className="text-sage-500">Presenting Concern:</span>
                            <span className="ml-2 text-sage-900">{basicInfo.presenting_concern}</span>
                          </div>
                        </div>
                      </div>

                      {/* Data Structure Summary */}
                      <div>
                        <h4 className="text-sm font-medium text-sage-900 mb-2">Data Structure Summary:</h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs bg-sage-50">
                            {totalFields} Total Fields
                          </Badge>
                          {isStructuredData ? (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Structured Data v2.0
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                              Legacy Format
                            </Badge>
                          )}
                          {modulesUsed.map((moduleId: string) => (
                            <Badge
                              key={moduleId}
                              variant="outline"
                              className={`text-xs ${MODULE_COLORS[moduleId as keyof typeof MODULE_COLORS] || "bg-gray-100 text-gray-700"}`}
                            >
                              {moduleId.replace(/_/g, " ")}
                            </Badge>
                          ))}
                          {metadata.created_via && (
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              Via: {metadata.created_via}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>

        {/* Case Generation Form for Creating New Cases */}
        <CaseGenerationForm
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCaseGenerated={handleCaseGenerated}
        />

        {/* Case Generation Form for Editing Existing Cases */}
        <CaseGenerationForm
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setSelectedCase(null)
          }}
          onCaseGenerated={handleCaseGenerated}
          editingCase={selectedCase}
        />

        {/* Archive Confirmation Dialog */}
        <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Archive Case</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to archive "{selectedCase?.case_name}"? This will change the case status to
                archived but won't delete the data. You can still view archived cases later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmArchiveCase} className="bg-red-600 hover:bg-red-700">
                Archive Case
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Case Permanently</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to permanently delete "{selectedCase?.case_name}"? This action cannot be undone
                and will remove all patient data associated with this case.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteCase} className="bg-red-600 hover:bg-red-700">
                Delete Permanently
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  )
}
