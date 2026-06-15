"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  LayoutDashboard,
  Accessibility,
  FileText,
  Shield,
  Cookie,
  Scale,
  SlidersHorizontal,
  Ban,
  CheckSquare,
} from "lucide-react";
import { useSidebar } from "./sidebar-provider";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { WeightSlider } from "@/components/controls/weight-slider";
import { PriceRangeSlider } from "@/components/controls/price-range-slider";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV_LINKS = [
  { href: "/",              label: "דשבורד",           icon: LayoutDashboard },
  { href: "/accessibility", label: "הצהרת נגישות",     icon: Accessibility   },
  { href: "/terms",         label: "תנאי שימוש",        icon: FileText        },
  { href: "/privacy",       label: "מדיניות פרטיות",    icon: Shield          },
  { href: "/cookies",       label: "מדיניות עוגיות",    icon: Cookie          },
];

/** Compact spaceship SVG matching the loading-screen aesthetic, 34 px */
function ShipLogo() {
  return (
    <svg width="34" height="34" viewBox="-17 -22 34 38" aria-hidden>
      <ellipse cx="0" cy="17" rx="5" ry="2.8"
        fill="var(--chart-2)" opacity="0.65"
        style={{ filter: "blur(3px)" }}
      />
      <path d="M -5,-3 L -18,4 L -4,6 Z" fill="oklch(0.14 0.06 255)" />
      <path d="M 5,-3 L 18,4 L 4,6 Z"  fill="oklch(0.14 0.06 255)" />
      <path
        d="M 0,-18 L -5,-3 L -4,8 L 0,11 L 4,8 L 5,-3 Z"
        fill="oklch(0.19 0.07 258)"
        stroke="var(--chart-1)"
        strokeWidth="0.7"
      />
      <circle cx="-22" cy="4" r="1.4" fill="var(--chart-2)" opacity="0.8" />
      <circle cx="22"  cy="4" r="1.4" fill="var(--chart-2)" opacity="0.8" />
      <circle cx="0" cy="-10" r="4.8"
        fill="oklch(0.52 0.22 218)"
        stroke="var(--chart-1)"
        strokeWidth="0.5"
      />
      <circle cx="0" cy="-10" r="4.8"
        fill="var(--chart-2)" opacity="0.28"
        style={{ filter: "blur(2px)" }}
      />
      <ellipse cx="-1.5" cy="-12" rx="2" ry="1.3" fill="rgba(255,255,255,0.40)" />
      <line x1="0" y1="-18" x2="0" y2="-22"
        stroke="var(--chart-1)" strokeWidth="0.7" opacity="0.65"
      />
      <circle cx="0" cy="-23" r="1.1" fill="var(--chart-2)" />
    </svg>
  );
}

