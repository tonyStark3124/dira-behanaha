"use client";

import { X, TrendingUp, TrendingDown, Target, Home, Wallet } from "lucide-react";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatILS, formatPercent } from "@/lib/utils";

function Stat({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        {icon}
        {label}
      </div>
      <div
        className="text-base font-bold tabular-nums leading-none sm:text-xl"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </div>
      {sub && <div className="text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
}

function Divider() {
  return <div className="hidden h-10 w-px bg-border md:block" />;
}

export function CityComparisonPanel() {
  const { selectedCities, computation, clearSelectedCities } = useDashboard();

  if (!selectedCities.length) return null;

  const selectedData = computation.cities.filter((c) =>
    selectedCities.includes(c.city),
  );
  const allLotteries = selectedData.flatMap((c) => c.lotteries);

  if (!allLotteries.length) return null;

  // Average winning chance across selected cities
  const avgChancePct =
    selectedData.reduce((s, c) => s + c.rawCityChancePct, 0) /
    selectedData.length;

  // Profit stats across all lotteries in selected cities
  const profits = allLotteries.map((l) => l.profitPct);
  const maxProfitPct = Math.max(...profits);
  const minProfitPct = Math.min(...profits);
  const avgProfitPct =
    profits.reduce((s, p) => s + p, 0) / profits.length;

  // Best lottery = highest profit% (largest discount)
  const bestLottery = allLotteries.reduce((best, l) =>
    l.profitPct > best.profitPct ? l : best,
  );
  const avgPricePerMeter =
    allLotteries.reduce((s, l) => s + l.pricePerMeter, 0) / allLotteries.length;

  const bestCost = bestLottery.pricePerMeter * 100;
  const avgCost = avgPricePerMeter * 100;
  const downBest = bestCost * 0.2;
  const downAvg = avgCost * 0.2;

  return (
    <div className="relative rounded-3xl border bg-card p-4 card-shadow sm:p-5">
      {/* Accent top bar */}
      <div
        className="absolute inset-x-0 top-0 h-[3px] rounded-t-3xl"
        style={{
          background:
            "linear-gradient(90deg, var(--chart-1), var(--chart-2))",
        }}
      />

      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">ניתוח השוואתי</span>
          {selectedCities.map((city) => (
            <Badge key={city} variant="secondary" className="text-xs">
              {city}
            </Badge>
          ))}
          {selectedCities.length < 3 && (
            <span className="text-xs text-muted-foreground">
              ({3 - selectedCities.length} נותרו לבחירה)
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs"
          onClick={clearSelectedCities}
        >
          <X className="size-3" />
          נקה
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-4 sm:gap-x-6 sm:gap-y-5 md:grid-cols-4">
        {/* Row 1: chance + profits */}
        <Stat
          label="סיכוי ממוצע לזכייה"
          value={formatPercent(avgChancePct)}
          sub="ממוצע הערים הנבחרות"
          accent="var(--chart-2)"
          icon={<Target className="size-3" />}
        />
        <Stat
          label="רווח מקסימלי"
          value={formatPercent(maxProfitPct)}
          sub={`הגרלה ${bestLottery.id} — ${bestLottery.city}`}
          accent="var(--score-high)"
          icon={<TrendingUp className="size-3" />}
        />
        <Stat
          label="רווח מינימלי"
          value={formatPercent(minProfitPct)}
          sub="הגרלה הכי פחות משתלמת"
          accent="var(--score-low)"
          icon={<TrendingDown className="size-3" />}
        />
        <Stat
          label="רווח ממוצע"
          value={formatPercent(avgProfitPct)}
          sub="על פני כל ההגרלות"
          accent="var(--chart-1)"
        />
      </div>

      {/* Divider */}
      <div className="my-4 h-px bg-border" />

      {/* Cost estimates */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-4">
        <Stat
          label="עלות דירה 100מ״ר — הגרלה מיטבית"
          value={formatILS(bestCost)}
          sub={`מחיר/מ״ר: ${formatILS(bestLottery.pricePerMeter)}`}
          icon={<Home className="size-3" />}
        />
        <Stat
          label="עלות דירה 100מ״ר — ממוצע"
          value={formatILS(avgCost)}
          sub={`מחיר/מ״ר ממוצע: ${formatILS(Math.round(avgPricePerMeter))}`}
          icon={<Home className="size-3" />}
        />
        <Stat
          label="הון עצמי 20% — הגרלה מיטבית"
          value={formatILS(downBest)}
          sub="מינימום לפי הגרלה הטובה"
          accent="var(--score-high)"
          icon={<Wallet className="size-3" />}
        />
        <Stat
          label="הון עצמי 20% — ממוצע"
          value={formatILS(downAvg)}
          sub="ממוצע כל ההגרלות הנבחרות"
          icon={<Wallet className="size-3" />}
        />
      </div>
    </div>
  );
}
