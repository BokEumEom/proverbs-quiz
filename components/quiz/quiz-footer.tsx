import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface QuizFooterProps {
  showExplanation: boolean
  isQuizFinished: boolean
  selectedAnswer: number | null
  score: number
  totalQuestions: number
  onAnswer: () => void
  onNextQuestion: () => void
  onRestart: () => void
  themeColor?: string
}

export default function QuizFooter({
  showExplanation,
  isQuizFinished,
  selectedAnswer,
  score,
  totalQuestions,
  onAnswer,
  onNextQuestion,
  onRestart,
  themeColor = "bg-purple-500 hover:bg-purple-600"
}: QuizFooterProps) {
  if (!showExplanation) {
    return (
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={onAnswer}
          disabled={selectedAnswer === null}
          className={`${themeColor} w-full`}
        >
          정답 확인하기
        </Button>
      </motion.div>
    )
  }

  if (isQuizFinished) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center w-full">
        <div className="text-xl font-bold mb-4">
          퀴즈 완료! 점수: {score}/{totalQuestions}
        </div>
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
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
      <Button
        onClick={onNextQuestion}
        className={`flex items-center gap-2 ${themeColor} w-full`}
      >
        다음 문제
        <ArrowRight className="h-4 w-4" />
      </Button>
    </motion.div>
  )
} 