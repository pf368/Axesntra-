export type RiskLevel = 'Low' | 'Moderate' | 'Elevated' | 'Severe';
export type TrendDirection = 'Improving' | 'Stable' | 'Worsening';
export type Confidence = 'Low' | 'Moderate' | 'High';
export type ImpactLevel = 'High' | 'Medium' | 'Low';
export type EffortLevel = 'High' | 'Medium' | 'Low';
export type Severity = 'high' | 'medium' | 'low';
export type ChangeDirection = 'up' | 'down' | 'stable';

export interface RiskDriverDetail {
  title: string;
  description: string;
  severity: Severity;
}

export interface WhatChangedItem {
  label: string;
  direction: ChangeDirection;
  detail: string;
}

export interface ScoreContribution {
  category: string;
  weight: number;
  score: number;
  contribution: number;
}

export interface FixPlanItem {
  title: string;
  description: string;
  impact: ImpactLevel;
  effort: EffortLevel;
  expectedEffect: string;
}

export interface MonthlyData {
  month: string;
  value: number;
  violations?: number;
}

export interface TrendData {
  vehicleOOS: MonthlyData[];
  driverOOS: MonthlyData[];
  inspections: MonthlyData[];
}

export interface CarrierMetrics {
  overallOOS: number;
  overallOOSDelta: number;
  vehicleOOS: number;
  vehicleOOSDelta: number;
  driverOOS: number;
  driverOOSDelta: number;
  crashes24mo: number;
  crashesTrend: string;
  basicExposure: string;
  mcs150Freshness: string;
}

export interface RiskChips {
  maintenance: RiskLevel;
  crash: RiskLevel;
  hazmat: RiskLevel;
  driver: RiskLevel;
  admin: RiskLevel;
}

export type DataSource = 'mock' | 'public-live' | 'hybrid';

export type CarrierLookupResult =
  | { status: 'success'; brief: CarrierBrief; lookupStatus?: string }
  | { status: 'not_found'; message: string; usdot: string }
  | { status: 'source_unavailable'; message: string; fallbackBrief?: CarrierBrief; usdot: string }
  | { status: 'parse_failed'; message: string; fallbackBrief?: CarrierBrief; usdot: string };

export interface CarrierBrief {
  id: string;
  carrierName: string;
  usdot: string;
  mc: string;
  status: string;
  operationType: string;
  powerUnits: number;
  drivers: number;
  mcs150Updated: string;
  dataFreshness: string;
  overallRisk: RiskLevel;
  trend: TrendDirection;
  confidence: Confidence;
  executiveMemo: string;
  trendSummary?: string;
  aiSummary: string;
  metrics: CarrierMetrics;
  riskChips: RiskChips;
  topRiskDrivers: string[];
  riskDriverDetails: RiskDriverDetail[];
  whatChanged: string[];
  whatChangedItems: WhatChangedItem[];
  scoreContributions: ScoreContribution[];
  fixPlan: FixPlanItem[];
  trendData: TrendData;
  source: DataSource;
  lastRefreshed: string;
  sourceNotes?: string[];
  dataCoverage?: string[];
  // Raw API aggregate inspection data (for live carriers)
  rawInspectionCounts?: {
    vehicleInsp?: number;
    vehicleOosInsp?: number;
    driverInsp?: number;
    driverOosInsp?: number;
    hazmatInsp?: number;
    hazmatOosInsp?: number;
    fatalCrash?: number;
    injCrash?: number;
    towawayCrash?: number;
  };
}

export interface CarrierListItem {
  id: string;
  carrierName: string;
  usdot: string;
  overallRisk: RiskLevel;
  trend: TrendDirection;
  source?: 'mock' | 'live';
}

// ── Inspection / Violation Types ──

export interface VehicleInfo {
  unit: number;
  type: string;       // e.g. 'Truck Tractor', 'Semi-Trailer'
  make: string;       // e.g. 'VOLV', 'GDAN'
  plateState: string;
  plateNumber: string;
  vin: string;
}

export interface InspectionRecord {
  reportNumber: string;
  inspectionDate: string;
  state: string;
  violationCount: number;
  totalSeverityWeight: number;
  oos: boolean;
  inspectionId?: string;
  basicCategory?: string;
  level?: string;        // 'I. Full', 'II. Walk-Around', 'III. Driver-Only'
  facility?: string;     // 'Roadside', 'Terminal'
  vehicles?: VehicleInfo[];
}

export interface ViolationDetail {
  code: string;
  description: string;
  severityWeight: number;
  timeWeight: number;
  oos: boolean;
  basicCategory: string;
}

export interface InspectionWithViolations extends InspectionRecord {
  violations: ViolationDetail[];
}

export interface SMSInspectionResult {
  success: boolean;
  inspections?: InspectionRecord[];
  inspectionDetails?: InspectionWithViolations[];
  totalCount?: number;
  basicPercentile?: number;
  error?: string;
}

export interface ViolationOccurrence {
  inspectionId?: string;
  reportNumber: string;
  inspectionDate: string;
  state: string;
  plateNumber?: string;
  plateState?: string;
  vehicleType?: string;
  violation: ViolationDetail;
}

export interface CarrierTrends {
  usdot: string;
  trendData: TrendData;
  trend: TrendDirection;
  trendSummary?: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface CarrierData extends CarrierBrief {}
export interface ExtendedCarrierData extends CarrierBrief {}

// ── Rich Inspection Types (used by InspectionsPage and mock data) ──

export interface ViolationRich {
  code: string;
  description: string;
  severity: 'Critical' | 'Major' | 'Minor';
  basicCategory: string;
  timeWeight: number;
  oos: boolean;
}

export interface AIInsightItem {
  type: string;
  label: string;
  description: string;
  riskLevel: 'High' | 'Medium' | 'Low';
  suggestedActions: string[];
}

export type InspectionLevel = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
export type InspectionType = 'Roadside' | 'Compliance' | 'Follow-up';
export type InspectionStatus = 'New' | 'In Progress' | 'Resolved';

export interface RichInspection {
  id: string;
  date: string;
  level: InspectionLevel;
  type: InspectionType;
  location: { state: string; city: string };
  driverName: string;
  vin: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: number;
  plateNumber: string;
  plateState: string;
  reportNumber: string;
  reportState: string;
  startTime: string;
  endTime: string;
  facility: string;
  violations: ViolationRich[];
  driverOOS: boolean;
  vehicleOOS: boolean;
  severityScore: number;
  status: InspectionStatus;
  aiInsights: AIInsightItem[];
  notes: string[];
}
