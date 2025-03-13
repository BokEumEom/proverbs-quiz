"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  generateDailyChallenge,
  getDailyChallengeFromStorage,
  saveDailyChallengeToStorage,
  getUserStreak,
  getUserPoints,
  addUserPoints,
} from "@/lib/daily-challenge"
import { DailyChallenge } from "@/types"

interface ChallengeContextType {
  dailyChallenge: DailyChallenge | null
  userStreak: number
  userPoints: number
  refreshChallenge: () => void
  completeChallenge: (points: number) => void
  isLoading: boolean
}

const ChallengeContext = createContext<ChallengeContextType | undefined>(undefined)

export function ChallengeProvider({ children }: { children: ReactNode }) {
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(null)
  const [userStreak, setUserStreak] = useState<number>(0)
  const [userPoints, setUserPoints] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // 초기 로드 및 일일 도전 과제 확인
  useEffect(() => {
    if (typeof window === "undefined") return

    const initializeChallenge = () => {
      setIsLoading(true)

      // 사용자 스트릭 및 포인트 로드
      const streak = getUserStreak()
      setUserStreak(streak)

      const points = getUserPoints()
      setUserPoints(points)

      // 저장된 도전 과제 확인
      let challenge = getDailyChallengeFromStorage()
      const today = new Date()
      const todayStr = today.toISOString().split("T")[0]

      // 저장된 도전 과제가 없거나 오늘 날짜가 아니면 새로 생성
      if (!challenge || new Date(challenge.date).toISOString().split("T")[0] !== todayStr) {
        challenge = generateDailyChallenge(today, streak)
        saveDailyChallengeToStorage(challenge)
      }

      setDailyChallenge(challenge)
      setIsLoading(false)
    }

    initializeChallenge()
  }, [])

  // 도전 과제 새로고침
  const refreshChallenge = () => {
    if (typeof window === "undefined") return

    const streak = getUserStreak()
    setUserStreak(streak)

    const points = getUserPoints()
    setUserPoints(points)

    const today = new Date()
    const challenge = generateDailyChallenge(today, streak)
    saveDailyChallengeToStorage(challenge)
    setDailyChallenge(challenge)
  }

  // 도전 과제 완료 처리
  const completeChallenge = (points: number) => {
    if (!dailyChallenge || dailyChallenge.completed) return

    // 도전 과제 완료 상태로 업데이트
    const updatedChallenge = { ...dailyChallenge, completed: true }
    saveDailyChallengeToStorage(updatedChallenge)
    setDailyChallenge(updatedChallenge)

    // 포인트 추가
    addUserPoints(points)
    setUserPoints(getUserPoints())

    // 스트릭 업데이트 (이미 getUserStreak에서 처리됨)
    setUserStreak(getUserStreak())
  }

  return (
    <ChallengeContext.Provider
      value={{
        dailyChallenge,
        userStreak,
        userPoints,
        refreshChallenge,
        completeChallenge,
        isLoading,
      }}
    >
      {children}
    </ChallengeContext.Provider>
  )
}

export function useChallenge() {
  const context = useContext(ChallengeContext)
  if (context === undefined) {
    throw new Error("useChallenge must be used within a ChallengeProvider")
  }
  return context
}

