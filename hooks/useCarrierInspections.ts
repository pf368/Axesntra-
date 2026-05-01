'use client';

import { useMemo } from 'react';
import { CARRIER_RICH_INSPECTIONS } from '@/lib/mock-inspections-rich';
import type { RichInspection } from '@/lib/types';

export interface InspectionKPIs {
  highRisk: number;    // severityScore >= 7
  oos: number;         // driverOOS || vehicleOOS
  needsReview: number; // status === 'New'
  repeat: number;      // aiInsights includes a repeat-violation type
  clean: number;       // severityScore <= 3
}

export interface CarrierInspectionsData {
  rows: RichInspection[];
  totalCount: number;
  kpis: InspectionKPIs;
  last30DaysCount: number;
  levelICount: number;
  violationsCount: number;
}

/** Single source of truth for all inspection-derived counts.
 *  Every badge, tile, and table footer must read from this hook. */
export function useCarrierInspections(carrierId: string): CarrierInspectionsData {
  return useMemo(() => {
    const rows = CARRIER_RICH_INSPECTIONS[carrierId] ?? [];

    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const last30DaysCount = rows.filter(r => new Date(r.date) >= thirtyDaysAgo).length;
    const levelICount = rows.filter(r => r.level === 'I').length;
    const violationsCount = rows.reduce((sum, r) => sum + r.violations.length, 0);

    const kpis: InspectionKPIs = {
      highRisk:    rows.filter(r => r.severityScore >= 7).length,
      oos:         rows.filter(r => r.driverOOS || r.vehicleOOS).length,
      needsReview: rows.filter(r => r.status === 'New').length,
      repeat:      rows.filter(r => r.aiInsights.some(a => a.type === 'repeat-violation')).length,
      clean:       rows.filter(r => r.severityScore <= 3).length,
    };

    return { rows, totalCount: rows.length, kpis, last30DaysCount, levelICount, violationsCount };
  }, [carrierId]);
}
