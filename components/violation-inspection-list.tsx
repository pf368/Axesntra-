'use client';

import { useState } from 'react';
import { ViolationOccurrence } from '@/lib/types';
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  MapPin,
  AlertTriangle,
  FileText,
} from 'lucide-react';

interface ViolationInspectionListProps {
  occurrences: ViolationOccurrence[];
  defaultVisible?: number;
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

function SeverityDot({ weight }: { weight: number }) {
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

function OccurrenceRow({ occurrence }: { occurrence: ViolationOccurrence }) {
  const [expanded, setExpanded] = useState(false);
  const v = occurrence.violation;

  return (
    <>
      <tr
        className={`cursor-pointer transition-colors hover:bg-slate-50 ${
          v.oos ? 'bg-red-50/40' : ''
        } ${expanded ? 'bg-slate-50' : ''}`}
        onClick={() => setExpanded(!expanded)}
      >
        <td className="py-2.5 pl-3 pr-2">
          {expanded ? (
            <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          )}
        </td>
        <td className="py-2.5 px-2">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3 w-3 text-slate-400" />
            <span className="text-xs text-slate-700">{occurrence.inspectionDate}</span>
          </div>
        </td>
        <td className="py-2.5 px-2">
          <span className="text-xs font-mono text-slate-700">{occurrence.reportNumber}</span>
        </td>
        <td className="py-2.5 px-2">
          <div className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-slate-400" />
            <span className="text-xs text-slate-700">{occurrence.state}</span>
          </div>
        </td>
        <td className="py-2.5 px-2">
          <SeverityDot weight={v.severityWeight} />
        </td>
        <td className="py-2.5 px-2 text-xs text-slate-500 text-center">
          {v.timeWeight || '—'}
        </td>
        <td className="py-2.5 px-2">
          <OosBadge oos={v.oos} />
        </td>
      </tr>

      {expanded && (
        <tr className="bg-slate-50">
          <td colSpan={7} className="px-3 pb-3 pt-1">
            <div className="ml-5 rounded-lg border border-slate-200 bg-white p-3">
              <div className="flex items-start gap-2">
                <FileText className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                <div>
                  <p className="text-xs font-medium text-slate-700">
                    <span className="font-mono">{v.code}</span> — {v.description}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-500">
                    Severity weight {v.severityWeight}
                    {v.oos ? ' + 2 OOS bonus' : ''} = {v.severityWeight + (v.oos ? 2 : 0)} total
                    {v.severityWeight >= 8 ? ' — well above average' : ''}
                    . Time weight: {v.timeWeight}.
                  </p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export function ViolationInspectionList({
  occurrences,
  defaultVisible = 3,
}: ViolationInspectionListProps) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? occurrences : occurrences.slice(0, defaultVisible);
  const hasMore = occurrences.length > defaultVisible;

  return (
    <div className="mt-4">
      <p className="mb-2 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-slate-400">
        <FileText className="h-3 w-3" />
        Related Inspections
      </p>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
              <th className="w-7 py-2 pl-3 pr-2" />
              <th className="py-2 px-2 text-left">Date</th>
              <th className="py-2 px-2 text-left">Report #</th>
              <th className="py-2 px-2 text-left">State</th>
              <th className="py-2 px-2 text-left">SW</th>
              <th className="py-2 px-2 text-center">TW</th>
              <th className="py-2 px-2 text-left">OOS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map((occ, idx) => (
              <OccurrenceRow key={`${occ.reportNumber}-${idx}`} occurrence={occ} />
            ))}
          </tbody>
        </table>

        {hasMore && (
          <div className="border-t border-slate-100 bg-slate-50 px-3 py-2">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs font-medium text-teal-700 hover:text-teal-900 transition-colors"
            >
              {showAll
                ? 'Show fewer'
                : `Show all ${occurrences.length} inspections`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
