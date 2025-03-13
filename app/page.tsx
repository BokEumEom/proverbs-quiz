"use client"

import QuizCard from "@/components/quiz-card"
import DailyChallengeCard from "@/components/daily-challenge-card"
import { Check, Music, Image, Square, Trophy, User, Moon, Sun, HomeIcon, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"
import { useChallenge } from "@/contexts/challenge-context"
import { Skeleton } from "@/components/ui/skeleton"
import { QuizType } from "@/types"
import { QUIZ_CONFIG } from "@/constants"

// 애니메이션 변수 정의
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

// 퀴즈 카드 설정
const quizCards: Array<{
  type: QuizType
  icon: React.ReactNode
  color: string
}> = [
  {
    type: "ox",
    icon: <Check className="h-6 w-6" />,
    color: "bg-green-500",
  },
  {
    type: "initial-sound",
    icon: <Music className="h-6 w-6" />,
    color: "bg-purple-500",
  },
  {
    type: "picture",
    icon: <Image className="h-6 w-6" />,
    color: "bg-blue-500",
  },
  {
    type: "blank",
    icon: <Square className="h-6 w-6" />,
    color: "bg-amber-500",
  },
]

export default function Home() {
  const [activeTab, setActiveTab] = useState("home")
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { dailyChallenge, userPoints, isLoading } = useChallenge()

  // 테마 마운트 확인
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 모바일 최적화 헤더 */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">속담 퀴즈</h1>

          <div className="flex items-center">
            {mounted && (
              <>
                <div className="mr-4 flex items-center">
                  <Trophy className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="font-medium">{userPoints} 포인트</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="rounded-full"
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="p-4 pb-24 max-w-md mx-auto">
        {activeTab === "home" && (
          <>
            {/* 일일 도전 과제 섹션 */}
            <h2 className="text-lg font-bold mb-3">오늘의 도전</h2>
            {isLoading ? (
              <Skeleton className="h-32 w-full rounded-lg mb-6" />
            ) : dailyChallenge ? (
              <div className="mb-6">
                <DailyChallengeCard challenge={dailyChallenge} />
              </div>
            ) : null}

            {/* 퀴즈 카드 섹션 */}
            <h2 className="text-lg font-bold mb-3">퀴즈 선택</h2>
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 gap-4">
              {quizCards.map((card) => (
                <motion.div key={card.type} variants={item}>
                  <QuizCard
                    type={card.type}
                    icon={card.icon}
                    href={`/quiz/${card.type}`}
                    color={card.color}
                    isMobile={true}
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* 최근 활동 섹션 */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }}>
              <h2 className="text-lg font-bold mt-8 mb-3">최근 활동</h2>
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 border">
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b">
                    <div>
                      <p className="font-medium">O/X 퀴즈</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">2시간 전</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-500">8/10</p>
                      <p className="text-xs text-gray-500">점수</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pb-3 border-b">
                    <div>
                      <p className="font-medium">초성 퀴즈</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">어제</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-500">7/10</p>
                      <p className="text-xs text-gray-500">점수</p>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline" size="sm">
                    모든 기록 보기
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {activeTab === "ranking" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="pt-2">
            <h2 className="text-xl font-bold mb-4">랭킹</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden">
              <div className="p-4 bg-blue-500 text-white">
                <div className="flex justify-between items-center">
                  <p className="font-bold">내 랭킹: 23위</p>
                  <p>상위 15%</p>
                </div>
              </div>

              <div className="divide-y">
                {[1, 2, 3, 4, 5].map((rank) => (
                  <motion.div
                    key={rank}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: rank * 0.1, duration: 0.3 }}
                    className="flex items-center p-4"
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                        rank === 1
                          ? "bg-amber-100 text-amber-600"
                          : rank === 2
                            ? "bg-gray-100 text-gray-600"
                            : rank === 3
                              ? "bg-orange-100 text-orange-600"
                              : "bg-blue-100 text-blue-600"
                      }`}
                    >
                      {rank}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">사용자{rank}</p>
                      <p className="text-sm text-gray-500">총점: {100 - rank * 5}</p>
                    </div>
                    <Trophy className="h-5 w-5 text-amber-500" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "profile" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="pt-2">
            <h2 className="text-xl font-bold mb-4">내 프로필</h2>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-4">
              <div className="flex flex-col items-center mb-6">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-3">
                  <User className="h-10 w-10 text-blue-500" />
                </div>
                <h3 className="text-lg font-bold">사용자</h3>
                <p className="text-sm text-gray-500">가입일: 2025년 3월 1일</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">퀴즈 통계</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">총 퀴즈 수</p>
                      <p className="text-xl font-bold">24</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      <p className="text-sm text-gray-500">정답률</p>
                      <p className="text-xl font-bold">78%</p>
                    </div>
                  </div>
                </div>

                <Button className="w-full" onClick={() => setActiveTab("statistics")}>
                  상세 통계 보기
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "statistics" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} className="pt-2">
            <div className="flex items-center mb-4">
              <Button variant="ghost" size="icon" onClick={() => setActiveTab("profile")} className="mr-2">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-bold">나의 통계</h2>
            </div>

            <div className="space-y-6">
              {/* 종합 통계 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-4">
                <h3 className="font-bold mb-3">종합 통계</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">총 퀴즈 수</p>
                    <p className="text-xl font-bold">24</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">정답률</p>
                    <p className="text-xl font-bold">78%</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">최고 점수</p>
                    <p className="text-xl font-bold">10/10</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">평균 점수</p>
                    <p className="text-xl font-bold">7.8/10</p>
                  </div>
                </div>
              </div>

              {/* 퀴즈 유형별 통계 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-4">
                <h3 className="font-bold mb-3">퀴즈 유형별 통계</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">O/X 퀴즈</p>
                      <p className="text-sm font-bold">85%</p>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">초성 퀴즈</p>
                      <p className="text-sm font-bold">70%</p>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: "70%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">그림 연상 퀴즈</p>
                      <p className="text-sm font-bold">75%</p>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "75%" }}></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <p className="font-medium">빈칸 채우기 퀴즈</p>
                      <p className="text-sm font-bold">65%</p>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                      <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 최근 활동 */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-4">
                <h3 className="font-bold mb-3">최근 활동</h3>
                <div className="space-y-3">
                  {[
                    { type: "O/X 퀴즈", score: "8/10", time: "2시간 전", color: "bg-green-500" },
                    { type: "초성 퀴즈", score: "7/10", time: "어제", color: "bg-purple-500" },
                    { type: "그림 연상 퀴즈", score: "6/10", time: "2일 전", color: "bg-blue-500" },
                    { type: "빈칸 채우기 퀴즈", score: "9/10", time: "3일 전", color: "bg-amber-500" },
                    { type: "O/X 퀴즈", score: "10/10", time: "1주일 전", color: "bg-green-500" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center p-3 border rounded-lg">
                      <div className={`w-2 h-10 ${activity.color} rounded-full mr-3`}></div>
                      <div className="flex-1">
                        <p className="font-medium">{activity.type}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{activity.score}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* 모바일 바텀 네비게이션 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t shadow-lg z-50">
        <div className="flex justify-around items-center h-16">
          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center h-full w-full rounded-none ${activeTab === "home" ? "text-blue-500" : ""}`}
            onClick={() => setActiveTab("home")}
          >
            <HomeIcon className="h-5 w-5" />
            <span className="text-xs mt-1">홈</span>
          </Button>

          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center h-full w-full rounded-none ${activeTab === "ranking" ? "text-blue-500" : ""}`}
            onClick={() => setActiveTab("ranking")}
          >
            <Trophy className="h-5 w-5" />
            <span className="text-xs mt-1">랭킹</span>
          </Button>

          <Button
            variant="ghost"
            className={`flex flex-col items-center justify-center h-full w-full rounded-none ${activeTab === "profile" || activeTab === "statistics" ? "text-blue-500" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <User className="h-5 w-5" />
            <span className="text-xs mt-1">프로필</span>
          </Button>
        </div>
      </div>
    </main>
  )
}

