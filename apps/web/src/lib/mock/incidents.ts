import type { HazardIncident } from '../types';

export const MOCK_INCIDENTS: HazardIncident[] = [
  {
    id: 'inc-01',
    name: 'Severe Flooding',
    type: 'flood',
    region: 'Sylhet & Dhaka Divisions',
    country: 'Bangladesh',
    coords: { lat: 23.685, lng: 90.356 },
    severity: 'critical',
    affectedPopulation: '2.4M affected',
    affectedPopulationNum: 2400000,
    relativeTime: '3 hours ago',
    timestamp: '2026-09-26T15:00:00Z',
    riskScore: 92,
    confidence: 0.94,
    thumbnailUrl: '/assets/flood_thumb.jpg',
    status: 'escalating',
    details: {
      rainfallRate: '+38mm/hr (Monsoon surge)',
      riverLevelMeters: 4.8,
      shelterDemand: '18 Shelters at 86% Capacity',
      roadAccessibility: '42% Major Arterials Inaccessible',
      description: 'Surging river levels and extreme monsoon precipitation have breached embankments across Sylhet and surrounding lowlands.'
    }
  },
  {
    id: 'inc-02',
    name: 'Cyclone Marex',
    type: 'cyclone',
    region: 'Central Basin',
    country: 'Indian Ocean',
    coords: { lat: -12.2, lng: 76.5 },
    severity: 'high',
    affectedPopulation: '850K affected',
    affectedPopulationNum: 850000,
    relativeTime: '5 hours ago',
    timestamp: '2026-09-26T13:00:00Z',
    riskScore: 84,
    confidence: 0.89,
    thumbnailUrl: '/assets/cyclone_thumb.jpg',
    status: 'active',
    details: {
      windSpeed: '185 km/h (Category 3)',
      shelterDemand: 'Coastal Evacuation Protocol Tier 2',
      roadAccessibility: 'Maritime Shipping Lanes Closed',
      description: 'Intense cyclonic vortex tracking northeastward with sustained central barometric pressure of 958 hPa.'
    }
  },
  {
    id: 'inc-03',
    name: 'Wildfire Outbreak',
    type: 'wildfire',
    region: 'Alberta / British Columbia',
    country: 'Canada',
    coords: { lat: 54.1, lng: -116.8 },
    severity: 'high',
    affectedPopulation: '120K affected',
    affectedPopulationNum: 120000,
    relativeTime: '6 hours ago',
    timestamp: '2026-09-26T12:00:00Z',
    riskScore: 78,
    confidence: 0.91,
    thumbnailUrl: '/assets/wildfire_thumb.jpg',
    status: 'active',
    details: {
      temperature: '34°C (Severe Drought & Wind Gusts)',
      shelterDemand: 'Regional Emergency Centers Activated',
      roadAccessibility: 'Highway 16 Corridor Intermittent',
      description: 'Multiple lightning-induced firefronts merged under high gusting conditions, threatening perimeter communities.'
    }
  }
];
