import { useState } from "react";
import { motion } from "framer-motion";
import { Proverb } from "@/constants/proverbs";

interface ProverbCardProps {
  proverb: Proverb;
  onKnown: () => void;
  onReview: () => void;
}

export default function ProverbCard({ proverb, onKnown, onReview }: ProverbCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="relative h-64 w-full cursor-pointer perspective-1000 mx-auto max-w-md"
      onClick={handleFlip}
    >
      <motion.div 
        className="relative w-full h-full preserve-3d transition-all duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* 카드 앞면 - 속담 */}
        <motion.div 
          className="absolute w-full h-full backface-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg p-6 flex flex-col items-center justify-center"
        >
          <h2 className="text-xl font-bold text-center">{proverb.text}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">탭하여 뜻 보기</p>
          <div className="absolute bottom-3 right-3 text-xs text-gray-400">
            {proverb.difficulty === "easy" ? "쉬움" : 
             proverb.difficulty === "medium" ? "보통" : "어려움"}
          </div>
        </motion.div>

        {/* 카드 뒷면 - 의미 */}
        <motion.div 
          className="absolute w-full h-full backface-hidden rounded-xl bg-amber-50 dark:bg-amber-900/20 shadow-lg p-6 flex flex-col items-center justify-center rotate-y-180"
        >
          <p className="text-center mb-6">{proverb.meaning}</p>
          <div className="flex gap-3 mt-4">
            <button 
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onReview();
              }}
            >
              다시 볼게요
            </button>
            <button 
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onKnown();
              }}
            >
              알고 있어요
            </button>
          </div>
          <div className="absolute bottom-3 left-3 flex gap-1 flex-wrap">
            {proverb.category?.map((cat, index) => (
              <span key={index} className="text-xs bg-amber-200 dark:bg-amber-800 px-2 py-1 rounded-full">
                {cat}
              </span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
} 