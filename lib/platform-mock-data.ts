// Supplementary mock data for platform BASIC detail pages
// This data supplements the API's CarrierBrief and InspectionWithViolations types

export interface DriverRiskRow {
  id: string;
  name: string;
  license: string;
  state: string;
  violations: number;
  severity: 'high' | 'medium' | 'low';
  lastViolation: string;
  oosCount: number;
  trend: 'up' | 'down' | 'stable';
  contact: string;
}

export interface UnitRiskRow {
  id: string;
  unit: string;
  vin: string;
  year: number;
  make: string;
  violations: number;
  oosCount: number;
  lastInspection: string;
  status: 'critical' | 'warning' | 'ok';
}

export const MOCK_DRIVERS: DriverRiskRow[] = [
  { id: 'd1', name: 'Marcus T.', license: 'CDL-A', state: 'TX', violations: 4, severity: 'high', lastViolation: '2024-11-12', oosCount: 2, trend: 'up', contact: '(555) 201-4411' },
  { id: 'd2', name: 'Sandra R.', license: 'CDL-A', state: 'OH', violations: 3, severity: 'high', lastViolation: '2024-10-28', oosCount: 1, trend: 'stable', contact: '(555) 338-9922' },
  { id: 'd3', name: 'James O.', license: 'CDL-B', state: 'GA', violations: 2, severity: 'medium', lastViolation: '2024-09-15', oosCount: 1, trend: 'down', contact: '(555) 447-0033' },
  { id: 'd4', name: 'Priya K.', license: 'CDL-A', state: 'IL', violations: 2, severity: 'medium', lastViolation: '2024-08-30', oosCount: 0, trend: 'down', contact: '(555) 556-1144' },
  { id: 'd5', name: 'Robert W.', license: 'CDL-A', state: 'FL', violations: 1, severity: 'low', lastViolation: '2024-07-22', oosCount: 0, trend: 'stable', contact: '(555) 664-2255' },
  { id: 'd6', name: 'Ana M.', license: 'CDL-A', state: 'TX', violations: 1, severity: 'low', lastViolation: '2024-06-18', oosCount: 0, trend: 'down', contact: '(555) 772-3366' },
];

export const MOCK_UNITS: UnitRiskRow[] = [
  { id: 'u1', unit: 'Unit 402', vin: '1FUJGBDV8CLBP8328', year: 2019, make: 'Freightliner', violations: 5, oosCount: 2, lastInspection: '2024-11-08', status: 'critical' },
  { id: 'u2', unit: 'Unit 218', vin: '3AKJHHDR8LSKZ2190', year: 2021, make: 'Kenworth', violations: 3, oosCount: 1, lastInspection: '2024-10-15', status: 'warning' },
  { id: 'u3', unit: 'Unit 315', vin: '1XPWD49X1ED215678', year: 2020, make: 'Peterbilt', violations: 2, oosCount: 0, lastInspection: '2024-09-22', status: 'warning' },
  { id: 'u4', unit: 'Unit 101', vin: '4V4NC9EH8EN162345', year: 2022, make: 'Volvo', violations: 1, oosCount: 0, lastInspection: '2024-08-30', status: 'ok' },
  { id: 'u5', unit: 'Unit 509', vin: '1NKDLB0X8GJ315777', year: 2018, make: 'Mack', violations: 1, oosCount: 0, lastInspection: '2024-07-14', status: 'ok' },
];

export const MOCK_TREND_12: number[] = [18, 22, 19, 25, 28, 24, 31, 35, 38, 42, 40, 45];

export const MOCK_VIOLATION_BREAKDOWN = [
  { code: '392.2', description: 'Speeding 6-10 MPH', count: 8, weight: 1 },
  { code: '395.8', description: 'Log Book Form/Manner', count: 6, weight: 1 },
  { code: '393.9', description: 'Inoperative Required Lamps', count: 5, weight: 2 },
  { code: '392.2S', description: 'Speeding 11+ MPH', count: 4, weight: 3 },
  { code: '383.110', description: 'CDL Skills Test Required', count: 3, weight: 5 },
];

export const MOCK_COACH_ACTIONS = [
  'Schedule targeted HOS training session for flagged drivers',
  'Review and update maintenance schedule for Unit 402',
  'Implement pre-trip inspection checklist protocol',
  'Conduct team safety meeting on violation patterns',
  'File DataQ challenge for disputed violations',
];

export const MOCK_TERMINALS = [
  { name: 'Dallas Hub', drivers: 12, violations: 14, pct: 62 },
  { name: 'Houston Branch', drivers: 8, violations: 7, pct: 34 },
  { name: 'Austin Depot', drivers: 5, violations: 3, pct: 22 },
];

export const MOCK_DRIVER_FITNESS_DRIVERS = [
  { id: 'df1', name: 'Marcus T.', cdl: 'TX-CDL-A-123', medCertExpiry: '2025-03-15', daysLeft: 52, status: 'expiring' },
  { id: 'df2', name: 'Sandra R.', cdl: 'OH-CDL-A-456', medCertExpiry: '2025-07-30', daysLeft: 158, status: 'ok' },
  { id: 'df3', name: 'James O.', cdl: 'GA-CDL-B-789', medCertExpiry: '2024-12-01', daysLeft: 8, status: 'critical' },
  { id: 'df4', name: 'Priya K.', cdl: 'IL-CDL-A-012', medCertExpiry: '2026-01-15', daysLeft: 385, status: 'ok' },
  { id: 'df5', name: 'Robert W.', cdl: 'FL-CDL-A-345', medCertExpiry: '2025-05-20', daysLeft: 108, status: 'ok' },
];

export const MOCK_CRASH_HISTORY = [
  { id: 'cr1', date: '2024-09-12', state: 'TX', severity: 'Tow-Away', fatalities: 0, injuries: 0, driver: 'Marcus T.', unit: 'Unit 402', preventable: null },
  { id: 'cr2', date: '2024-06-04', state: 'OH', severity: 'Injury', fatalities: 0, injuries: 1, driver: 'Sandra R.', unit: 'Unit 218', preventable: false },
  { id: 'cr3', date: '2024-02-18', state: 'GA', severity: 'Tow-Away', fatalities: 0, injuries: 0, driver: 'James O.', unit: 'Unit 315', preventable: null },
];
