'use client';

import { BasicPageLayout, type KpiDef } from './basic-page-layout';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { BasicPageData } from '@/lib/basic-data-adapter';
import type { CarrierBrief } from '@/lib/types';
import { MOCK_COACH_ACTIONS } from '@/lib/platform-mock-data';

interface Props { basicData: BasicPageData; carrier: CarrierBrief; onBack: () => void; }

export function ControlledSubstancesPage({ basicData, carrier, onBack }: Props) {
  const kpis: KpiDef[] = [
    { label: 'BASIC Score', value: basicData.score.toFixed(1), subtext: `Threshold: ${basicData.threshold}`, status: basicData.isAbove ? 'danger' : 'good' },
    { label: 'Drug Violations', value: basicData.topViolationCodes.filter(v => v.code.startsWith('382')).reduce((s, v) => s + v.count, 0), subtext: '382 series', status: 'warning' },
    { label: 'Inspections', value: basicData.inspectionCount, subtext: 'with 382 violations', status: 'neutral' },
    { label: 'OOS Events', value: basicData.oosCount, status: basicData.oosCount > 0 ? 'danger' : 'good' },
  ];

  const geoData = [
    { state: 'TX', count: 3 },
    { state: 'OH', count: 2 },
    { state: 'GA', count: 2 },
    { state: 'IL', count: 1 },
    { state: 'FL', count: 1 },
  ];

  return (
    <BasicPageLayout basicData={basicData} onBack={onBack} kpis={kpis}>
      {/* Low activity message */}
      {basicData.score < 20 && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-emerald-700 mb-1">Low Activity Category</p>
          <p className="text-xs text-emerald-600">
            This BASIC shows minimal violation activity. Maintain your current drug & alcohol testing program and pre-employment screening processes to keep this score low.
          </p>
        </div>
      )}

      {/* Geographic Distribution */}
      <div className="bg-white rounded-xl border border-ax-border p-5">
        <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-4">Geographic Distribution</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={geoData} layout="vertical" margin={{ left: 0, right: 20 }}>
            <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="state" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={30} />
            <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8 }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="#4f39f6" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl border border-ax-border p-5">
        <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-4">Preventive Actions</p>
        <div className="space-y-2">
          {['Maintain mandatory pre-employment drug screening', 'Enforce random testing program at minimum 50% annual rate', 'Document all negative test results in DQ files', 'Conduct supervisor reasonable suspicion training annually'].map((action, i) => (
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
