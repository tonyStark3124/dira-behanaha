"use client";

import * as React from "react";
import { Settings2, ChevronDown } from "lucide-react";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { WeightSlider } from "@/components/controls/weight-slider";
import { PriceRangeSlider } from "@/components/controls/price-range-slider";

/**
 * Collapsible controls panel for mobile.
 * Collapsed by default — shows a summary pill so the user sees the current
 * weights without opening. Tap to expand sliders.
 */
export function MobileControlsAccordion() {
  const [open, setOpen] = React.useState(false);
  const { weights, computation } = useDashboard();
  const { totalBeforeFilter, totalAfterFilter } = computation;
  const filtered = totalBeforeFilter - totalAfterFilter;

  return (
    <div className="overflow-hidden rounded-3xl border bg-card card-shadow">
      {/* Header / toggle */}
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 transition-colors duration-150 hover:bg-muted/40"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <Settings2 className="size-4" style={{ color: "var(--primary)" }} />
          <span className="text-sm font-semibold">הגדרות חישוב</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Weight summary pill */}
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold tabular-nums"
            style={{
              background:
                "color-mix(in oklch, var(--primary) 12%, transparent)",
              color: "var(--primary)",
            }}
          >
            {weights.profit}% / {weights.chance}%
          </span>

          {/* Filtered count badge */}
          {filtered > 0 && (
            <span
              className="rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{
                background:
                  "color-mix(in oklch, var(--chart-4) 15%, transparent)",
                color: "var(--chart-4)",
              }}
            >
              {filtered} מסוננות
            </span>
          )}

          <ChevronDown
            className="size-4 text-muted-foreground transition-transform duration-300"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </div>
      </button>

      {/* Expanded panel */}
      {open && (
        <div className="space-y-6 border-t px-4 pb-5 pt-4">
          <WeightSlider />
          <PriceRangeSlider />
        </div>
      )}
    </div>
  );
}
