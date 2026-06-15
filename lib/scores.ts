/** Helpers for translating a 0–100 score into visual health cues. */
import type { CSSProperties } from "react";

export type ScoreTone = "high" | "mid" | "low";

export function scoreTone(score: number): ScoreTone {
  if (score >= 66.6) return "high";
  if (score >= 33.3) return "mid";
  return "low";
}

const TONE_VAR: Record<ScoreTone, string> = {
  high: "var(--score-high)",
  mid: "var(--score-mid)",
  low: "var(--score-low)",
};

/** CSS color value for a score (oklch token). */
export function scoreColor(score: number): string {
  return TONE_VAR[scoreTone(score)];
}

/** Inline style for a left-anchored gradient bar whose fill width = score%. */
export function scoreBarStyle(score: number): CSSProperties {
  const pct = Math.max(0, Math.min(100, score));
  const color = scoreColor(score);
  return {
    background: `linear-gradient(90deg, color-mix(in oklch, ${color} 28%, transparent) ${pct}%, transparent ${pct}%)`,
  };
}

/** Subtle translucent background tint for a score (used on table cells). */
export function scoreTintStyle(score: number): CSSProperties {
  const color = scoreColor(score);
  return {
    backgroundColor: `color-mix(in oklch, ${color} 16%, transparent)`,
    color: `color-mix(in oklch, ${color} 75%, var(--foreground))`,
  };
}
