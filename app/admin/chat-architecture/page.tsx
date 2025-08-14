"use client"
import { useState } from "react"
import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
  Mic,
  Brain,
  Eye,
  Zap,
  Heart,
  FileText,
  Palette,
  BarChart3,
  Settings,
  MoreHorizontal,
  Power,
  RotateCcw,
  CheckCircle,
  Loader2,
  RefreshCw,
  AlertTriangle,
  PowerOff,
  Play,
  ExternalLink,
} from "lucide-react"

// Import unified chat features system
import { useChatFeatures, ChatFeaturesProvider } from "@/lib/chat-features-manager"

function ChatArchitectureContent() {
  const {
    modules,
    features,
    updateModule,
    toggleModule,
    toggleFeature,
    getEnabledFeatures,
    getFeaturesByModule,
    resetToDefaults,
  } = useChatFeatures()

  const [selectedModule, setSelectedModule] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [resetConfirmModule, setResetConfirmModule] = useState<string | null>(null)
  const { toast } = useToast()

  // Icon mapping
  const iconMap = {
    voice_audio: Mic,
    ai_integration: Brain,
    supervisor_tools: Eye,
    interaction_features: Zap,
    therapeutic_tools: Heart,
    recording_documentation: FileText,
    visual_interface: Palette,
    analytics_tracking: BarChart3,
  }

  const handleToggleModule = async (moduleId: string, currentEnabled: boolean) => {
    setUpdating(moduleId)

    // Simulate API call delay
    setTimeout(() => {
      const newEnabled = !currentEnabled
      toggleModule(moduleId, newEnabled)

      const module = modules.find((m) => m.id === moduleId)
      const moduleFeatures = getFeaturesByModule(moduleId)

      toast({
        title: `Module ${newEnabled ? "Enabled" : "Disabled"}`,
        description: `${module?.name} has been ${newEnabled ? "enabled" : "disabled"}. This affects ${moduleFeatures.length} features.`,
      })
      setUpdating(null)
    }, 800)
  }

  const handleResetModule = (moduleId: string) => {
    const moduleFeatures = getFeaturesByModule(moduleId)
    moduleFeatures.forEach((feature) => {
      // Reset to default enabled state (core modules enabled, others disabled)
      const module = modules.find((m) => m.id === moduleId)
      toggleFeature(feature.id, module?.isCore || false)
    })

    toast({
      title: "Module Reset",
      description: "Module has been reset to default settings",
    })
    setResetConfirmModule(null)
  }

  const enabledModules = modules.filter((m) => m.enabled)
  const totalFeatures = features.length
  const enabledFeatures = getEnabledFeatures().length
  const totalEvolvable = features.filter((f) => f.evolvable).length
  const enabledEvolvable = getEnabledFeatures().filter((f) => f.evolvable).length

  // Filter modules by category
  const interactionModules = modules.filter((m) => m.category === "interaction")
  const intelligenceModules = modules.filter((m) => m.category === "intelligence")
  const supervisionModules = modules.filter((m) => m.category === "supervision")
  const therapeuticModules = modules.filter((m) => m.category === "therapeutic")
  const documentationModules = modules.filter((m) => m.category === "documentation")
  const interfaceModules = modules.filter((m) => m.category === "interface")
  const analyticsModules = modules.filter((m) => m.category === "analytics")

  const renderModuleGrid = (moduleList: typeof modules) => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {moduleList.map((module) => {
        const Icon = iconMap[module.id as keyof typeof iconMap] || Settings
        const isUpdating = updating === module.id
        const moduleFeatures = getFeaturesByModule(module.id)
        const enabledModuleFeatures = moduleFeatures.filter((f) => f.enabled)

        return (
          <Card
            key={module.id}
            className={`${module.borderColor} rounded-organic-xl hover:shadow-lg transition-all duration-300 relative ${
              !module.enabled ? "opacity-50 grayscale-[0.3]" : ""
            } ${isUpdating ? "scale-[0.98] shadow-sm" : ""}`}
          >
            {/* Status Indicator */}
            <div className="absolute top-4 right-4 z-10">
              {isUpdating ? (
                <Loader2 className="h-5 w-5 animate-spin text-sage-600" />
              ) : module.enabled ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <PowerOff className="h-5 w-5 text-gray-400" />
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

            <CardHeader className={`${module.bgColor} rounded-t-organic-xl ${!module.enabled ? "opacity-70" : ""}`}>
              <div className="flex items-center space-x-3">
                <div
                  className={`p-3 bg-white rounded-organic-lg shadow-sm group-hover:shadow-md transition-all duration-200 ${!module.enabled ? "opacity-60" : ""}`}
                >
                  <Icon className={`h-6 w-6 ${module.textColor} ${!module.enabled ? "opacity-50" : ""}`} />
                </div>
                <div className="flex-1 pr-8">
                  <CardTitle className={`text-lg font-semibold ${!module.enabled ? "text-gray-500" : "text-gray-900"}`}>
                    {module.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge
                      variant="outline"
                      className={`text-xs ${!module.enabled ? "bg-gray-100 text-gray-500" : "bg-white text-gray-700"}`}
                    >
                      {moduleFeatures.length} Features
                    </Badge>
                    <Badge
                      variant={enabledModuleFeatures.length > 0 ? "green" : "outline"}
                      className={`text-xs ${!module.enabled ? "opacity-50" : ""}`}
                    >
                      {enabledModuleFeatures.length} Active
                    </Badge>
                    {module.stats.requiredFeatures > 0 && (
                      <Badge
                        variant="outline"
                        className={`text-xs ${!module.enabled ? "bg-gray-100 text-gray-500" : "bg-white text-gray-700"}`}
                      >
                        {module.stats.requiredFeatures} Required
                      </Badge>
                    )}
                    {module.stats.evolvableFeatures > 0 && (
                      <Badge variant="lavender" className={`text-xs ${!module.enabled ? "opacity-50" : ""}`}>
                        <Zap className="h-3 w-3 mr-1" />
                        {module.stats.evolvableFeatures}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6">
              <CardDescription
                className={`mb-4 leading-relaxed ${!module.enabled ? "text-gray-400" : "text-gray-600"}`}
              >
                {module.description}
              </CardDescription>

              <div className="space-y-3">
                {/* Enable/Disable Toggle */}
                <div
                  className={`flex items-center justify-between p-3 rounded-organic-md transition-all duration-200 ${
                    module.enabled ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`text-sm font-medium ${module.enabled ? "text-green-900" : "text-gray-500"}`}>
                      {module.enabled ? "Enabled" : "Disabled"}
                    </div>
                    <div className={`text-xs ${module.enabled ? "text-green-600" : "text-gray-400"}`}>
                      {enabledModuleFeatures.length} of {moduleFeatures.length} features active
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={module.enabled}
                      onCheckedChange={() => handleToggleModule(module.id, module.enabled)}
                      disabled={isUpdating}
                      className={`${isUpdating ? "opacity-50" : ""}`}
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
                        disabled={isUpdating}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Features
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
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
                        {/* Module Features */}
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">Features in this Module</h4>
                              <div className="space-y-3">
                                {moduleFeatures.map((feature) => (
                                  <div
                                    key={feature.id}
                                    className={`flex items-center justify-between p-3 border rounded-organic-md transition-all duration-200 ${
                                      feature.enabled ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
                                    } ${!module.enabled ? "opacity-50" : ""}`}
                                  >
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-1">
                                        <h5
                                          className={`font-medium ${feature.enabled ? "text-gray-900" : "text-gray-600"}`}
                                        >
                                          {feature.name}
                                        </h5>
                                        {feature.enabled && (
                                          <Badge variant="green" className="text-xs">
                                            Active
                                          </Badge>
                                        )}
                                        {feature.required && (
                                          <Badge variant="outline" className="text-xs bg-red-50 text-red-600">
                                            Required
                                          </Badge>
                                        )}
                                        {feature.evolvable && (
                                          <Badge variant="lavender" className="text-xs">
                                            <Zap className="h-2 w-2 mr-1" />
                                            Evolvable
                                          </Badge>
                                        )}
                                      </div>
                                      <p
                                        className={`text-sm mb-2 ${feature.enabled ? "text-gray-600" : "text-gray-500"}`}
                                      >
                                        {feature.description}
                                      </p>
                                      {feature.clinicalPurpose && (
                                        <p
                                          className={`text-xs italic ${feature.enabled ? "text-sage-600" : "text-gray-400"}`}
                                        >
                                          Clinical Purpose: {feature.clinicalPurpose}
                                        </p>
                                      )}
                                    </div>
                                    <Switch
                                      checked={feature.enabled}
                                      onCheckedChange={(enabled) => toggleFeature(feature.id, enabled)}
                                      disabled={!module.enabled}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="rounded-organic-md" disabled={isUpdating}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
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

                {/* Feature Preview */}
                <div className={`text-xs space-y-1 ${!module.enabled ? "text-gray-400" : "text-gray-500"}`}>
                  <div className="font-medium">Active Features:</div>
                  <div className="space-y-0.5">
                    {enabledModuleFeatures.slice(0, 3).map((feature) => (
                      <div key={feature.id} className="flex items-center justify-between">
                        <span className="truncate">{feature.name}</span>
                        <div className="flex items-center space-x-1">
                          <Badge variant="outline" className="text-xs px-1 py-0">
                            {feature.type}
                          </Badge>
                          {feature.evolvable && (
                            <Badge variant="lavender" className="text-xs px-1 py-0">
                              <Zap className="h-2 w-2" />
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                    {enabledModuleFeatures.length > 3 && (
                      <div className="text-center text-gray-400 text-xs">
                        +{enabledModuleFeatures.length - 3} more active features
                      </div>
                    )}
                    {enabledModuleFeatures.length === 0 && (
                      <div className="text-center text-gray-400 text-xs italic">No features currently active</div>
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

  return (
    <AdminLayout title="Chat Architecture">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-light text-gray-900">Chat Architecture</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Configure chat modules and features that control how therapy sessions are conducted. Enable or disable
            modules to customize the chat experience for different training scenarios.
          </p>

          {/* Global Stats */}
          <div className="flex items-center justify-center space-x-6 pt-4">
            <Badge variant="outline" className="bg-white text-gray-700 px-4 py-2">
              {modules.length} Total Modules
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-4 py-2">
              {enabledModules.length} Enabled
            </Badge>
            <Badge variant="outline" className="bg-white text-gray-700 px-4 py-2">
              {enabledFeatures} / {totalFeatures} Features Active
            </Badge>
            <Badge variant="outline" className="bg-therapeutic-lavender/20 text-therapeutic-lavender px-4 py-2">
              <Zap className="h-4 w-4 mr-1" />
              {enabledEvolvable} / {totalEvolvable} Evolvable
            </Badge>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-center space-x-4 pt-4">
            <Button
              onClick={() => window.open("/simulation", "_blank")}
              className="rounded-organic-md bg-sage-600 hover:bg-sage-700"
            >
              <Play className="h-4 w-4 mr-2" />
              Try Live Session
            </Button>

            <Button
              variant="outline"
              onClick={() => window.open("/", "_blank")}
              className="rounded-organic-md bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Main App
            </Button>

            <Button
              variant="outline"
              onClick={resetToDefaults}
              className="rounded-organic-md bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
          </div>
        </div>

        {/* Module Categories Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="all">All ({modules.length})</TabsTrigger>
            <TabsTrigger value="interaction">Interaction ({interactionModules.length})</TabsTrigger>
            <TabsTrigger value="intelligence">AI ({intelligenceModules.length})</TabsTrigger>
            <TabsTrigger value="supervision">Supervision ({supervisionModules.length})</TabsTrigger>
            <TabsTrigger value="therapeutic">Therapeutic ({therapeuticModules.length})</TabsTrigger>
            <TabsTrigger value="documentation">Docs ({documentationModules.length})</TabsTrigger>
            <TabsTrigger value="interface">Interface ({interfaceModules.length})</TabsTrigger>
            <TabsTrigger value="analytics">Analytics ({analyticsModules.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {renderModuleGrid(modules)}
          </TabsContent>

          <TabsContent value="interaction" className="space-y-6">
            {renderModuleGrid(interactionModules)}
          </TabsContent>

          <TabsContent value="intelligence" className="space-y-6">
            {renderModuleGrid(intelligenceModules)}
          </TabsContent>

          <TabsContent value="supervision" className="space-y-6">
            {renderModuleGrid(supervisionModules)}
          </TabsContent>

          <TabsContent value="therapeutic" className="space-y-6">
            {renderModuleGrid(therapeuticModules)}
          </TabsContent>

          <TabsContent value="documentation" className="space-y-6">
            {renderModuleGrid(documentationModules)}
          </TabsContent>

          <TabsContent value="interface" className="space-y-6">
            {renderModuleGrid(interfaceModules)}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {renderModuleGrid(analyticsModules)}
          </TabsContent>
        </Tabs>

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
                enable/disable status for all features in this module.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-orange-600 hover:bg-orange-700"
                onClick={() => resetConfirmModule && handleResetModule(resetConfirmModule)}
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
                <h3 className="font-semibold text-blue-900 mb-2">How Chat Architecture Works</h3>
                <p className="text-blue-800 text-sm leading-relaxed mb-3">
                  Chat modules control different aspects of the therapy session experience. Enable modules to make
                  features available in your live therapy sessions.
                </p>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>
                    • <strong>Enable modules</strong> to make their features available in sessions
                  </li>
                  <li>
                    • <strong>Individual features</strong> can be toggled within enabled modules
                  </li>
                  <li>
                    • <strong>Try Live Session</strong> to see your configuration in action
                  </li>
                  <li>
                    • <strong>Changes here</strong> immediately affect all therapy sessions
                  </li>
                  <li>
                    • <strong>Core modules</strong> provide essential functionality
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}

export default function ChatArchitecturePage() {
  return (
    <ChatFeaturesProvider>
      <ChatArchitectureContent />
    </ChatFeaturesProvider>
  )
}
