import { motion } from "framer-motion"
import { Square } from "lucide-react"
import React, { useMemo } from "react"

interface BlankQuizQuestionProps {
  question: string
  answer?: string
  showAnswer?: boolean
  iconColor?: string
}

const BlankQuizQuestion = ({ 
  question, 
  answer = "", 
  showAnswer = false,
  iconColor = "text-amber-500"
}: BlankQuizQuestionProps) => {
  // 빈칸 앞뒤로 텍스트 분리
  const parts = useMemo(() => {
    // 빈칸 패턴 (___로 표시된 부분)
    const blankPattern = /___+/g;
    
    // 빈칸 위치 찾기
    const matches = [...question.matchAll(blankPattern)];
    
    if (matches.length === 0) {
      return [{ text: question, isBlank: false }];
    }
    
    const result = [];
    let lastIndex = 0;
    
    matches.forEach((match, index) => {
      // 빈칸 앞 텍스트
      if (match.index > lastIndex) {
        result.push({
          text: question.substring(lastIndex, match.index),
          isBlank: false
        });
      }
      
      // 빈칸 부분
      result.push({
        text: match[0],
        isBlank: true,
        blankIndex: index,
        // 정답의 글자 수만큼 네모칸 생성
        boxCount: answer.length
      });
      
      lastIndex = match.index + match[0].length;
    });
    
    // 마지막 빈칸 이후 텍스트
    if (lastIndex < question.length) {
      result.push({
        text: question.substring(lastIndex),
        isBlank: false
      });
    }
    
    return result;
  }, [question, answer]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex items-center gap-3 text-xl font-medium text-center mb-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 w-full"
      aria-label={`문제: ${question.replace(/___+/g, "빈칸")}`}
    >
      <Square className={`h-6 w-6 ${iconColor} flex-shrink-0`} />
      <span className="flex flex-wrap items-center justify-center">
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {!part.isBlank ? (
              <span>{part.text}</span>
            ) : (
              <span 
                className="inline-flex gap-1 mx-1 my-1 align-middle relative"
                aria-label={`빈칸 (${answer.length}글자)`}
              >
                {/* 네모칸 - 정답의 글자 수만큼 생성 */}
                {Array(part.boxCount).fill(0).map((_, i) => (
                  <motion.span 
                    key={i} 
                    className={`inline-block w-5 h-5 border rounded-sm ${
                      showAnswer 
                        ? "bg-green-100 dark:bg-green-900/30 border-green-500" 
                        : "bg-amber-100 dark:bg-amber-900/30 border-amber-500"
                    }`}
                    initial={showAnswer ? { scale: 0.8 } : {}}
                    animate={showAnswer ? { scale: 1 } : {}}
                    transition={{ delay: i * 0.05 }}
                  />
                ))}
                
                {/* 정답 표시 (showAnswer가 true일 때) */}
                {showAnswer && (
                  <motion.span 
                    className="absolute inset-0 flex items-center justify-center text-green-700 dark:text-green-400 font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    {answer}
                  </motion.span>
                )}
              </span>
            )}
          </React.Fragment>
        ))}
      </span>
    </motion.div>
  );
}

export default BlankQuizQuestion; 