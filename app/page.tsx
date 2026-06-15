import { DashboardShell } from "@/components/dashboard-shell";
import { HeroBanner } from "@/components/hero-banner";
import { KpiGrid } from "@/components/kpi/kpi-grid";
import { ChartsGrid } from "@/components/charts/charts-grid";
import { ScoreTable } from "@/components/tables/score-table";
import { CityComparisonPanel } from "@/components/tables/city-comparison-panel";
import { MobileRecommendationHero } from "@/components/mobile/recommendation-hero";
import { MobileCityRankingCards } from "@/components/mobile/city-ranking-cards";
import { MobileControlsAccordion } from "@/components/mobile/mobile-controls";

export default function HomePage() {
  return (
    <DashboardShell>
      {/* Hero banner — spans full content width above all layouts */}
      <HeroBanner />

      {/* ═══════════════════════════════════════════════════════
          MOBILE LAYOUT  (< md)
          Answer first → context → details on demand.
          Controls accordion provides quick weight/filter access
          without opening the sidebar drawer.
      ══════════════════════════════════════════════════════════ */}
      <div className="space-y-4 md:hidden">
        <MobileRecommendationHero />
        <KpiGrid />
        <MobileControlsAccordion />
        <CityComparisonPanel />
        <MobileCityRankingCards />
      </div>

      {/* ═══════════════════════════════════════════════════════
          DESKTOP LAYOUT  (≥ md)
          Sidebar handles all controls. Page focuses on analysis.
      ══════════════════════════════════════════════════════════ */}
      <div className="hidden space-y-6 md:block">
        <KpiGrid />
        <ChartsGrid />
        <CityComparisonPanel />
        <ScoreTable />
      </div>
    </DashboardShell>
  );
}
