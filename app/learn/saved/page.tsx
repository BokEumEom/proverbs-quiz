"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import BottomNavigation from "@/components/bottom-navigation"
import { useSavedProverbs } from "@/hooks/use-saved-proverbs"

export default function SavedProverbsPage() {
  const { savedProverbs, removeProverb } = useSavedProverbs();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm p-4 flex items-center">
        <Link href="/learn">
          <Button variant="ghost" size="icon" className="h-9 w-9 mr-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">뒤로 가기</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold">저장한 속담</h1>
      </header>

      <div className="p-4 max-w-md mx-auto">
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">저장한 속담 ({savedProverbs.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {savedProverbs.length > 0 ? (
                savedProverbs.map((proverb) => (
                  <div 
                    key={proverb.id} 
                    className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative"
                  >
                    <p className="font-medium pr-8">{proverb.text}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{proverb.meaning}</p>
                    <button 
                      className="absolute top-3 right-3 p-1"
                      onClick={() => removeProverb(proverb.id)}
                    >
                      <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>저장한 속담이 없습니다.</p>
                  <p className="text-sm mt-1">하트 아이콘을 클릭하여 속담을 저장하세요.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link href="/learn">
            <Button variant="outline" className="w-full">
              속담 학습으로 돌아가기
            </Button>
          </Link>
        </div>
      </div>

      {/* 모바일 하단 내비게이션 */}
      <BottomNavigation />
    </div>
  )
} 