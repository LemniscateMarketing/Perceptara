"use client"

import { useState } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Zap, Eye, Info, Plus, Trash2, RotateCcw, Code, Stethoscope } from "lucide-react"
import { TRAUMA_HISTORY_MODULE } from "./config"
import type { FieldDefinition } from "./types"
import { EvolutionSettings } from "../evolution/EvolutionSettings"
import { DEFAULT_EVOLUTION_CONFIG } from "../evolution/config"
import type { EvolutionConfig } from "../evolution/types"

export function TraumaHistoryModule() {
  const [openFields, setOpenFields] = useState<Set<string>>(new Set())
  const [showAllPreviews, setShowAllPreviews] = useState(false)
  const [previewData, setPreviewData] = useState<Record<string, any>>({})
  const [evolutionConfigs, setEvolutionConfigs] = useState<Record<string, EvolutionConfig>>({})
  const [fieldStates, setFieldStates] = useState<Record<string, { required: boolean; evolvable: boolean }>>({})
  const [openUIPreviews, setOpenUIPreviews] = useState<Set<string>>(new Set())
  const [openEvolutionConfigs, setOpenEvolutionConfigs] = useState<Set<string>>(new Set())

  const toggleField = (fieldId: string) => {
    const newOpenFields = new Set(openFields)
    if (newOpenFields.has(fieldId)) {
      newOpenFields.delete(fieldId)
    } else {
      newOpenFields.add(fieldId)
    }
    setOpenFields(newOpenFields)
  }

  const updatePreviewData = (fieldId: string, value: any) => {
    setPreviewData((prev) => ({ ...prev, [fieldId]: value }))
  }

  const handleEvolutionConfigChange = (fieldId: string, config: EvolutionConfig) => {
    setEvolutionConfigs((prev) => ({ ...prev, [fieldId]: config }))
  }

  const getEvolutionConfig = (fieldId: string): EvolutionConfig => {
    return evolutionConfigs[fieldId] || { ...DEFAULT_EVOLUTION_CONFIG }
  }

  // THIS IS THE KEY EVOLVABLE PATTERN - EXACTLY MATCHING BasicInformationModule
  const getFieldState = (fieldId: string) => {
    const field = TRAUMA_HISTORY_MODULE.fields.find((f) => f.id === fieldId)
    return (
      fieldStates[fieldId] || {
        required: field?.required || false,
        evolvable: field?.evolvable || false,
      }
    )
  }

  const updateFieldState = (fieldId: string, updates: Partial<{ required: boolean; evolvable: boolean }>) => {
    setFieldStates((prev) => ({
      ...prev,
      [fieldId]: { ...getFieldState(fieldId), ...updates },
    }))

    // If evolvable is being turned on/off, update the evolution config
    if (updates.evolvable !== undefined) {
      const currentConfig = getEvolutionConfig(fieldId)
      handleEvolutionConfigChange(fieldId, { ...currentConfig, enabled: updates.evolvable })
    }
  }

  const restoreFieldDefaults = (fieldId: string) => {
    const field = TRAUMA_HISTORY_MODULE.fields.find((f) => f.id === fieldId)
    if (field) {
      setFieldStates((prev) => ({
        ...prev,
        [fieldId]: { required: field.required, evolvable: field.evolvable },
      }))
      setEvolutionConfigs((prev) => ({
        ...prev,
        [fieldId]: { ...DEFAULT_EVOLUTION_CONFIG, enabled: field.evolvable },
      }))
      setPreviewData((prev) => ({
        ...prev,
        [fieldId]: field.sampleData,
      }))
    }
  }

  const toggleUIPreview = (fieldId: string) => {
    const newOpenPreviews = new Set(openUIPreviews)
    if (newOpenPreviews.has(fieldId)) {
      newOpenPreviews.delete(fieldId)
    } else {
      newOpenPreviews.add(fieldId)
    }
    setOpenUIPreviews(newOpenPreviews)
  }

  const toggleEvolutionConfig = (fieldId: string) => {
    const newOpenConfigs = new Set(openEvolutionConfigs)
    if (newOpenConfigs.has(fieldId)) {
      newOpenConfigs.delete(fieldId)
    } else {
      newOpenConfigs.add(fieldId)
    }
    setOpenEvolutionConfigs(newOpenConfigs)
  }

  const renderFieldPreview = (field: FieldDefinition) => {
    const currentValue = previewData[field.id] ?? field.sampleData

    switch (field.type) {
      case "text":
        return (
          <Input
            value={currentValue || ""}
            onChange={(e) => updatePreviewData(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full"
          />
        )

      case "textarea":
        return (
          <Textarea
            value={currentValue || ""}
            onChange={(e) => updatePreviewData(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full min-h-[100px]"
          />
        )

      case "select":
        return (
          <Select value={currentValue || ""} onValueChange={(value) => updatePreviewData(field.id, value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {String(option)
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "list":
        const listItems = Array.isArray(currentValue) ? currentValue : []
        return (
          <div className="space-y-3">
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
              <Card key={index} className="p-3 bg-red-50 border border-red-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs font-mono bg-red-100">
                      {index + 1}
                    </Badge>
                    <span className="text-sm font-medium text-red-700">
                      {typeof item === "object" && item !== null ? Object.values(item)[0] || "Unnamed" : String(item)}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newItems = listItems.filter((_: any, i: number) => i !== index)
                      updatePreviewData(field.id, newItems)
                    }}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {typeof item === "object" && item !== null ? (
                    Object.entries(item).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-red-700 min-w-[80px] capitalize">
                          {key.replace(/_/g, " ")}:
                        </span>
                        <Input
                          value={String(value)}
                          onChange={(e) => {
                            const newItems = [...listItems]
                            newItems[index] = { ...item, [key]: e.target.value }
                            updatePreviewData(field.id, newItems)
                          }}
                          className="flex-1"
                          type={key.includes("age") ? "number" : "text"}
                        />
                      </div>
                    ))
                  ) : (
                    <Input
                      value={String(item)}
                      onChange={(e) => {
                        const newItems = [...listItems]
                        newItems[index] = e.target.value
                        updatePreviewData(field.id, newItems)
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
                if (field.sampleData && Array.isArray(field.sampleData) && field.sampleData.length > 0) {
                  const sample = field.sampleData[0]
                  if (typeof sample === "object" && sample !== null) {
                    newItem = Object.keys(sample).reduce((acc, key) => ({ ...acc, [key]: "" }), {})
                  } else {
                    newItem = ""
                  }
                } else {
                  newItem = ""
                }
                updatePreviewData(field.id, [...listItems, newItem])
              }}
              className="w-full border-dashed"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {field.name.slice(0, -1)}
            </Button>
          </div>
        )

      default:
        return (
          <div className="p-3 bg-red-50 rounded-md border border-red-200">
            <code className="text-sm text-red-700">{JSON.stringify(currentValue, null, 2)}</code>
          </div>
        )
    }
  }

  const evolvableCount = TRAUMA_HISTORY_MODULE.fields.filter((f) => getFieldState(f.id).evolvable).length
  const requiredCount = TRAUMA_HISTORY_MODULE.fields.filter((f) => getFieldState(f.id).required).length

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header - EXACTLY MATCHING BasicInformationModule */}
      <Card className="border-red-200 rounded-organic-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-light text-red-900">{TRAUMA_HISTORY_MODULE.name}</CardTitle>
              <CardDescription className="text-red-600 mt-1">{TRAUMA_HISTORY_MODULE.description}</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllPreviews(!showAllPreviews)}
              className="border-red-300 text-red-700 hover:bg-red-50 rounded-organic-md"
            >
              <Eye className="h-4 w-4 mr-2" />
              {showAllPreviews ? "Hide" : "Show"} All Previews
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4 pt-4">
            <Badge variant="outline" className="bg-red-50">
              {TRAUMA_HISTORY_MODULE.fields.length} Fields
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              {requiredCount} Required
            </Badge>
            <Badge
              variant="outline"
              className="bg-therapeutic-lavender/20 text-therapeutic-lavender border-therapeutic-lavender/30"
            >
              <Zap className="h-3 w-3 mr-1" />
              {evolvableCount} Evolvable
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Field List - EXACTLY MATCHING BasicInformationModule */}
      <div className="space-y-4">
        {TRAUMA_HISTORY_MODULE.fields.map((field, index) => {
          const isOpen = openFields.has(field.id) || showAllPreviews
          const fieldState = getFieldState(field.id)

          return (
            <Card key={field.id} className="border-red-200 rounded-organic-xl overflow-hidden">
              <Collapsible open={isOpen} onOpenChange={() => toggleField(field.id)}>
                <CollapsibleTrigger asChild>
                  <div className="w-full p-5 bg-gradient-to-r from-gray-50 to-gray-100 cursor-pointer hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border-b border-gray-200">
                    <div className="flex items-center justify-between w-full">
                      {/* Left side - Number badge and field info */}
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-red-200 rounded-organic-lg flex items-center justify-center shadow-sm">
                          <span className="text-sm font-semibold text-red-800">{index + 1}</span>
                        </div>

                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{field.name}</h3>
                            <Badge variant="outline" className="bg-gray-100 text-gray-700 font-mono text-xs px-2 py-1">
                              {field.type}
                            </Badge>
                            {fieldState.evolvable && (
                              <Badge variant="lavender" className="text-xs px-2 py-1">
                                <Zap className="h-3 w-3 mr-1" />
                                Evolvable
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 max-w-2xl">{field.description}</p>
                        </div>
                      </div>

                      {/* Right side - Controls */}
                      <div className="flex items-center space-x-4">
                        {/* Required Toggle */}
                        <div className="flex items-center space-x-1.5 bg-white rounded-organic-md px-2 py-1 border border-gray-200 shadow-sm">
                          <Switch
                            checked={fieldState.required}
                            onCheckedChange={(checked) => updateFieldState(field.id, { required: checked })}
                            size="sm"
                          />
                          <span className="text-xs font-medium text-gray-700">Required</span>
                        </div>

                        {/* Chevron */}
                        <div className="ml-2">
                          {isOpen ? (
                            <ChevronDown className="h-5 w-5 text-gray-600" />
                          ) : (
                            <ChevronRight className="h-5 w-5 text-gray-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="mx-4 my-2 border-l-2 border-r-2 border-gray-100 rounded-organic-lg overflow-hidden bg-gray-50/30 space-y-2">
                    {/* Interactive UI Preview Section */}
                    <div className="bg-white rounded-organic-md overflow-hidden">
                      <Collapsible open={openUIPreviews.has(field.id)} onOpenChange={() => toggleUIPreview(field.id)}>
                        <CollapsibleTrigger asChild>
                          <div className="w-full p-4 bg-gradient-to-r from-blue-50 to-indigo-50 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border-b border-blue-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                  <Eye className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold text-blue-900">Interactive UI Preview</h4>
                                  <p className="text-sm text-blue-700">Test how users will interact with this field</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                  {field.type}
                                </Badge>
                                {openUIPreviews.has(field.id) ? (
                                  <ChevronDown className="h-5 w-5 text-blue-600" />
                                ) : (
                                  <ChevronRight className="h-5 w-5 text-blue-600" />
                                )}
                              </div>
                            </div>
                          </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-200">
                            <div className="p-5 bg-white border-2 border-dashed border-blue-300 rounded-organic-lg shadow-sm">
                              <label className="block text-sm font-medium text-gray-700 mb-3">
                                {field.name}
                                {fieldState.required && <span className="text-red-500 ml-1">*</span>}
                              </label>
                              {renderFieldPreview(field)}
                              <p className="text-xs text-gray-500 mt-3 italic">
                                This is how users will interact with this field. Try it out!
                              </p>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>

                    {/* Evolution Configuration Section - THIS IS THE KEY EVOLVABLE PATTERN */}
                    <div className="bg-white rounded-organic-md overflow-hidden">
                      <Collapsible
                        open={openEvolutionConfigs.has(field.id)}
                        onOpenChange={() => toggleEvolutionConfig(field.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <div className="w-full p-4 bg-gradient-to-r from-purple-50 to-pink-50 cursor-pointer hover:from-purple-100 hover:to-pink-100 transition-all duration-200 border-b border-purple-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-therapeutic-lavender/20 rounded-lg">
                                  <Zap className="h-5 w-5 text-therapeutic-lavender" />
                                </div>
                                <div>
                                  <h4 className="text-lg font-semibold text-purple-900">Evolution Configuration</h4>
                                  <p className="text-sm text-purple-700">
                                    Configure how {field.name} evolves during therapy
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                {/* Evolvable Toggle - EXACTLY MATCHING BasicInformationModule */}
                                <div className="flex items-center space-x-1.5 bg-white rounded-organic-md px-2 py-1 border border-purple-200 shadow-sm">
                                  <Switch
                                    checked={fieldState.evolvable}
                                    onCheckedChange={(checked) => updateFieldState(field.id, { evolvable: checked })}
                                    size="sm"
                                  />
                                  <span className="text-xs font-medium text-purple-700">Evolvable</span>
                                </div>
                                {/* Restore Button */}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    restoreFieldDefaults(field.id)
                                  }}
                                  className="text-purple-500 hover:text-purple-700 hover:bg-white rounded-organic-md"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                </Button>
                                <div className="flex items-center space-x-2">
                                  <Badge
                                    variant="outline"
                                    className={
                                      fieldState.evolvable
                                        ? "bg-therapeutic-lavender/20 text-therapeutic-lavender border-therapeutic-lavender/30"
                                        : "bg-gray-50 text-gray-500 border-gray-200"
                                    }
                                  >
                                    {fieldState.evolvable ? "Enabled" : "Disabled"}
                                  </Badge>
                                  {openEvolutionConfigs.has(field.id) ? (
                                    <ChevronDown className="h-5 w-5 text-purple-600" />
                                  ) : (
                                    <ChevronRight className="h-5 w-5 text-purple-600" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <div className="p-6 bg-white border-b border-purple-200">
                            {/* EvolutionSettings - EXACTLY MATCHING BasicInformationModule */}
                            <EvolutionSettings
                              fieldName={field.name}
                              fieldType={field.type}
                              config={{ ...getEvolutionConfig(field.id), enabled: fieldState.evolvable }}
                              onChange={(config) => handleEvolutionConfigChange(field.id, config)}
                            />
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </div>

                    {/* Bottom Section - Clinical Purpose and Variable Info */}
                    <div className="bg-white rounded-organic-md overflow-hidden">
                      <div className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Clinical Purpose */}
                          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-organic-xl p-6 border border-green-200">
                            <div className="flex items-start space-x-3">
                              <Stethoscope className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                              <div>
                                <h4 className="text-lg font-semibold text-green-900 mb-2">Clinical Purpose</h4>
                                <p className="text-sm text-green-700 leading-relaxed">{field.clinicalPurpose}</p>
                              </div>
                            </div>
                          </div>

                          {/* Variable Info */}
                          <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-organic-xl p-6 border border-gray-200">
                            <div className="flex items-start space-x-3">
                              <Code className="h-5 w-5 text-gray-600 mt-1 flex-shrink-0" />
                              <div className="flex-1">
                                <h4 className="text-lg font-semibold text-gray-900 mb-2">Prompt Variable</h4>
                                <p className="text-sm text-gray-600 mb-3">Use this variable in AI prompts</p>
                                <div className="bg-gray-100 rounded-organic-md p-3 border">
                                  <code className="text-sm font-mono text-gray-800">{field.variable}</code>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

export default TraumaHistoryModule
