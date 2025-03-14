"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, User, Award, Settings, LogOut, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"
import BottomNavigation from "@/components/bottom-navigation"

export default function ProfilePage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // 테마 마운트 확인
  useEffect(() => {
    setMounted(true)
  }, [])

  // 임시 사용자 데이터
  const userData = {
    name: "사용자",
    points: 850,
    streak: 7,
    quizzesTaken: 32,
    correctAnswers: 124,
    achievements: [
      { id: 1, name: "첫 퀴즈 완료", description: "첫 번째 퀴즈를 완료했습니다.", icon: "🎯" },
      { id: 2, name: "3일 연속 학습", description: "3일 연속으로 학습했습니다.", icon: "🔥" },
      { id: 3, name: "10개 속담 마스터", description: "10개의 속담을 완벽하게 익혔습니다.", icon: "🧠" },
    ]
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
        <h1 className="text-xl font-bold">프로필</h1>
      </header>

      <div className="p-4 max-w-md mx-auto">
        {/* 프로필 카드 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <User className="h-8 w-8 text-blue-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{userData.name}</h2>
                <p className="text-gray-500 dark:text-gray-400">
                  {userData.points} 포인트 • {userData.streak}일 연속 학습
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 통계 */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">나의 통계</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500">퀴즈 참여</p>
                <p className="text-xl font-bold">{userData.quizzesTaken}회</p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg text-center">
                <p className="text-sm text-gray-500">정답</p>
                <p className="text-xl font-bold">{userData.correctAnswers}개</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 업적 */}
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              업적
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {userData.achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <p className="font-medium">{achievement.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 설정 */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-500" />
              설정
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mounted && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {theme === "dark" ? (
                      <Moon className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Sun className="h-5 w-5 text-amber-500" />
                    )}
                    <span>다크 모드</span>
                  </div>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
              )}
              
              <Button variant="outline" className="w-full flex items-center gap-2 text-red-500">
                <LogOut className="h-4 w-4" />
                로그아웃
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 모바일 하단 내비게이션 */}
      <BottomNavigation />
    </div>
  )
}
