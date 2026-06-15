"use client";

import { Crown, TrendingUp, Ticket, Sparkles } from "lucide-react";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { KpiCard, KpiMetric } from "@/components/kpi/kpi-card";
import { formatILS, formatInt, formatPercent, formatScore } from "@/lib/utils";

export function KpiGrid() {
  const { computation, activeContext, toggleCityContext, toggleLotteryContext } =
    useDashboard();
  const { optimalCity, profitChampion, chanceHaven, alphaLottery } =
    computation.kpis;

  const isCityActive = (city?: string) =>
    !!city && activeContext.type === "city" && activeContext.id === city;
  const isLotteryActive = (id?: string) =>
    !!id && activeContext.type === "lottery" && activeContext.id === id;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {/* Card 1 — Ultimate Optimal City */}
      <KpiCard
        title="העיר השווה ביותר"
        icon={<Crown className="size-4" />}
        accent="var(--chart-1)"
        primary={optimalCity?.city ?? "—"}
        active={isCityActive(optimalCity?.city)}
        onClick={() => optimalCity && toggleCityContext(optimalCity.city)}
      >
        <KpiMetric
          label="ציון משוקלל"
          value={formatScore(optimalCity?.totalWeightedScore ?? 0)}
        />
        <KpiMetric
          label="רווח ממוצע"
          value={formatPercent(optimalCity?.avgProfitPct ?? 0)}
        />
        <KpiMetric
          label="סיכוי אמיתי"
          value={formatPercent(optimalCity?.rawCityChancePct ?? 0)}
        />
      </KpiCard>

      {/* Card 2 — Max Profit Champion */}
      <KpiCard
        title="העיר עם הרווח הגבוה ביותר"
        icon={<TrendingUp className="size-4" />}
        accent="var(--chart-3)"
        primary={profitChampion?.city ?? "—"}
        active={isCityActive(profitChampion?.city)}
        onClick={() => profitChampion && toggleCityContext(profitChampion.city)}
      >
        <KpiMetric
          label="ציון רווח"
          value={formatScore(profitChampion?.cityProfitScore ?? 0)}
        />
        <KpiMetric
          label="רווח ממוצע למטר"
          value={formatPercent(profitChampion?.avgProfitPct ?? 0)}
        />
        <KpiMetric
          label="מס׳ הגרלות"
          value={formatInt(profitChampion?.lotteryCount ?? 0)}
        />
      </KpiCard>

      {/* Card 3 — High-Probability Haven */}
      <KpiCard
        title="העיר עם סיכויי הזכייה הגבוהים"
        icon={<Ticket className="size-4" />}
        accent="var(--chart-2)"
        primary={chanceHaven?.city ?? "—"}
        active={isCityActive(chanceHaven?.city)}
        onClick={() => chanceHaven && toggleCityContext(chanceHaven.city)}
      >
        <KpiMetric
          label="ציון סיכוי"
          value={formatScore(chanceHaven?.cityChanceScore ?? 0)}
        />
        <KpiMetric
          label="סיכוי אמיתי"
          value={formatPercent(chanceHaven?.rawCityChancePct ?? 0)}
        />
        <KpiMetric
          label="דירות זמינות"
          value={formatInt(chanceHaven?.totalApartments ?? 0)}
        />
      </KpiCard>

      {/* Card 4 — Single Alpha Lottery */}
      <KpiCard
        title="ההגרלה השווה ביותר"
        icon={<Sparkles className="size-4" />}
        accent="var(--chart-4)"
        primary={alphaLottery ? `#${alphaLottery.id}` : "—"}
        active={isLotteryActive(alphaLottery?.id)}
        onClick={() => alphaLottery && toggleLotteryContext(alphaLottery.id)}
      >
        <KpiMetric label="יישוב" value={alphaLottery?.city ?? "—"} />
        <KpiMetric
          label="ציון משולב"
          value={formatScore(alphaLottery?.combinedScore ?? 0)}
        />
        <KpiMetric
          label="מחיר למטר"
          value={formatILS(alphaLottery?.pricePerMeter ?? 0)}
        />
      </KpiCard>
    </div>
  );
}
