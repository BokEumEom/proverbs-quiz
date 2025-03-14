"use client"

import { AnimatePresence, motion } from "framer-motion"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PICTURE_QUIZ_DATA } from "@/constants/quiz/picture-quiz"
import ExplanationBox from "@/components/quiz/explanation-box"
import QuizHeader from "@/components/quiz/quiz-header"
import QuizOptions from "@/components/quiz/quiz-options"
import QuizFooter from "@/components/quiz/quiz-footer"
import { useQuiz } from "@/hooks/use-quiz"
import Image from "next/image"
import { memo } from "react"

// 동적으로 Confetti 컴포넌트 불러오기 (필요할 때만 로드)
const Confetti = dynamic(() => import("@/components/confetti"), {
  ssr: false,
  loading: () => null,
})

// 메모이제이션된 퀴즈 이미지 컴포넌트
const QuizImage = memo(({ imageUrl }: { imageUrl: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="border rounded-lg overflow-hidden shadow-sm w-full mb-8"
  >
    <Image src={imageUrl || "/placeholder.svg"} alt="속담 그림" width={250} height={250} className="w-full h-auto" />
  </motion.div>
))

QuizImage.displayName = "QuizImage"

export default function PictureQuiz() {
  const {
    currentQuestion,
    selectedAnswer,
    score,
    showExplanation,
    showConfetti,
    currentQuizData,
    progress,
    isQuizFinished,
    isCorrectAnswer,
    totalQuestions,
    handleSelectAnswer,
    handleAnswer,
    handleNextQuestion,
    handleRestart,
  } = useQuiz(PICTURE_QUIZ_DATA)

  // 그림 퀴즈 테마 색상
  const themeColor = {
    bg: "bg-blue-500 hover:bg-blue-600",
    option: "bg-blue-100 dark:bg-blue-900/30 border-blue-500"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* Confetti 효과 */}
      {showConfetti && <Confetti />}

      {/* 퀴즈 헤더 */}
      <QuizHeader 
        currentQuestion={currentQuestion} 
        totalQuestions={totalQuestions} 
        progress={progress} 
      />

      <div className="p-4 max-w-md mx-auto">
        <Card className="mb-6 mt-4 shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-xl">그림 연상 퀴즈</CardTitle>
            <CardDescription className="text-center">그림을 보고 알맞은 속담을 맞춰보세요</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-full flex justify-center">
              <AnimatePresence mode="wait">
                <QuizImage key={currentQuestion} imageUrl={currentQuizData.imageUrl || "/placeholder.svg"} />
              </AnimatePresence>
            </div>

            <QuizOptions
              options={currentQuizData.options}
              selectedAnswer={selectedAnswer}
              showExplanation={showExplanation}
              onSelectAnswer={handleSelectAnswer}
              themeColor={themeColor.option}
            />

            {showExplanation && (
              <ExplanationBox
                isCorrect={isCorrectAnswer}
                explanation={currentQuizData.explanation}
                correctOption={currentQuizData.answer}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            <QuizFooter
              showExplanation={showExplanation}
              isQuizFinished={isQuizFinished}
              selectedAnswer={selectedAnswer}
              score={score}
              totalQuestions={totalQuestions}
              onAnswer={handleAnswer}
              onNextQuestion={handleNextQuestion}
              onRestart={handleRestart}
              themeColor={themeColor.bg}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

