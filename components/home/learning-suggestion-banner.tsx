"use client"

import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { pageAnimations } from "@/constants/animations"

interface LearningBannerProps {
  remainingProverbs: number
}

export default function LearningBanner({ remainingProverbs }: LearningBannerProps) {
  return (
    <motion.section variants={pageAnimations.item}>
      <Card className="overflow-hidden border-0 shadow-sm">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-full">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold">오늘의 학습 제안</h3>
              <p className="text-sm text-blue-100">플래시카드로 새로운 속담을 배워보세요!</p>
            </div>
          </div>
        </div>
        <CardContent className="p-3 flex justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            아직 학습하지 않은 속담이 {remainingProverbs}개 남아있습니다
          </p>
          <Button size="sm" className="whitespace-nowrap" asChild>
            <a href="/learn/flashcards">학습하기</a>
          </Button>
        </CardContent>
      </Card>
    </motion.section>
  )
} 