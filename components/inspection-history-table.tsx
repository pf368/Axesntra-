'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  InspectionWithViolations,
  ViolationDetail,
} from '@/lib/types';
import {
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  MapPin,
  Calendar,
  FileText,
  ShieldAlert,
  ExternalLink,
} from 'lucide-react';
import { ViolationAiTooltip } from '@/components/dashboard/violation-ai-tooltip';

interface InspectionHistoryTableProps {
  inspections: InspectionWithViolations[];
  basicPercentile?: number;
  onInspectionClick?: (inspection: InspectionWithViolations) => void;
}

function OosBadge({ oos }: { oos: boolean }) {
  if (!oos) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-red-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-red-800">
      <AlertTriangle className="h-3 w-3" />
      OOS
    </span>
  );
}

function SeverityIndicator({ weight }: { weight: number }) {
  const color =
    weight >= 8
      ? 'bg-red-500'
      : weight >= 5
        ? 'bg-amber-500'
        : weight >= 1
          ? 'bg-yellow-400'
          : 'bg-slate-300';

  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-2 w-2 rounded-full ${color}`} />
      <span className="text-xs text-slate-600">{weight}</span>
    </div>
  );
}

function ViolationRow({ violation }: { violation: ViolationDetail }) {
  return (
    <>
      <tr className="border-t border-slate-100">
        <td className="py-2 pl-10 pr-3 text-xs font-mono text-slate-700">
          <div className="flex items-center gap-1">
            {violation.code}
            <ViolationAiTooltip code={violation.code} basicCategory={violation.basicCategory} />
          </div>
        </td>
        <td className="py-2 px-3 text-xs text-slate-600">
          {violation.description}
        </td>
        <td className="py-2 px-3">
          <SeverityIndicator weight={violation.severityWeight} />
        </td>
        <td className="py-2 px-3 text-xs text-slate-500 text-center">
          {violation.timeWeight || '—'}
        </td>
        <td className="py-2 px-3">
          {violation.oos && <OosBadge oos={true} />}
        </td>
      </tr>
    </>
  );
}

function InspectionRow({
  inspection,
  isExpanded,
  onToggle,
  onViewReport,
}: {
  inspection: InspectionWithViolations;
  isExpanded: boolean;
  onToggle: () => void;
  onViewReport?: () => void;
}) {
  const hasViolations = inspection.violations && inspection.violations.length > 0;

  return (
    <>
      <tr
        className={`cursor-pointer transition-colors hover:bg-slate-50 ${
          inspection.oos ? 'bg-red-50/40' : ''
        } ${isExpanded ? 'bg-slate-50' : ''}`}
        onClick={onToggle}
      >
        <td className="py-3 pl-4 pr-3">
          <div className="flex items-center gap-2">
            {hasViolations ? (
              isExpanded ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )
            ) : (
              <div className="w-4" />
            )}
            <span className="text-sm font-mono text-slate-700">
              {inspection.reportNumber}
            </span>
          </div>
        </td>
        <td className="py-3 px-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-sm text-slate-700">
              {inspection.inspectionDate || 'Unknown'}
            </span>
          </div>
        </td>
        <td className="py-3 px-3">
          <div className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-sm text-slate-700">
              {inspection.state || '—'}
            </span>
          </div>
        </td>
        <td className="py-3 px-3 text-center">
          <span
            className={`inline-flex min-w-[24px] items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium ${
              inspection.violationCount > 0
                ? 'bg-amber-100 text-amber-800'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {inspection.violationCount}
          </span>
        </td>
        <td className="py-3 px-3">
          <SeverityIndicator weight={inspection.totalSeverityWeight} />
        </td>
        <td className="py-3 px-3">
          <OosBadge oos={inspection.oos} />
        </td>
        <td className="py-3 px-3">
          {onViewReport && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onViewReport();
              }}
              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium text-indigo hover:bg-indigo/5 transition-colors"
              title="View Full Report"
            >
              <ExternalLink className="h-3 w-3" />
              <span className="hidden sm:inline">Report</span>
            </button>
          )}
        </td>
      </tr>

      {isExpanded && hasViolations && (
        <>
          <tr className="bg-slate-50">
            <td colSpan={6} className="py-1 pl-10 pr-4">
              <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-slate-400">
                <FileText className="h-3 w-3" />
                Violations Detail
              </div>
            </td>
          </tr>
          <tr className="bg-slate-50">
            <td colSpan={6} className="px-4 pb-3">
              <table className="w-full">
                <thead>
                  <tr className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                    <th className="py-1 pl-10 pr-3 text-left">CFR Code</th>
                    <th className="py-1 px-3 text-left">Description</th>
                    <th className="py-1 px-3 text-left">Severity</th>
                    <th className="py-1 px-3 text-center">Time Wt</th>
                    <th className="py-1 px-3 text-left">OOS</th>
                  </tr>
                </thead>
                <tbody>
                  {inspection.violations.map((v, idx) => (
                    <ViolationRow key={`${v.code}-${idx}`} violation={v} />
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        </>
      )}
    </>
  );
}

export function InspectionHistoryTable({
  inspections,
  basicPercentile,
  onInspectionClick,
}: InspectionHistoryTableProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const totalInspections = inspections.length;
  const oosInspections = inspections.filter((i) => i.oos).length;
  const totalViolations = inspections.reduce(
    (sum, i) => sum + (i.violations?.length || i.violationCount || 0),
    0
  );
  const oosRate =
    totalInspections > 0
      ? ((oosInspections / totalInspections) * 100).toFixed(1)
      : '0.0';

  return (
    <div>
      {/* Summary stats */}
      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Inspections</p>
          <p className="text-lg font-semibold text-slate-900">
            {totalInspections}
          </p>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-3">
          <p className="text-xs text-slate-500">Violations</p>
          <p className="text-lg font-semibold text-slate-900">
            {totalViolations}
          </p>
        </div>
        <div className="rounded-lg border border-red-100 bg-red-50 p-3">
          <p className="text-xs text-red-600">OOS Events</p>
          <p className="text-lg font-semibold text-red-700">
            {oosInspections}
          </p>
          <p className="text-[10px] text-red-500">{oosRate}% OOS rate</p>
        </div>
        {basicPercentile !== undefined && (
          <div
            className={`rounded-lg border p-3 ${
              basicPercentile >= 75
                ? 'border-red-100 bg-red-50'
                : basicPercentile >= 50
                  ? 'border-amber-100 bg-amber-50'
                  : 'border-emerald-100 bg-emerald-50'
            }`}
          >
            <p
              className={`text-xs ${
                basicPercentile >= 75
                  ? 'text-red-600'
                  : basicPercentile >= 50
                    ? 'text-amber-600'
                    : 'text-emerald-600'
              }`}
            >
              BASIC Percentile
            </p>
            <p
              className={`text-lg font-semibold ${
                basicPercentile >= 75
                  ? 'text-red-700'
                  : basicPercentile >= 50
                    ? 'text-amber-700'
                    : 'text-emerald-700'
              }`}
            >
              {basicPercentile}%
            </p>
          </div>
        )}
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
                <th className="py-3 pl-4 pr-3 text-left">Report #</th>
                <th className="py-3 px-3 text-left">Date</th>
                <th className="py-3 px-3 text-left">State</th>
                <th className="py-3 px-3 text-center">Violations</th>
                <th className="py-3 px-3 text-left">Severity</th>
                <th className="py-3 px-3 text-left">OOS</th>
                {onInspectionClick && <th className="py-3 px-3 text-left"></th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {inspections.map((insp) => {
                const key = insp.inspectionId || insp.reportNumber;
                return (
                  <InspectionRow
                    key={key}
                    inspection={insp}
                    isExpanded={expandedIds.has(key)}
                    onToggle={() => toggleExpanded(key)}
                    onViewReport={onInspectionClick ? () => onInspectionClick(insp) : undefined}
                  />
                );
              })}
            </tbody>
          </table>
        </div>

        {inspections.length === 0 && (
          <div className="py-8 text-center text-sm text-slate-500">
            No inspection records found for this carrier.
          </div>
        )}

        <div className="border-t border-slate-100 bg-slate-50 px-4 py-2">
          <p className="text-[10px] text-slate-400">
            Source: FMCSA Safety Measurement System (SMS) — Vehicle Maintenance
            BASIC. Click a row to expand violation details.
          </p>
        </div>
      </Card>
    </div>
  );
}
