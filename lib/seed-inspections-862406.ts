/**
 * Seed inspection data for Johnsonville (USDOT 862406).
 * Captured from FMCSA SAFER system, April 2026.
 * Used as fallback when SMS scraper returns 403.
 */
import { InspectionWithViolations } from './types';

export const SEED_INSPECTIONS_862406: InspectionWithViolations[] = [
  {
    reportNumber: 'MOW031006253',
    inspectionDate: '2/25/2026',
    state: 'MO',
    violationCount: 1,
    totalSeverityWeight: 10,
    oos: true,
    violations: [
      {
        code: '393.75A3-TAOL',
        description: 'Tires - All others, leaking/inflation less than 50% of max on sidewall',
        severityWeight: 10,
        timeWeight: 3,
        oos: true,
        basicCategory: 'Vehicle Maintenance',
      },
    ],
  },
  {
    reportNumber: 'WI2371006924',
    inspectionDate: '1/8/2026',
    state: 'WI',
    violationCount: 1,
    totalSeverityWeight: 10,
    oos: true,
    violations: [
      {
        code: '393.75A3-TAOL',
        description: 'Tires - All others, leaking/inflation less than 50% of max on sidewall',
        severityWeight: 10,
        timeWeight: 3,
        oos: true,
        basicCategory: 'Vehicle Maintenance',
      },
    ],
  },
  {
    reportNumber: 'MOW215001326',
    inspectionDate: '11/13/2025',
    state: 'MO',
    violationCount: 1,
    totalSeverityWeight: 4,
    oos: false,
    violations: [
      {
        code: '393.45B2-B-AIR',
        description: 'Air brake - Loss of air pressure / Air brake tubing and hose connections',
        severityWeight: 4,
        timeWeight: 3,
        oos: false,
        basicCategory: 'Vehicle Maintenance',
      },
    ],
  },
  {
    reportNumber: 'WI2722002554',
    inspectionDate: '10/9/2025',
    state: 'WI',
    violationCount: 1,
    totalSeverityWeight: 4,
    oos: false,
    violations: [
      {
        code: '393.55D2-B',
        description: 'ABS malfunction indicator - Trailer manufactured after 3/1/2001',
        severityWeight: 4,
        timeWeight: 3,
        oos: false,
        basicCategory: 'Vehicle Maintenance',
      },
    ],
  },
  {
    reportNumber: 'NDTR57007102',
    inspectionDate: '5/29/2025',
    state: 'ND',
    violationCount: 1,
    totalSeverityWeight: 4,
    oos: false,
    violations: [
      {
        code: '396.3A1-OAL',
        description: 'Air leak - not related to brake system or suspension',
        severityWeight: 4,
        timeWeight: 2,
        oos: false,
        basicCategory: 'Vehicle Maintenance',
      },
    ],
  },
  {
    reportNumber: 'IN1008900160',
    inspectionDate: '11/27/2024',
    state: 'IN',
    violationCount: 1,
    totalSeverityWeight: 3,
    oos: false,
    violations: [
      {
        code: '393.11B-CSURR',
        description: 'Conspicuity systems - Rear conspicuity not meeting requirements',
        severityWeight: 3,
        timeWeight: 1,
        oos: false,
        basicCategory: 'Vehicle Maintenance',
      },
    ],
  },
  {
    reportNumber: 'MD1848999747',
    inspectionDate: '4/30/2024',
    state: 'MD',
    violationCount: 1,
    totalSeverityWeight: 4,
    oos: false,
    violations: [
      {
        code: '393.45(b)(2)',
        description: 'Brake hose or tubing chafing and/or kinking',
        severityWeight: 4,
        timeWeight: 1,
        oos: false,
        basicCategory: 'Vehicle Maintenance',
      },
    ],
  },
  {
    reportNumber: 'TNI01R400190',
    inspectionDate: '2/27/2024',
    state: 'TN',
    violationCount: 1,
    totalSeverityWeight: 8,
    oos: true,
    violations: [
      {
        code: '393.9-LMFSD',
        description: 'Lamps - Inoperative stop lamp(s) on front of semitrailer/full trailer',
        severityWeight: 8,
        timeWeight: 1,
        oos: true,
        basicCategory: 'Vehicle Maintenance',
      },
    ],
  },
];
