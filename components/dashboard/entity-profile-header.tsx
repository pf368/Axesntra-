'use client';

import { RiskLevel } from '@/lib/types';

interface EntityProfileHeaderProps {
  carrierName: string;
  usdot: string;
  operationType: string;
  overallRisk: RiskLevel;
  isLive?: boolean;
}

export function EntityProfileHeader({
  carrierName,
  usdot,
  operationType,
  overallRisk,
  isLive,
}: EntityProfileHeaderProps) {
  return (
    <div className="mb-8">
      <p className="mb-1 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-on-surface-variant">
        Entity Profile / Operational Overview
      </p>
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
        {carrierName.toUpperCase()}
        {isLive && (
          <span className="ml-3 inline-flex items-center gap-1.5 align-middle rounded-full bg-ai-teal/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-ai-teal">
            <span className="h-1.5 w-1.5 rounded-full bg-ai-teal animate-pulse" />
            Live
          </span>
        )}
      </h1>
      <p className="mt-1 font-mono text-xs text-on-surface-variant">
        DOT: {usdot}
        <span className="mx-2 text-on-surface/20">&#x2022;</span>
        {operationType}
      </p>
    </div>
  );
}
