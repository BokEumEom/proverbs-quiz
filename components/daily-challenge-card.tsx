"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Clock, CheckCircle, Loader2, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface DailyChallengeProps {
  challenge: {
    id: string
    title: string
    description: string
    reward: number
    completed?: boolean
    completedAt?: string
    progress?: number
    expiresIn?: string
    type: string
    questionCount: number
  }
  onChallengeAccept?: (challengeId: string) => Promise<boolean>
  onChallengeComplete?: (challengeId: string) => void
  streak?: number
}

export default function DailyChallengeCard({ 
  challenge, 
  onChallengeAccept,
  onChallengeComplete,
  streak = 0
}: DailyChallengeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [localProgress, setLocalProgress] = useState(challenge.progress || 0)
  const [localCompleted, setLocalCompleted] = useState(challenge.completed || false)
  const { toast } = useToast()
  
  // 외부에서 challenge가 업데이트되면 로컬 상태도 업데이트
  useEffect(() => {
    setLocalProgress(challenge.progress || 0)
    setLocalCompleted(challenge.completed || false)
  }, [challenge])

  // 도전하기 버튼 클릭 핸들러
  const handleChallengeAccept = async () => {
    if (localCompleted || isLoading) return
    
    setIsLoading(true)
    
    try {
      // 실제 구현에서는 onChallengeAccept 함수를 통해 서버와 통신
      if (onChallengeAccept) {
        const success = await onChallengeAccept(challenge.id)
        
        if (success) {
          setLocalProgress(100)
          setLocalCompleted(true)
          
          // 완료 콜백 호출
          if (onChallengeComplete) {
            onChallengeComplete(challenge.id)
          }
        }
      } else {
        // 데모 목적의 지연 및 진행 상태 업데이트
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 진행 상태를 증가시키는 애니메이션
        const targetProgress = Math.min(100, localProgress + 25)
        const startProgress = localProgress
        
        const startTime = Date.now()
        const duration = 800 // 애니메이션 지속 시간 (ms)
        
        const animateProgress = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          const currentProgress = startProgress + (targetProgress - startProgress) * progress
          
          setLocalProgress(Math.round(currentProgress))
          
          if (progress < 1) {
            requestAnimationFrame(animateProgress)
          } else if (targetProgress >= 100) {
            setLocalCompleted(true)
            toast({
              title: "도전 완료!",
              description: `${challenge.reward} 포인트를 획득했습니다.`,
              variant: "default",
            })
            
            // 완료 콜백 호출
            if (onChallengeComplete) {
              onChallengeComplete(challenge.id)
            }
          } else {
            toast({
              title: "진행 상황 업데이트",
              description: `도전 진행률이 ${targetProgress}%가 되었습니다.`,
              variant: "default",
            })
          }
        }
        
        requestAnimationFrame(animateProgress)
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "도전 과제를 시작하는 중 문제가 발생했습니다.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // 연속 출석 보너스 표시
  const renderStreakBonus = () => {
    if (streak < 5) return null
    
    let bonusText = ""
    if (streak >= 30) bonusText = "30일 연속 출석 보너스!"
    else if (streak >= 20) bonusText = "20일 연속 출석 보너스!"
    else if (streak >= 10) bonusText = "10일 연속 출석 보너스!"
    else if (streak >= 5) bonusText = "5일 연속 출석 보너스!"
    
    return (
      <motion.div 
        className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-1 rounded-full"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {bonusText}
      </motion.div>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative"
    >
      {renderStreakBonus()}
      
      <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-all">
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4 text-white">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-lg">{challenge.title}</h3>
              <p className="text-sm text-amber-100">{challenge.description}</p>
            </div>
            <motion.div 
              className="bg-white/20 p-2 rounded-full"
              animate={localCompleted ? { 
                scale: [1, 1.2, 1],
                backgroundColor: ["rgba(255,255,255,0.2)", "rgba(255,255,255,0.4)", "rgba(255,255,255,0.2)"]
              } : {}}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
            >
              <Trophy className="h-6 w-6" />
            </motion.div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-3">
            {challenge.expiresIn && (
              <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                <Clock className="h-4 w-4 mr-1" />
                <span>남은 시간: {challenge.expiresIn}</span>
              </div>
            )}
            
            <div className="flex justify-between text-sm">
              <span>진행 상황</span>
              <span className="font-medium">{localProgress}%</span>
            </div>
            
            <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-amber-500"
                initial={{ width: `${challenge.progress || 0}%` }}
                animate={{ width: `${localProgress}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            
            <div className="flex justify-between items-center mt-2">
              <div className="text-sm text-gray-500">
                보상: <span className="font-medium text-amber-500">{challenge.reward} 포인트</span>
              </div>
              
              <AnimatePresence mode="wait">
                {localCompleted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex gap-2"
                  >
                    <Button 
                      size="sm" 
                      variant="outline"
                      disabled
                      className="bg-green-50 text-green-600 border-green-200"
                    >
                      <span className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" /> 완료됨
                      </span>
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline"
                      asChild
                    >
                      <Link href={`/quiz/${challenge.type}`}>
                        <span className="flex items-center">
                          <ArrowRight className="h-4 w-4 mr-1" /> 더 풀기
                        </span>
                      </Link>
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      size="sm" 
                      variant="default"
                      disabled={isLoading}
                      onClick={handleChallengeAccept}
                      className="relative"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          처리 중...
                        </>
                      ) : (
                        <>
                          {isHovered && (
                            <motion.span
                              className="absolute inset-0 bg-amber-400/20 rounded-md"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              layoutId="button-highlight"
                            />
                          )}
                          도전하기
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

