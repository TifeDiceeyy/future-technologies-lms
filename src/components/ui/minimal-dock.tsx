import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Search, BookOpen, BookMarked, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { id: "home", icon: Home, label: "Home", route: "/home" },
  { id: "search", icon: Search, label: "Search", route: "/search" },
  { id: "courses", icon: BookOpen, label: "Courses", route: "/courses" },
  { id: "library", icon: BookMarked, label: "Library", route: "/library" },
  { id: "account", icon: User, label: "Account", route: "/profile" },
];

export function MinimalDock() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-card/80 backdrop-blur-xl border border-border shadow-lg">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.route;
        const isHovered = hoveredId === item.id;

        return (
          <div
            key={item.id}
            className="relative flex flex-col items-center"
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {/* Tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 4, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-card backdrop-blur border border-border px-2 py-1 text-xs font-medium text-foreground shadow-sm pointer-events-none"
                >
                  {item.label}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Icon button */}
            <motion.button
              onClick={() => navigate(item.route)}
              whileTap={{ scale: 0.88 }}
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-background/5 text-foreground hover:bg-secondary",
              )}
              aria-label={item.label}
            >
              <Icon size={20} />
            </motion.button>

            {/* Active dot */}
            {isActive && (
              <motion.div
                layoutId="dock-active-dot"
                className="mt-1 h-1 w-1 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
