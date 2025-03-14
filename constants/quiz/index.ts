import { OX_QUIZ_DATA } from "./ox-quiz"
import { INITIAL_SOUND_QUIZ_DATA } from "./initial-sound-quiz"
import { PICTURE_QUIZ_DATA } from "./picture-quiz"
import { BLANK_QUIZ_DATA } from "./blank-quiz"
import { QuizQuestion } from "@/types"

// 퀴즈 데이터 매핑
export const QUIZ_DATA_MAP = {
  ox: OX_QUIZ_DATA,
  "initial-sound": INITIAL_SOUND_QUIZ_DATA,
  picture: PICTURE_QUIZ_DATA,
  blank: BLANK_QUIZ_DATA,
} as const

// 퀴즈 타입
export type QuizType = keyof typeof QUIZ_DATA_MAP

// 데이터 검증 함수
export function validateQuizData(): boolean {
  // 모든 ID가 고유한지 검사
  const allIds = new Set<string>()
  let duplicateIds: string[] = []

  Object.values(QUIZ_DATA_MAP).flat().forEach(quiz => {
    if (allIds.has(quiz.id)) {
      duplicateIds.push(quiz.id)
    }
    allIds.add(quiz.id)
  })

  if (duplicateIds.length > 0) {
    console.error('중복된 퀴즈 ID가 발견되었습니다:', duplicateIds)
    return false
  }

  // 각 퀴즈 타입별 필수 필드 검사
  let isValid = true

  // O/X 퀴즈 검사
  OX_QUIZ_DATA.forEach(quiz => {
    if (quiz.answer !== 'true' && quiz.answer !== 'false') {
      console.error('O/X 퀴즈의 답은 "true" 또는 "false"여야 합니다:', quiz.id)
      isValid = false
    }
  })

  // 초성 퀴즈 검사
  INITIAL_SOUND_QUIZ_DATA.forEach(quiz => {
    if (!quiz.initialSound) {
      console.error('초성 퀴즈에 initialSound가 없습니다:', quiz.id)
      isValid = false
    }
  })

  // 그림 퀴즈 검사
  PICTURE_QUIZ_DATA.forEach(quiz => {
    if (!quiz.imageUrl) {
      console.error('그림 퀴즈에 imageUrl이 없습니다:', quiz.id)
      isValid = false
    }
  })

  // 빈칸 채우기 퀴즈 검사
  BLANK_QUIZ_DATA.forEach(quiz => {
    if (!quiz.options || quiz.options.length !== 4) {
      console.error('빈칸 채우기 퀴즈는 정확히 4개의 선택지가 필요합니다:', quiz.id)
      isValid = false
    }
    if (!quiz.options?.includes(quiz.answer)) {
      console.error('정답이 선택지에 포함되어 있지 않습니다:', quiz.id)
      isValid = false
    }
  })

  return isValid
}

// 데이터 검증 실행
if (typeof window !== 'undefined') {
  validateQuizData()
}

// 타입 내보내기
export type { QuizQuestion } 