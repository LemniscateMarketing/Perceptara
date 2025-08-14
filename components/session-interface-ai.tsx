"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import {
  ArrowLeft,
  Send,
  Mic,
  Square,
  Clock,
  Heart,
  FileText,
  Leaf,
  ChevronUp,
  ChevronDown,
  Brain,
  AlertCircle,
  Volume2,
  Play,
  Pause,
  Zap,
  Command,
  Smile,
  Settings,
} from "lucide-react"
import AISupervisorPanel from "./ai-supervisor-panel"
import { createAIClient } from "@/lib/ai-client"
import { voiceManager, type VoiceCommand, type SpeechRecognitionResult } from "@/lib/voice-manager"
import { useChatFeatures } from "@/lib/chat-features-manager"

interface Message {
  id: string
  sender: "psychologist" | "patient" | "system"
  content: string
  timestamp: Date
  emotion?: string
  isAI?: boolean
  detectedEmotion?: string
  wasInterrupted?: boolean
  voiceCommand?: string
}

interface SessionInterfaceAIProps {
  patient: {
    id: number | string
    name: string
    age: number
    primaryConcern: string
    primary_concern: string
    background: string
    avatar: string
    avatar_url?: string
    personality_traits?: any
  }
  modality: string
  onBack: () => void
  onEndSession: (duration: number, messageCount: number) => void
}

