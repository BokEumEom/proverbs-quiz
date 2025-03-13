import { DailyChallenge, QuizType } from "@/types"
import { QUIZ_CONFIG, STREAK_REWARDS, STORAGE_KEYS } from "@/constants"

// 일일 도전 과제 타입 정의
export type ChallengeType = "ox" | "initial-sound" | "picture" | "blank"

export interface DailyChallenge {
  id: string
  date: string // ISO 형식 날짜 문자열
  type: ChallengeType
  title: string
  description: string
  questionCount: number
  reward: number // 포인트 보상
  completed: boolean
  streak?: number // 연속 출석 일수
}

// 연속 출석 보상 계산
export function calculateStreakBonus(streak: number): number {
  if (streak >= 30) return STREAK_REWARDS[30]
  if (streak >= 20) return STREAK_REWARDS[20]
  if (streak >= 10) return STREAK_REWARDS[10]
  if (streak >= 5) return STREAK_REWARDS[5]
  return 0
}

// 오늘의 도전 과제 생성
export function generateDailyChallenge(date: Date, streak = 0): DailyChallenge {
  const types: QuizType[] = ["ox", "initial-sound", "picture", "blank"]
  const dayOfWeek = date.getDay() // 0(일요일)부터 6(토요일)

  // 요일에 따라 다른 유형의 퀴즈 제공
  const type = types[dayOfWeek % types.length]
  const config = QUIZ_CONFIG[type]

  // 요일에 따라 문제 수 다르게 설정 (주말에는 더 많은 문제)
  const questionCount = dayOfWeek === 0 || dayOfWeek === 6 ? 10 : 5

  // 기본 보상 + 연속 출석 보너스
  const baseReward = config.reward
  const streakBonus = calculateStreakBonus(streak)

  return {
    id: `challenge-${date.toISOString().split("T")[0]}`,
    date: date.toISOString(),
    type,
    title: config.title,
    description: config.description,
    questionCount,
    difficulty: config.difficulty,
    estimatedTime: config.estimatedTime,
    reward: baseReward + streakBonus,
    completed: false,
    streak,
  }
}

// 로컬 스토리지에서 도전 과제 데이터 가져오기
export function getDailyChallengeFromStorage(): DailyChallenge | null {
  if (typeof window === "undefined") return null

  const storedChallenge = localStorage.getItem(STORAGE_KEYS.DAILY_CHALLENGE)
  if (!storedChallenge) return null

  try {
    return JSON.parse(storedChallenge) as DailyChallenge
  } catch (e) {
    console.error("Failed to parse daily challenge from storage", e)
    return null
  }
}

// 로컬 스토리지에 도전 과제 데이터 저장
export function saveDailyChallengeToStorage(challenge: DailyChallenge): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.DAILY_CHALLENGE, JSON.stringify(challenge))
}

// 사용자 스트릭(연속 출석) 정보 가져오기
export function getUserStreak(): number {
  if (typeof window === "undefined") return 0

  const storedStreak = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS)
  if (!storedStreak) return 0

  try {
    const progress = JSON.parse(storedStreak)
    const lastDate = new Date(progress.lastDate)
    const today = new Date()

    // 날짜 비교를 위해 시간 정보 제거
    const lastDateStr = lastDate.toISOString().split("T")[0]
    const todayStr = today.toISOString().split("T")[0]
    const yesterdayStr = new Date(today.setDate(today.getDate() - 1)).toISOString().split("T")[0]

    // 오늘 이미 접속했으면 현재 스트릭 유지
    if (lastDateStr === todayStr) {
      return progress.streak
    }

    // 어제 접속했으면 스트릭 증가
    if (lastDateStr === yesterdayStr) {
      const newStreak = progress.streak + 1
      saveUserProgress({ ...progress, streak: newStreak, lastDate: today.toISOString() })
      return newStreak
    }

    // 이틀 이상 접속하지 않았으면 스트릭 리셋
    saveUserProgress({ ...progress, streak: 1, lastDate: today.toISOString() })
    return 1
  } catch (e) {
    console.error("Failed to parse user progress from storage", e)
    saveUserProgress({ streak: 1, lastDate: new Date().toISOString() })
    return 1
  }
}

// 사용자 진행 상황 저장
export function saveUserProgress(progress: { streak: number; lastDate: string }): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress))
}

// 사용자 포인트 관리
export function getUserPoints(): number {
  if (typeof window === "undefined") return 0

  const storedProgress = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS)
  if (!storedProgress) return 0

  try {
    const progress = JSON.parse(storedProgress)
    return progress.totalPoints || 0
  } catch (e) {
    return 0
  }
}

export function addUserPoints(points: number): void {
  if (typeof window === "undefined") return

  const storedProgress = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS)
  const progress = storedProgress ? JSON.parse(storedProgress) : { totalPoints: 0 }
  
  progress.totalPoints = (progress.totalPoints || 0) + points
  localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress))
}

