import { Clock, Heart } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Proverb } from "@/constants/proverbs";
import { motion } from "framer-motion";

interface RecentProverbsTabProps {
  recentProverbs: Proverb[];
  onProverbClick: (proverbId: number) => void;
  isProverbSaved: (proverbId: number) => boolean;
  onToggleSave: (proverb: Proverb, isSaved: boolean) => void;
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

export function RecentProverbsTab({ 
  recentProverbs, 
  onProverbClick, 
  isProverbSaved, 
  onToggleSave 
}: RecentProverbsTabProps) {
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">최근 학습</CardTitle>
        <Clock className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        {recentProverbs.length > 0 ? (
          <motion.div 
            className="space-y-4"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {recentProverbs.map((proverb) => (
              <motion.div 
                key={proverb.id} 
                className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative"
                onClick={() => onProverbClick(proverb.id)}
                variants={item}
              >
                <p className="font-medium pr-8">{proverb.text}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{proverb.meaning}</p>
                <button 
                  className="absolute top-3 right-3 p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(proverb, isProverbSaved(proverb.id));
                  }}
                >
                  {isProverbSaved(proverb.id) ? (
                    <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  ) : (
                    <Heart className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-8 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">최근 학습한 속담이 없습니다.</p>
            <p className="text-sm text-gray-400 mt-1">속담을 클릭하여 학습을 시작하세요.</p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
} 