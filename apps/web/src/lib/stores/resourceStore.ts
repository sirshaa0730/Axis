import { writable, derived, get } from 'svelte/store';
import type {
  ResourceCategory,
  ResourceStatus,
  ResourcesMode,
  ResourceItem,
  ResourceRequest,
  ShipmentItem,
  FacilityItem,
  PersonnelItem,
  ResourceOperationItem,
  ResourceMetrics,
  ResourceActivityEntry
} from '../types/resources';
import { resourceDatabase, floodResourceData } from '../mock/resources/resourceDatabase';

// Mode Navigation Tab
export const activeResourcesMode = writable<ResourcesMode>('overview');

// Category Selection (Left Panel)
export const selectedResourceCategory = writable<ResourceCategory>('All Resources');

// Map Layer Filters
export const activeResourceMapLayer = writable<
  'ALL RESOURCES' | 'HELICOPTERS' | 'BOATS' | 'VEHICLES' | 'SUPPLIES' | 'FACILITIES'
>('ALL RESOURCES');

// Active Hazard Theatre
export const activeResourceHazard = writable<string>('flood');
export const currentResourcePackage = writable(floodResourceData);

// Active Selections
export const selectedResourceId = writable<string | null>('H-001');
export const selectedFacilityId = writable<string | null>(null);
export const selectedShipmentId = writable<string | null>(null);

// Inventory Search & Filters
export const inventorySearchQuery = writable<string>('');
export const inventoryTypeFilter = writable<string>('All Types');
export const inventoryStatusFilter = writable<string>('All Status');
export const inventoryLocationFilter = writable<string>('All Locations');

// Map Camera & Focus State
export const resourceMapFocus = writable<{
  center: [number, number];
  zoom: number;
  highlightId?: string;
}>({
  center: [90.4125, 23.8103],
  zoom: 1.0
});

// Modal State
export const isDeployModalOpen = writable<boolean>(false);
export const isRequestModalOpen = writable<boolean>(false);
export const isAllocateModalOpen = writable<boolean>(false);
export const isTrackShipmentModalOpen = writable<boolean>(false);
export const isResourceReportModalOpen = writable<boolean>(false);
export const isOptimizeModalOpen = writable<boolean>(false);
export const isDetailModalOpen = writable<boolean>(false);

// Active Entity Data Stores
export const resourceMetrics = writable<ResourceMetrics>(floodResourceData.metrics);
export const resourceCategoryCounts = writable<Record<ResourceCategory, number>>(
  floodResourceData.categoryCounts
);
export const allResources = writable<ResourceItem[]>(floodResourceData.resources);
export const resourceRequests = writable<ResourceRequest[]>(floodResourceData.requests);
export const activeShipments = writable<ShipmentItem[]>(floodResourceData.shipments);
export const allFacilities = writable<FacilityItem[]>(floodResourceData.facilities);
export const emergencyPersonnel = writable<PersonnelItem[]>(floodResourceData.personnel);
export const upcomingResourceOperations = writable<ResourceOperationItem[]>(
  floodResourceData.operations
);

// Derived Selected Resource
export const selectedResource = derived(
  [allResources, selectedResourceId],
  ([$resources, $id]) => {
    if (!$id) return null;
    return $resources.find((r) => r.id === $id) || null;
  }
);

// Audit Activity Log
export const resourceAuditLog = writable<ResourceActivityEntry[]>([
  {
    id: 'log-01',
    timestamp: '14:22 UTC',
    action: 'Shelter capacity updated',
    target: 'Mirpur National Stadium',
    operator: 'JARVIS-LOGISTICS',
    severity: 'info'
  },
  {
    id: 'log-02',
    timestamp: '14:14 UTC',
    action: 'Shipment SH-021 departed',
    target: 'Sylhet Air Base Hub',
    operator: 'Logistics Command',
    severity: 'info'
  },
  {
    id: 'log-03',
    timestamp: '14:07 UTC',
    action: 'Medical supplies allocated',
    target: 'Dhaka Central Depot',
    operator: 'Dr. Farhana',
    severity: 'success'
  },
  {
    id: 'log-04',
    timestamp: '14:02 UTC',
    action: 'H-001 prepped for sortie',
    target: 'Tejgaon Hangar 3',
    operator: 'Commander Tariq',
    severity: 'info'
  }
]);

// Switch Hazard Context
export function setResourceHazard(hazard: string) {
  const norm = hazard.toLowerCase();
  const pkg = resourceDatabase[norm] || resourceDatabase['flood'];
  activeResourceHazard.set(norm);
  currentResourcePackage.set(pkg);

  resourceMetrics.set({ ...pkg.metrics });
  resourceCategoryCounts.set({ ...pkg.categoryCounts });
  allResources.set([...pkg.resources]);
  resourceRequests.set([...pkg.requests]);
  activeShipments.set([...pkg.shipments]);
  allFacilities.set([...pkg.facilities]);
  emergencyPersonnel.set([...pkg.personnel]);
  upcomingResourceOperations.set([...pkg.operations]);

  if (pkg.resources.length > 0) {
    selectedResourceId.set(pkg.resources[0].id);
  }

  resourceMapFocus.set({
    center: pkg.center,
    zoom: 1.0
  });

  addResourceAudit(`Switched resource command to ${pkg.hazardName} (${pkg.locationName})`, 'info');
}

// Select Category
export function setCategory(category: ResourceCategory) {
  selectedResourceCategory.set(category);
}

