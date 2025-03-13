"use client"

import { useState, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"

// 동적으로 Confetti 컴포넌트 불러오기 (필요할 때만 로드)
const Confetti = dynamic(() => import("@/components/confetti"), {
  ssr: false,
  loading: () => null,
})

// 빈칸 채우기 퀴즈 데이터 (10개로 확장)
const quizData = [
  {
    id: 1,
    proverb: "소 잃고 _____ 고친다.",
    options: ["외양간", "마구간", "헛간", "우리"],
    correctAnswer: 0,
    explanation:
      "완전한 속담은 '소 잃고 외양간 고친다'입니다. 일이 잘못된 뒤에야 후회하고 대책을 세우는 것을 의미합니다.",
  },
  {
    id: 2,
    proverb: "가는 말이 고와야 _____ 말이 곱다.",
    options: ["듣는", "오는", "받는", "전하는"],
    correctAnswer: 1,
    explanation:
      "완전한 속담은 '가는 말이 고와야 오는 말이 곱다'입니다. 상대방에게 좋게 대하면 자신도 좋은 대접을 받는다는 의미입니다.",
  },
  {
    id: 3,
    proverb: "낮말은 _____ 듣고 밤말은 쥐가 듣는다.",
    options: ["바람이", "귀신이", "새가", "벽이"],
    correctAnswer: 2,
    explanation:
      "완전한 속담은 '낮말은 새가 듣고 밤말은 쥐가 듣는다'입니다. 아무리 비밀스럽게 말해도 언젠가는 새어나간다는 의미입니다.",
  },
  {
    id: 4,
    proverb: "_____ 배부르랴.",
    options: ["한 그릇에", "한 숟가락에", "한 끼에", "첫술에"],
    correctAnswer: 3,
    explanation: "완전한 속담은 '첫술에 배부르랴'입니다. 일을 시작한 초기에 큰 성과를 기대하기는 어렵다는 의미입니다.",
  },
  {
    id: 5,
    proverb: "원숭이도 _____ 떨어진다.",
    options: ["높은 곳에서", "나무에서", "바위에서", "가지에서"],
    correctAnswer: 1,
    explanation: "완전한 속담은 '원숭이도 나무에서 떨어진다'입니다. 아무리 능숙한 사람도 실수할 수 있다는 의미입니다.",
  },
  {
    id: 6,
    proverb: "_____ 말이 천 리 간다.",
    options: ["발 없는", "날개 없는", "입 없는", "꼬리 없는"],
    correctAnswer: 0,
    explanation: "완전한 속담은 '발 없는 말이 천 리 간다'입니다. 소문은 빠르게 퍼진다는 의미입니다.",
  },
  {
    id: 7,
    proverb: "고래 싸움에 _____ 터진다.",
    options: ["물고기 등", "새우 등", "게 등", "조개 등"],
    correctAnswer: 1,
    explanation:
      "완전한 속담은 '고래 싸움에 새우 등 터진다'입니다. 강한 자들의 다툼에 약한 자가 피해를 입는다는 의미입니다.",
  },
  {
    id: 8,
    proverb: "세 살 버릇 _____ 간다.",
    options: ["여든까지", "평생", "죽을 때까지", "늙어서도"],
    correctAnswer: 0,
    explanation: "완전한 속담은 '세 살 버릇 여든까지 간다'입니다. 어릴 때 들인 습관이 평생 간다는 의미입니다.",
  },
  {
    id: 9,
    proverb: "믿는 _____ 발등 찍힌다.",
    options: ["친구에게", "도끼에", "사람에게", "형제에게"],
    correctAnswer: 1,
    explanation: "완전한 속담은 '믿는 도끼에 발등 찍힌다'입니다. 가장 믿었던 사람에게 배신당한다는 의미입니다.",
  },
  {
    id: 10,
    proverb: "개구리 _____ 적 생각 못한다.",
    options: ["올챙이", "알", "새끼", "어린"],
    correctAnswer: 0,
    explanation: "완전한 속담은 '개구리 올챙이 적 생각 못한다'입니다. 자신의 과거를 잊고 남을 무시한다는 의미입니다.",
  },
]

// 메모이제이션된 퀴즈 문제 컴포넌트
const QuizQuestion = memo(({ proverb }: { proverb: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="text-lg font-medium text-center mb-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 w-full"
  >
    "{proverb}"
  </motion.div>
))

QuizQuestion.displayName = "QuizQuestion"

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

export default function BlankQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  const handleAnswer = useCallback(() => {
    if (selectedAnswer === null) return

    setShowExplanation(true)

    const isCorrect = selectedAnswer === quizData[currentQuestion].correctAnswer

    if (isCorrect) {
      setScore((prev) => prev + 1)
      // 정답일 때 햅틱 피드백 (지원되는 기기에서)
      if (navigator.vibrate) {
        navigator.vibrate(100)
      }
    }
  }, [currentQuestion, selectedAnswer])

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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 dark:from-gray-900 dark:to-gray-800">
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
            <CardTitle className="text-center text-xl">빈칸 채우기 퀴즈</CardTitle>
            <CardDescription className="text-center">속담의 빈칸에 들어갈 알맞은 말을 고르세요</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <AnimatePresence mode="wait">
              <QuizQuestion key={currentQuestion} proverb={quizData[currentQuestion].proverb} />
            </AnimatePresence>

            <RadioGroup
              value={selectedAnswer?.toString()}
              onValueChange={(value) => !showExplanation && setSelectedAnswer(Number.parseInt(value))}
              className="w-full space-y-3"
            >
              <AnimatePresence>
                {quizData[currentQuestion].options.map((option, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors ${
                      selectedAnswer === index ? "bg-amber-100 dark:bg-amber-900/30 border-amber-500" : ""
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
                isCorrect={selectedAnswer === quizData[currentQuestion].correctAnswer}
                explanation={quizData[currentQuestion].explanation}
                correctOption={quizData[currentQuestion].options[quizData[currentQuestion].correctAnswer]}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-center">
            {!showExplanation ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={handleAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-amber-500 hover:bg-amber-600 w-full"
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
                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 w-full"
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