export default function SessionInterfaceAI({ patient, modality, onBack, onEndSession }: SessionInterfaceAIProps) {
  // Get enabled features from Chat Architecture
  const { getEnabledFeatures } = useChatFeatures()
  const enabledFeatures = getEnabledFeatures()

  // Check which features are enabled
  const isFeatureEnabled = (featureId: string) => {
    return enabledFeatures.some((f) => f.id === featureId)
  }

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "patient",
      content: "I've been feeling really overwhelmed lately with everything going on.",
      timestamp: new Date(),
      emotion: "thoughtful",
      isAI: false,
    },
  ])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [sessionDuration, setSessionDuration] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [supervisorPanelOpen, setSupervisorPanelOpen] = useState(false)
  const [isAIResponding, setIsAIResponding] = useState(false)
  const [aiStatus, setAiStatus] = useState<"ready" | "no-config" | "error">("ready")
  const [patientState, setPatientState] = useState({
    mood: "contemplative",
    engagement: "present",
    progress: "opening",
  })

  const [isPatientSpeaking, setIsPatientSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [playingMessageId, setPlayingMessageId] = useState<string | null>(null)
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null)

  // Advanced voice features state - controlled by Chat Architecture
  const [advancedFeaturesOpen, setAdvancedFeaturesOpen] = useState(false)
  const [interruptionEnabled, setInterruptionEnabled] = useState(isFeatureEnabled("interruption-capability"))
  const [emotionDetectionEnabled, setEmotionDetectionEnabled] = useState(isFeatureEnabled("emotion-detection"))
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(isFeatureEnabled("voice-commands"))
  const [lastDetectedEmotion, setLastDetectedEmotion] = useState<string | null>(null)
  const [lastVoiceCommand, setLastVoiceCommand] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sessionStartTime = useRef(new Date())
  const aiClient = useRef(createAIClient())

  // Update feature states when Chat Architecture changes
  useEffect(() => {
    setInterruptionEnabled(isFeatureEnabled("interruption-capability"))
    setEmotionDetectionEnabled(isFeatureEnabled("emotion-detection"))
    setVoiceCommandsEnabled(isFeatureEnabled("voice-commands"))
    setVoiceEnabled(isFeatureEnabled("voice-chat") || isFeatureEnabled("text-to-speech"))
  }, [enabledFeatures])

  // Check AI configuration on mount
  useEffect(() => {
    if (!aiClient.current || !isFeatureEnabled("ai-patient-responses")) {
      setAiStatus("no-config")
    } else {
      setAiStatus("ready")
    }
  }, [enabledFeatures])

  // Configure advanced voice features
  useEffect(() => {
    if (isFeatureEnabled("voice-chat") || isFeatureEnabled("speech-to-text")) {
      voiceManager.enableAdvancedFeatures({
        interruption: interruptionEnabled,
        emotionDetection: emotionDetectionEnabled,
        voiceCommands: voiceCommandsEnabled,
      })

      // Set up callbacks
      voiceManager.setInterruptionCallback(() => {
        console.log("🛑 Patient was interrupted!")
        setMessages((prev) => {
          const updated = [...prev]
          const lastPatientIndex = updated.findLastIndex((m) => m.sender === "patient")
          if (lastPatientIndex >= 0) {
            updated[lastPatientIndex] = { ...updated[lastPatientIndex], wasInterrupted: true }
          }
          return updated
        })
      })

      voiceManager.setVoiceCommandCallback((command: VoiceCommand) => {
        console.log("🎤 Voice command detected:", command)
        setLastVoiceCommand(command.command)
        handleVoiceCommand(command)
      })

      voiceManager.setEmotionDetectionCallback((emotion: string, confidence: number) => {
        console.log("😊 Emotion detected:", emotion, "confidence:", confidence)
        setLastDetectedEmotion(emotion)

        if (confidence > 0.6) {
          setPatientState((prev) => ({
            ...prev,
            engagement: emotion === "supportive" || emotion === "empathetic" ? "deeply engaged" : prev.engagement,
          }))
        }
      })
    }
  }, [interruptionEnabled, emotionDetectionEnabled, voiceCommandsEnabled, enabledFeatures])

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

  // Handle voice commands
  const handleVoiceCommand = (command: VoiceCommand) => {
    switch (command.action) {
      case "end_session":
        console.log("🎤 Voice command: End session")
        handleEndSession()
        break
      case "take_notes":
        console.log("🎤 Voice command: Take notes")
        break
      case "pause_patient":
        console.log("🎤 Voice command: Pause patient")
        if (isPatientSpeaking) {
          voiceManager.stopSpeaking()
          setIsPatientSpeaking(false)
        }
        break
      case "resume_patient":
        console.log("🎤 Voice command: Resume patient")
        break
      case "repeat_last":
        console.log("🎤 Voice command: Repeat last")
        const lastPatientMessage = messages.filter((m) => m.sender === "patient").pop()
        if (lastPatientMessage && voiceEnabled) {
          voiceManager.speak(lastPatientMessage.content)
        }
        break
    }
  }

  const playMessage = async (messageId: string, content: string) => {
    if (!isFeatureEnabled("text-to-speech")) return

    if (playingMessageId === messageId) {
      voiceManager.stopSpeaking()
      setPlayingMessageId(null)
      return
    }

    try {
      setPlayingMessageId(messageId)
      await voiceManager.speak(content)
    } catch (error) {
      console.error("Failed to play message:", error)
    } finally {
      setPlayingMessageId(null)
    }
  }

  const sendMessage = async () => {
    if (!currentMessage || !currentMessage.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "psychologist",
      content: currentMessage,
      timestamp: new Date(),
      isAI: false,
      detectedEmotion: lastDetectedEmotion || undefined,
    }

    setMessages((prev) => [...prev, newMessage])
    const therapistMessage = currentMessage
    setCurrentMessage("")

    // Clear last detected emotion after using it
    setLastDetectedEmotion(null)

    // Add system message for non-verbal cues (if AI personality is enabled)
    if (isFeatureEnabled("ai-personality")) {
      setTimeout(() => {
        const systemMessage: Message = {
          id: (Date.now() + 0.5).toString(),
          sender: "system",
          content: "Patient takes a moment to consider your words...",
          timestamp: new Date(),
          isAI: false,
        }
        setMessages((prev) => [...prev, systemMessage])
      }, 1000)
    }

    // Generate AI patient response (if AI is enabled)
    if (aiClient.current && aiStatus === "ready" && isFeatureEnabled("ai-patient-responses")) {
      setIsAIResponding(true)

      try {
        const patientProfile = {
          name: patient.name,
          age: patient.age,
          primary_concern: patient.primaryConcern || patient.primary_concern,
          background: patient.background,
          personality_traits: patient.personality_traits || { traits: ["thoughtful", "seeking help"] },
        }

        const response = await aiClient.current.generatePatientResponse(
          patientProfile,
          messages,
          therapistMessage,
          modality,
        )

        if (response.success) {
          const aiMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: "patient",
            content: response.response,
            timestamp: new Date(),
            emotion: response.emotion,
            isAI: true,
          }

          setMessages((prev) => [...prev, aiMessage])

          // Only speak if voice features are enabled
          if (voiceEnabled && isFeatureEnabled("text-to-speech")) {
            setIsPatientSpeaking(true)
            try {
              await voiceManager.speak(response.response)
            } catch (error) {
              console.error("Voice synthesis failed:", error)
            } finally {
              setIsPatientSpeaking(false)
            }
          }

          // Update patient state if adaptive behavior is enabled
          if (isFeatureEnabled("adaptive-behavior")) {
            setPatientState((prev) => ({
              ...prev,
              mood: response.emotion || prev.mood,
              engagement: Math.random() > 0.3 ? "deeply engaged" : "present",
              progress: messages.length > 6 ? "exploring" : "opening",
            }))
          }
        } else {
          const fallbackMessage: Message = {
            id: (Date.now() + 1).toString(),
            sender: "patient",
            content: response.response,
            timestamp: new Date(),
            emotion: response.emotion || "confused",
            isAI: false,
          }
          setMessages((prev) => [...prev, fallbackMessage])
          setAiStatus("error")
        }
      } catch (error) {
        console.error("AI response error:", error)
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "patient",
          content: "I'm having trouble finding the right words right now. Could you help me understand what you mean?",
          timestamp: new Date(),
          emotion: "confused",
          isAI: false,
        }
        setMessages((prev) => [...prev, fallbackMessage])
        setAiStatus("error")
      } finally {
        setIsAIResponding(false)
      }
    } else {
      // Fallback to scripted responses when AI is disabled
      setTimeout(
        () => {
          const fallbackResponses = [
            "That's... that's actually really helpful to think about it that way.",
            "I never considered that perspective before. It makes me feel less alone.",
            "I'm not sure I fully understand. Could you help me explore that more?",
            "That resonates with me deeply. I feel like you really understand.",
            "I appreciate you creating this safe space for me to share.",
          ]

          const response: Message = {
            id: (Date.now() + 1).toString(),
            sender: "patient",
            content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
            timestamp: new Date(),
            emotion: Math.random() > 0.5 ? "hopeful" : "reflective",
            isAI: false,
          }

          setMessages((prev) => [...prev, response])

          setPatientState((prev) => ({
            ...prev,
            engagement: Math.random() > 0.3 ? "deeply engaged" : "present",
            mood: Math.random() > 0.4 ? "opening" : prev.mood,
          }))
        },
        2000 + Math.random() * 2000,
      )
    }
  }

  const startListening = () => {
    if (!isFeatureEnabled("speech-to-text")) {
      console.warn("Speech-to-text not enabled in Chat Architecture")
      return
    }

    if (!voiceManager.isSpeechRecognitionSupported()) {
      console.warn("Speech recognition not supported")
      alert("Speech recognition is not supported in your browser. Please try Chrome or Edge.")
      return
    }

    console.log("🎤 Starting voice recognition...")

    const success = voiceManager.startListening(
      (result: SpeechRecognitionResult) => {
        console.log("🎤 Voice result:", result)

        if (result.detectedEmotion && emotionDetectionEnabled) {
          console.log(`😊 Detected emotion: ${result.detectedEmotion} (${result.emotionConfidence})`)
        }

        if (result.transcript && result.transcript.trim()) {
          setCurrentMessage(result.transcript.trim())
        }

        if (result.isFinal) {
          console.log("🎤 Final transcript received:", result.transcript)
          setTimeout(() => {
            setIsListening(false)
            voiceManager.stopListening()
          }, 500)
        }
      },
      (error) => {
        console.error("🎤 Speech recognition error:", error)
        setIsListening(false)

        if (error === "not-allowed") {
          alert("Microphone access denied. Please allow microphone access and try again.")
        } else if (error === "no-speech") {
          console.log("🎤 No speech detected")
        } else {
          console.warn(`Speech recognition error: ${error}`)
        }
      },
    )

    if (success) {
      setIsListening(true)
      console.log("🎤 Voice recognition started successfully")
    } else {
      console.error("🎤 Failed to start voice recognition")
    }
  }

  const stopListening = () => {
    voiceManager.stopListening()
    setIsListening(false)
  }

  const toggleVoice = () => {
    if (isPatientSpeaking) {
      voiceManager.stopSpeaking()
      setIsPatientSpeaking(false)
    }
    setVoiceEnabled(!voiceEnabled)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (currentMessage && currentMessage.trim()) {
        sendMessage()
      }
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

  const getAIStatusBadge = () => {
    if (!isFeatureEnabled("ai-patient-responses")) {
      return (
        <Badge variant="outline" className="text-xs">
          <AlertCircle className="h-3 w-3 mr-1" />
          AI Disabled
        </Badge>
      )
    }

    switch (aiStatus) {
      case "ready":
        return (
          <Badge variant="green" className="text-xs">
            <Brain className="h-3 w-3 mr-1" />
            AI Active
          </Badge>
        )
      case "no-config":
        return (
          <Badge variant="warm" className="text-xs">
            <AlertCircle className="h-3 w-3 mr-1" />
            No AI Config
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="text-xs">
            <AlertCircle className="h-3 w-3 mr-1" />
            AI Error
          </Badge>
        )
    }
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
                <AvatarImage src={patient.avatar || patient.avatar_url || "/placeholder.svg"} />
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
            {getAIStatusBadge()}

            {/* Voice Status Badge - only show if voice features are enabled */}
            {(isFeatureEnabled("voice-chat") || isFeatureEnabled("text-to-speech")) && (
              <Badge
                variant={voiceEnabled ? "green" : "outline"}
                className="text-xs cursor-pointer"
                onClick={toggleVoice}
              >
                <Volume2 className="h-3 w-3 mr-1" />
                {voiceEnabled ? "Voice On" : "Voice Off"}
              </Badge>
            )}

            {/* Enhanced Features Badge - only show if advanced features are enabled */}
            {(interruptionEnabled || emotionDetectionEnabled || voiceCommandsEnabled) && (
              <Badge variant="therapeutic" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Enhanced
              </Badge>
            )}

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
              {messages.map((message, index) => (
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
                              <AvatarImage src={patient.avatar || patient.avatar_url || "/placeholder.svg"} />
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
                          className={`rounded-organic-xl px-3 lg:px-6 py-2 lg:py-4 relative group ${
                            message.sender === "psychologist"
                              ? "bg-sage-600 text-white"
                              : "bg-white/80 backdrop-blur-sm border border-sage-100 text-sage-900"
                          }`}
                          onMouseEnter={() => message.sender === "patient" && setHoveredMessageId(message.id)}
                          onMouseLeave={() => setHoveredMessageId(null)}
                        >
                          <p className="text-xs lg:text-sm leading-relaxed">{message.content}</p>
                          <div className="flex items-center justify-between mt-1 lg:mt-2">
                            <div className="flex items-center space-x-2">
                              {message.emotion && (
                                <Badge variant={getStateColor(message.emotion)} className="text-xs rounded-btn">
                                  {message.emotion}
                                </Badge>
                              )}
                              {/* Show detected emotion if emotion detection is enabled */}
                              {message.detectedEmotion && emotionDetectionEnabled && (
                                <Badge variant="lavender" className="text-xs">
                                  <Smile className="h-2 w-2 mr-1" />
                                  {message.detectedEmotion}
                                </Badge>
                              )}
                              {/* Show if message was interrupted */}
                              {message.wasInterrupted && interruptionEnabled && (
                                <Badge variant="warm" className="text-xs">
                                  <Zap className="h-2 w-2 mr-1" />
                                  Interrupted
                                </Badge>
                              )}
                              {/* Show voice command */}
                              {message.voiceCommand && voiceCommandsEnabled && (
                                <Badge variant="therapeutic" className="text-xs">
                                  <Command className="h-2 w-2 mr-1" />
                                  {message.voiceCommand}
                                </Badge>
                              )}
                              {message.isAI &&
                                message.sender === "patient" &&
                                isFeatureEnabled("ai-patient-responses") && (
                                  <Badge variant="sage" className="text-xs">
                                    <Brain className="h-2 w-2 mr-1" />
                                    AI
                                  </Badge>
                                )}
                            </div>
                            <div className="flex items-center space-x-2">
                              {/* Play button for patient messages - only show if TTS is enabled */}
                              {message.sender === "patient" &&
                                isFeatureEnabled("text-to-speech") &&
                                (hoveredMessageId === message.id || playingMessageId === message.id) && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => playMessage(message.id, message.content)}
                                    className="h-6 w-6 p-0 hover:bg-sage-100 rounded-organic-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                    disabled={playingMessageId !== null && playingMessageId !== message.id}
                                  >
                                    {playingMessageId === message.id ? (
                                      <Pause className="h-3 w-3 text-sage-600" />
                                    ) : (
                                      <Play className="h-3 w-3 text-sage-600" />
                                    )}
                                  </Button>
                                )}
                              <p
                                className={`text-xs ${
                                  message.sender === "psychologist" ? "text-sage-200" : "text-sage-500"
                                }`}
                              >
                                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {message.sender === "patient" &&
                    message.isAI &&
                    isPatientSpeaking &&
                    index === messages.length - 1 && (
                      <div className="flex items-center space-x-1 mt-1">
                        <div className="flex space-x-1">
                          <div className="w-1 h-1 bg-sage-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-1 h-1 bg-sage-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-1 h-1 bg-sage-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-xs text-sage-500">Speaking...</span>
                        {/* Show if interruption is possible */}
                        {interruptionEnabled && (
                          <Badge variant="warm" className="text-xs ml-2">
                            <Zap className="h-2 w-2 mr-1" />
                            Can interrupt
                          </Badge>
                        )}
                      </div>
                    )}
                </div>
              ))}

              {/* AI Responding Indicator */}
              {isAIResponding && (
                <div className="flex justify-start">
                  <div className="flex items-start space-x-2 lg:space-x-4 max-w-xs lg:max-w-lg">
                    <Avatar className="h-8 w-8 lg:h-10 lg:w-10 ring-1 ring-sage-100 flex-shrink-0">
                      <AvatarImage src={patient.avatar || patient.avatar_url || "/placeholder.svg"} />
                      <AvatarFallback className="bg-sage-100 text-sage-700 text-xs">
                        {patient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white/80 backdrop-blur-sm border border-sage-100 rounded-organic-xl px-3 lg:px-6 py-2 lg:py-4">
                      <div className="flex items-center space-x-2">
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
                        <Badge variant="sage" className="text-xs">
                          <Brain className="h-2 w-2 mr-1" />
                          AI thinking...
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="border-t border-sage-100 bg-white/80 backdrop-blur-sm p-3 lg:p-6">
            <div className="max-w-4xl mx-auto">
              {/* Show current voice status if emotion detection or voice commands are enabled */}
              {(lastDetectedEmotion || lastVoiceCommand) && (emotionDetectionEnabled || voiceCommandsEnabled) && (
                <div className="flex items-center space-x-2 mb-2">
                  {lastDetectedEmotion && emotionDetectionEnabled && (
                    <Badge variant="lavender" className="text-xs">
                      <Smile className="h-2 w-2 mr-1" />
                      Detected: {lastDetectedEmotion}
                    </Badge>
                  )}
                  {lastVoiceCommand && voiceCommandsEnabled && (
                    <Badge variant="therapeutic" className="text-xs">
                      <Command className="h-2 w-2 mr-1" />
                      Command: {lastVoiceCommand}
                    </Badge>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-2 lg:space-x-4">
                <div className="flex-1 relative">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={isListening ? "Listening..." : "Share your thoughts..."}
                    disabled={(isAIResponding && !(isPatientSpeaking && interruptionEnabled)) || isListening}
                    className="pr-10 lg:pr-12 border-sage-200 rounded-organic-lg bg-white/80 focus:ring-sage-300 focus:border-sage-300 text-sm lg:text-base"
                  />
                  <Button
                    size="sm"
                    className="absolute right-1 lg:right-2 top-1 lg:top-2 h-6 w-6 lg:h-8 lg:w-8 p-0 bg-sage-600 hover:bg-sage-700 rounded-organic-md"
                    onClick={sendMessage}
                    disabled={
                      !currentMessage.trim() ||
                      (isAIResponding && !(isPatientSpeaking && interruptionEnabled)) ||
                      isListening
                    }
                  >
                    <Send className="h-3 w-3 lg:h-4 lg:w-4" />
                  </Button>
                </div>

                {/* Voice Input Button - only show if speech-to-text is enabled */}
                {isFeatureEnabled("speech-to-text") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isListening ? stopListening : startListening}
                    disabled={
                      (isAIResponding && !(isPatientSpeaking && interruptionEnabled)) ||
                      (isPatientSpeaking && !interruptionEnabled)
                    }
                    className={`border-sage-200 rounded-organic-md p-2 ${
                      isListening
                        ? "bg-red-50 border-red-200 text-red-600 animate-pulse"
                        : isPatientSpeaking && interruptionEnabled
                          ? "bg-therapeutic-blue/10 border-therapeutic-blue text-therapeutic-blue hover:bg-therapeutic-blue/20 ring-1 ring-therapeutic-blue/30"
                          : voiceManager.isSpeechRecognitionSupported()
                            ? "text-sage-600 hover:bg-sage-50"
                            : "text-sage-400 cursor-not-allowed"
                    }`}
                  >
                    <Mic className="h-3 w-3 lg:h-4 lg:w-4" />
                  </Button>
                )}

                {/* Voice Toggle Button - only show if voice features are enabled */}
                {(isFeatureEnabled("voice-chat") || isFeatureEnabled("text-to-speech")) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleVoice}
                    className={`border-sage-200 rounded-organic-md p-2 ${
                      voiceEnabled ? "text-sage-600 hover:bg-sage-50" : "text-sage-400"
                    }`}
                  >
                    <Volume2 className="h-3 w-3 lg:h-4 lg:w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Patient State Panel - Enhanced with Advanced Features */}
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
              {/* Only show mood tracking if analytics are enabled */}
              {isFeatureEnabled("mood-tracking") && (
                <div>
                  <p className="text-xs font-medium text-sage-600 mb-1 lg:mb-2">Current Mood</p>
                  <Badge variant={getStateColor(patientState.mood)} className="rounded-btn text-xs">
                    {patientState.mood}
                  </Badge>
                </div>
              )}
              {/* Always show engagement */}
              <div>
                <p className="text-xs font-medium text-sage-600 mb-1 lg:mb-2">Engagement</p>
                <Badge variant={getStateColor(patientState.engagement)} className="rounded-btn text-xs">
                  {patientState.engagement}
                </Badge>
              </div>
              {/* Always show progress */}
              <div>
                <p className="text-xs font-medium text-sage-600 mb-1 lg:mb-2">Session Flow</p>
                <Badge variant={getStateColor(patientState.progress)} className="rounded-btn text-xs">
                  {patientState.progress}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Advanced Voice Features Panel - only show if voice features are enabled */}
          {(isFeatureEnabled("voice-chat") ||
            isFeatureEnabled("speech-to-text") ||
            isFeatureEnabled("emotion-detection") ||
            isFeatureEnabled("voice-commands")) && (
            <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl shadow-sm">
              <CardHeader className="pb-3 lg:pb-4">
                <CardTitle className="text-xs lg:text-sm flex items-center justify-between text-sage-900">
                  <div className="flex items-center">
                    <Zap className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                    Voice Features
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setAdvancedFeaturesOpen(!advancedFeaturesOpen)}
                    className="h-6 w-6 p-0"
                  >
                    <Settings className="h-3 w-3" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isFeatureEnabled("interruption-capability") && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Zap className="h-3 w-3 text-sage-600" />
                      <span className="text-xs text-sage-700">Interruption</span>
                    </div>
                    <Switch
                      checked={interruptionEnabled}
                      onCheckedChange={setInterruptionEnabled}
                      className="scale-75"
                    />
                  </div>
                )}
                {isFeatureEnabled("emotion-detection") && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Smile className="h-3 w-3 text-sage-600" />
                      <span className="text-xs text-sage-700">Emotion Detection</span>
                    </div>
                    <Switch
                      checked={emotionDetectionEnabled}
                      onCheckedChange={setEmotionDetectionEnabled}
                      className="scale-75"
                    />
                  </div>
                )}
                {isFeatureEnabled("voice-commands") && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Command className="h-3 w-3 text-sage-600" />
                      <span className="text-xs text-sage-700">Voice Commands</span>
                    </div>
                    <Switch
                      checked={voiceCommandsEnabled}
                      onCheckedChange={setVoiceCommandsEnabled}
                      className="scale-75"
                    />
                  </div>
                )}

                {/* Show active features status */}
                {(interruptionEnabled || emotionDetectionEnabled || voiceCommandsEnabled) && (
                  <div className="pt-2 border-t border-sage-100">
                    <p className="text-xs text-sage-600 mb-2">Active Features:</p>
                    <div className="flex flex-wrap gap-1">
                      {interruptionEnabled && (
                        <Badge variant="therapeutic" className="text-xs">
                          <Zap className="h-2 w-2 mr-1" />
                          Interrupt
                        </Badge>
                      )}
                      {emotionDetectionEnabled && (
                        <Badge variant="lavender" className="text-xs">
                          <Smile className="h-2 w-2 mr-1" />
                          Emotion
                        </Badge>
                      )}
                      {voiceCommandsEnabled && (
                        <Badge variant="sage" className="text-xs">
                          <Command className="h-2 w-2 mr-1" />
                          Commands
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Live Note Taking - only show if enabled */}
          {isFeatureEnabled("live-note-taking") && (
            <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl shadow-sm">
              <CardHeader className="pb-3 lg:pb-4">
                <CardTitle className="text-xs lg:text-sm text-sage-900">Session Notes</CardTitle>
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
          )}

          {/* Therapeutic Tools - only show if enabled */}
          {(isFeatureEnabled("mindfulness-exercises") ||
            isFeatureEnabled("breathing-tools") ||
            isFeatureEnabled("reflection-prompts")) && (
            <Card className="bg-white/80 backdrop-blur-sm border-sage-100 rounded-organic-xl shadow-sm">
              <CardHeader className="pb-3 lg:pb-4">
                <CardTitle className="text-xs lg:text-sm text-sage-900">Therapeutic Tools</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 lg:space-y-3">
                {isFeatureEnabled("mindfulness-exercises") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start border-sage-200 text-sage-600 hover:bg-sage-50 rounded-organic-md bg-transparent text-xs lg:text-sm"
                  >
                    <Leaf className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                    Mindful Pause
                  </Button>
                )}
                {isFeatureEnabled("breathing-tools") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start border-sage-200 text-sage-600 hover:bg-sage-50 rounded-organic-md bg-transparent text-xs lg:text-sm"
                  >
                    <Heart className="h-3 w-3 lg:h-4 lg:w-4 mr-2" />
                    Breathing Exercise
                  </Button>
                )}
                {isFeatureEnabled("reflection-prompts") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start border-sage-200 text-sage-600 hover:bg-sage-50 rounded-organic-md bg-transparent text-xs lg:text-sm"
                  >
                    Reflection Space
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* AI Supervisor Panel - only show if supervisor tools are enabled */}
      {isFeatureEnabled("live-supervisor") && (
        <AISupervisorPanel
          isVisible={supervisorPanelOpen}
          onToggle={() => setSupervisorPanelOpen(!supervisorPanelOpen)}
          patientState={patientState}
          lastPatientMessage={getLastPatientMessage()}
          sessionDuration={sessionDuration}
          modality={modality}
          aiClient={aiClient.current}
        />
      )}
    </div>
  )
}

// Named export for compatibility
export { SessionInterfaceAI }
