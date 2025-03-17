"use client"

import { useState, useEffect } from "react"
import { useChallenge } from "@/contexts/challenge-context"
import { motion } from "framer-motion"
import BottomNavigation from "@/components/bottom-navigation"
import QuizCategories from "@/components/home/quiz-categories"
import AchievementCard from "@/components/home/achievement-card"
import { pageAnimations } from "@/constants/animations"
import { useChallengeHandler } from "@/hooks/use-challenge-handler"
import HomeHeader from "@/components/home/header"
import LearningBanner from "@/components/home/learning-suggestion-banner"
import ChallengeSection from "@/components/home/challenge-section"

export default function Home() {
  const { dailyChallenge, userPoints, isLoading, completeChallenge } = useChallenge()
  const [currentUser, setCurrentUser] = useState({
    totalQuizzes: 24,
    streak: 5,
    learntProverbs: 48,
    points: userPoints || 120,
  })

  // 사용자 포인트가 업데이트되면 현재 사용자 상태도 업데이트
  useEffect(() => {
    if (userPoints !== undefined) {
      setCurrentUser((prev) => ({ ...prev, points: userPoints }))
    }
  }, [userPoints])

  // 사용자 통계 업데이트 함수
  const updateUserStats = (points: number) => {
    setCurrentUser(prev => ({
      ...prev,
      points: prev.points + points,
      totalQuizzes: prev.totalQuizzes + 1
    }))
  }

  // 도전 과제 핸들러 훅 사용
  const { handleChallengeAccept, handleChallengeComplete } = useChallengeHandler(
    dailyChallenge,
    completeChallenge,
    updateUserStats
  )

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 헤더 */}
      <HomeHeader userPoints={userPoints || currentUser.points} />

      {/* 메인 콘텐츠 */}
      <motion.div 
        className="p-4 pb-24 max-w-md mx-auto space-y-6"
        variants={pageAnimations.container}
        initial="hidden"
        animate="show"
      >
        {/* 학습 추천 배너 */}
        <LearningBanner remainingProverbs={52} />

        {/* 일일 도전 과제 섹션 */}
        <ChallengeSection 
          isLoading={isLoading}
          dailyChallenge={dailyChallenge}
          onChallengeAccept={handleChallengeAccept}
          onChallengeComplete={handleChallengeComplete}
          streak={currentUser.streak}
        />

        {/* 퀴즈 카테고리 */}
        <motion.section variants={pageAnimations.item}>
          <QuizCategories />
        </motion.section>

        {/* 업적 & 통계 */}
        <motion.section variants={pageAnimations.item}>
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

