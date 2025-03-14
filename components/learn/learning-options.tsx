import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ReactNode } from "react";

interface LearningOption {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  color: string;
}

interface LearningOptionsProps {
  options: LearningOption[];
}

export function LearningOptions({ options }: LearningOptionsProps) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-3">학습 게임</h2>
      <div className="grid gap-3">
        {options.map((option, index) => (
          <Link href={option.href} key={index}>
            <Card className="border-0 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center">
                <div className={`${option.color} p-3 rounded-full mr-4`}>
                  {option.icon}
                </div>
                <div>
                  <p className="font-medium">{option.title}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {option.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 