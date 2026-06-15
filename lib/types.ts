/**
 * Domain types for the "דירה בהנחה" lottery analytics engine.
 * Hebrew CSV headers are mapped to these English keys at parse time
 * (see app/api/lotteries/route.ts).
 */

/** A single lottery row as parsed from the lottery CSV. */
export interface RawLottery {
  /** מספר הגרלה */
  id: string;
  /** סוג הגרלה */
  type: string;
  /** סיום הרשמה (dd/MM/yyyy as in the source file) */
  endDate: string;
  /** יישוב */
  city: string;
  /** קבלן */
  contractor: string;
  /** דירות בהגרלה */
  apartments: number;
  /** נרשמים בהגרלה */
  applicants: number;
  /** מחיר למטר (lottery price per square meter) */
  pricePerMeter: number;
  /** מענק */
  grant: number;
  /** הערות */
  notes: string;
}

/** A market-price reference row (property_prices CSV). */
export interface MarketPrice {
  /** יישוב */
  city: string;
  /** מחיר ממוצע למטר (ש"ח) */
  avgPricePerMeter: number;
  /** מחיר מוערך לדירת 100 מ"ר (ש"ח) */
  estimated100sqm: number;
}

/** Payload returned by the /api/lotteries route handler. */
export interface LotteryApiPayload {
  lotteries: RawLottery[];
  marketPrices: Record<string, number>;
  meta: {
    lotteryRowCount: number;
    marketRowCount: number;
    matchedCities: number;
    unmatchedCities: string[];
    generatedAt: string;
  };
}

/** A lottery enriched with all per-row derived + normalized metrics. */
export interface LotteryComputed extends RawLottery {
  /** Market average price per meter resolved for this lottery's city. */
  marketPricePerMeter: number;
  /** אחוז רווח למטר — ((market - price) / price) * 100 */
  profitPct: number;
  /** אחוז סיכוי — (apartments / applicants) * 100 */
  successPct: number;
  /** ציון על רווח — global min-max of profitPct → 0..100 */
  profitScore: number;
  /** ציון על סיכוי — global min-max of successPct → 0..100 */
  chanceScore: number;
  /** Independent per-lottery weighted score (bypasses city averaging). */
  combinedScore: number;
}

/** City-level aggregate following the "real chance paradox" rules. */
export interface CityAggregate {
  city: string;
  lotteryCount: number;
  /** Sum of apartments across all lotteries in the city. */
  totalApartments: number;
  /** Max registered applicants among the city's lotteries (Registered_max). */
  registeredMax: number;
  /** Sum of applicants (kept for reference/debug only — NOT used for chance). */
  totalApplicants: number;
  /** Mean of the member lotteries' profitPct (for display). */
  avgProfitPct: number;
  /** (totalApartments / registeredMax) * 100 — raw city winning probability. */
  rawCityChancePct: number;
  /** ממוצע ציון רווח — mean of member profitScores. */
  cityProfitScore: number;
  /** ציון על סיכוי לעיר — global min-max of rawCityChancePct across cities. */
  cityChanceScore: number;
  /** Points contributed by the profit component (cityProfitScore * profitW). */
  profitContribution: number;
  /** Points contributed by the chance component (cityChanceScore * chanceW). */
  chanceContribution: number;
  /** ציון משוקלל לעיר — profitContribution + chanceContribution. */
  totalWeightedScore: number;
  /** Member lotteries (already computed) for drilldown. */
  lotteries: LotteryComputed[];
}

/** Profit/chance weight split. Always sums to 100. */
export interface Weights {
  profit: number;
  chance: number;
}

/** Inclusive price-per-meter bounds for the range filter. */
export interface PriceRange {
  min: number;
  max: number;
}

/** Card-driven global isolation context. */
export type ActiveContext =
  | { type: "none" }
  | { type: "city"; id: string }
  | { type: "lottery"; id: string };

/** Global boundary metrics logged before scoring. */
export interface GlobalBounds {
  pMin: number;
  pMax: number;
  probMin: number;
  probMax: number;
  cityChanceRawMin: number;
  cityChanceRawMax: number;
}

/** Full computed result set produced by the engine for the current filters. */
export interface DashboardComputation {
  /** Lotteries surviving the price filter, fully scored. */
  lotteries: LotteryComputed[];
  /** City aggregates derived from the filtered lotteries. */
  cities: CityAggregate[];
  bounds: GlobalBounds;
  kpis: {
    /** Card 1 — highest totalWeightedScore. */
    optimalCity: CityAggregate | null;
    /** Card 2 — highest cityProfitScore. */
    profitChampion: CityAggregate | null;
    /** Card 3 — highest cityChanceScore. */
    chanceHaven: CityAggregate | null;
    /** Card 4 — single lottery with highest combinedScore. */
    alphaLottery: LotteryComputed | null;
  };
  /** Bounds of price-per-meter across the *unfiltered* dataset (slider extent). */
  priceExtent: PriceRange;
  totalBeforeFilter: number;
  totalAfterFilter: number;
}
