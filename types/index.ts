// 퀴즈 유형 정의
export type QuizType = "ox" | "initial-sound" | "picture" | "blank"

// 퀴즈 난이도 정의
export type QuizDifficulty = "easy" | "medium" | "hard"

// 기본 퀴즈 인터페이스
export interface Quiz {
  id: string
  type: QuizType
  title: string
  description: string
  questionCount: number
  difficulty: QuizDifficulty
  estimatedTime: string
  reward: number // 포인트 보상
}

// 퀴즈 문제 인터페이스
export interface QuizQuestion {
  id: string
  question: string
  answer: string
  explanation: string
  options?: string[]
  imageUrl?: string // 그림 퀴즈용
  initialSound?: string // 초성 퀴즈용
}

// 퀴즈 결과 인터페이스
export interface QuizResult {
  quizId: string
  quizType: QuizType // 퀴즈 유형
  score: number
  correctCount: number
  wrongCount: number
  timeSpent: number
  completedAt: string
  totalQuestions: number // 전체 문제 수
}

// 일일 도전 과제 인터페이스
export interface DailyChallenge extends Quiz {
  date: string // ISO 형식 날짜 문자열
  completed: boolean
  streak?: number // 연속 출석 일수
}

// 사용자 진행 상황 인터페이스
export interface UserProgress {
  userId: string
  totalPoints: number
  streak: number
  completedQuizzes: string[] // 완료한 퀴즈 ID 목록
  dailyChallenges: {
    [date: string]: DailyChallenge
  }
} 