"use client";

import * as React from "react";
import { computeDashboard, getPriceExtent } from "@/lib/engine";
import { log, error } from "@/lib/logger";
import type {
  ActiveContext,
  DashboardComputation,
  LotteryApiPayload,
  PriceRange,
  RawLottery,
  Weights,
} from "@/lib/types";

interface DashboardContextValue {
  loading: boolean;
  loadError: string | null;
  meta: LotteryApiPayload["meta"] | null;

  weights: Weights;
  priceRange: PriceRange;
  priceExtent: PriceRange;
  activeContext: ActiveContext;

  /** Cities the user chose to remove from all calculations. */
  excludedCities: Set<string>;
  /** Up to 3 cities selected for the comparison panel. */
  selectedCities: string[];

  computation: DashboardComputation;

  setProfitWeight: (profit: number) => void;
  setPriceRange: (range: PriceRange) => void;
  toggleCityContext: (city: string) => void;
  toggleLotteryContext: (lotteryId: string) => void;
  clearContext: () => void;
  toggleExcludeCity: (city: string) => void;
  toggleSelectCity: (city: string) => void;
  clearSelectedCities: () => void;
}

const DashboardContext = React.createContext<DashboardContextValue | null>(null);

export function useDashboard(): DashboardContextValue {
  const ctx = React.useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within <DashboardProvider>");
  return ctx;
}

const DEFAULT_WEIGHTS: Weights = { profit: 80, chance: 20 };

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = React.useState<RawLottery[]>([]);
  const [marketPrices, setMarketPrices] = React.useState<Record<string, number>>({});
  const [meta, setMeta] = React.useState<LotteryApiPayload["meta"] | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  const [weights, setWeights] = React.useState<Weights>(DEFAULT_WEIGHTS);
  const [priceRange, setPriceRangeState] = React.useState<PriceRange | null>(null);
  const [activeContext, setActiveContext] = React.useState<ActiveContext>({ type: "none" });
  const [excludedCities, setExcludedCities] = React.useState<Set<string>>(new Set());
  const [selectedCities, setSelectedCities] = React.useState<string[]>([]);

  // ── Initial data load ──────────────────────────────────────────────────
  React.useEffect(() => {
    let cancelled = false;
    log("INIT", "fetching /api/lotteries from client");
    fetch("/api/lotteries")
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return (await res.json()) as LotteryApiPayload;
      })
      .then((payload) => {
        if (cancelled) return;
        log("INIT", "client received lottery payload", {
          lotteries: payload.lotteries.length,
          marketCities: Object.keys(payload.marketPrices).length,
          meta: payload.meta,
        });
        setRaw(payload.lotteries);
        setMarketPrices(payload.marketPrices);
        setMeta(payload.meta);
        const extent = getPriceExtent(payload.lotteries);
        setPriceRangeState(extent);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        error("INIT", "failed to load lottery payload", err);
        setLoadError(String(err));
        setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const priceExtent = React.useMemo(() => getPriceExtent(raw), [raw]);
  const effectiveRange = priceRange ?? priceExtent;

  // Apply city exclusions before feeding the engine
  const effectiveLotteries = React.useMemo(
    () => excludedCities.size === 0
      ? raw
      : raw.filter((l) => !excludedCities.has(l.city)),
    [raw, excludedCities],
  );

  // ── Heavy compute — memoized ──────────────────────────────────────────
  const computation = React.useMemo<DashboardComputation>(() => {
    log("COMPUTE", "recomputing dashboard (useMemo)", {
      weights,
      priceRange: effectiveRange,
      excludedCities: [...excludedCities],
    });
    return computeDashboard(effectiveLotteries, marketPrices, weights, effectiveRange);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    effectiveLotteries,
    marketPrices,
    weights.profit,
    weights.chance,
    effectiveRange.min,
    effectiveRange.max,
  ]);

  // ── Actions ──────────────────────────────────────────────────────────
  const setProfitWeight = React.useCallback((profit: number) => {
    const clamped = Math.round(Math.min(100, Math.max(0, profit)));
    const next = { profit: clamped, chance: 100 - clamped };
    log("UI_ACTION", "weight ratio changed", next);
    setWeights(next);
  }, []);

  const setPriceRange = React.useCallback((range: PriceRange) => {
    log("UI_ACTION", "price range changed", range);
    setPriceRangeState(range);
  }, []);

  const toggleCityContext = React.useCallback((city: string) => {
    setActiveContext((prev) => {
      const next: ActiveContext =
        prev.type === "city" && prev.id === city
          ? { type: "none" }
          : { type: "city", id: city };
      log("UI_ACTION", "city context toggled", next);
      return next;
    });
  }, []);

  const toggleLotteryContext = React.useCallback((lotteryId: string) => {
    setActiveContext((prev) => {
      const next: ActiveContext =
        prev.type === "lottery" && prev.id === lotteryId
          ? { type: "none" }
          : { type: "lottery", id: lotteryId };
      log("UI_ACTION", "lottery context toggled", next);
      return next;
    });
  }, []);

  const clearContext = React.useCallback(() => {
    log("UI_ACTION", "active context cleared");
    setActiveContext({ type: "none" });
  }, []);

  const toggleExcludeCity = React.useCallback((city: string) => {
    setExcludedCities((prev) => {
      const next = new Set(prev);
      if (next.has(city)) {
        next.delete(city);
        log("UI_ACTION", "city restored to calculation", { city });
      } else {
        next.add(city);
        log("UI_ACTION", "city excluded from calculation", { city });
        // Also deselect if excluded
        setSelectedCities((sel) => sel.filter((c) => c !== city));
      }
      return next;
    });
  }, []);

  const toggleSelectCity = React.useCallback((city: string) => {
    setSelectedCities((prev) => {
      if (prev.includes(city)) {
        log("UI_ACTION", "city deselected from comparison", { city });
        return prev.filter((c) => c !== city);
      }
      if (prev.length >= 3) {
        log("UI_ACTION", "city selection limit (3) reached", { city });
        return prev;
      }
      log("UI_ACTION", "city selected for comparison", { city });
      return [...prev, city];
    });
  }, []);

  const clearSelectedCities = React.useCallback(() => {
    log("UI_ACTION", "comparison selection cleared");
    setSelectedCities([]);
  }, []);

  const value: DashboardContextValue = {
    loading,
    loadError,
    meta,
    weights,
    priceRange: effectiveRange,
    priceExtent,
    activeContext,
    excludedCities,
    selectedCities,
    computation,
    setProfitWeight,
    setPriceRange,
    toggleCityContext,
    toggleLotteryContext,
    clearContext,
    toggleExcludeCity,
    toggleSelectCity,
    clearSelectedCities,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}
