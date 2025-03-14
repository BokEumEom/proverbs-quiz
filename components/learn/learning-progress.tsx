import { GraduationCap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

interface LearningProgressProps {
  totalProverbs: number;
  savedProverbsCount: number;
  recentProverbsCount: number;
}

export function LearningProgress({ 
  totalProverbs, 
  savedProverbsCount, 
  recentProverbsCount 
}: LearningProgressProps) {
  const progressPercentage = Math.round((savedProverbsCount / totalProverbs) * 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-blue-500" />
            학습 진행 상황
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>전체 속담</span>
              <span className="font-medium">{totalProverbs}개</span>
            </div>
            <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <p className="text-lg font-bold">{savedProverbsCount}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">저장됨</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <p className="text-lg font-bold">{recentProverbsCount}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">최근 학습</p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <p className="text-lg font-bold">{progressPercentage}%</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">진행률</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 