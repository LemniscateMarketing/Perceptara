"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send, Mic, Square, Play, Clock, Heart, FileText, Leaf, ChevronUp, ChevronDown } from "lucide-react"
import AISupervisorPanel from "./ai-supervisor-panel"

interface Message {
  id: string
  sender: "psychologist" | "patient" | "system"
  content: string
  timestamp: Date
  emotion?: string
}

interface SessionInterfaceProps {
  patient: {
    id: number
    name: string
    age: number
    primaryConcern: string
    avatar: string
  }
  modality: string
  onBack: () => void
  onEndSession: (duration: number, messageCount: number) => void
}

export default function SessionInterface({ patient, modality, onBack, onEndSession }: SessionInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "patient",
      content: "I've been feeling really overwhelmed lately with everything going on.",
      timestamp: new Date(),
      emotion: "thoughtful",
    },
  ])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [sessionDuration, setSessionDuration] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [supervisorPanelOpen, setSupervisorPanelOpen] = useState(false)
  const [patientState, setPatientState] = useState({
    mood: "contemplative",
    engagement: "present",
    progress: "opening",
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sessionStartTime = useRef(new Date())

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionDuration(Math.floor((new Date().getTime() - sessionStartTime.current.getTime()) / 1000))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const sendMessage = () => {
    if (!currentMessage.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "psychologist",
      content: currentMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, newMessage])
    setCurrentMessage("")

    // Add system message for non-verbal cues
    setTimeout(() => {
      const systemMessage: Message = {
        id: (Date.now() + 0.5).toString(),
        sender: "system",
        content: "Patient takes a deep breath and looks down thoughtfully.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, systemMessage])
    }, 1000)

    // Simulate patient response after a delay
    setTimeout(
      () => {
        const patientResponses = [
          "That's... that's actually really helpful to think about it that way.",
          "I never considered that perspective before. It makes me feel less alone.",
          "I'm not sure I fully understand. Could you help me explore that more?",
          "That resonates with me deeply. I feel like you really understand.",
          "I appreciate you creating this safe space for me to share.",
        ]

        const response: Message = {
          id: (Date.now() + 1).toString(),
          sender: "patient",
          content: patientResponses[Math.floor(Math.random() * patientResponses.length)],
          timestamp: new Date(),
          emotion: Math.random() > 0.5 ? "hopeful" : "reflective",
        }

        setMessages((prev) => [...prev, response])

        // Update patient state based on interaction
        setPatientState((prev) => ({
          ...prev,
          engagement: Math.random() > 0.3 ? "deeply engaged" : "present",
          mood: Math.random() > 0.4 ? "opening" : prev.mood,
        }))
      },
      2000 + Math.random() * 2000,
    )
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case "contemplative":
      case "thoughtful":
        return "therapeutic"
      case "opening":
      case "hopeful":
        return "green"
      case "reflective":
        return "lavender"
      case "deeply engaged":
      case "present":
        return "warm"
      default:
        return "sage"
    }
  }

  const handleEndSession = () => {
    onEndSession(sessionDuration, messages.length)
  }

  const getLastPatientMessage = () => {
    const lastPatientMsg = messages.filter((m) => m.sender === "patient").pop()
    return lastPatientMsg?.content
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-sage-100 px-4 lg:px-8 py-4 lg:py-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 lg:space-x-6 min-w-0 flex-1">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-sage-600 hover:bg-sage-50 rounded-organic-md flex-shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <div className="flex items-center space-x-3 lg:space-x-4 min-w-0 flex-1">
              <Avatar className="h-10 w-10 lg:h-12 lg:w-12 ring-2 ring-sage-100 flex-shrink-0">
                <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                <AvatarFallback className="bg-sage-100 text-sage-700 text-sm">
                  {patient.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <h1 className="text-sm lg:text-lg font-medium text-sage-900 truncate">{patient.name}</h1>
                <p className="text-xs lg:text-sm text-sage-600 truncate">{modality}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 lg:space-x-6 flex-shrink-0">
            <div className="flex items-center space-x-2 text-xs lg:text-sm text-sage-600 bg-white/60 px-2 lg:px-3 py-1 lg:py-2 rounded-organic-lg">
              <Clock className="h-3 w-3 lg:h-4 lg:w-4" />
              <span className="hidden sm:inline">{formatTime(sessionDuration)}</span>
            </div>

            {/* Mobile sidebar toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden border-sage-200 text-sage-700 hover:bg-sage-50 rounded-organic-md"
            >
              {sidebarOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
            </Button>

            <Button
              variant="outline"
              onClick={handleEndSession}
              className="border-sage-200 text-sage-700 hover:bg-sage-50 rounded-organic-md bg-transparent text-xs lg:text-sm px-2 lg:px-4"
            >
              <Square className="h-3 w-3 lg:h-4 lg:w-4 mr-1 lg:mr-2" />
              <span className="hidden sm:inline">End</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-auto">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-3 lg:p-6">
            <div className="space-y-4 lg:space-y-6 max-w-4xl mx-auto">
              {messages.map((message) => (
                <div key={message.id}>
                  {message.sender === "system" ? (
                    <div className="flex justify-center">
                      <div className="bg-therapeutic-beige/60 text-sage-600 text-xs lg:text-sm italic px-3 lg:px-4 py-2 rounded-organic-lg max-w-md text-center">
                        {message.content}
                      </div>
                    </div>
                  ) : (
                    <div className={`flex ${message.sender === "psychologist" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`flex items-start space-x-2 lg:space-x-4 max-w-xs lg:max-w-lg ${
                          message.sender === "psychologist" ? "flex-row-reverse space-x-reverse" : ""
                        }`}
                      >
                        <Avatar className="h-8 w-8 lg:h-10 lg:w-10 ring-1 ring-sage-100 flex-shrink-0">
                          {message.sender === "patient" ? (
                            <>
                              <AvatarImage src={patient.avatar || "/placeholder.svg"} />
                              <AvatarFallback className="bg-sage-100 text-sage-700 text-xs">
                                {patient.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </>
                          ) : (
                            <>
                              <AvatarImage src="/therapist-office.png" />
                              <AvatarFallback className="bg-sage-100 text-sage-700 text-xs">DR</AvatarFallback>
                            </>
                          )}
                        </Avatar>
                        <div
                          className={`rounded-organic-xl px-3 lg:px-6 py-2 lg:py-4 ${
                            message.sender === "psychologist"
                              ? "bg-sage-600 text-white"
                              : "bg-white/80 backdrop-blur-sm border border-sage-100 text-sage-900"
                          }`}
                        >
                          <p className="text-xs lg:text-sm leading-relaxed">{message.content}</p>
                          {message.emotion && (
                            <Badge
                              variant={getStateColor(message.emotion)}
                              className="mt-2 lg:mt-3 text-xs rounded-btn"
                            >
                              {message.emotion}
                            </Badge>
                          )}
                          <p
                            className={`text-xs mt-1 lg:mt-2 ${
                              message.sender === "psychologist" ? "text-sage-200" : "text-sage-500"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t border-sage-100 bg-white/80 backdrop-blur-sm p-3 lg:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center space-x-2 lg:space-x-4">
                <div className="flex-1 relative">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Share your thoughts..."
                    className="pr-10 lg:pr-12 border-sage-200 rounded-organic-lg bg-white/80 focus:ring-sage-300 focus:border-sage-300 text-sm lg:text-base"
                  />
                  <Button
                    size="sm"
                    className="absolute right-1 lg:right-2 top-1 lg:top-2 h-6 w-6 lg:h-8 lg:w-8 p-0 bg-sage-600 hover:bg-sage-700 rounded-organic-md"
                    onClick={sendMessage}
                    disabled={!currentMessage.trim()}
                  >
                    <Send className="h-3 w-3 lg:h-4 lg:w-4" />
                  </Button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRecording(!isRecording)}
                  className={`border-sage-200 rounded-organic-md p-2 ${
                    isRecording ? "bg-red-50 border-red-200 text-red-600" : "text-sage-600 hover:bg-sage-50"
                  }`}
                >
                  <Mic className="h-3 w-3 lg:h-4 lg:w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-sage-200 text-sage-600 hover:bg-sage-50 rounded-organic-md bg-transparent p-2"
                >
                  <Play className="h-3 w-3 lg:h-4 lg:w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Patient State Panel - Responsive */}
        <div
          className={`
          ${sidebarOpen ? "block" : "hidden"} lg:block
          w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-sage-100 bg-white/60 backdrop-blur-sm p-3 lg:p-6 space-y-4 lg:space-y-6
          lg:flex-shrink-0
        `}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl shadow-sm">
            <CardHeader className="pb-3 lg:pb-4">
              <CardTitle className="text-xs lg:text-sm flex items-center text-sage-900">
                <Heart className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                Client Presence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 lg:space-y-4">
              <div>
                <p className="text-xs font-medium text-sage-600 mb-1 lg:mb-2">Current Mood</p>
                <Badge variant={getStateColor(patientState.mood)} className="rounded-btn text-xs">
                  {patientState.mood}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-sage-600 mb-1 lg:mb-2">Engagement</p>
                <Badge variant={getStateColor(patientState.engagement)} className="rounded-btn text-xs">
                  {patientState.engagement}
                </Badge>
              </div>
              <div>
                <p className="text-xs font-medium text-sage-600 mb-1 lg:mb-2">Session Flow</p>
                <Badge variant={getStateColor(patientState.progress)} className="rounded-btn text-xs">
                  {patientState.progress}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl shadow-sm">
            <CardHeader className="pb-3 lg:pb-4">
              <CardTitle className="text-xs lg:text-sm text-sage-900">Mindful Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                size="sm"
                className="w-full border-sage-200 text-sage-600 hover:bg-sage-50 rounded-organic-md bg-transparent text-xs lg:text-sm"
              >
                <FileText className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                Capture Insight
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl shadow-sm">
            <CardHeader className="pb-3 lg:pb-4">
              <CardTitle className="text-xs lg:text-sm text-sage-900">Therapeutic Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 lg:space-y-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-sage-200 text-sage-600 hover:bg-sage-50 rounded-organic-md bg-transparent text-xs lg:text-sm"
              >
                <Leaf className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                Mindful Pause
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-sage-200 text-sage-600 hover:bg-sage-50 rounded-organic-md bg-transparent text-xs lg:text-sm"
              >
                <Heart className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                Emotional Check-in
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start border-sage-200 text-sage-600 hover:bg-sage-50 rounded-organic-md bg-transparent text-xs lg:text-sm"
              >
                Reflection Space
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Supervisor Panel */}
      <AISupervisorPanel
        isVisible={supervisorPanelOpen}
        onToggle={() => setSupervisorPanelOpen(!supervisorPanelOpen)}
        patientState={patientState}
        lastPatientMessage={getLastPatientMessage()}
        sessionDuration={sessionDuration}
        modality={modality}
      />
    </div>
  )
}
