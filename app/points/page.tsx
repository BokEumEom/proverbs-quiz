"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Trophy, Clock } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import BottomNavigation from "@/components/bottom-navigation"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"

interface PointHistory {
  amount: number
  reason: string
  date: string
}

export default function PointsHistoryPage() {
  const [pointsHistory, setPointsHistory] = useState<PointHistory[]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // 로컬 스토리지에서 포인트 내역 가져오기
    const loadPointsHistory = () => {
      setIsLoading(true)
      
      try {
        const storedProgress = localStorage.getItem("user_progress")
        if (storedProgress) {
          const progress = JSON.parse(storedProgress)
          setTotalPoints(progress.totalPoints || 0)
          setPointsHistory(progress.pointsHistory || [])
        }
      } catch (error) {
        console.error("포인트 내역을 불러오는 중 오류 발생:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadPointsHistory()
  }, [])
  
  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { 
        addSuffix: true,
        locale: ko
      })
    } catch (e) {
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
        <h1 className="text-xl font-bold">포인트 내역</h1>
      </header>

      <div className="p-4 max-w-md mx-auto space-y-6">
        {/* 총 포인트 카드 */}
        <Card className="overflow-hidden border-0 shadow-sm">
          <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium">총 보유 포인트</h2>
                <p className="text-3xl font-bold mt-2">{totalPoints} P</p>
              </div>
              <div className="bg-white/20 p-3 rounded-full">
                <Trophy className="h-8 w-8" />
              </div>
            </div>
          </div>
        </Card>

        {/* 포인트 내역 */}
        <Card className="overflow-hidden border-0 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">포인트 적립/사용 내역</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex justify-between p-3 border-b">
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                  </div>
                ))}
              </div>
            ) : pointsHistory.length > 0 ? (
              <div className="space-y-1">
                {pointsHistory.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex justify-between p-3 ${
                      index < pointsHistory.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div>
                      <p className="font-medium">{item.reason}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(item.date)}
                      </div>
                    </div>
                    <div className={`font-bold ${item.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                      {item.amount > 0 ? "+" : ""}{item.amount} P
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>포인트 내역이 없습니다.</p>
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