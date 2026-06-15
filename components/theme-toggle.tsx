"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { log } from "@/lib/logger";

export function ThemeToggle() {
  const [dark, setDark] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    // Read the class that the anti-FOUC script set
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* storage blocked */
    }
    log("UI_ACTION", "theme toggled", { dark: next });
  }

  // Render a stable placeholder until mounted to avoid hydration mismatch
  if (!mounted) {
    return <div className="size-9" />;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggle}
      aria-label={dark ? "עבור למצב בהיר" : "עבור למצב כהה"}
      className="rounded-full transition-all duration-300 hover:scale-110"
    >
      {dark ? (
        <Sun className="size-4 text-amber-400" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  );
}
