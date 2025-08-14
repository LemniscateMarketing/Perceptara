"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Brain, Clock, Heart, Leaf, BookOpen } from "lucide-react"

const therapeuticModalities = [
  {
    id: "cbt",
    name: "Cognitive Behavioral Therapy",
    description: "Explore thoughts, feelings, and behavior connections",
    duration: "45-60 min",
    icon: Brain,
    color: "therapeutic-lavender",
  },
  {
    id: "person-centered",
    name: "Person-Centered Therapy",
    description: "Facilitate authentic self-discovery and growth",
    duration: "50-60 min",
    icon: Heart,
    color: "therapeutic-blue",
  },
  {
    id: "mindfulness",
    name: "Mindfulness-Based Therapy",
    description: "Cultivate present-moment awareness",
    duration: "45-60 min",
    icon: Leaf,
    color: "therapeutic-green",
  },
  {
    id: "narrative",
    name: "Narrative Therapy",
    description: "Re-author life stories with compassion",
    duration: "50-90 min",
    icon: BookOpen,
    color: "warm",
  },
  {
    id: "integrative",
    name: "Integrative Approach",
    description: "Flexible methods for personalized care",
    duration: "45-60 min",
    icon: Heart,
    color: "sage",
  },
]

interface ModalitySelectionProps {
  patient: {
    id: number
    name: string
    age: number
    primaryConcern: string
    background: string
    avatar: string
  }
  onBack: () => void
  onStartSession: (modality: string) => void
}

export default function ModalitySelection({ patient, onBack, onStartSession }: ModalitySelectionProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "therapeutic-blue":
        return "bg-therapeutic-blue/10 border-therapeutic-blue/20 hover:bg-therapeutic-blue/20"
      case "therapeutic-green":
        return "bg-therapeutic-green/10 border-therapeutic-green/20 hover:bg-therapeutic-green/20"
      case "therapeutic-lavender":
        return "bg-therapeutic-lavender/10 border-therapeutic-lavender/20 hover:bg-therapeutic-lavender/20"
      case "warm":
        return "bg-warm-50 border-warm-200 hover:bg-warm-100"
      case "sage":
        return "bg-sage-50 border-sage-200 hover:bg-sage-100"
      default:
        return "bg-soft-50 border-soft-200 hover:bg-soft-100"
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-sage-100 px-4 lg:px-8 py-4 lg:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
          <Button variant="ghost" onClick={onBack} className="text-sage-600 hover:bg-sage-50 rounded-organic-md w-fit">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Clients
          </Button>
          <div className="flex items-center space-x-3 lg:space-x-4">
            <div className="p-2 bg-sage-100 rounded-organic-lg">
              <Leaf className="h-5 w-5 lg:h-6 lg:w-6 text-sage-600" />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-light text-sage-900">Choose Your Approach</h1>
              <p className="text-xs lg:text-sm text-sage-600">Select the therapeutic method for this session</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Patient Info */}
        <Card className="bg-white/70 backdrop-blur-sm border-sage-100 rounded-organic-2xl shadow-sm">
          <CardContent className="p-4 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Avatar className="h-16 w-16 lg:h-20 lg:w-20 ring-2 ring-sage-100 mx-auto sm:mx-0 flex-shrink-0">
                <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-sage-100 text-sage-700 text-lg lg:text-xl">
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <h2 className="text-xl lg:text-2xl font-light text-sage-900 mb-2">{patient.name}</h2>
                <p className="text-sage-600 mb-1">{patient.age} years old</p>
                <p className="text-sm text-sage-700 mb-2">
                  <strong>Focus Area:</strong> {patient.primaryConcern}
                </p>
                <p className="text-sm text-sage-600 leading-relaxed">{patient.background}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Modality Selection - Responsive Grid */}
        <Card className="bg-white/70 backdrop-blur-sm border-sage-100 rounded-organic-2xl shadow-sm">
          <CardHeader className="pb-4 lg:pb-6">
            <CardTitle className="text-lg lg:text-xl font-light text-sage-900">Therapeutic Approaches</CardTitle>
            <CardDescription className="text-sage-600 text-sm lg:text-base">
              Select your preferred approach for this session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {therapeuticModalities.map((modality) => {
                const IconComponent = modality.icon

                return (
                  <Card
                    key={modality.id}
                    className={`${getColorClasses(modality.color)} border-2 rounded-organic-xl hover:shadow-md transition-all duration-300`}
                  >
                    <CardContent className="p-4 lg:p-6">
                      <div className="text-center space-y-3 lg:space-y-4">
                        <div className={`p-2 lg:p-3 rounded-organic-lg bg-${modality.color}/20 inline-flex`}>
                          <IconComponent className="h-5 w-5 lg:h-6 lg:w-6 text-sage-600" />
                        </div>

                        <div>
                          <h3 className="font-medium text-sage-900 mb-2 text-sm lg:text-base">{modality.name}</h3>
                          <p className="text-xs lg:text-sm text-sage-600 mb-3 leading-relaxed">
                            {modality.description}
                          </p>
                          <div className="flex items-center justify-center text-xs text-sage-500 mb-3 lg:mb-4">
                            <Clock className="h-3 w-3 mr-1" />
                            {modality.duration}
                          </div>
                        </div>

                        <Button
                          className="w-full bg-sage-600 hover:bg-sage-700 text-white rounded-organic-lg transition-all duration-300 text-sm lg:text-base"
                          onClick={() => onStartSession(modality.id)}
                        >
                          Begin Session
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
