"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Music, Image, Square } from "lucide-react"
import { useEffect, useState } from "react"
import { getAllQuizResults } from "@/utils/quiz-storage"
import { QuizResult, QuizType } from "@/types"
import { QUIZ_CONFIG } from "@/constants"
import BottomNavigation from "@/components/bottom-navigation"

export default function HistoryPage() {
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  
  useEffect(() => {
    // 로컬 스토리지에서 결과 로드
    try {
      const results = getAllQuizResults()
      setQuizResults(results)
    } catch (error) {
      console.error("퀴즈 결과 로드 실패:", error)
    }
  }, [])

  // 퀴즈 타입별 아이콘
  const getQuizIcon = (type: QuizType) => {
    switch (type) {
      case "ox":
        return <Check className="h-4 w-4 text-green-500" />
      case "initial-sound":
        return <Music className="h-4 w-4 text-purple-500" />
      case "picture":
        return <Image className="h-4 w-4 text-blue-500" />
      case "blank":
        return <Square className="h-4 w-4 text-amber-500" />
    }
  }

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('ko-KR', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch (error) {
      return "날짜 정보 없음"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm p-4 flex items-center">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-9 w-9 mr-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">홈으로 돌아가기</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold">활동 기록</h1>
      </header>

      <div className="p-4 max-w-md mx-auto">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">퀴즈 결과</CardTitle>
          </CardHeader>
          <CardContent>
            {quizResults && quizResults.length > 0 ? (
              <div className="space-y-4">
                {quizResults.map((result) => (
                  <div key={result.quizId} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-800">
                        {getQuizIcon(result.quizType)}
                      </div>
                      <div>
                        <p className="font-medium">{QUIZ_CONFIG[result.quizType]?.title || "퀴즈"}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{formatDate(result.completedAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${result.score / result.totalQuestions >= 0.7 ? "text-green-500" : "text-amber-500"}`}>
                        {result.score}/{result.totalQuestions}
                      </p>
                      <p className="text-xs text-gray-500">점수</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>아직 퀴즈 결과가 없습니다.</p>
                <p className="mt-2">퀴즈를 풀고 결과를 확인해보세요!</p>
                <Link href="/" className="mt-4 inline-block">
                  <Button>퀴즈 풀러 가기</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 모바일 하단 내비게이션 */}
      <BottomNavigation />
    </div>
  )
}
