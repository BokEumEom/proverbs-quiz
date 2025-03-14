"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, Search } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import BottomNavigation from "@/components/bottom-navigation"
import { PROVERBS_DATA } from "@/constants/proverbs"
import { useSavedProverbs } from "@/hooks/use-saved-proverbs"
import { useRecentProverbs } from "@/hooks/use-recent-proverbs"

export default function AllProverbsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { savedProverbs, saveProverb, removeProverb, isProverbSaved } = useSavedProverbs();
  const { addRecentProverb } = useRecentProverbs();

  // 검색어에 따라 속담 필터링
  const filteredProverbs = searchTerm.trim() 
    ? PROVERBS_DATA.filter(proverb => 
        proverb.text.includes(searchTerm) || 
        proverb.meaning.includes(searchTerm)
      )
    : PROVERBS_DATA;

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
        <Link href="/learn">
          <Button variant="ghost" size="icon" className="h-9 w-9 mr-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">뒤로 가기</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold">모든 속담</h1>
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

        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {searchTerm.trim() 
                ? `검색 결과 (${filteredProverbs.length})` 
                : `모든 속담 (${PROVERBS_DATA.length})`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredProverbs.length > 0 ? (
                filteredProverbs.map((proverb) => (
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
                  <p>검색 결과가 없습니다.</p>
                  <p className="text-sm mt-1">다른 검색어를 입력해보세요.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 모바일 하단 내비게이션 */}
      <BottomNavigation />
    </div>
  )
} 