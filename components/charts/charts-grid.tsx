"use client";

import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  type ScatterShapeProps,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from "@/components/ui/chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/components/providers/dashboard-provider";
import { formatPercent, formatScore } from "@/lib/utils";
import type { CityAggregate } from "@/lib/types";

// ─── Configs ────────────────────────────────────────────────────────────────

const BAR_CONFIG: ChartConfig = {
  profitContribution: { label: "תרומת רווח",  color: "var(--chart-1)" },
  chanceContribution: { label: "תרומת סיכוי", color: "var(--chart-2)" },
};

const SCATTER_CONFIG: ChartConfig = {
  bubble: { label: "עיר", color: "var(--chart-1)" },
};

// ─── Rounded-pillar stacked bar ──────────────────────────────────────────────

function PillarBarChart({ cities }: { cities: CityAggregate[] }) {
  const sorted = [...cities].sort((a, b) => b.totalWeightedScore - a.totalWeightedScore);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-semibold">ציון משוקלל לפי עיר</CardTitle>
        <CardDescription className="text-xs">
          <span style={{ color: "var(--chart-1)" }}>■</span> רווח ·{" "}
          <span style={{ color: "var(--chart-2)" }}>■</span> סיכוי
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        <ChartContainer config={BAR_CONFIG} className="h-72 w-full">
          <BarChart
            data={sorted}
            margin={{ top: 8, right: 16, left: -16, bottom: 72 }}
            barCategoryGap="32%"
          >
            <defs>
              <linearGradient id="pillarProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="var(--chart-1)" stopOpacity={1} />
                <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0.6} />
              </linearGradient>
              <linearGradient id="pillarChance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="var(--chart-2)" stopOpacity={1} />
                <stop offset="100%" stopColor="var(--chart-2)" stopOpacity={0.6} />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              stroke="currentColor"
              strokeOpacity={0.06}
            />

            <XAxis
              dataKey="city"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "currentColor", opacity: 0.6 }}
              angle={-40}
              textAnchor="end"
              interval={0}
              height={75}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }}
              tickFormatter={(v: number) => v.toFixed(0)}
              width={30}
            />

            <ChartTooltip
              cursor={{ fill: "currentColor", opacity: 0.04, radius: 8 }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const profit = payload.find((p) => p.dataKey === "profitContribution");
                const chance = payload.find((p) => p.dataKey === "chanceContribution");
                const total = Number(profit?.value ?? 0) + Number(chance?.value ?? 0);
                return (
                  <div className="glass rounded-2xl px-4 py-3 text-xs min-w-[12rem]">
                    <p className="mb-2 font-bold text-sm">{label}</p>
                    <div className="grid gap-1.5">
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <span className="size-2 rounded-full" style={{ backgroundColor: "var(--chart-1)" }} />
                          רווח
                        </span>
                        <span className="tabular-nums font-medium">{formatScore(Number(profit?.value ?? 0))}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <span className="size-2 rounded-full" style={{ backgroundColor: "var(--chart-2)" }} />
                          סיכוי
                        </span>
                        <span className="tabular-nums font-medium">{formatScore(Number(chance?.value ?? 0))}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 border-t pt-1.5 mt-0.5">
                        <span className="text-muted-foreground">ציון כולל</span>
                        <span className="tabular-nums font-bold">{formatScore(total)}</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />

            {/* Bottom segment — flat top (connects to top segment) */}
            <Bar
              dataKey="profitContribution"
              stackId="score"
              fill="url(#pillarProfit)"
              radius={[0, 0, 0, 0]}
              maxBarSize={28}
            />
            {/* Top segment — pill-rounded top per spec: radius={[9999,9999,0,0]} */}
            <Bar
              dataKey="chanceContribution"
              stackId="score"
              fill="url(#pillarChance)"
              radius={[9999, 9999, 0, 0]}
              maxBarSize={28}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ─── Liquid bubble scatter ───────────────────────────────────────────────────

interface BubblePoint {
  city: string;
  x: number;   // rawCityChancePct
  y: number;   // avgProfitPct
  score: number;
}

/** Renders each scatter node as a perfect liquid circle with frosted micro-border */
const LiquidBubble = (props: ScatterShapeProps & { payload?: BubblePoint }) => {
  const cx = Number(props.cx ?? 0);
  const cy = Number(props.cy ?? 0);
  const payload = props.payload;
  if (!payload) return null;

  const t = Math.min(Math.max(payload.score / 100, 0), 1);
  const r = 8 + t * 18;  // 8–26 px

  return (
    <g>
      {/* Outer glow ring */}
      <circle
        cx={cx} cy={cy} r={r + 5}
        fill="none"
        stroke="var(--chart-1)"
        strokeWidth={1}
        strokeOpacity={0.10 + t * 0.10}
      />
      {/* Main liquid body */}
      <circle
        cx={cx} cy={cy} r={r}
        fill={`color-mix(in oklch, var(--chart-1) ${Math.round(18 + t * 26)}%, transparent)`}
        stroke="rgba(255,255,255,0.20)"
        strokeWidth={1.5}
      />
      {/* Inner specular highlight — top-left */}
      <circle
        cx={cx - r * 0.24}
        cy={cy - r * 0.30}
        r={r * 0.30}
        fill="rgba(255,255,255,0.10)"
      />
    </g>
  );
};

function median(arr: number[]): number {
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 !== 0 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function OpportunityMap({ cities }: { cities: CityAggregate[] }) {
  const data: BubblePoint[] = cities.map((c) => ({
    city: c.city,
    x: c.rawCityChancePct,
    y: c.avgProfitPct,
    score: c.totalWeightedScore,
  }));

  const medX = median(data.map((d) => d.x));
  const medY = median(data.map((d) => d.y));

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-semibold">מפת הזדמנויות</CardTitle>
        <CardDescription className="text-xs">
          X = סיכוי · Y = רווח · גודל = ציון משוקלל
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        <ChartContainer config={SCATTER_CONFIG} className="h-72 w-full">
          <ScatterChart margin={{ top: 24, right: 32, left: 0, bottom: 24 }}>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="currentColor"
              strokeOpacity={0.06}
            />

            {/* Quadrant dividers */}
            <ReferenceLine x={medX} stroke="currentColor" strokeOpacity={0.12} strokeDasharray="6 4" />
            <ReferenceLine y={medY} stroke="currentColor" strokeOpacity={0.12} strokeDasharray="6 4" />

            <XAxis
              type="number"
              dataKey="x"
              name="סיכוי"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }}
              tickFormatter={(v: number) => `${v.toFixed(1)}%`}
            />
            <YAxis
              type="number"
              dataKey="y"
              name="רווח"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fill: "currentColor", opacity: 0.5 }}
              tickFormatter={(v: number) => `${v.toFixed(0)}%`}
            />

            <ChartTooltip
              cursor={false}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as BubblePoint;
                return (
                  <div className="glass rounded-2xl px-4 py-3 text-xs min-w-[11rem]">
                    <p className="mb-1.5 font-bold text-sm">{d.city}</p>
                    <div className="grid gap-1">
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">סיכוי אמיתי</span>
                        <span className="tabular-nums font-medium">{formatPercent(d.x)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">רווח ממוצע</span>
                        <span className="tabular-nums font-medium">{formatPercent(d.y)}</span>
                      </div>
                      <div className="flex justify-between gap-4 border-t pt-1.5">
                        <span className="text-muted-foreground">ציון</span>
                        <span className="tabular-nums font-bold">{formatScore(d.score)}</span>
                      </div>
                    </div>
                  </div>
                );
              }}
            />

            <Scatter name="ערים" data={data} shape={LiquidBubble} />
          </ScatterChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

// ─── Grid ────────────────────────────────────────────────────────────────────

export function ChartsGrid() {
  const { computation } = useDashboard();
  const { cities } = computation;

  if (!cities.length) {
    return (
      <div className="flex h-40 items-center justify-center rounded-2xl border text-sm text-muted-foreground">
        אין נתונים להצגה
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <PillarBarChart cities={cities} />
      <OpportunityMap cities={cities} />
    </div>
  );
}
