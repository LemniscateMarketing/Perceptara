"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import Dashboard from "@/components/dashboard"
import ModalitySelection from "@/components/modality-selection"
import SessionInterface from "@/components/session-interface"

type ViewState = "dashboard" | "modality-selection" | "session" | "notes" | "supervision"

export default function SimulationApp() {
  const [currentView, setCurrentView] = useState<ViewState>("dashboard")
  const [selectedPatient, setSelectedPatient] = useState<any>(null)
  const [selectedModality, setSelectedModality] = useState<string>("")

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient)
    setCurrentView("modality-selection")
  }

  const handleModalitySelect = (modality: string) => {
    setSelectedModality(modality)
    setCurrentView("session")
  }

  const handleBackToDashboard = () => {
    setCurrentView("dashboard")
    setSelectedPatient(null)
    setSelectedModality("")
  }

  const handleBackToModality = () => {
    setCurrentView("modality-selection")
  }

  const handleEndSession = () => {
    // This would typically navigate to session notes
    setCurrentView("dashboard")
  }

  const getCurrentPath = () => {
    switch (currentView) {
      case "session":
        return "/session"
      case "modality-selection":
        return "/modality"
      default:
        return "/"
    }
  }

  switch (currentView) {
    case "dashboard":
      return (
        <AppLayout currentPath={getCurrentPath()}>
          <Dashboard onPatientSelect={handlePatientSelect} />
        </AppLayout>
      )

    case "modality-selection":
      return (
        <AppLayout currentPath={getCurrentPath()}>
          <ModalitySelection
            patient={selectedPatient}
            onBack={handleBackToDashboard}
            onStartSession={handleModalitySelect}
          />
        </AppLayout>
      )

    case "session":
      return (
        <AppLayout currentPath={getCurrentPath()}>
          <SessionInterface
            patient={selectedPatient}
            modality={selectedModality}
            onBack={handleBackToModality}
            onEndSession={handleEndSession}
          />
        </AppLayout>
      )

    default:
      return (
        <AppLayout currentPath={getCurrentPath()}>
          <Dashboard onPatientSelect={handlePatientSelect} />
        </AppLayout>
      )
  }
}
