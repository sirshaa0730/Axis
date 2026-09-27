/**
 * AXIS Incidents API Service
 * 
 * Fetches real incidents from backend when online, falls back to canonical mock dataset.
 */

import { apiFetch } from './client';
import type { HazardIncident } from '../types';
import { MOCK_INCIDENTS } from '../mock/incidents';

export async function fetchIncidents(): Promise<HazardIncident[]> {
  return apiFetch<HazardIncident[]>('/api/incidents', MOCK_INCIDENTS);
}

export async function fetchIncidentById(id: string): Promise<HazardIncident | null> {
  return apiFetch<HazardIncident | null>(
    `/api/incidents/${id}`,
    () => MOCK_INCIDENTS.find((inc) => inc.id === id) || null
  );
}
