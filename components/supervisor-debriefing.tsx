"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send, Brain, MessageCircle, BookOpen, Lightbulb, Square } from "lucide-react"

interface DebriefingMessage {
  id: string
  sender: "trainee" | "supervisor"
  content: string
  timestamp: Date
  type?: "question" | "reflection" | "guidance"
}

interface SupervisorDebriefingProps {
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
  onBack: () => void
  onCompleteDebriefing: (debriefingData: any) => void
}

export default function SupervisorDebriefing({
  patient,
  modality,
  sessionDuration,
  sessionNotes,
  onBack,
  onCompleteDebriefing,
}: SupervisorDebriefingProps) {
  const [messages, setMessages] = useState<DebriefingMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [debriefingPhase, setDebriefingPhase] = useState<"opening" | "exploration" | "reflection" | "closing">(
    "opening",
  )
  const [keyInsights, setKeyInsights] = useState<string[]>([])

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Start debriefing with supervisor's opening
    initiateDebriefing()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getModalityExpertise = (modality: string) => {
    switch (modality) {
      case "cbt":
        return {
          name: "Dr. Sarah Chen",
          title: "CBT Specialist & Clinical Supervisor",
          expertise: "Cognitive Behavioral Therapy",
          avatar: "/therapist-office.png",
        }
      case "person-centered":
        return {
          name: "Dr. Michael Rogers",
          title: "Person-Centered Therapy Expert",
          expertise: "Humanistic & Person-Centered Approaches",
          avatar: "/therapist-office.png",
        }
      case "mindfulness":
        return {
          name: "Dr. Lisa Mindful",
          title: "Mindfulness-Based Therapy Specialist",
          expertise: "Mindfulness & Contemplative Therapies",
          avatar: "/therapist-office.png",
        }
      default:
        return {
          name: "Dr. Alex Thompson",
          title: "Clinical Supervisor",
          expertise: "Integrative Therapeutic Approaches",
          avatar: "/therapist-office.png",
        }
    }
  }

  const supervisor = getModalityExpertise(modality)

  const initiateDebriefing = async () => {
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const openingMessage: DebriefingMessage = {
      id: "1",
      sender: "supervisor",
      content: `Hello! I'm ${supervisor.name}, and I specialize in ${supervisor.expertise}. I've reviewed your session with ${patient.name} and your SOAP notes. This is a safe space for reflection and learning. How are you feeling about the session overall?`,
      timestamp: new Date(),
      type: "question",
    }

    setMessages([openingMessage])
    setIsTyping(false)
  }

  const sendMessage = async () => {
    if (!currentMessage.trim()) return

    const newMessage: DebriefingMessage = {
      id: Date.now().toString(),
      sender: "trainee",
      content: currentMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setCurrentMessage("")

    // Generate supervisor response
    setTimeout(
      () => {
        generateSupervisorResponse(currentMessage, debriefingPhase)
      },
      1000 + Math.random() * 2000,
    )
  }

  const generateSupervisorResponse = async (traineeMessage: string, phase: string) => {
    setIsTyping(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const response = getSupervisorResponse(traineeMessage, phase, sessionNotes, patient)

    const supervisorMessage: DebriefingMessage = {
      id: (Date.now() + 1).toString(),
      sender: "supervisor",
      content: response.content,
      timestamp: new Date(),
      type: response.type,
    }

    setMessages((prev) => [...prev, supervisorMessage])

    // Track insights and progress through phases
    if (response.insight) {
      setKeyInsights((prev) => [...prev, response.insight])
    }

    // Progress through debriefing phases
    updateDebriefingPhase(traineeMessage, phase)
    setIsTyping(false)
  }

  const getSupervisorResponse = (message: string, phase: string, notes: any, patient: any) => {
    const lowerMessage = message.toLowerCase()

    // Phase-based responses
    if (phase === "opening") {
      if (lowerMessage.includes("good") || lowerMessage.includes("well")) {
        return {
          content:
            "That's wonderful to hear. What specifically went well for you? I noticed in your notes that you documented some strong therapeutic moments.",
          type: "question" as const,
          insight: "Trainee feels positive about session",
        }
      } else if (lowerMessage.includes("difficult") || lowerMessage.includes("challenging")) {
        return {
          content:
            "It's completely normal to find sessions challenging - that's how we grow. Can you tell me more about what felt difficult? Sometimes our biggest learning comes from these moments.",
          type: "guidance" as const,
          insight: "Trainee identified challenges",
        }
      } else {
        return {
          content:
            "I appreciate your honesty. Let's explore this together. Looking at your SOAP notes, I can see you were quite thorough in your documentation. What stood out to you most during the session?",
          type: "question" as const,
        }
      }
    }

    if (phase === "exploration") {
      if (lowerMessage.includes("patient") || lowerMessage.includes(patient.name.toLowerCase())) {
        return {
          content: `Yes, ${patient.name} presented with ${patient.primaryConcern}. In your assessment, you noted some important observations. How did you decide on your therapeutic approach in those moments?`,
          type: "question" as const,
          insight: "Exploring therapeutic decision-making",
        }
      } else if (lowerMessage.includes("technique") || lowerMessage.includes("approach")) {
        return {
          content:
            "That's a great reflection on technique. In our modality, we often consider the timing and context of interventions. What guided your choice of when to use specific techniques?",
          type: "guidance" as const,
        }
      }
    }

    if (phase === "reflection") {
      return {
        content:
          "You're demonstrating excellent self-awareness. This kind of reflection is exactly what develops therapeutic expertise. What would you do differently if you had a similar session tomorrow?",
        type: "reflection" as const,
        insight: "Trainee showing self-awareness",
      }
    }

    // Default responses based on content
    if (lowerMessage.includes("anxious") || lowerMessage.includes("overwhelmed")) {
      return {
        content:
          "When patients express feeling overwhelmed, it's often a sign they trust you enough to be vulnerable. How did you respond to that trust, and what did you notice about your own reactions?",
        type: "question" as const,
      }
    }

    return {
      content:
        "That's a valuable insight. Can you elaborate on that thought? I'm curious about your reasoning behind that observation.",
      type: "question" as const,
    }
  }

  const updateDebriefingPhase = (message: string, currentPhase: string) => {
    // Simple phase progression logic
    if (currentPhase === "opening" && messages.length > 4) {
      setDebriefingPhase("exploration")
    } else if (currentPhase === "exploration" && messages.length > 8) {
      setDebriefingPhase("reflection")
    } else if (currentPhase === "reflection" && messages.length > 12) {
      setDebriefingPhase("closing")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const completeDebriefing = () => {
    const debriefingData = {
      messages,
      keyInsights,
      supervisorExpert: supervisor,
      duration: messages.length * 2, // Rough estimate
      phase: debriefingPhase,
    }
    onCompleteDebriefing(debriefingData)
  }

  const getMessageTypeIcon = (type?: string) => {
    switch (type) {
      case "question":
        return <MessageCircle className="h-3 w-3" />
      case "guidance":
        return <Lightbulb className="h-3 w-3" />
      case "reflection":
        return <Brain className="h-3 w-3" />
      default:
        return <BookOpen className="h-3 w-3" />
    }
  }

  const getMessageTypeColor = (type?: string) => {
    switch (type) {
      case "question":
        return "therapeutic"
      case "guidance":
        return "warm"
      case "reflection":
        return "lavender"
      default:
        return "sage"
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-sage-100 px-4 lg:px-8 py-4 lg:py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-4 lg:space-x-6">
            <Button variant="ghost" onClick={onBack} className="text-sage-600 hover:bg-sage-50 rounded-organic-md">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Notes
            </Button>
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className="p-2 bg-sage-100 rounded-organic-lg">
                <Brain className="h-5 w-5 lg:h-6 lg:w-6 text-sage-600" />
              </div>
              <div>
                <h1 className="text-lg lg:text-xl font-light text-sage-900">Supervisor Debriefing</h1>
                <p className="text-xs lg:text-sm text-sage-600">Reflective discussion with {supervisor.name}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="therapeutic" className="text-xs">
              {debriefingPhase}
            </Badge>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Session Context */}
          <Card className="bg-white/70 backdrop-blur-sm border-sage-100 rounded-organic-2xl shadow-sm mb-6">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-light text-sage-900">Session Context</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12 ring-2 ring-sage-100">
                    <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="bg-sage-100 text-sage-700">
                      {patient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sage-900">{patient.name}</p>
                    <p className="text-xs text-sage-600">{patient.primaryConcern}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-sage-700">Modality</p>
                  <p className="text-xs text-sage-600">{modality}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-sage-700">Duration</p>
                  <p className="text-xs text-sage-600">{formatTime(sessionDuration)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Supervisor Info */}
          <Card className="bg-white/70 backdrop-blur-sm border-sage-100 rounded-organic-2xl shadow-sm mb-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 ring-2 ring-therapeutic-blue/20">
                  <AvatarImage src={supervisor.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="bg-therapeutic-blue/10 text-therapeutic-blue">
                    {supervisor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-sage-900">{supervisor.name}</h3>
                  <p className="text-sm text-sage-600">{supervisor.title}</p>
                  <p className="text-xs text-sage-500">Specializing in {supervisor.expertise}</p>
                </div>
                <div className="ml-auto">
                  <div className="flex items-center space-x-1 text-xs text-green-600">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Available</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Debriefing Conversation */}
          <Card className="bg-white/70 backdrop-blur-sm border-sage-100 rounded-organic-2xl shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-light text-sage-900 flex items-center">
                <MessageCircle className="h-4 w-4 mr-2" />
                Supervision Discussion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 mb-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "trainee" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start space-x-3 max-w-lg ${
                          message.sender === "trainee" ? "flex-row-reverse space-x-reverse" : ""
                        }`}
                      >
                        <Avatar className="h-10 w-10 ring-1 ring-sage-100">
                          {message.sender === "supervisor" ? (
                            <>
                              <AvatarImage src={supervisor.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-therapeutic-blue/10 text-therapeutic-blue text-sm">
                                {supervisor.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </>
                          ) : (
                            <>
                              <AvatarImage src="/therapist-office.png" />
                              <AvatarFallback className="bg-sage-100 text-sage-700 text-sm">YOU</AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        <div
                          className={`rounded-organic-xl px-4 py-3 ${
                            message.sender === "trainee"
                              ? "bg-sage-600 text-white"
                              : "bg-white/80 backdrop-blur-sm border border-sage-100 text-sage-900"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">{message.content}</p>
                          <div className="flex items-center justify-between mt-2">
                            {message.type && message.sender === "supervisor" && (
                              <Badge variant={getMessageTypeColor(message.type)} className="text-xs">
                                {getMessageTypeIcon(message.type)}
                                <span className="ml-1">{message.type}</span>
                              </Badge>
                            )}
                            <p
                              className={`text-xs ${
                                message.sender === "trainee" ? "text-sage-200" : "text-sage-500"
                              } ${!message.type ? "ml-auto" : ""}`}
                            >
                              {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3 max-w-lg">
                        <Avatar className="h-10 w-10 ring-1 ring-sage-100">
                          <AvatarImage src={supervisor.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="bg-therapeutic-blue/10 text-therapeutic-blue text-sm">
                            {supervisor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-white/80 backdrop-blur-sm border border-sage-100 rounded-organic-xl px-4 py-3">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-sage-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-sage-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-sage-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="border-t border-sage-100 pt-4">
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <Input
                      value={currentMessage}
                      onChange={(e) => setCurrentMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Share your thoughts and reflections..."
                      className="pr-12 border-sage-200 rounded-organic-lg bg-white/80 focus:ring-sage-300 focus:border-sage-300"
                      disabled={isTyping}
                    />
                    <Button
                      size="sm"
                      className="absolute right-2 top-2 h-8 w-8 p-0 bg-sage-600 hover:bg-sage-700 rounded-organic-md"
                      onClick={sendMessage}
                      disabled={!currentMessage.trim() || isTyping}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    variant="outline"
                    onClick={completeDebriefing}
                    className="border-sage-200 text-sage-700 hover:bg-sage-50 rounded-organic-md bg-transparent"
                    disabled={messages.length < 4} // Require at least some conversation
                  >
                    <Square className="h-4 w-4 mr-2" />
                    End Debriefing
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          {keyInsights.length > 0 && (
            <Card className="bg-white/70 backdrop-blur-sm border-sage-100 rounded-organic-2xl shadow-sm mt-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-light text-sage-900 flex items-center">
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Key Insights from Discussion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {keyInsights.map((insight, index) => (
                    <div key={index} className="bg-therapeutic-beige/20 p-3 rounded-organic-lg">
                      <p className="text-sm text-sage-700">{insight}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
