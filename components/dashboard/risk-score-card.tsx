'use client';

import { RiskLevel, ScoreContribution } from '@/lib/types';

interface RiskScoreCardProps {
  overallRisk: RiskLevel;
  scoreContributions: ScoreContribution[];
}

const RISK_CONFIG: Record<RiskLevel, { label: string; color: string; barColor: string }> = {
  Low: { label: 'LOW RISK', color: 'text-ai-teal', barColor: 'from-ai-teal to-ai-teal-light' },
  Moderate: { label: 'MODERATE', color: 'text-amber-600', barColor: 'from-ai-teal via-amber-400 to-amber-500' },
  Elevated: { label: 'ELEVATED', color: 'text-amber-600', barColor: 'from-ai-teal via-amber-500 to-red-500' },
  Severe: { label: 'CRITICAL', color: 'text-red-600', barColor: 'from-ai-teal via-red-400 to-red-600' },
};

export function RiskScoreCard({ overallRisk, scoreContributions }: RiskScoreCardProps) {
  // Compute composite risk score (weighted average of contribution scores)
  const totalWeight = scoreContributions.reduce((sum, s) => sum + s.weight, 0);
  const weightedSum = scoreContributions.reduce((sum, s) => sum + s.score * s.weight, 0);
  const riskScore = totalWeight > 0 ? weightedSum / totalWeight : 0;
  const displayScore = Math.round(riskScore * 10) / 10;

  const config = RISK_CONFIG[overallRisk];
  const fillPercent = Math.min(riskScore, 100);

  return (
    <div className="mb-6 rounded-xl bg-surface-panel p-5 shadow-ambient">
      <div className="flex items-start justify-between">
        <p className="font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-on-surface-variant">
          Risk Score
        </p>
        <span className={`font-mono text-3xl font-bold tracking-tight ${config.color}`}>
          {displayScore}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-4 h-2 rounded-full bg-surface-container overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${config.barColor} transition-all duration-700`}
          style={{ width: `${fillPercent}%` }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span className="font-mono text-[9px] text-on-surface-variant">0.0 (OPTIMAL)</span>
        <span className={`font-mono text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
          {config.label}
        </span>
        <span className="font-mono text-[9px] text-on-surface-variant">100.0 (CRITICAL)</span>
      </div>
    </div>
  );
}
