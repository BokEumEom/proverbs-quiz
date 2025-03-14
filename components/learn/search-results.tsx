import { useState } from "react";
import { Proverb } from "@/types/proverb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface SearchResultsProps {
  results: Proverb[];
  searchTerm: string;
  onProverbClick: (proverbId: number) => void;
  isProverbSaved: (proverbId: number) => boolean;
  onToggleSave: (proverb: Proverb, isSaved: boolean) => void;
  onClearSearch: () => void;
}

export function SearchResults({
  results,
  searchTerm,
  onProverbClick,
  isProverbSaved,
  onToggleSave,
  onClearSearch
}: SearchResultsProps) {
  if (!searchTerm.trim()) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="mb-6"
      >
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg">검색 결과</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClearSearch}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {results.length > 0 ? (
              <div className="space-y-3">
                {results.map((proverb) => (
                  <motion.div
                    key={proverb.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
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
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500">"{searchTerm}"에 대한 검색 결과가 없습니다.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
} 