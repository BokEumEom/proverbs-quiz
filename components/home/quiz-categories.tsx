import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Check, Music, Image, Square, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { QuizType } from "@/types"
import { QUIZ_CONFIG } from "@/constants"
import { Button } from "@/components/ui/button"

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
  gradient: string
  variant: "default" | "featured" | "new"
}> = [
  {
    type: "ox",
    icon: <Check className="h-5 w-5" />,
    color: "bg-green-500",
    gradient: "from-green-500 to-emerald-600",
    variant: "default",
  },
  {
    type: "initial-sound",
    icon: <Music className="h-5 w-5" />,
    color: "bg-purple-500",
    gradient: "from-purple-500 to-indigo-600",
    variant: "featured",
  },
  {
    type: "picture",
    icon: <Image className="h-5 w-5" />,
    color: "bg-blue-500",
    gradient: "from-blue-500 to-cyan-600",
    variant: "new",
  },
  {
    type: "blank",
    icon: <Square className="h-5 w-5" />,
    color: "bg-amber-500",
    gradient: "from-amber-500 to-orange-600",
    variant: "default",
  },
]

export default function QuizCategories() {
  return (
    <Card className="border-0 shadow-sm overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg flex items-center">
          <div className="mr-2 w-1 h-6 bg-blue-500 rounded-full"></div>
          퀴즈 선택
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-xs flex items-center">
          모두 보기 <ArrowRight className="ml-1 h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent>
        <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 gap-3">
          {quizCards.map((card) => {
            const config = QUIZ_CONFIG[card.type]
            
            return (
              <motion.div 
                key={card.type} 
                variants={item} 
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link href={`/quiz/${card.type}`} className="h-full block">
                  <div
                    className={`bg-gradient-to-r ${card.gradient} rounded-lg p-4 text-white h-full flex flex-col justify-between shadow-sm hover:shadow-md transition-all`}
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
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-white/75">{config.questionCount}문제</p>
                        <div className="bg-white/20 rounded-full px-2 py-0.5 text-xs">
                          시작하기
                        </div>
                      </div>
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