"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import {
  User,
  Brain,
  Heart,
  Briefcase,
  History,
  Users,
  Shield,
  Settings,
  Eye,
  Code,
  Zap,
  MoreHorizontal,
  Edit,
  Power,
  Download,
  Upload,
  RotateCcw,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  AlertTriangle,
} from "lucide-react"

// Import all module components
import { BasicInformationModule } from "@/components/patient-modules/basic-information/BasicInformationModule"
import { BehavioralPatternsModule } from "@/components/patient-modules/behavioral-patterns/BehavioralPatternsModule"
import { CognitiveEmotionalPatternsModule } from "@/components/patient-modules/cognitive-emotional-patterns/CognitiveEmotionalPatternsModule"
import { WorkCareerModule } from "@/components/patient-modules/work-career/WorkCareerModule"
import { MentalHealthHistoryModule } from "@/components/patient-modules/mental-health-history/MentalHealthHistoryModule"
import { FamilyDynamicsModule } from "@/components/patient-modules/family-dynamics/FamilyDynamicsModule"
import { TraumaHistoryModule } from "@/components/patient-modules/trauma-history/TraumaHistoryModule"

// Import module configs for stats
import { BASIC_INFORMATION_MODULE } from "@/components/patient-modules/basic-information/config"
import { BEHAVIORAL_PATTERNS_MODULE } from "@/components/patient-modules/behavioral-patterns/config"
import { COGNITIVE_EMOTIONAL_PATTERNS_MODULE } from "@/components/patient-modules/cognitive-emotional-patterns/config"
import { WORK_CAREER_MODULE } from "@/components/patient-modules/work-career/config"
import { MENTAL_HEALTH_HISTORY_MODULE } from "@/components/patient-modules/mental-health-history/config"
import { FAMILY_DYNAMICS_MODULE } from "@/components/patient-modules/family-dynamics/config"
import { TRAUMA_HISTORY_MODULE } from "@/components/patient-modules/trauma-history/config"

// Import server actions
import {
  getModuleSettings,
  toggleModuleEnabled,
  resetModuleSettingsToDefaults,
  exportModuleSettings,
  importModuleSettings,
  type ModuleSettings,
} from "@/lib/actions/module-settings"

// Static module definitions (structure stays in code)
const STATIC_MODULES = [
  {
    id: "basic_information",
    name: "Basic Information",
    description: "Demographics, personal details, and core patient information",
    icon: User,
    color: "sage",
    borderColor: "border-sage-200",
    bgColor: "bg-sage-50",
    textColor: "text-sage-700",
    component: BasicInformationModule,
    config: BASIC_INFORMATION_MODULE,
    category: "foundation",
    isCore: true,
  },
  {
    id: "behavioral_patterns",
    name: "Behavioral Patterns",
    description: "Observable behaviors, habits, and behavioral responses",
    icon: Brain,
    color: "blue",
    borderColor: "border-blue-200",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
    component: BehavioralPatternsModule,
    config: BEHAVIORAL_PATTERNS_MODULE,
    category: "clinical",
    isCore: true,
  },
  {
    id: "cognitive_emotional_patterns",
    name: "Cognitive & Emotional Patterns",
    description: "Thought patterns, emotional responses, and cognitive styles",
    icon: Heart,
    color: "purple",
    borderColor: "border-purple-200",
    bgColor: "bg-purple-50",
    textColor: "text-purple-700",
    component: CognitiveEmotionalPatternsModule,
    config: COGNITIVE_EMOTIONAL_PATTERNS_MODULE,
    category: "clinical",
    isCore: true,
  },
  {
    id: "work_career",
    name: "Work & Career",
    description: "Professional life, career history, and work-related concerns",
    icon: Briefcase,
    color: "orange",
    borderColor: "border-orange-200",
    bgColor: "bg-orange-50",
    textColor: "text-orange-700",
    component: WorkCareerModule,
    config: WORK_CAREER_MODULE,
    category: "contextual",
    isCore: true,
  },
  {
    id: "mental_health_history",
    name: "Mental Health History",
    description: "Previous diagnoses, treatments, medications, and therapeutic history",
    icon: History,
    color: "teal",
    borderColor: "border-teal-200",
    bgColor: "bg-teal-50",
    textColor: "text-teal-700",
    component: MentalHealthHistoryModule,
    config: MENTAL_HEALTH_HISTORY_MODULE,
    category: "clinical",
    isCore: true,
  },
  {
    id: "family_dynamics",
    name: "Family Dynamics",
    description: "Family relationships, dynamics, history, and support systems",
    icon: Users,
    color: "green",
    borderColor: "border-green-200",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
    component: FamilyDynamicsModule,
    config: FAMILY_DYNAMICS_MODULE,
    category: "contextual",
    isCore: true,
  },
  {
    id: "trauma_history",
    name: "Trauma History",
    description: "Past traumatic experiences, their impact, and current trauma-related symptoms",
    icon: Shield,
    color: "red",
    borderColor: "border-red-200",
    bgColor: "bg-red-50",
    textColor: "text-red-700",
    component: TraumaHistoryModule,
    config: TRAUMA_HISTORY_MODULE,
    category: "clinical",
    isCore: true,
  },
]

