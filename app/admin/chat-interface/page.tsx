"use client"

import { useState, useEffect } from "react"
import { AdminLayout } from "@/components/admin-layout"
import SessionInterfaceAI from "@/components/session-interface-ai"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Brain, Settings } from "lucide-react"
import { getPatientCases } from "@/lib/actions/modular-patients"
import { ChatFeaturesProvider, useChatFeatures } from "@/lib/chat-features-manager"

interface Patient {
  id: string
  name: string
  case_name: string
  case_summary: string
  data: any
  field_data: any
}

function ChatInterfaceContent() {
  const { modules, features, getEnabledFeatures } = useChatFeatures()
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [selectedModality, setSelectedModality] = useState("Cognitive Behavioral Therapy (CBT)")
  const [showSession, setShowSession] = useState(false)
  const [loading, setLoading] = useState(true)

  const enabledFeatures = getEnabledFeatures()
  const enabledModules = modules.filter((m) => m.enabled)

  // Load real patient cases
  useEffect(() => {
    async function loadPatients() {
      try {
        const cases = await getPatientCases()
        const validCases = cases.filter((c) => c.status === "active" || c.status === "draft")
        setPatients(validCases)
        if (validCases.length > 0) {
          setSelectedPatient(validCases[0])
        }
      } catch (error) {
        console.error("Failed to load patient cases:", error)
      } finally {
        setLoading(false)
      }
    }
    loadPatients()
  }, [])

  // Convert patient case to session format
  const convertPatientForSession = (patient: Patient) => {
    const basicInfo = patient.field_data?.basic_information || {}
    const mentalHealth = patient.field_data?.mental_health_history || {}

    return {
      id: patient.id,
      name: basicInfo.name || patient.case_name || "Patient",
      age: basicInfo.age || 25,
      primaryConcern: mentalHealth.primary_concerns?.[0] || patient.case_summary || "General therapy session",
      primary_concern: mentalHealth.primary_concerns?.[0] || patient.case_summary || "General therapy session",
      background: patient.case_summary || "Patient seeking therapeutic support",
      avatar: basicInfo.avatar_url || "/placeholder.svg",
      avatar_url: basicInfo.avatar_url || "/placeholder.svg",
      personality_traits: patient.field_data?.behavioral_patterns || { traits: ["thoughtful", "seeking help"] },
    }
  }

  if (loading) {
    return (
      <AdminLayout title="Chat Interface">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-600 mx-auto mb-4"></div>
            <p className="text-sage-600">Loading patient cases...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (showSession && selectedPatient) {
    return (
      <ChatFeaturesProvider>
        <SessionInterfaceAI
          patient={convertPatientForSession(selectedPatient)}
          modality={selectedModality}
          onBack={() => setShowSession(false)}
          onEndSession={(duration, messageCount) => {
            console.log(`Session ended: ${duration}s, ${messageCount} messages`)
            setShowSession(false)
          }}
        />
      </ChatFeaturesProvider>
    )
  }

  return (
    <AdminLayout title="Chat Interface">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-900">Chat Interface</h1>
            <p className="text-gray-600 mt-1">Start a real therapy session with AI-powered patient responses</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => window.open("/admin/chat-architecture", "_blank")}
              className="rounded-organic-md"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure Features
            </Button>
          </div>
        </div>

        {/* Feature Status */}
        <Card className="border-sage-200 rounded-organic-xl bg-sage-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-sage-900">Current Configuration</h3>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="bg-white text-sage-700">
                  {enabledModules.length} Modules Active
                </Badge>
                <Badge variant="outline" className="bg-white text-sage-700">
                  {enabledFeatures.length} Features Enabled
                </Badge>
              </div>
            </div>

            {enabledFeatures.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Features Enabled</h3>
                <p className="text-gray-600 mb-4">
                  Enable features in Chat Architecture to enhance the session experience
                </p>
                <Button
                  variant="outline"
                  onClick={() => window.open("/admin/chat-architecture", "_blank")}
                  className="rounded-organic-md"
                >
                  Open Chat Architecture
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {enabledModules.map((module) => {
                  const moduleFeatures = enabledFeatures.filter((f) => f.moduleId === module.id)
                  return (
                    <div key={module.id} className="text-center">
                      <div className={`p-3 rounded-organic-lg ${module.bgColor} mb-2`}>
                        <div className="text-2xl font-bold text-gray-900">{moduleFeatures.length}</div>
                        <div className={`text-sm ${module.textColor}`}>{module.name}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Patient Selection */}
        {patients.length === 0 ? (
          <Card className="border-red-200 rounded-organic-xl bg-red-50">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-medium text-red-900 mb-2">No Patient Cases Available</h3>
              <p className="text-red-700 mb-4">Create patient cases first to start therapy sessions</p>
              <Button
                variant="outline"
                onClick={() => window.open("/admin/all-cases", "_blank")}
                className="rounded-organic-md border-red-200 text-red-700 hover:bg-red-100"
              >
                Create Patient Cases
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Patient Selection */}
            <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-sage-900 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Select Patient Case
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Select
                  value={selectedPatient?.id || ""}
                  onValueChange={(value) => {
                    const patient = patients.find((p) => p.id === value)
                    setSelectedPatient(patient || null)
                  }}
                >
                  <SelectTrigger className="rounded-organic-md">
                    <SelectValue placeholder="Choose a patient case" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">
                            {patient.field_data?.basic_information?.name || patient.case_name}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {patient.status}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedPatient && (
                  <div className="p-4 bg-sage-50 rounded-organic-lg">
                    <div className="flex items-start space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={selectedPatient.field_data?.basic_information?.avatar_url || "/placeholder.svg"}
                        />
                        <AvatarFallback className="bg-sage-100 text-sage-700">
                          {(selectedPatient.field_data?.basic_information?.name || selectedPatient.case_name || "P")[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium text-sage-900 mb-1">
                          {selectedPatient.field_data?.basic_information?.name || selectedPatient.case_name}
                        </h4>
                        <p className="text-sm text-sage-600 mb-2">
                          Age: {selectedPatient.field_data?.basic_information?.age || "Not specified"}
                        </p>
                        <p className="text-sm text-sage-700 line-clamp-2">
                          {selectedPatient.case_summary || "No summary available"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-sage-700">Therapeutic Modality</label>
                  <Select value={selectedModality} onValueChange={setSelectedModality}>
                    <SelectTrigger className="rounded-organic-md">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cognitive Behavioral Therapy (CBT)">CBT</SelectItem>
                      <SelectItem value="Dialectical Behavior Therapy (DBT)">DBT</SelectItem>
                      <SelectItem value="Acceptance and Commitment Therapy (ACT)">ACT</SelectItem>
                      <SelectItem value="Psychodynamic Therapy">Psychodynamic</SelectItem>
                      <SelectItem value="Humanistic Therapy">Humanistic</SelectItem>
                      <SelectItem value="Solution-Focused Brief Therapy">SFBT</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Session Preview */}
            <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg text-sage-900 flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Session Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPatient ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-sage-600">Patient:</span>
                        <span className="text-sm font-medium text-sage-900">
                          {selectedPatient.field_data?.basic_information?.name || selectedPatient.case_name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-sage-600">Modality:</span>
                        <Badge variant="therapeutic" className="text-xs">
                          {selectedModality}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-sage-600">AI Features:</span>
                        <Badge variant={enabledFeatures.length > 0 ? "green" : "outline"} className="text-xs">
                          {enabledFeatures.length > 0 ? `${enabledFeatures.length} Active` : "Basic Mode"}
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-sage-100">
                      <Button
                        onClick={() => setShowSession(true)}
                        className="w-full bg-sage-600 hover:bg-sage-700 text-white rounded-organic-lg"
                        disabled={!selectedPatient}
                      >
                        Start Therapy Session
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sage-600">Select a patient case to preview the session</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Active Features Summary */}
        {enabledFeatures.length > 0 && (
          <Card className="border-blue-200 rounded-organic-xl bg-blue-50">
            <CardContent className="p-6">
              <h3 className="font-semibold text-blue-900 mb-3">Active Session Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {enabledFeatures.map((feature) => (
                  <div key={feature.id} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-blue-800">{feature.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}

export default function ChatInterfacePage() {
  return (
    <ChatFeaturesProvider>
      <ChatInterfaceContent />
    </ChatFeaturesProvider>
  )
}
