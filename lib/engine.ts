/**
 * Calculation engine for the "דירה בהנחה" dashboard.
 *
 * Pure functions only — given the raw data + the active filters/weights it
 * produces the entire computed result set. It performs NO I/O. All math is
 * spec-exact and every step is logged under the [LOTTERY_ENGINE:*] prefixes
 * so calculation drift can be diagnosed straight from the console.
 */
import { log, warn } from "@/lib/logger";
import type {
  CityAggregate,
  DashboardComputation,
  GlobalBounds,
  LotteryComputed,
  PriceRange,
  RawLottery,
  Weights,
} from "@/lib/types";

/**
 * Min-Max normalization onto a 0..100 scale.
 * If max === min (no spread) every value maps to 100, per spec.
 */
export function minMax(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return 0;
  if (max === min) return 100;
  return ((value - min) / (max - min)) * 100;
}

function safeNumber(n: number): number {
  return Number.isFinite(n) ? n : 0;
}

/** Compute the price-per-meter extent across the entire (unfiltered) dataset. */
export function getPriceExtent(lotteries: RawLottery[]): PriceRange {
  if (!lotteries.length) return { min: 0, max: 0 };
  let min = Infinity;
  let max = -Infinity;
  for (const l of lotteries) {
    if (l.pricePerMeter < min) min = l.pricePerMeter;
    if (l.pricePerMeter > max) max = l.pricePerMeter;
  }
  return { min: Math.floor(min), max: Math.ceil(max) };
}

/**
 * The full pipeline: filter → per-row metrics → global normalization →
 * city aggregation (real-chance paradox) → weighted scores → KPIs.
 */
