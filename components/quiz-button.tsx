import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface QuizButtonProps {
  onClick: () => void
  isSelected?: boolean
  isCorrect?: boolean
  isWrong?: boolean
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export default function QuizButton({
  onClick,
  isSelected,
  isCorrect,
  isWrong,
  disabled,
  children,
  className,
}: QuizButtonProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Button
        onClick={onClick}
        disabled={disabled}
        className={cn(
          "w-full py-6 text-lg font-medium transition-all duration-200",
          isSelected && "ring-2 ring-offset-2",
          isCorrect && "bg-green-500 hover:bg-green-600 text-white",
          isWrong && "bg-red-500 hover:bg-red-600 text-white",
          !isSelected && !isCorrect && !isWrong && "bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700",
          className
        )}
      >
        {children}
      </Button>
    </motion.div>
  )
} 