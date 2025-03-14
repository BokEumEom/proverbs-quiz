"use client"

import { AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BLANK_QUIZ_DATA } from "@/constants/quiz/blank-quiz"
import ExplanationBox from "@/components/quiz/explanation-box"
import QuizHeader from "@/components/quiz/quiz-header"
import QuizOptions from "@/components/quiz/quiz-options"
import QuizFooter from "@/components/quiz/quiz-footer"
import BlankQuizQuestion from "@/components/quiz/blank-quiz-question"
import { useQuiz } from "@/hooks/use-quiz"

// 동적으로 Confetti 컴포넌트 불러오기 (필요할 때만 로드)
const Confetti = dynamic(() => import("@/components/confetti"), {
  ssr: false,
  loading: () => null,
})

export default function BlankQuiz() {
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
  } = useQuiz(BLANK_QUIZ_DATA)

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
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
            <CardTitle className="text-center text-xl">빈칸 채우기 퀴즈</CardTitle>
            <CardDescription className="text-center">속담의 빈칸에 들어갈 알맞은 말을 고르세요</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <AnimatePresence mode="wait">
              <BlankQuizQuestion 
                key={currentQuestion} 
                question={currentQuizData.question} 
                answer={currentQuizData.answer}
                showAnswer={showExplanation && isCorrectAnswer}
                iconColor="text-amber-500"
              />
            </AnimatePresence>

            <QuizOptions
              options={currentQuizData.options}
              selectedAnswer={selectedAnswer}
              showExplanation={showExplanation}
              onSelectAnswer={handleSelectAnswer}
              themeColor="bg-amber-100 dark:bg-amber-900/30 border-amber-500"
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
              themeColor="bg-amber-500 hover:bg-amber-600"
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

