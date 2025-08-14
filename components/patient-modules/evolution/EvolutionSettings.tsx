"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Slider } from "@/components/ui/slider"
import {
  Zap,
  Settings,
  Calendar,
  Sparkles,
  Hash,
  Clock,
  Percent,
  TrendingUp,
  Info,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  Shuffle,
  Brain,
  Target,
  Timer,
} from "lucide-react"
import { EVOLUTION_TYPES, TIMING_UNITS, getSmartDefaults } from "./config"
import type { EvolutionConfig } from "./types"

interface EvolutionSettingsProps {
  fieldName: string
  fieldType: string
  config: EvolutionConfig
  onChange: (config: EvolutionConfig) => void
}

export function EvolutionSettings({ fieldName, fieldType, config, onChange }: EvolutionSettingsProps) {
  const smartDefaults = getSmartDefaults(fieldType, fieldName.toLowerCase())

  const handleConfigChange = (updates: Partial<EvolutionConfig>) => {
    onChange({ ...config, ...updates })
  }

  const applySmartDefaults = () => {
    handleConfigChange(smartDefaults)
  }

  // Generate timeline preview
  const generateTimelinePreview = () => {
    const sessions = Array.from({ length: 12 }, (_, i) => i + 1)

    if (
      config.type === "ai_decide" ||
      config.timing.unit === "ai_decide" ||
      config.amount.mode === "ai_decide" ||
      config.probability.mode === "ai_decide"
    ) {
      return sessions.map((session) => ({ session, willChange: "ai_decides" }))
    }

    return sessions.map((session) => {
      const willChange = session % config.timing.frequency === 0 && Math.random() * 100 < config.probability.value
      return { session, willChange }
    })
  }

  const timelinePreview = generateTimelinePreview()

  // Generate evolution summary
  const generateSummary = () => {
    if (
      config.type === "ai_decide" &&
      config.amount.mode === "ai_decide" &&
      config.probability.mode === "ai_decide" &&
      config.timing.unit === "ai_decide"
    ) {
      return `${fieldName} evolution will be completely managed by AI based on therapeutic context`
    }

    let summary = ""

    if (config.probability.mode === "ai_decide") {
      summary += "AI will determine when "
    } else {
      summary += `There is a ${config.probability.value}% chance that `
    }

    summary += `${fieldName} might `

    if (config.type === "ai_decide") {
      summary += "change in an AI-determined direction"
    } else {
      const directionMap = {
        increase: "increase",
        decrease: "decrease",
        bidirectional: "change (increase or decrease)",
        switch: "switch to completely different values",
      }
      summary += directionMap[config.type] || config.type
    }

    if (config.amount.mode === "ai_decide") {
      summary += " by an AI-determined amount"
    } else {
      const amountText = config.amount.value === 1 ? "1 unit" : `${config.amount.value} units`
      summary += ` by ${amountText}`
    }

    if (config.timing.unit === "ai_decide") {
      summary += " at AI-determined intervals"
    } else {
      const timingLabel = TIMING_UNITS.find((t) => t.value === config.timing.unit)?.label.toLowerCase() || "sessions"
      if (config.timing.frequency === 0) {
        summary += ` during every ${timingLabel}`
      } else if (config.timing.frequency === 1) {
        summary += ` after every ${timingLabel}`
      } else {
        summary += ` after every ${config.timing.frequency} ${timingLabel}s`
      }
    }

    return summary
  }

  // Get direction icon
  const getDirectionIcon = (type: string) => {
    switch (type) {
      case "increase":
        return <ArrowUp className="h-4 w-4" />
      case "decrease":
        return <ArrowDown className="h-4 w-4" />
      case "bidirectional":
        return <ArrowUpDown className="h-4 w-4" />
      case "switch":
        return <Shuffle className="h-4 w-4" />
      case "ai_decide":
        return <Brain className="h-4 w-4" />
      default:
        return <TrendingUp className="h-4 w-4" />
    }
  }

  // Get current selection labels for display
  const currentDirectionType = EVOLUTION_TYPES.find((t) => t.value === config.type)
  const currentTimingUnit = TIMING_UNITS.find((t) => t.value === config.timing.unit)

  if (!config.enabled) {
    return (
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 opacity-50" />
        <div className="relative p-12 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-200 rounded-full mb-6">
            <Settings className="h-10 w-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-3">Evolution Disabled</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Enable the evolution toggle above to configure how this field changes over time during therapy sessions.
          </p>
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-therapeutic-lavender/10 via-purple-50 to-indigo-50 rounded-2xl border border-therapeutic-lavender/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-therapeutic-lavender/20 to-purple-200 rounded-full -translate-y-16 translate-x-16" />
          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-therapeutic-lavender/20 rounded-xl">
                  <Zap className="h-6 w-6 text-therapeutic-lavender" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-purple-900">Evolution Configuration</h2>
                  <p className="text-purple-700 mt-1">
                    Configure how <span className="font-semibold text-therapeutic-lavender">{fieldName}</span> evolves
                    during therapy
                  </p>
                </div>
              </div>
              {Object.keys(smartDefaults).length > 0 && (
                <Button
                  variant="outline"
                  onClick={applySmartDefaults}
                  className="bg-white/80 border-therapeutic-lavender/30 text-therapeutic-lavender hover:bg-therapeutic-lavender/10 shadow-sm"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Smart Defaults
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Direction Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-indigo-50/30">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    {getDirectionIcon(config.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg font-semibold text-blue-900">Direction</CardTitle>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-blue-400 hover:text-blue-600 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">
                            Determines the type of change that can occur. Choose how the field should evolve over time.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-blue-700">What kind of change occurs?</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {currentDirectionType?.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={config.type} onValueChange={(value) => handleConfigChange({ type: value as any })}>
                <SelectTrigger className="w-full border-blue-200 focus:border-blue-400 bg-white/80">
                  <SelectValue>
                    {currentDirectionType && (
                      <div className="flex items-center space-x-3">
                        <div className="p-1.5 bg-blue-100 rounded">{getDirectionIcon(currentDirectionType.value)}</div>
                        <span className="font-medium text-gray-900">{currentDirectionType.label}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {EVOLUTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value} className="py-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-1.5 bg-blue-100 rounded">{getDirectionIcon(type.value)}</div>
                        <div>
                          <div className="font-medium text-gray-900">{type.label}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{type.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Description below dropdown */}
              {currentDirectionType && (
                <div className="mt-2 px-3 py-2 bg-blue-50/70 rounded-md border border-blue-100">
                  <p className="text-sm text-blue-700">{currentDirectionType.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timing Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-orange-200/50 bg-gradient-to-br from-orange-50/50 to-amber-50/30">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <CardTitle className="text-lg font-semibold text-orange-900">Timing</CardTitle>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-orange-400 hover:text-orange-600 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Defines when evolution checks occur during therapy sessions.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-sm text-orange-700">When does change happen?</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                  {currentTimingUnit?.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={config.timing.unit}
                onValueChange={(value) =>
                  handleConfigChange({
                    timing: {
                      unit: value as any,
                      frequency: value === "ai_decide" ? 0 : config.timing.frequency,
                    },
                  })
                }
              >
                <SelectTrigger className="w-full border-orange-200 focus:border-orange-400 bg-white/80">
                  <SelectValue>
                    {currentTimingUnit && (
                      <div className="flex items-center space-x-3">
                        <div className="p-1.5 bg-orange-100 rounded">
                          <Timer className="h-4 w-4 text-orange-600" />
                        </div>
                        <span className="font-medium text-gray-900">{currentTimingUnit.label}</span>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {TIMING_UNITS.map((timing) => (
                    <SelectItem key={timing.value} value={timing.value} className="py-3">
                      <div className="flex items-center space-x-3">
                        <div className="p-1.5 bg-orange-100 rounded">
                          <Timer className="h-4 w-4 text-orange-600" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{timing.label}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{timing.description}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Description below dropdown */}
              {currentTimingUnit && (
                <div className="mt-2 px-3 py-2 bg-orange-50/70 rounded-md border border-orange-100">
                  <p className="text-sm text-orange-700">{currentTimingUnit.description}</p>
                </div>
              )}

              {config.timing.unit !== "ai_decide" && (
                <div className="bg-orange-50/50 rounded-lg p-4 border border-orange-200/50">
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-orange-800">Every</span>
                    <Input
                      type="number"
                      min="0"
                      value={config.timing.frequency}
                      onChange={(e) =>
                        handleConfigChange({
                          timing: {
                            unit: config.timing.unit,
                            frequency: Math.max(0, Number.parseInt(e.target.value) || 0),
                          },
                        })
                      }
                      className="w-20 text-center border-orange-200 focus:border-orange-400"
                    />
                    <span className="text-sm text-orange-700">
                      {TIMING_UNITS.find((t) => t.value === config.timing.unit)?.label.toLowerCase()}
                      {config.timing.frequency !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Amount and Probability Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Amount Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-green-200/50 bg-gradient-to-br from-green-50/50 to-emerald-50/30">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <Target className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg font-semibold text-green-900">Amount</CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-green-400 hover:text-green-600 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Specifies how much the field changes when evolution occurs.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-green-700">How much change occurs?</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-green-50/50 rounded-lg border border-green-200/50">
                  <Checkbox
                    id="amount-ai"
                    checked={config.amount.mode === "ai_decide"}
                    onCheckedChange={(checked) =>
                      handleConfigChange({
                        amount: {
                          mode: checked ? "ai_decide" : "manual",
                          value: config.amount.value,
                        },
                      })
                    }
                  />
                  <Brain className="h-4 w-4 text-green-600" />
                  <label htmlFor="amount-ai" className="text-sm font-medium text-green-800 cursor-pointer flex-1">
                    Let AI Decide Amount
                  </label>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-lg border border-green-200/50">
                  <Checkbox
                    id="amount-manual"
                    checked={config.amount.mode === "manual"}
                    onCheckedChange={(checked) =>
                      handleConfigChange({
                        amount: {
                          mode: checked ? "manual" : "ai_decide",
                          value: config.amount.value,
                        },
                      })
                    }
                  />
                  <Hash className="h-4 w-4 text-green-600" />
                  <label htmlFor="amount-manual" className="text-sm font-medium text-green-800 cursor-pointer">
                    Manual:
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={config.amount.value}
                    onChange={(e) =>
                      handleConfigChange({
                        amount: {
                          mode: "manual",
                          value: Math.max(0, Number.parseInt(e.target.value) || 0),
                        },
                      })
                    }
                    disabled={config.amount.mode === "ai_decide"}
                    className="w-20 text-center border-green-200 focus:border-green-400"
                    placeholder="0"
                  />
                  <span className="text-sm text-green-700">units</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Probability Card */}
          <Card className="group hover:shadow-lg transition-all duration-300 border-purple-200/50 bg-gradient-to-br from-purple-50/50 to-violet-50/30">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Percent className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg font-semibold text-purple-900">Probability</CardTitle>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info className="h-4 w-4 text-purple-400 hover:text-purple-600 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">
                          Controls the likelihood that evolution will occur at each timing interval.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-sm text-purple-700">Chance of change occurring?</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-purple-50/50 rounded-lg border border-purple-200/50">
                  <Checkbox
                    id="probability-ai"
                    checked={config.probability.mode === "ai_decide"}
                    onCheckedChange={(checked) =>
                      handleConfigChange({
                        probability: {
                          mode: checked ? "ai_decide" : "manual",
                          value: config.probability.value,
                        },
                      })
                    }
                  />
                  <Brain className="h-4 w-4 text-purple-600" />
                  <label htmlFor="probability-ai" className="text-sm font-medium text-purple-800 cursor-pointer flex-1">
                    Let AI Decide Probability
                  </label>
                </div>

                <div className="space-y-3 p-3 bg-white/80 rounded-lg border border-purple-200/50">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="probability-manual"
                      checked={config.probability.mode === "manual"}
                      onCheckedChange={(checked) =>
                        handleConfigChange({
                          probability: {
                            mode: checked ? "manual" : "ai_decide",
                            value: config.probability.value,
                          },
                        })
                      }
                    />
                    <Percent className="h-4 w-4 text-purple-600" />
                    <label
                      htmlFor="probability-manual"
                      className="text-sm font-medium text-purple-800 cursor-pointer flex-1"
                    >
                      Manual Control
                    </label>
                  </div>

                  {config.probability.mode === "manual" && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={config.probability.value}
                          onChange={(e) =>
                            handleConfigChange({
                              probability: {
                                mode: "manual",
                                value: Math.min(100, Math.max(0, Number.parseInt(e.target.value) || 0)),
                              },
                            })
                          }
                          className="w-20 text-center border-purple-200 focus:border-purple-400"
                          placeholder="50"
                        />
                        <span className="text-sm text-purple-700 font-medium">%</span>
                      </div>
                      <Slider
                        value={[config.probability.value]}
                        onValueChange={(value) =>
                          handleConfigChange({
                            probability: {
                              mode: "manual",
                              value: value[0],
                            },
                          })
                        }
                        max={100}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-purple-600">
                        <span>Never (0%)</span>
                        <span>Sometimes (50%)</span>
                        <span>Always (100%)</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Evolution Summary */}
        <Card className="border-therapeutic-lavender/30 bg-gradient-to-br from-therapeutic-lavender/5 to-purple-50/50">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-therapeutic-lavender/20 rounded-lg">
                <Zap className="h-5 w-5 text-therapeutic-lavender" />
              </div>
              <CardTitle className="text-lg font-semibold text-purple-900">Evolution Summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white/80 rounded-lg p-4 border border-therapeutic-lavender/20">
              <p className="text-purple-800 leading-relaxed">{generateSummary()}</p>
            </div>
            <div className="mt-3 flex items-center space-x-2 text-xs text-purple-600 bg-purple-50 rounded-lg px-3 py-2">
              <Sparkles className="h-3 w-3" />
              <span>This summary updates automatically as you change the configuration above</span>
            </div>
          </CardContent>
        </Card>

        {/* Evolution Timeline Preview */}
        <Card className="border-indigo-200/50 bg-gradient-to-br from-indigo-50/30 to-blue-50/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-indigo-900">Evolution Timeline Preview</CardTitle>
                  <p className="text-sm text-indigo-700">Predicted changes over the next 12 periods</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">
                Next 12{" "}
                {config.timing.unit !== "ai_decide"
                  ? TIMING_UNITS.find((t) => t.value === config.timing.unit)?.label.toLowerCase() + "s"
                  : "periods"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-indigo-800">Prediction Model:</span>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">Will change</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-gray-600">No change</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">AI decides</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 rounded-lg p-4 border border-indigo-200/50">
                <div className="grid grid-cols-12 gap-2">
                  {timelinePreview.map((item, index) => (
                    <div key={index} className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                          item.willChange === "ai_decides"
                            ? "bg-purple-500"
                            : item.willChange
                              ? "bg-green-500"
                              : "bg-gray-400"
                        }`}
                      >
                        <span className="text-xs font-bold text-white">{item.session}</span>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-gray-500">
                          {config.timing.unit !== "ai_decide"
                            ? TIMING_UNITS.find((t) => t.value === config.timing.unit)
                                ?.label.toLowerCase()
                                .slice(0, 3)
                            : "per"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  )
}
