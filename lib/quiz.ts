import { QuizQuestion, QuizResult } from "@/types"
import { QUIZ_DATA_MAP } from "@/constants/quiz/quiz-data"
import { QUIZ_CONFIG } from "@/constants"

// 퀴즈 문제 랜덤 선택
export function getRandomQuestions(type: keyof typeof QUIZ_DATA_MAP, count: number): QuizQuestion[] {
  const questions = QUIZ_DATA_MAP[type]
  const shuffled = [...questions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

// 퀴즈 결과 계산
export function calculateQuizResult(
  answers: string[],
  questions: QuizQuestion[],
  timeSpent: number
): QuizResult {
  const correctCount = answers.filter((answer, index) => answer === questions[index].answer).length
  const wrongCount = questions.length - correctCount
  const score = (correctCount / questions.length) * 100

  return {
    quizId: questions[0].id,
    score,
    correctCount,
    wrongCount,
    timeSpent,
    completedAt: new Date().toISOString(),
  }
}

// 퀴즈 보상 계산
export function calculateQuizReward(type: keyof typeof QUIZ_CONFIG, score: number): number {
  const baseReward = QUIZ_CONFIG[type].reward
  const bonusMultiplier = score >= 90 ? 1.5 : score >= 80 ? 1.2 : 1
  return Math.round(baseReward * bonusMultiplier)
}

// 퀴즈 진행 상태 저장
export function saveQuizProgress(quizId: string, currentQuestion: number): void {
  if (typeof window === "undefined") return
  localStorage.setItem(`quiz_progress_${quizId}`, JSON.stringify({ currentQuestion }))
}

// 퀴즈 진행 상태 불러오기
export function loadQuizProgress(quizId: string): { currentQuestion: number } | null {
  if (typeof window === "undefined") return null
  const progress = localStorage.getItem(`quiz_progress_${quizId}`)
  return progress ? JSON.parse(progress) : null
}

// 퀴즈 결과 저장
export function saveQuizResult(result: QuizResult): void {
  if (typeof window === "undefined") return
  const results = JSON.parse(localStorage.getItem("quiz_results") || "[]")
  results.push(result)
  localStorage.setItem("quiz_results", JSON.stringify(results))
}

// 퀴즈 결과 불러오기
export function loadQuizResults(): QuizResult[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("quiz_results") || "[]")
} 