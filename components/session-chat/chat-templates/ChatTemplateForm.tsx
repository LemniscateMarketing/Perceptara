"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Save, X, Info } from "lucide-react"
import { type ChatTemplate, type ChatTemplateFormData, DEFAULT_CHAT_FEATURES } from "./types"

interface ChatTemplateFormProps {
  template?: ChatTemplate
  onSave?: (data: ChatTemplateFormData) => void
  onCancel?: () => void
}

export default function ChatTemplateForm({ template, onSave, onCancel }: ChatTemplateFormProps) {
  const [formData, setFormData] = useState<ChatTemplateFormData>({
    name: template?.name || "",
    description: template?.description || "",
    category: template?.category || "beginner",
    features: template?.features || DEFAULT_CHAT_FEATURES,
  })

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(["voice-audio"]))

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const updateFeature = (
    featureId: keyof ChatTemplate["features"],
    updates: Partial<(typeof formData.features)[typeof featureId]>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [featureId]: {
          ...prev.features[featureId],
          ...updates,
        },
      },
    }))
  }

  const getEnabledCount = (features: (keyof ChatTemplate["features"])[]) => {
    return features.filter((key) => formData.features[key].enabled).length
  }

  const handleSave = () => {
    onSave?.(formData)
  }

  const featureGroups = {
    "voice-audio": {
      title: "Voice & Audio",
      description: "Voice conversation and audio processing features",
      features: ["voiceChat", "textToSpeech", "speechToText", "emotionDetection", "voiceCommands"] as const,
    },
    "ai-integration": {
      title: "AI Integration",
      description: "AI-powered patient responses and behavior",
      features: ["aiPatientResponses", "aiPersonality", "responseDelay", "adaptiveBehavior"] as const,
    },
    "supervisor-tools": {
      title: "Supervisor Tools",
      description: "Live supervision and guidance features",
      features: ["liveSupervisor", "supervisorNotifications", "realTimeGuidance"] as const,
    },
    "interaction-features": {
      title: "Interaction Features",
      description: "Advanced interaction and control capabilities",
      features: ["interruptionCapability", "gestureRecognition", "eyeTracking"] as const,
    },
    "therapeutic-tools": {
      title: "Therapeutic Tools",
      description: "Built-in therapeutic exercises and resources",
      features: ["mindfulnessExercises", "breathingTools", "reflectionPrompts", "resourceSharing"] as const,
    },
    "recording-documentation": {
      title: "Recording & Documentation",
      description: "Session recording and note-taking features",
      features: ["sessionRecording", "autoTranscription", "liveNoteTaking"] as const,
    },
    "visual-interface": {
      title: "Visual Interface",
      description: "UI themes and accessibility options",
      features: ["therapeuticTheme", "accessibilityMode", "distractionFreeMode"] as const,
    },
    analytics: {
      title: "Analytics & Tracking",
      description: "Session analytics and progress tracking",
      features: ["moodTracking", "engagementMetrics", "progressIndicators"] as const,
    },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-sage-900">
            {template ? "Edit Template" : "Create Chat Template"}
          </h2>
          <p className="text-sage-600 mt-1">Configure session features and save as a reusable template</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-sage-600 hover:bg-sage-700">
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Basic Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Template Information</CardTitle>
              <CardDescription>Basic details about this chat template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Advanced Voice Training"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this template is designed for..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: ChatTemplate["category"]) =>
                    setFormData((prev) => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="specialized">Specialized</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Feature Summary */}
              <div className="pt-4 border-t">
                <h4 className="font-medium text-sage-900 mb-3">Feature Summary</h4>
                <div className="space-y-2 text-sm">
                  {Object.entries(featureGroups).map(([groupId, group]) => (
                    <div key={groupId} className="flex justify-between">
                      <span className="text-sage-600">{group.title}:</span>
                      <span className="font-medium">
                        {getEnabledCount(group.features)} / {group.features.length}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feature Configuration */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Feature Configuration</CardTitle>
              <CardDescription>Enable and configure specific features for this template</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(featureGroups).map(([groupId, group]) => (
                  <Collapsible
                    key={groupId}
                    open={expandedSections.has(groupId)}
                    onOpenChange={() => toggleSection(groupId)}
                  >
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" className="w-full justify-between p-4 h-auto">
                        <div className="flex items-center gap-3">
                          {expandedSections.has(groupId) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                          <div className="text-left">
                            <div className="font-medium text-sage-900">{group.title}</div>
                            <div className="text-sm text-sage-600">{group.description}</div>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {getEnabledCount(group.features)} / {group.features.length}
                        </Badge>
                      </Button>
                    </CollapsibleTrigger>

                    <CollapsibleContent className="px-4 pb-4">
                      <div className="space-y-4 pt-2">
                        {group.features.map((featureKey) => {
                          const feature = formData.features[featureKey]
                          return (
                            <div key={featureKey} className="flex items-start gap-3 p-3 rounded-lg border">
                              <Switch
                                checked={feature.enabled}
                                onCheckedChange={(enabled) => updateFeature(featureKey, { enabled })}
                              />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-sage-900">{feature.name}</h4>
                                  {feature.enabled && (
                                    <Badge variant="therapeutic" className="text-xs">
                                      Enabled
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-sage-600 mb-2">{feature.description}</p>

                                {/* Feature-specific settings would go here */}
                                {feature.enabled && feature.settings && (
                                  <div className="text-xs text-sage-500 bg-sage-50 p-2 rounded">
                                    <div className="flex items-center gap-1 mb-1">
                                      <Info className="w-3 h-3" />
                                      <span className="font-medium">Settings:</span>
                                    </div>
                                    <pre className="whitespace-pre-wrap">
                                      {JSON.stringify(feature.settings, null, 2)}
                                    </pre>
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
