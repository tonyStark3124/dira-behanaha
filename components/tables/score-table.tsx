"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, Ban, CheckSquare, Square, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CityDetailDialog } from "@/components/tables/city-detail-dialog";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { scoreBarStyle, scoreTintStyle } from "@/lib/scores";
import { formatInt, formatPercent, formatScore } from "@/lib/utils";
import { log } from "@/lib/logger";
import type { CityAggregate } from "@/lib/types";

type SortKey = keyof Pick<
  CityAggregate,
  | "city"
  | "lotteryCount"
  | "totalApartments"
  | "rawCityChancePct"
  | "avgProfitPct"
  | "cityProfitScore"
  | "cityChanceScore"
  | "totalWeightedScore"
>;

interface SortState {
  key: SortKey;
  dir: "asc" | "desc";
}

const DEFAULT_SORT: SortState = { key: "totalWeightedScore", dir: "desc" };

function SortIcon({ col, sort }: { col: SortKey; sort: SortState }) {
  if (sort.key !== col) return <ArrowUpDown className="size-3 opacity-30" />;
  return sort.dir === "asc" ? (
    <ArrowUp className="size-3" />
  ) : (
    <ArrowDown className="size-3" />
  );
}

// Columns with responsive visibility: "always" | "sm" | "md"
const COLS: { key: SortKey; label: string; show: "always" | "sm" | "md" }[] = [
  { key: "city",               label: "עיר",        show: "always" },
  { key: "lotteryCount",       label: "הגרלות",      show: "md" },
  { key: "totalApartments",    label: "דירות",       show: "md" },
  { key: "rawCityChancePct",   label: "סיכוי %",    show: "always" },
  { key: "avgProfitPct",       label: "רווח %",      show: "always" },
  { key: "cityProfitScore",    label: "ציון רווח",   show: "sm" },
  { key: "cityChanceScore",    label: "ציון סיכוי",  show: "sm" },
  { key: "totalWeightedScore", label: "ציון משוקלל", show: "always" },
];

const showClass = (show: "always" | "sm" | "md") =>
  show === "always" ? "" : show === "sm" ? "hidden sm:table-cell" : "hidden md:table-cell";

