"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Search, Bookmark, Clock } from "lucide-react"
import { Input } from "@/components/ui/input"
import BottomNavigation from "@/components/bottom-navigation"

export default function LearnPage() {
  // 임시 속담 데이터
  const proverbsData = [
    { id: 1, text: "소 잃고 외양간 고친다", meaning: "일이 잘못된 뒤에야 후회하고 대책을 세우는 것을 의미합니다." },
    { id: 2, text: "가는 말이 고와야 오는 말이 곱다", meaning: "상대방에게 좋게 대하면 자신도 좋은 대접을 받는다는 의미입니다." },
    { id: 3, text: "낮말은 새가 듣고 밤말은 쥐가 듣는다", meaning: "아무리 비밀스럽게 말해도 언젠가는 새어나간다는 의미입니다." },
    { id: 4, text: "원숭이도 나무에서 떨어진다", meaning: "아무리 능숙한 사람도 실수할 수 있다는 의미입니다." },
    { id: 5, text: "발 없는 말이 천 리 간다", meaning: "소문은 빠르게 퍼진다는 의미입니다." },
  ]

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
        <h1 className="text-xl font-bold">속담 학습</h1>
      </header>

      <div className="p-4 max-w-md mx-auto">
        {/* 검색 */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="속담 검색하기" 
            className="pl-10 bg-white dark:bg-gray-800"
          />
        </div>

        {/* 카테고리 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Card className="bg-blue-50 dark:bg-blue-900/20 border-0">
            <CardContent className="p-4 flex flex-col items-center">
              <BookOpen className="h-6 w-6 text-blue-500 mb-2" />
              <p className="font-medium">모든 속담</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">100개</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 dark:bg-purple-900/20 border-0">
            <CardContent className="p-4 flex flex-col items-center">
              <Bookmark className="h-6 w-6 text-purple-500 mb-2" />
              <p className="font-medium">저장한 속담</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">12개</p>
            </CardContent>
          </Card>
        </div>

        {/* 최근 학습 */}
        <Card className="mb-6">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">최근 학습</CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {proverbsData.map((proverb) => (
                <div key={proverb.id} className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <p className="font-medium">{proverb.text}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{proverb.meaning}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button className="w-full">
            모든 속담 보기
          </Button>
        </div>
      </div>

      {/* 모바일 하단 내비게이션 */}
      <BottomNavigation />
    </div>
  )
}
