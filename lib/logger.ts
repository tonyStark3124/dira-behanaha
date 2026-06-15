/**
 * Hyper-verbose, prefixed logging used across the data lifecycle.
 * Every transformation step emits a structured log with a visual prefix so
 * file reads, computations, filtering, aggregation and UI actions are all
 * effortlessly traceable in the browser console (and the server terminal).
 */

export type LogPhase =
  | "INIT"
  | "COMPUTE"
  | "FILTER"
  | "AGGREGATE"
  | "UI_ACTION";

const STYLE: Record<LogPhase, string> = {
  INIT: "color:#6366f1;font-weight:700",
  COMPUTE: "color:#0ea5e9;font-weight:700",
  FILTER: "color:#f59e0b;font-weight:700",
  AGGREGATE: "color:#10b981;font-weight:700",
  UI_ACTION: "color:#a855f7;font-weight:700",
};

function prefix(phase: LogPhase): string {
  return `[LOTTERY_ENGINE:${phase}]`;
}

const browser = typeof window !== "undefined";

export const log = (phase: LogPhase, message: string, payload?: unknown) => {
  const head = prefix(phase);
  if (browser) {
    if (payload !== undefined) {
      console.log(`%c${head}`, STYLE[phase], message, payload);
    } else {
      console.log(`%c${head}`, STYLE[phase], message);
    }
  } else {
    if (payload !== undefined) console.log(head, message, payload);
    else console.log(head, message);
  }
};

export const warn = (phase: LogPhase, message: string, payload?: unknown) => {
  if (payload !== undefined) console.warn(prefix(phase), message, payload);
  else console.warn(prefix(phase), message);
};

export const error = (phase: LogPhase, message: string, payload?: unknown) => {
  if (payload !== undefined) console.error(prefix(phase), message, payload);
  else console.error(prefix(phase), message);
};
