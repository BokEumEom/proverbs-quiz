import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Flame, BookOpen, MessageSquare, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"

interface AchievementCardProps {
  totalQuizzes: number
  streak: number
  learntProverbs: number
  points: number
}

export default function AchievementCard({
  totalQuizzes,
  streak,
  learntProverbs,
  points,
}: AchievementCardProps) {
  const achievements = [
    {
      title: "퀴즈 참여",
      value: totalQuizzes,
      icon: <BookOpen className="h-4 w-4 text-emerald-500" />,
      color: "bg-emerald-100 dark:bg-emerald-900/30",
      change: "+5",
      isPositive: true
    },
    {
      title: "연속 출석",
      value: streak,
      icon: <Flame className="h-4 w-4 text-amber-500" />,
      color: "bg-amber-100 dark:bg-amber-900/30",
      change: "+1",
      isPositive: true
    },
    {
      title: "배운 속담",
      value: learntProverbs,
      icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
      color: "bg-blue-100 dark:bg-blue-900/30",
      change: "+3",
      isPositive: true
    },
    {
      title: "총 포인트",
      value: points,
      icon: <Award className="h-4 w-4 text-purple-500" />,
      color: "bg-purple-100 dark:bg-purple-900/30",
      change: "+15",
      isPositive: true
    },
  ]

  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <CardTitle className="text-lg">나의 성취</CardTitle>
        <p className="text-sm text-purple-100">꾸준히 학습하고 있어요!</p>
      </CardHeader>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`${achievement.color} p-3 rounded-lg`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.title}</p>
                  <p className="text-xl font-bold">{achievement.value}</p>
                </div>
                <div className="bg-white dark:bg-gray-700 p-1.5 rounded-full">
                  {achievement.icon}
                </div>
              </div>
              {achievement.change && (
                <div className="text-xs text-green-500 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" />
                  {achievement.change} 증가
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}