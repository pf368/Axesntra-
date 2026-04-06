/**
 * Mock inspection data for the 5 demonstration carriers.
 * Each carrier has realistic inspection records with violations that map to
 * the 3 static scenarios: 391.11(b)(4), 395.8(e)(1), 396.3(a)(1).
 * Violation frequency/severity matches each carrier's risk profile.
 */
import { InspectionWithViolations } from './types';

// ── ACME Transport LLC (USDOT 491180) — Elevated risk, worsening ──
const acmeInspections: InspectionWithViolations[] = [
  {
    reportNumber: 'OHI041200456',
    inspectionDate: '3/12/2025',
    state: 'OH',
    violationCount: 2,
    totalSeverityWeight: 14,
    oos: true,
    violations: [
      {
        code: '396.3(a)(1)',
        description: 'Brakes out of adjustment — pushrod travel exceeds maximum limit',
        severityWeight: 8,
        timeWeight: 3,
        oos: true,
        basicCategory: 'Vehicle Maintenance',
      },
      {
        code: '391.11(b)(4)',
        description: 'Medical certificate — operating a CDL vehicle while self-certified as excepted with SDLA',
        severityWeight: 6,
        timeWeight: 3,
        oos: true,
        basicCategory: 'Driver Qualification',
      },
    ],
  },
  {
    reportNumber: 'IND082200891',
    inspectionDate: '1/22/2025',
    state: 'IN',
    violationCount: 1,
    totalSeverityWeight: 8,
    oos: true,
    violations: [
      {
        code: '396.3(a)(1)',
        description: 'Brakes out of adjustment — automatic slack adjuster not functioning properly',
        severityWeight: 8,
        timeWeight: 3,
        oos: true,
        basicCategory: 'Vehicle Maintenance',
      },
    ],
  },
  {
    reportNumber: 'PAE071100234',
    inspectionDate: '11/5/2024',
    state: 'PA',
    violationCount: 1,
    totalSeverityWeight: 7,
    oos: true,
    violations: [
      {
        code: '395.8(e)(1)',
        description: 'False record of duty status — ELD log does not accurately reflect driver hours',
        severityWeight: 7,
        timeWeight: 2,
        oos: true,
        basicCategory: 'HOS Compliance',
      },
    ],
  },
  {
    reportNumber: 'KYW093100567',
    inspectionDate: '9/8/2024',
    state: 'KY',
    violationCount: 1,
    totalSeverityWeight: 8,
    oos: true,
    violations: [
      {
        code: '396.3(a)(1)',
        description: 'Brakes out of adjustment — brake lining thickness below minimum',
        severityWeight: 8,
        timeWeight: 2,
        oos: true,
        basicCategory: 'Vehicle Maintenance',
      },
    ],
  },
  {
    reportNumber: 'OHI061800912',
    inspectionDate: '6/18/2024',
    state: 'OH',
    violationCount: 1,
    totalSeverityWeight: 7,
    oos: true,
    violations: [
      {
        code: '395.8(e)(1)',
        description: 'False record of duty status — unaccounted driving time on ELD',
        severityWeight: 7,
        timeWeight: 1,
        oos: true,
        basicCategory: 'HOS Compliance',
      },
    ],
  },
  {
    reportNumber: 'WVE042500345',
    inspectionDate: '4/25/2024',
    state: 'WV',
    violationCount: 1,
    totalSeverityWeight: 6,
    oos: true,
    violations: [
      {
        code: '391.11(b)(4)',
        description: 'Medical certificate — driver self-certification category does not match operation type',
        severityWeight: 6,
        timeWeight: 1,
        oos: true,
        basicCategory: 'Driver Qualification',
      },
    ],
  },
];

// ── Midwest Logistics Partners (USDOT 847291) — Low risk, improving ──
const midwestInspections: InspectionWithViolations[] = [
  {
    reportNumber: 'ILI021400123',
    inspectionDate: '2/14/2025',
    state: 'IL',
    violationCount: 1,
    totalSeverityWeight: 4,
    oos: false,
    violations: [
      {
        code: '396.3(a)(1)',
        description: 'Brakes out of adjustment — minor pushrod travel exceedance on trailer axle',
        severityWeight: 4,
        timeWeight: 3,
        oos: false,
        basicCategory: 'Vehicle Maintenance',
      },
    ],
  },
  {
    reportNumber: 'MOS100800456',
    inspectionDate: '10/8/2024',
    state: 'MO',
    violationCount: 1,
    totalSeverityWeight: 3,
    oos: false,
    violations: [
      {
        code: '395.8(e)(1)',
        description: 'Record of duty status — minor discrepancy in on-duty time recording',
        severityWeight: 3,
        timeWeight: 1,
        oos: false,
        basicCategory: 'HOS Compliance',
      },
    ],
  },
];

