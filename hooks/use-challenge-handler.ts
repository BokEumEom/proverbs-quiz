"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { completeDailyChallenge } from "@/lib/daily-challenge"

export function useChallengeHandler(
  dailyChallenge: any,
  completeChallenge: ((id: string) => Promise<boolean>) | undefined,
  updateUserStats: (points: number) => void
) {
  const [challengeCompleted, setChallengeCompleted] = useState(false)
  const { toast } = useToast()

  // 도전 과제 완료 시 UI 업데이트를 위한 효과
  useEffect(() => {
    if (dailyChallenge?.completed) {
      setChallengeCompleted(true)
    }
  }, [dailyChallenge])

  // 도전 과제 수락 핸들러
  const handleChallengeAccept = async (challengeId: string) => {
    try {
      // 실제 구현에서는 completeChallenge 함수를 통해 서버와 통신
      if (completeChallenge) {
        const result = await completeChallenge(challengeId)
        if (result) {
          setChallengeCompleted(true)
          
          // 포인트 업데이트
          const challengeReward = dailyChallenge?.reward || 0
          updateUserStats(challengeReward)
          
          toast({
            title: "도전 완료!",
            description: `${challengeReward} 포인트를 획득했습니다.`,
          })
        }
        return result
      } else {
        // 로컬 구현 - 도전 과제 완료 처리
        const result = completeDailyChallenge(challengeId)
        
        if (result.success) {
          setChallengeCompleted(true)
          
          // 포인트 업데이트
          updateUserStats(result.points)
          
          toast({
            title: "도전 완료!",
            description: `${result.points} 포인트를 획득했습니다.`,
          })
        }
        
        return result.success
      }
    } catch (error) {
      console.error("도전 과제 처리 중 오류:", error)
      toast({
        title: "오류 발생",
        description: "도전 과제를 처리하는 중 문제가 발생했습니다.",
        variant: "destructive",
      })
      return false
    }
  }
  
  // 도전 과제 완료 콜백
  const handleChallengeComplete = (challengeId: string) => {
    // 도전 과제 완료 후 추가 작업이 필요한 경우
    console.log(`도전 과제 ${challengeId} 완료됨`)
  }

  return {
    challengeCompleted,
    handleChallengeAccept,
    handleChallengeComplete
  }
} 