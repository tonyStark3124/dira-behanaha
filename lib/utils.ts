import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conditional logic, de-duplicating conflicts. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Clamp a number into the inclusive [min, max] range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

/** Format a number as ILS currency (Hebrew locale, no fraction by default). */
export function formatILS(value: number, fractionDigits = 0): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(Number.isFinite(value) ? value : 0);
}

/** Format a plain integer with Hebrew thousands separators. */
export function formatInt(value: number): string {
  return new Intl.NumberFormat("he-IL", { maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0,
  );
}

/** Format a percentage value already expressed on a 0–100 scale. */
export function formatPercent(value: number, fractionDigits = 1): string {
  if (!Number.isFinite(value)) return "0%";
  return `${value.toFixed(fractionDigits)}%`;
}

/** Format a 0–100 score for display. */
export function formatScore(value: number, fractionDigits = 1): string {
  if (!Number.isFinite(value)) return "0";
  return value.toFixed(fractionDigits);
}
