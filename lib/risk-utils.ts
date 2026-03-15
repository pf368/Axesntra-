import { RiskLevel, TrendDirection } from './types';

export function getRiskColor(risk: RiskLevel): string {
  switch (risk) {
    case 'Low': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    case 'Moderate': return 'text-amber-700 bg-amber-50 border-amber-200';
    case 'Elevated': return 'text-orange-700 bg-orange-50 border-orange-200';
    case 'Severe': return 'text-red-700 bg-red-50 border-red-200';
    default: return 'text-slate-700 bg-slate-50 border-slate-200';
  }
}

export function getTrendColor(trend: TrendDirection): string {
  switch (trend) {
    case 'Improving': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    case 'Stable': return 'text-blue-700 bg-blue-50 border-blue-200';
    case 'Worsening': return 'text-red-700 bg-red-50 border-red-200';
    default: return 'text-slate-700 bg-slate-50 border-slate-200';
  }
}

export function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function formatDelta(value: number): string {
  if (value > 0) return `+${value.toFixed(1)} pts`;
  if (value < 0) return `${value.toFixed(1)} pts`;
  return '0 pts';
}

export function getRiskScore(risk: RiskLevel): number {
  switch (risk) {
    case 'Low': return 1;
    case 'Moderate': return 2;
    case 'Elevated': return 3;
    case 'Severe': return 4;
    default: return 0;
  }
}
