"use client";

/*
 * Spaceship loading screen.
 *
 * An alien black-blue futuristic craft zigzags upward through 5 waypoints,
 * drawing a rising chart line behind it. Synchronized via CSS keyframes
 * defined in globals.css.
 *
 * Waypoints (240×240 SVG canvas):
 *   P0 (32, 205) → P1 (165, 158) → P2 (58, 112) → P3 (170, 65) → P4 (108, 18)
 * Path length ≈ 460 px → stroke-dasharray="460"
 */

const STARS = [
  { cx: 18,  cy: 22,  r: 1.0, dur: "2.2s", delay: "0s"   },
  { cx: 45,  cy: 8,   r: 0.8, dur: "1.8s", delay: "0.35s" },
  { cx: 72,  cy: 30,  r: 1.2, dur: "2.5s", delay: "0.7s"  },
  { cx: 100, cy: 12,  r: 0.9, dur: "2.0s", delay: "0.2s"  },
  { cx: 132, cy: 26,  r: 1.1, dur: "1.6s", delay: "1.0s"  },
  { cx: 160, cy: 8,   r: 0.7, dur: "2.3s", delay: "0.5s"  },
  { cx: 185, cy: 32,  r: 1.0, dur: "1.9s", delay: "0.8s"  },
  { cx: 210, cy: 14,  r: 0.8, dur: "2.1s", delay: "0.1s"  },
  { cx: 226, cy: 48,  r: 1.3, dur: "1.7s", delay: "0.6s"  },
  { cx: 200, cy: 82,  r: 0.9, dur: "2.4s", delay: "0.9s"  },
  { cx: 228, cy: 122, r: 0.7, dur: "2.0s", delay: "0.3s"  },
  { cx: 8,   cy: 60,  r: 1.1, dur: "1.8s", delay: "0.75s" },
  { cx: 12,  cy: 104, r: 0.8, dur: "2.2s", delay: "1.1s"  },
  { cx: 220, cy: 168, r: 1.0, dur: "1.9s", delay: "0.45s" },
  { cx: 5,   cy: 148, r: 0.9, dur: "2.3s", delay: "0.85s" },
];

// Chart nodes appear as the ship passes each waypoint
const WAYPOINTS = [
  { cx: 32,  cy: 205, delay: "0.2s"  },
  { cx: 165, cy: 158, delay: "1.15s" },
  { cx: 58,  cy: 112, delay: "2.05s" },
  { cx: 170, cy: 65,  delay: "2.8s"  },
  { cx: 108, cy: 18,  delay: "3.25s" },
];

const ANIM_DUR = "3.8s";

