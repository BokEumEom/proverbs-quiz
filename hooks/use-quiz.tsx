import { useState, useCallback, useMemo, useEffect } from "react"
import { QuizQuestion } from "@/types"

export function useQuiz(quizData: QuizQuestion[]) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  // 현재 문제 데이터 메모이제이션
  const currentQuizData = useMemo(() => quizData[currentQuestion], [currentQuestion, quizData])

  const handleSelectAnswer = useCallback((index: number) => {
    setSelectedAnswer(index)
  }, [])

  const handleAnswer = useCallback(() => {
    if (selectedAnswer === null) return

    setShowExplanation(true)

    // 선택한 답변의 텍스트와 정답이 일치하는지 확인
    const isCorrect = currentQuizData.options?.[selectedAnswer] === currentQuizData.answer

    if (isCorrect) {
      setScore((prev) => prev + 1)
      // 정답일 때 햅틱 피드백 (지원되는 기기에서)
      if (navigator.vibrate) {
        navigator.vibrate(100)
      }
    }
  }, [currentQuizData, selectedAnswer])

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
  const isCorrectAnswer = selectedAnswer !== null && currentQuizData.options?.[selectedAnswer] === currentQuizData.answer

  // 퀴즈 완료 시 Confetti 효과 표시
  useEffect(() => {
    if (isQuizFinished && !showConfetti && score > quizData.length / 2) {
      setShowConfetti(true)
    }
  }, [isQuizFinished, showConfetti, score, quizData.length])

  return {
    currentQuestion,
    selectedAnswer,
    score,
    showExplanation,
    showConfetti,
    currentQuizData,
    progress,
    isQuizFinished,
    isCorrectAnswer,
    totalQuestions: quizData.length,
    handleSelectAnswer,
    handleAnswer,
    handleNextQuestion,
    handleRestart,
  }
} 