import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, HelpCircle, ListChecks } from "lucide-react"
import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { QuizType } from "@/types"
import { QUIZ_CONFIG } from "@/constants"

interface QuizCardProps {
  type: QuizType
  icon: ReactNode
  href: string
  color: string
  isMobile?: boolean
}

export default function QuizCard({
  type,
  icon,
  href,
  color,
  isMobile = false,
}: QuizCardProps) {
  const config = QUIZ_CONFIG[type]

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border-0 shadow-sm">
      <div className="flex items-center">
        {/* 모바일에 최적화된 카드 레이아웃 */}
        <div className={`${color} text-white p-4 flex items-center justify-center self-stretch rounded-l-lg`}>
          <div className="bg-white/20 p-2 rounded-full">{icon}</div>
        </div>

        <div className="flex-1 p-4">
          <div className="flex flex-col">
            <h3 className="font-bold text-lg">{config.title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{config.description}</p>

            <div className="flex flex-wrap gap-2 mt-3">
              <Badge variant="outline" className="flex items-center gap-1 font-normal text-xs">
                <HelpCircle className="h-3 w-3" />
                {config.difficulty}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 font-normal text-xs">
                <ListChecks className="h-3 w-3" />
                {config.questionCount}개
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1 font-normal text-xs">
                <Clock className="h-3 w-3" />
                {config.estimatedTime}
              </Badge>
            </div>

            <Link href={href} className="mt-3 w-full">
              <Button className={`w-full ${color} hover:opacity-90 text-white border-0`} size="sm">
                시작하기
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Card>
  )
}

