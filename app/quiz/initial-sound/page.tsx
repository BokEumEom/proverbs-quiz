"use client"

import { useState, useCallback, memo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Music } from "lucide-react"
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

// 초성 퀴즈 데이터 (10개로 확장)
const quizData = [
  {
    id: 1,
    initialSounds: "ㅅ ㅇㄱ ㅇㅇㄱ ㄱㄴㄷ",
    options: [
      "소 잃고 외양간 고친다",
      "세 살 버릇 여든까지 간다",
      "소문난 잔치에 먹을 것 없다",
      "서당 개 삼 년에 풍월을 읊는다",
    ],
    correctAnswer: 0,
    explanation:
      "이 초성은 '소 잃고 외양간 고친다'를 나타냅니다. 일이 잘못된 뒤에야 후회하고 대책을 세우는 것을 의미합니다.",
  },
  {
    id: 2,
    initialSounds: "ㄱㄴ ㅁㅇ ㄱㅇㅈ ㅇㄴ ㅁㅇ ㄱㄷ",
    options: [
      "가는 말이 고와야 오는 말이 곱다",
      "가랑비에 옷 젖는 줄 모른다",
      "가는 날이 장날이라 한다",
      "가루는 칠수록 고와지고 말은 할수록 거칠어진다",
    ],
    correctAnswer: 0,
    explanation:
      "이 초성은 '가는 말이 고와야 오는 말이 곱다'를 나타냅니다. 상대방에게 좋게 대하면 자신도 좋은 대접을 받는다는 의미입니다.",
  },
  {
    id: 3,
    initialSounds: "ㄴㅁㅇ ㅅㄱ ㄷㄱ ㅂㅁㅇ ㅈㄱ ㄷㄴㄷ",
    options: [
      "낮말은 새가 듣고 밤말은 쥐가 듣는다",
      "남의 떡이 더 커 보인다",
      "남의 말이 현담이요 내 말이 곡담이라",
      "남에게 대접 받고자 하는 대로 남을 대접하라",
    ],
    correctAnswer: 0,
    explanation:
      "이 초성은 '낮말은 새가 듣고 밤말은 쥐가 듣는다'를 나타냅니다. 아무리 비밀스럽게 말해도 언젠가는 새어나간다는 의미입니다.",
  },
  {
    id: 4,
    initialSounds: "ㅊㅅㅇ ㅂㅇ ㄴㄱㄷ",
    options: [
      "천 리 길도 한 걸음부터",
      "친구 따라 강남 간다",
      "첫술에 배부르랴",
      "천 년의 기도보다 한 번의 행동이 낫다",
    ],
    correctAnswer: 2,
    explanation:
      "이 초성은 '첫술에 배부르랴'를 나타냅니다. 일을 시작한 초기에 큰 성과를 기대하기는 어렵다는 의미입니다.",
  },
  {
    id: 5,
    initialSounds: "ㅇㅅㄷ ㄴㅁㅇㅅ ㄸㅇㅈㄷ",
    options: [
      "원숭이도 나무에서 떨어진다",
      "열 번 찍어 안 넘어가는 나무 없다",
      "오르지 못할 나무는 쳐다보지도 말라",
      "옷은 새 옷이 좋고 사람은 옛 사람이 좋다",
    ],
    correctAnswer: 0,
    explanation:
      "이 초성은 '원숭이도 나무에서 떨어진다'를 나타냅니다. 아무리 능숙한 사람도 실수할 수 있다는 의미입니다.",
  },
  {
    id: 6,
    initialSounds: "ㅂ ㅇㄴ ㅁㅇ ㅊ ㄹ ㄱㄷ",
    options: ["발 없는 말이 천 리 간다", "병 주고 약 준다", "바늘 도둑이 소 도둑 된다", "불난 집에 부채질한다"],
    correctAnswer: 0,
    explanation: "이 초성은 '발 없는 말이 천 리 간다'를 나타냅니다. 소문은 빠르게 퍼진다는 의미입니다.",
  },
  {
    id: 7,
    initialSounds: "ㄱㄹ ㅅㅇㅇ ㅅㅇ ㄷ ㅌㄴㄷ",
    options: [
      "가랑비에 옷 젖는 줄 모른다",
      "고래 싸움에 새우 등 터진다",
      "구슬이 서 말이라도 꿰어야 보배다",
      "공든 탑이 무너지랴",
    ],
    correctAnswer: 1,
    explanation:
      "이 초성은 '고래 싸움에 새우 등 터진다'를 나타냅니다. 강한 자들의 다툼에 약한 자가 피해를 입는다는 의미입니다.",
  },
  {
    id: 8,
    initialSounds: "ㅅ ㅅ ㅂㅈ ㅇㄷㄱㅈ ㄱㄷ",
    options: [
      "세 살 버릇 여든까지 간다",
      "소문난 잔치에 먹을 것 없다",
      "서당개 삼 년이면 풍월을 읊는다",
      "시작이 반이다",
    ],
    correctAnswer: 0,
    explanation: "이 초성은 '세 살 버릇 여든까지 간다'를 나타냅니다. 어릴 때 들인 습관이 평생 간다는 의미입니다.",
  },
  {
    id: 9,
    initialSounds: "ㅁㅈㄹ ㄱㅇㄷ ㅁㅈㄹ ㅂㄷ",
    options: [
      "말 한마디에 천 냥 빚을 갚는다",
      "믿는 도끼에 발등 찍힌다",
      "모로 가도 서울만 가면 된다",
      "못된 송아지 엉덩이에 뿔 난다",
    ],
    correctAnswer: 1,
    explanation: "이 초성은 '믿는 도끼에 발등 찍힌다'를 나타냅니다. 가장 믿었던 사람에게 배신당한다는 의미입니다.",
  },
  {
    id: 10,
    initialSounds: "ㄱㅇ ㄸㄹ ㄱㄴ ㄱㄷ",
    options: ["가는 날이 장날이다", "개구리 올챙이 적 생각 못한다", "고양이 쥐 생각 한다", "공든 탑이 무너지랴"],
    correctAnswer: 1,
    explanation:
      "이 초성은 '개구리 올챙이 적 생각 못한다'를 나타냅니다. 자신의 과거를 잊고 남을 무시한다는 의미입니다.",
  },
]

// 메모이제이션된 퀴즈 문제 컴포넌트
const QuizQuestion = memo(({ initialSounds }: { initialSounds: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="flex items-center gap-3 text-xl font-medium text-center mb-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 w-full"
  >
    <Music className="h-6 w-6 text-purple-500" />
    <span>{initialSounds}</span>
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

export default function InitialSoundQuiz() {
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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
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
            <CardTitle className="text-center text-xl">초성 퀴즈</CardTitle>
            <CardDescription className="text-center">초성만 보고 속담을 맞춰보세요</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <AnimatePresence mode="wait">
              <QuizQuestion key={currentQuestion} initialSounds={quizData[currentQuestion].initialSounds} />
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
                      selectedAnswer === index ? "bg-purple-100 dark:bg-purple-900/30 border-purple-500" : ""
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
                  className="bg-purple-500 hover:bg-purple-600 w-full"
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
                  className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 w-full"
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

