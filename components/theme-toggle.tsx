"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evita el error de hidratación renderizando el botón solo en el cliente
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="w-11 h-11" />; // Placeholder del mismo tamaño

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative w-11 h-11 flex items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-[#2952F5] dark:focus:ring-blue-400 group"
      aria-label="Alternar modo oscuro"
      title="Alternar apariencia"
    >
      <Sun 
        size={22} 
        className="absolute transition-all duration-500 ease-in-out scale-100 rotate-0 opacity-100 dark:scale-0 dark:-rotate-90 dark:opacity-0 text-amber-500 group-hover:text-amber-600" 
      />
      <Moon 
        size={22} 
        className="absolute transition-all duration-500 ease-in-out scale-0 rotate-90 opacity-0 dark:scale-100 dark:rotate-0 dark:opacity-100 text-blue-400 group-hover:text-blue-300" 
      />
    </button>
  );
}
