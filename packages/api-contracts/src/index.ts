export type HazardType = 'flood' | 'cyclone' | 'wildfire' | 'earthquake' | 'infrastructure_failure';

export type SeverityLevel = 'critical' | 'high' | 'moderate' | 'low';

export interface Coordinates {
  lat: number;
  lng: number;
  altitude?: number;
}

export interface Hazard {
  id: string;
  type: HazardType;
  name: string;
  locationName: string;
  coords: Coordinates;
  severity: SeverityLevel;
  affectedPopulation: number;
  radiusKm: number;
  status: 'active' | 'contained' | 'escalating' | 'monitoring';
  reportedAt: string;
  intensity: number; // 0-100
  confidence: number; // 0-1
  impactSummary: string;
  details: {
    rainfallMm?: number;
    windSpeedKmh?: number;
    tempCelsius?: number;
    riverLevelMeters?: number;
    burnedAreaHectares?: number;
    magnitude?: number;
    roadAccessibilityPct?: number;
    shelterCapacityPct?: number;
  };
}

export interface ScenarioImpact {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  rainfallDeltaPct?: number;
  riskBaseline: number;
  riskScenario: number;
  affectedPopulationBaseline: number;
  affectedPopulationScenario: number;
  affectedRoadsBaseline: number;
  affectedRoadsScenario: number;
  shelterCapacityBaselinePct: number;
  shelterCapacityScenarioPct: number;
  recommendedAction: string;
  confidence: number;
}

export interface TelemetryStats {
  satellitesOnline: number;
  weatherFeedsStatus: 'Live' | 'Degraded' | 'Offline';
  groundSensorsActive: number;
  dataSourcesCount: number;
  activeIncidentsCount: number;
  highRiskCount: number;
  affectedCountriesCount: number;
  totalPopulationAffected: number;
  responseTeamsDeployed: number;
  activeSheltersCount: number;
  criticalResourcePct: number;
}

export interface RecentUpdate {
  id: string;
  type: 'shelter' | 'hazard' | 'route' | 'weather';
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'alert';
}
