"use client"

import { motion } from "framer-motion"
import { Sparkles, Trophy } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import AnimatedThemeToggle from "@/components/animated-theme-toggle"

interface HeaderProps {
  userPoints: number
}

export default function HomeHeader({ userPoints }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <Sparkles className="h-5 w-5 text-amber-500 mr-2" />
          <h1 className="text-xl font-bold">속담 퀴즈</h1>
        </div>

        <div className="flex items-center">
          {mounted && (
            <>
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mr-4 flex items-center bg-amber-50 dark:bg-amber-900/20 px-3 py-1 rounded-full"
              >
                <Trophy className="h-4 w-4 text-amber-500 mr-1" />
                <span className="font-medium">{userPoints} 포인트</span>
              </motion.div>
              <AnimatedThemeToggle theme={theme} setTheme={setTheme} />
            </>
          )}
        </div>
      </div>
    </motion.header>
  )
} 