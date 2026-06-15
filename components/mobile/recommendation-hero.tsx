"use client";

import { Crown, TrendingUp, Target } from "lucide-react";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { formatPercent, formatScore } from "@/lib/utils";

/**
 * Mobile hero: large "Register here" answer at the top of the page.
 * Answers the primary question: "Which city is best for me?"
 */
export function MobileRecommendationHero() {
  const { computation, activeContext, toggleCityContext } = useDashboard();
  const city = computation.kpis.optimalCity;

  if (!city) return null;

  const isActive =
    activeContext.type === "city" && activeContext.id === city.city;

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={() => toggleCityContext(city.city)}
      className="relative w-full overflow-hidden rounded-3xl border bg-card text-start card-shadow transition-all duration-300 ease-out hover:-translate-y-0.5 hover:card-shadow-hover active:scale-[0.98] active:duration-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
    >
      {/* Top accent gradient hairline */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-[3px] rounded-t-3xl"
        style={{
          background:
            "linear-gradient(90deg, var(--chart-4), var(--chart-1), var(--chart-2))",
        }}
      />
      {/* Ambient radial glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(140% 90% at 50% -10%, color-mix(in oklch, var(--chart-1) 9%, transparent), transparent 55%)",
        }}
      />

      <div className="relative p-5">
        {/* Badge row */}
        <div className="mb-3 flex items-center gap-2">
          <span
            className="flex size-7 items-center justify-center rounded-full"
            style={{
              background:
                "color-mix(in oklch, var(--chart-4) 18%, transparent)",
              color: "var(--chart-4)",
            }}
          >
            <Crown className="size-3.5" />
          </span>
          <span className="text-xs font-semibold text-muted-foreground">
            ההמלצה המיטבית לרישום
          </span>
          {isActive && (
            <span
              className="ms-auto rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={{
                background:
                  "color-mix(in oklch, var(--chart-1) 15%, transparent)",
                color: "var(--chart-1)",
              }}
            >
              מסונן ● לחץ לביטול
            </span>
          )}
        </div>

        {/* City name + score */}
        <div className="flex items-end justify-between gap-2">
          <div>
            <div className="text-2xl font-bold tracking-tight">{city.city}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              ציון משוקלל (מתוך 100)
            </div>
          </div>
          <div
            className="text-4xl font-black tabular-nums leading-none"
            style={{ color: "var(--chart-1)" }}
          >
            {formatScore(city.totalWeightedScore)}
          </div>
        </div>

        {/* Score progress bar */}
        <div
          className="mt-3 h-2 w-full overflow-hidden rounded-full"
          style={{ backgroundColor: "var(--muted)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${city.totalWeightedScore}%`,
              background:
                "linear-gradient(90deg, var(--chart-1), var(--chart-2))",
            }}
          />
        </div>

        {/* Key stats */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div
            className="rounded-2xl p-3"
            style={{
              background: "color-mix(in oklch, var(--muted) 55%, transparent)",
            }}
          >
            <div className="mb-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <TrendingUp className="size-3" />
              רווח ממוצע
            </div>
            <div
              className="text-xl font-bold tabular-nums"
              style={{ color: "var(--score-high)" }}
            >
              {formatPercent(city.avgProfitPct)}
            </div>
          </div>
          <div
            className="rounded-2xl p-3"
            style={{
              background: "color-mix(in oklch, var(--muted) 55%, transparent)",
            }}
          >
            <div className="mb-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Target className="size-3" />
              סיכוי זכייה
            </div>
            <div
              className="text-xl font-bold tabular-nums"
              style={{ color: "var(--chart-2)" }}
            >
              {formatPercent(city.rawCityChancePct)}
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
