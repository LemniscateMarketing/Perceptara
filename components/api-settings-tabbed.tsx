"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Settings,
  Key,
  Brain,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Zap,
  Globe,
  BarChart3,
  AlertTriangle,
  Sparkles,
  Plus,
  Trash2,
  Loader2,
  Crown,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AIClientManager } from "@/lib/ai-client"

interface ApiProvider {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  models: ApiModel[]
  features: string[]
  pricing: string
  latency: string
  reliability: string
  setupInstructions: string
  keyFormat: string
}

interface ApiModel {
  id: string
  name: string
  description: string
  contextLength: string
  strengths: string[]
  bestFor: string[]
  pricing: string
}

interface ApiConfig {
  providerId: string
  providerName: string
  apiKey: string
  selectedModel: string
  isActive: boolean
  lastTested: Date | null
  status: "untested" | "valid" | "invalid" | "testing"
  createdAt: Date
}

export default function ApiSettingsTabbed() {
  const [configs, setConfigs] = useState<ApiConfig[]>([])
  const [showApiKeys, setShowApiKeys] = useState<Record<string, boolean>>({})
  const [activeTab, setActiveTab] = useState("configured")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<string>("")

  // Available providers
  const availableProviders: ApiProvider[] = [
    {
      id: "xai",
      name: "xAI (Grok)",
      description: "Advanced reasoning with real-time knowledge and therapeutic understanding",
      icon: Sparkles,
      keyFormat: "xai-",
      setupInstructions: "Get your API key from console.x.ai → API Keys → Create New Key",
      models: [
        {
          id: "grok-3",
          name: "Grok-3",
          description: "Latest model with enhanced therapeutic reasoning and empathy",
          contextLength: "128K tokens",
          strengths: ["Therapeutic reasoning", "Empathy", "Real-time knowledge"],
          bestFor: ["Patient responses", "Complex scenarios", "Supervisor feedback"],
          pricing: "$0.10/1K tokens",
        },
        {
          id: "grok-2",
          name: "Grok-2",
          description: "Reliable model for consistent therapeutic interactions",
          contextLength: "64K tokens",
          strengths: ["Consistency", "Reliability", "Cost-effective"],
          bestFor: ["Session analysis", "Note generation", "Basic interactions"],
          pricing: "$0.05/1K tokens",
        },
      ],
      features: ["Real-time knowledge", "Therapeutic training", "High reasoning"],
      pricing: "Pay-per-use",
      latency: "~2-3s",
      reliability: "99.5%",
    },
    {
      id: "openai",
      name: "OpenAI",
      description: "Industry-leading models with strong therapeutic capabilities",
      icon: Brain,
      keyFormat: "sk-",
      setupInstructions: "Get your API key from platform.openai.com → API Keys → Create new secret key",
      models: [
        {
          id: "gpt-4o",
          name: "GPT-4o",
          description: "Multimodal model with excellent therapeutic understanding",
          contextLength: "128K tokens",
          strengths: ["Therapeutic expertise", "Consistency", "Reliability"],
          bestFor: ["Patient simulation", "Supervisor guidance", "Session analysis"],
          pricing: "$0.15/1K tokens",
        },
        {
          id: "gpt-4o-mini",
          name: "GPT-4o Mini",
          description: "Faster, cost-effective model for routine tasks",
          contextLength: "128K tokens",
          strengths: ["Speed", "Cost-effective", "Good quality"],
          bestFor: ["Quick responses", "Note formatting", "Simple analysis"],
          pricing: "$0.03/1K tokens",
        },
      ],
      features: ["Proven reliability", "Extensive training", "Strong safety"],
      pricing: "Pay-per-use",
      latency: "~1-2s",
      reliability: "99.9%",
    },
    {
      id: "groq",
      name: "Groq",
      description: "Ultra-fast inference for real-time therapeutic interactions",
      icon: Zap,
      keyFormat: "gsk_",
      setupInstructions: "Get your API key from console.groq.com → API Keys → Create API Key",
      models: [
        {
          id: "llama-3.1-70b-versatile",
          name: "Llama 3.1 70B",
          description: "Large model with strong reasoning capabilities",
          contextLength: "32K tokens",
          strengths: ["Fast inference", "Good reasoning", "Open source"],
          bestFor: ["Real-time chat", "Quick analysis", "Cost-effective scaling"],
          pricing: "$0.08/1K tokens",
        },
        {
          id: "llama-3.1-8b-instant",
          name: "Llama 3.1 8B",
          description: "Smaller, faster model for simple interactions",
          contextLength: "32K tokens",
          strengths: ["Ultra-fast", "Very cost-effective", "Good for simple tasks"],
          bestFor: ["Basic responses", "Quick formatting", "High-volume tasks"],
          pricing: "$0.01/1K tokens",
        },
      ],
      features: ["Ultra-fast inference", "Cost-effective", "Open source models"],
      pricing: "Pay-per-use",
      latency: "~0.5-1s",
      reliability: "99.2%",
    },
    {
      id: "elevenlabs",
      name: "ElevenLabs",
      description: "Ultra-realistic AI voices with emotional range and voice cloning capabilities",
      icon: Crown,
      keyFormat: "sk_",
      setupInstructions: "Get your API key from elevenlabs.io → Profile → API Keys → Create API Key",
      models: [
        {
          id: "eleven_monolingual_v1",
          name: "Eleven Monolingual v1",
          description: "High-quality English voice synthesis with natural intonation",
          contextLength: "N/A",
          strengths: ["Natural speech", "Emotional range", "Clear pronunciation"],
          bestFor: ["Patient dialogue", "Therapeutic conversations", "Emotional authenticity"],
          pricing: "$0.30/1K chars",
        },
        {
          id: "eleven_multilingual_v2",
          name: "Eleven Multilingual v2",
          description: "Advanced multilingual voice synthesis with enhanced naturalness",
          contextLength: "N/A",
          strengths: ["Multiple languages", "Natural intonation", "Emotional expression"],
          bestFor: ["Diverse patient backgrounds", "International scenarios", "Cultural authenticity"],
          pricing: "$0.30/1K chars",
        },
      ],
      features: ["Ultra-realistic voices", "Emotional range", "Voice cloning", "Multiple languages"],
      pricing: "Pay-per-character",
      latency: "~2-4s",
      reliability: "99.3%",
    },
  ]

  useEffect(() => {
    // Load saved configurations from localStorage
    const savedConfigs = localStorage.getItem("api-configurations-v2")
    if (savedConfigs) {
      const parsed = JSON.parse(savedConfigs)
      setConfigs(
        parsed.map((config: any) => ({
          ...config,
          createdAt: new Date(config.createdAt),
          lastTested: config.lastTested ? new Date(config.lastTested) : null,
        })),
      )
    }
  }, [])

  const saveConfigurations = () => {
    localStorage.setItem("api-configurations-v2", JSON.stringify(configs))
    console.log("✅ Configurations saved to localStorage")
  }

  const addProvider = (providerId: string, apiKey: string, selectedModel?: string) => {
    const provider = availableProviders.find((p) => p.id === providerId)
    if (!provider) return

    const newConfig: ApiConfig = {
      providerId,
      providerName: provider.name,
      apiKey,
      selectedModel: selectedModel || provider.models[0].id,
      isActive: true,
      lastTested: null,
      status: "untested",
      createdAt: new Date(),
    }

    setConfigs((prev) => [...prev, newConfig])
    saveConfigurations()
    setIsAddDialogOpen(false)
    setSelectedProvider("")
  }

  const removeProvider = (index: number) => {
    setConfigs((prev) => prev.filter((_, i) => i !== index))
    saveConfigurations()
  }

  const updateConfig = (index: number, updates: Partial<ApiConfig>) => {
    setConfigs((prev) => prev.map((config, i) => (i === index ? { ...config, ...updates } : config)))
  }

  const validateApiKeyFormat = (apiKey: string, provider: ApiProvider): boolean => {
    if (!apiKey || apiKey.trim().length === 0) return false

    // Check format based on provider
    switch (provider.id) {
      case "openai":
        return apiKey.startsWith("sk-") && apiKey.length > 20
      case "xai":
        return apiKey.startsWith("xai-") && apiKey.length > 20
      case "groq":
        return apiKey.startsWith("gsk_") && apiKey.length > 20
      default:
        return apiKey.length > 10
    }
  }

  const testApiKey = async (index: number) => {
    const config = configs[index]
    if (!config?.apiKey) return

    console.log(`🔍 Testing API key for ${config.providerName}...`)
    updateConfig(index, { status: "testing" })

    try {
      const result = await AIClientManager.testConnection(config.providerId, config.apiKey, config.selectedModel)

      console.log(`📊 Test result for ${config.providerName}:`, result)

      updateConfig(index, {
        status: result.success ? "valid" : "invalid",
        lastTested: new Date(),
        isActive: result.success ? true : false, // Add this line
      })

      // Auto-save after successful test
      if (result.success) {
        setTimeout(saveConfigurations, 100)
      }
    } catch (error) {
      console.error(`❌ API test failed for ${config.providerName}:`, error)
      updateConfig(index, {
        status: "invalid",
        lastTested: new Date(),
      })
    }
  }

  const toggleApiKeyVisibility = (index: number) => {
    setShowApiKeys((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "valid":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "invalid":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "testing":
        return <Loader2 className="h-4 w-4 animate-spin text-sage-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-sage-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "valid":
        return "green"
      case "invalid":
        return "outline"
      case "testing":
        return "sage"
      default:
        return "warm"
    }
  }

  const getProviderData = (providerId: string) => {
    return availableProviders.find((p) => p.id === providerId)
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-sage-100 px-4 lg:px-8 py-4 lg:py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 lg:space-x-6">
            <div className="p-2 bg-sage-100 rounded-organic-lg">
              <Settings className="h-5 w-5 lg:h-6 lg:w-6 text-sage-600" />
            </div>
            <div>
              <h1 className="text-lg lg:text-xl font-light text-sage-900">API Configuration</h1>
              <p className="text-xs lg:text-sm text-sage-600">Manage your AI provider settings and API keys</p>
            </div>
          </div>

          {/* Add Provider Button */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-sage-600 hover:bg-sage-700 text-white rounded-organic-lg">
                <Plus className="h-4 w-4 mr-2" />
                Add API Provider
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New API Provider</DialogTitle>
                <DialogDescription>
                  Choose a provider and configure your API key to start using AI models.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Provider Selection */}
                <div className="grid grid-cols-1 gap-4">
                  {availableProviders
                    .filter((provider) => !configs.some((config) => config.providerId === provider.id))
                    .map((provider) => {
                      const IconComponent = provider.icon
                      const isSelected = selectedProvider === provider.id

                      return (
                        <Card
                          key={provider.id}
                          className={`cursor-pointer transition-all duration-200 ${
                            isSelected ? "ring-2 ring-sage-300 bg-sage-50" : "hover:bg-sage-50"
                          }`}
                          onClick={() => setSelectedProvider(provider.id)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-start space-x-4">
                              <div className="p-2 bg-sage-100 rounded-organic-lg">
                                <IconComponent className="h-5 w-5 text-sage-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium text-sage-900 mb-1">{provider.name}</h3>
                                <p className="text-sm text-sage-600 mb-3">{provider.description}</p>
                                <div className="flex flex-wrap gap-2">
                                  {provider.features.slice(0, 3).map((feature, index) => (
                                    <Badge key={index} variant="sage" className="text-xs">
                                      {feature}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              {isSelected && (
                                <div className="w-6 h-6 bg-sage-600 rounded-full flex items-center justify-center">
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                </div>

                {/* Configuration Form */}
                {selectedProvider && (
                  <AddProviderForm
                    provider={availableProviders.find((p) => p.id === selectedProvider)!}
                    onAdd={addProvider}
                    onCancel={() => setSelectedProvider("")}
                    validateFormat={validateApiKeyFormat}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Security Notice */}
        <Card className="bg-therapeutic-beige/20 border-warm-200 rounded-organic-xl">
          <CardContent className="p-4 lg:p-6">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-warm-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sage-900 mb-2">Your API Keys Are Secure</h3>
                <p className="text-sm text-sage-700 leading-relaxed">
                  All API keys are stored locally in your browser and never sent to our servers. You have complete
                  control over your AI provider credentials and usage.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Card className="bg-white/70 backdrop-blur-sm border-sage-100 rounded-organic-2xl shadow-sm">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-sage-50 rounded-organic-lg">
                <TabsTrigger value="configured" className="rounded-organic-md">
                  <Key className="h-4 w-4 mr-2" />
                  Configured ({configs.length})
                </TabsTrigger>
                <TabsTrigger value="available" className="rounded-organic-md">
                  <Globe className="h-4 w-4 mr-2" />
                  Available
                </TabsTrigger>
                <TabsTrigger value="usage" className="rounded-organic-md">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Usage
                </TabsTrigger>
              </TabsList>

              {/* Configured Providers Tab */}
              <TabsContent value="configured" className="space-y-6 mt-6">
                {configs.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {configs.map((config, index) => {
                      const provider = getProviderData(config.providerId)
                      if (!provider) return null

                      const IconComponent = provider.icon

                      return (
                        <Card key={index} className="bg-white/80 border-sage-100 rounded-organic-xl">
                          <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-sage-50 rounded-organic-lg">
                                  <IconComponent className="h-5 w-5 text-sage-600" />
                                </div>
                                <div>
                                  <CardTitle className="text-base font-medium text-sage-900">
                                    {config.providerName}
                                  </CardTitle>
                                  <CardDescription className="text-sm text-sage-600">
                                    Added {config.createdAt.toLocaleDateString()}
                                  </CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getStatusIcon(config.status)}
                                <Badge variant={getStatusColor(config.status)} className="text-xs">
                                  {config.status === "testing" ? "Testing..." : config.status}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {/* API Key */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-sage-700">API Key</label>
                              <div className="flex space-x-2">
                                <div className="flex-1 relative">
                                  <Input
                                    type={showApiKeys[index] ? "text" : "password"}
                                    value={config.apiKey}
                                    onChange={(e) => updateConfig(index, { apiKey: e.target.value })}
                                    className="pr-10 border-sage-200 rounded-organic-lg bg-white/80 focus:ring-sage-300 focus:border-sage-300"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 top-2 h-6 w-6 p-0 text-sage-500 hover:text-sage-700"
                                    onClick={() => toggleApiKeyVisibility(index)}
                                  >
                                    {showApiKeys[index] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
                                <Button
                                  onClick={() => testApiKey(index)}
                                  disabled={!config.apiKey || config.status === "testing"}
                                  className="bg-sage-600 hover:bg-sage-700 text-white rounded-organic-lg"
                                >
                                  {config.status === "testing" ? <Loader2 className="h-4 w-4 animate-spin" /> : "Test"}
                                </Button>
                              </div>
                              {config.lastTested && (
                                <p className="text-xs text-sage-500">
                                  Last tested: {config.lastTested.toLocaleString()}
                                </p>
                              )}
                            </div>

                            {/* Model Selection */}
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-sage-700">Model</label>
                              <select
                                value={config.selectedModel}
                                onChange={(e) => updateConfig(index, { selectedModel: e.target.value })}
                                className="w-full p-2 border border-sage-200 rounded-organic-lg bg-white/80 focus:ring-sage-300 focus:border-sage-300 text-sm"
                              >
                                {provider.models.map((model) => (
                                  <option key={model.id} value={model.id}>
                                    {model.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Actions */}
                            <div className="flex justify-between pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removeProvider(index)}
                                className="text-red-600 border-red-200 hover:bg-red-50 rounded-organic-md"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
                              </Button>
                              <Button
                                onClick={saveConfigurations}
                                className="bg-sage-600 hover:bg-sage-700 text-white rounded-organic-md"
                              >
                                Save Changes
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Key className="h-12 w-12 text-sage-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-sage-900 mb-2">No API Providers Configured</h3>
                    <p className="text-sage-600 text-sm mb-6">
                      Add your first AI provider to start using therapeutic simulations.
                    </p>
                    <Button
                      onClick={() => setIsAddDialogOpen(true)}
                      className="bg-sage-600 hover:bg-sage-700 text-white rounded-organic-lg"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Provider
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Available Providers Tab */}
              <TabsContent value="available" className="space-y-6 mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {availableProviders.map((provider) => {
                    const IconComponent = provider.icon
                    const isConfigured = configs.some((config) => config.providerId === provider.id)

                    return (
                      <Card key={provider.id} className="bg-white/80 border-sage-100 rounded-organic-xl">
                        <CardHeader className="pb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-sage-50 rounded-organic-lg">
                              <IconComponent className="h-5 w-5 text-sage-600" />
                            </div>
                            <div>
                              <CardTitle className="text-base font-medium text-sage-900">{provider.name}</CardTitle>
                              <CardDescription className="text-sm text-sage-600">
                                {provider.description}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Provider Stats */}
                          <div className="grid grid-cols-2 gap-4 p-3 bg-sage-50 rounded-organic-lg">
                            <div className="text-center">
                              <p className="text-xs font-medium text-sage-700">Latency</p>
                              <p className="text-xs text-sage-600">{provider.latency}</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-medium text-sage-700">Reliability</p>
                              <p className="text-xs text-sage-600">{provider.reliability}</p>
                            </div>
                          </div>

                          {/* Features */}
                          <div>
                            <p className="text-xs font-medium text-sage-700 mb-2">Key Features</p>
                            <div className="flex flex-wrap gap-2">
                              {provider.features.map((feature, index) => (
                                <Badge key={index} variant="sage" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Models */}
                          <div>
                            <p className="text-xs font-medium text-sage-700 mb-2">Available Models</p>
                            <div className="space-y-2">
                              {provider.models.slice(0, 2).map((model) => (
                                <div key={model.id} className="text-xs text-sage-600">
                                  <span className="font-medium">{model.name}</span> - {model.description}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Action */}
                          <Button
                            onClick={() => {
                              setSelectedProvider(provider.id)
                              setIsAddDialogOpen(true)
                            }}
                            disabled={isConfigured}
                            className={`w-full ${
                              isConfigured
                                ? "bg-sage-200 text-sage-500 cursor-not-allowed"
                                : "bg-sage-600 hover:bg-sage-700 text-white"
                            } rounded-organic-lg`}
                          >
                            {isConfigured ? "Already Configured" : "Configure Provider"}
                          </Button>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </TabsContent>

              {/* Usage Tab */}
              <TabsContent value="usage" className="space-y-6 mt-6">
                <Card className="bg-white/80 border-sage-100 rounded-organic-xl">
                  <CardHeader>
                    <CardTitle className="text-base font-medium text-sage-900">Usage Analytics</CardTitle>
                    <CardDescription className="text-sm text-sage-600">
                      Track your API usage and costs across providers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <BarChart3 className="h-12 w-12 text-sage-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-sage-900 mb-2">Usage Tracking Coming Soon</h3>
                      <p className="text-sage-600 text-sm max-w-md mx-auto">
                        We're building comprehensive usage analytics to help you monitor API costs, track model
                        performance, and optimize your therapeutic AI workflows.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Separate component for the add provider form
function AddProviderForm({
  provider,
  onAdd,
  onCancel,
  validateFormat,
}: {
  provider: ApiProvider
  onAdd: (providerId: string, apiKey: string, selectedModel?: string) => void
  onCancel: () => void
  validateFormat: (apiKey: string, provider: ApiProvider) => boolean
}) {
  const [apiKey, setApiKey] = useState("")
  const [selectedModel, setSelectedModel] = useState(provider.models[0].id)
  const [showKey, setShowKey] = useState(false)
  const [formatError, setFormatError] = useState("")

  const handleApiKeyChange = (value: string) => {
    setApiKey(value)
    if (value && !validateFormat(value, provider)) {
      setFormatError(`API key should start with "${provider.keyFormat}" and be at least 20 characters long`)
    } else {
      setFormatError("")
    }
  }

  const handleSubmit = () => {
    if (!apiKey.trim()) return
    if (!validateFormat(apiKey, provider)) {
      setFormatError(`Invalid API key format for ${provider.name}`)
      return
    }
    onAdd(provider.id, apiKey, selectedModel)
    setApiKey("")
    setSelectedModel(provider.models[0].id)
    setFormatError("")
  }

  return (
    <Card className="bg-sage-50 border-sage-200">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-medium text-sage-900">Configure {provider.name}</CardTitle>
        <CardDescription className="text-sm text-sage-600">{provider.setupInstructions}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Key Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-sage-700">API Key</label>
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                type={showKey ? "text" : "password"}
                placeholder={`${provider.keyFormat}...`}
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                className={`pr-10 border-sage-200 rounded-organic-lg bg-white focus:ring-sage-300 focus:border-sage-300 ${
                  formatError ? "border-red-300 focus:border-red-300 focus:ring-red-300" : ""
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-2 h-6 w-6 p-0 text-sage-500 hover:text-sage-700"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          {formatError && <p className="text-xs text-red-600">{formatError}</p>}
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-sage-700">Default Model</label>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2 border border-sage-200 rounded-organic-lg bg-white focus:ring-sage-300 focus:border-sage-300 text-sm"
          >
            {provider.models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} - {model.description}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="border-sage-200 text-sage-600 hover:bg-sage-50 rounded-organic-md bg-transparent"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!apiKey.trim() || !!formatError}
            className="bg-sage-600 hover:bg-sage-700 text-white rounded-organic-md"
          >
            Add Provider
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
