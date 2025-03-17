import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Check, Music, Image, Square, Clock, ArrowRight } from "lucide-react"
import { QuizType } from "@/types"
import { QUIZ_CONFIG } from "@/constants"
import { Badge } from "@/components/ui/badge"

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
      return <Check className="h-4 w-4 text-white" />
    case "initial-sound":
      return <Music className="h-4 w-4 text-white" />
    case "picture":
      return <Image className="h-4 w-4 text-white" />
    case "blank":
      return <Square className="h-4 w-4 text-white" />
  }
}

const getQuizColor = (type: QuizType) => {
  switch (type) {
    case "ox":
      return "bg-green-500"
    case "initial-sound":
      return "bg-purple-500"
    case "picture":
      return "bg-blue-500"
    case "blank":
      return "bg-amber-500"
  }
}

interface RecentActivitiesProps {
  activities?: QuizActivity[]
  isLoading?: boolean
}

export default function RecentActivities({ 
  activities = [], 
  isLoading = false,
  limit = 2,
  showAllButton = true
}: RecentActivitiesProps & { limit?: number, showAllButton?: boolean }) {
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

  // 표시할 활동 제한
  const displayActivities = (activities.length > 0 ? activities : sampleActivities).slice(0, limit)

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <Clock className="h-5 w-5 text-gray-400 mr-2" />
          최근 활동
        </CardTitle>
        {showAllButton && (
          <Button variant="ghost" size="sm" className="text-xs flex items-center">
            모두 보기 <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <AnimatePresence>
          <div className="space-y-4">
            {displayActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: isLoading ? 0.5 : 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ backgroundColor: "rgba(0, 0, 0, 0.02)" }}
                className={`flex items-center justify-between p-3 rounded-lg ${
                  isLoading ? "animate-pulse" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${getQuizColor(activity.type)}`}>
                    {getQuizIcon(activity.type)}
                  </div>
                  <div>
                    <p className="font-medium">{QUIZ_CONFIG[activity.type].title}</p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {getTimeAgo(activity.completedAt)}
                      <span className="mx-1">•</span>
                      {activity.timeSpent}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    className={`${
                      activity.score / activity.totalQuestions >= 0.7 
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                        : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                    }`}
                  >
                    {activity.score}/{activity.totalQuestions}
                  </Badge>
                </div>
              </motion.div>
            ))}

            {showAllButton && (
              <Button className="w-full" variant="outline" size="sm" asChild>
                <Link href="/history">모든 기록 보기</Link>
              </Button>
            )}
          </div>
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}