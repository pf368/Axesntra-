'use client';

import { ArrowLeft, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { cn } from '@/lib/utils';
import { Breadcrumb } from '@/components/platform/breadcrumb';
import { KpiCard } from '@/components/platform/kpi-card';
import { AiAnalysisPanel } from '@/components/platform/ai-analysis-panel';
import { ScoreBadge } from '@/components/platform/score-badge';
import { Badge } from '@/components/ui/badge';
import type { BasicPageData, ViolationSummary } from '@/lib/basic-data-adapter';
import type { InspectionWithViolations } from '@/lib/types';

interface BasicPageLayoutProps {
  basicData: BasicPageData;
  onBack: () => void;
  children?: React.ReactNode; // page-specific extras
  kpis?: KpiDef[];
}

export interface KpiDef {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  status?: 'good' | 'warning' | 'danger' | 'neutral';
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function BasicPageLayout({ basicData, onBack, children, kpis }: BasicPageLayoutProps) {
  const { basicName, score, threshold, isAbove, trend, topViolationCodes, inspectionCount, oosCount, relatedInspections } = basicData;

  const trendChartData = trend.map((v, i) => ({ month: MONTH_LABELS[i] ?? `M${i + 1}`, score: v, threshold }));

  const defaultKpis: KpiDef[] = [
    { label: 'BASIC Score', value: score.toFixed(1), subtext: `Threshold: ${threshold}`, status: isAbove ? 'danger' : 'good' },
    { label: 'Inspections', value: inspectionCount, subtext: 'in last 24 months', status: 'neutral' },
    { label: 'OOS Events', value: oosCount, subtext: 'out-of-service', status: oosCount > 0 ? 'warning' : 'good' },
    { label: 'Violations', value: topViolationCodes.reduce((s, v) => s + v.count, 0), subtext: 'total violations', status: 'neutral' },
  ];

  const displayKpis = kpis ?? defaultKpis;

  return (
    <div className="flex-1 overflow-y-auto bg-ax-surface-secondary">
      {/* Header */}
      <div className="bg-white border-b border-ax-border px-6 py-4 sticky top-0 z-10">
        <Breadcrumb
          items={[
            { label: 'Dashboard', onClick: onBack },
            { label: basicName },
          ]}
          className="mb-1"
        />
        <div className="flex items-center gap-3 mt-2">
          <h1 className="text-lg font-bold text-ax-text">{basicName}</h1>
          <ScoreBadge score={score} threshold={threshold} size="md" showLabel />
          {isAbove && (
            <div className="flex items-center gap-1.5 text-xs font-medium text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
              <AlertCircle className="h-3.5 w-3.5" />
              Exceeds threshold ({threshold})
            </div>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-7xl">
        {/* AI Analysis */}
        <AiAnalysisPanel basicName={basicName} score={score} threshold={threshold} />

        {/* KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {displayKpis.map((kpi, i) => (
            <KpiCard
              key={i}
              label={kpi.label}
              value={kpi.value}
              subtext={kpi.subtext}
              trend={kpi.trend}
              trendLabel={kpi.trendLabel}
              status={kpi.status}
            />
          ))}
        </div>

        {/* Trend Chart + Violation Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Score Trend */}
          <div className="bg-white rounded-xl border border-ax-border p-5">
            <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-4">Score Trend (12 months)</p>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={trendChartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8 }} />
                <Line
                  type="monotone"
                  dataKey="threshold"
                  stroke="#f59e0b"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  name="Threshold"
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#4f39f6"
                  strokeWidth={2}
                  dot={false}
                  name="Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Violations */}
          <ViolationBreakdown violations={topViolationCodes} />
        </div>

        {/* Inspection History */}
        {relatedInspections.length > 0 && (
          <InspectionHistoryMini inspections={relatedInspections} />
        )}

        {/* Page-specific content */}
        {children}

        <div className="h-16" />
      </div>
    </div>
  );
}

function ViolationBreakdown({ violations }: { violations: ViolationSummary[] }) {
  if (violations.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-ax-border p-5 flex items-center justify-center">
        <p className="text-sm text-ax-text-muted">No violations found for this BASIC</p>
      </div>
    );
  }

  const max = Math.max(...violations.map((v) => v.count), 1);

  return (
    <div className="bg-white rounded-xl border border-ax-border p-5">
      <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-4">Top Violation Codes</p>
      <div className="space-y-2.5">
        {violations.slice(0, 6).map((v) => (
          <div key={v.code} className="group">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-mono text-xs font-semibold text-ax-text shrink-0">{v.code}</span>
                <span className="text-xs text-ax-text-secondary truncate">{v.description}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge
                  variant={v.severity === 'OOS' ? 'danger' : v.severity === 'Critical' ? 'warning' : 'secondary'}
                  className="text-[10px]"
                >
                  {v.severity}
                </Badge>
                <span className="text-xs font-bold font-mono text-ax-text w-4 text-right">{v.count}</span>
              </div>
            </div>
            <div className="h-1.5 bg-ax-border-light rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-ax-primary transition-all"
                style={{ width: `${(v.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InspectionHistoryMini({ inspections }: { inspections: InspectionWithViolations[] }) {
  return (
    <div className="bg-white rounded-xl border border-ax-border overflow-hidden">
      <div className="px-5 py-3.5 border-b border-ax-border">
        <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider">
          Related Inspections ({inspections.length})
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-ax-surface-secondary border-b border-ax-border">
              <th className="text-left px-4 py-2.5 font-semibold text-ax-text-muted uppercase tracking-wider">Date</th>
              <th className="text-left px-4 py-2.5 font-semibold text-ax-text-muted uppercase tracking-wider">State</th>
              <th className="text-left px-4 py-2.5 font-semibold text-ax-text-muted uppercase tracking-wider">Report #</th>
              <th className="text-right px-4 py-2.5 font-semibold text-ax-text-muted uppercase tracking-wider">Violations</th>
              <th className="text-right px-4 py-2.5 font-semibold text-ax-text-muted uppercase tracking-wider">OOS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ax-border-light">
            {inspections.slice(0, 10).map((insp) => (
              <tr key={insp.reportNumber} className="hover:bg-ax-surface-secondary transition-colors">
                <td className="px-4 py-3 font-medium text-ax-text">{insp.inspectionDate}</td>
                <td className="px-4 py-3 text-ax-text-secondary font-mono">{insp.state}</td>
                <td className="px-4 py-3 font-mono text-ax-text-secondary">{insp.reportNumber}</td>
                <td className="px-4 py-3 text-right font-mono font-semibold text-ax-text">{insp.violationCount}</td>
                <td className="px-4 py-3 text-right">
                  {insp.oos ? (
                    <Badge variant="danger" className="text-[10px]">OOS</Badge>
                  ) : (
                    <span className="text-ax-text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
