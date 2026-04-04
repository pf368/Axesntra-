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

export interface InspectionRecord {
  reportNumber: string;
  inspectionDate: string;
  state: string;
  violationCount: number;
  totalSeverityWeight: number;
  oos: boolean;
  inspectionId?: string;
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
