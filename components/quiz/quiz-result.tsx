import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface QuizResultProps {
  score: number
  totalQuestions: number
  onRestart: () => void
  quizType: string
  timeSpent?: string
}

export default function QuizResult({
  score,
  totalQuestions,
  onRestart,
  quizType,
  timeSpent = "계산 중...",
}: QuizResultProps) {
  const { toast } = useToast()

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "속담 퀴즈 결과",
          text: `${quizType} 퀴즈에서 ${score}/${totalQuestions} 점수를 획득했어요! 도전해보세요!`,
          url: window.location.href,
        })
        .catch((err) => {
          console.error("공유하기 실패:", err)
        })
    } else {
      // 클립보드에 복사
      const shareText = `${quizType} 퀴즈에서 ${score}/${totalQuestions} 점수를 획득했어요! 도전해보세요!`
      navigator.clipboard.writeText(shareText).then(() => {
        toast({
          title: "공유하기",
          description: "점수가 클립보드에 복사되었습니다.",
        })
      })
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center w-full">
      <div className="text-xl font-bold mb-4">
        퀴즈 완료! 점수: {score}/{totalQuestions}
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-500">정답률</p>
          <p className="text-xl font-bold">{Math.round((score / totalQuestions) * 100)}%</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-500">소요 시간</p>
          <p className="text-xl font-bold">{timeSpent}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Button onClick={handleShare} className="w-full flex items-center justify-center gap-2">
          <Share2 className="h-4 w-4" />
          결과 공유하기
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/" className="w-full">
            <Button variant="outline" className="w-full">
              홈으로
            </Button>
          </Link>
          <Button variant="outline" className="w-full" onClick={onRestart}>
            다시 풀기
          </Button>
        </div>
      </div>
    </motion.div>
  )
} 