import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") !== "light",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="
        relative flex items-center justify-center
        w-9 h-9 rounded-full
        bg-gray-100 dark:bg-[#1E1E3F]
        border border-gray-200 dark:border-[#2D2D4E]
        text-gray-600 dark:text-gray-300
        hover:bg-indigo-50 dark:hover:bg-indigo-900/30
        hover:border-indigo-200 dark:hover:border-indigo-700
        hover:text-indigo-600 dark:hover:text-indigo-400
        transition-all duration-200
        focus-visible:outline-none focus-visible:ring-2
        focus-visible:ring-indigo-500 focus-visible:ring-offset-2
        focus-visible:ring-offset-white dark:focus-visible:ring-offset-[#0F0F1A]
        active:scale-95
      "
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span
        className="absolute transition-all duration-300"
        style={{
          opacity: dark ? 1 : 0,
          transform: dark
            ? "rotate(0deg) scale(1)"
            : "rotate(90deg) scale(0.5)",
        }}
      >
        <Sun className="w-4 h-4" />
      </span>
      <span
        className="absolute transition-all duration-300"
        style={{
          opacity: dark ? 0 : 1,
          transform: dark
            ? "rotate(-90deg) scale(0.5)"
            : "rotate(0deg) scale(1)",
        }}
      >
        <Moon className="w-4 h-4" />
      </span>
    </button>
  );
}
