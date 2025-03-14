import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award, Flame, BookOpen, MessageSquare } from "lucide-react"
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
    },
    {
      title: "연속 출석",
      value: streak,
      icon: <Flame className="h-4 w-4 text-amber-500" />,
      color: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      title: "배운 속담",
      value: learntProverbs,
      icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
      color: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "총 포인트",
      value: points,
      icon: <Award className="h-4 w-4 text-purple-500" />,
      color: "bg-purple-100 dark:bg-purple-900/30",
    },
  ]

  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">나의 성취</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`${achievement.color} p-3 rounded-lg flex flex-col items-center justify-center`}
            >
              <div className="flex items-center gap-1.5 text-sm font-medium">
                {achievement.icon}
                <span>{achievement.title}</span>
              </div>
              <p className="text-xl font-bold mt-1">{achievement.value}</p>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 