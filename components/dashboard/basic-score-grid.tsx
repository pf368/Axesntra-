'use client';

import { BasicScoreCard } from './basic-score-card';
import { ScoreContribution, RiskChips } from '@/lib/types';

interface BasicScoreGridProps {
  scoreContributions: ScoreContribution[];
  riskChips: RiskChips;
  metrics: {
    vehicleOOS: number;
    driverOOS: number;
    crashes24mo: number;
  };
}

function riskToScore(risk: string): number {
  switch (risk) {
    case 'Severe': return 85 + Math.random() * 10;
    case 'Elevated': return 60 + Math.random() * 15;
    case 'Moderate': return 35 + Math.random() * 15;
    case 'Low': return 5 + Math.random() * 15;
    default: return 10;
  }
}

function scoreToStatus(score: number): 'GOOD' | 'WARNING' | 'ALERT' {
  if (score >= 75) return 'ALERT';
  if (score >= 50) return 'WARNING';
  return 'GOOD';
}

export function BasicScoreGrid({ scoreContributions, riskChips, metrics }: BasicScoreGridProps) {
  // Map score contributions by category keyword
  const findScore = (keyword: string): number | undefined => {
    const match = scoreContributions.find((s) =>
      s.category.toLowerCase().includes(keyword.toLowerCase())
    );
    return match?.score;
  };

  const cards: { label: string; score: number }[] = [
    { label: 'Unsafe Driving', score: findScore('unsafe') ?? findScore('crash') ?? riskToScore(riskChips.crash) },
    { label: 'HOS Compliance', score: findScore('hos') ?? findScore('hour') ?? riskToScore(riskChips.driver) },
    { label: 'Vehicle Maintenance', score: findScore('maintenance') ?? findScore('vehicle') ?? metrics.vehicleOOS },
    { label: 'Driver Fitness', score: findScore('driver') ?? findScore('fitness') ?? metrics.driverOOS },
    { label: 'Controlled Subs', score: findScore('controlled') ?? findScore('substance') ?? 5.1 },
    { label: 'Crash Indicator', score: findScore('crash') ?? Math.min(metrics.crashes24mo * 5, 100) },
    { label: 'Hazmat Compliance', score: findScore('hazmat') ?? riskToScore(riskChips.hazmat) },
    { label: 'Safety Management', score: findScore('admin') ?? findScore('safety') ?? riskToScore(riskChips.admin) },
  ];

  return (
    <div className="mb-8">
      <h2 className="mb-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-indigo" />
        <span className="text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
          Safety Basics Performance
        </span>
      </h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cards.map((card) => (
          <BasicScoreCard
            key={card.label}
            label={card.label}
            score={card.score}
            status={scoreToStatus(card.score)}
          />
        ))}
      </div>
    </div>
  );
}
