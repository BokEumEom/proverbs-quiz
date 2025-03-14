"use client"

import { AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { INITIAL_SOUND_QUIZ_DATA } from "@/constants/quiz/initial-sound-quiz"
import QuizQuestion from "@/components/quiz/quiz-question"
import ExplanationBox from "@/components/quiz/explanation-box"
import QuizHeader from "@/components/quiz/quiz-header"
import QuizOptions from "@/components/quiz/quiz-options"
import QuizFooter from "@/components/quiz/quiz-footer"
import { useQuiz } from "@/hooks/use-quiz"

// 동적으로 Confetti 컴포넌트 불러오기 (필요할 때만 로드)
const Confetti = dynamic(() => import("@/components/confetti"), {
  ssr: false,
  loading: () => null,
})

export default function InitialSoundQuiz() {
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
  } = useQuiz(INITIAL_SOUND_QUIZ_DATA)

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
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
            <CardTitle className="text-center text-xl">초성 퀴즈</CardTitle>
            <CardDescription className="text-center">초성을 보고 빈칸에 들어갈 단어를 맞춰보세요</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <AnimatePresence mode="wait">
              <QuizQuestion key={currentQuestion} question={currentQuizData.question} />
            </AnimatePresence>

            <QuizOptions
              options={currentQuizData.options}
              selectedAnswer={selectedAnswer}
              showExplanation={showExplanation}
              onSelectAnswer={handleSelectAnswer}
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
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

