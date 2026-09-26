export type HazardType = 'flood' | 'cyclone' | 'wildfire' | 'earthquake' | 'infrastructure_failure';
export type SeverityLevel = 'critical' | 'high' | 'moderate' | 'low';

export interface Coordinates {
  lat: number;
  lng: number;
  altitude?: number;
}

export interface HazardIncident {
  id: string;
  name: string;
  type: HazardType;
  region: string;
  country: string;
  coords: Coordinates;
  severity: SeverityLevel;
  affectedPopulation: string;
  affectedPopulationNum: number;
  relativeTime: string;
  timestamp: string;
  riskScore: number; // 0-100
  confidence: number; // 0.0 - 1.0
  thumbnailUrl?: string;
  status: 'active' | 'escalating' | 'contained' | 'monitoring';
  details: {
    rainfallRate?: string;
    windSpeed?: string;
    temperature?: string;
    shelterDemand?: string;
    roadAccessibility?: string;
    description: string;
  };
}

export interface ScenarioItem {
  id: string;
  title: string;
  subtitle: string;
  location?: string;
  category?: string;
  icon: string;
  tag: string;
  baselineMetric: string;
  projectedMetric: string;
  delta: string;
  details: string;
  impactStats?: string;
}

export interface TelemetrySummary {
  satellitesOnline: number;
  weatherFeedsStatus: 'Live' | 'Degraded' | 'Offline';
  groundSensors: number;
  dataSources: number;
  activeIncidents: number;
  highRisk: number;
  countriesAffected: number;
  peopleAffected: string;
  responseTeams: number;
  activeShelters: number;
  criticalResourcesPct: number;
}

export interface IncidentUpdate {
  id: string;
  type: 'shelter' | 'hazard' | 'route' | 'weather';
  text: string;
  timeAgo: string;
  severity: 'alert' | 'warning' | 'info';
}
