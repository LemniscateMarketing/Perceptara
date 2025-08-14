"use client"

import { useState, useEffect, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Zap,
  Users,
  AlertCircle,
  CheckCircle,
  Loader2,
  Brain,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Save,
  Tag,
  Hash,
  Plus,
  Trash2,
  Info,
  FileIcon as FileTemplate,
  Copy,
  Edit,
} from "lucide-react"
import { BASIC_INFORMATION_MODULE } from "@/components/patient-modules/basic-information/config"
import { BEHAVIORAL_PATTERNS_MODULE } from "@/components/patient-modules/behavioral-patterns/config"
import { COGNITIVE_EMOTIONAL_PATTERNS_MODULE } from "@/components/patient-modules/cognitive-emotional-patterns/config"
import { WORK_CAREER_MODULE } from "@/components/patient-modules/work-career/config"
import { MENTAL_HEALTH_HISTORY_MODULE } from "@/components/patient-modules/mental-health-history/config"
import { FAMILY_DYNAMICS_MODULE } from "@/components/patient-modules/family-dynamics/config"
import { TRAUMA_HISTORY_MODULE } from "@/components/patient-modules/trauma-history/config"
import { createSimplePatientCase, updateSimplePatientCase, type SimplePatientCase } from "@/lib/actions/simple-patients"
import { getEnabledModuleSettings } from "@/lib/actions/module-settings"
import { PATIENT_TEMPLATES } from "./templates"

interface CaseGenerationFormProps {
  isOpen: boolean
  onClose: () => void
  onCaseGenerated: () => void
  editingCase?: SimplePatientCase | null // New prop for editing mode
}

// All modules to include in case generation
const ALL_MODULES = [
  {
    id: "basic_information",
    config: BASIC_INFORMATION_MODULE,
    color: "bg-sage-100 text-sage-700",
  },
  {
    id: "behavioral_patterns",
    config: BEHAVIORAL_PATTERNS_MODULE,
    color: "bg-therapeutic-blue/20 text-therapeutic-blue",
  },
  {
    id: "cognitive_emotional_patterns",
    config: COGNITIVE_EMOTIONAL_PATTERNS_MODULE,
    color: "bg-therapeutic-green/20 text-therapeutic-green",
  },
  {
    id: "work_career",
    config: WORK_CAREER_MODULE,
    color: "bg-warm-100 text-warm-700",
  },
  {
    id: "mental_health_history",
    config: MENTAL_HEALTH_HISTORY_MODULE,
    color: "bg-therapeutic-blue/20 text-therapeutic-blue",
  },
  {
    id: "family_dynamics",
    config: FAMILY_DYNAMICS_MODULE,
    color: "bg-therapeutic-lavender/20 text-therapeutic-lavender",
  },
  {
    id: "trauma_history",
    config: TRAUMA_HISTORY_MODULE,
    color: "bg-red-100 text-red-700",
  },
]

const generateUniqueCaseId = () => {
  const timestamp = Date.now()
  const randomSuffix = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  const randomLetters = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `CASE-${timestamp}-${randomLetters}${randomSuffix}`
}

const generateCaseName = (moduleData: Record<string, any>) => {
  const basicInfo = moduleData.basic_information || {}
  const age = basicInfo.age_and_birth?.age || "Unknown Age"
  const concern = basicInfo.presenting_concern || "General Therapy"

  // Create descriptive case name without patient's personal name
  const caseName = `${concern} (Age ${age})`

  return caseName
}

