import Link from "next/link";
import { BookOpen, Puzzle, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function LearningMethodsTab() {
  return (
    <motion.div 
      className="space-y-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* 학습 카드 */}
      <div className="grid grid-cols-1 gap-4">
        {/* 플래시카드 학습 */}
        <motion.div variants={item}>
          <Link href="/learn/flashcards">
            <Card className="overflow-hidden hover:shadow-md transition-all border-0">
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-4 text-white">
                <h3 className="font-bold text-lg">플래시카드 학습</h3>
                <p className="text-sm opacity-90">카드를 넘기며 속담을 효과적으로 학습하세요</p>
              </div>
              <CardContent className="p-4 flex items-center">
                <div className="bg-amber-100 dark:bg-amber-800/50 p-3 rounded-full mr-4">
                  <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    앞면에는 속담, 뒷면에는 의미가 표시됩니다. 카드를 넘기며 학습하고 진행 상황을 추적할 수 있습니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
        
        {/* 속담 연결 게임 */}
        <motion.div variants={item}>
          <Link href="/learn/connection-game">
            <Card className="overflow-hidden hover:shadow-md transition-all border-0">
              <div className="bg-gradient-to-r from-purple-400 to-indigo-500 p-4 text-white">
                <h3 className="font-bold text-lg">속담 연결 게임</h3>
                <p className="text-sm opacity-90">속담의 앞뒤를 연결하는 게임으로 학습하세요</p>
              </div>
              <CardContent className="p-4 flex items-center">
                <div className="bg-purple-100 dark:bg-purple-800/50 p-3 rounded-full mr-4">
                  <Puzzle className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    속담의 앞부분과 뒷부분을 올바르게 연결하는 게임을 통해 속담의 구조를 익힐 수 있습니다.
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
        
        {/* 추가 학습 옵션들 (향후 확장 가능) */}
        <motion.div variants={item}>
          <Card className="overflow-hidden border border-dashed border-gray-300 dark:border-gray-700">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center">
              <Lightbulb className="h-8 w-8 text-gray-400 mb-2" />
              <h3 className="font-medium">더 많은 학습 방법</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                곧 더 많은 학습 방법이 추가될 예정입니다.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
} 