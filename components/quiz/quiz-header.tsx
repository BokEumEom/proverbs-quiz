import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface QuizHeaderProps {
  currentQuestion: number
  totalQuestions: number
  progress: number
}

export default function QuizHeader({ currentQuestion, totalQuestions, progress }: QuizHeaderProps) {
  return (
    <>
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm p-4 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">홈으로 돌아가기</span>
          </Button>
        </Link>
        <div className="text-sm font-medium">
          문제 {currentQuestion + 1} / {totalQuestions}
        </div>
        <div className="w-9"></div> {/* 균형을 위한 빈 공간 */}
      </header>
      <Progress value={progress} className="h-1" />
    </>
  )
} 