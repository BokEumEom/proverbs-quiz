"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, RotateCcw, Award } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import BottomNavigation from "@/components/bottom-navigation";
import { PROVERBS_DATA } from "@/constants/proverbs";
import ProverbCarousel from "@/components/proverb-carousel";
import LearningComplete from "@/components/learning-complete";
import { useProverbLearning } from "@/hooks/use-proverb-learning";

export default function FlashcardsPage() {
  const [isStarted, setIsStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [studySet, setStudySet] = useState(PROVERBS_DATA.slice(0, 10));
  const { getStudyProverbs, completeSession, getStats, resetLearning } = useProverbLearning();
  const stats = getStats(PROVERBS_DATA);

  useEffect(() => {
    // 학습할 속담 세트 준비
    const proverbs = getStudyProverbs(PROVERBS_DATA, 10);
    setStudySet(proverbs.length > 0 ? proverbs : PROVERBS_DATA.slice(0, 10));
  }, [getStudyProverbs]);

  const handleComplete = (knownProverbs: number[], reviewProverbs: number[]) => {
    completeSession(knownProverbs, reviewProverbs);
    setIsCompleted(true);
  };

  const handleStartNewSession = () => {
    const proverbs = getStudyProverbs(PROVERBS_DATA, 10);
    setStudySet(proverbs.length > 0 ? proverbs : PROVERBS_DATA.slice(0, 10));
    setIsStarted(true);
    setIsCompleted(false);
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
        <h1 className="text-xl font-bold">속담 플래시카드</h1>
      </header>

      <div className="p-4 max-w-md mx-auto">
        {!isStarted ? (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>학습 현황</CardTitle>
                <CardDescription>
                  총 {stats.totalCount}개의 속담 중 {stats.knownCount}개를 학습했습니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${stats.progress}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <p className="text-xl font-bold">{stats.knownCount}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">알고 있음</p>
                    </div>
                    <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                      <p className="text-xl font-bold">{stats.reviewCount}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">복습 필요</p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <p className="text-xl font-bold">{stats.newCount}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">미학습</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={resetLearning}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  초기화
                </Button>
                <Button 
                  onClick={handleStartNewSession}
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  학습 시작
                </Button>
              </CardFooter>
            </Card>

            {stats.knownCount > 0 && (
              <Card className="mb-6 bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 border-0">
                <CardHeader>
                  <div className="flex items-center">
                    <Award className="h-5 w-5 text-amber-500 mr-2" />
                    <CardTitle className="text-lg">학습 성과</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    지금까지 {stats.knownCount}개의 속담을 학습했습니다. 
                    전체의 {stats.progress}%를 완료했습니다!
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        ) : isCompleted ? (
          <LearningComplete 
            totalCount={studySet.length}
            knownCount={stats.knownCount}
            reviewCount={stats.reviewCount}
            onRestart={handleStartNewSession}
          />
        ) : (
          <ProverbCarousel 
            proverbs={studySet} 
            onComplete={handleComplete} 
          />
        )}
      </div>

      {/* 모바일 하단 내비게이션 */}
      <BottomNavigation />
    </div>
  );
} 