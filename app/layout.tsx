import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { ChallengeProvider } from "@/contexts/challenge-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "속담 퀴즈",
  description: "한국 속담을 재미있게 배워보세요",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ChallengeProvider>{children}</ChallengeProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'