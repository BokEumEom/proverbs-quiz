import { Button } from "@/components/ui/button";
import { Award, RotateCcw } from "lucide-react";

interface LearningCompleteProps {
  totalCount: number;
  knownCount: number;
  reviewCount: number;
  onRestart: () => void;
}

export default function LearningComplete({ 
  totalCount, 
  knownCount, 
  reviewCount, 
  onRestart 
}: LearningCompleteProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-md">
      <div className="mb-6 bg-amber-100 dark:bg-amber-900/30 p-4 rounded-full">
        <Award className="h-12 w-12 text-amber-500" />
      </div>
      
      <h2 className="text-xl font-bold mb-4">학습 완료!</h2>
      
      <p className="text-center mb-6">
        총 {totalCount}개 중 {knownCount}개를 알고 있고, 
        {reviewCount}개를 다시 볼 예정입니다.
      </p>
      
      <div className="grid grid-cols-2 gap-4 w-full mb-6">
        <div className="p-4 bg-green-100 dark:bg-green-900/30 rounded-lg text-center">
          <p className="text-2xl font-bold">{knownCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">알고 있음</p>
        </div>
        <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-center">
          <p className="text-2xl font-bold">{reviewCount}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">복습 필요</p>
        </div>
      </div>
      
      <Button 
        onClick={onRestart}
        className="w-full flex items-center justify-center gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        다시 학습하기
      </Button>
    </div>
  );
} 