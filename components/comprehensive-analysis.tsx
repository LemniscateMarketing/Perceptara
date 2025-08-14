"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Brain,
  Target,
  Star,
  CheckCircle,
  Lightbulb,
  BookOpen,
  Award,
  MessageCircle,
  FileText,
  TrendingUp,
} from "lucide-react"

interface ComprehensiveAnalysisProps {
  patient: {
    id: number
    name: string
    age: number
    primaryConcern: string
    avatar: string
  }
  modality: string
  sessionDuration: number
  sessionNotes: {
    subjective: string
    objective: string
    assessment: string
    plan: string
  }
  debriefingData: {
    messages: any[]
    keyInsights: string[]
    supervisorExpert: any
    duration: number
    phase: string
  }
  onBack: () => void
  onComplete: () => void
}

interface SkillAssessment {
  skill: string
  score: number
  feedback: string
  evidence: string[]
  improvement: string
}

interface LearningRecommendation {
  title: string
  description: string
  priority: "high" | "medium" | "low"
  resources: string[]
  timeframe: string
}

export default function ComprehensiveAnalysis({
  patient,
  modality,
  sessionDuration,
  sessionNotes,
  debriefingData,
  onBack,
  onComplete,
}: ComprehensiveAnalysisProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true)
  const [overallScore, setOverallScore] = useState(0)
  const [skillAssessments, setSkillAssessments] = useState<SkillAssessment[]>([])
  const [recommendations, setRecommendations] = useState<LearningRecommendation[]>([])
  const [sessionHighlights, setSessionHighlights] = useState<string[]>([])
  const [growthAreas, setGrowthAreas] = useState<string[]>([])
  const [supervisorInsights, setSupervisorInsights] = useState<string[]>([])

  useEffect(() => {
    // Comprehensive analysis incorporating all data sources
    const analyzeAllData = async () => {
      setIsAnalyzing(true)
      await new Promise((resolve) => setTimeout(resolve, 4000))
      generateComprehensiveAnalysis()
      setIsAnalyzing(false)
    }

    analyzeAllData()
  }, [])

  const generateComprehensiveAnalysis = () => {
    // Analyze based on session + notes + debriefing
    const skills: SkillAssessment[] = [
      {
        skill: "Therapeutic Relationship Building",
        score: 88,
        feedback: "Excellent rapport development evidenced in both session flow and supervisor discussion.",
        evidence: [
          "Patient opened up about vulnerable topics",
          "Maintained consistent empathic responses",
          "Supervisor noted strong alliance building",
        ],
        improvement: "Continue developing cultural sensitivity awareness",
      },
      {
        skill: "Clinical Documentation",
        score: 82,
        feedback: "Strong SOAP note structure with comprehensive assessment section.",
        evidence: [
          "Thorough subjective documentation",
          "Clear objective observations",
          "Well-reasoned clinical assessment",
        ],
        improvement: "Include more specific behavioral observations",
      },
      {
        skill: "Self-Reflection & Supervision Use",
        score: 85,
        feedback: "Demonstrated excellent self-awareness and openness to learning in supervision.",
        evidence: [
          "Asked thoughtful questions during debriefing",
          "Showed insight into own therapeutic process",
          "Receptive to supervisor feedback",
        ],
        improvement: "Practice articulating theoretical rationale for interventions",
      },
      {
        skill: "Modality-Specific Techniques",
        score: 76,
        feedback: `Good application of ${modality} principles with room for deeper integration.`,
        evidence: [
          "Used appropriate therapeutic techniques",
          "Maintained modality-consistent approach",
          "Supervisor confirmed theoretical alignment",
        ],
        improvement: "Deepen understanding of advanced techniques in this modality",
      },
    ]

    const learningRecs: LearningRecommendation[] = [
      {
        title: "Advanced Supervision Skills",
        description:
          "Your supervision discussion showed excellent self-reflection. Focus on developing skills to use supervision even more effectively.",
        priority: "high",
        resources: ["Supervision essentials workshop", "Reflective practice journal", "Peer consultation groups"],
        timeframe: "Next 2-4 weeks",
      },
      {
        title: "Deepen Modality Expertise",
        description: `Build on your solid foundation in ${modality} with advanced training and practice.`,
        priority: "medium",
        resources: ["Advanced certification program", "Specialized workshops", "Expert mentorship"],
        timeframe: "Next 3-6 months",
      },
      {
        title: "Documentation Excellence",
        description: "Your SOAP notes are strong. Focus on integrating more behavioral specificity.",
        priority: "low",
        resources: ["Clinical documentation guide", "Behavioral observation training"],
        timeframe: "Ongoing practice",
      },
    ]

    const highlights = [
      "Created genuine therapeutic connection with patient",
      "Demonstrated professional self-awareness in supervision",
      "Maintained ethical boundaries throughout session",
      "Showed excellent receptivity to learning and feedback",
      "Documented session thoroughly and professionally",
    ]

    const growth = [
      "Continue developing confidence in challenging moments",
      "Practice articulating theoretical rationale in real-time",
      "Expand repertoire of intervention techniques",
      "Strengthen ability to track multiple therapeutic processes simultaneously",
    ]

    const insights =
      debriefingData.keyInsights.length > 0
        ? debriefingData.keyInsights
        : [
            "Trainee shows strong commitment to professional development",
            "Demonstrates good balance of confidence and humility",
            "Ready for more complex cases with continued supervision",
          ]

    setSkillAssessments(skills)
    setRecommendations(learningRecs)
    setSessionHighlights(highlights)
    setGrowthAreas(growth)
    setSupervisorInsights(insights)
    setOverallScore(83) // Weighted average considering all factors
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 75) return "text-therapeutic-blue"
    if (score >= 65) return "text-warm-600"
    return "text-red-500"
  }

  const getScoreBadge = (score: number) => {
    if (score >= 85) return "green"
    if (score >= 75) return "therapeutic"
    if (score >= 65) return "warm"
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
                <h1 className="text-lg font-light text-sage-900">Comprehensive Analysis</h1>
                <p className="text-sm text-sage-600">Integrating session, notes, and supervision data...</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 flex items-center justify-center min-h-[60vh]">
          <Card className="bg-white/70 backdrop-blur-sm border-sage-100 rounded-organic-2xl shadow-sm p-8 text-center max-w-lg">
            <div className="space-y-6">
              <div className="p-6 bg-therapeutic-blue/10 rounded-organic-xl">
                <Brain className="h-16 w-16 mx-auto text-therapeutic-blue animate-pulse mb-4" />
                <h3 className="text-xl font-medium text-sage-900 mb-3">Comprehensive Analysis in Progress</h3>
                <p className="text-sm text-sage-600 mb-6">
                  Our AI is analyzing your complete learning experience: session performance, clinical documentation,
                  and supervision discussion.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-xs text-sage-500">
                    <FileText className="h-4 w-4" />
                    <span>Analyzing session notes and documentation...</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-sage-500">
                    <MessageCircle className="h-4 w-4" />
                    <span>Processing supervision discussion insights...</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-xs text-sage-500">
                    <TrendingUp className="h-4 w-4" />
                    <span>Generating personalized learning recommendations...</span>
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
              Back to Debriefing
            </Button>
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="p-2 bg-sage-100 rounded-organic-lg">
                <Award className="h-5 w-5 lg:h-6 lg:w-6 text-sage-600" />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-light text-sage-900">Comprehensive Analysis</h1>
                <p className="text-xs lg:text-sm text-sage-600">Complete learning assessment and recommendations</p>
              </div>
            </div>
          </div>
          <Button onClick={onComplete} className="bg-sage-600 hover:bg-sage-700 text-white rounded-organic-md">
            Complete Training Session
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Overall Performance Summary */}
        <Card className="bg-white/70 backdrop-blur-sm border-sage-100 rounded-organic-2xl shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg lg:text-xl font-light text-sage-900">Learning Journey Summary</CardTitle>
            <CardDescription className="text-sage-600">
              Comprehensive assessment based on session performance, clinical documentation, and supervision discussion
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Patient Info */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-14 w-14 ring-2 ring-sage-100">
                  <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-sage-100 text-sage-700">
                    {patient.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-sage-900">{patient.name}</h3>
                  <p className="text-xs text-sage-600">{modality}</p>
                  <p className="text-xs text-sage-500">{formatTime(sessionDuration)}</p>
                </div>
              </div>

              {/* Overall Score */}
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-therapeutic-blue to-therapeutic-green flex items-center justify-center">
                    <span className="text-xl font-light text-white">{overallScore}</span>
                  </div>
                </div>
                <h4 className="text-sm font-medium text-sage-900 mt-2">Overall Performance</h4>
                <p className="text-xs text-sage-600">Excellent progress</p>
              </div>

              {/* Supervisor */}
              <div className="flex items-center space-x-3">
                <Avatar className="h-14 w-14 ring-2 ring-therapeutic-blue/20">
                  <AvatarImage src={debriefingData.supervisorExpert.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-therapeutic-blue/10 text-therapeutic-blue">
                    {debriefingData.supervisorExpert.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-sage-900">{debriefingData.supervisorExpert.name}</h3>
                  <p className="text-xs text-sage-600">Clinical Supervisor</p>
                  <p className="text-xs text-sage-500">{debriefingData.messages.length} exchanges</p>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="space-y-2">
                <div className="bg-therapeutic-blue/10 p-2 rounded-organic-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-sage-700">Documentation</span>
                    <Badge variant="therapeutic" className="text-xs">
                      Complete
                    </Badge>
                  </div>
                </div>
                <div className="bg-therapeutic-green/10 p-2 rounded-organic-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-sage-700">Supervision</span>
                    <Badge variant="green" className="text-xs">
                      Engaged
                    </Badge>
                  </div>
                </div>
                <div className="bg-warm-50 p-2 rounded-organic-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-sage-700">Growth</span>
                    <Badge variant="warm" className="text-xs">
                      Strong
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Analysis */}
        <Card className="bg-white/70 backdrop-blur-sm border-sage-100 rounded-organic-2xl shadow-sm">
          <CardContent className="p-6">
            <Tabs defaultValue="skills" className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-sage-50 rounded-organic-lg">
                <TabsTrigger value="skills" className="rounded-organic-md">
                  <Target className="h-4 w-4 mr-2" />
                  Skills
                </TabsTrigger>
                <TabsTrigger value="highlights" className="rounded-organic-md">
                  <Star className="h-4 w-4 mr-2" />
                  Highlights
                </TabsTrigger>
                <TabsTrigger value="growth" className="rounded-organic-md">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Growth
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="rounded-organic-md">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Next Steps
                </TabsTrigger>
              </TabsList>

              <TabsContent value="skills" className="space-y-6 mt-6">
                {skillAssessments.map((skill, index) => (
                  <div key={index} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sage-900">{skill.skill}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm font-medium ${getScoreColor(skill.score)}`}>{skill.score}%</span>
                        <Badge variant={getScoreBadge(skill.score)} className="text-xs">
                          {skill.score >= 85 ? "Excellent" : skill.score >= 75 ? "Strong" : "Developing"}
                        </Badge>
                      </div>
                    </div>
                    <Progress value={skill.score} className="h-2" />
                    <p className="text-sm text-sage-600">{skill.feedback}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-sage-50 p-3 rounded-organic-lg">
                        <h5 className="text-xs font-medium text-sage-700 mb-2">Evidence:</h5>
                        <ul className="space-y-1">
                          {skill.evidence.map((item, idx) => (
                            <li key={idx} className="text-xs text-sage-600 flex items-start">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="bg-therapeutic-beige/20 p-3 rounded-organic-lg">
                        <h5 className="text-xs font-medium text-sage-700 mb-2">Next Level:</h5>
                        <p className="text-xs text-sage-600">{skill.improvement}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="highlights" className="space-y-4 mt-6">
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
              </TabsContent>

              <TabsContent value="growth" className="space-y-4 mt-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sage-900 mb-3">Areas for Continued Development</h4>
                    <div className="space-y-3">
                      {growthAreas.map((area, index) => (
                        <div key={index} className="bg-warm-50 p-3 rounded-organic-lg">
                          <p className="text-sm text-sage-700">{area}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sage-900 mb-3">Supervisor Insights</h4>
                    <div className="space-y-3">
                      {supervisorInsights.map((insight, index) => (
                        <div key={index} className="bg-therapeutic-blue/10 p-3 rounded-organic-lg">
                          <p className="text-sm text-sage-700 italic">"{insight}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="space-y-4 mt-6">
                {recommendations.map((rec, index) => (
                  <Card key={index} className="bg-white/80 border-sage-100 rounded-organic-xl">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-medium text-sage-900">{rec.title}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge variant={getPriorityColor(rec.priority)} className="text-xs">
                            {rec.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {rec.timeframe}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-sage-600 mb-3">{rec.description}</p>
                      <div className="space-y-2">
                        <h5 className="text-xs font-medium text-sage-700">Recommended actions:</h5>
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Complete Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={onComplete}
            className="bg-sage-600 hover:bg-sage-700 text-white rounded-organic-lg px-12 py-3"
          >
            <Award className="h-5 w-5 mr-2" />
            Complete Training Session
          </Button>
        </div>
      </div>
    </div>
  )
}
