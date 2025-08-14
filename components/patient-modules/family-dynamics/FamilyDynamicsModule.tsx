"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Home, Heart, Zap, Info } from "lucide-react"
import { FAMILY_DYNAMICS_MODULE } from "./config"
import type { FamilyDynamicsData } from "./types"

interface FamilyDynamicsModuleProps {
  data: FamilyDynamicsData
  onChange: (data: FamilyDynamicsData) => void
  onValidationChange?: (isValid: boolean) => void
}

export function FamilyDynamicsModule({ data, onChange, onValidationChange }: FamilyDynamicsModuleProps) {
  const [expandedFields, setExpandedFields] = useState<Record<string, boolean>>({})
  const [showEvolution, setShowEvolution] = useState(false)

  const toggleField = (fieldId: string) => {
    setExpandedFields((prev) => ({
      ...prev,
      [fieldId]: !prev[fieldId],
    }))
  }

  const handleFieldChange = (fieldId: string, value: any) => {
    const newData = { ...data, [fieldId]: value }
    onChange(newData)
  }

  const renderField = (field: any) => {
    const value = data[field.id as keyof FamilyDynamicsData]
    const isExpanded = expandedFields[field.id]

    return (
      <Collapsible key={field.id} open={isExpanded} onOpenChange={() => toggleField(field.id)}>
        <Card className="border-sage-100 rounded-organic-lg">
          <CollapsibleTrigger asChild>
            <div className="w-full p-5 bg-gradient-to-r from-gray-50 to-gray-100 cursor-pointer hover:from-gray-100 hover:to-gray-200 transition-all duration-200 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-therapeutic-lavender/20 rounded-organic-md">
                    <Home className="h-4 w-4 text-therapeutic-lavender" />
                  </div>
                  <div>
                    <h3 className="font-medium text-sage-900">{field.name}</h3>
                    <p className="text-sm text-sage-600">{field.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {field.required && (
                    <Badge variant="outline" className="text-xs bg-red-50 text-red-700">
                      Required
                    </Badge>
                  )}
                  {field.evolvable && (
                    <Badge variant="outline" className="text-xs bg-therapeutic-lavender/20 text-therapeutic-lavender">
                      <Zap className="h-3 w-3 mr-1" />
                      Evolvable
                    </Badge>
                  )}
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-sage-600" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-sage-600" />
                  )}
                </div>
              </div>
            </div>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <CardContent className="p-5">
              {field.type === "text" && (
                <Input
                  value={(value as string) || ""}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full"
                />
              )}

              {field.type === "textarea" && (
                <Textarea
                  value={(value as string) || ""}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full min-h-[120px]"
                />
              )}

              {field.type === "select" && (
                <Select
                  value={(value as string) || ""}
                  onValueChange={(newValue) => handleFieldChange(field.id, newValue)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an option..." />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option: string) => (
                      <SelectItem key={option} value={option}>
                        {option.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {field.type === "multiselect" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-3 border border-gray-200 rounded-organic-md">
                    {field.options?.map((option: string) => {
                      const selectedValues = Array.isArray(value) ? value : []
                      return (
                        <div key={option} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${field.id}_${option}`}
                            checked={selectedValues.includes(option)}
                            onCheckedChange={(checked) => {
                              const currentValues = Array.isArray(value) ? value : []
                              let newValues
                              if (checked) {
                                newValues = [...currentValues, option]
                              } else {
                                newValues = currentValues.filter((v: string) => v !== option)
                              }
                              handleFieldChange(field.id, newValues)
                            }}
                          />
                          <Label htmlFor={`${field.id}_${option}`} className="text-sm cursor-pointer">
                            {option.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                  {Array.isArray(value) && value.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {value.map((selectedValue: string) => (
                        <Badge key={selectedValue} variant="secondary" className="text-xs">
                          {selectedValue.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {field.type === "boolean" && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={field.id}
                    checked={Boolean(value)}
                    onCheckedChange={(checked) => handleFieldChange(field.id, checked)}
                  />
                  <Label htmlFor={field.id} className="text-sm">
                    {field.placeholder || "Yes"}
                  </Label>
                </div>
              )}

              {/* Sample Data Display */}
              {field.sampleData && (
                <div className="mt-4 p-3 bg-sage-50 rounded-organic-md border border-sage-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Info className="h-4 w-4 text-sage-600" />
                    <span className="text-sm font-medium text-sage-700">Sample Data:</span>
                  </div>
                  <div className="text-sm text-sage-600">
                    {typeof field.sampleData === "string" ? (
                      <p>{field.sampleData}</p>
                    ) : (
                      <pre className="whitespace-pre-wrap">{JSON.stringify(field.sampleData, null, 2)}</pre>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    )
  }

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <Card className="border-sage-100 rounded-organic-lg bg-gradient-to-r from-therapeutic-lavender/10 to-sage-50">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-therapeutic-lavender/20 rounded-organic-lg">
              <Home className="h-6 w-6 text-therapeutic-lavender" />
            </div>
            <div>
              <CardTitle className="text-xl font-light text-sage-900">{FAMILY_DYNAMICS_MODULE.name}</CardTitle>
              <CardDescription className="text-sage-600">{FAMILY_DYNAMICS_MODULE.description}</CardDescription>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-2 pt-3">
            <Badge variant="outline" className="bg-sage-50">
              {FAMILY_DYNAMICS_MODULE.fields.length} Fields
            </Badge>
            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
              {FAMILY_DYNAMICS_MODULE.fields.filter((f) => f.required).length} Required
            </Badge>
            <Badge
              variant="outline"
              className="bg-therapeutic-lavender/20 text-therapeutic-lavender border-therapeutic-lavender/30"
            >
              <Zap className="h-3 w-3 mr-1" />
              {FAMILY_DYNAMICS_MODULE.fields.filter((f) => f.evolvable).length} Evolvable
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Fields */}
      <div className="space-y-4">{FAMILY_DYNAMICS_MODULE.fields.map(renderField)}</div>

      {/* Evolution Configuration */}
      <Card className="border-sage-100 rounded-organic-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-therapeutic-lavender/20 rounded-organic-md">
                <Zap className="h-4 w-4 text-therapeutic-lavender" />
              </div>
              <div>
                <CardTitle className="text-lg font-medium text-sage-900">Evolution Configuration</CardTitle>
                <CardDescription className="text-sage-600">
                  Configure how family dynamics can change during therapy
                </CardDescription>
              </div>
            </div>
            <Button variant="outline" onClick={() => setShowEvolution(!showEvolution)} className="text-sage-700">
              {showEvolution ? "Hide" : "Show"} Evolution Settings
            </Button>
          </div>
        </CardHeader>

        {showEvolution && (
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {FAMILY_DYNAMICS_MODULE.fields
                  .filter((field) => field.evolvable)
                  .map((field) => (
                    <div key={field.id} className="p-3 bg-therapeutic-lavender/10 rounded-organic-md">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-3 w-3 text-therapeutic-lavender" />
                        <span className="text-sm font-medium text-sage-900">{field.name}</span>
                      </div>
                      <p className="text-xs text-sage-600 mt-1">Can evolve during therapy sessions</p>
                    </div>
                  ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Clinical Purpose */}
      <Card className="border-sage-100 rounded-organic-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-sage-100 rounded-organic-md">
              <Heart className="h-4 w-4 text-sage-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-medium text-sage-900">Clinical Purpose</CardTitle>
              <CardDescription className="text-sage-600">
                Understanding family dynamics and relationships
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm text-sage-700">
            <p>
              Family dynamics information helps therapists understand the patient's relational patterns, support
              systems, and potential sources of stress or healing. This module captures both current family structure
              and historical family experiences that shape the patient's worldview.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Variable Information */}
      <Card className="border-sage-100 rounded-organic-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-organic-md">
              <Info className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg font-medium text-sage-900">AI Prompt Variables</CardTitle>
              <CardDescription className="text-sage-600">
                How this data integrates with AI patient simulation
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FAMILY_DYNAMICS_MODULE.fields.map((field) => (
              <div key={field.id} className="p-3 bg-blue-50 rounded-organic-md">
                <div className="flex items-center space-x-2 mb-1">
                  <code className="text-xs bg-blue-100 px-2 py-1 rounded text-blue-800">{field.variable}</code>
                </div>
                <p className="text-sm text-blue-700">{field.name}</p>
                <p className="text-xs text-blue-600 mt-1">{field.clinicalPurpose}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
