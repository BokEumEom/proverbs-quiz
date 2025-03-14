import { QuizResult, QuizType } from "@/types"
import { STORAGE_KEYS } from "@/constants"

// 퀴즈 결과 저장
export function saveQuizResult(result: {
  quizType: QuizType
  score: number
  totalQuestions: number
  timeSpent: number
}): QuizResult {
  // 브라우저 환경인지 확인
  if (typeof window === 'undefined') {
    console.warn('localStorage is not available in this environment')
    return {} as QuizResult
  }

  const newResult: QuizResult = {
    quizId: `quiz-${Date.now()}`,
    score: result.score,
    correctCount: result.score,
    wrongCount: result.totalQuestions - result.score,
    timeSpent: result.timeSpent,
    completedAt: new Date().toISOString(),
    quizType: result.quizType,
    totalQuestions: result.totalQuestions
  }
  
  try {
    const storedResults = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS)
    const results: QuizResult[] = storedResults ? JSON.parse(storedResults) : []
    
    const updatedResults = [newResult, ...results]
    localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(updatedResults))
    
    return newResult
  } catch (error) {
    console.error("퀴즈 결과 저장 실패:", error)
    return newResult
  }
}

// 모든 퀴즈 결과 가져오기
export function getAllQuizResults(): QuizResult[] {
  if (typeof window === 'undefined') return []
  
  try {
    const storedResults = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS)
    return storedResults ? JSON.parse(storedResults) : []
  } catch (error) {
    console.error("퀴즈 결과 로드 실패:", error)
    return []
  }
}

// 최근 퀴즈 결과 가져오기
export function getRecentQuizResults(limit = 5): QuizResult[] {
  try {
    const results = getAllQuizResults()
    return results.slice(0, limit)
  } catch (error) {
    console.error("최근 퀴즈 결과 로드 실패:", error)
    return []
  }
}

// 퀴즈 타입별 결과 가져오기
export function getQuizResultsByType(type: QuizType): QuizResult[] {
  try {
    const results = getAllQuizResults()
    return results.filter(result => result.quizType === type)
  } catch (error) {
    console.error("타입별 퀴즈 결과 로드 실패:", error)
    return []
  }
}

// 시간 형식 변환 (초 -> MM:SS)
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes < 10 ? '0' + minutes : minutes}:${remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds}`
} 