import { readFile } from "node:fs/promises";
import path from "node:path";
import Papa from "papaparse";
import { log, warn, error } from "@/lib/logger";
import type {
  LotteryApiPayload,
  MarketPrice,
  RawLottery,
} from "@/lib/types";

// GET route handlers are uncached by default in Next.js 16 — correct here,
// since we read the CSV files from disk on every request (live data).
export const dynamic = "force-dynamic";

const DATA_DIR = path.join(process.cwd(), "data");
const LOTTERY_FILE = path.join(DATA_DIR, "lottery_data.csv");
const PRICES_FILE = path.join(DATA_DIR, "property_prices.csv");

/** Coerce a CSV cell into a finite number (strips commas / stray chars). */
function toNumber(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value !== "string") return 0;
  const cleaned = value.replace(/[^\d.-]/g, "");
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function str(value: unknown): string {
  return value == null ? "" : String(value).trim();
}

function parseLotteries(csv: string): RawLottery[] {
  const result = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length) {
    warn("INIT", "papaparse reported issues parsing lottery CSV", result.errors);
  }

  return result.data
    .map((row) => ({
      id: str(row["מספר הגרלה"]),
      type: str(row["סוג הגרלה"]),
      endDate: str(row["סיום הרשמה"]),
      city: str(row["יישוב"]),
      contractor: str(row["קבלן"]),
      apartments: toNumber(row["דירות בהגרלה"]),
      applicants: toNumber(row["נרשמים בהגרלה"]),
      pricePerMeter: toNumber(row["מחיר למטר"]),
      grant: toNumber(row["מענק"]),
      notes: str(row["הערות"]),
    }))
    .filter((l) => l.id && l.city);
}

function parseMarketPrices(csv: string): MarketPrice[] {
  const result = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length) {
    warn("INIT", "papaparse reported issues parsing market-price CSV", result.errors);
  }

  return result.data
    .map((row) => {
      // Header names embed quotes/units; resolve by fuzzy key matching.
      const keys = Object.keys(row);
      const cityKey = keys.find((k) => k.includes("יישוב")) ?? keys[0];
      const avgKey =
        keys.find((k) => k.includes("ממוצע") && k.includes("מטר")) ?? keys[1];
      const estKey =
        keys.find((k) => k.includes("100") || k.includes("מוערך")) ?? keys[2];
      return {
        city: str(row[cityKey]),
        avgPricePerMeter: toNumber(row[avgKey]),
        estimated100sqm: toNumber(row[estKey]),
      };
    })
    .filter((m) => m.city);
}

export async function GET() {
  try {
    log("INIT", "reading local CSV files from disk", {
      lotteryFile: LOTTERY_FILE,
      pricesFile: PRICES_FILE,
    });

    const [lotteryCsv, pricesCsv] = await Promise.all([
      readFile(LOTTERY_FILE, "utf8"),
      readFile(PRICES_FILE, "utf8"),
    ]);

    const lotteries = parseLotteries(lotteryCsv);
    const marketRows = parseMarketPrices(pricesCsv);

    const marketPrices: Record<string, number> = {};
    for (const m of marketRows) {
      marketPrices[m.city] = m.avgPricePerMeter;
    }

    log("INIT", "raw CSV parse complete", {
      lotteryRawBytes: lotteryCsv.length,
      pricesRawBytes: pricesCsv.length,
      lotteryRowCount: lotteries.length,
      marketRowCount: marketRows.length,
    });

    // Cross-check: every lottery city must exist in the market-price sheet.
    const lotteryCities = Array.from(new Set(lotteries.map((l) => l.city)));
    const unmatchedCities: string[] = [];
    for (const city of lotteryCities) {
      if (!(city in marketPrices)) {
        unmatchedCities.push(city);
        warn(
          "INIT",
          `city present in lottery data but MISSING from market prices: "${city}"`,
        );
      }
    }
    const matchedCities = lotteryCities.length - unmatchedCities.length;

    log("INIT", "city match audit", {
      distinctLotteryCities: lotteryCities.length,
      matchedCities,
      unmatchedCities,
    });

    const payload: LotteryApiPayload = {
      lotteries,
      marketPrices,
      meta: {
        lotteryRowCount: lotteries.length,
        marketRowCount: marketRows.length,
        matchedCities,
        unmatchedCities,
        generatedAt: new Date().toISOString(),
      },
    };

    return Response.json(payload);
  } catch (err) {
    error("INIT", "failed to read/parse CSV data files", err);
    return Response.json(
      { error: "Failed to load lottery data", detail: String(err) },
      { status: 500 },
    );
  }
}
