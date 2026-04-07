'use client';

import { Sparkles } from 'lucide-react';
import { InspectionWithViolations, WhatChangedItem } from '@/lib/types';

interface SafetyLedgerProps {
  inspections: InspectionWithViolations[];
  whatChanged: WhatChangedItem[];
  carrierName: string;
}

interface LedgerEntry {
  timestamp: string;
  logId: string;
  title: string;
  description: string;
  severity: 'critical' | 'positive' | 'neutral' | 'info';
}

const SEVERITY_DOT: Record<string, string> = {
  critical: 'bg-red-500',
  positive: 'bg-ai-teal',
  neutral: 'bg-indigo-light',
  info: 'bg-on-surface-variant/40',
};

function generateLedgerEntries(
  inspections: InspectionWithViolations[],
  whatChanged: WhatChangedItem[],
): LedgerEntry[] {
  const entries: LedgerEntry[] = [];
  let logIndex = 1;

  // Generate entries from most recent inspections
  const sorted = [...inspections].sort((a, b) =>
    new Date(b.inspectionDate).getTime() - new Date(a.inspectionDate).getTime()
  );

  for (const insp of sorted.slice(0, 2)) {
    const oosText = insp.oos ? 'OOS event recorded' : 'No OOS';
    const violCount = insp.violations?.length || insp.violationCount;
    entries.push({
      timestamp: `${insp.inspectionDate}`,
      logId: `AI_LOG_${String(logIndex++).padStart(2, '0')}`,
      title: insp.oos ? 'Vehicle Maintenance spike detected' : `Inspection recorded in ${insp.state}`,
      description: `${violCount} violation(s) found in ${insp.state}. ${oosText}. Severity weight: ${insp.totalSeverityWeight}.`,
      severity: insp.oos ? 'critical' : 'neutral',
    });
  }

  // Generate entries from "what changed" items
  for (const item of whatChanged.slice(0, 2)) {
    entries.push({
      timestamp: 'Recent',
      logId: `AI_LOG_${String(logIndex++).padStart(2, '0')}`,
      title: item.direction === 'down'
        ? `${item.label} trending positively`
        : item.direction === 'up'
          ? `${item.label} worsening`
          : `${item.label} stable`,
      description: item.detail,
      severity: item.direction === 'down' ? 'positive' : item.direction === 'up' ? 'critical' : 'info',
    });
  }

  // Always add a system entry
  entries.push({
    timestamp: 'System',
    logId: `AI_LOG_${String(logIndex++).padStart(2, '0')}`,
    title: 'Historical Data Recalibration',
    description: 'Quarterly risk model weights updated. Baseline safety metrics adjusted for seasonal factors.',
    severity: 'info',
  });

  return entries;
}

export function SafetyLedger({ inspections, whatChanged, carrierName }: SafetyLedgerProps) {
  const entries = generateLedgerEntries(inspections, whatChanged);

  return (
    <div className="mb-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
          Safety Ledger
        </h3>
        <Sparkles className="h-4 w-4 text-ai-teal" />
      </div>

      <div className="space-y-4">
        {entries.map((entry, i) => (
          <div key={i} className="relative">
            {/* Timestamp + log ID */}
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-mono text-[10px] text-on-surface-variant">
                {entry.timestamp} / {entry.logId}
              </span>
              <span className={`h-2 w-2 rounded-full ${SEVERITY_DOT[entry.severity]}`} />
            </div>
            {/* Card */}
            <div className="rounded-lg bg-surface p-3.5">
              <p className="text-sm font-semibold text-foreground leading-snug">{entry.title}</p>
              <p className="mt-1 text-xs leading-relaxed text-on-surface-variant">{entry.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Generate Report button */}
      <button className="mt-6 w-full rounded-lg bg-gradient-to-r from-indigo to-indigo-light px-4 py-3 text-xs font-bold uppercase tracking-[0.15em] text-white shadow-ambient transition-shadow hover:shadow-lg">
        Generate Intelligence Report
      </button>
    </div>
  );
}
