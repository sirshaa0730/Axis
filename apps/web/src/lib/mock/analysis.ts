import type { IncidentAnalysisData, HazardSelectorType, AnalysisMode } from '../types';

export const MOCK_ANALYSIS_DATABASE: Record<string, Record<AnalysisMode, IncidentAnalysisData>> = {
  // 1. Bangladesh Flood (inc-01) - PRIMARY REFERENCE TARGET
  'inc-01': {
    current: {
      incidentId: 'inc-01',
      hazardType: 'flood',
      mode: 'current',
      riskLevel: 'CRITICAL',
      confidencePct: 87,
      metrics: {
        peopleAffected: '2.4M',
        peopleAffectedSub: 'People Affected',
        displaced: '1.2M',
        displacedSub: 'Displaced',
        districts: 12,
        districtsSub: 'Districts',
        roadsAffected: 37,
        roadsSub: 'Roads Affected',
        healthFacilities: 18,
        healthSub: 'Health Facilities',
        majorBridges: 6,
        bridgesSub: 'Major Bridges'
      },
      projection: {
        estimatedAffected: '3.2M',
        increasePct: '+32%',
        riskTrend: 'HIGH',
        timeline: [
          { label: 'Now', affected: 2.4, displaced: 1.2 },
          { label: '+7 days', affected: 2.8, displaced: 1.5 },
          { label: '+14 days', affected: 3.1, displaced: 1.8 },
          { label: '+30 days', affected: 3.2, displaced: 1.9 }
        ]
      },
      rainfall: {
        cumulativeMm: 380,
        timeframe: 'Next 7 days',
        aboveAveragePct: 45,
        floodRiskLevel: 'HIGH',
        bars: [
          { day: 'Now', amountMm: 120, anomalyPct: 15 },
          { day: '1d', amountMm: 260, anomalyPct: 35 },
          { day: '3d', amountMm: 520, anomalyPct: 65 },
          { day: '5d', amountMm: 410, anomalyPct: 50 },
          { day: '7d', amountMm: 220, anomalyPct: 25 }
        ]
      },
      infrastructure: {
        networkAffectedPct: 37,
        networkLabel: 'Road Network Affected',
        items: [
          { label: 'Roads', count: 37, icon: 'road' },
          { label: 'Highways', count: 8, icon: 'highway' },
          { label: 'Bridges', count: 6, icon: 'bridge' },
          { label: 'Health Facilities', count: 18, icon: 'hospital' },
          { label: 'Power Stations', count: 4, icon: 'power' },
          { label: 'Water Systems', count: 12, icon: 'water' }
        ]
      },
      riskDrivers: [
        { name: 'Hazard Intensity', score: 94, weight: 0.30, description: 'Surma & Kushiyara river crest +1.84m over maximum flood danger mark' },
        { name: 'Population Exposure', score: 88, weight: 0.25, description: '2.4M residents in flood-inundated delta depressions with limited egress' },
        { name: 'Infrastructure Impact', score: 76, weight: 0.20, description: '37 critical arterial links and 4 power distribution substations offline' },
        { name: 'Accessibility Disruption', score: 65, weight: 0.15, description: 'N2 highway flooded; 14 sub-districts reachable only by amphibious craft' },
        { name: 'Vulnerability Index', score: 82, weight: 0.10, description: 'High density of thatched dwellings and contaminated drinking tubewells' }
      ],
      historicalBenchmark: {
        eventName: '1998 Bangladesh Mega-Flood',
        eventYear: 1998,
        comparisons: [
          { metric: 'Inundation Area', current: '38% Nation', historical: '68% Nation', diffPct: '-30%', higherIsWorse: true },
          { metric: 'Displaced Population', current: '1.2M', historical: '30M', diffPct: '-96%', higherIsWorse: true },
          { metric: 'Peak River Crest', current: '+1.84m', historical: '+2.10m', diffPct: '-0.26m', higherIsWorse: true },
          { metric: 'Warning Lead Time', current: '72 hours', historical: '12 hours', diffPct: '+500%', higherIsWorse: false }
        ]
      }
    },
    short_term: {
      incidentId: 'inc-01',
      hazardType: 'flood',
      mode: 'short_term',
      riskLevel: 'CRITICAL',
      confidencePct: 91,
      metrics: {
        peopleAffected: '2.8M',
        peopleAffectedSub: 'Projected +7d',
        displaced: '1.5M',
        displacedSub: 'Shelter Demand',
        districts: 14,
        districtsSub: '2 Expanding',
        roadsAffected: 44,
        roadsSub: '+7 At Risk',
        healthFacilities: 22,
        healthSub: '+4 Threatened',
        majorBridges: 7,
        bridgesSub: '+1 Scour Risk'
      },
      projection: {
        estimatedAffected: '2.8M',
        increasePct: '+16.6%',
        riskTrend: 'HIGH',
        timeline: [
          { label: 'Now', affected: 2.4, displaced: 1.2 },
          { label: '+2 days', affected: 2.55, displaced: 1.35 },
          { label: '+4 days', affected: 2.7, displaced: 1.45 },
          { label: '+7 days', affected: 2.8, displaced: 1.5 }
        ]
      },
      rainfall: {
        cumulativeMm: 450,
        timeframe: 'Next 7 days',
        aboveAveragePct: 62,
        floodRiskLevel: 'CRITICAL',
        bars: [
          { day: 'Now', amountMm: 140, anomalyPct: 20 },
          { day: '1d', amountMm: 310, anomalyPct: 45 },
          { day: '3d', amountMm: 580, anomalyPct: 75 },
          { day: '5d', amountMm: 460, anomalyPct: 55 },
          { day: '7d', amountMm: 280, anomalyPct: 35 }
        ]
      },
      infrastructure: {
        networkAffectedPct: 44,
        networkLabel: 'Road Network Affected',
        items: [
          { label: 'Roads', count: 44, icon: 'road' },
          { label: 'Highways', count: 11, icon: 'highway' },
          { label: 'Bridges', count: 7, icon: 'bridge' },
          { label: 'Health Facilities', count: 22, icon: 'hospital' },
          { label: 'Power Stations', count: 6, icon: 'power' },
          { label: 'Water Systems', count: 16, icon: 'water' }
        ]
      },
      riskDrivers: [
        { name: 'Hazard Intensity', score: 96, weight: 0.30, description: 'Upper Meghalaya cloudburst runoff arriving via Meghna river junction' },
        { name: 'Population Exposure', score: 90, weight: 0.25, description: 'Expanding to secondary haor villages in Habiganj and Brahmanbaria' },
        { name: 'Infrastructure Impact', score: 82, weight: 0.20, description: 'Power grid sub-transmission line 132kV Sylhet South at tipping point' },
        { name: 'Accessibility Disruption', score: 74, weight: 0.15, description: 'Bridge 4 pier scour limits heavy transport access' },
        { name: 'Vulnerability Index', score: 85, weight: 0.10, description: 'Food security reserves depleted in 8 flood evacuation points' }
      ]
    },
    long_term: {
      incidentId: 'inc-01',
      hazardType: 'flood',
      mode: 'long_term',
      riskLevel: 'HIGH',
      confidencePct: 79,
      metrics: {
        peopleAffected: '3.2M',
        peopleAffectedSub: 'Peak 30d Exposure',
        displaced: '1.9M',
        displacedSub: 'Protracted Stay',
        districts: 15,
        districtsSub: 'Delta Basins',
        roadsAffected: 56,
        roadsSub: 'Structural Damage',
        healthFacilities: 26,
        healthSub: 'Waterborne Surge',
        majorBridges: 9,
        bridgesSub: 'Rehab Required'
      },
      projection: {
        estimatedAffected: '3.2M',
        increasePct: '+33.3%',
        riskTrend: 'HIGH',
        timeline: [
          { label: 'Now', affected: 2.4, displaced: 1.2 },
          { label: '+10 days', affected: 2.9, displaced: 1.6 },
          { label: '+20 days', affected: 3.15, displaced: 1.85 },
          { label: '+30 days', affected: 3.2, displaced: 1.9 }
        ]
      },
      rainfall: {
        cumulativeMm: 820,
        timeframe: 'Next 30 days',
        aboveAveragePct: 28,
        floodRiskLevel: 'HIGH',
        bars: [
          { day: 'W1', amountMm: 380, anomalyPct: 45 },
          { day: 'W2', amountMm: 240, anomalyPct: 20 },
          { day: 'W3', amountMm: 120, anomalyPct: -5 },
          { day: 'W4', amountMm: 80, anomalyPct: -15 }
        ]
      },
      infrastructure: {
        networkAffectedPct: 52,
        networkLabel: 'Transit & Utility Degradation',
        items: [
          { label: 'Roads', count: 56, icon: 'road' },
          { label: 'Highways', count: 14, icon: 'highway' },
          { label: 'Bridges', count: 9, icon: 'bridge' },
          { label: 'Health Facilities', count: 26, icon: 'hospital' },
          { label: 'Power Stations', count: 8, icon: 'power' },
          { label: 'Water Systems', count: 24, icon: 'water' }
        ]
      },
      riskDrivers: [
        { name: 'Hazard Intensity', score: 72, weight: 0.30, description: 'Monsoon plateau followed by slow coastal water recession' },
        { name: 'Population Exposure', score: 85, weight: 0.25, description: 'Prolonged displacement causing agricultural disruption across Aman paddy' },
        { name: 'Infrastructure Impact', score: 88, weight: 0.20, description: 'Erosion and bank failure across 180km of protective earthen embankments' },
        { name: 'Accessibility Disruption', score: 62, weight: 0.15, description: 'Temporary pontoon bridges stabilizing supply corridors' },
        { name: 'Vulnerability Index', score: 89, weight: 0.10, description: 'Risk of post-flood waterborne epidemics (Cholera & Leptospirosis)' }
      ]
    },
    comparative: {
      incidentId: 'inc-01',
      hazardType: 'flood',
      mode: 'comparative',
      riskLevel: 'CRITICAL',
      confidencePct: 94,
      metrics: {
        peopleAffected: '2.4M',
        peopleAffectedSub: 'vs 30M (1998)',
        displaced: '1.2M',
        displacedSub: 'vs 18M (1998)',
        districts: 12,
        districtsSub: 'vs 52 (1998)',
        roadsAffected: 37,
        roadsSub: 'vs 220 (1998)',
        healthFacilities: 18,
        healthSub: 'vs 140 (1998)',
        majorBridges: 6,
        bridgesSub: 'vs 45 (1998)'
      },
      projection: {
        estimatedAffected: '3.2M',
        increasePct: '+32%',
        riskTrend: 'HIGH',
        timeline: [
          { label: 'Current 2026', affected: 2.4, displaced: 1.2 },
          { label: '2022 Floods', affected: 7.2, displaced: 3.8 },
          { label: '2004 Floods', affected: 36.0, displaced: 10.5 },
          { label: '1998 Floods', affected: 30.0, displaced: 18.0 }
        ]
      },
      rainfall: {
        cumulativeMm: 380,
        timeframe: '7-day Peak Comparative',
        aboveAveragePct: 45,
        floodRiskLevel: 'HIGH',
        bars: [
          { day: '2026 Current', amountMm: 380, anomalyPct: 45 },
          { day: '2022 Surge', amountMm: 510, anomalyPct: 78 },
          { day: '2004 Monsoon', amountMm: 460, anomalyPct: 62 },
          { day: '1998 Record', amountMm: 620, anomalyPct: 110 }
        ]
      },
      infrastructure: {
        networkAffectedPct: 37,
        networkLabel: 'Current vs Benchmark',
        items: [
          { label: 'Roads Affected', count: 37, icon: 'road' },
          { label: '1998 Roads Lost', count: 220, icon: 'highway' },
          { label: 'Bridges at Risk', count: 6, icon: 'bridge' },
          { label: '1998 Bridges Lost', count: 45, icon: 'hospital' }
        ]
      },
      riskDrivers: [
        { name: 'Satellite Early Warning', score: 95, weight: 0.35, description: 'SAR Sentinel-1 & Earth Observation warning gave 72h lead time vs 12h in 1998' },
        { name: 'Polder Infrastructure', score: 78, weight: 0.25, description: 'Modernized embankments prevented 4.2M additional downstream exposure' },
        { name: 'Response Readiness', score: 84, weight: 0.20, description: 'Rapid amphibious deployment reduced isolated casualties by 82%' }
      ],
      historicalBenchmark: {
        eventName: '1998 Bangladesh Mega-Flood',
        eventYear: 1998,
        comparisons: [
          { metric: 'Total Population Exposed', current: '2.4M', historical: '30.0M', diffPct: '-92%', higherIsWorse: true },
          { metric: 'National Territory Submerged', current: '38%', historical: '68%', diffPct: '-30%', higherIsWorse: true },
          { metric: 'Displacement Evacuees', current: '1.2M', historical: '18.0M', diffPct: '-93%', higherIsWorse: true },
          { metric: 'Embankment Breaches', current: '7 points', historical: '84 points', diffPct: '-91%', higherIsWorse: true },
          { metric: 'Forecast Accuracy Window', current: '94% (72h)', historical: '35% (12h)', diffPct: '+59%', higherIsWorse: false }
        ]
      }
    }
  },

  // 2. Cyclone Marex (inc-02)
  'inc-02': {
    current: {
      incidentId: 'inc-02',
      hazardType: 'cyclone',
      mode: 'current',
      riskLevel: 'HIGH',
      confidencePct: 89,
      metrics: {
        peopleAffected: '850K',
        peopleAffectedSub: 'Coastal Corridor',
        displaced: '420K',
        displacedSub: 'Evacuated Inland',
        districts: 6,
        districtsSub: 'Maritime Zones',
        roadsAffected: 19,
        roadsSub: 'Coastal Trunk Lines',
        healthFacilities: 9,
        healthSub: 'Emergency Surge',
        majorBridges: 3,
        bridgesSub: 'Causeways Shut'
      },
      projection: {
        estimatedAffected: '1.4M',
        increasePct: '+64%',
        riskTrend: 'HIGH',
        timeline: [
          { label: 'Now', affected: 0.85, displaced: 0.42 },
          { label: '+7 days', affected: 1.15, displaced: 0.65 },
          { label: '+14 days', affected: 1.35, displaced: 0.78 },
          { label: '+30 days', affected: 1.4, displaced: 0.82 }
        ]
      },
      rainfall: {
        cumulativeMm: 420,
        timeframe: 'Next 7 days',
        aboveAveragePct: 85,
        floodRiskLevel: 'CRITICAL',
        bars: [
          { day: 'Now', amountMm: 180, anomalyPct: 40 },
          { day: '1d', amountMm: 340, anomalyPct: 80 },
          { day: '3d', amountMm: 490, anomalyPct: 110 },
          { day: '5d', amountMm: 290, anomalyPct: 55 },
          { day: '7d', amountMm: 110, anomalyPct: 15 }
        ]
      },
      infrastructure: {
        networkAffectedPct: 42,
        networkLabel: 'Port & Maritime Grid Affected',
        items: [
          { label: 'Roads', count: 19, icon: 'road' },
          { label: 'Ports', count: 4, icon: 'port' },
          { label: 'Bridges', count: 3, icon: 'bridge' },
          { label: 'Health Facilities', count: 9, icon: 'hospital' },
          { label: 'Power Substations', count: 5, icon: 'power' },
          { label: 'Telecom Towers', count: 28, icon: 'telecom' }
        ]
      },
      riskDrivers: [
        { name: 'Sustained Wind Speed', score: 92, weight: 0.35, description: 'Category 3 cyclone packing 185 km/h gusts with 4.5m storm surge' },
        { name: 'Coastal Elevation Vulnerability', score: 85, weight: 0.25, description: 'Low-lying littoral communities vulnerable to marine overwash' },
        { name: 'Port Disruption', score: 79, weight: 0.20, description: 'Major shipping berths closed; cargo handling cranes secured' }
      ]
    },
    short_term: {
      incidentId: 'inc-02',
      hazardType: 'cyclone',
      mode: 'short_term',
      riskLevel: 'HIGH',
      confidencePct: 86,
      metrics: {
        peopleAffected: '1.15M',
        displaced: '650K',
        districts: 8,
        roadsAffected: 26,
        healthFacilities: 12,
        majorBridges: 4
      },
      projection: {
        estimatedAffected: '1.2M',
        increasePct: '+41%',
        riskTrend: 'HIGH',
        timeline: [
          { label: 'Now', affected: 0.85, displaced: 0.42 },
          { label: '+2d', affected: 1.05, displaced: 0.55 },
          { label: '+4d', affected: 1.15, displaced: 0.65 },
          { label: '+7d', affected: 1.2, displaced: 0.68 }
        ]
      },
      rainfall: {
        cumulativeMm: 460,
        timeframe: 'Next 7 days',
        aboveAveragePct: 92,
        floodRiskLevel: 'CRITICAL',
        bars: [
          { day: 'Now', amountMm: 200, anomalyPct: 45 },
          { day: '1d', amountMm: 380, anomalyPct: 90 },
          { day: '3d', amountMm: 520, anomalyPct: 120 },
          { day: '5d', amountMm: 310, anomalyPct: 60 },
          { day: '7d', amountMm: 120, anomalyPct: 20 }
        ]
      },
      infrastructure: {
        networkAffectedPct: 48,
        networkLabel: 'Maritime Grid Affected',
        items: [
          { label: 'Roads', count: 26, icon: 'road' },
          { label: 'Ports', count: 4, icon: 'port' },
          { label: 'Bridges', count: 4, icon: 'bridge' },
          { label: 'Health Facilities', count: 12, icon: 'hospital' }
        ]
      },
      riskDrivers: [
        { name: 'Storm Surge Inundation', score: 95, weight: 0.40, description: '4.5m surge predicted at high tide window' }
      ]
    },
    long_term: {
      incidentId: 'inc-02',
      hazardType: 'cyclone',
      mode: 'long_term',
      riskLevel: 'MODERATE',
      confidencePct: 75,
      metrics: {
        peopleAffected: '1.4M',
        displaced: '820K',
        districts: 9,
        roadsAffected: 32,
        healthFacilities: 14,
        majorBridges: 5
      },
      projection: {
        estimatedAffected: '1.4M',
        increasePct: '+64%',
        riskTrend: 'MODERATE',
        timeline: [
          { label: 'Now', affected: 0.85, displaced: 0.42 },
          { label: '+10d', affected: 1.25, displaced: 0.72 },
          { label: '+20d', affected: 1.38, displaced: 0.80 },
          { label: '+30d', affected: 1.4, displaced: 0.82 }
        ]
      },
      rainfall: {
        cumulativeMm: 680,
        timeframe: 'Next 30 days',
        aboveAveragePct: 35,
        floodRiskLevel: 'MODERATE',
        bars: [
          { day: 'W1', amountMm: 420, anomalyPct: 85 },
          { day: 'W2', amountMm: 180, anomalyPct: 20 },
          { day: 'W3', amountMm: 50, anomalyPct: -10 },
          { day: 'W4', amountMm: 30, anomalyPct: -25 }
        ]
      },
      infrastructure: {
        networkAffectedPct: 54,
        networkLabel: 'Reconstruction Required',
        items: [
          { label: 'Roads', count: 32, icon: 'road' },
          { label: 'Ports', count: 4, icon: 'port' }
        ]
      },
      riskDrivers: [
        { name: 'Marine Salt Contamination', score: 82, weight: 0.35, description: 'Saline intrusion across agricultural coastal aquifers' }
      ]
    },
    comparative: {
      incidentId: 'inc-02',
      hazardType: 'cyclone',
      mode: 'comparative',
      riskLevel: 'HIGH',
      confidencePct: 91,
      metrics: {
        peopleAffected: '850K',
        displaced: '420K',
        districts: 6,
        roadsAffected: 19,
        healthFacilities: 9,
        majorBridges: 3
      },
      projection: {
        estimatedAffected: '1.4M',
        increasePct: '+64%',
        riskTrend: 'HIGH',
        timeline: [
          { label: 'Marex 2026', affected: 0.85, displaced: 0.42 },
          { label: 'Cyclone Freddy 2023', affected: 2.2, displaced: 1.4 },
          { label: 'Cyclone Idai 2019', affected: 3.0, displaced: 1.8 }
        ]
      },
      rainfall: {
        cumulativeMm: 420,
        timeframe: 'Cyclone Benchmark',
        aboveAveragePct: 85,
        floodRiskLevel: 'CRITICAL',
        bars: [
          { day: 'Marex 2026', amountMm: 420, anomalyPct: 85 },
          { day: 'Freddy 2023', amountMm: 680, anomalyPct: 140 },
          { day: 'Idai 2019', amountMm: 590, anomalyPct: 120 }
        ]
      },
      infrastructure: {
        networkAffectedPct: 42,
        networkLabel: 'Historical Cyclone Impact',
        items: [
          { label: 'Ports Shut', count: 4, icon: 'port' },
          { label: 'Freddy Ports Lost', count: 9, icon: 'port' }
        ]
      },
      riskDrivers: [
        { name: 'Ocean Heat Content', score: 88, weight: 0.40, description: 'Rapid intensification index triggered over 29.5C sea-surface anomalies' }
      ]
    }
  }
};

// Fallback helper to safely retrieve analysis data for any incident, hazard type, or mode
export function getAnalysisData(incidentId: string, hazardType: HazardSelectorType, mode: AnalysisMode): IncidentAnalysisData {
  if (MOCK_ANALYSIS_DATABASE[incidentId] && MOCK_ANALYSIS_DATABASE[incidentId][mode]) {
    const data = MOCK_ANALYSIS_DATABASE[incidentId][mode];
    return { ...data, hazardType };
  }
  // Default fallback to Bangladesh Flood current dataset adapted
  const base = MOCK_ANALYSIS_DATABASE['inc-01'][mode] || MOCK_ANALYSIS_DATABASE['inc-01']['current'];
  return {
    ...base,
    incidentId,
    hazardType,
    mode
  };
}
