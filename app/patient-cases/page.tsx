"use client"

import { AppLayout } from "@/components/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Play, Clock, Brain, ChevronRight, FileText } from "lucide-react"

// Sample patient cases data (same as admin but focused on training)
const availableCases = [
  {
    id: "CASE-2024-001",
    name: "Sarah Chen",
    title: "Anxiety & Relationships",
    templateName: "General Anxiety Patient",
    status: "active",
    modules: ["basic_information", "attachment_styles"],
    summary: "25-year-old graduate student experiencing relationship anxiety and social concerns",
    complexity: "intermediate",
    avatar: "/young-professional-woman.png",
    estimatedDuration: "45-60 min",
    focusAreas: ["Social Anxiety", "Relationship Patterns", "Academic Stress"],
  },
  {
    id: "CASE-2024-002",
    name: "Michael Rodriguez",
    title: "Trauma Recovery",
    templateName: "Trauma Recovery Patient",
    status: "active",
    modules: ["basic_information", "memory_trauma", "attachment_styles"],
    summary: "32-year-old veteran dealing with PTSD and memory processing difficulties",
    complexity: "advanced",
    avatar: "/professional-man.png",
    estimatedDuration: "60-75 min",
    focusAreas: ["PTSD", "Memory Processing", "Coping Strategies"],
  },
]

export default function PatientCasesPage() {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "beginner":
        return "therapeutic"
      case "intermediate":
        return "warm"
      case "advanced":
        return "green"
      default:
        return "sage"
    }
  }

  const getComplexityLabel = (complexity: string) => {
    switch (complexity) {
      case "beginner":
        return "Exploring"
      case "intermediate":
        return "Moderate"
      case "advanced":
        return "Complex"
      default:
        return "Standard"
    }
  }

  const handleStartSession = (patientCase: any) => {
    // This will eventually navigate to the session interface
    console.log("Starting session with:", patientCase.name)
    // For now, we'll just log - later this will integrate with the existing session flow
  }

  return (
    <AppLayout currentPath="/patient-cases">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-sage-100 px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-2 lg:space-y-0">
            <div>
              <h1 className="text-xl lg:text-2xl font-light text-sage-900">Patient Cases</h1>
              <p className="text-sage-600 mt-1 text-sm lg:text-base">
                Select a patient case to begin your therapeutic training session
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-sage-600 bg-white/60 px-3 lg:px-4 py-2 rounded-organic-lg w-fit">
              <User className="h-4 w-4" />
              <span>{availableCases.length} cases available</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <Card className="bg-white/60 backdrop-blur-sm border-sage-100 rounded-organic-xl shadow-sm">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center">
                  <div className="p-2 lg:p-3 bg-therapeutic-blue/20 rounded-organic-lg">
                    <User className="h-4 w-4 lg:h-6 lg:w-6 text-sage-600" />
                  </div>
                  <div className="ml-3 lg:ml-4">
                    <p className="text-xs lg:text-sm font-medium text-sage-600">Available Cases</p>
                    <p className="text-lg lg:text-2xl font-light text-sage-900">{availableCases.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-sage-100 rounded-organic-xl shadow-sm">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center">
                  <div className="p-2 lg:p-3 bg-therapeutic-green/20 rounded-organic-lg">
                    <Brain className="h-4 w-4 lg:h-6 lg:w-6 text-sage-600" />
                  </div>
                  <div className="ml-3 lg:ml-4">
                    <p className="text-xs lg:text-sm font-medium text-sage-600">Complexity Levels</p>
                    <p className="text-lg lg:text-2xl font-light text-sage-900">
                      {new Set(availableCases.map((c) => c.complexity)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border-sage-100 rounded-organic-xl shadow-sm">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center">
                  <div className="p-2 lg:p-3 bg-warm-100 rounded-organic-lg">
                    <Clock className="h-4 w-4 lg:h-6 lg:w-6 text-sage-600" />
                  </div>
                  <div className="ml-3 lg:ml-4">
                    <p className="text-xs lg:text-sm font-medium text-sage-600">Avg. Duration</p>
                    <p className="text-lg lg:text-2xl font-light text-sage-900">60 min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Available Cases */}
          <Card className="bg-white/70 backdrop-blur-sm border-sage-100 rounded-organic-2xl shadow-sm">
            <CardHeader className="pb-4 lg:pb-6">
              <CardTitle className="text-lg lg:text-xl font-light text-sage-900">Training Cases</CardTitle>
              <CardDescription className="text-sage-600 text-sm lg:text-base">
                Each case offers unique learning opportunities. Choose based on your current skill level and learning
                goals.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availableCases.length > 0 ? (
                <div className="space-y-4 lg:space-y-6">
                  {availableCases.map((patientCase) => (
                    <Card
                      key={patientCase.id}
                      className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl hover:shadow-lg hover:scale-[1.01] transition-all duration-300 group"
                    >
                      <CardContent className="p-4 lg:p-8">
                        <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
                          <Avatar className="h-16 w-16 lg:h-20 lg:w-20 ring-2 ring-sage-100 flex-shrink-0 mx-auto lg:mx-0">
                            <AvatarImage src={patientCase.avatar || "/placeholder.svg"} />
                            <AvatarFallback className="bg-sage-100 text-sage-700 text-lg">
                              {patientCase.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0 text-center lg:text-left">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-3 space-y-2 lg:space-y-0">
                              <div>
                                <h3 className="text-lg lg:text-xl font-medium text-sage-900">{patientCase.name}</h3>
                                <p className="text-sm lg:text-base text-sage-700 font-medium">{patientCase.title}</p>
                              </div>
                              <div className="flex flex-wrap justify-center lg:justify-end gap-2">
                                <Badge variant={getComplexityColor(patientCase.complexity)} className="rounded-btn">
                                  {getComplexityLabel(patientCase.complexity)}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {patientCase.templateName}
                                </Badge>
                              </div>
                            </div>

                            <p className="text-sm lg:text-base text-sage-600 mb-4 leading-relaxed">
                              {patientCase.summary}
                            </p>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                              <div>
                                <h4 className="text-sm font-medium text-sage-900 mb-2">Focus Areas:</h4>
                                <div className="flex flex-wrap gap-1">
                                  {patientCase.focusAreas.map((area) => (
                                    <Badge key={area} variant="secondary" className="text-xs">
                                      {area}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-sage-900 mb-2">Session Details:</h4>
                                <div className="flex items-center space-x-4 text-sm text-sage-600">
                                  <span className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {patientCase.estimatedDuration}
                                  </span>
                                  <span className="flex items-center">
                                    <FileText className="h-3 w-3 mr-1" />
                                    {patientCase.id}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <Button
                              className="w-full lg:w-auto bg-sage-600 hover:bg-sage-700 text-white rounded-organic-lg transition-all duration-300 group-hover:bg-sage-700"
                              onClick={() => handleStartSession(patientCase)}
                            >
                              <Play className="h-4 w-4 mr-2" />
                              Start Training Session
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-sage-50 rounded-organic-xl p-8 max-w-md mx-auto">
                    <User className="h-12 w-12 text-sage-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-sage-900 mb-2">No Cases Available</h3>
                    <p className="text-sage-600 text-sm mb-4">
                      No patient cases are currently available for training. Please contact your administrator.
                    </p>
                    <Badge variant="warm" className="text-xs">
                      Check back later
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
