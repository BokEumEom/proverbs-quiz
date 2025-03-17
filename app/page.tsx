"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useChallenge } from "@/contexts/challenge-context"
import { motion, AnimatePresence } from "framer-motion"
import { Sun, Moon, Trophy, BookOpen, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import BottomNavigation from "@/components/bottom-navigation"
import DailyChallengeCard from "@/components/daily-challenge-card"
import QuizCategories from "@/components/home/quiz-categories"
import AchievementCard from "@/components/home/achievement-card"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

// 애니메이션 변수 정의
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function Home() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { dailyChallenge, userPoints, isLoading, completeChallenge } = useChallenge()
  const [currentUser, setCurrentUser] = useState({
    totalQuizzes: 24,
    streak: 5,
    learntProverbs: 48,
    points: userPoints || 120,
  })
  const { toast } = useToast()

  // 테마 마운트 확인
  useEffect(() => {
    setMounted(true)
  }, [])

  // 사용자 포인트가 업데이트되면 현재 사용자 상태도 업데이트
  useEffect(() => {
    if (userPoints !== undefined) {
      setCurrentUser((prev) => ({ ...prev, points: userPoints }))
    }
  }, [userPoints])

  // 도전 과제 수락 핸들러
  const handleChallengeAccept = async (challengeId: string) => {
    try {
      // 실제 구현에서는 completeChallenge 함수를 통해 서버와 통신
      if (completeChallenge) {
        await completeChallenge(challengeId)
      } else {
        // 데모 목적의 지연
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // 포인트 업데이트 (실제로는 서버에서 처리)
        const challengeReward = dailyChallenge?.reward || 0
        setCurrentUser(prev => ({
          ...prev,
          points: prev.points + challengeReward
        }))
        
        toast({
          title: "도전 완료!",
          description: `${challengeReward} 포인트를 획득했습니다.`,
        })
      }
      return true
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "도전 과제를 처리하는 중 문제가 발생했습니다.",
        variant: "destructive",
      })
      return false
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 모바일 최적화 헤더 */}
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

      <motion.div 
        className="p-4 pb-24 max-w-md mx-auto space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* 학습 추천 배너 */}
        <motion.section variants={item}>
          <Card className="overflow-hidden border-0 shadow-sm">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <BookOpen className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold">오늘의 학습 제안</h3>
                  <p className="text-sm text-blue-100">플래시카드로 새로운 속담을 배워보세요!</p>
                </div>
              </div>
            </div>
            <CardContent className="p-3 flex justify-between items-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                아직 학습하지 않은 속담이 52개 남아있습니다
              </p>
              <Button size="sm" className="whitespace-nowrap" asChild>
                <a href="/learn/flashcards">학습하기</a>
              </Button>
            </CardContent>
          </Card>
        </motion.section>

        {/* 일일 도전 과제 섹션 */}
        <motion.section variants={item}>
          <h2 className="text-lg font-bold mb-3 flex items-center">
            <Trophy className="h-5 w-5 text-amber-500 mr-2" />
            오늘의 도전
          </h2>
          {isLoading ? (
            <Skeleton className="h-32 w-full rounded-lg" />
          ) : dailyChallenge ? (
            <DailyChallengeCard 
              challenge={dailyChallenge} 
              onChallengeAccept={handleChallengeAccept}
            />
          ) : (
            <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 text-center">
              <p className="text-gray-500 dark:text-gray-400">오늘의 도전 과제가 없습니다.</p>
            </Card>
          )}
        </motion.section>

        {/* 퀴즈 카테고리 */}
        <motion.section variants={item}>
          <QuizCategories />
        </motion.section>

        {/* 업적 & 통계 */}
        <motion.section variants={item}>
          <AchievementCard
            totalQuizzes={currentUser.totalQuizzes}
            streak={currentUser.streak}
            learntProverbs={currentUser.learntProverbs}
            points={currentUser.points}
          />
        </motion.section>
      </motion.div>

      {/* 모바일 하단 내비게이션 */}
      <BottomNavigation />
    </main>
  )
}

// 애니메이션 테마 토글 컴포넌트
function AnimatedThemeToggle({ theme, setTheme }) {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full bg-gray-100 dark:bg-gray-800"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.div
            key="sun"
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 90 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-5 w-5" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ opacity: 0, rotate: 90 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: -90 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-5 w-5" />
          </motion.div>
        )}
      </AnimatePresence>
    </Button>
  )
}

