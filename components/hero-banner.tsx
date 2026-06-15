"use client";

import { useEffect, useRef, useState } from "react";
import { useDashboard } from "@/components/providers/dashboard-provider";

// ── Stars (dark mode only) — fixed positions, no Math.random ──────────────
const STARS = [
  { x: "6%",  y: "14%", r: 1.2, o: 0.55, d: "0s"    },
  { x: "14%", y: "30%", r: 0.9, o: 0.40, d: "0.4s"  },
  { x: "23%", y: "9%",  r: 1.5, o: 0.50, d: "0.8s"  },
  { x: "38%", y: "20%", r: 1.0, o: 0.35, d: "0.2s"  },
  { x: "51%", y: "7%",  r: 1.8, o: 0.60, d: "1.0s"  },
  { x: "62%", y: "24%", r: 1.1, o: 0.45, d: "0.6s"  },
  { x: "75%", y: "11%", r: 1.4, o: 0.50, d: "1.2s"  },
  { x: "84%", y: "27%", r: 0.9, o: 0.38, d: "0.3s"  },
  { x: "96%", y: "34%", r: 1.0, o: 0.35, d: "0.5s"  },
  { x: "29%", y: "38%", r: 0.8, o: 0.30, d: "1.1s"  },
  { x: "47%", y: "32%", r: 1.2, o: 0.40, d: "0.7s"  },
] as const;

// ── City skyline buildings ─────────────────────────────────────────────────
interface Bldg { x: number; w: number; h: number; a?: boolean }

const BLDGS: Bldg[] = [
  { x: 5,    w: 38,  h: 38 },
  { x: 50,   w: 55,  h: 68 },
  { x: 112,  w: 65,  h: 90,  a: true },
  { x: 184,  w: 30,  h: 50 },
  { x: 222,  w: 85,  h: 110, a: true },
  { x: 315,  w: 35,  h: 62 },
  { x: 358,  w: 55,  h: 78 },
  { x: 422,  w: 30,  h: 45 },
  { x: 458,  w: 50,  h: 98 },
  { x: 516,  w: 70,  h: 115, a: true },
  { x: 594,  w: 38,  h: 72 },
  { x: 640,  w: 55,  h: 85 },
  { x: 705,  w: 40,  h: 55 },
  { x: 754,  w: 65,  h: 92,  a: true },
  { x: 827,  w: 32,  h: 60 },
  { x: 868,  w: 58,  h: 80 },
  { x: 935,  w: 75,  h: 105, a: true },
  { x: 1018, w: 35,  h: 65 },
  { x: 1061, w: 55,  h: 82 },
  { x: 1125, w: 40,  h: 55 },
  { x: 1174, w: 62,  h: 72 },
  { x: 1245, w: 35,  h: 42 },
  { x: 1290, w: 55,  h: 62 },
  { x: 1354, w: 70,  h: 38 },
  { x: 1432, w: 8,   h: 52 },
];

const CVS = 130; // SVG canvas height (px)

function SkylineBuilding({ x, w, h, a, isDark }: Bldg & { isDark: boolean }) {
  const topY    = CVS - h;
  const winW    = 4, winH = 5, colGap = 7, rowGap = 9;
  const numCols = Math.max(1, Math.floor((w - 12) / (winW + colGap)));
  const numRows = Math.min(Math.max(0, Math.floor((h - 20) / (winH + rowGap))), 7);
  const total   = numRows * numCols;

  const strokeColor = isDark ? "rgba(255,255,255,0.48)" : "rgba(14,35,75,0.65)";
  const fillColor   = isDark ? "rgba(255,255,255,0.03)" : "rgba(14,35,75,0.08)";
  const antColor    = isDark ? "rgba(255,255,255,0.45)" : "rgba(14,35,75,0.55)";

  return (
    <g>
      <rect
        x={x} y={topY} width={w} height={h}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth="1"
      />
      {Array.from({ length: total }, (_, idx) => {
        const r  = Math.floor(idx / numCols);
        const c  = idx % numCols;
        const ph = (r + c) % 3;
        /* Dark: white windows · Light: glass (sky reflection) + dark walls */
        const winFill = isDark
          ? `rgba(255,255,255,${ph === 0 ? 0.55 : ph === 1 ? 0.18 : 0.07})`
          : ph === 0
            ? "rgba(100,150,215,0.50)"  // glass reflecting sky
            : ph === 1
            ? "rgba(14,35,75,0.22)"     // dim interior
            : "rgba(14,35,75,0.08)";    // dark interior

        return (
          <rect
            key={idx}
            x={x + 6 + c * (winW + colGap)}
            y={topY + 12 + r * (winH + rowGap)}
            width={winW} height={winH}
            fill={winFill}
          />
        );
      })}
      {a && (
        <line
          x1={x + w / 2} y1={topY}
          x2={x + w / 2} y2={topY - 14}
          stroke={antColor}
          strokeWidth="1"
        />
      )}
    </g>
  );
}