// ── Delta Freight Services Inc (USDOT 562843) — Moderate risk, stable ──
const deltaInspections: InspectionWithViolations[] = [
  {
    reportNumber: 'GAE030200789',
    inspectionDate: '3/2/2025',
    state: 'GA',
    violationCount: 1,
    totalSeverityWeight: 8,
    oos: true,
    violations: [
      {
        code: '396.3(a)(1)',
        description: 'Brakes out of adjustment — pushrod travel exceeds maximum on steer axle',
        severityWeight: 8,
        timeWeight: 3,
        oos: true,
        basicCategory: 'Vehicle Maintenance',
      },
    ],
  },
  {
    reportNumber: 'SCW121500234',
    inspectionDate: '12/15/2024',
    state: 'SC',
    violationCount: 1,
    totalSeverityWeight: 6,
    oos: true,
    violations: [
      {
        code: '391.11(b)(4)',
        description: 'Medical certificate — operating a CDL vehicle while self-certified as excepted with SDLA',
        severityWeight: 6,
        timeWeight: 2,
        oos: true,
        basicCategory: 'Driver Qualification',
      },
    ],
  },
  {
    reportNumber: 'NCE091000567',
    inspectionDate: '9/10/2024',
    state: 'NC',
    violationCount: 1,
    totalSeverityWeight: 7,
    oos: true,
    violations: [
      {
        code: '395.8(e)(1)',
        description: 'False record of duty status — driver exceeded 11-hour driving limit per ELD data',
        severityWeight: 7,
        timeWeight: 2,
        oos: true,
        basicCategory: 'HOS Compliance',
      },
    ],
  },
  {
    reportNumber: 'GAW060500891',
    inspectionDate: '6/5/2024',
    state: 'GA',
    violationCount: 1,
    totalSeverityWeight: 4,
    oos: false,
    violations: [
      {
        code: '396.3(a)(1)',
        description: 'Brakes out of adjustment — automatic slack adjuster not maintaining proper clearance',
        severityWeight: 4,
        timeWeight: 1,
        oos: false,
        basicCategory: 'Vehicle Maintenance',
      },
    ],
  },
];

// ── HazTech Specialized Carriers (USDOT 934521) — Elevated risk, stable ──
const haztechInspections: InspectionWithViolations[] = [
  {
    reportNumber: 'TXI022800345',
    inspectionDate: '2/28/2025',
    state: 'TX',
    violationCount: 2,
    totalSeverityWeight: 15,
    oos: true,
    violations: [
      {
        code: '396.3(a)(1)',
        description: 'Brakes out of adjustment — service brake chamber inoperative',
        severityWeight: 8,
        timeWeight: 3,
        oos: true,
        basicCategory: 'Vehicle Maintenance',
      },
      {
        code: '395.8(e)(1)',
        description: 'False record of duty status — ELD shows unaccounted on-duty time',
        severityWeight: 7,
        timeWeight: 3,
        oos: true,
        basicCategory: 'HOS Compliance',
      },
    ],
  },
  {
    reportNumber: 'LAW110700678',
    inspectionDate: '11/7/2024',
    state: 'LA',
    violationCount: 1,
    totalSeverityWeight: 6,
    oos: true,
    violations: [
      {
        code: '391.11(b)(4)',
        description: 'Medical certificate — driver self-certification category does not match hazmat operation type',
        severityWeight: 6,
        timeWeight: 2,
        oos: true,
        basicCategory: 'Driver Qualification',
      },
    ],
  },
  {
    reportNumber: 'OKE081200912',
    inspectionDate: '8/12/2024',
    state: 'OK',
    violationCount: 1,
    totalSeverityWeight: 8,
    oos: true,
    violations: [
      {
        code: '396.3(a)(1)',
        description: 'Brakes out of adjustment — brake drum cracked through',
        severityWeight: 8,
        timeWeight: 2,
        oos: true,
        basicCategory: 'Vehicle Maintenance',
      },
    ],
  },
  {
    reportNumber: 'TXW050300456',
    inspectionDate: '5/3/2024',
    state: 'TX',
    violationCount: 1,
    totalSeverityWeight: 7,
    oos: true,
    violations: [
      {
        code: '395.8(e)(1)',
        description: 'False record of duty status — ELD log edited to remove off-duty driving event',
        severityWeight: 7,
        timeWeight: 1,
        oos: true,
        basicCategory: 'HOS Compliance',
      },
    ],
  },
];

