"use client";

import { AlertCircle, Menu } from "lucide-react";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { useSidebar } from "@/components/sidebar/sidebar-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { LoadingScreen } from "@/components/loading-screen";


export function DashboardShell({ children }: { children: React.ReactNode }) {
  const { loading, loadError, meta } = useDashboard();
  const { toggle, open } = useSidebar();

  if (loading) return <LoadingScreen />;

  if (loadError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 text-destructive">
        <AlertCircle className="size-6" />
        <p className="text-sm font-medium">שגיאה בטעינת הנתונים</p>
        <pre className="max-w-lg text-xs opacity-70">{loadError}</pre>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--background)" }}>
      {/* ── Sticky frosted header ─────────────────────────────── */}
      <header
        className="sticky top-0 z-30"
        style={{
          borderBottom: "1px solid color-mix(in oklch, var(--border) 75%, transparent)",
          background: "color-mix(in oklch, var(--background) 82%, transparent)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          boxShadow: "0 1px 0 color-mix(in oklch, var(--border) 55%, transparent)",
        }}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-3.5">
          {/* Hamburger — mobile only (sidebar opens) */}
          <button
            type="button"
            onClick={toggle}
            aria-label={open ? "סגור תפריט ניווט" : "פתח תפריט ניווט"}
            aria-expanded={open}
            aria-controls="mobile-nav-drawer"
            className="flex size-9 items-center justify-center rounded-full transition-all duration-200 hover:bg-muted md:hidden"
            style={{ color: "var(--muted-foreground)" }}
          >
            <Menu className="size-5" aria-hidden />
          </button>

          {/* Title + meta — centred on mobile, start on desktop */}
          <div className="flex flex-1 items-center gap-2 md:flex-none">
            <h1 className="text-sm font-bold tracking-tight">הנחה מושכלת</h1>
            {meta && (
              <span className="hidden text-xs sm:inline" style={{ color: "var(--muted-foreground)" }}>
                {meta.lotteryRowCount} הגרלות · {meta.marketRowCount} ערים
              </span>
            )}
          </div>

          {/* Theme toggle — always visible on right */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── Page content ─────────────────────────────────────── */}
      <main id="main-content" className="px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}
