import type {
  ResourceItem,
  ResourceCategory,
  ResourceMetrics,
  ResourceRequest,
  ShipmentItem,
  FacilityItem,
  PersonnelItem,
  ResourceOperationItem
} from '../../types/resources';

export interface HazardResourcePackage {
  hazardId: string;
  hazardName: string;
  locationName: string;
  center: [number, number]; // [lng, lat]
  metrics: ResourceMetrics;
  categoryCounts: Record<ResourceCategory, number>;
  resources: ResourceItem[];
  requests: ResourceRequest[];
  shipments: ShipmentItem[];
  facilities: FacilityItem[];
  personnel: PersonnelItem[];
  operations: ResourceOperationItem[];
}

export const floodResourceData: HazardResourcePackage = {
  hazardId: 'inc-001',
  hazardName: 'Severe Flooding',
  locationName: 'Bangladesh - Dhaka Division',
  center: [90.4125, 23.8103],
  metrics: {
    totalAssets: 512,
    available: 387,
    deployed: 96,
    inMaintenance: 29,
    requested: 24,
    readinessRate: 92,
    utilizationRate: 76
  },
  categoryCounts: {
    'All Resources': 512,
    'Helicopters': 24,
    'Boats': 48,
    'Ground Vehicles': 120,
    'Medical Supplies': 85,
    'Food & Water': 110,
    'Temporary Shelters': 45,
    'Fuel & Energy': 32,
    'Communication Equipment': 28,
    'Search & Rescue Equipment': 20
  },
  resources: [
    {
      id: 'H-001',
      category: 'Helicopters',
      type: 'Helicopter',
      name: 'Airbus H145 Super Puma',
      location: 'Dhaka Air Base',
      coords: [90.39, 23.85],
      status: 'AVAILABLE',
      capacity: '8 personnel',
      capacityNum: 8,
      assignedTo: '—',
      fuelOrStockPct: 82,
      condition: 'Excellent',
      hoursOperated: 142,
      operator: 'Bangladesh Air Wing',
      depot: 'Tejgaon Hangar 3',
      lastUpdated: '5 mins ago'
    },
    {
      id: 'H-002',
      category: 'Helicopters',
      type: 'Helicopter',
      name: 'UH-60 Black Hawk',
      location: 'Chittagong Base',
      coords: [91.83, 22.36],
      status: 'DEPLOYED',
      capacity: '12 personnel',
      capacityNum: 12,
      assignedTo: 'Rescue Op-01',
      fuelOrStockPct: 65,
      condition: 'Good',
      hoursOperated: 380,
      operator: 'Coast Guard Air Detachment',
      depot: 'Patenga FOB',
      lastUpdated: '12 mins ago'
    },
    {
      id: 'H-003',
      category: 'Helicopters',
      type: 'Helicopter',
      name: 'Mil Mi-17 Heavy Lift',
      location: 'Sylhet Air Base',
      coords: [91.87, 24.89],
      status: 'MAINTENANCE',
      capacity: '24 personnel',
      capacityNum: 24,
      assignedTo: 'Avionics Service',
      fuelOrStockPct: 40,
      condition: 'Needs Service',
      hoursOperated: 820,
      operator: 'Joint Aviation Command',
      depot: 'Sylhet Hangar 1',
      lastUpdated: '1 hour ago'
    },
    {
      id: 'B-001',
      category: 'Boats',
      type: 'Rescue Boat',
      name: 'Zodiac MilPro Titan 1',
      location: 'Dhaka North Riverfront',
      coords: [90.38, 23.88],
      status: 'DEPLOYED',
      capacity: '10 personnel',
      capacityNum: 10,
      assignedTo: 'Water Evac Team R-01',
      fuelOrStockPct: 74,
      condition: 'Good',
      hoursOperated: 64,
      operator: 'Civil Defense Marine Unit',
      depot: 'Mirpur Boat Ramp',
      lastUpdated: '2 mins ago'
    },
    {
      id: 'B-002',
      category: 'Boats',
      type: 'Rescue Boat',
      name: 'Zodiac MilPro Titan 2',
      location: 'Mymensingh Crossing',
      coords: [90.41, 24.75],
      status: 'EN ROUTE',
      capacity: '10 personnel',
      capacityNum: 10,
      assignedTo: 'Brahmaputra Patrol',
      fuelOrStockPct: 88,
      condition: 'Excellent',
      hoursOperated: 32,
      operator: 'Water Rescue Brigade',
      depot: 'Old Brahmaputra Pier',
      lastUpdated: '8 mins ago'
    },
    {
      id: 'B-003',
      category: 'Boats',
      type: 'Rescue Boat',
      name: 'Catamaran Rescue Shuttle',
      location: 'Barisal Naval Pier',
      coords: [90.35, 22.70],
      status: 'AVAILABLE',
      capacity: '15 personnel',
      capacityNum: 15,
      assignedTo: '—',
      fuelOrStockPct: 95,
      condition: 'Excellent',
      hoursOperated: 18,
      operator: 'Delta Marine Reserves',
      depot: 'Kirtankhola Pier 2',
      lastUpdated: '15 mins ago'
    },
    {
      id: 'V-101',
      category: 'Ground Vehicles',
      type: 'Supply Truck',
      name: 'Heavy 6x6 Freight Carrier',
      location: 'Dhaka Central Depot',
      coords: [90.42, 23.73],
      status: 'EN ROUTE',
      capacity: '5 tons',
      capacityNum: 5,
      assignedTo: 'Supply Run-03',
      fuelOrStockPct: 70,
      condition: 'Good',
      hoursOperated: 210,
      operator: 'Logistics Battalion 4',
      depot: 'Tejgaon Central Depot',
      lastUpdated: '10 mins ago'
    },
    {
      id: 'V-102',
      category: 'Ground Vehicles',
      type: 'Amphibious APC',
      name: 'BTR-80 Amphibious Carrier',
      location: 'Rajshahi Depot',
      coords: [88.60, 24.37],
      status: 'AVAILABLE',
      capacity: '14 personnel',
      capacityNum: 14,
      assignedTo: '—',
      fuelOrStockPct: 90,
      condition: 'Excellent',
      hoursOperated: 110,
      operator: 'Military Disaster Task Force',
      depot: 'Padma Defense Depot',
      lastUpdated: '20 mins ago'
    },
    {
      id: 'M-201',
      category: 'Medical Supplies',
      type: 'Mobile Medical Unit',
      name: 'Field Trauma Clinic M-201',
      location: 'Sylhet Relief Hub',
      coords: [91.85, 24.91],
      status: 'DEPLOYED',
      capacity: '20 beds',
      capacityNum: 20,
      assignedTo: 'Medical Op-02',
      fuelOrStockPct: 58,
      condition: 'Good',
      hoursOperated: 95,
      operator: 'Red Crescent Medical Corps',
      depot: 'Sylhet Civil Field Base',
      lastUpdated: '14 mins ago'
    },
    {
      id: 'M-202',
      category: 'Medical Supplies',
      type: 'Emergency Pharmacy Container',
      name: 'IV & Cholera Vaccine Stockpile',
      location: 'Dhaka Central Depot',
      coords: [90.41, 23.75],
      status: 'AVAILABLE',
      capacity: '12 tons',
      capacityNum: 12,
      assignedTo: '—',
      fuelOrStockPct: 92,
      condition: 'Excellent',
      hoursOperated: 0,
      operator: 'Ministry of Health Depot',
      depot: 'Central Medical Stores',
      lastUpdated: '3 mins ago'
    },
    {
      id: 'F-301',
      category: 'Food & Water',
      type: 'Water Purification Unit',
      name: 'AquaPurge 5000 High Flow',
      location: 'Uttara Safe Enclave',
      coords: [90.39, 23.86],
      status: 'DEPLOYED',
      capacity: '50,000 L/day',
      capacityNum: 50000,
      assignedTo: 'Shelter Water Initiative',
      fuelOrStockPct: 86,
      condition: 'Good',
      hoursOperated: 140,
      operator: 'UNICEF Disaster Water Response',
      depot: 'Dhaka Regional Store',
      lastUpdated: '7 mins ago'
    },
    {
      id: 'S-401',
      category: 'Temporary Shelters',
      type: 'Shelter Tent Pods',
      name: 'Weather-Proof HexTents (x50)',
      location: 'Cox’s Bazar Depot',
      coords: [91.98, 21.43],
      status: 'AVAILABLE',
      capacity: '600 persons',
      capacityNum: 600,
      assignedTo: '—',
      fuelOrStockPct: 100,
      condition: 'Excellent',
      hoursOperated: 0,
      operator: 'IOM Shelter Cluster',
      depot: 'Cox’s Bazar Southern Depot',
      lastUpdated: '30 mins ago'
    },
    {
      id: 'E-501',
      category: 'Fuel & Energy',
      type: 'Mobile Diesel Generator',
      name: 'Cummins 150kVA Power Pod',
      location: 'Mymensingh Field Center',
      coords: [90.43, 24.72],
      status: 'DEPLOYED',
      capacity: '150 kVA',
      capacityNum: 150,
      assignedTo: 'Water Works Backup',
      fuelOrStockPct: 62,
      condition: 'Good',
      hoursOperated: 180,
      operator: 'Rural Electrification Grid',
      depot: 'Mymensingh Substation',
      lastUpdated: '18 mins ago'
    },
    {
      id: 'C-601',
      category: 'Communication Equipment',
      type: 'Satellite Uplink Pod',
      name: 'Inmarsat BGAN Global Comms',
      location: 'Dhaka Emergency HQ',
      coords: [90.40, 23.81],
      status: 'AVAILABLE',
      capacity: '320 Mbps Mesh',
      capacityNum: 320,
      assignedTo: '—',
      fuelOrStockPct: 98,
      condition: 'Excellent',
      hoursOperated: 40,
      operator: 'JARVIS Satellite Ops',
      depot: 'National Disaster Center',
      lastUpdated: '1 min ago'
    },
    {
      id: 'R-701',
      category: 'Search & Rescue Equipment',
      type: 'Acoustic Sounders & LIDAR',
      name: 'Thermal Drone Recon Squad',
      location: 'Dhaka North',
      coords: [90.41, 23.83],
      status: 'AVAILABLE',
      capacity: '4 UAV units',
      capacityNum: 4,
      assignedTo: '—',
      fuelOrStockPct: 88,
      condition: 'Excellent',
      hoursOperated: 52,
      operator: 'Tech Volunteer Corps',
      depot: 'Mirpur Innovation FOB',
      lastUpdated: '4 mins ago'
    }
  ],
  requests: [
    {
      id: 'REQ-101',
      resourceType: 'Medical Supplies (Cholera Kits)',
      category: 'Medical Supplies',
      quantity: 20,
      requestedBy: 'Sylhet Civil Field Hospital',
      destination: 'Sylhet MC College Relief Camp',
      priority: 'CRITICAL',
      status: 'PENDING',
      requiredBy: 'Today 18:00 UTC',
      reason: 'Surging waterborne illness cases; local triage stockpile under 6 hours capacity.',
      created: '22 mins ago'
    },
    {
      id: 'REQ-102',
      resourceType: 'Rescue Boats (Zodiac Inflatables)',
      category: 'Boats',
      quantity: 4,
      requestedBy: 'Capt. Tariq Rahman (R-01)',
      destination: 'Uttara Riverside Sector 4',
      priority: 'HIGH',
      status: 'APPROVED',
      requiredBy: 'Today 16:30 UTC',
      reason: 'Embankment overflow trapped 1,400 families requiring shallow draft craft.',
      created: '45 mins ago'
    },
    {
      id: 'REQ-103',
      resourceType: 'Heavy Water Pumps (10,000 L/min)',
      category: 'Ground Vehicles',
      quantity: 6,
      requestedBy: 'Dhaka Water Board (WASA)',
      destination: 'Buriganga Sluice Gate 2',
      priority: 'MEDIUM',
      status: 'PENDING',
      requiredBy: 'Tomorrow 08:00 UTC',
      reason: 'Drainage waterback prevention ahead of high tide surge.',
      created: '1 hour ago'
    },
    {
      id: 'REQ-104',
      resourceType: 'High-Calorie Emergency Rations',
      category: 'Food & Water',
      quantity: 50,
      requestedBy: 'Red Crescent Chittagong',
      destination: 'Chittagong Coastal Shelters',
      priority: 'MEDIUM',
      status: 'ALLOCATED',
      requiredBy: 'Tomorrow 12:00 UTC',
      reason: 'Routine replenishment for displaced families in hill-tract shelters.',
      created: '2 hours ago'
    }
  ],
  shipments: [
    {
      id: 'SH-021',
      origin: 'Dhaka Central Depot',
      destination: 'Sylhet Air Base',
      contents: 'IV Saline & Antibiotics (4 tons)',
      quantity: '4 Tons',
      status: 'IN TRANSIT',
      eta: '1h 15m',
      progressPct: 65,
      transportMode: 'Air',
      assignedVehicle: 'Mi-17 Cargo 02',
      path: [
        [90.41, 23.81],
        [90.95, 24.35],
        [91.87, 24.89]
      ]
    },
    {
      id: 'SH-022',
      origin: 'Chittagong Port',
      destination: 'Dhaka Central Depot',
      contents: 'Imported Water Filtration Membranes',
      quantity: '18 Pallets',
      status: 'DELAYED',
      eta: '4h 30m (Highway waterlogged)',
      progressPct: 35,
      transportMode: 'Road',
      assignedVehicle: 'Heavy Freight Convoy Alpha',
      path: [
        [91.83, 22.36],
        [91.15, 23.10],
        [90.55, 23.65],
        [90.41, 23.81]
      ]
    },
    {
      id: 'SH-023',
      origin: 'Cox’s Bazar Depot',
      destination: 'Barisal Naval Pier',
      contents: 'Temporary Shelter HexTents',
      quantity: '200 Units',
      status: 'PREPARING',
      eta: '6h 00m',
      progressPct: 10,
      transportMode: 'Sea',
      assignedVehicle: 'Coastal Barge Sagarika',
      path: [
        [91.98, 21.43],
        [91.10, 21.90],
        [90.35, 22.70]
      ]
    },
    {
      id: 'SH-024',
      origin: 'Rajshahi Depot',
      destination: 'Mymensingh Relief Center',
      contents: 'Geotextile Sandbags & Shovels',
      quantity: '10 Tons',
      status: 'ARRIVED',
      eta: 'Arrived at 13:45 UTC',
      progressPct: 100,
      transportMode: 'Road',
      assignedVehicle: 'Truck Unit 42',
      path: [
        [88.60, 24.37],
        [89.50, 24.55],
        [90.41, 24.75]
      ]
    }
  ],
  facilities: [
    {
      id: 'FAC-01',
      name: 'Dhaka Central Depot',
      type: 'Supply Depot',
      location: 'Tejgaon, Dhaka',
      coords: [90.40, 23.76],
      status: 'OPERATIONAL',
      capacityPct: 78,
      currentStock: '340 tons supplies / 85 vehicles',
      incomingShipments: 4,
      outgoingShipments: 8,
      alerts: 'Operating 24/7 uninterrupted power'
    },
    {
      id: 'FAC-02',
      name: 'Chittagong Port Terminal',
      type: 'Port',
      location: 'Patenga, Chittagong',
      coords: [91.81, 22.25],
      status: 'OPERATIONAL',
      capacityPct: 84,
      currentStock: '1,200 tons maritime cargo',
      incomingShipments: 6,
      outgoingShipments: 3,
      alerts: 'Maritime docking open for shallow draft ships'
    },
    {
      id: 'FAC-03',
      name: 'Sylhet Air Base Hub',
      type: 'Air Base',
      location: 'Osmani Airport Complex',
      coords: [91.87, 24.96],
      status: 'LIMITED CAPACITY',
      capacityPct: 94,
      currentStock: '45 tons emergency medical / 6 helis',
      incomingShipments: 3,
      outgoingShipments: 5,
      alerts: 'Apron space restricted due to taxiway water accumulation'
    },
    {
      id: 'FAC-04',
      name: 'Cox’s Bazar Logistics Base',
      type: 'Supply Depot',
      location: 'Southern Highway Corridor',
      coords: [91.98, 21.43],
      status: 'OPERATIONAL',
      capacityPct: 62,
      currentStock: '180 tons rations / 200 shelter pods',
      incomingShipments: 1,
      outgoingShipments: 2,
      alerts: 'Nominal operational status'
    },
    {
      id: 'FAC-05',
      name: 'Barisal Marine Station',
      type: 'Port',
      location: 'Kirtankhola River Pier',
      coords: [90.35, 22.70],
      status: 'OPERATIONAL',
      capacityPct: 70,
      currentStock: '32 patrol boats / 4 barges',
      incomingShipments: 2,
      outgoingShipments: 2
    }
  ],
  personnel: [
    {
      id: 'PER-01',
      name: 'Dr. Farhana Ahmed',
      role: 'Chief Medical Officer',
      specialization: 'Medical',
      location: 'Sylhet Field Hospital',
      status: 'DEPLOYED',
      assignment: 'Field Triage Directives',
      contact: '+880-171-554433'
    },
    {
      id: 'PER-02',
      name: 'Capt. Tariq Rahman',
      role: 'Water Rescue Commander',
      specialization: 'Rescue',
      location: 'Dhaka North Riverfront',
      status: 'DEPLOYED',
      assignment: 'Team R-01 Boat Ops',
      contact: '+880-181-223344'
    },
    {
      id: 'PER-03',
      name: 'Eng. Farhana Shireen',
      role: 'Senior Civil Engineer',
      specialization: 'Engineering',
      location: 'Padma Embankment',
      status: 'DEPLOYED',
      assignment: 'Dyke Structural Inspection',
      contact: '+880-191-887766'
    },
    {
      id: 'PER-04',
      name: 'Lieut. Hasan Ali',
      role: 'Logistics Fleet Officer',
      specialization: 'Logistics',
      location: 'Chittagong Depot',
      status: 'AVAILABLE',
      assignment: 'Convoy Coordination',
      contact: '+880-161-990011'
    },
    {
      id: 'PER-05',
      name: 'Flight Lt. S. Kabir',
      role: 'UAV Recon Specialist',
      specialization: 'Communications',
      location: 'Dhaka Emergency HQ',
      status: 'AVAILABLE',
      assignment: 'Mesh Comms Monitoring',
      contact: '+880-171-112299'
    }
  ],
  operations: [
    {
      id: 'ROP-01',
      time: '14:30',
      title: 'Helicopter H-001 → Sylhet',
      location: 'Sylhet Air Base',
      resourceId: 'H-001',
      resourceName: 'Airbus H145',
      type: 'DEPLOYMENT',
      targetETA: '14:30 UTC',
      status: 'SCHEDULED',
      coords: [91.87, 24.89]
    },
    {
      id: 'ROP-02',
      time: '15:00',
      title: 'Medical Supplies → Dhaka',
      location: 'Dhaka Central Depot',
      resourceId: 'M-202',
      resourceName: 'IV & Cholera Stockpile',
      type: 'DELIVERY',
      targetETA: '15:00 UTC',
      status: 'SCHEDULED',
      coords: [90.41, 23.75]
    },
    {
      id: 'ROP-03',
      time: '16:30',
      title: 'Rescue Boat B-003 → Barisal',
      location: 'Barisal Naval Pier',
      resourceId: 'B-003',
      resourceName: 'Catamaran Shuttle',
      type: 'DEPLOYMENT',
      targetETA: '16:30 UTC',
      status: 'SCHEDULED',
      coords: [90.35, 22.70]
    },
    {
      id: 'ROP-04',
      time: '18:00',
      title: 'Food Supplies → Chittagong',
      location: 'Chittagong Coastal Base',
      resourceId: 'V-101',
      resourceName: 'Freight Carrier Convoy',
      type: 'DELIVERY',
      targetETA: '18:00 UTC',
      status: 'SCHEDULED',
      coords: [91.83, 22.36]
    },
    {
      id: 'ROP-05',
      time: '20:00',
      title: 'Temporary Shelters → Mymensingh',
      location: 'Mymensingh Field Center',
      resourceId: 'S-401',
      resourceName: 'Weather-Proof HexTents',
      type: 'DELIVERY',
      targetETA: '20:00 UTC',
      status: 'SCHEDULED',
      coords: [90.41, 24.75]
    }
  ]
};

