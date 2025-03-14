import Link from "next/link";
import { BookOpen, Bookmark, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PROVERBS_DATA } from "@/constants/proverbs";
import { motion } from "framer-motion";

interface BrowseProverbsTabProps {
  savedProverbsCount: number;
}

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

export function BrowseProverbsTab({ savedProverbsCount }: BrowseProverbsTabProps) {
  return (
    <motion.div 
      className="space-y-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item}>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/learn/all">
            <Card className="bg-blue-50 dark:bg-blue-900/20 border-0 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                <BookOpen className="h-6 w-6 text-blue-500 mb-2" />
                <p className="font-medium">모든 속담</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{PROVERBS_DATA.length}개</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/learn/saved">
            <Card className="bg-purple-50 dark:bg-purple-900/20 border-0 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer h-full">
              <CardContent className="p-4 flex flex-col items-center justify-center h-full">
                <Bookmark className="h-6 w-6 text-purple-500 mb-2" />
                <p className="font-medium">저장한 속담</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{savedProverbsCount}개</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </motion.div>
      
      <motion.div variants={item}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">속담 카테고리</CardTitle>
            <CardDescription>주제별로 속담을 찾아보세요</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="justify-start">
                <Layers className="h-4 w-4 mr-2" />
                인생 교훈
              </Button>
              <Button variant="outline" className="justify-start">
                <Layers className="h-4 w-4 mr-2" />
                인간 관계
              </Button>
              <Button variant="outline" className="justify-start">
                <Layers className="h-4 w-4 mr-2" />
                행동과 결과
              </Button>
              <Button variant="outline" className="justify-start">
                <Layers className="h-4 w-4 mr-2" />
                지혜와 지식
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={item} className="text-center">
        <Link href="/learn/all">
          <Button className="w-full">
            모든 속담 보기
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
} 