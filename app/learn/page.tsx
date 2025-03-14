"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import BottomNavigation from "@/components/bottom-navigation"
import { PROVERBS_DATA } from "@/constants/proverbs"
import { useSavedProverbs } from "@/hooks/use-saved-proverbs"
import { useRecentProverbs } from "@/hooks/use-recent-proverbs"
import { SearchBar } from "@/components/learn/search-bar"
import { LearningMethodsTab } from "@/components/learn/learning-methods-tab"
import { BrowseProverbsTab } from "@/components/learn/browse-proverbs-tab"
import { RecentProverbsTab } from "@/components/learn/recent-proverbs-tab"
import { LearningProgress } from "@/components/learn/learning-progress"
import { AnimatedTabs } from "@/components/ui/animated-tabs"
import { motion } from "framer-motion"

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

  // 저장 토글 핸들러
  const handleToggleSave = (proverb, isSaved) => {
    isSaved ? removeProverb(proverb.id) : saveProverb(proverb);
  };

  // 탭 구성
  const tabs = [
    {
      value: "learn",
      label: "학습 방법",
      content: <LearningMethodsTab />
    },
    {
      value: "browse",
      label: "속담 찾기",
      content: <BrowseProverbsTab savedProverbsCount={savedProverbs.length} />
    },
    {
      value: "recent",
      label: "최근 학습",
      content: (
        <RecentProverbsTab
          recentProverbs={recentProverbs}
          onProverbClick={handleProverbClick}
          isProverbSaved={isProverbSaved}
          onToggleSave={handleToggleSave}
        />
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 헤더 */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm p-4 flex items-center"
      >
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-9 w-9 mr-2">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">홈으로 돌아가기</span>
          </Button>
        </Link>
        <h1 className="text-xl font-bold">속담 학습</h1>
      </motion.header>

      <div className="p-4 max-w-md mx-auto">
        {/* 검색 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </motion.div>

        {/* 학습 탭 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <AnimatedTabs defaultValue="learn" tabs={tabs} className="mb-6" />
        </motion.div>
        
        {/* 학습 진행 상황 */}
        <LearningProgress 
          totalProverbs={PROVERBS_DATA.length}
          savedProverbsCount={savedProverbs.length}
          recentProverbsCount={recentProverbs.length}
        />
      </div>

      {/* 모바일 하단 내비게이션 */}
      <BottomNavigation />
    </div>
  )
}
