"use client";

import { useEffect, useState } from "react";
import { Switch } from "./Switch";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else {
      // If no stored theme, check system preference
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="fixed top-4 right-4 flex items-center gap-2 p-2 rounded-lg  transition-colors">
      <SunIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
      <Switch checked={theme === "dark"} onChange={toggleTheme} />
      <MoonIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
    </div>
  );
}
