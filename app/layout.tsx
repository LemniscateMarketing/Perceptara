import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ChatFeaturesProvider } from "@/lib/chat-features-manager"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Psychology Simulation Software",
  description: "AI-powered psychology training simulation platform",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ChatFeaturesProvider>
            {children}
            <Toaster />
          </ChatFeaturesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
