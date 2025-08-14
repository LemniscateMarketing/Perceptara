"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Brain, Target, Star, CheckCircle, Lightbulb, BookOpen, Award, MessageCircle } from "lucide-react"

interface SessionFeedbackProps {
  patient: {
    id: number
    name: string
    age: number
    primaryConcern: string
    avatar: string
  }
  modality: string
  sessionDuration: number
  messageCount: number
  onContinueToNotes: () => void
  onBack: () => void
}

interface SkillAssessment {
  skill: string
  score: number
  feedback: string
  examples: string[]
}

interface LearningRecommendation {
  title: string
  description: string
  priority: "high" | "medium" | "low"
  resources: string[]
}

export default function SessionFeedback({
  patient,
  modality,
  sessionDuration,
  messageCount,
  onContinueToNotes,
  onBack,
}: SessionFeedbackProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [overallScore, setOverallScore] = useState(0)
  const [skillAssessments, setSkillAssessments] = useState<SkillAssessment[]>([])
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([])
  const [sessionHighlights, setSessionHighlights] = useState<string[]>([])

  useEffect(() => {
    // Simulate AI analysis
    const analyzeSession = async () => {
      setIsAnalyzing(true)

      // Simulate analysis delay
      await new Promise((resolve) => setTimeout(resolve, 3000))

      // Generate mock feedback based on session data
      generateSessionFeedback()
      setIsAnalyzing(false)
    }

    analyzeSession()
  }, [])

  const generateSessionFeedback = () => {
    // Mock skill assessments
    const skills: SkillAssessment[] = [
      {
        skill: "Active Listening",
        score: 85,
        feedback: "Excellent use of reflective listening. You consistently paraphrased the patient's concerns.",
        examples: ["Reflected patient's feelings about work stress", "Paraphrased concerns about sleep issues"],
      },
      {
        skill: "Empathy & Validation",
        score: 78,
        feedback: "Good emotional attunement. Consider more explicit validation statements.",
        examples: ["Acknowledged patient's struggle", "Showed understanding of their perspective"],
      },
      {
        skill: "Therapeutic Questioning",
        score: 72,
        feedback: "Used open-ended questions well. Could explore emotions more deeply.",
        examples: ["Asked about coping strategies", "Explored triggers for anxiety"],
      },
      {
        skill: "Pacing & Timing",
        score: 80,
        feedback: "Maintained good session flow. Allowed appropriate silences for reflection.",
        examples: ["Gave patient time to process", "Didn't rush through difficult topics"],
      },
    ]

    const learningRecs: LearningRecommendation[] = [
      {
        title: "Deepen Emotional Exploration",
        description:
          "Practice using more emotion-focused questions to help patients explore their feelings more thoroughly.",
        priority: "high",
        resources: ["Emotion-Focused Therapy techniques", "Feeling identification exercises"],
      },
      {
        title: "Strengthen Validation Skills",
        description: "Work on more explicit validation statements to help patients feel truly heard and understood.",
        priority: "medium",
        resources: ["DBT validation strategies", "Empathic responding practice"],
      },
      {
        title: "Mindfulness Integration",
        description: "Consider incorporating brief mindfulness moments when patients express feeling overwhelmed.",
        priority: "low",
        resources: ["Mindfulness-based interventions", "Grounding technique practice"],
      },
    ]

    const highlights = [
      "Created a safe, non-judgmental space for the patient",
      "Effectively used silence to allow patient processing time",
      "Demonstrated genuine curiosity about the patient's experience",
      "Maintained appropriate therapeutic boundaries throughout",
    ]

    setSkillAssessments(skills)
    setRecommendations(learningRecs)
    setSessionHighlights(highlights)
    setOverallScore(79) // Average of skill scores
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 70) return "text-therapeutic-blue"
    if (score >= 60) return "text-warm-600"
    return "text-red-500"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 85) return "green"
    if (score >= 70) return "therapeutic"
    if (score >= 60) return "warm"
    return "destructive"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "therapeutic"
      case "medium":
        return "warm"
      case "low":
        return "sage"
      default:
        return "sage"
    }
  }

  if (isAnalyzing) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white/80 backdrop-blur-sm border-b border-sage-100 px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="text-sage-600 hover:bg-sage-50 rounded-organic-md">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-sage-100 rounded-organic-lg">
                <Brain className="h-5 w-5 text-sage-600 animate-pulse" />
              </div>
              <div>
                <h1 className="text-lg font-light text-sage-900">AI Supervisor Analysis</h1>
                <p className="text-sm text-sage-600">Analyzing your therapeutic session...</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <Card className="bg-white/70 backdrop-blur-sm border-sage-100 rounded-organic-2xl shadow-sm p-8 text-center max-w-md">
            <div className="space-y-6">
              <div className="p-4 bg-therapeutic-blue/10 rounded-organic-xl">
                <Brain className="h-12 w-12 mx-auto text-therapeutic-blue animate-pulse mb-4" />
                <h3 className="text-lg font-medium text-sage-900 mb-2">Analyzing Your Session</h3>
                <p className="text-sm text-sage-600 mb-4">
                  Our AI supervisor is reviewing your therapeutic techniques, patient engagement, and session flow.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-xs text-sage-500">
                    <div className="w-2 h-2 bg-therapeutic-blue rounded-full animate-bounce"></div>
                    <span>Evaluating therapeutic techniques...</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-sage-500">
                    <div
                      className="w-2 h-2 bg-therapeutic-green rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <span>Assessing patient engagement...</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-sage-500">
                    <div
                      className="w-2 h-2 bg-therapeutic-lavender rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <span>Generating personalized feedback...</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-sage-100 px-4 lg:px-8 py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4 lg:space-x-6">
            <Button variant="ghost" onClick={onBack} className="text-sage-600 hover:bg-sage-50 rounded-organic-md">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Session
            </Button>
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="p-2 bg-sage-100 rounded-organic-lg">
                <Award className="h-5 w-5 lg:h-6 lg:w-6 text-sage-600" />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-light text-sage-900">Session Feedback</h1>
                <p className="text-xs lg:text-sm text-sage-600">AI supervisor analysis and recommendations</p>
              </div>
            </div>
          </div>
          <Button onClick={onContinueToNotes} className="bg-sage-600 hover:bg-sage-700 text-white rounded-organic-md">
            Continue to Notes
            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Overall Performance */}
        <Card className="bg-white/70 backdrop-blur-sm border-sage-100 rounded-organic-2xl shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg lg:text-xl font-light text-sage-900">Session Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient & Session Info */}
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 ring-2 ring-sage-100">
                  <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-sage-100 text-sage-700 text-lg">
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-medium text-sage-900">{patient.name}</h3>
                  <p className="text-sm text-sage-600">{modality}</p>
                  <p className="text-xs text-sage-500">
                    {formatTime(sessionDuration)} • {messageCount} exchanges
                  </p>
                </div>
              </div>

              {/* Overall Score */}
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-therapeutic-blue to-therapeutic-green flex items-center justify-center">
                    <span className="text-2xl font-light text-white">{overallScore}</span>
                  </div>
                </div>
                <h4 className="text-sm font-medium text-sage-900 mt-2">Overall Performance</h4>
                <p className="text-xs text-sage-600">Strong therapeutic presence</p>
              </div>

              {/* Session Stats */}
              <div className="space-y-3">
                <div className="bg-therapeutic-blue/10 p-3 rounded-organic-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-sage-700">Engagement</span>
                    <Badge variant="therapeutic" className="text-xs">
                      High
                    </Badge>
                  </div>
                </div>
                <div className="bg-therapeutic-green/10 p-3 rounded-organic-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-sage-700">Rapport</span>
                    <Badge variant="green" className="text-xs">
                      Excellent
                    </Badge>
                  </div>
                </div>
                <div className="bg-warm-50 p-3 rounded-organic-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-sage-700">Progress</span>
                    <Badge variant="warm" className="text-xs">
                      Good
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skill Assessments */}
        <Card className="bg-white/70 backdrop-blur-sm border-sage-100 rounded-organic-2xl shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-light text-sage-900 flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Skill Assessment
            </CardTitle>
            <CardDescription className="text-sage-600">
              Detailed analysis of your therapeutic techniques and skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {skillAssessments.map((skill, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sage-900">{skill.skill}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getScoreColor(skill.score)}`}>{skill.score}%</span>
                      <Badge variant={getScoreBadge(skill.score)} className="text-xs">
                        {skill.score >= 85 ? "Excellent" : skill.score >= 70 ? "Good" : "Developing"}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={skill.score} className="h-2" />
                  <p className="text-sm text-sage-600">{skill.feedback}</p>
                  <div className="bg-sage-50 p-3 rounded-organic-lg">
                    <h5 className="text-xs font-medium text-sage-700 mb-2">Examples from your session:</h5>
                    <ul className="space-y-1">
                      {skill.examples.map((example, idx) => (
                        <li key={idx} className="text-xs text-sage-600 flex items-start">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Session Highlights */}
        <Card className="bg-white/70 backdrop-blur-sm border-sage-100 rounded-organic-2xl shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-light text-sage-900 flex items-center">
              <Star className="h-5 w-5 mr-2" />
              Session Highlights
            </CardTitle>
            <CardDescription className="text-sage-600">What you did particularly well in this session</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sessionHighlights.map((highlight, index) => (
                <div key={index} className="bg-therapeutic-beige/20 p-4 rounded-organic-lg">
                  <div className="flex items-start space-x-3">
                    <div className="p-1 bg-green-100 rounded-organic-sm">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-sm text-sage-700 leading-relaxed">{highlight}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Recommendations */}
        <Card className="bg-white/70 backdrop-blur-sm border-sage-100 rounded-organic-2xl shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-light text-sage-900 flex items-center">
              <Lightbulb className="h-5 w-5 mr-2" />
              Growth Opportunities
            </CardTitle>
            <CardDescription className="text-sage-600">
              Personalized recommendations for your continued development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <Card key={index} className="bg-white/80 border-sage-100 rounded-organic-xl">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-sage-900">{rec.title}</h4>
                      <Badge variant={getPriorityColor(rec.priority)} className="text-xs">
                        {rec.priority} priority
                      </Badge>
                    </div>
                    <p className="text-sm text-sage-600 mb-3">{rec.description}</p>
                    <div className="space-y-2">
                      <h5 className="text-xs font-medium text-sage-700">Recommended resources:</h5>
                      <div className="flex flex-wrap gap-2">
                        {rec.resources.map((resource, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            <BookOpen className="h-3 w-3 mr-1" />
                            {resource}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={onContinueToNotes}
            className="bg-sage-600 hover:bg-sage-700 text-white rounded-organic-lg px-8"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Continue to Session Notes
          </Button>
        </div>
      </div>
    </div>
  )
}