// ── Northeast Express Trucking (USDOT 715394) — Severe risk, worsening ──
const northeastInspections: InspectionWithViolations[] = [
  {
    reportNumber: 'NYI031500123',
    inspectionDate: '3/15/2025',
    state: 'NY',
    violationCount: 2,
    totalSeverityWeight: 15,
    oos: true,
    violations: [
      {
        code: '396.3(a)(1)',
        description: 'Brakes out of adjustment — multiple brake chambers inoperative on drive axle',
        severityWeight: 8,
        timeWeight: 3,
        oos: true,
        basicCategory: 'Vehicle Maintenance',
      },
      {
        code: '391.11(b)(4)',
        description: 'Medical certificate — operating a CDL vehicle while self-certified as excepted with SDLA',
        severityWeight: 7,
        timeWeight: 3,
        oos: true,
        basicCategory: 'Driver Qualification',
      },
    ],
  },
  {
    reportNumber: 'NJW020800456',
    inspectionDate: '2/8/2025',
    state: 'NJ',
    violationCount: 1,
    totalSeverityWeight: 8,
    oos: true,
    violations: [
      {
        code: '396.3(a)(1)',
        description: 'Brakes out of adjustment — brake lining contaminated by grease/oil',
        severityWeight: 8,
        timeWeight: 3,
        oos: true,
        basicCategory: 'Vehicle Maintenance',
      },
    ],
  },
  {
    reportNumber: 'CTE121900789',
    inspectionDate: '12/19/2024',
    state: 'CT',
    violationCount: 1,
    totalSeverityWeight: 7,
    oos: true,
    violations: [
      {
        code: '395.8(e)(1)',
        description: 'False record of duty status — driver exceeded 14-hour on-duty limit per ELD data',
        severityWeight: 7,
        timeWeight: 2,
        oos: true,
        basicCategory: 'HOS Compliance',
      },
    ],
  },
  {
    reportNumber: 'MAE100500234',
    inspectionDate: '10/5/2024',
    state: 'MA',
    violationCount: 2,
    totalSeverityWeight: 14,
    oos: true,
    violations: [
      {
        code: '395.8(e)(1)',
        description: 'False record of duty status — unaccounted driving time exceeding 2 hours',
        severityWeight: 7,
        timeWeight: 2,
        oos: true,
        basicCategory: 'HOS Compliance',
      },
      {
        code: '391.11(b)(4)',
        description: 'Medical certificate — expired medical card, driver continued operating',
        severityWeight: 7,
        timeWeight: 2,
        oos: true,
        basicCategory: 'Driver Qualification',
      },
    ],
  },
  {
    reportNumber: 'NYW080100567',
    inspectionDate: '8/1/2024',
    state: 'NY',
    violationCount: 1,
    totalSeverityWeight: 8,
    oos: true,
    violations: [
      {
        code: '396.3(a)(1)',
        description: 'Brakes out of adjustment — pushrod travel exceeds limit on steer and drive axles',
        severityWeight: 8,
        timeWeight: 1,
        oos: true,
        basicCategory: 'Vehicle Maintenance',
      },
    ],
  },
  {
    reportNumber: 'PAI060200891',
    inspectionDate: '6/2/2024',
    state: 'PA',
    violationCount: 1,
    totalSeverityWeight: 6,
    oos: true,
    violations: [
      {
        code: '391.11(b)(4)',
        description: 'Medical certificate — driver operating with revoked medical examiner certificate',
        severityWeight: 6,
        timeWeight: 1,
        oos: true,
        basicCategory: 'Driver Qualification',
      },
    ],
  },
  {
    reportNumber: 'NJE040800345',
    inspectionDate: '4/8/2024',
    state: 'NJ',
    violationCount: 1,
    totalSeverityWeight: 8,
    oos: true,
    violations: [
      {
        code: '396.3(a)(1)',
        description: 'Brakes out of adjustment — air brake system pressure below minimum',
        severityWeight: 8,
        timeWeight: 1,
        oos: true,
        basicCategory: 'Vehicle Maintenance',
      },
    ],
  },
];

/** Map of USDOT → mock inspection records */
export const MOCK_CARRIER_INSPECTIONS: Record<string, InspectionWithViolations[]> = {
  '491180': acmeInspections,      // ACME Transport
  '847291': midwestInspections,   // Midwest Logistics
  '562843': deltaInspections,     // Delta Freight
  '934521': haztechInspections,   // HazTech Carriers
  '715394': northeastInspections, // Northeast Express
};
