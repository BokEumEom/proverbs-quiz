"use client"

import { useState, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { PICTURE_QUIZ_DATA } from "@/constants/quiz/picture-quiz"

// 동적으로 Confetti 컴포넌트 불러오기 (필요할 때만 로드)
const Confetti = dynamic(() => import("@/components/confetti"), {
  ssr: false,
  loading: () => null,
})

// 그림 연상 퀴즈 데이터 (10개로 확장)
const quizData = PICTURE_QUIZ_DATA

// 메모이제이션된 퀴즈 이미지 컴포넌트
const QuizImage = memo(({ imageUrl }: { imageUrl: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="border rounded-lg overflow-hidden shadow-sm w-full"
  >
    <Image src={imageUrl || "/placeholder.svg"} alt="속담 그림" width={250} height={250} className="w-full h-auto" />
  </motion.div>
))

QuizImage.displayName = "QuizImage"

// 메모이제이션된 설명 컴포넌트
const ExplanationBox = memo(
  ({ isCorrect, explanation, correctOption }: { isCorrect: boolean; explanation: string; correctOption: string }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border"
    >
      <div
        className={`text-lg font-medium mb-2 ${isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
      >
        {isCorrect ? "정답입니다!" : "오답입니다!"}
      </div>
      <p>
        정답: <strong>{correctOption}</strong>
      </p>
      <p className="mt-2">{explanation}</p>
    </motion.div>
  ),
)

ExplanationBox.displayName = "ExplanationBox"

export default function PictureQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleAnswer = useCallback(() => {
    if (selectedAnswer === null) return

    setShowExplanation(true)

    // 선택한 답변의 텍스트와 정답이 일치하는지 확인
    const isCorrect = quizData[currentQuestion].options?.[selectedAnswer] === quizData[currentQuestion].answer

    if (isCorrect) {
      setScore((prev) => prev + 1)
      // 정답일 때 햅틱 피드백 (지원되는 기기에서)
      if (navigator.vibrate) {
        navigator.vibrate(100)
      }
    }
  }, [currentQuestion, selectedAnswer, quizData])

  const handleNextQuestion = useCallback(() => {
    setSelectedAnswer(null)
    setShowExplanation(false)
    setCurrentQuestion((prev) => prev + 1)
  }, [])

  const handleRestart = useCallback(() => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setShowConfetti(false)
  }, [])

  const progress = ((currentQuestion + 1) / quizData.length) * 100

  const isQuizFinished = currentQuestion >= quizData.length - 1 && showExplanation

  // 퀴즈 완료 시 Confetti 효과 표시
  if (isQuizFinished && !showConfetti && score > quizData.length / 2) {
    setShowConfetti(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      {/* Confetti 효과 */}
      {showConfetti && <Confetti />}

      {/* 모바일 최적화 헤더 */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm p-4 flex items-center justify-between">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">홈으로 돌아가기</span>
          </Button>
        </Link>
        <div className="text-sm font-medium">
          문제 {currentQuestion + 1} / {quizData.length}
        </div>
        <div className="w-9"></div> {/* 균형을 위한 빈 공간 */}
      </header>

      <Progress value={progress} className="h-1" />

      <div className="p-4 max-w-md mx-auto">
        <Card className="mb-6 mt-4 shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-xl">그림 연상 퀴즈</CardTitle>
            <CardDescription className="text-center">그림을 보고 알맞은 속담을 맞춰보세요</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="w-full flex justify-center mb-6">
              <AnimatePresence mode="wait">
                <QuizImage key={currentQuestion} imageUrl={quizData[currentQuestion].imageUrl || "/placeholder.svg"} />
              </AnimatePresence>
            </div>

            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => !showExplanation && setSelectedAnswer(Number.parseInt(value))}
              className="w-full space-y-3"
            >
              <AnimatePresence>
                {quizData[currentQuestion].options?.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors ${
                      selectedAnswer === index ? "bg-blue-100 dark:bg-blue-900/30 border-blue-500" : ""
                    }`}
                    onClick={() => !showExplanation && setSelectedAnswer(index)}
                  >
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} className="sr-only" />
                    <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
                      {option}
                    </Label>
                  </motion.div>
                ))}
              </AnimatePresence>
            </RadioGroup>

            {showExplanation && (
              <ExplanationBox
                isCorrect={quizData[currentQuestion].options?.[selectedAnswer as number] === quizData[currentQuestion].answer}
                explanation={quizData[currentQuestion].explanation}
                correctOption={quizData[currentQuestion].answer}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {!showExplanation ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-blue-500 hover:bg-blue-600 w-full"
                >
                  정답 확인하기
                </Button>
              </motion.div>
            ) : isQuizFinished ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center w-full">
                <div className="text-xl font-bold mb-4">
                  퀴즈 완료! 점수: {score}/{quizData.length}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/" className="w-full">
                    <Button variant="outline" className="w-full">
                      홈으로
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full" onClick={handleRestart}>
                    다시 풀기
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                <Button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 w-full"
                >
                  다음 문제
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

