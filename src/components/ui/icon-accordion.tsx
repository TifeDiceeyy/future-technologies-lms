import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccordionItem {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
}

interface AccordionComponentProps {
  items: AccordionItem[];
}

export function AccordionComponent({ items }: AccordionComponentProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div className="w-full divide-y divide-border rounded-xl border border-border overflow-hidden">
      {items.map((item, i) => {
        const Icon = item.icon;
        const isOpen = openIndex === i;

        return (
          <div key={item.title} className="bg-card">
            <button
              onClick={() => toggle(i)}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-secondary/50",
                isOpen && "bg-secondary/30",
              )}
            >
              {/* Icon badge */}
              <div
                className={cn(
                  "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg",
                  item.iconBg,
                )}
              >
                <Icon size={18} className="text-foreground" />
              </div>

              {/* Title */}
              <span className="flex-1 text-sm font-semibold text-foreground">
                {item.title}
              </span>

              {/* Chevron */}
              <ChevronDown
                size={16}
                className={cn(
                  "flex-shrink-0 text-muted-foreground transition-transform duration-300",
                  isOpen && "rotate-180",
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed pl-[4.25rem]">
                    {item.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
