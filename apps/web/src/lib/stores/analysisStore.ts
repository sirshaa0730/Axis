import { writable, derived } from 'svelte/store';
import type { HazardSelectorType, AnalysisMode, IncidentAnalysisData } from '../types';
import { selectedIncident } from './incidentStore';
import { getAnalysisData } from '../mock/analysis';

export const activeHazardType = writable<HazardSelectorType>('flood');
export const activeAnalysisMode = writable<AnalysisMode>('current');
export const isRiskDriversOpen = writable<boolean>(false);
export const isAnalyzing = writable<boolean>(false);
export const analysisStage = writable<string>('VERIFYING RESULT');

export const ANALYSIS_STAGES = [
  'UNDERSTANDING INCIDENT',
  'LOADING GEOSPATIAL DATA',
  'ANALYSING EXPOSURE',
  'MODELLING IMPACT',
  'CALCULATING RISK',
  'VERIFYING RESULT'
];

export const activeAnalysisData = derived(
  [selectedIncident, activeHazardType, activeAnalysisMode],
  ([$inc, $hazard, $mode]): IncidentAnalysisData => {
    const incId = $inc?.id || 'inc-01';
    return getAnalysisData(incId, $hazard, $mode);
  }
);

export async function runAnalysisPipeline(customStageCallback?: (stage: string) => void) {
  isAnalyzing.set(true);
  for (let i = 0; i < ANALYSIS_STAGES.length; i++) {
    const stage = ANALYSIS_STAGES[i];
    analysisStage.set(stage);
    if (customStageCallback) customStageCallback(stage);
    await new Promise((r) => setTimeout(r, 450));
  }
  isAnalyzing.set(false);
}

export function openRiskDrivers() {
  isRiskDriversOpen.set(true);
}

export function closeRiskDrivers() {
  isRiskDriversOpen.set(false);
}

export function toggleRiskDrivers() {
  isRiskDriversOpen.update((v) => !v);
}
