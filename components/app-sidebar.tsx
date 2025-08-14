"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Settings, MessageSquare, Brain, Users, UserCheck, Home, ChevronRight } from "lucide-react"

// Menu data
const data = {
  navMain: [
    {
      title: "Main",
      items: [
        {
          title: "Dashboard",
          url: "/",
          icon: Home,
        },
        {
          title: "Patient Cases",
          url: "/patient-cases",
          icon: UserCheck,
        },
        {
          title: "Chat Interface",
          url: "/admin/chat-interface",
          icon: MessageSquare,
        },
      ],
    },
    {
      title: "Administration",
      items: [
        {
          title: "API & System Settings",
          url: "/admin/settings",
          icon: Settings,
        },
        {
          title: "Prompt Management",
          url: "/admin/prompts",
          icon: MessageSquare,
        },
        {
          title: "Patient Architecture",
          url: "/admin/patient-architecture",
          icon: Brain,
        },
        {
          title: "Chat Architecture",
          url: "/admin/chat-architecture",
          icon: Brain,
        },
        {
          title: "All Cases",
          url: "/admin/all-cases",
          icon: UserCheck,
        },
        {
          title: "User Management",
          url: "/admin/users",
          icon: Users,
        },
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <div className="flex items-center space-x-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-organic-md bg-sage-600">
            <Brain className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-sage-900">Psychology Simulation</p>
            <p className="text-xs text-sage-600">Training Platform</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel className="text-sage-600">{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <a href={item.url} className="flex items-center space-x-3">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {isActive && <ChevronRight className="ml-auto h-4 w-4" />}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
