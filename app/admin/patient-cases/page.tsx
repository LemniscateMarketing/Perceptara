"use client"

import { AdminLayout } from "@/components/admin-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, UserCheck, FileText, Eye, Edit, Trash2, Calendar, User, Brain, Clock, ArrowRight } from "lucide-react"
import { useState } from "react"

// Sample patient cases data
const patientCases = [
  {
    id: "CASE-2024-001",
    name: "Sarah Chen - Anxiety & Relationships",
    templateId: "template_001",
    templateName: "General Anxiety Patient",
    status: "active",
    createdAt: "2024-01-22",
    lastModified: "2024-01-22",
    sessionCount: 0,
    modules: ["basic_information", "attachment_styles"],
    summary: "25-year-old graduate student experiencing relationship anxiety and social concerns",
    complexity: "intermediate",
  },
  {
    id: "CASE-2024-002",
    name: "Michael Rodriguez - Trauma Recovery",
    templateId: "template_002",
    templateName: "Trauma Recovery Patient",
    status: "draft",
    createdAt: "2024-01-23",
    lastModified: "2024-01-23",
    sessionCount: 0,
    modules: ["basic_information", "memory_trauma", "attachment_styles"],
    summary: "32-year-old veteran dealing with PTSD and memory processing difficulties",
    complexity: "advanced",
  },
]

const availableTemplates = [
  {
    id: "template_001",
    name: "General Anxiety Patient",
    modules: ["basic_information", "attachment_styles"],
    description: "Standard anxiety presentation with relationship concerns",
  },
  {
    id: "template_002",
    name: "Trauma Recovery Patient",
    modules: ["basic_information", "memory_trauma", "attachment_styles"],
    description: "Complex trauma with memory processing difficulties",
  },
]

export default function PatientCasesPage() {
  const [showCreateModal, setShowCreateModal] = useState(false)

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "beginner":
        return "bg-green-100 text-green-700"
      case "intermediate":
        return "bg-yellow-100 text-yellow-700"
      case "advanced":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
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

  return (
    <AdminLayout title="Patient Cases">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-light text-sage-900">Patient Cases</h1>
            <p className="text-sage-600 mt-1">Manage individual patient case instances generated from templates</p>
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
              <UserCheck className="h-4 w-4 mr-2" />
              <span className="font-medium text-sage-900">Patient Cases</span>
              <span className="ml-2 text-sage-600">(You are here)</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-sage-100 rounded-organic-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-sage-600" />
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
                <FileText className="h-4 w-4 text-therapeutic-green" />
                <span className="text-sm text-sage-600">Templates Used</span>
              </div>
              <p className="text-2xl font-light text-sage-900 mt-1">
                {new Set(patientCases.map((c) => c.templateId)).size}
              </p>
            </CardContent>
          </Card>

          <Card className="border-sage-100 rounded-organic-lg">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-warm-600" />
                <span className="text-sm text-sage-600">Sessions Run</span>
              </div>
              <p className="text-2xl font-light text-sage-900 mt-1">
                {patientCases.reduce((sum, c) => sum + c.sessionCount, 0)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cases List */}
        <div className="space-y-4">
          {patientCases.length === 0 ? (
            <Card className="border-sage-100 rounded-organic-lg">
              <CardContent className="p-8 text-center">
                <UserCheck className="h-12 w-12 text-sage-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-sage-900 mb-2">No Patient Cases Yet</h3>
                <p className="text-sage-600 mb-4">
                  Generate your first patient case from a template to get started with training sessions.
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
            patientCases.map((patientCase) => (
              <Card
                key={patientCase.id}
                className="border-sage-100 rounded-organic-lg hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-lg font-medium text-sage-900">{patientCase.name}</CardTitle>
                        <Badge className={`text-xs ${getStatusColor(patientCase.status)}`}>{patientCase.status}</Badge>
                        <Badge className={`text-xs ${getComplexityColor(patientCase.complexity)}`}>
                          {patientCase.complexity}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-sage-600 mb-2">
                        <span className="flex items-center">
                          <FileText className="h-3 w-3 mr-1" />
                          Case ID: {patientCase.id}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          Created: {patientCase.createdAt}
                        </span>
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          Sessions: {patientCase.sessionCount}
                        </span>
                      </div>
                      <CardDescription className="text-sage-600">{patientCase.summary}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="ghost" size="sm" className="text-sage-700 hover:bg-sage-50">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="text-sage-700 hover:bg-sage-50">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Archive
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-sage-900 mb-2">Template Source:</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {patientCase.templateName}
                        </Badge>
                        <span className="text-xs text-sage-500">→</span>
                        <div className="flex space-x-1">
                          {patientCase.modules.map((moduleId) => (
                            <Badge key={moduleId} variant="secondary" className="text-xs">
                              {moduleId.replace("_", " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-sage-100">
                      <Button
                        size="sm"
                        className="bg-therapeutic-blue hover:bg-therapeutic-blue/80 text-white rounded-organic-md"
                      >
                        <User className="h-3 w-3 mr-1" />
                        Start Training Session
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Create Case Modal Placeholder */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="w-full max-w-2xl mx-4 rounded-organic-lg">
              <CardHeader>
                <CardTitle className="text-lg font-medium text-sage-900">Generate New Patient Case</CardTitle>
                <CardDescription>Select a template to generate a new patient case instance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-sage-900 mb-3">Available Templates:</h4>
                  <div className="space-y-2">
                    {availableTemplates.map((template) => (
                      <Card
                        key={template.id}
                        className="border-sage-200 hover:border-sage-300 cursor-pointer transition-colors"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h5 className="font-medium text-sage-900">{template.name}</h5>
                              <p className="text-sm text-sage-600 mt-1">{template.description}</p>
                              <div className="flex space-x-1 mt-2">
                                {template.modules.map((moduleId) => (
                                  <Badge key={moduleId} variant="secondary" className="text-xs">
                                    {moduleId.replace("_", " ")}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <Button size="sm" className="bg-sage-600 hover:bg-sage-700 text-white">
                              Generate
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2 pt-4 border-t border-sage-100">
                  <Button variant="ghost" onClick={() => setShowCreateModal(false)} className="text-sage-600">
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
