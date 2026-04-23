'use client';

import { BasicPageLayout, type KpiDef } from './basic-page-layout';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { BasicPageData } from '@/lib/basic-data-adapter';
import type { CarrierBrief } from '@/lib/types';
import { MOCK_COACH_ACTIONS } from '@/lib/platform-mock-data';

interface Props { basicData: BasicPageData; carrier: CarrierBrief; onBack: () => void; }

export function HazardousMaterialsPage({ basicData, carrier, onBack }: Props) {
  const kpis: KpiDef[] = [
    { label: 'BASIC Score', value: basicData.score.toFixed(1), subtext: `Threshold: ${basicData.threshold}`, status: basicData.isAbove ? 'danger' : 'good' },
    { label: 'Hazmat Violations', value: basicData.topViolationCodes.reduce((s, v) => s + v.count, 0), subtext: '171-177 series', status: 'warning' },
    { label: 'Inspections', value: basicData.inspectionCount, subtext: 'with hazmat checks', status: 'neutral' },
    { label: 'OOS Events', value: basicData.oosCount, status: basicData.oosCount > 0 ? 'danger' : 'good' },
  ];

  const categoryData = [
    { name: 'Marking/Labeling', count: 14 },
    { name: 'Placarding', count: 11 },
    { name: 'Documentation', count: 9 },
    { name: 'Packaging', count: 6 },
    { name: 'Emergency Response', count: 4 },
  ];

  return (
    <BasicPageLayout basicData={basicData} onBack={onBack} kpis={kpis}>
      {/* Category Breakdown */}
      <div className="bg-white rounded-xl border border-ax-border p-5">
        <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-4">Violation Category Breakdown</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={categoryData} layout="vertical" margin={{ left: 0, right: 20 }}>
            <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#6b7280' }} axisLine={false} tickLine={false} width={130} />
            <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8 }} />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} fill="#f59e0b" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl border border-ax-border p-5">
        <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-4">Compliance Actions</p>
        <div className="space-y-2">
          {['Audit placarding compliance for all hazmat shipments', 'Update shipping paper templates and documentation', 'Conduct hazmat training for all drivers carrying regulated materials', 'Review packaging procedures for PHMSA compliance'].map((action, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-ax-surface-secondary rounded-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
              <p className="text-xs text-ax-text">{action}</p>
            </div>
          ))}
        </div>
      </div>
    </BasicPageLayout>
  );
}