export function LoadingScreen() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-8"
      style={{ backgroundColor: "var(--background)" }}
    >
      <svg
        width="240"
        height="240"
        viewBox="0 0 240 240"
        aria-hidden="true"
        style={{ overflow: "visible" }}
      >
        {/* ── Stars ─────────────────────────────────────────────────── */}
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="currentColor"
            style={{
              animation: `star-twinkle ${s.dur} ease-in-out ${s.delay} infinite`,
            }}
          />
        ))}

        {/* ── Chart background glow path ─────────────────────────── */}
        <path
          d="M 32 205 L 165 158 L 58 112 L 170 65 L 108 18"
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="460"
          style={{
            filter: "blur(8px)",
            opacity: 0.18,
            animation: `draw-chart ${ANIM_DUR} ease-in-out infinite`,
          }}
        />

        {/* ── Chart line (crisp) ─────────────────────────────────── */}
        <path
          d="M 32 205 L 165 158 L 58 112 L 170 65 L 108 18"
          fill="none"
          stroke="var(--chart-1)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="460"
          style={{
            animation: `draw-chart ${ANIM_DUR} ease-in-out infinite`,
          }}
        />

        {/* ── Chart waypoint dots ────────────────────────────────── */}
        {WAYPOINTS.map((pt, i) => (
          <circle
            key={i}
            cx={pt.cx}
            cy={pt.cy}
            r="4"
            fill="var(--chart-1)"
            style={{
              animation: `dot-appear ${ANIM_DUR} ease-in-out ${pt.delay} infinite`,
              transformOrigin: `${pt.cx}px ${pt.cy}px`,
            }}
          />
        ))}
        {WAYPOINTS.map((pt, i) => (
          <circle
            key={`ring-${i}`}
            cx={pt.cx}
            cy={pt.cy}
            r="7"
            fill="none"
            stroke="var(--chart-1)"
            strokeWidth="1"
            opacity="0.4"
            style={{
              animation: `dot-appear ${ANIM_DUR} ease-in-out ${pt.delay} infinite`,
              transformOrigin: `${pt.cx}px ${pt.cy}px`,
            }}
          />
        ))}

        {/* ── Spaceship ─────────────────────────────────────────── */}
        {/*
         * Drawn at origin (0,0) pointing UP.
         * The ship-fly keyframe translates + rotates it.
         * Transform-origin must be "0px 0px" (center of ship group).
         */}
        <g style={{ animation: `ship-fly ${ANIM_DUR} ease-in-out infinite`, transformOrigin: "0px 0px" }}>

          {/* Engine exhaust glow — painted BEHIND hull */}
          <ellipse
            cx="0" cy="21" rx="7" ry="4"
            fill="var(--chart-2)"
            style={{ filter: "blur(5px)", animation: `engine-pulse 0.36s ease-in-out infinite` }}
          />
          <ellipse
            cx="0" cy="18" rx="3.5" ry="2"
            fill="white"
            opacity="0.7"
            style={{ filter: "blur(2px)", animation: `engine-pulse 0.36s ease-in-out 0.18s infinite` }}
          />

          {/* Wing glow rim */}
          <path
            d="M -8,-4 L -27,6 L -6,10 Z"
            fill="none"
            stroke="var(--chart-2)"
            strokeWidth="1"
            opacity="0.5"
            style={{ filter: "blur(1.5px)" }}
          />
          <path
            d="M 8,-4 L 27,6 L 6,10 Z"
            fill="none"
            stroke="var(--chart-2)"
            strokeWidth="1"
            opacity="0.5"
            style={{ filter: "blur(1.5px)" }}
          />

          {/* Wings — large swept-back delta */}
          <path
            d="M -8,-4 L -27,6 L -6,10 Z"
            fill="oklch(0.14 0.06 255)"
          />
          <path
            d="M 8,-4 L 27,6 L 6,10 Z"
            fill="oklch(0.14 0.06 255)"
          />

          {/* Wing-tip status lights */}
          <circle cx="-25" cy="5.5" r="1.6"
            fill="var(--chart-2)"
            style={{ animation: `engine-pulse 0.7s ease-in-out infinite` }}
          />
          <circle cx="25" cy="5.5" r="1.6"
            fill="var(--chart-2)"
            style={{ animation: `engine-pulse 0.7s ease-in-out 0.35s infinite` }}
          />

          {/* Hull body — angular alien shape */}
          <path
            d="M 0,-21 L -8,-5 L -6,10 L 0,15 L 6,10 L 8,-5 Z"
            fill="oklch(0.19 0.07 258)"
            stroke="var(--chart-1)"
            strokeWidth="0.7"
          />

          {/* Hull accent lines */}
          <line x1="-4" y1="-3" x2="4" y2="-3"
            stroke="var(--chart-1)" strokeWidth="0.6" opacity="0.55"
          />
          <line x1="-3" y1="3" x2="3" y2="3"
            stroke="var(--chart-2)" strokeWidth="0.5" opacity="0.45"
          />

          {/* Engine nozzle */}
          <rect x="-4.5" y="14" width="9" height="6" rx="1.5"
            fill="oklch(0.22 0.08 258)"
            stroke="var(--chart-1)"
            strokeWidth="0.5"
          />

          {/* Cockpit outer ring */}
          <circle cx="0" cy="-12" r="6"
            fill="oklch(0.52 0.22 218)"
            stroke="var(--chart-1)"
            strokeWidth="0.6"
          />
          {/* Cockpit glow bloom */}
          <circle cx="0" cy="-12" r="6"
            fill="var(--chart-2)"
            opacity="0.35"
            style={{ filter: "blur(3px)" }}
          />
          {/* Cockpit specular highlight */}
          <ellipse cx="-2" cy="-14.5" rx="2.2" ry="1.4"
            fill="rgba(255,255,255,0.45)"
          />

          {/* Sensor antenna */}
          <line x1="0" y1="-21" x2="0" y2="-26"
            stroke="var(--chart-1)" strokeWidth="0.8" opacity="0.7"
          />
          <circle cx="0" cy="-27" r="1.2"
            fill="var(--chart-2)"
            style={{ animation: `engine-pulse 1.1s ease-in-out infinite` }}
          />
        </g>
      </svg>

      {/* ── Loading text ───────────────────────────────────────────── */}
      <div
        className="flex flex-col items-center gap-3"
        style={{ animation: "fade-slide-up 0.6s ease-out 0.3s both" }}
      >
        <p
          className="text-sm font-medium tracking-wide"
          style={{ color: "var(--muted-foreground)" }}
        >
          הנחה מושכלת · טוען נתוני הגרלות
        </p>
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full"
              style={{
                backgroundColor: "var(--chart-1)",
                animation: `loading-dot 1.3s ease-in-out ${i * 0.22}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
