'use client';

import { ArrowLeft, Sparkles, AlertTriangle, TrendingUp, Info } from 'lucide-react';
import { CarrierBrief, InspectionWithViolations, ScoreContribution } from '@/lib/types';
import { getBasicDescription } from '@/lib/violation-ai-context';
import { getIssueForRiskDriver } from '@/lib/ai-advisory';
import { InspectionHistoryTable } from '@/components/inspection-history-table';

interface BasicDetailViewProps {
  basicLabel: string;
  data: CarrierBrief;
  inspections: InspectionWithViolations[];
  onBack: () => void;
  onInspectionClick?: (inspection: InspectionWithViolations) => void;
}

export function BasicDetailView({
  basicLabel,
  data,
  inspections,
  onBack,
  onInspectionClick,
}: BasicDetailViewProps) {
  const basicInfo = getBasicDescription(basicLabel);
  const aiGuidance = getIssueForRiskDriver(basicLabel, data);

  // Find score contribution for this BASIC
  const scoreContrib = data.scoreContributions.find((s) =>
    s.category.toLowerCase().includes(basicLabel.toLowerCase().split(' ')[0])
  );
  const score = scoreContrib?.score ?? 0;
  const threshold = basicInfo.threshold;
  const exceedsThreshold = score >= threshold;

  // Filter inspections for this BASIC
  const filteredInspections = inspections.filter((insp) =>
    insp.basicCategory?.toLowerCase().includes(basicLabel.toLowerCase().split(' ')[0]) ||
    insp.violations.some((v) =>
      v.basicCategory.toLowerCase().includes(basicLabel.toLowerCase().split(' ')[0])
    )
  );

  const violationCount = filteredInspections.reduce(
    (sum, insp) => sum + insp.violations.length,
    0
  );
  const oosCount = filteredInspections.filter((insp) => insp.oos).length;

  return (
    <div>
      {/* Back button + header */}
      <button
        onClick={onBack}
        className="mb-4 flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Overview</span>
      </button>

      <div className="mb-6">
        <p className="mb-1 font-mono text-[10px] font-medium uppercase tracking-[0.15em] text-on-surface-variant">
          BASIC Detail / {basicInfo.fullName}
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {basicInfo.fullName.toUpperCase()}
        </h1>
      </div>

      {/* AI Context Card — the key differentiator */}
      <div className="mb-6 rounded-xl bg-gradient-to-br from-ai-teal/5 to-ai-teal/10 border border-ai-teal/15 p-5 shadow-ambient">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-ai-teal" />
          <span className="text-sm font-semibold text-ai-teal uppercase tracking-[0.08em]">
            AI Safety Analysis
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5 text-ai-teal" />
              What This BASIC Measures
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {basicInfo.description}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold text-foreground mb-1 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 text-ai-teal" />
              Safety Event Group
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {basicInfo.safetyEventGroup}
            </p>
          </div>
        </div>

        {aiGuidance && (
          <div className="mt-4 pt-4 border-t border-ai-teal/10">
            <h3 className="text-xs font-semibold text-foreground mb-2 flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5 text-ai-teal" />
              Why This Score Matters for {data.carrierName}
            </h3>
            <p className="text-xs text-on-surface-variant leading-relaxed mb-3">
              {aiGuidance.meaning}
            </p>

            {aiGuidance.rootCause && (
              <div className="mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ai-teal">Root Cause: </span>
                <span className="text-xs text-on-surface-variant">{aiGuidance.rootCause}</span>
              </div>
            )}

            {aiGuidance.preventionSteps.length > 0 && (
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-ai-teal">Prevention Steps:</span>
                <ul className="mt-1.5 space-y-1">
                  {aiGuidance.preventionSteps.slice(0, 4).map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-on-surface-variant">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-ai-teal/10 text-[9px] font-bold text-ai-teal">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Score summary */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-surface-panel p-4 shadow-ambient">
          <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Percentile</p>
          <p className="mt-1 font-mono text-2xl font-bold text-foreground">{score.toFixed(0)}</p>
        </div>
        <div className="rounded-xl bg-surface-panel p-4 shadow-ambient">
          <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Threshold</p>
          <p className="mt-1 font-mono text-2xl font-bold text-foreground">{threshold}</p>
        </div>
        <div className="rounded-xl bg-surface-panel p-4 shadow-ambient">
          <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Status</p>
          <p className={`mt-1 text-sm font-bold uppercase ${exceedsThreshold ? 'text-red-600' : 'text-ai-teal'}`}>
            {exceedsThreshold ? 'Exceeds Threshold' : 'Within Threshold'}
          </p>
        </div>
        <div className="rounded-xl bg-surface-panel p-4 shadow-ambient">
          <p className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">Inspections</p>
          <p className="mt-1 font-mono text-2xl font-bold text-foreground">{filteredInspections.length}</p>
        </div>
      </div>

      {/* AI pattern summary */}
      {filteredInspections.length > 0 && (
        <div className="mb-6 rounded-lg bg-surface-panel p-4 shadow-ambient">
          <div className="flex items-center gap-1.5 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-ai-teal" />
            <span className="text-[10px] font-semibold uppercase tracking-wider text-ai-teal">Pattern Analysis</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Based on {filteredInspections.length} inspection{filteredInspections.length !== 1 ? 's' : ''} with{' '}
            {violationCount} violation{violationCount !== 1 ? 's' : ''} in the {basicInfo.fullName} BASIC
            {oosCount > 0 ? ` (${oosCount} resulted in out-of-service orders)` : ''},{' '}
            {exceedsThreshold
              ? `this carrier's ${score.toFixed(0)}th percentile score exceeds the ${threshold}% intervention threshold. Immediate corrective action is recommended.`
              : `this carrier's score is within acceptable thresholds. Continue monitoring for trending changes.`}
          </p>
        </div>
      )}

      {/* Filtered inspection list */}
      <div className="mb-6">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
          {basicInfo.fullName} Inspection History
        </h2>
        {filteredInspections.length > 0 ? (
          <InspectionHistoryTable
            inspections={filteredInspections}
            onInspectionClick={onInspectionClick}
          />
        ) : (
          <div className="rounded-xl bg-surface-panel p-6 text-center text-sm text-on-surface-variant shadow-ambient">
            No inspection records found for {basicInfo.fullName} BASIC.
            {inspections.length > 0 && ' Try viewing all inspections from the Inspections tab.'}
          </div>
        )}
      </div>
    </div>
  );
}