// Select Resource & Sync Map
export function selectResource(resourceId: string) {
  selectedResourceId.set(resourceId);
  const items = get(allResources);
  const found = items.find((r) => r.id === resourceId);
  if (found) {
    resourceMapFocus.set({
      center: found.coords,
      zoom: 1.35,
      highlightId: resourceId
    });
  }
}

// Deploy Resource Action
export function deployResource(
  resourceId: string,
  destination: string,
  operation: string,
  priority: string = 'HIGH'
) {
  let deployedItemName = '';
  allResources.update((items) =>
    items.map((r) => {
      if (r.id === resourceId) {
        deployedItemName = r.name;
        return {
          ...r,
          status: 'EN ROUTE',
          location: destination,
          assignedTo: operation,
          lastUpdated: 'Just now'
        };
      }
      return r;
    })
  );

  // Recalculate Metrics dynamically
  resourceMetrics.update((m) => {
    const nextAvailable = Math.max(0, m.available - 1);
    const nextDeployed = m.deployed + 1;
    const readiness = Math.round((nextAvailable / m.totalAssets) * 100);
    const utilization = Math.round((nextDeployed / m.totalAssets) * 100) + 15;
    return {
      ...m,
      available: nextAvailable,
      deployed: nextDeployed,
      readinessRate: readiness,
      utilizationRate: Math.min(100, utilization)
    };
  });

  addResourceAudit(
    `Deployed ${resourceId} (${deployedItemName}) to ${destination} for ${operation}`,
    'success'
  );
  isDeployModalOpen.set(false);
}

// Submit Inbound Resource Request
export function submitResourceRequest(data: {
  resourceType: string;
  category: ResourceCategory;
  quantity: number;
  requestedBy: string;
  destination: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  requiredBy: string;
  reason: string;
}) {
  const newReq: ResourceRequest = {
    id: `REQ-${Math.floor(100 + Math.random() * 900)}`,
    resourceType: data.resourceType,
    category: data.category,
    quantity: data.quantity,
    requestedBy: data.requestedBy,
    destination: data.destination,
    priority: data.priority,
    status: 'PENDING',
    requiredBy: data.requiredBy,
    reason: data.reason,
    created: 'Just now'
  };

  resourceRequests.update((reqs) => [newReq, ...reqs]);
  resourceMetrics.update((m) => ({
    ...m,
    requested: m.requested + 1
  }));

  addResourceAudit(
    `Submitted request ${newReq.id} for ${data.quantity}x ${data.resourceType} at ${data.destination}`,
    'info'
  );
  isRequestModalOpen.set(false);
}

// Approve Resource Request
export function approveResourceRequest(requestId: string) {
  resourceRequests.update((reqs) =>
    reqs.map((r) => (r.id === requestId ? { ...r, status: 'APPROVED' } : r))
  );
  addResourceAudit(`Approved request ${requestId}`, 'success');
}

// Reject Resource Request with Reason
export function rejectResourceRequest(requestId: string, reason: string) {
  resourceRequests.update((reqs) =>
    reqs.map((r) =>
      r.id === requestId ? { ...r, status: 'REJECTED', rejectionReason: reason } : r
    )
  );
  resourceMetrics.update((m) => ({
    ...m,
    requested: Math.max(0, m.requested - 1)
  }));
  addResourceAudit(`Rejected request ${requestId}: ${reason}`, 'warning');
}

// Allocate to Request
export function allocateToRequest(requestId: string) {
  resourceRequests.update((reqs) =>
    reqs.map((r) => (r.id === requestId ? { ...r, status: 'ALLOCATED' } : r))
  );
  resourceMetrics.update((m) => ({
    ...m,
    requested: Math.max(0, m.requested - 1),
    deployed: m.deployed + 1,
    available: Math.max(0, m.available - 1)
  }));
  addResourceAudit(`Allocated resources to satisfy request ${requestId}`, 'success');
}

// Allocate Resources Directly
export function directAllocateResource(data: {
  resourceId: string;
  quantity: number;
  destination: string;
  operation: string;
}) {
  deployResource(data.resourceId, data.destination, data.operation, 'HIGH');
  isAllocateModalOpen.set(false);
}

// Track Shipment on Map
export function trackShipment(shipmentId: string) {
  selectedShipmentId.set(shipmentId);
  const list = get(activeShipments);
  const found = list.find((s) => s.id === shipmentId);
  if (found && found.path.length > 0) {
    resourceMapFocus.set({
      center: found.path[Math.floor(found.path.length / 2)],
      zoom: 1.25,
      highlightId: shipmentId
    });
  }
}

// Focus Upcoming Operation
export function focusOperation(op: ResourceOperationItem) {
  resourceMapFocus.set({
    center: op.coords,
    zoom: 1.35,
    highlightId: op.id
  });
  selectResource(op.resourceId);
}

// Apply Optimization Recommendation
export function applyOptimizationRecommendation(item: {
  resourceId: string;
  destination: string;
  operation: string;
}) {
  deployResource(item.resourceId, item.destination, item.operation, 'HIGH');
  addResourceAudit(
    `Applied AI optimization recommendation for ${item.resourceId} to ${item.destination}`,
    'success'
  );
}

// Helper to record audit events
function addResourceAudit(action: string, severity: 'info' | 'success' | 'warning' | 'critical' = 'info') {
  const now = new Date();
  const timeStr = `${now.getUTCHours().toString().padStart(2, '0')}:${now.getUTCMinutes().toString().padStart(2, '0')} UTC`;
  resourceAuditLog.update((logs) => [
    {
      id: `log-${Date.now()}`,
      timestamp: timeStr,
      action,
      target: 'Resource Logistics Center',
      operator: 'COMMANDER',
      severity
    },
    ...logs.slice(0, 19)
  ]);
}
