import { memo } from "react"
import { motion } from "framer-motion"

interface ExplanationBoxProps {
  isCorrect: boolean
  explanation: string
  correctOption?: string
}

const ExplanationBox = memo(({ isCorrect, explanation, correctOption }: ExplanationBoxProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="w-full p-4 rounded-lg bg-gray-50 dark:bg-gray-800 border"
  >
    <div
      className={`text-lg font-medium mb-2 ${isCorrect ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
    >
      {isCorrect ? "정답입니다!" : "오답입니다!"}
    </div>
    {correctOption && (
      <p>
        정답: <strong>{correctOption}</strong>
      </p>
    )}
    <p className="mt-2">{explanation}</p>
  </motion.div>
))

ExplanationBox.displayName = "ExplanationBox"

export default ExplanationBox 