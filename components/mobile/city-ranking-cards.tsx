"use client";

import * as React from "react";
import {
  ChevronDown,
  CheckSquare,
  Square,
  Ban,
  X,
  TrendingUp,
  Target,
  BarChart2,
} from "lucide-react";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { CityDetailDialog } from "@/components/tables/city-detail-dialog";
import { scoreBarStyle, scoreTintStyle } from "@/lib/scores";
import { formatInt, formatPercent, formatScore } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { log } from "@/lib/logger";
import type { CityAggregate } from "@/lib/types";

/**
 * Mobile-optimised city ranking.
 *
 * UX decisions:
 * - Primary answer (score + city) visible without expanding
 * - Profit % and Chance % always visible — those drive the decision
 * - Detailed breakdown (sub-scores, counts) hidden behind an expand tap
 * - Actions (compare, detail dialog, ban) only appear when expanded
 *   so the list stays clean for quick scanning
 */
export function MobileCityRankingCards() {
  const {
    computation,
    activeContext,
    toggleCityContext,
    clearContext,
    excludedCities,
    selectedCities,
    toggleExcludeCity,
    toggleSelectCity,
  } = useDashboard();

  const [expanded, setExpanded] = React.useState<string | null>(null);
  const [dialogCity, setDialogCity] = React.useState<CityAggregate | null>(
    null,
  );

  const cities = React.useMemo(
    () =>
      [...computation.cities].sort(
        (a, b) => b.totalWeightedScore - a.totalWeightedScore,
      ),
    [computation.cities],
  );

  const isIsolated = activeContext.type !== "none";
  const canSelectMore = selectedCities.length < 3;

  const visibleCities = React.useMemo(() => {
    if (activeContext.type === "city")
      return cities.filter((c) => c.city === activeContext.id);
    return cities;
  }, [cities, activeContext]);

  if (!visibleCities.length) {
    return (
      <div className="flex h-28 items-center justify-center rounded-3xl border text-sm text-muted-foreground">
        אין נתונים להצגה בסינון הנוכחי
      </div>
    );
  }

  return (
    <>
      {/* Status bar */}
      {(isIsolated || excludedCities.size > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          {isIsolated && (
            <>
              <Badge variant="secondary" className="text-xs">
                {activeContext.type === "city"
                  ? `מסונן לעיר: ${activeContext.id}`
                  : `מסונן להגרלה: #${activeContext.id}`}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1 px-2 text-xs"
                onClick={clearContext}
              >
                <X className="size-3" />
                נקה
              </Button>
            </>
          )}
          {excludedCities.size > 0 && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-muted-foreground">מוסרות:</span>
              {[...excludedCities].map((city) => (
                <button
                  key={city}
                  onClick={() => toggleExcludeCity(city)}
                  className="flex items-center gap-1 rounded-full border border-destructive/40 bg-destructive/10 px-2 py-0.5 text-xs text-destructive"
                >
                  {city}
                  <X className="size-2.5" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Heading */}
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold">דירוג ערים</h2>
        <span className="text-xs text-muted-foreground">
          {visibleCities.length} ערים
        </span>
      </div>

      {/* Card list */}
      <div className="space-y-2.5">
        {visibleCities.map((city, rank) => {
          const isOpen = expanded === city.city;
          const isSelected = selectedCities.includes(city.city);
          const isDisabled = !isSelected && !canSelectMore;
          const isActive =
            activeContext.type === "city" && activeContext.id === city.city;

          // Rank badge colour
          const rankStyle: React.CSSProperties =
            rank === 0
              ? {
                  background:
                    "color-mix(in oklch, var(--chart-4) 22%, transparent)",
                  color: "var(--chart-4)",
                }
              : rank === 1
                ? {
                    background:
                      "color-mix(in oklch, var(--muted-foreground) 18%, transparent)",
                    color: "var(--muted-foreground)",
                  }
                : {
                    background: "var(--muted)",
                    color: "var(--muted-foreground)",
                  };

          return (
            <div
              key={city.city}
              className="overflow-hidden rounded-2xl border bg-card card-shadow transition-all duration-300"
              style={
                isActive
                  ? {
                      borderColor:
                        "color-mix(in oklch, var(--chart-1) 40%, transparent)",
                    }
                  : undefined
              }
            >
              {/* ── Collapsed header (always visible) ─────────────── */}
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-3.5 text-start transition-colors duration-150 hover:bg-muted/30"
                onClick={() => {
                  setExpanded(isOpen ? null : city.city);
                  log("UI_ACTION", "mobile city card toggled", { city: city.city });
                }}
              >
                {/* Rank */}
                <span
                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={rankStyle}
                >
                  {rank + 1}
                </span>

                {/* City + score + bar + stats */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold">
                      {city.city}
                    </span>
                    <span
                      className="shrink-0 text-sm font-black tabular-nums"
                      style={{ color: "var(--chart-1)" }}
                    >
                      {formatScore(city.totalWeightedScore)}
                    </span>
                  </div>

                  {/* Score bar */}
                  <div
                    className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full"
                    style={{ backgroundColor: "var(--muted)" }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${city.totalWeightedScore}%`,
                        background:
                          "linear-gradient(90deg, var(--chart-1), var(--chart-2))",
                      }}
                    />
                  </div>

                  {/* Key metrics — always visible */}
                  <div className="mt-1.5 flex items-center gap-3 text-xs">
                    <span
                      className="flex items-center gap-0.5"
                      style={scoreTintStyle(city.cityProfitScore)}
                    >
                      <TrendingUp className="size-3" />
                      {formatPercent(city.avgProfitPct)}
                    </span>
                    <span className="text-muted-foreground/40">·</span>
                    <span
                      className="flex items-center gap-0.5"
                      style={scoreTintStyle(city.cityChanceScore)}
                    >
                      <Target className="size-3" />
                      {formatPercent(city.rawCityChancePct)}
                    </span>
                  </div>
                </div>

                {/* Chevron */}
                <ChevronDown
                  className="size-4 shrink-0 text-muted-foreground/60 transition-transform duration-300"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>

              {/* ── Expanded details ────────────────────────────────── */}
              {isOpen && (
                <div className="border-t px-4 pb-4 pt-3">
                  {/* Score breakdown grid */}
                  <div className="mb-3 grid grid-cols-2 gap-2.5">
                    <div>
                      <div className="mb-1 text-[11px] text-muted-foreground">
                        ציון רווח
                      </div>
                      <div
                        className="h-5 rounded-md px-2 text-xs leading-5"
                        style={scoreBarStyle(city.cityProfitScore)}
                      >
                        {formatScore(city.cityProfitScore)}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-[11px] text-muted-foreground">
                        ציון סיכוי
                      </div>
                      <div
                        className="h-5 rounded-md px-2 text-xs leading-5"
                        style={scoreBarStyle(city.cityChanceScore)}
                      >
                        {formatScore(city.cityChanceScore)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-muted-foreground">
                        הגרלות
                      </div>
                      <div className="text-sm font-semibold tabular-nums">
                        {city.lotteryCount}
                      </div>
                    </div>
                    <div>
                      <div className="text-[11px] text-muted-foreground">
                        דירות זמינות
                      </div>
                      <div className="text-sm font-semibold tabular-nums">
                        {formatInt(city.totalApartments)}
                      </div>
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex items-center gap-2">
                    {/* Compare toggle */}
                    <button
                      onClick={() => {
                        if (!isDisabled || isSelected)
                          toggleSelectCity(city.city);
                      }}
                      disabled={isDisabled}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-full border py-1.5 text-xs font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40"
                      style={
                        isSelected
                          ? {
                              background:
                                "color-mix(in oklch, var(--chart-1) 12%, transparent)",
                              borderColor: "var(--chart-1)",
                              color: "var(--chart-1)",
                            }
                          : {}
                      }
                    >
                      {isSelected ? (
                        <CheckSquare className="size-3" />
                      ) : (
                        <Square className="size-3" />
                      )}
                      {isSelected ? "מסומן להשוואה" : "השווה"}
                    </button>

                    {/* Drilldown */}
                    <button
                      onClick={() => {
                        setDialogCity(city);
                        log("UI_ACTION", "mobile city drilldown opened", { city: city.city });
                      }}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-full border py-1.5 text-xs font-medium transition-all duration-200 hover:bg-muted/50"
                    >
                      <BarChart2 className="size-3" />
                      פרטי הגרלות
                    </button>

                    {/* Isolate */}
                    <button
                      onClick={() => toggleCityContext(city.city)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-full border py-1.5 text-xs font-medium transition-all duration-200 hover:bg-muted/50"
                      style={
                        isActive
                          ? {
                              background:
                                "color-mix(in oklch, var(--primary) 10%, transparent)",
                              borderColor: "var(--primary)",
                              color: "var(--primary)",
                            }
                          : {}
                      }
                    >
                      {isActive ? "בטל בידוד" : "בדד"}
                    </button>

                    {/* Ban */}
                    <button
                      onClick={() => toggleExcludeCity(city.city)}
                      title={`הסר את ${city.city} מהחישוב`}
                      className="flex size-8 shrink-0 items-center justify-center rounded-full border text-muted-foreground/50 transition-all duration-200 hover:border-destructive/50 hover:text-destructive"
                    >
                      <Ban className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <CityDetailDialog
        city={dialogCity}
        onClose={() => setDialogCity(null)}
      />
    </>
  );
}
