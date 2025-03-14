"use client"

import { useState, useCallback, memo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X, ArrowLeft, ArrowRight, Share2 } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"
import { useChallenge } from "@/contexts/challenge-context"
import { OX_QUIZ_DATA } from "@/constants/quiz/ox-quiz"

// 동적으로 Confetti 컴포넌트 불러오기 (필요할 때만 로드)
const Confetti = dynamic(() => import("@/components/confetti"), {
  ssr: false,
  loading: () => null,
})

// O/X 퀴즈 데이터 (10개로 확장)
const quizData = OX_QUIZ_DATA

// 메모이제이션된 퀴즈 문제 컴포넌트
const QuizQuestion = memo(({ question }: { question: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="text-lg font-medium text-center mb-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 w-full"
  >
    "{question}"
  </motion.div>
))

QuizQuestion.displayName = "QuizQuestion"

// 메모이제이션된 설명 컴포넌트
const ExplanationBox = memo(
  ({ isCorrect, explanation, correctOption }: { isCorrect: boolean; explanation: string; correctOption?: string }) => (
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
      {correctOption && (
        <p>
          정답: <strong>{correctOption}</strong>
        </p>
      )}
      <p className={correctOption ? "mt-2" : ""}>{explanation}</p>
    </motion.div>
  ),
)

ExplanationBox.displayName = "ExplanationBox"

export default function OXQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const isChallengeMode = searchParams.get("mode") === "challenge"
  const { dailyChallenge, completeChallenge } = useChallenge()

  // 도전 과제 모드인 경우 문제 수 제한
  const challengeQuestionCount = dailyChallenge?.type === "ox" ? dailyChallenge.questionCount : 5
  const activeQuizData = isChallengeMode ? quizData.slice(0, challengeQuestionCount) : quizData

  const handleAnswer = useCallback(
    (answer: boolean) => {
      setSelectedAnswer(answer)
      setShowExplanation(true)

      const isCorrect = answer === (quizData[currentQuestion].answer === "true")

      if (isCorrect) {
        setScore((prev) => prev + 1)
        // 정답일 때 햅틱 피드백 (지원되는 기기에서)
        if (navigator.vibrate) {
          navigator.vibrate(100)
        }
      }
    },
    [currentQuestion],
  )

  const handleNextQuestion = useCallback(() => {
    setSelectedAnswer(null)
    setShowExplanation(false)
    setCurrentQuestion((prev) => prev + 1)
  }, [])

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: "속담 퀴즈 결과",
        text: `속담 O/X 퀴즈에서 ${score}/${activeQuizData.length} 점수를 획득했어요! 도전해보세요!`,
        url: window.location.href,
      })
    } else {
      toast({
        title: "공유하기",
        description: "점수가 클립보드에 복사되었습니다.",
      })
    }
  }, [score, toast, activeQuizData.length])

  const handleRestart = useCallback(() => {
    setCurrentQuestion(0)
    setScore(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setShowConfetti(false)
  }, [])

  const handleComplete = useCallback(() => {
    if (isChallengeMode && dailyChallenge?.type === "ox" && !dailyChallenge.completed) {
      // 도전 과제 완료 처리 및 보상 지급
      completeChallenge(dailyChallenge.reward)

      toast({
        title: "도전 과제 완료!",
        description: `${dailyChallenge.reward} 포인트를 획득했습니다!`,
      })
    }
  }, [isChallengeMode, dailyChallenge, completeChallenge, toast])

  // 퀴즈 완료 시 도전 과제 처리
  useEffect(() => {
    const isQuizFinished = currentQuestion >= activeQuizData.length - 1 && showExplanation

    if (isQuizFinished) {
      handleComplete()
    }
  }, [currentQuestion, showExplanation, activeQuizData.length, handleComplete])

  const progress = ((currentQuestion + 1) / activeQuizData.length) * 100

  const isQuizFinished = currentQuestion >= activeQuizData.length - 1 && showExplanation

  // 퀴즈 완료 시 Confetti 효과 표시
  if (isQuizFinished && !showConfetti && score > activeQuizData.length / 2) {
    setShowConfetti(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800">
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
          문제 {currentQuestion + 1} / {activeQuizData.length}
          {isChallengeMode && <span className="ml-2 text-blue-500">(도전 과제)</span>}
        </div>
        <div className="w-9"></div> {/* 균형을 위한 빈 공간 */}
      </header>

      <Progress value={progress} className="h-1" />

      <div className="p-4 max-w-md mx-auto">
        <Card className="mb-6 mt-4 shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-center text-xl">O/X 퀴즈</CardTitle>
            <CardDescription className="text-center">이 속담이 맞는지 틀린지 판단하세요</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <AnimatePresence mode="wait">
              <QuizQuestion key={currentQuestion} question={activeQuizData[currentQuestion].question} />
            </AnimatePresence>

            {!showExplanation ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center gap-4 w-full"
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => handleAnswer(true)}
                    className="h-20 w-20 rounded-full bg-green-500 hover:bg-green-600"
                  >
                    <Check className="h-10 w-10" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => handleAnswer(false)}
                    className="h-20 w-20 rounded-full bg-red-500 hover:bg-red-600"
                  >
                    <X className="h-10 w-10" />
                  </Button>
                </motion.div>
              </motion.div>
            ) : (
              <ExplanationBox
                isCorrect={selectedAnswer === (activeQuizData[currentQuestion].answer === "true")}
                explanation={activeQuizData[currentQuestion].explanation}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {showExplanation &&
              (isQuizFinished ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center w-full">
                  <div className="text-xl font-bold mb-4">
                    퀴즈 완료! 점수: {score}/{activeQuizData.length}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500">정답률</p>
                      <p className="text-xl font-bold">{Math.round((score / activeQuizData.length) * 100)}%</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-500">소요 시간</p>
                      <p className="text-xl font-bold">3분 24초</p>
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
                      <Button variant="outline" className="w-full" onClick={handleRestart}>
                        다시 풀기
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full">
                  <Button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 w-full bg-green-500 hover:bg-green-600"
                  >
                    다음 문제
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

