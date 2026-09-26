import { writable, derived } from 'svelte/store';
import { MOCK_INCIDENTS } from '../mock/incidents';
import type { HazardIncident, HazardType } from '../types';

export const incidents = writable<HazardIncident[]>(MOCK_INCIDENTS);
export const selectedIncidentId = writable<string | null>(null); // None selected initially for full planet view
export const activeHazardFilter = writable<HazardType | 'all'>('all');
export const globeFocusTarget = writable<{ lat: number; lng: number; zoom: number; duration?: number } | null>(null);

export const selectedIncident = derived(
  [incidents, selectedIncidentId],
  ([$incidents, $selectedId]) => {
    if (!$selectedId) return null;
    return $incidents.find((inc) => inc.id === $selectedId) || null;
  }
);

export function selectIncident(incident: HazardIncident) {
  selectedIncidentId.set(incident.id);
  globeFocusTarget.set({
    lat: incident.coords.lat,
    lng: incident.coords.lng,
    zoom: 1.3, // Framing that still displays whole spherical curvature
    duration: 1.2
  });
}

export function clearIncidentSelection() {
  selectedIncidentId.set(null);
  globeFocusTarget.set({
    lat: 20,
    lng: 60,
    zoom: 1.0, // Return to full planetary framing
    duration: 1.2
  });
}