function StatChip({
  value,
  label,
  isDark,
  accentDark,
  accentLight,
}: {
  value: string | number;
  label: string;
  isDark: boolean;
  accentDark: string;
  accentLight: string;
}) {
  const accent = isDark ? accentDark : accentLight;
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.35rem",
        padding: "0.275rem 0.7rem",
        borderRadius: 9999,
        background: isDark
          ? "oklch(0.10 0.05 260 / 0.55)"
          : "rgba(255,255,255,0.48)",
        border: isDark
          ? `1px solid ${accentDark}44`
          : "1px solid rgba(14,35,75,0.20)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        transition: "background 0.35s ease, border-color 0.35s ease",
      }}
    >
      <span
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: accent,
          fontVariantNumeric: "tabular-nums",
          transition: "color 0.35s ease",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: "0.625rem",
          color: isDark ? "oklch(0.63 0.04 240)" : "oklch(0.28 0.06 240)",
          transition: "color 0.35s ease",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function HeroBanner() {
  const { computation, meta } = useDashboard();

  /*
   * Track the .dark class on <html> reactively.
   * Default = true (dark) to match the anti-FOUC script's default behaviour.
   * useEffect syncs to the real value immediately after hydration.
   */
  const [isDark, setIsDark] = useState(true);

  const starsRef     = useRef<HTMLDivElement>(null);
  const celestialRef = useRef<HTMLDivElement>(null); // moon (dark) or sun (light)
  const skylineRef   = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const check = () =>
      setIsDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if (starsRef.current)
        starsRef.current.style.transform = `translateY(${-(y * 0.28).toFixed(1)}px)`;
      if (celestialRef.current)
        celestialRef.current.style.transform = `translateY(${-(y * 0.13).toFixed(1)}px)`;
      if (skylineRef.current)
        skylineRef.current.style.transform = `translateY(${(y * 0.06).toFixed(1)}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cityCount    = computation.cities.length;
  const lotteryCount = computation.totalAfterFilter;
  const topCity      = computation.kpis.optimalCity?.city ?? null;

  /* ── Theme-aware values ─────────────────────────────────── */
  const bgGradient = isDark
    ? `
        radial-gradient(ellipse 55% 70% at 80% 50%,
          oklch(0.16 0.14 275 / 0.45), transparent 62%),
        radial-gradient(ellipse 45% 60% at 18% 38%,
          oklch(0.12 0.10 228 / 0.30), transparent 58%),
        linear-gradient(135deg,
          oklch(0.09 0.08 265) 0%,
          oklch(0.07 0.06 252) 55%,
          oklch(0.05 0.04 238) 100%)
      `
    : `linear-gradient(180deg,
        oklch(0.48 0.20 232) 0%,
        oklch(0.62 0.18 224) 35%,
        oklch(0.76 0.13 216) 68%,
        oklch(0.84 0.09 210) 100%)`;

  const brandColor   = isDark ? "white" : "oklch(0.10 0.09 238)";
  const taglineColor = isDark ? "oklch(0.70 0.06 240)" : "oklch(0.20 0.08 238)";

  /* Sun glow layers */
  const sunShadow = `
    0 0 0  7px oklch(0.90 0.20 88 / 0.24),
    0 0 0 16px oklch(0.90 0.20 88 / 0.11),
    0 0 38px   oklch(0.88 0.18 86 / 0.60),
    0 0 80px   oklch(0.88 0.18 86 / 0.32)
  `;
  const moonShadow = "0 0 10px rgba(255,255,255,0.10), 0 0 26px rgba(255,255,255,0.05)";

  return (
    <div
      className="-mx-4 -mt-6 mb-6 sm:-mx-6 sm:-mt-8 sm:mb-8"
      style={{
        position: "relative",
        overflow: "hidden",
        minHeight: "clamp(140px, 20vw, 202px)",
        background: bgGradient,
        transition: "background 0.4s ease",
      }}
    >
      {/* ── Stars — fade out in light mode ────────────────── */}
      <div
        ref={starsRef}
        aria-hidden
        style={{
          position: "absolute", inset: 0,
          willChange: "transform",
          opacity: isDark ? 1 : 0,
          transition: "opacity 0.4s ease",
          pointerEvents: "none",
        }}
      >
        {STARS.map((s, i) => (
          <span
            key={i}
            style={{
              position: "absolute",
              left: s.x, top: s.y,
              width: `${s.r * 2}px`, height: `${s.r * 2}px`,
              borderRadius: "50%", background: "white",
              opacity: s.o,
              animation: `star-twinkle 2.8s ease-in-out ${s.d} infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* ── Celestial body: Moon (dark) ↔ Sun (light) ───────── */}
      <div
        ref={celestialRef}
        aria-hidden
        style={{
          position: "absolute",
          top: "10%", right: "9%",
          width:  isDark ? 26 : 34,
          height: isDark ? 26 : 34,
          borderRadius: "50%",
          background: isDark ? "rgba(255,255,255,0.025)" : "oklch(0.91 0.21 88)",
          border: isDark ? "1.5px solid rgba(255,255,255,0.58)" : "none",
          boxShadow: isDark ? moonShadow : sunShadow,
          willChange: "transform",
          transition: "all 0.4s ease",
        }}
      />

      {/* ── Ambient glow (dark mode only) ────────────────────── */}
      {isDark && (
        <div
          aria-hidden
          style={{
            position: "absolute",
            insetInlineEnd: "4%", top: "50%",
            transform: "translateY(-50%)",
            width: 320, height: 320, borderRadius: "50%",
            background: "oklch(0.52 0.22 218 / 0.09)",
            filter: "blur(80px)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* ── Text content ──────────────────────────────────────── */}
      <div
        style={{
          position: "relative", zIndex: 1,
          display: "flex", flexDirection: "column",
          justifyContent: "center", gap: "0.55rem",
          padding: "clamp(0.875rem, 2.5vw, 1.75rem) clamp(1rem, 3vw, 2rem)",
          paddingBottom: 0,
          minHeight: "clamp(80px, 10vw, 110px)",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "clamp(1.55rem, 4.5vw, 2.75rem)",
              fontWeight: 900, lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: brandColor,
              textShadow: isDark ? "0 0 50px oklch(0.52 0.22 218 / 0.42)" : "none",
              transition: "color 0.4s ease, text-shadow 0.4s ease",
            }}
          >
            הנחה מושכלת
          </div>
          <p
            style={{
              fontSize: "clamp(0.68rem, 1.5vw, 0.84rem)",
              color: taglineColor,
              marginTop: "0.18rem",
              lineHeight: 1.4,
              transition: "color 0.4s ease",
            }}
          >
            כי לא כל הגרלה שווה אותו דבר&ensp;·&ensp;חינמי לגמרי, בלי פרסומות
          </p>
        </div>

        {meta && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
            <StatChip
              value={cityCount} label="ערים"
              isDark={isDark}
              accentDark="oklch(0.68 0.17 148)"
              accentLight="oklch(0.30 0.16 148)"
            />
            <StatChip
              value={lotteryCount} label="הגרלות"
              isDark={isDark}
              accentDark="oklch(0.68 0.17 218)"
              accentLight="oklch(0.28 0.16 218)"
            />
            {topCity && (
              <StatChip
                value={topCity} label="עיר מובילה"
                isDark={isDark}
                accentDark="oklch(0.78 0.14 75)"
                accentLight="oklch(0.38 0.16 75)"
              />
            )}
          </div>
        )}
      </div>

      {/* ── City skyline (parallax: slowest) ──────────────────── */}
      <svg
        ref={skylineRef}
        aria-hidden
        viewBox={`0 0 1440 ${CVS}`}
        preserveAspectRatio="none"
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          width: "100%", height: "clamp(65px, 12vw, 110px)",
          willChange: "transform", pointerEvents: "none",
        }}
      >
        {BLDGS.map((b) => (
          <SkylineBuilding key={b.x} {...b} isDark={isDark} />
        ))}
      </svg>

      {/* ── Bottom fade to page background ────────────────────── */}
      <div
        aria-hidden
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 44,
          background: "linear-gradient(to bottom, transparent, var(--background))",
          pointerEvents: "none", zIndex: 2,
        }}
      />
    </div>
  );
}
