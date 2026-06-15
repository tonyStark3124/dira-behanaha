"use client";

import { SlidersHorizontal } from "lucide-react";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { Slider } from "@/components/ui/slider";
import { formatILS } from "@/lib/utils";

export function PriceRangeSlider() {
  const { priceRange, priceExtent, setPriceRange, computation } =
    useDashboard();

  const { totalBeforeFilter, totalAfterFilter } = computation;
  const filtered = totalBeforeFilter - totalAfterFilter;

  function handleChange(vals: number[]) {
    setPriceRange({ min: vals[0], max: vals[1] });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">סינון לפי מחיר למטר</h3>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="tabular-nums text-muted-foreground">
          {formatILS(priceRange.min)}
        </span>
        <span className="text-xs text-muted-foreground">
          {filtered > 0 ? (
            <span className="text-amber-500">
              {filtered} הגרלות מסוננות מחוץ לטווח
            </span>
          ) : (
            "כל ההגרלות בטווח"
          )}
        </span>
        <span className="tabular-nums text-muted-foreground">
          {formatILS(priceRange.max)}
        </span>
      </div>

      {/* Dual-thumb slider — dir=ltr so min is on the left visually */}
      <Slider
        dir="ltr"
        value={[priceRange.min, priceRange.max]}
        min={priceExtent.min}
        max={priceExtent.max}
        step={100}
        onValueChange={handleChange}
        aria-label="טווח מחיר למטר"
      />

      <p className="text-xs text-muted-foreground">
        סינון מוציא הגרלות מחוץ לטווח ומבצע נרמול מחדש של כל הציונים.
      </p>
    </div>
  );
}
