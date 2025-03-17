"use client"

import { motion } from "framer-motion"
import { Trophy } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import DailyChallengeCard from "@/components/daily-challenge-card"
import { pageAnimations } from "@/constants/animations"

interface ChallengeSectionProps {
  isLoading: boolean
  dailyChallenge: any
  onChallengeAccept: (challengeId: string) => Promise<boolean>
  onChallengeComplete: (challengeId: string) => void
  streak: number
}

export default function ChallengeSection({
  isLoading,
  dailyChallenge,
  onChallengeAccept,
  onChallengeComplete,
  streak
}: ChallengeSectionProps) {
  return (
    <motion.section variants={pageAnimations.item}>
      <h2 className="text-lg font-bold mb-3 flex items-center">
        <Trophy className="h-5 w-5 text-amber-500 mr-2" />
        오늘의 도전
      </h2>
      {isLoading ? (
        <Skeleton className="h-32 w-full rounded-lg" />
      ) : dailyChallenge ? (
        <DailyChallengeCard 
          challenge={dailyChallenge} 
          onChallengeAccept={onChallengeAccept}
          onChallengeComplete={onChallengeComplete}
          streak={streak}
        />
      ) : (
        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg p-4 text-center">
          <p className="text-gray-500 dark:text-gray-400">오늘의 도전 과제가 없습니다.</p>
        </Card>
      )}
    </motion.section>
  )
} 