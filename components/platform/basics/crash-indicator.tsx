'use client';

import { BasicPageLayout, type KpiDef } from './basic-page-layout';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { BasicPageData } from '@/lib/basic-data-adapter';
import type { CarrierBrief } from '@/lib/types';
import { MOCK_CRASH_HISTORY } from '@/lib/platform-mock-data';

interface Props { basicData: BasicPageData; carrier: CarrierBrief; onBack: () => void; }

export function CrashIndicatorPage({ basicData, carrier, onBack }: Props) {
  const fatal = MOCK_CRASH_HISTORY.filter(c => c.severity === 'Fatal').length;
  const injury = MOCK_CRASH_HISTORY.filter(c => c.severity === 'Injury').length;
  const towAway = MOCK_CRASH_HISTORY.filter(c => c.severity === 'Tow-Away').length;

  const kpis: KpiDef[] = [
    { label: 'BASIC Score', value: basicData.score.toFixed(1), subtext: `Threshold: ${basicData.threshold}`, status: basicData.isAbove ? 'danger' : 'good' },
    { label: 'Total Crashes', value: MOCK_CRASH_HISTORY.length, subtext: 'last 24 months', status: MOCK_CRASH_HISTORY.length > 2 ? 'danger' : 'warning' },
    { label: 'Injury Crashes', value: injury, status: injury > 0 ? 'danger' : 'good' },
    { label: 'Tow-Away', value: towAway, status: towAway > 1 ? 'warning' : 'good' },
  ];

  const severityData = [
    { name: 'Fatal', count: fatal, color: '#dc2626' },
    { name: 'Injury', count: injury, color: '#ea580c' },
    { name: 'Tow-Away', count: towAway, color: '#d97706' },
  ];

  return (
    <BasicPageLayout basicData={basicData} onBack={onBack} kpis={kpis}>
      {/* Severity Breakdown */}
      <div className="bg-white rounded-xl border border-ax-border p-5">
        <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-4">Crash Severity Breakdown</p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {severityData.map((s) => (
            <div key={s.name} className="text-center p-3 rounded-lg" style={{ background: `${s.color}10` }}>
              <p className="text-2xl font-bold font-mono" style={{ color: s.color }}>{s.count}</p>
              <p className="text-xs text-ax-text-secondary mt-1">{s.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Crash History Table */}
      <div className="bg-white rounded-xl border border-ax-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-ax-border">
          <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider">Crash History</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-ax-surface-secondary border-b border-ax-border">
                {['Date', 'State', 'Severity', 'Driver', 'Unit', 'Preventable'].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 font-semibold text-ax-text-muted uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ax-border-light">
              {MOCK_CRASH_HISTORY.map((crash) => (
                <tr key={crash.id} className="hover:bg-ax-surface-secondary">
                  <td className="px-4 py-3 font-mono text-ax-text">{crash.date}</td>
                  <td className="px-4 py-3 font-mono text-ax-text-secondary">{crash.state}</td>
                  <td className="px-4 py-3">
                    <Badge variant={crash.severity === 'Injury' ? 'danger' : 'warning'}>{crash.severity}</Badge>
                  </td>
                  <td className="px-4 py-3 text-ax-text">{crash.driver}</td>
                  <td className="px-4 py-3 text-ax-text-secondary">{crash.unit}</td>
                  <td className="px-4 py-3">
                    {crash.preventable === null ? (
                      <Badge variant="secondary">Pending Review</Badge>
                    ) : crash.preventable ? (
                      <Badge variant="danger">Preventable</Badge>
                    ) : (
                      <Badge variant="success">Not Preventable</Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl border border-ax-border p-5">
        <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-4">Crash Reduction Actions</p>
        <div className="space-y-2">
          {['File DataQ review for crashes classified as preventable', 'Implement defensive driving training program', 'Review onboard camera footage for pattern analysis', 'Audit route assignments for high-risk corridors'].map((action, i) => (
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
