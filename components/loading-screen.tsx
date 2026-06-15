"use client";

// ── constants ──────────────────────────────────────────────────────────────
const GY   = 242;          // ground Y in SVG coords
const MX   = 160;          // machine center X
const MY   = 152;          // machine center Y
const MRX  = 62;           // machine radius X
const MRY  = 48;           // machine radius Y
const CLIP_RX = 53;        // clip ellipse rx (MRX minus ball radius)
const CLIP_RY = 39;        // clip ellipse ry

// ── building definitions ────────────────────────────────────────────────────
type BDef = {
  x: number; w: number; h: number;
  wC: number; wR: number;
  crane: "l" | "r" | null;
  ms: number;
};

const BLDGS: BDef[] = [
  { x: 0,   w: 48, h: 148, wC: 3, wR: 7, crane: "r", ms: 0   },
  { x: 52,  w: 34, h: 88,  wC: 2, wR: 4, crane: null,ms: 140 },
  { x: 90,  w: 50, h: 170, wC: 4, wR: 9, crane: "r", ms: 50  }, // crane tip ≈ x 197
  { x: 198, w: 50, h: 160, wC: 4, wR: 8, crane: "l", ms: 90  }, // crane tip ≈ x 141
  { x: 256, w: 38, h: 96,  wC: 3, wR: 5, crane: null,ms: 190 },
  { x: 298, w: 42, h: 130, wC: 3, wR: 6, crane: "l", ms: 70  },
];

// ── lottery balls ───────────────────────────────────────────────────────────
const BALLS = [
  { f: "oklch(0.55 0.22 240)", orbit: "a", dur: 2.2,  d: 0.00 },
  { f: "oklch(0.52 0.18 145)", orbit: "b", dur: 1.82, d: 0.35 },
  { f: "oklch(0.60 0.20 75)",  orbit: "d", dur: 1.50, d: 0.12 },
  { f: "oklch(0.50 0.22 20)",  orbit: "c", dur: 2.80, d: 0.62 },
  { f: "oklch(0.52 0.20 285)", orbit: "e", dur: 2.05, d: 0.88 },
  { f: "oklch(0.58 0.18 195)", orbit: "b", dur: 1.68, d: 1.20 },
];
const WIN_FILL = "oklch(0.80 0.19 80)"; // bright gold winner ball

// ── sub-components ──────────────────────────────────────────────────────────

function Crane({ bx, bw, bTop, dir }: { bx: number; bw: number; bTop: number; dir: "l" | "r" }) {
  const mX      = dir === "r" ? bx + bw - 5 : bx + 5;
  const mastTop = bTop - 50;
  const jibLen  = dir === "r" ? 62 : -62;
  const ctrLen  = dir === "r" ? -16 : 16;
  const tipX    = mX + jibLen;
  const ctrX    = mX + ctrLen;
  const supX    = mX + jibLen * 0.65;
  const wireLen = 30;

  return (
    <g stroke="var(--muted-foreground)" strokeLinecap="round" fill="none" opacity="0.72">
      {/* vertical mast */}
      <line x1={mX} y1={bTop} x2={mX} y2={mastTop} strokeWidth="2.5" />
      {/* full jib: counterweight side to main tip */}
      <line x1={ctrX} y1={mastTop} x2={tipX} y2={mastTop} strokeWidth="2" />
      {/* diagonal support cable */}
      <line x1={mX} y1={mastTop} x2={supX} y2={mastTop + 9} strokeWidth="0.9" opacity="0.55" />
      {/* counterweight block */}
      <rect x={ctrX - 5} y={mastTop - 6} width={12} height={8} rx={1.5}
        fill="var(--muted)" stroke="var(--muted-foreground)" strokeWidth="0.8"
      />
      {/* swinging trolley wire + load */}
      <g style={{
        transformOrigin: `${tipX}px ${mastTop}px`,
        animation: "crane-sway 3.2s ease-in-out infinite",
      }}>
        <line x1={tipX} y1={mastTop} x2={tipX} y2={mastTop + wireLen} strokeWidth="0.9" />
        <rect x={tipX - 6} y={mastTop + wireLen} width={12} height={10} rx={2}
          fill="var(--muted)" stroke="var(--muted-foreground)" strokeWidth="0.9"
        />
      </g>
    </g>
  );
}

