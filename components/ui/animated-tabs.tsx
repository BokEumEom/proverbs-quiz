import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AnimatedTabsProps {
  defaultValue: string;
  tabs: {
    value: string;
    label: string;
    content: ReactNode;
  }[];
  className?: string;
}

export function AnimatedTabs({ defaultValue, tabs, className }: AnimatedTabsProps) {
  return (
    <Tabs defaultValue={defaultValue} className={className}>
      <TabsList className="grid grid-cols-3 mb-4">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="outline-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab.value}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {tab.content}
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      ))}
    </Tabs>
  );
} 