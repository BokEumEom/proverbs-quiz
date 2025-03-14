import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { Check, Music, Image, Square } from "lucide-react"
import { QuizType } from "@/types"
import { QUIZ_CONFIG } from "@/constants"

interface QuizActivity {
  id: string
  type: QuizType
  score: number
  totalQuestions: number
  completedAt: string
  timeSpent: string
}

const getTimeAgo = (dateString: string): string => {
  const now = new Date()
  const pastDate = new Date(dateString)
  const diffMs = now.getTime() - pastDate.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMinutes < 60) return `${diffMinutes}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  if (diffDays < 7) return `${diffDays}일 전`
  return pastDate.toLocaleDateString()
}

const getQuizIcon = (type: QuizType) => {
  switch (type) {
    case "ox":
      return <Check className="h-4 w-4 text-green-500" />
    case "initial-sound":
      return <Music className="h-4 w-4 text-purple-500" />
    case "picture":
      return <Image className="h-4 w-4 text-blue-500" />
    case "blank":
      return <Square className="h-4 w-4 text-amber-500" />
  }
}

interface RecentActivitiesProps {
  activities?: QuizActivity[]
  isLoading?: boolean
}

export default function RecentActivities({ 
  activities = [], 
  isLoading = false 
}: RecentActivitiesProps) {
  // 로딩 중이거나 데이터가 없는 경우 스켈레톤 샘플 데이터를 사용
  const sampleActivities: QuizActivity[] = [
    {
      id: "1",
      type: "ox",
      score: 8,
      totalQuestions: 10,
      completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2시간 전
      timeSpent: "3분 24초",
    },
    {
      id: "2",
      type: "initial-sound",
      score: 7,
      totalQuestions: 10,
      completedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 어제
      timeSpent: "5분 12초",
    },
  ]

  const displayActivities = activities.length > 0 ? activities : sampleActivities

  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">최근 활동</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isLoading ? 0.5 : 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center justify-between pb-3 ${
                index < displayActivities.length - 1 ? "border-b" : ""
              } ${isLoading ? "animate-pulse" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                  {getQuizIcon(activity.type)}
                </div>
                <div>
                  <p className="font-medium">{QUIZ_CONFIG[activity.type].title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{getTimeAgo(activity.completedAt)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${activity.score / activity.totalQuestions >= 0.7 ? "text-green-500" : "text-amber-500"}`}>
                  {activity.score}/{activity.totalQuestions}
                </p>
                <p className="text-xs text-gray-500">점수</p>
              </div>
            </motion.div>
          ))}

          <Button className="w-full" variant="outline" size="sm" asChild>
            <Link href="/history">모든 기록 보기</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 