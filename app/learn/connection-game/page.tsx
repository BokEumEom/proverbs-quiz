"use client"

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, RotateCcw, HelpCircle, Gamepad2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import BottomNavigation from "@/components/bottom-navigation";
import { PROVERBS_DATA } from "@/constants/proverbs";
import ConnectionGame from "@/components/connection-game";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Difficulty = "easy" | "medium" | "hard";

export default function ConnectionGamePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  
  // 난이도별 문제 수
  const questionCounts = {
    easy: 5,
    medium: 8,
    hard: 12
  };
  
  // 난이도별 속담 선택
  const gameProverbs = useMemo(() => {
    // 난이도별 필터링 (예: 쉬움=짧은 속담, 중간=중간 길이, 어려움=긴 속담)
    const filteredProverbs = PROVERBS_DATA.filter(proverb => {
      const wordCount = proverb.text.split(' ').length;
      
      if (difficulty === "easy") return wordCount <= 4;
      if (difficulty === "medium") return wordCount > 4 && wordCount <= 6;
      return wordCount > 6;
    });
    
    // 충분한 속담이 없으면 전체 속담에서 선택
    if (filteredProverbs.length < questionCounts[difficulty]) {
      return [...PROVERBS_DATA]
        .sort(() => Math.random() - 0.5)
        .slice(0, questionCounts[difficulty]);
    }
    
    return [...filteredProverbs]
      .sort(() => Math.random() - 0.5)
      .slice(0, questionCounts[difficulty]);
  }, [difficulty]);
  
  // 게임 시작
  const startGame = () => {
    setGameStarted(true);
    setGameCompleted(false);
    setScore(0);
    setTotalQuestions(questionCounts[difficulty]);
  };
  
  // 게임 재시작
  const restartGame = () => {
    setGameStarted(false);
    setGameCompleted(false);
    setScore(0);
  };
  
  // 게임 완료 처리
  const handleGameComplete = (finalScore: number) => {
    setScore(finalScore);
    setGameCompleted(true);
  };
  
  // 난이도 변경
  const handleDifficultyChange = (value: string) => {
    setDifficulty(value as Difficulty);
    setGameStarted(false);
    setGameCompleted(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* 헤더 */}
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-900 shadow-sm p-4 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/learn">
            <Button variant="ghost" size="icon" className="h-9 w-9 mr-2">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">뒤로 가기</span>
            </Button>
          </Link>
          <h1 className="text-xl font-bold">속담 연결 게임</h1>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowInstructions(!showInstructions)}
        >
          <HelpCircle className="h-5 w-5" />
          <span className="sr-only">도움말</span>
        </Button>
      </header>

      <div className="p-4 max-w-md mx-auto">
        {/* 도움말 */}
        {showInstructions && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4"
          >
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
              <CardContent className="pt-4">
                <h3 className="font-bold mb-2">게임 방법</h3>
                <ol className="list-decimal pl-5 space-y-1 text-sm">
                  <li>속담의 앞부분과 뒷부분이 섞여 있습니다.</li>
                  <li>앞부분을 선택한 후, 맞는 뒷부분으로 드래그하세요.</li>
                  <li>모든 속담을 올바르게 연결하면 게임이 완료됩니다.</li>
                  <li>난이도에 따라 문제 수와 속담의 복잡도가 달라집니다.</li>
                </ol>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 w-full"
                  onClick={() => setShowInstructions(false)}
                >
                  확인
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {!gameStarted && !gameCompleted ? (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-2">속담 연결 게임</h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    속담의 앞부분과 뒷부분을 올바르게 연결해보세요!
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      난이도 선택
                    </label>
                    <Select 
                      value={difficulty} 
                      onValueChange={handleDifficultyChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="난이도 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">쉬움 (5문제)</SelectItem>
                        <SelectItem value="medium">보통 (8문제)</SelectItem>
                        <SelectItem value="hard">어려움 (12문제)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={startGame}
                    className="w-full"
                  >
                    게임 시작하기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : gameCompleted ? (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center mb-4">
                  <Trophy className="h-16 w-16 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold">게임 완료!</h2>
                <p className="text-lg">
                  점수: <span className="font-bold">{score}</span> / {totalQuestions}
                </p>
                
                <div className="py-4">
                  {score === totalQuestions ? (
                    <Badge className="bg-green-500 hover:bg-green-600 px-3 py-1 text-white">
                      완벽해요! 🎉
                    </Badge>
                  ) : score >= totalQuestions * 0.7 ? (
                    <Badge className="bg-blue-500 hover:bg-blue-600 px-3 py-1 text-white">
                      잘했어요! 👍
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-500 hover:bg-orange-600 px-3 py-1 text-white">
                      다시 도전해보세요! 💪
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-3 pt-2">
                  <Button 
                    onClick={startGame}
                    className="w-full"
                  >
                    같은 난이도로 다시 시작
                  </Button>
                  <Button 
                    onClick={restartGame}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    난이도 변경하기
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <ConnectionGame 
            proverbs={gameProverbs}
            onComplete={handleGameComplete}
          />
        )}
      </div>

      {/* 모바일 하단 내비게이션 */}
      <BottomNavigation />
    </div>
  );
} 