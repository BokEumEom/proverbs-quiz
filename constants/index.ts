import { QuizType, QuizDifficulty } from "@/types"

// 퀴즈 설정
export const QUIZ_CONFIG: Record<QuizType, {
  title: string
  description: string
  difficulty: QuizDifficulty
  questionCount: number
  estimatedTime: string
  reward: number
}> = {
  ox: {
    title: "O/X 퀴즈",
    description: "속담이 맞는지 틀린지 판단하세요",
    difficulty: "easy",
    questionCount: 10,
    estimatedTime: "5분",
    reward: 10
  },
  "initial-sound": {
    title: "초성 퀴즈",
    description: "초성만 보고 속담을 맞춰보세요",
    difficulty: "medium",
    questionCount: 8,
    estimatedTime: "8분",
    reward: 15
  },
  picture: {
    title: "그림 퀴즈",
    description: "그림을 보고 알맞은 속담을 찾아보세요",
    difficulty: "medium",
    questionCount: 6,
    estimatedTime: "10분",
    reward: 20
  },
  blank: {
    title: "빈칸 채우기",
    description: "속담의 빈칸을 채워 완성해보세요",
    difficulty: "hard",
    questionCount: 5,
    estimatedTime: "12분",
    reward: 25
  }
}

// 연속 출석 보상 설정
export const STREAK_REWARDS = {
  5: 10,    // 5일 연속: 10포인트 보너스
  10: 20,   // 10일 연속: 20포인트 보너스
  20: 30,   // 20일 연속: 30포인트 보너스
  30: 50    // 30일 연속: 50포인트 보너스
} as const

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  USER_PROGRESS: "user_progress",
  DAILY_CHALLENGE: "daily_challenge",
  QUIZ_RESULTS: "quiz_results"
} as const

// 애니메이션 설정
export const ANIMATION_CONFIG = {
  duration: 0.3,
  easing: "easeInOut"
} as const

// 모바일 브레이크포인트
export const MOBILE_BREAKPOINT = 768

// 테마 설정
export const THEME = {
  light: "light",
  dark: "dark"
} as const 