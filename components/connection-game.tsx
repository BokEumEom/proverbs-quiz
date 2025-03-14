"use client"

import { useState, useMemo, useEffect } from "react";
import { Proverb } from "@/constants/proverbs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, HelpCircle, ArrowDown } from "lucide-react";
import { motion, AnimatePresence, Reorder } from "framer-motion";

interface ConnectionGameProps {
  proverbs: Proverb[];
  onComplete: (score: number) => void;
}

interface ProverbPart {
  id: string;
  text: string;
  proverbId: number;
  isFirst: boolean;
}

export default function ConnectionGame({ proverbs, onComplete }: ConnectionGameProps) {
  const [selectedFirstPart, setSelectedFirstPart] = useState<ProverbPart | null>(null);
  const [completedConnections, setCompletedConnections] = useState<number[]>([]);
  const [firstPartItems, setFirstPartItems] = useState<ProverbPart[]>([]);
  const [secondPartItems, setSecondPartItems] = useState<ProverbPart[]>([]);
  const [showFeedback, setShowFeedback] = useState<{
    proverbId: number;
    isCorrect: boolean;
    meaning: string;
  } | null>(null);
  
  // 속담을 앞/뒤로 분리
  useEffect(() => {
    const parts: ProverbPart[] = [];
    
    proverbs.forEach(proverb => {
      const text = proverb.text;
      // 속담을 중간 지점에서 분리 (공백 기준)
      const words = text.split(' ');
      const midPoint = Math.ceil(words.length / 2);
      
      const firstPart = words.slice(0, midPoint).join(' ');
      const secondPart = words.slice(midPoint).join(' ');
      
      parts.push({
        id: `first-${proverb.id}`,
        text: firstPart,
        proverbId: proverb.id,
        isFirst: true
      });
      
      parts.push({
        id: `second-${proverb.id}`,
        text: secondPart,
        proverbId: proverb.id,
        isFirst: false
      });
    });
    
    // 앞부분과 뒷부분 분리 및 섞기
    const firstParts = parts
      .filter(part => part.isFirst)
      .sort(() => Math.random() - 0.5);
    
    const secondParts = parts
      .filter(part => !part.isFirst)
      .sort(() => Math.random() - 0.5);
    
    setFirstPartItems(firstParts);
    setSecondPartItems(secondParts);
  }, [proverbs]);
  
  // 앞부분 선택 핸들러
  const handleSelectFirstPart = (part: ProverbPart) => {
    if (completedConnections.includes(part.proverbId)) return;
    setSelectedFirstPart(prev => prev?.id === part.id ? null : part);
  };
  
  // 뒷부분 선택 핸들러
  const handleSelectSecondPart = (part: ProverbPart) => {
    if (!selectedFirstPart || completedConnections.includes(part.proverbId)) return;
    
    // 정답 확인
    const isCorrect = selectedFirstPart.proverbId === part.proverbId;
    
    if (isCorrect) {
      // 정답인 경우 완료된 연결에 추가
      setCompletedConnections(prev => [...prev, selectedFirstPart.proverbId]);
      
      // 피드백 표시
      const proverb = proverbs.find(p => p.id === selectedFirstPart.proverbId);
      if (proverb) {
        setShowFeedback({
          proverbId: proverb.id,
          isCorrect: true,
          meaning: proverb.meaning
        });
      }
    } else {
      // 오답인 경우 피드백 표시
      const proverb = proverbs.find(p => p.id === selectedFirstPart.proverbId);
      if (proverb) {
        setShowFeedback({
          proverbId: selectedFirstPart.proverbId,
          isCorrect: false,
          meaning: ''
        });
      }
    }
    
    setSelectedFirstPart(null);
  };
  
  // 피드백 닫기
  const closeFeedback = () => {
    setShowFeedback(null);
    
    // 모든 연결이 완료되었는지 확인
    if (completedConnections.length === proverbs.length) {
      onComplete(completedConnections.length);
    }
  };
  
  // 남은 문제 수 계산
  const remainingCount = proverbs.length - completedConnections.length;
  
  return (
    <div className="space-y-6">
      {/* 진행 상황 표시 */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-bold text-lg">진행 상황</h3>
          <span className="text-sm font-medium px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
            {completedConnections.length}/{proverbs.length} 완료
          </span>
        </div>
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${(completedConnections.length / proverbs.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        {/* 게임 설명 */}
        {remainingCount > 0 && (
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              앞부분을 선택하고 맞는 뒷부분을 선택하세요
            </p>
            <div className="flex justify-center">
              <ArrowDown className="h-6 w-6 text-gray-400 animate-bounce" />
            </div>
          </div>
        )}
        
        {/* 앞부분 목록 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h4 className="text-md font-medium mb-3 text-blue-600 dark:text-blue-400 flex items-center">
            <div className="w-2 h-6 bg-blue-500 rounded-full mr-2"></div>
            속담 앞부분
          </h4>
          <Reorder.Group 
            axis="y" 
            values={firstPartItems} 
            onReorder={setFirstPartItems}
            className="space-y-2"
          >
            {firstPartItems.map(part => {
              const isCompleted = completedConnections.includes(part.proverbId);
              const isSelected = selectedFirstPart?.id === part.id;
              
              if (isCompleted) return null;
              
              return (
                <Reorder.Item
                  key={part.id}
                  value={part}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-all
                    ${isSelected 
                      ? 'bg-blue-100 dark:bg-blue-900/30 border-2 border-blue-500' 
                      : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'}
                  `}
                  onClick={() => handleSelectFirstPart(part)}
                  whileDrag={{ 
                    scale: 1.05,
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                    cursor: "grabbing"
                  }}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.1}
                >
                  {part.text}
                </Reorder.Item>
              );
            })}
            
            {firstPartItems.filter(part => !completedConnections.includes(part.proverbId)).length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <p>모든 앞부분을 연결했습니다!</p>
              </div>
            )}
          </Reorder.Group>
        </div>
        
        {/* 뒷부분 목록 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <h4 className="text-md font-medium mb-3 text-green-600 dark:text-green-400 flex items-center">
            <div className="w-2 h-6 bg-green-500 rounded-full mr-2"></div>
            속담 뒷부분
          </h4>
          <Reorder.Group 
            axis="y" 
            values={secondPartItems} 
            onReorder={setSecondPartItems}
            className="space-y-2"
          >
            {secondPartItems.map(part => {
              const isCompleted = completedConnections.includes(part.proverbId);
              
              if (isCompleted) return null;
              
              return (
                <Reorder.Item
                  key={part.id}
                  value={part}
                  className={`
                    p-3 rounded-lg transition-all
                    ${selectedFirstPart 
                      ? 'bg-green-50 dark:bg-green-900/20 border-2 border-dashed border-green-500 cursor-pointer' 
                      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'}
                  `}
                  onClick={() => handleSelectSecondPart(part)}
                  whileDrag={{ 
                    scale: 1.05,
                    boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
                    cursor: "grabbing"
                  }}
                  dragConstraints={{ top: 0, bottom: 0 }}
                  dragElastic={0.1}
                >
                  {part.text}
                </Reorder.Item>
              );
            })}
            
            {secondPartItems.filter(part => !completedConnections.includes(part.proverbId)).length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <p>모든 뒷부분을 연결했습니다!</p>
              </div>
            )}
          </Reorder.Group>
        </div>
        
        {/* 완료된 연결 */}
        {completedConnections.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
            <h4 className="text-md font-medium mb-3 text-purple-600 dark:text-purple-400 flex items-center">
              <div className="w-2 h-6 bg-purple-500 rounded-full mr-2"></div>
              완료된 속담
            </h4>
            <div className="space-y-2">
              {completedConnections.map(proverbId => {
                const proverb = proverbs.find(p => p.id === proverbId);
                if (!proverb) return null;
                
                return (
                  <motion.div
                    key={`completed-${proverbId}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800"
                  >
                    <p className="font-medium">{proverb.text}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{proverb.meaning}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
      
      {/* 피드백 모달 */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  {showFeedback.isCorrect ? (
                    <>
                      <div className="flex justify-center">
                        <div className="rounded-full bg-green-100 p-3">
                          <Check className="h-8 w-8 text-green-600" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-green-600">정답입니다!</h3>
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <p className="font-medium mb-2">
                          {proverbs.find(p => p.id === showFeedback.proverbId)?.text}
                        </p>
                        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <HelpCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <p className="text-left">{showFeedback.meaning}</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-center">
                        <div className="rounded-full bg-red-100 p-3">
                          <X className="h-8 w-8 text-red-600" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-red-600">틀렸습니다!</h3>
                      <p>다시 시도해보세요.</p>
                    </>
                  )}
                  
                  <Button 
                    onClick={closeFeedback}
                    className="w-full"
                  >
                    확인
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 