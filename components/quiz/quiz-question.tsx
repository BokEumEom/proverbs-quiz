import { memo, ReactNode } from "react"
import { motion } from "framer-motion"
import { Music } from "lucide-react"

interface QuizQuestionProps {
  question: string
  icon?: ReactNode
}

const QuizQuestion = memo(({ question, icon }: QuizQuestionProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="flex items-center gap-3 text-xl font-medium text-center mb-8 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800 w-full"
  >
    {icon || <Music className="h-6 w-6 text-purple-500" />}
    <span>{question}</span>
  </motion.div>
))

QuizQuestion.displayName = "QuizQuestion"

export default QuizQuestion 