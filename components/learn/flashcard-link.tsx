import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function FlashcardLink() {
  return (
    <Link href="/learn/flashcards">
      <Card className="mb-6 bg-amber-50 dark:bg-amber-900/20 border-0 hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors cursor-pointer">
        <CardContent className="p-4 flex items-center">
          <div className="bg-amber-100 dark:bg-amber-800/50 p-3 rounded-full mr-4">
            <BookOpen className="h-6 w-6 text-amber-600 dark:text-amber-300" />
          </div>
          <div>
            <p className="font-medium">플래시카드로 학습하기</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              카드를 넘기며 속담을 효과적으로 학습하세요
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 