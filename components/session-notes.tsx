"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Save,
  Download,
  Clock,
  FileText,
  Star,
  User,
  Eye,
  Brain,
  Target,
  Heart,
  Lightbulb,
} from "lucide-react"

interface SessionNotesProps {
  patient: {
    id: number
    name: string
    age: number
    primaryConcern: string
    avatar: string
  }
  modality: string
  sessionDuration: number
  onBack: () => void
  onSave: (notes: any) => void // Updated to pass notes data
}

export default function SessionNotes({ patient, modality, sessionDuration, onBack, onSave }: SessionNotesProps) {
  const [soapNotes, setSoapNotes] = useState({
    subjective: "",
    objective: "",
    assessment: "",
    plan: "",
  })

  const [reflectionNotes, setReflectionNotes] = useState({
    personalReflection: "",
    challengingMoments: "",
    skillsUsed: "",
    areasForGrowth: "",
    supervisorQuestions: "",
  })

  const [sessionRating, setSessionRating] = useState(0)
  const [activeTab, setActiveTab] = useState("soap")

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSoapChange = (field: string, value: string) => {
    setSoapNotes((prev) => ({ ...prev, [field]: value }))
  }

  const handleReflectionChange = (field: string, value: string) => {
    setReflectionNotes((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    const notesData = {
      subjective: soapNotes.subjective,
      objective: soapNotes.objective,
      assessment: soapNotes.assessment,
      plan: soapNotes.plan,
      reflectionNotes,
      sessionRating,
    }

    console.log("Saving session notes:", {
      patient,
      modality,
      sessionDuration,
      ...notesData,
    })

    onSave(notesData)
  }

  const handleExport = () => {
    const exportText = `
CLINICAL SESSION NOTE - SOAP FORMAT
===================================

PATIENT INFORMATION:
Name: ${patient.name}
Age: ${patient.age}
Primary Concern: ${patient.primaryConcern}
Therapeutic Modality: ${modality}
Session Duration: ${formatTime(sessionDuration)}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

SOAP NOTE:
----------

SUBJECTIVE:
${soapNotes.subjective}

OBJECTIVE:
${soapNotes.objective}

ASSESSMENT:
${soapNotes.assessment}

PLAN:
${soapNotes.plan}

SESSION RATING: ${sessionRating}/5

---
Clinician: Dr. Rachel Smith
Signature: ________________________
Date: ${new Date().toLocaleDateString()}
    `.trim()

    const blob = new Blob([exportText], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `SOAP-${patient.name.replace(" ", "-")}-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-sage-100 px-4 lg:px-8 py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4 lg:space-x-6">
            <Button variant="ghost" onClick={onBack} className="text-sage-600 hover:bg-sage-50 rounded-organic-md">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="p-2 bg-sage-100 rounded-organic-lg">
                <FileText className="h-5 w-5 lg:h-6 lg:w-6 text-sage-600" />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-light text-sage-900">Clinical Documentation</h1>
                <p className="text-xs lg:text-sm text-sage-600">SOAP format session notes</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleExport}
              className="border-sage-200 text-sage-600 hover:bg-sage-50 rounded-organic-md bg-transparent"
            >
              <Download className="h-4 w-4 mr-2" />
              Export SOAP
            </Button>
            <Button onClick={handleSave} className="bg-sage-600 hover:bg-sage-700 text-white rounded-organic-md">
              <Save className="h-4 w-4 mr-2" />
              Save Notes
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Session Overview */}
        <Card className="bg-white/70 backdrop-blur-sm border-sage-100 rounded-organic-2xl shadow-sm">
          <CardHeader className="pb-4 lg:pb-6">
            <CardTitle className="text-lg lg:text-xl font-light text-sage-900">Session Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Patient Info */}
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
                  <h3 className="text-lg font-medium text-sage-900 mb-1">{patient.name}</h3>
                  <p className="text-sage-600 text-sm">{patient.age} years old</p>
                  <p className="text-xs text-sage-700">
                    <strong>Presenting Concern:</strong> {patient.primaryConcern}
                  </p>
                </div>
              </div>

              {/* Session Details */}
              <div className="space-y-3">
                <div className="bg-therapeutic-blue/10 p-3 rounded-organic-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Brain className="h-4 w-4 text-sage-600" />
                    <span className="text-sm font-medium text-sage-700">Modality</span>
                  </div>
                  <p className="text-sm text-sage-900">{modality}</p>
                </div>
                <div className="bg-therapeutic-green/10 p-3 rounded-organic-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <Clock className="h-4 w-4 text-sage-600" />
                    <span className="text-sm font-medium text-sage-700">Duration</span>
                  </div>
                  <p className="text-sm text-sage-900">{formatTime(sessionDuration)}</p>
                </div>
              </div>

              {/* Session Rating */}
              <div className="bg-warm-50 p-4 rounded-organic-lg">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-sage-700">Clinical Effectiveness</span>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setSessionRating(star)}
                        className={`p-1 rounded-organic-sm transition-colors ${
                          star <= sessionRating ? "text-yellow-500" : "text-sage-300 hover:text-yellow-400"
                        }`}
                      >
                        <Star className="h-4 w-4 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-sage-600">Rate therapeutic effectiveness</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SOAP Notes with Tabs */}
        <Card className="bg-white/70 backdrop-blur-sm border-sage-100 rounded-organic-2xl shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg lg:text-xl font-light text-sage-900">Clinical Documentation</CardTitle>
            <CardDescription className="text-sage-600">
              Professional SOAP format notes with optional reflection space
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-sage-50 rounded-organic-lg">
                <TabsTrigger
                  value="soap"
                  className="rounded-organic-md data-[state=active]:bg-white data-[state=active]:text-sage-900"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  SOAP Notes
                </TabsTrigger>
                <TabsTrigger
                  value="reflection"
                  className="rounded-organic-md data-[state=active]:bg-white data-[state=active]:text-sage-900"
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Personal Reflection
                </TabsTrigger>
              </TabsList>

              {/* SOAP Notes Tab */}
              <TabsContent value="soap" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Subjective */}
                  <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base font-medium text-sage-900 flex items-center">
                        <User className="h-4 w-4 mr-2 text-therapeutic-blue" />
                        Subjective
                      </CardTitle>
                      <CardDescription className="text-xs text-sage-600">
                        Patient's reported symptoms, feelings, concerns, and history in their own words
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Patient reports feeling 'overwhelmed with work stress'... Patient states 'I haven't been sleeping well'... Patient describes anxiety as 'constant worry about everything'..."
                        value={soapNotes.subjective}
                        onChange={(e) => handleSoapChange("subjective", e.target.value)}
                        className="min-h-[140px] border-sage-200 rounded-organic-lg bg-white/80 focus:ring-sage-300 focus:border-sage-300 resize-none text-sm"
                      />
                    </CardContent>
                  </Card>

                  {/* Objective */}
                  <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base font-medium text-sage-900 flex items-center">
                        <Eye className="h-4 w-4 mr-2 text-therapeutic-green" />
                        Objective
                      </CardTitle>
                      <CardDescription className="text-xs text-sage-600">
                        Observable behaviors, appearance, affect, and measurable clinical findings
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Patient appeared well-groomed, maintained eye contact... Affect was anxious with visible tension... Speech was rapid and pressured... No psychomotor agitation observed..."
                        value={soapNotes.objective}
                        onChange={(e) => handleSoapChange("objective", e.target.value)}
                        className="min-h-[140px] border-sage-200 rounded-organic-lg bg-white/80 focus:ring-sage-300 focus:border-sage-300 resize-none text-sm"
                      />
                    </CardContent>
                  </Card>

                  {/* Assessment */}
                  <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base font-medium text-sage-900 flex items-center">
                        <Brain className="h-4 w-4 mr-2 text-therapeutic-lavender" />
                        Assessment
                      </CardTitle>
                      <CardDescription className="text-xs text-sage-600">
                        Clinical impression, diagnosis, progress toward goals, and therapeutic analysis
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Patient demonstrates symptoms consistent with generalized anxiety... Shows good insight into triggers... Therapeutic alliance is strong... Progress toward anxiety management goals is evident..."
                        value={soapNotes.assessment}
                        onChange={(e) => handleSoapChange("assessment", e.target.value)}
                        className="min-h-[140px] border-sage-200 rounded-organic-lg bg-white/80 focus:ring-sage-300 focus:border-sage-300 resize-none text-sm"
                      />
                    </CardContent>
                  </Card>

                  {/* Plan */}
                  <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base font-medium text-sage-900 flex items-center">
                        <Target className="h-4 w-4 mr-2 text-warm-600" />
                        Plan
                      </CardTitle>
                      <CardDescription className="text-xs text-sage-600">
                        Treatment plan, interventions, homework, next session goals, and follow-up
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Continue weekly CBT sessions focusing on anxiety management... Assign breathing exercises for homework... Schedule follow-up in 1 week... Consider referral for psychiatric evaluation if symptoms persist..."
                        value={soapNotes.plan}
                        onChange={(e) => handleSoapChange("plan", e.target.value)}
                        className="min-h-[140px] border-sage-200 rounded-organic-lg bg-white/80 focus:ring-sage-300 focus:border-sage-300 resize-none text-sm"
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Reflection Tab */}
              <TabsContent value="reflection" className="space-y-6 mt-6">
                <div className="bg-therapeutic-beige/20 p-4 rounded-organic-lg mb-6">
                  <p className="text-sm text-sage-700 italic">
                    <strong>Note:</strong> This reflection space is for personal growth and supervision discussions.
                    Content here is not part of the official clinical record.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Reflection */}
                  <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base font-medium text-sage-900 flex items-center">
                        <Heart className="h-4 w-4 mr-2" />
                        Personal Reflection
                      </CardTitle>
                      <CardDescription className="text-xs text-sage-600">
                        Your thoughts, feelings, and reactions during the session
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="I felt confident when... I struggled with... I was surprised by... I noticed my own anxiety when..."
                        value={reflectionNotes.personalReflection}
                        onChange={(e) => handleReflectionChange("personalReflection", e.target.value)}
                        className="min-h-[120px] border-sage-200 rounded-organic-lg bg-white/80 focus:ring-sage-300 focus:border-sage-300 resize-none text-sm"
                      />
                    </CardContent>
                  </Card>

                  {/* Challenging Moments */}
                  <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base font-medium text-sage-900 flex items-center">
                        <Lightbulb className="h-4 w-4 mr-2" />
                        Challenging Moments
                      </CardTitle>
                      <CardDescription className="text-xs text-sage-600">
                        Difficult moments and how you handled them
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="When the patient became emotional, I felt... The silence felt uncomfortable because... I wasn't sure how to respond when..."
                        value={reflectionNotes.challengingMoments}
                        onChange={(e) => handleReflectionChange("challengingMoments", e.target.value)}
                        className="min-h-[120px] border-sage-200 rounded-organic-lg bg-white/80 focus:ring-sage-300 focus:border-sage-300 resize-none text-sm"
                      />
                    </CardContent>
                  </Card>

                  {/* Skills Used */}
                  <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base font-medium text-sage-900 flex items-center">
                        <Brain className="h-4 w-4 mr-2" />
                        Skills & Techniques
                      </CardTitle>
                      <CardDescription className="text-xs text-sage-600">
                        What worked well and what you'd do differently
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="Active listening was effective when... Reflection helped the patient... I should have used more... Next time I would try..."
                        value={reflectionNotes.skillsUsed}
                        onChange={(e) => handleReflectionChange("skillsUsed", e.target.value)}
                        className="min-h-[120px] border-sage-200 rounded-organic-lg bg-white/80 focus:ring-sage-300 focus:border-sage-300 resize-none text-sm"
                      />
                    </CardContent>
                  </Card>

                  {/* Areas for Growth */}
                  <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-base font-medium text-sage-900 flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        Growth Areas
                      </CardTitle>
                      <CardDescription className="text-xs text-sage-600">
                        Skills to develop and learning goals
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        placeholder="I need to work on... I want to practice... I should research... My supervisor might help me with..."
                        value={reflectionNotes.areasForGrowth}
                        onChange={(e) => handleReflectionChange("areasForGrowth", e.target.value)}
                        className="min-h-[120px] border-sage-200 rounded-organic-lg bg-white/80 focus:ring-sage-300 focus:border-sage-300 resize-none text-sm"
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Supervisor Questions */}
                <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base font-medium text-sage-900">Questions for Supervision</CardTitle>
                    <CardDescription className="text-xs text-sage-600">
                      Questions to discuss with your supervisor or in group consultation
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="How should I have handled...? What would you have done when...? Am I on the right track with...? Should I be concerned about...?"
                      value={reflectionNotes.supervisorQuestions}
                      onChange={(e) => handleReflectionChange("supervisorQuestions", e.target.value)}
                      className="min-h-[100px] border-sage-200 rounded-organic-lg bg-white/80 focus:ring-sage-300 focus:border-sage-300 resize-none text-sm"
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4">
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-sage-200 text-sage-600 hover:bg-sage-50 rounded-organic-lg bg-transparent"
          >
            <Download className="h-4 w-4 mr-2" />
            Export SOAP Notes
          </Button>
          <Button onClick={handleSave} className="bg-sage-600 hover:bg-sage-700 text-white rounded-organic-lg px-8">
            <Save className="h-4 w-4 mr-2" />
            Save Clinical Notes
          </Button>
        </div>
      </div>
    </div>
  )
}