export default function PatientArchitecturePage() {
  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [moduleSettings, setModuleSettings] = useState<ModuleSettings[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [editingModule, setEditingModule] = useState<any>(null)
  const [resetConfirmModule, setResetConfirmModule] = useState<string | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [importPreview, setImportPreview] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Load module settings from database
  useEffect(() => {
    loadModuleSettings()
  }, [])

  const loadModuleSettings = async () => {
    setLoading(true)
    try {
      const settings = await getModuleSettings()
      setModuleSettings(settings)
    } catch (error) {
      console.error("Error loading module settings:", error)
      toast({
        title: "Error",
        description: "Failed to load module settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Combine static module definitions with database settings
  const getModulesWithSettings = () => {
    return STATIC_MODULES.map((staticModule) => {
      const settings = moduleSettings.find((s) => s.module_id === staticModule.id)
      return {
        ...staticModule,
        enabled: settings?.enabled ?? true,
        displayOrder: settings?.display_order ?? 0,
        updatedAt: settings?.updated_at,
        updatedBy: settings?.updated_by,
      }
    }).sort((a, b) => a.displayOrder - b.displayOrder)
  }

  const handleToggleModule = async (moduleId: string, currentEnabled: boolean) => {
    setUpdating(moduleId)
    try {
      const success = await toggleModuleEnabled(moduleId, !currentEnabled, "current-user") // TODO: Get actual user ID

      if (success) {
        // Update local state
        setModuleSettings((prev) =>
          prev.map((setting) =>
            setting.module_id === moduleId
              ? { ...setting, enabled: !currentEnabled, updated_at: new Date().toISOString() }
              : setting,
          ),
        )

        const module = STATIC_MODULES.find((m) => m.id === moduleId)
        toast({
          title: `Module ${!currentEnabled ? "Enabled" : "Disabled"}`,
          description: `${module?.name} has been ${!currentEnabled ? "enabled" : "disabled"}`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update module settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error toggling module:", error)
      toast({
        title: "Error",
        description: "Failed to update module settings",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const handleEditModule = (moduleId: string) => {
    const staticModule = STATIC_MODULES.find((m) => m.id === moduleId)
    const settings = moduleSettings.find((s) => s.module_id === moduleId)

    if (staticModule) {
      setEditingModule({
        ...staticModule,
        enabled: settings?.enabled ?? true,
        displayOrder: settings?.display_order ?? 0,
      })
      setIsEditDialogOpen(true)
    }
  }

  const handleSaveModuleSettings = async () => {
    if (!editingModule) return

    setUpdating(editingModule.id)
    try {
      const success = await toggleModuleEnabled(editingModule.id, editingModule.enabled, "current-user")

      if (success) {
        // Update local state
        setModuleSettings((prev) =>
          prev.map((setting) =>
            setting.module_id === editingModule.id
              ? {
                  ...setting,
                  enabled: editingModule.enabled,
                  display_order: editingModule.displayOrder,
                  updated_at: new Date().toISOString(),
                }
              : setting,
          ),
        )

        toast({
          title: "Module Updated",
          description: `${editingModule.name} settings have been saved`,
        })

        setIsEditDialogOpen(false)
        setEditingModule(null)
      } else {
        toast({
          title: "Error",
          description: "Failed to update module settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error saving module settings:", error)
      toast({
        title: "Error",
        description: "Failed to update module settings",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const handleResetToDefaults = async (moduleId: string) => {
    setUpdating(moduleId)
    try {
      const success = await resetModuleSettingsToDefaults(moduleId, "current-user")

      if (success) {
        // Reload settings from database
        await loadModuleSettings()

        const module = STATIC_MODULES.find((m) => m.id === moduleId)
        toast({
          title: "Module Reset",
          description: `${module?.name} has been reset to default settings`,
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to reset module settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error resetting module:", error)
      toast({
        title: "Error",
        description: "Failed to reset module settings",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
      setResetConfirmModule(null)
    }
  }

  const handleExportAllSettings = async () => {
    try {
      const exportData = await exportModuleSettings()

      if (exportData) {
        // Create and download JSON file
        const dataStr = JSON.stringify(exportData, null, 2)
        const dataBlob = new Blob([dataStr], { type: "application/json" })
        const url = URL.createObjectURL(dataBlob)
        const link = document.createElement("a")
        link.href = url
        link.download = `patient-architecture-settings-${new Date().toISOString().split("T")[0]}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast({
          title: "Settings Exported",
          description: `Module settings have been exported successfully`,
        })
      } else {
        toast({
          title: "Export Failed",
          description: "Failed to export module settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error exporting settings:", error)
      toast({
        title: "Export Failed",
        description: "An error occurred while exporting settings",
        variant: "destructive",
      })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "application/json") {
      toast({
        title: "Invalid File Type",
        description: "Please select a JSON file",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data = JSON.parse(content)

        // Validate the imported data
        if (data.settings && Array.isArray(data.settings)) {
          setImportPreview(data)
          setIsImportDialogOpen(true)
        } else {
          throw new Error("Invalid file format")
        }
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Invalid JSON file or unsupported format",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleImportConfirm = async () => {
    if (!importPreview) return

    try {
      const success = await importModuleSettings(importPreview, "current-user")

      if (success) {
        // Reload settings from database
        await loadModuleSettings()

        toast({
          title: "Import Successful",
          description: `Imported ${importPreview.settings.length} module settings successfully`,
        })

        setIsImportDialogOpen(false)
        setImportPreview(null)
      } else {
        toast({
          title: "Import Failed",
          description: "Failed to import module settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error importing settings:", error)
      toast({
        title: "Import Failed",
        description: "An error occurred while importing the settings",
        variant: "destructive",
      })
    }
  }

  const modulesWithSettings = getModulesWithSettings()
  const enabledModules = modulesWithSettings.filter((m) => m.enabled)
  const totalFields = modulesWithSettings.reduce((sum, module) => sum + module.config.fields.length, 0)
  const enabledFields = enabledModules.reduce((sum, module) => sum + module.config.fields.length, 0)
  const totalEvolvable = modulesWithSettings.reduce(
    (sum, module) => sum + module.config.fields.filter((f) => f.evolvable).length,
    0,
  )
  const enabledEvolvable = enabledModules.reduce(
    (sum, module) => sum + module.config.fields.filter((f) => f.evolvable).length,
    0,
  )

  // Filter modules by category
  const foundationModules = modulesWithSettings.filter((m) => m.category === "foundation")
  const clinicalModules = modulesWithSettings.filter((m) => m.category === "clinical")
  const contextualModules = modulesWithSettings.filter((m) => m.category === "contextual")

  const selectedModuleData = modulesWithSettings.find((m) => m.id === selectedModule)

  const renderModuleGrid = (moduleList: typeof modulesWithSettings) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {moduleList.map((module) => {
        const Icon = module.icon
        const evolvableCount = module.config.fields.filter((f) => f.evolvable).length
        const requiredCount = module.config.fields.filter((f) => f.required).length
        const isUpdating = updating === module.id

        return (
          <Card
            key={module.id}
            className={`${module.borderColor} rounded-organic-xl hover:shadow-lg transition-all duration-200 relative ${
              !module.enabled ? "opacity-60" : ""
            }`}
          >
            {/* Status Indicator */}
            <div className="absolute top-4 right-4 z-10">
              {module.enabled ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-gray-400" />
              )}
            </div>

            {/* Core Module Badge */}
            {module.isCore && (
              <div className="absolute top-4 left-4 z-10">
                <Badge variant="outline" className="bg-white text-xs">
                  Core
                </Badge>
              </div>
            )}

            <CardHeader className={`${module.bgColor} rounded-t-organic-xl`}>
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-white rounded-organic-lg shadow-sm group-hover:shadow-md transition-shadow">
                  <Icon className={`h-6 w-6 ${module.textColor}`} />
                </div>
                <div className="flex-1 pr-8">
                  <CardTitle className="text-lg font-semibold text-gray-900">{module.name}</CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline" className="bg-white text-gray-700 text-xs">
                      {module.config.fields.length} Fields
                    </Badge>
                    {requiredCount > 0 && (
                      <Badge variant="outline" className="bg-white text-gray-700 text-xs">
                        {requiredCount} Required
                      </Badge>
                    )}
                    {evolvableCount > 0 && (
                      <Badge variant="lavender" className="text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        {evolvableCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <CardDescription className="text-gray-600 mb-4 leading-relaxed">{module.description}</CardDescription>

              <div className="space-y-3">
                {/* Enable/Disable Toggle */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-organic-md">
                  <div className="flex items-center space-x-3">
                    <div className="text-sm font-medium text-gray-900">{module.enabled ? "Enabled" : "Disabled"}</div>
                    {module.updatedAt && (
                      <div className="text-xs text-gray-500">
                        Updated {new Date(module.updatedAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-sage-600" />}
                    <Switch
                      checked={module.enabled}
                      onCheckedChange={() => handleToggleModule(module.id, module.enabled)}
                      disabled={isUpdating}
                    />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 rounded-organic-md bg-transparent"
                        onClick={() => setSelectedModule(module.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-3">
                          <Icon className={`h-6 w-6 ${module.textColor}`} />
                          <span>{module.name}</span>
                          {!module.enabled && (
                            <Badge variant="outline" className="text-gray-500">
                              Disabled
                            </Badge>
                          )}
                        </DialogTitle>
                        <DialogDescription>{module.description}</DialogDescription>
                      </DialogHeader>
                      <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                        {selectedModuleData && <selectedModuleData.component />}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="rounded-organic-md">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => handleEditModule(module.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Settings
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleToggleModule(module.id, module.enabled)}>
                        <Power className="h-4 w-4 mr-2" />
                        {module.enabled ? "Disable" : "Enable"} Module
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setResetConfirmModule(module.id)}>
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset to Defaults
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Field Preview */}
                <div className="text-xs text-gray-500 space-y-1">
                  <div className="font-medium">Sample Fields:</div>
                  <div className="space-y-0.5">
                    {module.config.fields.slice(0, 3).map((field) => (
                      <div key={field.id} className="flex items-center justify-between">
                        <span className="truncate">{field.name}</span>
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {field.type}
                          </Badge>
                          {field.evolvable && (
                            <Badge variant="lavender" className="text-xs px-1 py-0">
                              <Zap className="h-2 w-2" />
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {module.config.fields.length > 3 && (
                      <div className="text-center text-gray-400 text-xs">
                        +{module.config.fields.length - 3} more fields
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )

  if (loading) {
    return (
      <AdminLayout title="Patient Architecture">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-sage-600" />
            <p className="text-sage-600">Loading module settings...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Patient Architecture">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light text-gray-900">Patient Architecture</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Configure which modules are available for patient case generation. Enable or disable modules to control what
            appears in the case generation form.
          </p>

          {/* Global Stats */}
          <div className="flex items-center justify-center space-x-6 pt-4">
            <Badge variant="outline" className="bg-white text-gray-700 px-4 py-2">
              {modulesWithSettings.length} Total Modules
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-2">
              {enabledModules.length} Enabled
            </Badge>
            <Badge variant="outline" className="bg-white text-gray-700 px-4 py-2">
              {enabledFields} / {totalFields} Fields Available
            </Badge>
            <Badge variant="outline" className="bg-therapeutic-lavender/20 text-therapeutic-lavender px-4 py-2">
              <Zap className="h-4 w-4 mr-1" />
              {enabledEvolvable} / {totalEvolvable} Evolvable
            </Badge>
          </div>

          {/* Bulk Actions */}
          <div className="flex items-center justify-center space-x-4 pt-4">
            <Button
              onClick={handleExportAllSettings}
              variant="outline"
              className="rounded-organic-md bg-sage-50 border-sage-200 text-sage-700 hover:bg-sage-100"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Settings
            </Button>

            <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileUpload} className="hidden" />

            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="rounded-organic-md bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Settings
            </Button>

            <Button
              onClick={loadModuleSettings}
              variant="outline"
              className="rounded-organic-md bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Module Categories Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Modules ({modulesWithSettings.length})</TabsTrigger>
            <TabsTrigger value="foundation">Foundation ({foundationModules.length})</TabsTrigger>
            <TabsTrigger value="clinical">Clinical ({clinicalModules.length})</TabsTrigger>
            <TabsTrigger value="contextual">Contextual ({contextualModules.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {renderModuleGrid(modulesWithSettings)}
          </TabsContent>

          <TabsContent value="foundation" className="space-y-6">
            {renderModuleGrid(foundationModules)}
          </TabsContent>

          <TabsContent value="clinical" className="space-y-6">
            {renderModuleGrid(clinicalModules)}
          </TabsContent>

          <TabsContent value="contextual" className="space-y-6">
            {renderModuleGrid(contextualModules)}
          </TabsContent>
        </Tabs>

        {/* Architecture Overview */}
        <Card className="border-gray-200 rounded-organic-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <Code className="h-6 w-6 text-gray-600" />
              <span>System Architecture Overview</span>
            </CardTitle>
            <CardDescription>
              Understanding how the modular patient system works together to create comprehensive psychological profiles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="evolution">Evolution System</TabsTrigger>
                <TabsTrigger value="integration">AI Integration</TabsTrigger>
                <TabsTrigger value="clinical">Clinical Purpose</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Modular Design</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Each module represents a distinct aspect of psychological assessment, allowing for comprehensive
                      patient profiles while maintaining clinical accuracy and therapeutic relevance.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-sage-400 rounded-full"></div>
                        <span>Independent module configuration</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-sage-400 rounded-full"></div>
                        <span>Flexible field requirements</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-sage-400 rounded-full"></div>
                        <span>Evolvable patient characteristics</span>
                      </li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Clinical Integration</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Built with input from licensed mental health professionals to ensure clinical accuracy and
                      therapeutic appropriateness in all patient presentations.
                    </p>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-therapeutic-blue rounded-full"></div>
                        <span>Evidence-based field selection</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-therapeutic-blue rounded-full"></div>
                        <span>Trauma-informed design principles</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-therapeutic-blue rounded-full"></div>
                        <span>Culturally sensitive considerations</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="evolution" className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Evolution System</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      The evolution system allows patient characteristics to change realistically during therapy
                      sessions, reflecting the dynamic nature of psychological treatment and patient progress.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-therapeutic-lavender/30 bg-therapeutic-lavender/10">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Zap className="h-5 w-5 text-therapeutic-lavender" />
                          <h4 className="font-semibold text-gray-900">Direction Control</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Configure whether fields increase, decrease, or fluctuate during therapy sessions.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-orange-200 bg-orange-50">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Settings className="h-5 w-5 text-orange-600" />
                          <h4 className="font-semibold text-gray-900">Timing Settings</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Set when changes occur - every session, every few sessions, or based on specific triggers.
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2 mb-2">
                          <Eye className="h-5 w-5 text-green-600" />
                          <h4 className="font-semibold text-gray-900">Progress Tracking</h4>
                        </div>
                        <p className="text-sm text-gray-600">
                          Monitor how patient characteristics evolve over time to demonstrate therapeutic progress.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="integration" className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">AI Integration</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Each field includes prompt variables and clinical context to ensure AI-generated patient responses
                      are clinically accurate and therapeutically appropriate.
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-organic-lg p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Variable System</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Code className="h-4 w-4 text-gray-500" />
                        <code className="text-sm bg-white px-2 py-1 rounded border">
                          {`{{patient_trauma_screening}}`}
                        </code>
                        <span className="text-sm text-gray-600">→ Trauma screening result</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Code className="h-4 w-4 text-gray-500" />
                        <code className="text-sm bg-white px-2 py-1 rounded border">{`{{patient_trust_issues}}`}</code>
                        <span className="text-sm text-gray-600">→ Trust-related challenges</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Code className="h-4 w-4 text-gray-500" />
                        <code className="text-sm bg-white px-2 py-1 rounded border">{`{{patient_resilience}}`}</code>
                        <span className="text-sm text-gray-600">→ Resilience factors</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="clinical" className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Clinical Purpose</h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      Every field is designed with specific clinical purposes, ensuring that the simulation provides
                      meaningful learning experiences for psychology students and professionals.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Assessment Training</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>Comprehensive intake procedures</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>Risk assessment protocols</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>Diagnostic consideration practice</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900">Treatment Planning</h4>
                      <ul className="space-y-2 text-sm text-gray-600">
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Evidence-based intervention selection</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Progress monitoring strategies</span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span>Treatment adaptation skills</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Edit Module Settings Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <Settings className="h-6 w-6 text-gray-600" />
                <span>Edit Module Settings</span>
              </DialogTitle>
              <DialogDescription>
                Configure the basic settings for this module. Module structure is defined in code and cannot be changed
                here.
              </DialogDescription>
            </DialogHeader>

            {editingModule && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="module-name">Module Name</Label>
                    <Input
                      id="module-name"
                      value={editingModule.name}
                      onChange={(e) => setEditingModule({ ...editingModule, name: e.target.value })}
                      className="mt-1"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Module name is defined in code and cannot be changed</p>
                  </div>

                  <div>
                    <Label htmlFor="module-description">Description</Label>
                    <Textarea
                      id="module-description"
                      value={editingModule.description}
                      onChange={(e) => setEditingModule({ ...editingModule, description: e.target.value })}
                      className="mt-1"
                      rows={3}
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Module description is defined in code and cannot be changed
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="module-enabled"
                      checked={editingModule.enabled}
                      onCheckedChange={(checked) => setEditingModule({ ...editingModule, enabled: checked })}
                    />
                    <Label htmlFor="module-enabled">Module Enabled</Label>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-organic-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Module Statistics</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Fields:</span>
                      <span className="ml-2 font-medium">{editingModule.config.fields.length}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Required Fields:</span>
                      <span className="ml-2 font-medium">
                        {editingModule.config.fields.filter((f: any) => f.required).length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Evolvable Fields:</span>
                      <span className="ml-2 font-medium">
                        {editingModule.config.fields.filter((f: any) => f.evolvable).length}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Category:</span>
                      <span className="ml-2 font-medium capitalize">{editingModule.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveModuleSettings}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Import Settings Dialog */}
        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <Upload className="h-6 w-6 text-blue-600" />
                <span>Import Module Settings</span>
              </DialogTitle>
              <DialogDescription>
                Review the settings before importing. This will update the enable/disable status and display order for
                modules.
              </DialogDescription>
            </DialogHeader>

            {importPreview && (
              <div className="space-y-6">
                <div className="bg-blue-50 rounded-organic-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Import Preview</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Total Settings:</span>
                      <span className="ml-2 font-medium">{importPreview.settings?.length || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Export Version:</span>
                      <span className="ml-2 font-medium">{importPreview.version || "Unknown"}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Exported At:</span>
                      <span className="ml-2 font-medium">
                        {importPreview.exportedAt ? new Date(importPreview.exportedAt).toLocaleDateString() : "Unknown"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Enabled Modules:</span>
                      <span className="ml-2 font-medium">{importPreview.enabledModules || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="max-h-48 overflow-y-auto">
                  <h5 className="font-medium text-gray-900 mb-2">Settings to Import:</h5>
                  <div className="space-y-2">
                    {importPreview.settings?.map((setting: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="font-medium">{setting.module_id}</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            Order: {setting.display_order}
                          </Badge>
                          {setting.enabled ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-organic-lg p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h5 className="font-medium text-yellow-800">Important Notice</h5>
                      <p className="text-sm text-yellow-700 mt-1">
                        This will update your current module settings. Module structure and field definitions will not
                        be changed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleImportConfirm} className="bg-blue-600 hover:bg-blue-700">
                Import Settings
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reset Confirmation Dialog */}
        <AlertDialog open={!!resetConfirmModule} onOpenChange={() => setResetConfirmModule(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <span>Reset Module Settings</span>
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reset this module to default settings? This will restore the original
                enable/disable status and display order.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => resetConfirmModule && handleResetToDefaults(resetConfirmModule)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                Reset to Defaults
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Info Card */}
        <Card className="border-blue-200 rounded-organic-xl bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-100 rounded-organic-md">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">How This Works</h3>
                <p className="text-blue-800 text-sm leading-relaxed mb-3">
                  Module definitions (fields, types, validation) are stored in code for stability and version control.
                  Enable/disable settings are stored in the database for dynamic control.
                </p>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>
                    • <strong>Enabled modules</strong> appear in the case generation form
                  </li>
                  <li>
                    • <strong>Disabled modules</strong> are hidden from case generation
                  </li>
                  <li>• Changes take effect immediately for new case generation</li>
                  <li>• Existing patient cases are not affected by these settings</li>
                  <li>• Export/import allows sharing settings between environments</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