function Building({ x, w, h, wC, wR, crane, ms }: BDef) {
  const top = GY - h;
  const ds  = ms / 1000;
  const pX  = 5;
  const pT  = 10;
  const winW = Math.max(3, Math.floor((w - pX * 2 - (wC - 1) * 4) / wC));
  const winH = 5;
  const gX   = wC > 1 ? Math.floor((w - pX * 2 - winW * wC) / (wC - 1)) : 0;
  const gY   = wR > 1 ? Math.floor((h - pT - 5 - winH * wR) / (wR - 1)) : 0;

  return (
    <g style={{
      transformBox: "fill-box",
      transformOrigin: "50% 100%",
      animation: `building-rise 0.58s cubic-bezier(0.34,1.56,0.64,1) ${ds}s both`,
    }}>
      {crane && <Crane bx={x} bw={w} bTop={top} dir={crane} />}

      {/* body */}
      <rect x={x} y={top} width={w} height={h} rx={2}
        fill="var(--card)" stroke="var(--border)" strokeWidth="0.8"
      />
      {/* roof accent stripe */}
      <rect x={x} y={top} width={w} height={5} rx={2}
        fill="color-mix(in oklch, var(--primary) 30%, transparent)"
      />

      {/* windows */}
      {Array.from({ length: wR }, (_, r) =>
        Array.from({ length: wC }, (_, c) => {
          const lit = (r + c) % 3 !== 0;
          const wx  = x + pX + c * (winW + gX);
          const wy  = top + pT + r * (winH + gY);
          return (
            <rect
              key={`${r}-${c}`}
              x={wx} y={wy} width={winW} height={winH} rx={0.8}
              fill={lit ? "oklch(0.88 0.16 85)" : "oklch(0.10 0.04 258)"}
              style={lit
                ? { opacity: 0, animation: `window-light 1.4s ease-out ${ds + 0.44 + (r * wC + c) * 0.038}s both` }
                : { opacity: 0.18 }}
            />
          );
        })
      )}
    </g>
  );
}

function LotteryMachine() {
  const tubeTop = MY - MRY - 22;
  return (
    <>
      {/* stand legs */}
      <line x1={MX - 22} y1={MY + MRY} x2={MX - 17} y2={MY + MRY + 20}
        stroke="var(--muted-foreground)" strokeWidth="3.5" strokeLinecap="round"
      />
      <line x1={MX + 22} y1={MY + MRY} x2={MX + 17} y2={MY + MRY + 20}
        stroke="var(--muted-foreground)" strokeWidth="3.5" strokeLinecap="round"
      />
      <line x1={MX - 17} y1={MY + MRY + 20} x2={MX + 17} y2={MY + MRY + 20}
        stroke="var(--muted-foreground)" strokeWidth="3" strokeLinecap="round"
      />

      {/* exit tube */}
      <rect x={MX - 8} y={tubeTop} width={16} height={24} rx={4}
        fill="var(--card)" stroke="var(--chart-1)" strokeWidth="1.5"
      />

      {/* drum fill (semi-transparent glass) */}
      <ellipse cx={MX} cy={MY} rx={MRX} ry={MRY}
        fill="color-mix(in oklch, var(--primary) 6%, transparent)"
      />
      {/* cage structure: horizontal band */}
      <ellipse cx={MX} cy={MY} rx={MRX} ry={18}
        fill="none" stroke="var(--chart-1)" strokeWidth="0.9" opacity="0.32"
      />
      {/* cage structure: vertical band */}
      <line x1={MX} y1={MY - MRY} x2={MX} y2={MY + MRY}
        stroke="var(--chart-1)" strokeWidth="0.9" opacity="0.32"
      />
      {/* inner highlight rim */}
      <ellipse cx={MX} cy={MY} rx={MRX - 3} ry={MRY - 3}
        fill="none" stroke="white" strokeWidth="0.6" opacity="0.11"
      />

      {/* winner ball (not clipped — exits machine) */}
      <circle cx={MX} cy={MY} r={11}
        fill={WIN_FILL}
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
        style={{ animation: "winner-rise 5.6s ease-in-out 0.8s infinite" }}
      />

      {/* regular balls (clipped to drum interior) */}
      <g clipPath="url(#lm-clip)">
        {BALLS.map((b, i) => (
          <circle key={i} cx={MX} cy={MY} r={9}
            fill={b.f}
            stroke="rgba(255,255,255,0.28)"
            strokeWidth="0.7"
            style={{ animation: `orbit-${b.orbit} ${b.dur}s linear ${b.d}s infinite` }}
          />
        ))}
      </g>

      {/* drum border (drawn after balls → appears as cage front) */}
      <ellipse cx={MX} cy={MY} rx={MRX} ry={MRY}
        fill="none" stroke="var(--chart-1)" strokeWidth="2.2"
      />
    </>
  );
}

// ── main export ─────────────────────────────────────────────────────────────

export function LoadingScreen() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6"
      style={{ backgroundColor: "var(--background)" }}
    >
      <svg
        width="320"
        height="260"
        viewBox="0 0 320 260"
        aria-hidden="true"
        style={{ overflow: "visible" }}
      >
        <defs>
          <clipPath id="lm-clip">
            <ellipse cx={MX} cy={MY} rx={CLIP_RX} ry={CLIP_RY} />
          </clipPath>
        </defs>

        {/* ground line */}
        <line x1="0" y1={GY} x2="320" y2={GY}
          stroke="var(--border)" strokeWidth="1.5" strokeLinecap="round"
        />

        {/* buildings (rendered first → behind machine) */}
        {BLDGS.map((b, i) => <Building key={i} {...b} />)}

        {/* lottery machine (rendered last → in front of buildings) */}
        <LotteryMachine />
      </svg>

      <div
        className="flex flex-col items-center gap-3"
        style={{ animation: "fade-slide-up 0.6s ease-out 0.3s both" }}
      >
        <p
          className="text-sm font-medium tracking-wide"
          style={{ color: "var(--muted-foreground)" }}
        >
          מגריל את הנתונים…
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
