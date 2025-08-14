"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronUp, ChevronDown, Brain, Lightbulb, Eye, ThumbsUp, AlertTriangle, MessageSquare } from "lucide-react"
import type { AIClient } from "@/lib/ai-client"

interface SupervisorFeedback {
  id: string
  content: string
  type: "technique" | "observation" | "encouragement" | "caution"
  timestamp: Date
  isAI: boolean
}

interface AISupervisorPanelProps {
  isVisible: boolean
  onToggle: () => void
  patientState: {
    mood: string
    engagement: string
    progress: string
  }
  lastPatientMessage?: string
  sessionDuration: number
  modality: string
  aiClient: AIClient | null
}

export default function AISupervisorPanel({
  isVisible,
  onToggle,
  patientState,
  lastPatientMessage,
  sessionDuration,
  modality,
  aiClient,
}: AISupervisorPanelProps) {
  const [feedback, setFeedback] = useState<SupervisorFeedback[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  // Generate supervisor feedback when patient responds
  useEffect(() => {
    if (lastPatientMessage && aiClient && feedback.length < 5) {
      generateSupervisorFeedback()
    }
  }, [lastPatientMessage])

  const generateSupervisorFeedback = async () => {
    if (!aiClient || !lastPatientMessage) return

    setIsGenerating(true)

    try {
      const sessionContext = {
        lastTherapistMessage: "Recent therapeutic intervention",
        patientState,
        duration: sessionDuration,
      }

      const patientProfile = {
        name: "Current Patient",
        primary_concern: "Therapeutic growth",
      }

      const response = await aiClient.generateSupervisorFeedback(sessionContext, patientProfile, modality)

      if (response.success) {
        const newFeedback: SupervisorFeedback = {
          id: Date.now().toString(),
          content: response.feedback,
          type: response.type,
          timestamp: new Date(),
          isAI: true,
        }

        setFeedback((prev) => [...prev, newFeedback])
      }
    } catch (error) {
      console.error("Supervisor feedback error:", error)
      // Add fallback feedback
      const fallbackFeedback: SupervisorFeedback = {
        id: Date.now().toString(),
        content: "Continue building rapport and exploring the patient's perspective.",
        type: "observation",
        timestamp: new Date(),
        isAI: false,
      }
      setFeedback((prev) => [...prev, fallbackFeedback])
    } finally {
      setIsGenerating(false)
    }
  }

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case "technique":
        return <Lightbulb className="h-4 w-4" />
      case "observation":
        return <Eye className="h-4 w-4" />
      case "encouragement":
        return <ThumbsUp className="h-4 w-4" />
      case "caution":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <MessageSquare className="h-4 w-4" />
    }
  }

  const getFeedbackColor = (type: string) => {
    switch (type) {
      case "technique":
        return "therapeutic"
      case "observation":
        return "sage"
      case "encouragement":
        return "green"
      case "caution":
        return "warm"
      default:
        return "sage"
    }
  }

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-sage-100 transition-transform duration-300 ease-in-out z-50 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {/* Toggle Button */}
      <Button
        onClick={onToggle}
        variant="ghost"
        size="sm"
        className="absolute -top-10 right-4 bg-sage-600 text-white hover:bg-sage-700 rounded-t-organic-lg px-4 py-2"
      >
        <Brain className="h-4 w-4 mr-2" />
        AI Supervisor
        {isVisible ? <ChevronDown className="h-4 w-4 ml-2" /> : <ChevronUp className="h-4 w-4 ml-2" />}
      </Button>

      {/* Panel Content */}
      <div className="h-64 p-4 lg:p-6">
        <div className="max-w-6xl mx-auto h-full">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-sage-100 rounded-organic-lg">
                <Brain className="h-5 w-5 text-sage-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-sage-900">AI Clinical Supervisor</h3>
                <p className="text-sm text-sage-600">Real-time guidance and feedback</p>
              </div>
            </div>
            {aiClient && (
              <Badge variant="green" className="text-xs">
                <Brain className="h-3 w-3 mr-1" />
                AI Active
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Current Observations */}
            <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center text-sage-900">
                  <Eye className="h-4 w-4 mr-2" />
                  Current Observations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <p className="text-xs font-medium text-sage-600">Patient State</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="therapeutic" className="text-xs">
                      {patientState.mood}
                    </Badge>
                    <Badge variant="warm" className="text-xs">
                      {patientState.engagement}
                    </Badge>
                    <Badge variant="sage" className="text-xs">
                      {patientState.progress}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-sage-600">Session Progress</p>
                  <p className="text-xs text-sage-700">
                    Duration: {Math.floor(sessionDuration / 60)}:{(sessionDuration % 60).toString().padStart(2, "0")}
                  </p>
                  <p className="text-xs text-sage-700">Modality: {modality}</p>
                </div>
              </CardContent>
            </Card>

            {/* AI Feedback */}
            <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl lg:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center text-sage-900">
                  <Brain className="h-4 w-4 mr-2" />
                  Supervisor Feedback
                  {isGenerating && (
                    <div className="ml-2 w-4 h-4 border-2 border-sage-600 border-t-transparent rounded-full animate-spin" />
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-32">
                  {feedback.length > 0 ? (
                    <div className="space-y-3">
                      {feedback.map((item) => (
                        <div key={item.id} className="flex items-start space-x-3">
                          <div className={`p-1 rounded-organic-md bg-${getFeedbackColor(item.type)}-100`}>
                            {getFeedbackIcon(item.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <Badge variant={getFeedbackColor(item.type)} className="text-xs">
                                {item.type}
                              </Badge>
                              {item.isAI && (
                                <Badge variant="sage" className="text-xs">
                                  <Brain className="h-2 w-2 mr-1" />
                                  AI
                                </Badge>
                              )}
                              <span className="text-xs text-sage-500">
                                {item.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                            <p className="text-xs text-sage-700 leading-relaxed">{item.content}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Brain className="h-8 w-8 text-sage-400 mx-auto mb-2" />
                      <p className="text-sm text-sage-600">
                        {aiClient
                          ? "AI supervisor is observing the session..."
                          : "Configure AI in settings to enable supervisor feedback"}
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
