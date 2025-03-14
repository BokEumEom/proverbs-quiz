import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { QuizType } from "@/types"
import { QUIZ_CONFIG } from "@/constants"

interface QuizLayoutProps {
  type: QuizType
  currentQuestion: number
  totalQuestions: number
  children: React.ReactNode
  footerContent: React.ReactNode
  backgroundColorClass?: string
  isChallengeMode?: boolean
}

export default function QuizLayout({
  type,
  currentQuestion,
  totalQuestions,
  children,
  footerContent,
  backgroundColorClass = "bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800",
  isChallengeMode = false,
}: QuizLayoutProps) {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100
  const config = QUIZ_CONFIG[type]

  return (
    <div className={`min-h-screen ${backgroundColorClass}`}>
      {/* 모바일 최적화 헤더 */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm p-4 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">홈으로 돌아가기</span>
          </Button>
        </Link>
        <div className="text-sm font-medium">
          문제 {currentQuestion + 1} / {totalQuestions}
          {isChallengeMode && <span className="ml-2 text-blue-500">(도전 과제)</span>}
        </div>
        <div className="w-9"></div> {/* 균형을 위한 빈 공간 */}
      </header>

      <Progress value={progress} className="h-1" />

      <div className="p-4 max-w-md mx-auto">
        <Card className="mb-6 mt-4 shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-xl">{config.title}</CardTitle>
            <CardDescription className="text-center">{config.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {children}
          </CardContent>
          <CardFooter className="flex justify-center">
            {footerContent}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 