export function computeDashboard(
  rawLotteries: RawLottery[],
  marketPrices: Record<string, number>,
  weights: Weights,
  priceRange: PriceRange,
): DashboardComputation {
  const profitW = weights.profit / 100;
  const chanceW = weights.chance / 100;

  // ── 1. FILTER ────────────────────────────────────────────────────────────
  const totalBeforeFilter = rawLotteries.length;
  const filtered = rawLotteries.filter(
    (l) =>
      l.pricePerMeter >= priceRange.min && l.pricePerMeter <= priceRange.max,
  );
  const totalAfterFilter = filtered.length;

  log("FILTER", "filtering pipeline executed", {
    weights,
    priceRange,
    totalBeforeFilter,
    totalAfterFilter,
    removed: totalBeforeFilter - totalAfterFilter,
  });

  if (!filtered.length) {
    warn("FILTER", "no lotteries remain after filtering — empty result set", {
      priceRange,
    });
    return emptyComputation(getPriceExtent(rawLotteries));
  }

  // ── 2. PER-LOTTERY RAW METRICS ───────────────────────────────────────────
  // profitPct = ((market - price) / price) * 100 ; successPct = (apts/applicants)*100
  const withRaw = filtered.map((l) => {
    const market = marketPrices[l.city] ?? 0;
    if (!market) {
      warn("COMPUTE", `no market price for city "${l.city}" — profit forced to 0`, {
        lotteryId: l.id,
      });
    }
    const profitPct = market
      ? ((market - l.pricePerMeter) / l.pricePerMeter) * 100
      : 0;
    const successPct =
      l.applicants > 0 ? (l.apartments / l.applicants) * 100 : 0;
    return { lottery: l, market, profitPct, successPct };
  });

  // ── 3. GLOBAL MIN-MAX BOUNDS (over the filtered set) ─────────────────────
  const profitValues = withRaw.map((r) => r.profitPct);
  const probValues = withRaw.map((r) => r.successPct);
  const pMin = Math.min(...profitValues);
  const pMax = Math.max(...profitValues);
  const probMin = Math.min(...probValues);
  const probMax = Math.max(...probValues);

  log("COMPUTE", "global boundary metrics before scoring", {
    pMin,
    pMax,
    probMin,
    probMax,
  });

  // ── 4. PER-LOTTERY NORMALIZED + COMBINED SCORES ──────────────────────────
  const lotteries: LotteryComputed[] = withRaw.map((r) => {
    const profitScore = minMax(r.profitPct, pMin, pMax);
    const chanceScore = minMax(r.successPct, probMin, probMax);
    const combinedScore = profitScore * profitW + chanceScore * chanceW;
    return {
      ...r.lottery,
      marketPricePerMeter: r.market,
      profitPct: r.profitPct,
      successPct: r.successPct,
      profitScore,
      chanceScore,
      combinedScore,
    };
  });

  // ── 5. CITY AGGREGATION — THE REAL CHANCE PARADOX ────────────────────────
  const byCity = new Map<string, LotteryComputed[]>();
  for (const l of lotteries) {
    const arr = byCity.get(l.city) ?? [];
    arr.push(l);
    byCity.set(l.city, arr);
  }

  // First pass: city profit score + raw city chance %.
  const partials = Array.from(byCity.entries()).map(([city, members]) => {
    const totalApartments = members.reduce((s, m) => s + m.apartments, 0);
    const totalApplicants = members.reduce((s, m) => s + m.applicants, 0);
    // Registered_max — the true historical registration footprint of the city.
    const registeredMax = members.reduce(
      (mx, m) => Math.max(mx, m.applicants),
      0,
    );
    const rawCityChancePct =
      registeredMax > 0 ? (totalApartments / registeredMax) * 100 : 0;
    const cityProfitScore =
      members.reduce((s, m) => s + m.profitScore, 0) / members.length;
    const avgProfitPct =
      members.reduce((s, m) => s + m.profitPct, 0) / members.length;

    log("AGGREGATE", `city "${city}" raw aggregation`, {
      lotteryCount: members.length,
      totalApartments,
      registeredMaxCandidate: registeredMax,
      rawCityChancePct,
      cityProfitScore,
    });

    return {
      city,
      members,
      totalApartments,
      totalApplicants,
      registeredMax,
      rawCityChancePct,
      cityProfitScore,
      avgProfitPct,
    };
  });

  // Second pass: normalize rawCityChancePct across cities → cityChanceScore.
  const rawChances = partials.map((p) => p.rawCityChancePct);
  const cityChanceRawMin = Math.min(...rawChances);
  const cityChanceRawMax = Math.max(...rawChances);

  const cities: CityAggregate[] = partials
    .map((p) => {
      const cityChanceScore = minMax(
        p.rawCityChancePct,
        cityChanceRawMin,
        cityChanceRawMax,
      );
      const profitContribution = p.cityProfitScore * profitW;
      const chanceContribution = cityChanceScore * chanceW;
      const totalWeightedScore = profitContribution + chanceContribution;
      return {
        city: p.city,
        lotteryCount: p.members.length,
        totalApartments: p.totalApartments,
        registeredMax: p.registeredMax,
        totalApplicants: p.totalApplicants,
        avgProfitPct: p.avgProfitPct,
        rawCityChancePct: p.rawCityChancePct,
        cityProfitScore: p.cityProfitScore,
        cityChanceScore,
        profitContribution,
        chanceContribution,
        totalWeightedScore,
        lotteries: p.members
          .slice()
          .sort((a, b) => b.combinedScore - a.combinedScore),
      };
    })
    .sort((a, b) => b.totalWeightedScore - a.totalWeightedScore);

  log("AGGREGATE", "final normalized city score matrix", {
    cityChanceRawMin,
    cityChanceRawMax,
    matrix: cities.map((c) => ({
      city: c.city,
      cityProfitScore: round(c.cityProfitScore),
      cityChanceScore: round(c.cityChanceScore),
      totalWeightedScore: round(c.totalWeightedScore),
    })),
  });

  // ── 6. KPIs ──────────────────────────────────────────────────────────────
  const optimalCity = maxBy(cities, (c) => c.totalWeightedScore);
  const profitChampion = maxBy(cities, (c) => c.cityProfitScore);
  const chanceHaven = maxBy(cities, (c) => c.cityChanceScore);
  const alphaLottery = maxBy(lotteries, (l) => l.combinedScore);

  log("COMPUTE", "KPI selection complete", {
    optimalCity: optimalCity?.city,
    profitChampion: profitChampion?.city,
    chanceHaven: chanceHaven?.city,
    alphaLottery: alphaLottery?.id,
  });

  const bounds: GlobalBounds = {
    pMin,
    pMax,
    probMin,
    probMax,
    cityChanceRawMin,
    cityChanceRawMax,
  };

  return {
    lotteries: lotteries
      .slice()
      .sort((a, b) => b.combinedScore - a.combinedScore),
    cities,
    bounds,
    kpis: { optimalCity, profitChampion, chanceHaven, alphaLottery },
    priceExtent: getPriceExtent(rawLotteries),
    totalBeforeFilter,
    totalAfterFilter,
  };
}

function maxBy<T>(arr: T[], sel: (t: T) => number): T | null {
  if (!arr.length) return null;
  return arr.reduce((best, cur) => (sel(cur) > sel(best) ? cur : best), arr[0]);
}

function round(n: number): number {
  return Math.round(safeNumber(n) * 100) / 100;
}

function emptyComputation(priceExtent: PriceRange): DashboardComputation {
  return {
    lotteries: [],
    cities: [],
    bounds: {
      pMin: 0,
      pMax: 0,
      probMin: 0,
      probMax: 0,
      cityChanceRawMin: 0,
      cityChanceRawMax: 0,
    },
    kpis: {
      optimalCity: null,
      profitChampion: null,
      chanceHaven: null,
      alphaLottery: null,
    },
    priceExtent,
    totalBeforeFilter: 0,
    totalAfterFilter: 0,
  };
}
