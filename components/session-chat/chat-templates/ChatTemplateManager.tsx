"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Settings, Play, Copy } from "lucide-react"
import { type ChatTemplate, PRESET_TEMPLATES } from "./types"

interface ChatTemplateManagerProps {
  onSelectTemplate?: (template: ChatTemplate) => void
  onCreateNew?: () => void
  onEditTemplate?: (template: ChatTemplate) => void
}

export default function ChatTemplateManager({
  onSelectTemplate,
  onCreateNew,
  onEditTemplate,
}: ChatTemplateManagerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [templates] = useState<ChatTemplate[]>([
    // Convert preset templates to full templates with IDs
    ...PRESET_TEMPLATES.map((preset, index) => ({
      ...preset,
      id: `preset-${index}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: "system",
    })),
  ])

  const filteredTemplates = templates.filter(
    (template) => selectedCategory === "all" || template.category === selectedCategory,
  )

  const getCategoryColor = (category: ChatTemplate["category"]) => {
    switch (category) {
      case "beginner":
        return "therapeutic"
      case "intermediate":
        return "warm"
      case "advanced":
        return "sage"
      case "specialized":
        return "lavender"
      default:
        return "outline"
    }
  }

  const getEnabledFeaturesCount = (template: ChatTemplate) => {
    return Object.values(template.features).filter((feature) => feature.enabled).length
  }

  const getFeatureCategories = (template: ChatTemplate) => {
    const categories = new Set<string>()
    Object.entries(template.features).forEach(([key, feature]) => {
      if (feature.enabled) {
        if (key.includes("voice") || key.includes("speech") || key.includes("audio")) {
          categories.add("Voice")
        } else if (key.includes("ai") || key.includes("adaptive")) {
          categories.add("AI")
        } else if (key.includes("supervisor")) {
          categories.add("Supervisor")
        } else if (key.includes("therapeutic") || key.includes("mindfulness") || key.includes("breathing")) {
          categories.add("Therapeutic")
        } else if (key.includes("recording") || key.includes("transcription") || key.includes("note")) {
          categories.add("Documentation")
        } else if (key.includes("tracking") || key.includes("metrics") || key.includes("analytics")) {
          categories.add("Analytics")
        }
      }
    })
    return Array.from(categories)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-sage-900">Chat Templates</h2>
          <p className="text-sage-600 mt-1">Configure session features and save as reusable templates</p>
        </div>
        <Button onClick={onCreateNew} className="bg-sage-600 hover:bg-sage-700">
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Category Filter */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All Templates</TabsTrigger>
          <TabsTrigger value="beginner">Beginner</TabsTrigger>
          <TabsTrigger value="intermediate">Intermediate</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
          <TabsTrigger value="specialized">Specialized</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedCategory} className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-sage-900 mb-1">{template.name}</CardTitle>
                      <Badge variant={getCategoryColor(template.category)} className="mb-2">
                        {template.category}
                      </Badge>
                    </div>
                    {template.isDefault && (
                      <Badge variant="outline" className="text-xs">
                        Default
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-sm">{template.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Feature Summary */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-sage-600">Features Enabled:</span>
                      <span className="font-medium text-sage-900">
                        {getEnabledFeaturesCount(template)} / {Object.keys(template.features).length}
                      </span>
                    </div>

                    {/* Feature Categories */}
                    <div className="flex flex-wrap gap-1">
                      {getFeatureCategories(template).map((category) => (
                        <Badge key={category} variant="outline" className="text-xs">
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Key Features Preview */}
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-sage-700 mb-1">Key Features:</p>
                    <div className="text-xs text-sage-600 space-y-0.5">
                      {template.features.voiceChat.enabled && <div>• Voice conversation enabled</div>}
                      {template.features.aiPatientResponses.enabled && <div>• AI patient responses</div>}
                      {template.features.liveSupervisor.enabled && <div>• Live supervisor guidance</div>}
                      {template.features.sessionRecording.enabled && <div>• Session recording</div>}
                      {template.features.emotionDetection.enabled && <div>• Emotion detection</div>}
                      {getEnabledFeaturesCount(template) > 5 && (
                        <div className="text-sage-500">+ {getEnabledFeaturesCount(template) - 5} more features</div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-sage-600 hover:bg-sage-700"
                      onClick={() => onSelectTemplate?.(template)}
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Use Template
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onEditTemplate?.(template)}>
                      <Settings className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="text-sage-400 mb-2">
                <Settings className="w-12 h-12 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-medium text-sage-900 mb-2">No templates found</h3>
              <p className="text-sage-600 mb-4">Create your first chat template to get started</p>
              <Button onClick={onCreateNew} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
