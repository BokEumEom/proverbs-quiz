import { Clock, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Proverb } from "@/constants/proverbs";

interface RecentProverbsProps {
  recentProverbs: Proverb[];
  onProverbClick: (proverbId: number) => void;
  isProverbSaved: (proverbId: number) => boolean;
  onToggleSave: (proverb: Proverb, isSaved: boolean) => void;
}

export function RecentProverbs({ 
  recentProverbs, 
  onProverbClick, 
  isProverbSaved, 
  onToggleSave 
}: RecentProverbsProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg">최근 학습</CardTitle>
        <Clock className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentProverbs.length > 0 ? (
            recentProverbs.map((proverb) => (
              <div 
                key={proverb.id} 
                className="p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors relative"
                onClick={() => onProverbClick(proverb.id)}
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
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>최근 학습한 속담이 없습니다.</p>
              <p className="text-sm mt-1">속담을 클릭하여 학습을 시작하세요.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 