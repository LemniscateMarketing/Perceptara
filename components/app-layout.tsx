"use client"

import type React from "react"

import { useState } from "react"
import { Home, User, Settings, Menu, X, Brain } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname } from "next/navigation"

const navItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Patient Cases",
    url: "/patient-cases",
    icon: User,
  },
]

const adminItems = [
  {
    title: "Administration",
    url: "/admin",
    icon: Settings,
  },
]

interface AppLayoutProps {
  children: React.ReactNode
  currentPath?: string
}

export function AppLayout({ children, currentPath = "/" }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (url: string) => {
    if (url === "/" && pathname === "/") return true
    if (url !== "/" && pathname.startsWith(url)) return true
    return false
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-therapeutic-beige/20 to-sage-50">
      {/* Mobile header */}
      <div className="lg:hidden bg-white/80 backdrop-blur-sm border-b border-sage-100 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-light text-sage-900">Psychology Training</h1>
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)} className="text-sage-600">
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div
          className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 transition-transform duration-200 ease-in-out
          fixed lg:static inset-y-0 left-0 z-50 w-64 
          bg-white/80 backdrop-blur-sm border-r border-sage-100
        `}
        >
          <div className="p-6 border-b border-sage-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-sage-100 rounded-organic-lg">
                <Brain className="h-6 w-6 text-sage-700" />
              </div>
              <div>
                <h2 className="text-lg font-light text-sage-900">Psychology Training</h2>
                <p className="text-sm text-sage-600">Therapeutic Simulation</p>
              </div>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {/* Main Navigation */}
            <div className="space-y-1">
              {navItems.map((item) => {
                const IconComponent = item.icon
                const active = isActive(item.url)

                return (
                  <Button
                    key={item.title}
                    variant="ghost"
                    className={`w-full justify-start rounded-organic-md h-10 px-3 text-sm ${
                      active
                        ? "bg-sage-100 text-sage-900 hover:bg-sage-100"
                        : "text-sage-600 hover:bg-sage-50 hover:text-sage-800"
                    }`}
                    onClick={() => {
                      router.push(item.url)
                      setSidebarOpen(false)
                    }}
                  >
                    <IconComponent className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="font-light">{item.title}</span>
                  </Button>
                )
              })}
            </div>

            {/* Divider */}
            <div className="border-t border-sage-100 my-4" />

            {/* Admin Section */}
            <div className="space-y-1">
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-sage-500 uppercase tracking-wider">System</p>
              </div>
              {adminItems.map((item) => {
                const IconComponent = item.icon
                const active = isActive(item.url)

                return (
                  <Button
                    key={item.title}
                    variant="ghost"
                    className={`w-full justify-start rounded-organic-md h-10 px-3 text-sm ${
                      active
                        ? "bg-sage-100 text-sage-900 hover:bg-sage-100"
                        : "text-sage-600 hover:bg-sage-50 hover:text-sage-800"
                    }`}
                    onClick={() => {
                      router.push(item.url)
                      setSidebarOpen(false)
                    }}
                  >
                    <IconComponent className="h-4 w-4 mr-3 flex-shrink-0" />
                    <span className="font-light">{item.title}</span>
                  </Button>
                )
              })}
            </div>
          </nav>
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 bg-black/20 z-40" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main content */}
        <div className="flex-1 lg:ml-0">{children}</div>
      </div>
    </div>
  )
}
