import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Check, Music, Image, Square } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { QuizType } from "@/types"
import { QUIZ_CONFIG } from "@/constants"

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

// 퀴즈 카드 설정
const quizCards: Array<{
  type: QuizType
  icon: React.ReactNode
  color: string
  variant: "default" | "featured" | "new"
}> = [
  {
    type: "ox",
    icon: <Check className="h-5 w-5" />,
    color: "bg-gradient-to-r from-green-500 to-green-600",
    variant: "default",
  },
  {
    type: "initial-sound",
    icon: <Music className="h-5 w-5" />,
    color: "bg-gradient-to-r from-purple-500 to-purple-600",
    variant: "featured",
  },
  {
    type: "picture",
    icon: <Image className="h-5 w-5" />,
    color: "bg-gradient-to-r from-blue-500 to-blue-600",
    variant: "new",
  },
  {
    type: "blank",
    icon: <Square className="h-5 w-5" />,
    color: "bg-gradient-to-r from-amber-500 to-amber-600",
    variant: "default",
  },
]

export default function QuizCategories() {
  return (
    <Card className="border shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">퀴즈 선택</CardTitle>
      </CardHeader>
      <CardContent>
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 gap-3">
          {quizCards.map((card) => {
            const config = QUIZ_CONFIG[card.type]
            
            return (
              <motion.div key={card.type} variants={item} className="flex flex-col">
                <Link href={`/quiz/${card.type}`} className="h-full">
                  <div
                    className={`${card.color} rounded-lg p-4 text-white h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="bg-white/20 p-2 rounded-full">{card.icon}</div>
                      {card.variant === "featured" && (
                        <Badge variant="outline" className="bg-white/20 border-0 text-white text-xs">
                          인기
                        </Badge>
                      )}
                      {card.variant === "new" && (
                        <Badge variant="outline" className="bg-white/20 border-0 text-white text-xs">
                          신규
                        </Badge>
                      )}
                    </div>
                    <div className="mt-3">
                      <h3 className="font-bold text-base">{config.title}</h3>
                      <p className="text-xs text-white/75 mt-1">{config.questionCount}문제</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </CardContent>
    </Card>
  )
} 