export type HazardType = 'flood' | 'cyclone' | 'wildfire' | 'earthquake' | 'infrastructure_failure' | 'storm' | 'heatwave';
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
  displacedPopulation?: string;
  displacedPopulationNum?: number;
  roadsAffected?: number;
  districtsAffected?: number;
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
  overview?: {
    summary: string;
    riskLevel: string;
    projectedConditions: string;
    keyMetrics: Array<{ label: string; value: string; sub?: string }>;
  };
  impact?: {
    population: Array<{ label: string; value: string; pct: number; color?: string }>;
    infrastructure: Array<{ label: string; value: string; status: 'critical' | 'warning' | 'nominal' }>;
    healthcare: string;
    shelterOccupancy: string;
    roadAccessibility: string;
  };
  forecast?: {
    timeline: Array<{ time: string; areaKm2: number; popAtRisk: string; rainfallDelta: string; severityScore: number }>;
    trendSummary: string;
    crestTime?: string;
  };
  response?: {
    teamsDeployed: number;
    activeShelters: number;
    bedsAvailable: number;
    reliefSuppliesDays: number;
    units: Array<{ name: string; type: string; status: string; location: string }>;
  };
  geometry?: {
    center: [number, number]; // [lng, lat]
    bounds: [[number, number], [number, number]]; // [[minLng, minLat], [maxLng, maxLat]]
    floodExtent?: Array<[number, number]>; // polygon vertices in [lng, lat]
    secondaryExtent?: Array<[number, number]>;
    highRiskZones?: Array<{ name: string; coords: [number, number]; radiusKm: number; severity: string }>;
    affectedDistricts?: Array<{ name: string; coords: [number, number]; population: string; risk: string }>;
    rivers?: Array<{ name: string; path: Array<[number, number]> }>;
    cities?: Array<{ name: string; coords: [number, number]; population: string; isCapital?: boolean }>;
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
