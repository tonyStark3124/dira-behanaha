"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  icon: React.ReactNode;
  accent: string;
  primary: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

/**
 * Hyper-rounded KPI card with tactile skeuomorphic depth.
 *
 * Micro-animation contract (300ms ease-out):
 *   rest → hover   : lift (-6px) + shadow deepens + accent line draws in
 *   hover → press  : scale 0.97 snap (100ms) → tactile press
 *   inactive → active: ring + inner-highlight amplified
 */
export function KpiCard({ title, icon, accent, primary, active, onClick, children }: KpiCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group relative overflow-hidden rounded-3xl border bg-card p-5 text-start",
        // Depth + motion
        "card-shadow transition-all duration-300 ease-out",
        "hover:-translate-y-1.5 hover:card-shadow-hover",
        "active:translate-y-0 active:scale-[0.97] active:duration-100",
        // Focus
        "focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-ring/60",
        // Active ring
        active && "ring-2 ring-offset-2 ring-offset-background",
      )}
      style={active ? { ["--tw-ring-color" as string]: accent } : undefined}
    >
      {/* Inner white highlight (top edge) — the soft-plastic illusion */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-t-3xl"
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.14), transparent)" }}
      />

      {/* Ambient colour sheen on hover */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(160% 100% at 110% -5%, color-mix(in oklch, ${accent} 10%, transparent), transparent 70%)`,
        }}
      />

      {/* Accent top hairline — draws in from start on hover, always visible when active */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-x-0 top-0 h-[2.5px] rounded-t-3xl origin-left",
          active ? "scale-x-100" : "scale-x-0 transition-transform duration-300 group-hover:scale-x-100",
        )}
        style={{ background: `linear-gradient(90deg, ${accent}, color-mix(in oklch, ${accent} 50%, transparent))` }}
      />

      {/* Header */}
      <div className="relative flex items-start justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground leading-snug">{title}</span>
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110"
          style={{
            color: accent,
            backgroundColor: `color-mix(in oklch, ${accent} 12%, transparent)`,
            boxShadow: `0 0 0 1px color-mix(in oklch, ${accent} 20%, transparent)`,
          }}
        >
          {icon}
        </span>
      </div>

      {/* Value */}
      <div className="relative mt-3">
        <div className="truncate text-lg font-semibold leading-tight tracking-tight sm:text-xl">{primary}</div>
        <div className="mt-3 space-y-1.5 text-sm">{children}</div>
      </div>

      {active && (
        <div className="relative mt-3 text-[11px] font-medium" style={{ color: accent }}>
          ● מסונן — לחץ לביטול
        </div>
      )}
    </button>
  );
}

export function KpiMetric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}</span>
    </div>
  );
}
