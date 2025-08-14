"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Settings, MessageSquare, Brain, FileText, Users, TestTube, Cog } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface AdminLayoutProps {
  children: React.ReactNode
  title?: string
}

const adminNavItems = [
  {
    title: "API & System Settings",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Prompt Management",
    href: "/admin/prompts",
    icon: MessageSquare,
  },
  {
    title: "Patient Architecture",
    href: "/admin/patient-architecture",
    icon: Brain,
  },
  {
    title: "Chat Architecture",
    href: "/admin/chat-architecture",
    icon: Cog,
  },
  {
    title: "Chat Interface",
    href: "/admin/chat-interface",
    icon: TestTube,
  },
  {
    title: "All Cases",
    href: "/admin/all-cases",
    icon: FileText,
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
  },
]

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 to-therapeutic-beige/30">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-white/80 backdrop-blur-sm border-r border-sage-100">
          {/* Header */}
          <div className="border-b border-sage-100 bg-gradient-to-r from-sage-50 to-therapeutic-beige/30 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-light text-sage-900">Administration</h1>
                <p className="text-sm text-sage-600">System</p>
                <p className="text-sm text-sage-600">Management</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="text-sage-600 hover:bg-sage-50 rounded-organic-md"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="p-4 space-y-2">
            {adminNavItems.map((item) => {
              const isActive = pathname === item.href
              const IconComponent = item.icon

              return (
                <Button
                  key={item.title}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start rounded-organic-md h-10 px-3 text-sm",
                    isActive
                      ? "bg-sage-100 text-sage-900 hover:bg-sage-100"
                      : "text-sage-600 hover:bg-sage-50 hover:text-sage-800",
                  )}
                  onClick={() => router.push(item.href)}
                >
                  <IconComponent className="h-4 w-4 mr-3 flex-shrink-0" />
                  <span className="font-light">{item.title}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  )
}