// Cyclone Marex Resource Package
export const cycloneResourceData: HazardResourcePackage = {
  ...floodResourceData,
  hazardId: 'inc-002',
  hazardName: 'Cyclone Marex',
  locationName: 'Bay of Bengal Coast & Odisha',
  center: [86.9, 19.8],
  metrics: {
    totalAssets: 480,
    available: 345,
    deployed: 105,
    inMaintenance: 30,
    requested: 28,
    readinessRate: 89,
    utilizationRate: 81
  },
  categoryCounts: {
    'All Resources': 480,
    'Helicopters': 32,
    'Boats': 64,
    'Ground Vehicles': 95,
    'Medical Supplies': 70,
    'Food & Water': 90,
    'Temporary Shelters': 60,
    'Fuel & Energy': 40,
    'Communication Equipment': 18,
    'Search & Rescue Equipment': 11
  }
};

// Wildfire Resource Package
export const wildfireResourceData: HazardResourcePackage = {
  ...floodResourceData,
  hazardId: 'inc-003',
  hazardName: 'Wildfire Outbreak',
  locationName: 'Northern Alberta / Boreal Belt',
  center: [-111.38, 56.72],
  metrics: {
    totalAssets: 390,
    available: 280,
    deployed: 82,
    inMaintenance: 28,
    requested: 19,
    readinessRate: 91,
    utilizationRate: 74
  },
  categoryCounts: {
    'All Resources': 390,
    'Helicopters': 28,
    'Boats': 8,
    'Ground Vehicles': 140,
    'Medical Supplies': 50,
    'Food & Water': 65,
    'Temporary Shelters': 40,
    'Fuel & Energy': 35,
    'Communication Equipment': 14,
    'Search & Rescue Equipment': 10
  }
};

// Master database mapping
export const resourceDatabase: Record<string, HazardResourcePackage> = {
  flood: floodResourceData,
  cyclone: cycloneResourceData,
  wildfire: wildfireResourceData,
  earthquake: {
    ...floodResourceData,
    hazardId: 'inc-004',
    hazardName: 'Magnitude 7.8 Rupture',
    locationName: 'Kahramanmaraş Urban Sector'
  },
  multi_hazard: {
    ...floodResourceData,
    hazardId: 'inc-005',
    hazardName: 'Multi-Hazard Convergence',
    locationName: 'Coastal & Delta Confluence'
  }
};
