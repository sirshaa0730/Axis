<script lang="ts">
  import AnalysisHeader from './AnalysisHeader.svelte';
  import SelectedIncidentCard from './SelectedIncidentCard.svelte';
  import AnalysisModeSelector from './AnalysisModeSelector.svelte';
  import AnalysisMapHero from './AnalysisMapHero.svelte';
  import AnalysisMetricsStrip from './AnalysisMetricsStrip.svelte';
  import ImpactProjectionChart from './ImpactProjectionChart.svelte';
  import RainfallForecastChart from './RainfallForecastChart.svelte';
  import InfrastructureImpactDonut from './InfrastructureImpactDonut.svelte';
  import RiskDriversModal from './RiskDriversModal.svelte';
</script>

<div class="relative w-full h-full flex flex-col justify-between p-3 sm:p-4 gap-2.5 overflow-hidden bg-[#020711]/40 backdrop-blur-[2px]">
  
  <!-- 1. Top Multi-Hazard Analysis Header -->
  <div class="shrink-0 w-full">
    <AnalysisHeader />
  </div>

  <!-- 2. Selected Incident + Analysis Mode Selector Row -->
  <div class="shrink-0 w-full grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-3 items-end">
    <SelectedIncidentCard />
    <AnalysisModeSelector />
  </div>

  <!-- 3. Center Geospatial Analysis Hero Stage + Metrics Strip -->
  <div class="flex-1 flex flex-col md:flex-row gap-3 min-h-0 overflow-hidden relative">
    <!-- Center: Interactive Geospatial Risk Map -->
    <div class="flex-1 h-full min-h-[280px]">
      <AnalysisMapHero />
    </div>

    <!-- Right: Vertical Metrics Strip (6 Compact KPI Cards) -->
    <div class="shrink-0 flex h-full">
      <AnalysisMetricsStrip />
    </div>
  </div>

  <!-- 4. Bottom 3 Analytical & Forecast Panels -->
  <div class="shrink-0 w-full grid grid-cols-1 md:grid-cols-3 gap-3">
    <!-- Panel 1: Impact Projection (Dual Line Chart) -->
    <ImpactProjectionChart />

    <!-- Panel 2: Rainfall Forecast (Column Bar Chart) -->
    <RainfallForecastChart />

    <!-- Panel 3: Infrastructure Impact (Radial Ring Donut & Counts) -->
    <InfrastructureImpactDonut />
  </div>

  <!-- Progressive Disclosure: Explainable Risk Drivers Modal -->
  <RiskDriversModal />

</div>