function StatPill({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      className="flex-1 rounded-xl p-2.5 text-center"
      style={{ background: "color-mix(in oklch, var(--muted) 55%, transparent)" }}
    >
      <div className="text-[10px] text-muted-foreground">{label}</div>
      <div className="text-lg font-black tabular-nums" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function SidebarInner({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const {
    computation,
    excludedCities,
    selectedCities,
    toggleExcludeCity,
    toggleSelectCity,
    clearSelectedCities,
  } = useDashboard();

  const cityCount    = computation.cities.length;
  const lotteryCount = computation.totalAfterFilter;

  return (
    <div className="flex h-full flex-col" style={{ minHeight: 0 }}>

      {/* ── Logo header ─────────────────────────────────────── */}
      <div
        className="relative flex shrink-0 items-center justify-between gap-2 px-4 py-4"
        style={{
          borderBottom:
            "1px solid color-mix(in oklch, var(--border) 70%, transparent)",
        }}
      >
        {/* Top accent hairline */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-[2.5px] rounded-t-none"
          style={{
            background:
              "linear-gradient(90deg, var(--chart-1), var(--chart-2), transparent)",
          }}
        />

        <div className="flex items-center gap-2.5">
          <ShipLogo />
          <div>
            <div className="text-[12px] font-bold leading-tight">הנחה מושכלת</div>
            <div
              className="text-[10px] leading-tight"
              style={{ color: "var(--muted-foreground)" }}
            >
              הדרך לדיור המשתלם
            </div>
          </div>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            aria-label="סגור תפריט ניווט"
            className="flex size-7 shrink-0 items-center justify-center rounded-full transition-all duration-200 hover:bg-muted"
            style={{ color: "var(--muted-foreground)" }}
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* ── Scrollable body ─────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">

        {/* ── FILTERS (top) ────────────────────────────────── */}
        <div className="space-y-5 px-3.5 py-4">
          <p
            className="text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted-foreground)", opacity: 0.6 }}
          >
            פילטרים ובקרה
          </p>

          {/* Quick stat pills */}
          <div className="flex gap-2">
            <StatPill label="ערים"    value={cityCount}    color="var(--chart-1)" />
            <StatPill label="הגרלות"  value={lotteryCount} color="var(--chart-2)" />
          </div>

          {/* Weight slider */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <Scale
                className="size-3.5 shrink-0"
                style={{ color: "var(--primary)" }}
              />
              שקלול רווח / סיכוי
            </div>
            <WeightSlider />
          </div>

          {/* Price range */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <SlidersHorizontal
                className="size-3.5 shrink-0"
                style={{ color: "var(--primary)" }}
              />
              סינון לפי מחיר למטר
            </div>
            <PriceRangeSlider />
          </div>

          {/* Excluded cities */}
          {excludedCities.size > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <Ban
                  className="size-3.5 shrink-0"
                  style={{ color: "var(--destructive)" }}
                />
                ערים מוסרות מהחישוב
              </div>
              <div className="flex flex-wrap gap-1.5">
                {[...excludedCities].map((city) => (
                  <button
                    key={city}
                    onClick={() => toggleExcludeCity(city)}
                    aria-label={`הסר ${city} מהרשימה המוסרת`}
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-all duration-150"
                    style={{
                      border:
                        "1px solid color-mix(in oklch, var(--destructive) 40%, transparent)",
                      background:
                        "color-mix(in oklch, var(--destructive) 10%, transparent)",
                      color: "var(--destructive)",
                    }}
                  >
                    {city} <X className="size-2.5" aria-hidden />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Selected cities for comparison */}
          {selectedCities.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold">
                  <CheckSquare
                    className="size-3.5 shrink-0"
                    style={{ color: "var(--chart-1)" }}
                  />
                  להשוואה ({selectedCities.length}/3)
                </div>
                <button
                  onClick={clearSelectedCities}
                  className="text-[10px] transition-colors hover:text-foreground"
                  style={{ color: "var(--muted-foreground)" }}
                >
                  נקה הכל
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => toggleSelectCity(city)}
                    aria-label={`הסר ${city} מהשוואה`}
                    className="flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-all duration-150"
                    style={{
                      background:
                        "color-mix(in oklch, var(--chart-1) 13%, transparent)",
                      border:
                        "1px solid color-mix(in oklch, var(--chart-1) 35%, transparent)",
                      color: "var(--chart-1)",
                    }}
                  >
                    {city} <X className="size-2.5" aria-hidden />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          className="mx-3.5 my-1 h-px"
          style={{
            backgroundColor:
              "color-mix(in oklch, var(--border) 65%, transparent)",
          }}
        />

        {/* ── NAVIGATION (bottom) ──────────────────────────── */}
        <nav aria-label="ניווט ראשי" className="px-2.5 pt-3 pb-4">
          <p
            className="mb-1.5 px-2.5 text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--muted-foreground)", opacity: 0.6 }}
          >
            ניווט
          </p>
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className="flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-all duration-150"
                style={
                  active
                    ? {
                        background:
                          "color-mix(in oklch, var(--primary) 13%, transparent)",
                        color: "var(--primary)",
                        fontWeight: 600,
                      }
                    : { color: "var(--muted-foreground)" }
                }
              >
                <Icon className="size-4 shrink-0" aria-hidden />
                {label}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ── Sidebar footer ──────────────────────────────────── */}
      <div
        className="shrink-0 px-4 py-3"
        style={{
          borderTop:
            "1px solid color-mix(in oklch, var(--border) 65%, transparent)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px]" style={{ color: "var(--muted-foreground)" }}>
              © 2025 הנחה מושכלת
            </p>
            <p
              className="text-[10px]"
              style={{ color: "var(--muted-foreground)", opacity: 0.55 }}
            >
              גרסה 1.0.0
            </p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

export function AppSidebar() {
  const { open, close } = useSidebar();

  return (
    <>
      {/* ── Desktop sticky sidebar ─────────────────────────── */}
      <aside
        className="hidden md:flex md:w-64 md:shrink-0 md:flex-col"
        aria-label="סרגל צד"
        style={{
          position: "sticky",
          top: 0,
          height: "100dvh",
          overflowY: "auto",
          borderInlineEnd:
            "1px solid color-mix(in oklch, var(--border) 65%, transparent)",
          backgroundColor: "var(--card)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <SidebarInner />
      </aside>

      {/* ── Mobile: backdrop ────────────────────────────────── */}
      <div
        aria-hidden
        className="fixed inset-0 z-40 bg-black/60 md:hidden"
        style={{
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
        onClick={close}
      />

      {/* ── Mobile: slide-in drawer ─────────────────────────── */}
      <aside
        id="mobile-nav-drawer"
        role="dialog"
        aria-modal={open}
        aria-label="תפריט ניווט"
        className="fixed bottom-0 top-0 z-50 flex w-72 flex-col md:hidden"
        aria-hidden={!open}
        style={{
          right: 0,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.32s cubic-bezier(0.4, 0, 0.2, 1)",
          backgroundColor: "var(--card)",
          borderInlineEnd:
            "1px solid color-mix(in oklch, var(--border) 65%, transparent)",
          boxShadow: open ? "var(--shadow-card-active)" : "none",
        }}
      >
        <SidebarInner onClose={close} />
      </aside>
    </>
  );
}
