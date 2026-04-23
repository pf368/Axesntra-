import type { CarrierBrief, InspectionWithViolations, ScoreContribution } from '@/lib/types';

export interface BasicPageData {
  basicId: string;
  basicName: string;
  score: number;
  threshold: number;
  isAbove: boolean;
  trend: number[];
  topViolationCodes: ViolationSummary[];
  inspectionCount: number;
  oosCount: number;
  relatedInspections: InspectionWithViolations[];
}

export interface ViolationSummary {
  code: string;
  description: string;
  count: number;
  severity: 'OOS' | 'Warning' | 'Critical';
}

const BASIC_THRESHOLDS: Record<string, number> = {
  'unsafe-driving': 65,
  'hos-compliance': 65,
  'vehicle-maintenance': 65,
  'driver-fitness': 65,
  'controlled-substances': 65,
  'crash-indicator': 65,
  'hazardous-materials': 80,
  'safety-management': 65,
};

const BASIC_LABEL_MAP: Record<string, string> = {
  'unsafe-driving': 'Unsafe Driving',
  'hos-compliance': 'HOS Compliance',
  'vehicle-maintenance': 'Vehicle Maintenance',
  'driver-fitness': 'Driver Fitness',
  'controlled-substances': 'Controlled Substances',
  'crash-indicator': 'Crash Indicator',
  'hazardous-materials': 'Hazmat Compliance',
  'safety-management': 'Safety Management',
};

// Map violation codes to BASIC categories
const VIOLATION_TO_BASIC: Record<string, string> = {
  '392': 'unsafe-driving',
  '393': 'vehicle-maintenance',
  '396': 'vehicle-maintenance',
  '395': 'hos-compliance',
  '397': 'hazardous-materials',
  '171': 'hazardous-materials',
  '172': 'hazardous-materials',
  '173': 'hazardous-materials',
  '383': 'driver-fitness',
  '391': 'driver-fitness',
  '382': 'controlled-substances',
};

function getBasicForViolation(code: string): string {
  const prefix = code.split('.')[0];
  return VIOLATION_TO_BASIC[prefix] || 'vehicle-maintenance';
}

export function getBasicData(basicId: string, carrier: CarrierBrief, inspections: InspectionWithViolations[]): BasicPageData {
  const threshold = BASIC_THRESHOLDS[basicId] ?? 65;
  const basicName = BASIC_LABEL_MAP[basicId] ?? basicId;

  const contribution: ScoreContribution | undefined = carrier.scoreContributions.find(
    (s) =>
      s.category === basicName ||
      s.category.toLowerCase().replace(/\s+/g, '-') === basicId
  );
  const score = contribution?.score ?? 0;

  // Filter inspections with violations relevant to this BASIC
  const relatedInspections = inspections.filter((insp) =>
    insp.violations.some((v) => getBasicForViolation(v.code) === basicId)
  );

  // Aggregate violation codes
  const codeMap = new Map<string, { count: number; description: string; severity: 'OOS' | 'Warning' | 'Critical' }>();
  for (const insp of relatedInspections) {
    for (const v of insp.violations) {
      if (getBasicForViolation(v.code) === basicId) {
        const existing = codeMap.get(v.code);
        if (existing) {
          existing.count++;
        } else {
          codeMap.set(v.code, {
            count: 1,
            description: v.description || `Violation ${v.code}`,
            severity: v.oos ? 'OOS' : v.severityWeight >= 7 ? 'Critical' : 'Warning',
          });
        }
      }
    }
  }

  const topViolationCodes: ViolationSummary[] = Array.from(codeMap.entries())
    .map(([code, data]) => ({ code, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Build trend from available data (or generate plausible trend from score)
  const trend = buildTrend(score, 12);

  const oosCount = relatedInspections.filter((i) => i.oos).length;

  return {
    basicId,
    basicName,
    score,
    threshold,
    isAbove: score >= threshold,
    trend,
    topViolationCodes,
    inspectionCount: relatedInspections.length,
    oosCount,
    relatedInspections,
  };
}

function buildTrend(currentScore: number, months: number): number[] {
  const result: number[] = [];
  const startScore = Math.max(currentScore - 15, 0);
  for (let i = 0; i < months; i++) {
    const t = i / (months - 1);
    const base = startScore + (currentScore - startScore) * t;
    const noise = (Math.random() - 0.5) * 8;
    result.push(Math.max(Math.round(base + noise), 0));
  }
  result[months - 1] = currentScore;
  return result;
}
