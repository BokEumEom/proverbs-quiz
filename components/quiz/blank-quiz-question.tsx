import { motion } from "framer-motion"
import { Square } from "lucide-react"
import React, { useMemo } from "react"

interface BlankQuizQuestionProps {
  question: string
  answer?: string
  showAnswer?: boolean
  iconColor?: string
}

// 텍스트 파트 타입 정의
interface TextPart {
  text: string;
  isBlank: boolean;
  blankIndex?: number;
  boxCount?: number;
}

const BlankQuizQuestion = ({ 
  question, 
  answer = "", 
  showAnswer = false,
  iconColor = "text-amber-500"
}: BlankQuizQuestionProps) => {
  // 실제 표시할 글자 수 계산 (따옴표 제외)
  const effectiveAnswerLength = useMemo(() => {
    // 따옴표를 제외한 실제 글자 수 계산
    const strippedAnswer = answer.replace(/['"]/g, '');
    return strippedAnswer.length;
  }, [answer]);
  
  // 빈칸 앞뒤로 텍스트 분리
  const parts = useMemo(() => {
    // 빈칸 패턴 (___로 표시된 부분)
    const blankPattern = /___+/g;
    
    // 빈칸 위치 찾기
    const matches = [...question.matchAll(blankPattern)];
    
    if (matches.length === 0) {
      return [{ text: question, isBlank: false }] as TextPart[];
    }
    
    const result: TextPart[] = [];
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
        // 따옴표를 제외한 실제 글자 수만큼 네모칸 생성 (최소 1개 보장)
        boxCount: Math.max(1, effectiveAnswerLength)
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
  }, [question, effectiveAnswerLength]);

  // 디버깅용 로그 (개발 환경에서만 표시)
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Question: "${question}", Answer: "${answer}", Effective Length: ${effectiveAnswerLength}, Boxes: ${effectiveAnswerLength}`);
    }
  }, [question, answer, effectiveAnswerLength]);

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
                aria-label={`빈칸 (${effectiveAnswerLength}글자)`}
                data-answer-length={effectiveAnswerLength}
              >
                {/* 네모칸 - 실제 글자 수만큼 생성 */}
                {Array(part.boxCount || 1).fill(0).map((_, i) => (
                  <motion.span 
                    key={i} 
                    className={`inline-block w-6 h-6 border rounded-sm ${
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
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className={`
                      text-green-700 dark:text-green-400 font-bold
                      ${effectiveAnswerLength > 2 ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'}
                    `}>
                      {answer}
                    </span>
                  </motion.div>
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