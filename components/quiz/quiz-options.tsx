import { motion, AnimatePresence } from "framer-motion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useMemo, useEffect, useState } from "react"

interface QuizOptionsProps {
  options?: string[]
  selectedAnswer: number | null
  showExplanation: boolean
  onSelectAnswer: (index: number) => void
  themeColor?: string
  correctOption?: string
}

export default function QuizOptions({ 
  options = [], 
  selectedAnswer, 
  showExplanation, 
  onSelectAnswer,
  themeColor = "bg-purple-100 dark:bg-purple-900/30 border-purple-500",
  correctOption
}: QuizOptionsProps) {
  const [shuffledOptions, setShuffledOptions] = useState<Array<{text: string, originalIndex: number}>>([]);
  
  useEffect(() => {
    if (options.length === 0) return;
    
    const optionsWithIndex = options.map((text, originalIndex) => ({
      text,
      originalIndex
    }));
    
    const shuffled = [...optionsWithIndex].sort(() => Math.random() - 0.5);
    setShuffledOptions(shuffled);
  }, [options]);

  const handleOptionSelect = (shuffledIndex: number) => {
    if (shuffledIndex >= 0 && shuffledIndex < shuffledOptions.length) {
      onSelectAnswer(shuffledOptions[shuffledIndex].originalIndex);
    }
  };
  
  const currentShuffledIndex = useMemo(() => {
    if (selectedAnswer === null) return null;
    return shuffledOptions.findIndex(option => option.originalIndex === selectedAnswer);
  }, [selectedAnswer, shuffledOptions]);

  return (
    <RadioGroup
      value={currentShuffledIndex?.toString()}
      onValueChange={(value) => !showExplanation && handleOptionSelect(Number.parseInt(value))}
      className="w-full space-y-3"
    >
      <AnimatePresence>
        {shuffledOptions.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-colors ${
              currentShuffledIndex === index ? themeColor : ""
            }`}
            onClick={() => !showExplanation && handleOptionSelect(index)}
          >
            <RadioGroupItem value={index.toString()} id={`option-${index}`} className="sr-only" />
            <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
              {option.text}
            </Label>
          </motion.div>
        ))}
      </AnimatePresence>
    </RadioGroup>
  )
} 