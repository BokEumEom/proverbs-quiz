"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Gift, Award, Flame } from "lucide-react"
import Link from "next/link"
import { calculateStreakBonus } from "@/lib/daily-challenge"
import { DailyChallenge } from "@/types"
import { QUIZ_CONFIG } from "@/constants"

interface DailyChallengeCardProps {
  challenge: DailyChallenge
}

export default function DailyChallengeCard({ challenge }: DailyChallengeCardProps) {
  const config = QUIZ_CONFIG[challenge.type]

  // 퀴즈 유형에 따른 색상 설정
  const typeColors = {
    ox: "bg-green-500",
    "initial-sound": "bg-purple-500",
    picture: "bg-blue-500",
    blank: "bg-amber-500",
  }

  // 연속 출석 보너스 계산
  const streakBonus = challenge.streak ? calculateStreakBonus(challenge.streak) : 0

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="overflow-hidden border-0 shadow-md">
        <div className="flex items-center">
          <div
            className={`${typeColors[challenge.type]} text-white p-4 flex items-center justify-center self-stretch rounded-l-lg`}
          >
            <div className="bg-white/20 p-2 rounded-full">
              <Calendar className="h-6 w-6" />
            </div>
          </div>

          <div className="flex-1 p-4">
            <div className="flex flex-col">
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-lg">{config.title}</h3>
                {challenge.completed ? (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">
                    완료
                  </span>
                ) : (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">
                    신규
                  </span>
                )}
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{config.description}</p>

              <div className="flex items-center mt-3 text-sm text-gray-500">
                <Gift className="h-4 w-4 mr-1" />
                <span className="font-medium">{challenge.reward} 포인트</span>

                {streakBonus > 0 && (
                  <span className="ml-2 flex items-center text-amber-600 dark:text-amber-400">
                    <Flame className="h-4 w-4 mr-1" />+{streakBonus} 보너스
                  </span>
                )}
              </div>

              {challenge.streak && challenge.streak > 1 && (
                <div className="flex items-center mt-2 text-sm text-gray-500">
                  <Award className="h-4 w-4 mr-1" />
                  <span>{challenge.streak}일 연속 출석 중!</span>
                </div>
              )}

              <Link href={`/quiz/${challenge.type}?mode=challenge`} className="mt-3 w-full">
                <Button
                  className={`w-full ${typeColors[challenge.type]} hover:opacity-90 text-white border-0`}
                  size="sm"
                  disabled={challenge.completed}
                >
                  {challenge.completed ? "완료됨" : "도전하기"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

