import { Button } from "@/components/ui/button";
import { Award, RotateCcw, BookOpen, RefreshCw } from "lucide-react";

interface LearningCompleteProps {
  totalCount: number;
  knownCount: number;
  reviewCount: number;
  onRestart: () => void;
  onNextBatch: () => void;
  onReviewOnly: () => void;
}

export default function LearningComplete({ 
  totalCount, 
  knownCount, 
  reviewCount, 
  onRestart,
  onNextBatch,
  onReviewOnly
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
      
      <div className="grid grid-cols-1 gap-3 w-full">
        <Button 
          onClick={onNextBatch}
          className="w-full flex items-center justify-center gap-2"
          variant="default"
        >
          <BookOpen className="h-4 w-4" />
          다음 세트 학습하기
        </Button>
        
        {reviewCount > 0 && (
          <Button 
            onClick={onReviewOnly}
            className="w-full flex items-center justify-center gap-2"
            variant="outline"
          >
            <RefreshCw className="h-4 w-4" />
            복습이 필요한 속담만 학습하기
          </Button>
        )}
        
        <Button 
          onClick={onRestart}
          className="w-full flex items-center justify-center gap-2"
          variant="ghost"
        >
          <RotateCcw className="h-4 w-4" />
          처음부터 다시 학습하기
        </Button>
      </div>
    </div>
  );
} 