export function ScoreTable() {
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

  const [sort, setSort] = React.useState<SortState>(DEFAULT_SORT);
  const [dialogCity, setDialogCity] = React.useState<CityAggregate | null>(null);

  function handleSort(key: SortKey) {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "desc" },
    );
    log("UI_ACTION", "table column sort changed", { key });
  }

  function handleRowDoubleClick(city: CityAggregate) {
    log("UI_ACTION", "city drilldown dialog opened", { city: city.city });
    setDialogCity(city);
  }

  function handleRowClick(city: CityAggregate) {
    toggleCityContext(city.city);
  }

  const { cities } = computation;

  const visibleCities = React.useMemo(() => {
    if (activeContext.type === "city") {
      return cities.filter((c) => c.city === activeContext.id);
    }
    if (activeContext.type === "lottery") {
      const lotteryCity = cities.find((c) =>
        c.lotteries.some((l) => l.id === activeContext.id),
      );
      return lotteryCity ? [lotteryCity] : cities;
    }
    return cities;
  }, [cities, activeContext]);

  const sorted = React.useMemo(() => {
    return [...visibleCities].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      const cmp =
        typeof av === "string"
          ? av.localeCompare(bv as string, "he")
          : (av as number) - (bv as number);
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [visibleCities, sort]);

  const isIsolated = activeContext.type !== "none";
  const canSelectMore = selectedCities.length < 3;

  return (
    <>
      <div className="space-y-3">
        {/* Status bar */}
        <div className="flex flex-wrap items-center gap-2 text-sm">
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
              <span className="text-xs text-muted-foreground">ערים מוסרות:</span>
              {[...excludedCities].map((city) => (
                <button
                  key={city}
                  onClick={() => toggleExcludeCity(city)}
                  className="flex items-center gap-1 rounded-full border border-destructive/40 bg-destructive/10 px-2 py-0.5 text-xs text-destructive transition-colors hover:bg-destructive/20"
                >
                  {city}
                  <X className="size-2.5" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Hint — short on mobile, full on sm+ */}
        <p className="text-xs text-muted-foreground">
          <span className="sm:hidden">לחיצה כפולה — פרטים · ☑ — השוואה</span>
          <span className="hidden sm:inline">
            לחיצה כפולה — פרטי הגרלות לעיר · לחיצה בודדת — בידוד · ☑ — השוואה (עד 3) ·{" "}
            <Ban className="inline size-3 mx-0.5" /> — הסרה מחישוב
          </span>
        </p>

        <div className="overflow-x-auto rounded-3xl border card-shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8 text-center">☑</TableHead>

                {COLS.map(({ key, label, show }) => (
                  <TableHead key={key} className={showClass(show)}>
                    <button
                      className="flex items-center gap-1 hover:text-foreground"
                      onClick={() => handleSort(key)}
                    >
                      {label}
                      <SortIcon col={key} sort={sort} />
                    </button>
                  </TableHead>
                ))}

                <TableHead className="w-8" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {sorted.map((city) => {
                const isActive =
                  activeContext.type === "city" && activeContext.id === city.city;
                const isSelected = selectedCities.includes(city.city);
                const isDisabledSelect = !isSelected && !canSelectMore;

                return (
                  <TableRow
                    key={city.city}
                    className="group cursor-pointer select-none transition-[background-color] duration-150 ease-out hover:bg-muted/50"
                    data-active={isActive}
                    onClick={() => handleRowClick(city)}
                    onDoubleClick={() => handleRowDoubleClick(city)}
                    style={isActive ? scoreTintStyle(city.totalWeightedScore) : undefined}
                  >
                    {/* Checkbox */}
                    <TableCell
                      className="text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isDisabledSelect || isSelected) toggleSelectCity(city.city);
                      }}
                    >
                      <button
                        className={`transition-opacity ${isDisabledSelect ? "cursor-not-allowed opacity-25" : "cursor-pointer"}`}
                        aria-label={`${isSelected ? "בטל בחירת" : "בחר"} ${city.city}`}
                      >
                        {isSelected ? (
                          <CheckSquare className="size-4" style={{ color: "var(--chart-1)" }} />
                        ) : (
                          <Square className="size-4 text-muted-foreground/50" />
                        )}
                      </button>
                    </TableCell>

                    {/* city — always */}
                    <TableCell className="font-semibold">{city.city}</TableCell>

                    {/* lotteryCount — md+ */}
                    <TableCell className="hidden md:table-cell text-center tabular-nums">
                      {city.lotteryCount}
                    </TableCell>

                    {/* totalApartments — md+ */}
                    <TableCell className="hidden md:table-cell text-center tabular-nums">
                      {formatInt(city.totalApartments)}
                    </TableCell>

                    {/* rawCityChancePct — always */}
                    <TableCell
                      className="text-center text-xs font-medium tabular-nums"
                      style={scoreTintStyle(city.cityChanceScore)}
                    >
                      {formatPercent(city.rawCityChancePct)}
                    </TableCell>

                    {/* avgProfitPct — always */}
                    <TableCell
                      className="text-center text-xs font-medium tabular-nums"
                      style={scoreTintStyle(city.cityProfitScore)}
                    >
                      {formatPercent(city.avgProfitPct)}
                    </TableCell>

                    {/* cityProfitScore — sm+ */}
                    <TableCell className="hidden sm:table-cell text-center">
                      <div
                        className="mx-auto h-5 w-16 rounded-sm px-1 text-xs leading-5 sm:w-20"
                        style={scoreBarStyle(city.cityProfitScore)}
                      >
                        {formatScore(city.cityProfitScore)}
                      </div>
                    </TableCell>

                    {/* cityChanceScore — sm+ */}
                    <TableCell className="hidden sm:table-cell text-center">
                      <div
                        className="mx-auto h-5 w-16 rounded-sm px-1 text-xs leading-5 sm:w-20"
                        style={scoreBarStyle(city.cityChanceScore)}
                      >
                        {formatScore(city.cityChanceScore)}
                      </div>
                    </TableCell>

                    {/* totalWeightedScore — always */}
                    <TableCell className="text-center">
                      <div
                        className="mx-auto h-5 w-16 rounded-sm px-1 text-xs font-bold leading-5 sm:w-20"
                        style={scoreBarStyle(city.totalWeightedScore)}
                      >
                        {formatScore(city.totalWeightedScore)}
                      </div>
                    </TableCell>

                    {/* Exclude button */}
                    <TableCell
                      className="text-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExcludeCity(city.city);
                      }}
                    >
                      <button
                        title={`הסר את ${city.city} מהחישוב`}
                        className="rounded p-0.5 text-muted-foreground/30 transition-colors hover:bg-destructive/10 hover:text-destructive group-hover:text-muted-foreground/60"
                      >
                        <Ban className="size-3.5" />
                      </button>
                    </TableCell>
                  </TableRow>
                );
              })}

              {!sorted.length && (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="py-8 text-center text-muted-foreground"
                  >
                    אין נתונים להצגה בסינון הנוכחי
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <CityDetailDialog city={dialogCity} onClose={() => setDialogCity(null)} />
    </>
  );
}
