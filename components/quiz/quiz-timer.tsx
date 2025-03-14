import React, { useState, useEffect, useCallback } from "react"
import { Clock } from "lucide-react"

interface QuizTimerProps {
  isRunning: boolean
  onTimeUpdate?: (time: number) => void
}

export default function QuizTimer({ isRunning, onTimeUpdate }: QuizTimerProps) {
  const [time, setTime] = useState(0)

  // 시간 형식 변환 함수
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes < 10 ? "0" : ""}${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }, [])

  // 타이머 효과
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prev) => {
          const newTime = prev + 1
          if (onTimeUpdate) {
            onTimeUpdate(newTime)
          }
          return newTime
        })
      }, 1000)
    } else if (interval) {
      clearInterval(interval)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, onTimeUpdate])

  return (
    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
      <Clock className="h-3.5 w-3.5" />
      <span>{formatTime(time)}</span>
    </div>
  )
} 