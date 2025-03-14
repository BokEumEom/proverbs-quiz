import React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Trophy, User, BookOpen, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

export default function BottomNavigation() {
  const pathname = usePathname()

  const navItems: NavItem[] = [
    {
      label: "홈",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: "랭킹",
      href: "/leaderboard",
      icon: <Trophy className="h-5 w-5" />,
    },
    {
      label: "학습",
      href: "/learn",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      label: "프로필",
      href: "/profile",
      icon: <User className="h-5 w-5" />,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t">
      <div className="grid grid-cols-4 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href} className="flex flex-col items-center py-2 px-1">
              <div
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-xl",
                  isActive 
                    ? "text-blue-500 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40" 
                    : "text-gray-500 dark:text-gray-400"
                )}
              >
                {item.icon}
                <span className="text-xs mt-1">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
} 