"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award } from "lucide-react"
import BottomNavigation from "@/components/bottom-navigation"

export default function LeaderboardPage() {
  // 임시 랭킹 데이터
  const leaderboardData = [
    { id: 1, name: "사용자1", points: 1250, quizzes: 42 },
    { id: 2, name: "사용자2", points: 980, quizzes: 35 },
    { id: 3, name: "사용자3", points: 820, quizzes: 30 },
    { id: 4, name: "사용자4", points: 750, quizzes: 28 },
    { id: 5, name: "사용자5", points: 680, quizzes: 25 },
    { id: 6, name: "사용자6", points: 620, quizzes: 22 },
    { id: 7, name: "사용자7", points: 580, quizzes: 20 },
    { id: 8, name: "사용자8", points: 520, quizzes: 18 },
    { id: 9, name: "사용자9", points: 480, quizzes: 16 },
    { id: 10, name: "사용자10", points: 420, quizzes: 15 },
  ]

  // 아이콘 선택 함수
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-500" />
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />
      case 3:
        return <Medal className="h-5 w-5 text-amber-600" />
      default:
        return <Award className="h-5 w-5 text-blue-500" />
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
        <h1 className="text-xl font-bold">랭킹</h1>
      </header>

      <div className="p-4 max-w-md mx-auto">
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">이달의 랭킹</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboardData.map((user, index) => (
                <div 
                  key={user.id} 
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    index < 3 ? "bg-blue-50 dark:bg-blue-900/20" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow-sm">
                      {getRankIcon(index + 1)}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{user.quizzes} 퀴즈 완료</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600 dark:text-blue-400">{user.points}</p>
                    <p className="text-xs text-gray-500">포인트</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-8">
          <p>매월 1일에 랭킹이 초기화됩니다.</p>
          <p className="mt-1">상위 3명에게는 특별 배지가 수여됩니다!</p>
        </div>
      </div>

      {/* 모바일 하단 내비게이션 */}
      <BottomNavigation />
    </div>
  )
}