export function CaseGenerationForm({ isOpen, onClose, onCaseGenerated, editingCase = null }: CaseGenerationFormProps) {
  const isEditMode = !!editingCase
  const [activeTab, setActiveTab] = useState(isEditMode ? "manual" : "template")
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)

  // NEW: Structured form data organized by modules
  const [moduleData, setModuleData] = useState<Record<string, Record<string, any>>>({})
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Case Management Fields (separate from patient modules)
  const [caseId, setCaseId] = useState("")
  const [caseName, setCaseName] = useState("")

  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({
    basic_information: true,
    behavioral_patterns: false,
    cognitive_emotional_patterns: false,
    work_career: false,
    mental_health_history: false,
    family_dynamics: false,
    trauma_history: false,
  })

  const [availableModules, setAvailableModules] = useState<any[]>([])
  const [loadingModules, setLoadingModules] = useState(true)

  useEffect(() => {
    loadEnabledModules()

    if (isEditMode && editingCase) {
      // Load existing case data for editing
      console.log("🔄 Loading case for editing:", editingCase.id)
      setCaseId(editingCase.id)
      setCaseName(editingCase.case_name)

      // NEW: Load structured data or convert from flat structure
      const fieldData = editingCase.field_data || {}

      if (fieldData.basic_information) {
        // Data is already structured by modules
        console.log("📊 Loading structured module data")
        const structuredData: Record<string, Record<string, any>> = {}

        // Initialize all available modules
        ALL_MODULES.forEach((module) => {
          structuredData[module.id] = fieldData[module.id] || {}
        })

        setModuleData(structuredData)
      } else {
        // Data is flat - need to convert (legacy support)
        console.log("📊 Converting flat data to structured format")
        const structuredData = convertFlatToStructured(fieldData)
        setModuleData(structuredData)
      }
    } else {
      // Initialize case ID for new cases
      setCaseId(generateUniqueCaseId())
      // Initialize empty module data
      const emptyModuleData: Record<string, Record<string, any>> = {}
      ALL_MODULES.forEach((module) => {
        emptyModuleData[module.id] = {}
      })
      setModuleData(emptyModuleData)
    }
  }, [isEditMode, editingCase])

  // Auto-generate case name when patient data changes (only for new cases)
  const autoGenerateCaseName = useCallback(() => {
    if (!isEditMode && moduleData.basic_information && Object.keys(moduleData.basic_information).length > 0) {
      const autoGeneratedName = generateCaseName(moduleData)
      setCaseName(autoGeneratedName)
    }
  }, [moduleData, isEditMode])

  useEffect(() => {
    if (!isEditMode) {
      autoGenerateCaseName()
    }
  }, [moduleData.basic_information, autoGenerateCaseName, isEditMode])

  const loadEnabledModules = async () => {
    setLoadingModules(true)
    try {
      const enabledSettings = await getEnabledModuleSettings()
      const enabledModules = ALL_MODULES.filter((module) =>
        enabledSettings.some((setting) => setting.module_id === module.id),
      )
      setAvailableModules(enabledModules)
      console.log(
        "🔧 Available modules loaded:",
        enabledModules.map((m) => m.id),
      )
    } catch (error) {
      console.error("Error loading enabled modules:", error)
      setAvailableModules(ALL_MODULES)
    } finally {
      setLoadingModules(false)
    }
  }

  // NEW: Convert flat field data to structured format (for legacy support)
  const convertFlatToStructured = (flatData: Record<string, any>): Record<string, Record<string, any>> => {
    const structured: Record<string, Record<string, any>> = {}

    // Initialize all modules
    ALL_MODULES.forEach((module) => {
      structured[module.id] = {}
    })

    // Map flat fields to their modules based on field definitions
    Object.entries(flatData).forEach(([fieldId, value]) => {
      if (fieldId.startsWith("_")) return // Skip metadata

      // Find which module this field belongs to
      let assigned = false
      for (const module of ALL_MODULES) {
        const field = module.config.fields.find((f) => f.id === fieldId)
        if (field) {
          structured[module.id][fieldId] = value
          assigned = true
          break
        }
      }

      // If not found in any module, put in basic_information as fallback
      if (!assigned) {
        structured.basic_information[fieldId] = value
      }
    })

    return structured
  }

  const handleTemplateSelect = (templateId: string) => {
    const template = PATIENT_TEMPLATES.find((t) => t.id === templateId)
    if (template) {
      setSelectedTemplate(templateId)
      setModuleData(template.data) // Template data is already structured
      setCaseName(template.name)
      console.log("📋 Template loaded:", template.name, "with structured module data")
    }
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }))
  }

  // NEW: Handle field changes with module organization
  const handleFieldChange = (moduleId: string, fieldId: string, value: any) => {
    console.log(`🔄 Field changed: ${moduleId}.${fieldId} =`, value)

    setModuleData((prev) => {
      const newData = {
        ...prev,
        [moduleId]: {
          ...prev[moduleId],
          [fieldId]: value,
        },
      }

      console.log(`📊 Updated module data for ${moduleId}:`, {
        fieldId,
        value,
        moduleFields: Object.keys(newData[moduleId]).length,
        totalModules: Object.keys(newData).length,
      })

      return newData
    })

    // Clear validation error when user starts typing
    const errorKey = `${moduleId}.${fieldId}`
    if (validationErrors[errorKey]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Validate case management fields
    if (!caseName || !caseName.trim()) {
      errors.caseName = "Case Name is required"
    }

    // Basic validation - at least name is required
    const basicInfo = moduleData.basic_information || {}
    if (!basicInfo.full_name || !basicInfo.full_name.trim()) {
      errors["basic_information.full_name"] = "Patient name is required"
    }

    // Validate age if provided
    if (basicInfo.age_and_birth?.age && (basicInfo.age_and_birth.age < 1 || basicInfo.age_and_birth.age > 120)) {
      errors["basic_information.age_and_birth"] = "Age must be between 1 and 120"
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      console.log("❌ Form validation failed:", validationErrors)
      return
    }

    setIsGenerating(true)
    try {
      console.log(`🚀 ${isEditMode ? "Updating" : "Creating"} patient case with structured data...`)

      // NEW: Prepare structured field data
      const structuredFieldData = {
        ...moduleData, // All module data is already organized
        _metadata: {
          case_id: caseId,
          case_name: caseName,
          created_via: isEditMode
            ? "case_edit_form"
            : selectedTemplate
              ? `template_${selectedTemplate}`
              : "manual_entry",
          template_used: selectedTemplate || null,
          modules_used: availableModules.map((m) => m.id),
          generation_timestamp: isEditMode
            ? editingCase?.field_data?._metadata?.generation_timestamp
            : new Date().toISOString(),
          last_updated: new Date().toISOString(),
          total_fields_saved: Object.values(moduleData).reduce(
            (total, moduleFields) => total + Object.keys(moduleFields).length,
            0,
          ),
          data_structure_version: "2.0", // Mark as new structured format
        },
      }

      console.log("📊 Structured data being saved:", {
        totalModules: Object.keys(moduleData).length,
        moduleBreakdown: Object.entries(moduleData).map(([moduleId, fields]) => ({
          module: moduleId,
          fieldCount: Object.keys(fields).length,
          fields: Object.keys(fields),
        })),
        totalFields: Object.values(moduleData).reduce(
          (total, moduleFields) => total + Object.keys(moduleFields).length,
          0,
        ),
      })

      let result
      if (isEditMode && editingCase) {
        // Update existing case
        console.log("📝 Updating existing case:", editingCase.id)
        const success = await updateSimplePatientCase(editingCase.id, {
          case_name: caseName,
          case_summary: moduleData.basic_information?.presenting_concern || editingCase.case_summary,
          field_data: structuredFieldData,
        })

        if (success) {
          result = { id: editingCase.id }
          console.log("✅ Patient case updated successfully with structured data")
        } else {
          console.error("❌ Failed to update patient case")
          alert("Failed to update patient case. Check console for details.")
          return
        }
      } else {
        // Create new case
        console.log("📤 Creating new case with structured data")

        result = await createSimplePatientCase({
          case_name: caseName,
          case_summary:
            moduleData.basic_information?.presenting_concern || "Generated patient case with structured data",
          case_reference: caseId,
          field_data: structuredFieldData,
        })
      }

      if (result) {
        console.log(
          `✅ Patient case ${isEditMode ? "updated" : "created"} successfully with structured data:`,
          result.id,
        )
        onCaseGenerated()
        onClose()

        // Reset form only for new cases
        if (!isEditMode) {
          const emptyModuleData: Record<string, Record<string, any>> = {}
          ALL_MODULES.forEach((module) => {
            emptyModuleData[module.id] = {}
          })
          setModuleData(emptyModuleData)
          setValidationErrors({})
          setCaseId(generateUniqueCaseId())
          setCaseName("")
          setSelectedTemplate("")
        }
      } else {
        console.error(`❌ Failed to ${isEditMode ? "update" : "create"} patient case`)
        alert(`Failed to ${isEditMode ? "update" : "create"} patient case. Check console for details.`)
      }
    } catch (error) {
      console.error(`❌ Error in handle${isEditMode ? "Update" : "Generate"}:`, error)
      alert(`Error ${isEditMode ? "updating" : "creating"} case: ${error.message}`)
    } finally {
      setIsGenerating(false)
    }
  }

  const renderField = (moduleId: string, field: any) => {
    // Get current value from the module data
    let value = moduleData[moduleId]?.[field.id]
    if (value === undefined || value === null) {
      // Initialize with appropriate default based on field type
      switch (field.type) {
        case "list":
          value = []
          break
        case "multiselect":
          value = []
          break
        case "age_date":
          value = { age: "", date_of_birth: "" }
          break
        case "boolean":
          value = false
          break
        default:
          value = ""
      }
      // Set the initial value
      handleFieldChange(moduleId, field.id, value)
    }

    const errorKey = `${moduleId}.${field.id}`
    const hasError = validationErrors[errorKey]

    console.log(`🎨 Rendering field: ${moduleId}.${field.id}, type: ${field.type}, current value:`, value)

    const fieldComponent = (() => {
      switch (field.type) {
        case "text":
          return (
            <div className="space-y-2">
              <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
                {field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Input
                id={field.id}
                value={value || ""}
                onChange={(e) => {
                  console.log(`📝 Text field ${moduleId}.${field.id} changed to:`, e.target.value)
                  handleFieldChange(moduleId, field.id, e.target.value)
                }}
                placeholder={field.placeholder}
                className={`w-full ${hasError ? "border-red-300 focus:border-red-500" : ""}`}
                disabled={field.id === "case_id"} // Case ID is auto-generated
              />
              {hasError && <p className="text-sm text-red-600">{hasError}</p>}
            </div>
          )

        case "textarea":
          return (
            <div className="space-y-2">
              <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
                {field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Textarea
                id={field.id}
                value={value || ""}
                onChange={(e) => {
                  console.log(`📝 Textarea field ${moduleId}.${field.id} changed to:`, e.target.value)
                  handleFieldChange(moduleId, field.id, e.target.value)
                }}
                placeholder={field.placeholder}
                className={`w-full min-h-[100px] ${hasError ? "border-red-300 focus:border-red-500" : ""}`}
              />
              {hasError && <p className="text-sm text-red-600">{hasError}</p>}
            </div>
          )

        case "age_date":
          return (
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">
                {field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`${field.id}_age`} className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </Label>
                  <Input
                    id={`${field.id}_age`}
                    type="number"
                    value={value?.age || ""}
                    onChange={(e) => {
                      const newValue = {
                        ...value,
                        age: Number.parseInt(e.target.value) || 0,
                      }
                      console.log(`📝 Age field ${moduleId}.${field.id} changed to:`, newValue)
                      handleFieldChange(moduleId, field.id, newValue)
                    }}
                    placeholder="Enter age..."
                    className="w-full"
                    min={1}
                    max={120}
                  />
                </div>
                <div>
                  <Label htmlFor={`${field.id}_birth`} className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth
                  </Label>
                  <Input
                    id={`${field.id}_birth`}
                    type="date"
                    value={value?.date_of_birth || ""}
                    onChange={(e) => {
                      const newValue = {
                        ...value,
                        date_of_birth: e.target.value,
                      }
                      console.log(`📝 Date field ${moduleId}.${field.id} changed to:`, newValue)
                      handleFieldChange(moduleId, field.id, newValue)
                    }}
                    className="w-full"
                  />
                </div>
              </div>
              {hasError && <p className="text-sm text-red-600">{hasError}</p>}
            </div>
          )

        case "select":
          return (
            <div className="space-y-2">
              <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
                {field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <Select
                value={value || ""}
                onValueChange={(newValue) => {
                  console.log(`📝 Select field ${moduleId}.${field.id} changed to:`, newValue)
                  handleFieldChange(moduleId, field.id, newValue)
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select an option..." />
                </SelectTrigger>
                <SelectContent>
                  {field.options?.map((option: string) => (
                    <SelectItem key={option} value={option}>
                      {String(option)
                        .replace(/_/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {hasError && <p className="text-sm text-red-600">{hasError}</p>}
            </div>
          )

        case "multiselect":
          const selectedValues = Array.isArray(value) ? value : []
          return (
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-700">
                {field.name}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 border border-gray-200 rounded-organic-md">
                {field.options?.map((option: string) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${field.id}_${option}`}
                      checked={selectedValues.includes(option)}
                      onCheckedChange={(checked) => {
                        let newValue
                        if (checked) {
                          newValue = [...selectedValues, option]
                        } else {
                          newValue = selectedValues.filter((v: string) => v !== option)
                        }
                        console.log(`📝 Multiselect field ${moduleId}.${field.id} changed to:`, newValue)
                        handleFieldChange(moduleId, field.id, newValue)
                      }}
                    />
                    <Label htmlFor={`${field.id}_${option}`} className="text-sm cursor-pointer">
                      {option.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Label>
                  </div>
                ))}
              </div>
              {selectedValues.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedValues.map((selectedValue: string) => (
                    <Badge key={selectedValue} variant="secondary" className="text-xs">
                      {selectedValue.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                    </Badge>
                  ))}
                </div>
              )}
              {hasError && <p className="text-sm text-red-600">{hasError}</p>}
            </div>
          )

        case "list":
          const listItems = Array.isArray(value) ? value : []

          // Handle different list types based on field structure
          if (field.id === "languages") {
            // Languages - simple string array
            return (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  {field.name}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {listItems.length === 0 && (
                  <div className="p-3 bg-yellow-50 rounded-organic-md border border-yellow-200">
                    <div className="flex items-center space-x-2">
                      <Info className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-700">
                        No languages specified - if added, cannot be empty
                      </span>
                    </div>
                  </div>
                )}
                {listItems.map((language: string, index: number) => (
                  <Card key={index} className="p-3 bg-sage-50 border border-sage-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 flex-1">
                        <Badge variant="outline" className="text-xs font-mono bg-sage-100">
                          {index + 1}
                        </Badge>
                        <Input
                          value={language}
                          onChange={(e) => {
                            const newLanguages = [...listItems]
                            newLanguages[index] = e.target.value
                            handleFieldChange(moduleId, field.id, newLanguages)
                          }}
                          placeholder="Enter language..."
                          className="flex-1"
                          required
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newLanguages = listItems.filter((_: string, i: number) => i !== index)
                          handleFieldChange(moduleId, field.id, newLanguages)
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    handleFieldChange(moduleId, field.id, [...listItems, ""])
                  }}
                  className="w-full border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Language
                </Button>
              </div>
            )
          } else if (field.id === "personal_values" || field.id === "ethnicity") {
            // Personal Values/Ethnicity - objects with value field
            return (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  {field.name}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {listItems.length === 0 && (
                  <div className="p-3 bg-yellow-50 rounded-organic-md border border-yellow-200">
                    <div className="flex items-center space-x-2">
                      <Info className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-700">
                        No {field.name.toLowerCase()} specified - if added, cannot be empty
                      </span>
                    </div>
                  </div>
                )}
                {listItems.map((item: any, index: number) => (
                  <Card key={index} className="p-3 bg-sage-50 border border-sage-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 flex-1">
                        <Badge variant="outline" className="text-xs font-mono bg-sage-100">
                          {index + 1}
                        </Badge>
                        <Input
                          value={item.value || ""}
                          onChange={(e) => {
                            const newValues = [...listItems]
                            newValues[index] = { value: e.target.value }
                            handleFieldChange(moduleId, field.id, newValues)
                          }}
                          placeholder={`Enter ${field.name.slice(0, -1).toLowerCase()}...`}
                          className="flex-1"
                          required
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newValues = listItems.filter((_: any, i: number) => i !== index)
                          handleFieldChange(moduleId, field.id, newValues)
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    handleFieldChange(moduleId, field.id, [...listItems, { value: "" }])
                  }}
                  className="w-full border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add {field.name.slice(0, -1)}
                </Button>
              </div>
            )
          } else {
            // Complex list types (children, emergency_contacts, etc.)
            return (
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  {field.name}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {listItems.length === 0 && field.id === "emergency_contacts" && (
                  <div className="p-3 bg-yellow-50 rounded-organic-md border border-yellow-200">
                    <div className="flex items-center space-x-2">
                      <Info className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm text-yellow-700">
                        No emergency contacts - patient may not have available contacts
                      </span>
                    </div>
                  </div>
                )}
                {listItems.map((item: any, index: number) => (
                  <Card key={index} className="p-3 bg-sage-50 border border-sage-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs font-mono bg-sage-100">
                          {index + 1}
                        </Badge>
                        <span className="text-sm font-medium text-sage-700">
                          {field.id === "children"
                            ? `${item.name || "Unnamed"} • ${item.age || "Age unknown"}`
                            : `${item.name || "Unnamed"} • ${item.relationship || item.phone || "No details"}`}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newItems = listItems.filter((_: any, i: number) => i !== index)
                          handleFieldChange(moduleId, field.id, newItems)
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {typeof item === "object" ? (
                        Object.entries(item).map(([key, itemValue]) => (
                          <div key={key} className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-sage-700 min-w-[80px] capitalize">
                              {key.replace(/_/g, " ")}:
                            </span>
                            <Input
                              value={String(itemValue)}
                              onChange={(e) => {
                                const newItems = [...listItems]
                                newItems[index] = { ...item, [key]: e.target.value }
                                handleFieldChange(moduleId, field.id, newItems)
                              }}
                              className="flex-1"
                              type={key === "age" ? "number" : "text"}
                            />
                          </div>
                        ))
                      ) : (
                        <Input
                          value={String(item)}
                          onChange={(e) => {
                            const newItems = [...listItems]
                            newItems[index] = e.target.value
                            handleFieldChange(moduleId, field.id, newItems)
                          }}
                        />
                      )}
                    </div>
                  </Card>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    let newItem
                    if (field.id === "children") {
                      newItem = { name: "", age: "", description: "" }
                    } else if (field.id === "emergency_contacts") {
                      newItem = { name: "", relationship: "", phone: "" }
                    } else {
                      // Use sample data structure if available
                      const sampleItem = Array.isArray(field.sampleData) && field.sampleData[0]
                      if (typeof sampleItem === "object" && sampleItem !== null) {
                        newItem = Object.keys(sampleItem).reduce((acc, key) => ({ ...acc, [key]: "" }), {})
                      } else {
                        newItem = ""
                      }
                    }
                    handleFieldChange(moduleId, field.id, [...listItems, newItem])
                  }}
                  className="w-full border-dashed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add {field.id === "children" ? "Child" : "Item"}
                </Button>
              </div>
            )
          }

        case "boolean":
          return (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={field.id}
                  checked={Boolean(value)}
                  onCheckedChange={(checked) => {
                    console.log(`📝 Boolean field ${moduleId}.${field.id} changed to:`, checked)
                    handleFieldChange(moduleId, field.id, checked)
                  }}
                />
                <Label htmlFor={field.id} className="text-sm font-medium text-gray-700">
                  {field.name}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
              </div>
              {hasError && <p className="text-sm text-red-600">{hasError}</p>}
            </div>
          )

        default:
          return (
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">{field.name}</Label>
              <div className="p-3 bg-sage-50 rounded-md border border-sage-200">
                {typeof value === "object" && value !== null ? (
                  <div className="space-y-2">
                    {Array.isArray(value) ? (
                      // Handle arrays
                      value.length === 0 ? (
                        <span className="text-sm text-sage-500 italic">Empty array</span>
                      ) : (
                        <div className="space-y-1">
                          {value.map((item, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <Badge variant="outline" className="text-xs font-mono bg-sage-100 mt-0.5">
                                {index + 1}
                              </Badge>
                              <div className="flex-1">
                                {typeof item === "object" && item !== null ? (
                                  <div className="text-sm text-sage-700 space-y-1">
                                    {Object.entries(item).map(([key, val]) => (
                                      <div key={key} className="flex">
                                        <span className="font-medium min-w-[80px] text-sage-600">
                                          {key.replace(/_/g, " ")}:
                                        </span>
                                        <span className="ml-2">{String(val)}</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-sm text-sage-700">{String(item)}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    ) : (
                      // Handle objects
                      <div className="space-y-1">
                        {Object.entries(value).map(([key, val]) => (
                          <div key={key} className="flex items-start">
                            <span className="text-sm font-medium text-sage-600 min-w-[120px] capitalize">
                              {key.replace(/_/g, " ")}:
                            </span>
                            <span className="text-sm text-sage-700 ml-2 flex-1">
                              {typeof val === "object" && val !== null ? JSON.stringify(val, null, 2) : String(val)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <code className="text-sm text-sage-700">{String(value)}</code>
                )}
              </div>
            </div>
          )
      }
    })()

    return (
      <div className="space-y-2">
        {fieldComponent}
        {field.evolvable && (
          <div className="flex items-center space-x-1 text-xs text-therapeutic-lavender">
            <Zap className="h-3 w-3" />
            <span>This field can evolve during therapy</span>
          </div>
        )}
      </div>
    )
  }

  const getTotalFieldCount = () => {
    return availableModules.reduce((total, module) => total + module.config.fields.length, 0)
  }

  const getTotalRequiredFields = () => {
    return availableModules.reduce((total, module) => total + module.config.fields.filter((f) => f.required).length, 0)
  }

  const getTotalEvolvableFields = () => {
    return availableModules.reduce((total, module) => total + module.config.fields.filter((f) => f.evolvable).length, 0)
  }

  const getTotalFilledFields = () => {
    return Object.values(moduleData).reduce((total, moduleFields) => total + Object.keys(moduleFields).length, 0)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-light text-sage-900 flex items-center">
              {isEditMode ? (
                <>
                  <Edit className="h-5 w-5 mr-2 text-sage-600" />
                  Edit Patient Case
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5 mr-2 text-sage-600" />
                  Patient Case Generator
                </>
              )}
            </DialogTitle>
            {isEditMode && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Editing: {editingCase?.id}
              </Badge>
            )}
          </div>
        </DialogHeader>

        {!isEditMode && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="template" className="flex items-center space-x-2">
                <FileTemplate className="h-4 w-4" />
                <span>Use Template</span>
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Manual Entry</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="template" className="space-y-6">
              {/* Template Selection */}
              <Card className="border-sage-100 rounded-organic-lg bg-gradient-to-r from-therapeutic-beige/20 to-sage-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-therapeutic-beige rounded-organic-md">
                      <FileTemplate className="h-5 w-5 text-warm-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-medium text-sage-900">Choose Patient Template</CardTitle>
                      <CardDescription className="text-sage-600">
                        Select a pre-configured patient profile with realistic data for quick testing
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {PATIENT_TEMPLATES.map((template) => (
                      <Card
                        key={template.id}
                        className={`border-2 cursor-pointer transition-all hover:shadow-md ${
                          selectedTemplate === template.id
                            ? "border-sage-300 bg-sage-50"
                            : "border-sage-100 hover:border-sage-200"
                        }`}
                        onClick={() => handleTemplateSelect(template.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base font-medium text-sage-900">{template.name}</CardTitle>
                            {selectedTemplate === template.id && <CheckCircle className="h-5 w-5 text-sage-600" />}
                          </div>
                          <CardDescription className="text-sm text-sage-600">{template.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              {template.complexity}
                            </Badge>
                            <span className="text-xs text-sage-500">
                              {Object.values(template.data).reduce(
                                (total, moduleFields) => total + Object.keys(moduleFields).length,
                                0,
                              )}{" "}
                              fields
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {selectedTemplate && (
                    <div className="mt-4 p-4 bg-sage-50 rounded-organic-lg border border-sage-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Copy className="h-4 w-4 text-sage-600" />
                        <span className="text-sm font-medium text-sage-700">Template Loaded:</span>
                      </div>
                      <p className="text-sm text-sage-600">
                        {PATIENT_TEMPLATES.find((t) => t.id === selectedTemplate)?.name} has been loaded with{" "}
                        {getTotalFilledFields()} pre-filled fields organized by modules. You can modify any field below
                        or generate the case as-is.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Show form fields if template is selected */}
              {selectedTemplate && (
                <>
                  {/* Case Management Section */}
                  <Card className="border-sage-100 rounded-organic-lg bg-gradient-to-r from-warm-50 to-therapeutic-beige/30">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-warm-100 rounded-organic-md">
                          <Tag className="h-5 w-5 text-warm-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-medium text-sage-900">Case Management</CardTitle>
                          <CardDescription className="text-sage-600">
                            Case identification and organizational information
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="case-id" className="text-sm font-medium text-sage-700">
                              Case ID (Database ID)
                            </Label>
                            {!isEditMode && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setCaseId(generateUniqueCaseId())}
                                className="text-xs text-sage-600 hover:text-sage-800"
                              >
                                <Hash className="h-3 w-3 mr-1" />
                                Generate New
                              </Button>
                            )}
                          </div>
                          <Input
                            id="case-id"
                            value={caseId}
                            onChange={(e) => setCaseId(e.target.value)}
                            placeholder="CASE-2024-001"
                            className="w-full"
                            disabled={isEditMode} // Can't change ID when editing
                          />
                          <p className="text-xs text-sage-500">
                            {isEditMode
                              ? "Case ID cannot be changed when editing"
                              : "This will be used as the database ID for this case"}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="case-name" className="text-sm font-medium text-sage-700">
                            Case Name
                            <span className="text-red-500 ml-1">*</span>
                          </Label>
                          <Input
                            id="case-name"
                            value={caseName}
                            onChange={(e) => {
                              setCaseName(e.target.value)
                              // Clear validation error when user starts typing
                              if (validationErrors.caseName && e.target.value.trim()) {
                                setValidationErrors((prev) => {
                                  const newErrors = { ...prev }
                                  delete newErrors.caseName
                                  return newErrors
                                })
                              }
                            }}
                            placeholder="Depression and Anxiety Issues (Age 28)"
                            className={`w-full ${validationErrors.caseName ? "border-red-300 focus:border-red-500" : ""}`}
                          />
                          {validationErrors.caseName && (
                            <p className="text-sm text-red-600">{validationErrors.caseName}</p>
                          )}
                          <p className="text-xs text-sage-500">Descriptive name for easy identification</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Template Data Preview */}
                  <Card className="border-sage-100 rounded-organic-lg">
                    <CardHeader className="pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-sage-100 rounded-organic-md">
                          <Brain className="h-5 w-5 text-sage-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-medium text-sage-900">Template Data Preview</CardTitle>
                          <CardDescription className="text-sage-600">
                            Review and modify the pre-filled patient information organized by modules
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 pt-2">
                        <Badge variant="outline" className="bg-sage-50">
                          {getTotalFilledFields()} Fields Pre-filled
                        </Badge>
                        <Badge variant="outline" className="bg-therapeutic-beige/20 text-warm-700">
                          Template: {PATIENT_TEMPLATES.find((t) => t.id === selectedTemplate)?.name}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Structured Data
                        </Badge>
                      </div>
                    </CardHeader>
                  </Card>
                </>
              )}
            </TabsContent>

            <TabsContent value="manual" className="space-y-6">
              {/* Case Management Section */}
              <Card className="border-sage-100 rounded-organic-lg bg-gradient-to-r from-warm-50 to-therapeutic-beige/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-warm-100 rounded-organic-md">
                      <Tag className="h-5 w-5 text-warm-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-medium text-sage-900">Case Management</CardTitle>
                      <CardDescription className="text-sage-600">
                        Case identification and organizational information
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="case-id" className="text-sm font-medium text-sage-700">
                          Case ID (Database ID)
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCaseId(generateUniqueCaseId())}
                          className="text-xs text-sage-600 hover:text-sage-800"
                        >
                          <Hash className="h-3 w-3 mr-1" />
                          Generate New
                        </Button>
                      </div>
                      <Input
                        id="case-id"
                        value={caseId}
                        onChange={(e) => setCaseId(e.target.value)}
                        placeholder="CASE-2024-001"
                        className="w-full"
                      />
                      <p className="text-xs text-sage-500">This will be used as the database ID for this case</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="case-name" className="text-sm font-medium text-sage-700">
                        Case Name
                        <span className="text-red-500 ml-1">*</span>
                      </Label>
                      <Input
                        id="case-name"
                        value={caseName}
                        onChange={(e) => {
                          setCaseName(e.target.value)
                          // Clear validation error when user starts typing
                          if (validationErrors.caseName && e.target.value.trim()) {
                            setValidationErrors((prev) => {
                              const newErrors = { ...prev }
                              delete newErrors.caseName
                              return newErrors
                            })
                          }
                        }}
                        placeholder="Depression and Anxiety Issues (Age 28)"
                        className={`w-full ${validationErrors.caseName ? "border-red-300 focus:border-red-500" : ""}`}
                      />
                      {validationErrors.caseName && <p className="text-sm text-red-600">{validationErrors.caseName}</p>}
                      <p className="text-xs text-sage-500">Descriptive name for easy identification</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Overview */}
              <Card className="border-sage-100 rounded-organic-lg bg-gradient-to-r from-sage-50 to-therapeutic-beige/30">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-sage-100 rounded-organic-md">
                        <Users className="h-5 w-5 text-sage-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-medium text-sage-900">Patient Information Modules</CardTitle>
                        <CardDescription className="text-sage-600">
                          Complete patient profile using all {availableModules.length} available modules with structured
                          data organization
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 pt-2">
                    <Badge variant="outline" className="bg-sage-50">
                      {getTotalFieldCount()} Total Fields Available
                    </Badge>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                      {getTotalFilledFields()} Fields Filled
                    </Badge>
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                      {getTotalRequiredFields()} Required
                    </Badge>
                    <Badge variant="outline" className="bg-therapeutic-lavender/20 text-therapeutic-lavender">
                      <Zap className="h-3 w-3 mr-1" />
                      {getTotalEvolvableFields()} Evolvable
                    </Badge>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Structured Data v2.0
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        {/* For edit mode, show case management section directly */}
        {isEditMode && (
          <div className="space-y-6">
            {/* Case Management Section for Edit Mode */}
            <Card className="border-sage-100 rounded-organic-lg bg-gradient-to-r from-warm-50 to-therapeutic-beige/30">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-warm-100 rounded-organic-md">
                    <Tag className="h-5 w-5 text-warm-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-medium text-sage-900">Case Management</CardTitle>
                    <CardDescription className="text-sage-600">
                      Case identification and organizational information
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="case-id" className="text-sm font-medium text-sage-700">
                      Case ID (Database ID)
                    </Label>
                    <Input id="case-id" value={caseId} className="w-full" disabled={true} />
                    <p className="text-xs text-sage-500">Case ID cannot be changed when editing</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="case-name" className="text-sm font-medium text-sage-700">
                      Case Name
                      <span className="text-red-500 ml-1">*</span>
                    </Label>
                    <Input
                      id="case-name"
                      value={caseName}
                      onChange={(e) => {
                        setCaseName(e.target.value)
                        // Clear validation error when user starts typing
                        if (validationErrors.caseName && e.target.value.trim()) {
                          setValidationErrors((prev) => {
                            const newErrors = { ...prev }
                            delete newErrors.caseName
                            return newErrors
                          })
                        }
                      }}
                      placeholder="Depression and Anxiety Issues (Age 28)"
                      className={`w-full ${validationErrors.caseName ? "border-red-300 focus:border-red-500" : ""}`}
                    />
                    {validationErrors.caseName && <p className="text-sm text-red-600">{validationErrors.caseName}</p>}
                    <p className="text-xs text-sage-500">Descriptive name for easy identification</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edit Mode Overview */}
            <Card className="border-sage-100 rounded-organic-lg bg-gradient-to-r from-blue-50 to-therapeutic-beige/30">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-organic-md">
                    <Edit className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-medium text-sage-900">Editing Patient Case</CardTitle>
                    <CardDescription className="text-sage-600">
                      Modify existing patient information across all {availableModules.length} available modules with
                      structured data
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    Editing: {editingCase?.id}
                  </Badge>
                  <Badge variant="outline" className="bg-sage-50">
                    {getTotalFieldCount()} Total Fields Available
                  </Badge>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {getTotalFilledFields()} Fields Loaded
                  </Badge>
                  <Badge variant="outline" className="bg-therapeutic-lavender/20 text-therapeutic-lavender">
                    <Zap className="h-3 w-3 mr-1" />
                    {getTotalEvolvableFields()} Evolvable
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    Structured Data v2.0
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Show form fields for both tabs when data exists or in edit mode */}
        {(selectedTemplate || activeTab === "manual" || isEditMode) && (
          <>
            {/* Validation Errors Summary */}
            {Object.keys(validationErrors).length > 0 && (
              <Card className="border-red-200 rounded-organic-lg bg-red-50">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-organic-md">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-medium text-red-900">Validation Errors</CardTitle>
                      <CardDescription className="text-red-700">
                        Please fix the following {Object.keys(validationErrors).length} error(s) before{" "}
                        {isEditMode ? "saving" : "generating"} the case
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(validationErrors).map(([fieldKey, error]) => {
                      // Get the actual field name from the module configuration
                      let displayName = fieldKey
                      if (fieldKey === "caseName") {
                        displayName = "Case Name"
                      } else if (fieldKey.includes(".")) {
                        const [moduleId, fieldId] = fieldKey.split(".")
                        // Find the field in the module
                        const module = availableModules.find((m) => m.id === moduleId)
                        if (module) {
                          const field = module.config.fields.find((f) => f.id === fieldId)
                          if (field) {
                            displayName = `${module.config.name}: ${field.name}`
                          }
                        }
                      }

                      return (
                        <div key={fieldKey} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                          <span className="font-medium text-red-800">{displayName}:</span>
                          <span className="text-red-700">{error}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Form Fields - All Modules with Collapsible Sections */}
            {loadingModules ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-sage-600" />
                <span className="ml-2 text-sage-600">Loading available modules...</span>
              </div>
            ) : (
              availableModules.map((module) => {
                const moduleFields = moduleData[module.id] || {}
                const filledFieldsCount = Object.keys(moduleFields).length

                return (
                  <Collapsible
                    key={module.id}
                    open={expandedModules[module.id]}
                    onOpenChange={() => toggleModule(module.id)}
                  >
                    <Card className="border-sage-100 rounded-organic-lg">
                      <CollapsibleTrigger asChild>
                        <CardHeader className="pb-4 cursor-pointer hover:bg-sage-50/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-organic-md ${module.color}`}>
                                <Brain className="h-5 w-5" />
                              </div>
                              <div>
                                <CardTitle className="text-lg font-medium text-sage-900">
                                  {module.config.name}
                                </CardTitle>
                                <CardDescription className="text-sage-600">{module.config.description}</CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {expandedModules[module.id] ? (
                                <ChevronDown className="h-5 w-5 text-sage-600" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-sage-600" />
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 pt-2">
                            <Badge variant="outline" className="text-xs">
                              {module.config.fields.length} Fields
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                              {filledFieldsCount} Filled
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                              {module.config.fields.filter((f) => f.required).length} Required
                            </Badge>
                            <Badge
                              variant="outline"
                              className="text-xs bg-therapeutic-lavender/20 text-therapeutic-lavender border-therapeutic-lavender/30"
                            >
                              <Zap className="h-3 w-3 mr-1" />
                              {module.config.fields.filter((f) => f.evolvable).length} Evolvable
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                              Module: {module.id}
                            </Badge>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="border-t border-sage-100 pt-4">
                            <div className="columns-1 md:columns-2 gap-6 space-y-6">
                              {/* Render ALL fields from this module */}
                              {module.config.fields.map((field) => (
                                <Card
                                  key={field.id}
                                  className="border-sage-100 rounded-organic-lg break-inside-avoid mb-6"
                                >
                                  <CardContent className="p-4">{renderField(module.id, field)}</CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                )
              })
            )}
          </>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-sage-200">
          <div className="flex items-center space-x-2 text-sm text-sage-600">
            {Object.keys(validationErrors).length > 0 ? (
              <>
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-red-600">
                  {Object.keys(validationErrors).length} validation error(s): {Object.keys(validationErrors).join(", ")}
                </span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 text-sage-500" />
                <span>
                  Ready to {isEditMode ? "save changes" : "generate case"} with {getTotalFilledFields()} fields filled
                  out of {getTotalFieldCount()} available across {availableModules.length} modules
                  {selectedTemplate && !isEditMode && (
                    <span className="text-therapeutic-beige">
                      {" "}
                      • Using template: {PATIENT_TEMPLATES.find((t) => t.id === selectedTemplate)?.name}
                    </span>
                  )}
                  {isEditMode && <span className="text-blue-600"> • Editing case: {editingCase?.id}</span>}
                  <span className="text-green-600"> • Structured Data v2.0</span>
                </span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" onClick={onClose} disabled={isGenerating}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                isGenerating ||
                Object.keys(validationErrors).length > 0 ||
                (!selectedTemplate && activeTab === "template" && !isEditMode)
              }
              className="bg-sage-600 hover:bg-sage-700 text-white"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {isEditMode ? "Saving..." : "Generating..."}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode
                    ? `Save Changes (${getTotalFilledFields()} fields)`
                    : `Generate & Save Case (${getTotalFilledFields()} fields)`}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
