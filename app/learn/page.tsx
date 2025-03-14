"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, Search, Bookmark, Clock, Heart, HeartOff } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import BottomNavigation from "@/components/bottom-navigation"
import { PROVERBS_DATA } from "@/constants/proverbs"
import { useSavedProverbs } from "@/hooks/use-saved-proverbs"
import { useRecentProverbs } from "@/hooks/use-recent-proverbs"

export default function LearnPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProverbs, setFilteredProverbs] = useState(PROVERBS_DATA);
  const { savedProverbs, saveProverb, removeProverb, isProverbSaved } = useSavedProverbs();
  const { recentProverbs, addRecentProverb } = useRecentProverbs();

  // 검색어에 따라 속담 필터링
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredProverbs(PROVERBS_DATA);
      return;
    }
    
    const filtered = PROVERBS_DATA.filter(proverb => 
      proverb.text.includes(searchTerm) || 
      proverb.meaning.includes(searchTerm)
    );
    setFilteredProverbs(filtered);
  }, [searchTerm]);

  // 속담 클릭 시 최근 학습에 추가
  const handleProverbClick = (proverbId: number) => {
    const proverb = PROVERBS_DATA.find(p => p.id === proverbId);
    if (proverb) {
      addRecentProverb(proverb);
    }
  };

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 카테고리 */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link href="/learn/all">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-0 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center">
                <BookOpen className="h-6 w-6 text-blue-500 mb-2" />
                <p className="font-medium">모든 속담</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{PROVERBS_DATA.length}개</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/learn/saved">
            <Card className="bg-purple-50 dark:bg-purple-900/20 border-0 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer">
              <CardContent className="p-4 flex flex-col items-center">
                <Bookmark className="h-6 w-6 text-purple-500 mb-2" />
                <p className="font-medium">저장한 속담</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{savedProverbs.length}개</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* 최근 학습 */}
        <Card className="mb-6">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">최근 학습</CardTitle>
            <Clock className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentProverbs.length > 0 ? (
                recentProverbs.map((proverb) => (
                  <div 
                    key={proverb.id} 
                    className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative"
                    onClick={() => handleProverbClick(proverb.id)}
                  >
                    <p className="font-medium pr-8">{proverb.text}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{proverb.meaning}</p>
                    <button 
                      className="absolute top-3 right-3 p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        isProverbSaved(proverb.id) 
                          ? removeProverb(proverb.id) 
                          : saveProverb(proverb);
                      }}
                    >
                      {isProverbSaved(proverb.id) ? (
                        <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                      ) : (
                        <Heart className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  <p>최근 학습한 속담이 없습니다.</p>
                  <p className="text-sm mt-1">속담을 클릭하여 학습을 시작하세요.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 플래시카드 학습 링크 추가 */}
        <Link href="/learn/flashcards">
          <Card className="mb-6 bg-amber-50 dark:bg-amber-900/20 border-0 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors cursor-pointer">
            <CardContent className="p-4 flex items-center">
              <div className="bg-amber-100 dark:bg-amber-800/50 p-3 rounded-full mr-4">
                <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-300" />
              </div>
              <div>
                <p className="font-medium">플래시카드로 학습하기</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  카드를 넘기며 속담을 효과적으로 학습하세요
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <div className="text-center">
          <Link href="/learn/all">
            <Button className="w-full">
              모든 속담 보기
            </Button>
          </Link>
        </div>
      </div>

      {/* 모바일 하단 내비게이션 */}
      <BottomNavigation />
    </div>
  )
}
