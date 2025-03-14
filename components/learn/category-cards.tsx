import Link from "next/link";
import { BookOpen, Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PROVERBS_DATA } from "@/constants/proverbs";

interface CategoryCardsProps {
  savedProverbsCount: number;
}

export function CategoryCards({ savedProverbsCount }: CategoryCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 mb-6">
      <Link href="/learn/all">
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-0 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer">
          <CardContent className="p-4 flex flex-col items-center">
            <BookOpen className="h-6 w-6 text-blue-500 mb-2" />
            <p className="font-medium">모든 속담</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{PROVERBS_DATA.length}개</p>
          </CardContent>
        </Card>
      </Link>
      <Link href="/learn/saved">
        <Card className="bg-purple-50 dark:bg-purple-900/20 border-0 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer">
          <CardContent className="p-4 flex flex-col items-center">
            <Bookmark className="h-6 w-6 text-purple-500 mb-2" />
            <p className="font-medium">저장한 속담</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{savedProverbsCount}개</p>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
} 