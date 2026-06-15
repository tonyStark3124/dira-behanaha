"use client";

import { Scale } from "lucide-react";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { Slider } from "@/components/ui/slider";

export function WeightSlider() {
  const { weights, setProfitWeight } = useDashboard();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Scale className="size-4 text-primary" />
        <h3 className="text-sm font-semibold">מטריצת שקלול</h3>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5">
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: "var(--chart-1)" }}
          />
          רווח
          <span className="font-bold tabular-nums">{weights.profit}%</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="font-bold tabular-nums">{weights.chance}%</span>
          סיכוי
          <span
            className="size-2.5 rounded-full"
            style={{ backgroundColor: "var(--chart-2)" }}
          />
        </span>
      </div>

      {/* Single thumb: value = profit weight; chance auto-completes to 100. */}
      <Slider
        dir="ltr"
        value={[weights.profit]}
        min={0}
        max={100}
        step={5}
        onValueChange={(vals) => setProfitWeight(vals[0])}
        aria-label="משקל רווח מול סיכוי"
      />

      <p className="text-xs text-muted-foreground">
        ברירת מחדל 80% רווח / 20% סיכוי. הזזת המחוון מחשבת מחדש את כל הציונים
        בזמן אמת.
      </p>
    </div>
  );
}
