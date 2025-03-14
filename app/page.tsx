"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { useChallenge } from "@/contexts/challenge-context"
import { motion } from "framer-motion"
import { Sun, Moon, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

// 새 컴포넌트 임포트
import QuizCategories from "@/components/home/quiz-categories"
import AchievementCard from "@/components/home/achievement-card"
import RecentActivities from "@/components/home/recent-activities"
import BottomNavigation from "@/components/bottom-navigation"
import DailyChallengeCard from "@/components/daily-challenge-card"

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
  const { dailyChallenge, userPoints, isLoading } = useChallenge()
  const [currentUser, setCurrentUser] = useState({
    totalQuizzes: 24,
    streak: 5,
    learntProverbs: 48,
    points: userPoints || 120,
  })

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

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 모바일 최적화 헤더 */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">속담 퀴즈</h1>

          <div className="flex items-center">
            {mounted && (
              <>
                <div className="mr-4 flex items-center">
                  <Trophy className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="font-medium">{userPoints} 포인트</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-full"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="p-4 pb-24 max-w-md mx-auto space-y-6">
        {/* 일일 도전 과제 섹션 */}
        <section>
          <h2 className="text-lg font-bold mb-3">오늘의 도전</h2>
          {isLoading ? (
            <Skeleton className="h-32 w-full rounded-lg" />
          ) : dailyChallenge ? (
            <DailyChallengeCard challenge={dailyChallenge} />
          ) : (
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 text-center">
              <p className="text-gray-500 dark:text-gray-400">오늘의 도전 과제가 없습니다.</p>
            </div>
          )}
        </section>

        {/* 퀴즈 카테고리 */}
        <section>
          <QuizCategories />
        </section>

        {/* 업적 & 통계 */}
        <section>
          <AchievementCard
            totalQuizzes={currentUser.totalQuizzes}
            streak={currentUser.streak}
            learntProverbs={currentUser.learntProverbs}
            points={currentUser.points}
          />
        </section>

        {/* 최근 활동 */}
        <section>
          <RecentActivities isLoading={isLoading} />
        </section>
      </div>

      {/* 모바일 하단 내비게이션 */}
      <BottomNavigation />
    </main>
  )
}

