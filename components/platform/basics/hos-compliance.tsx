'use client';

import { BasicPageLayout, type KpiDef } from './basic-page-layout';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { BasicPageData } from '@/lib/basic-data-adapter';
import type { CarrierBrief } from '@/lib/types';
import { MOCK_TERMINALS, MOCK_DRIVERS, MOCK_COACH_ACTIONS } from '@/lib/platform-mock-data';

interface Props { basicData: BasicPageData; carrier: CarrierBrief; onBack: () => void; }

export function HOSCompliancePage({ basicData, carrier, onBack }: Props) {
  const kpis: KpiDef[] = [
    { label: 'BASIC Score', value: basicData.score.toFixed(1), subtext: `Threshold: ${basicData.threshold}`, status: basicData.isAbove ? 'danger' : 'good' },
    { label: 'Log Violations', value: basicData.topViolationCodes.filter(v => v.code.startsWith('395')).reduce((s, v) => s + v.count, 0), subtext: '395 series', status: 'warning' },
    { label: 'Affected Drivers', value: MOCK_DRIVERS.length, subtext: 'with HOS flags', status: 'neutral' },
    { label: 'OOS Events', value: basicData.oosCount, status: basicData.oosCount > 0 ? 'danger' : 'good' },
  ];

  const rootCauseData = [
    { name: 'Logbook Errors', value: 42 },
    { name: '11-Hour Rule', value: 28 },
    { name: '14-Hour Rule', value: 18 },
    { name: 'Rest Break', value: 12 },
  ];

  return (
    <BasicPageLayout basicData={basicData} onBack={onBack} kpis={kpis}>
      {/* Terminal Contribution */}
      <div className="bg-white rounded-xl border border-ax-border p-5">
        <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-4">Terminal Contribution</p>
        <div className="space-y-3">
          {MOCK_TERMINALS.map((t) => (
            <div key={t.name} className="flex items-center gap-3">
              <span className="w-28 text-xs font-medium text-ax-text shrink-0">{t.name}</span>
              <div className="flex-1 h-2 bg-ax-border-light rounded-full overflow-hidden">
                <div className="h-full bg-ax-primary rounded-full" style={{ width: `${t.pct}%` }} />
              </div>
              <span className="w-8 text-right text-xs font-mono text-ax-text-secondary">{t.violations}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Root Cause Distribution */}
      <div className="bg-white rounded-xl border border-ax-border p-5">
        <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-4">Root Cause Distribution</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={rootCauseData} layout="vertical" margin={{ left: 0, right: 20 }}>
            <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={110} />
            <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8 }} />
            <Bar dataKey="value" radius={[0, 4, 4, 0]} fill="#4f39f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Action Center */}
      <div className="bg-white rounded-xl border border-ax-border p-5">
        <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-4">Recommended Actions</p>
        <div className="space-y-2">
          {MOCK_COACH_ACTIONS.map((action, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-ax-surface-secondary rounded-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-ax-primary mt-1.5 shrink-0" />
              <p className="text-xs text-ax-text">{action}</p>
            </div>
          ))}
        </div>
      </div>
    </BasicPageLayout>
  );
}
