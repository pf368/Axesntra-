'use client';

import { BasicPageLayout, type KpiDef } from './basic-page-layout';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { BasicPageData } from '@/lib/basic-data-adapter';
import type { CarrierBrief } from '@/lib/types';
import { MOCK_DRIVER_FITNESS_DRIVERS, MOCK_COACH_ACTIONS } from '@/lib/platform-mock-data';
import { AlertCircle } from 'lucide-react';

interface Props { basicData: BasicPageData; carrier: CarrierBrief; onBack: () => void; }

export function DriverFitnessPage({ basicData, carrier, onBack }: Props) {
  const critical = MOCK_DRIVER_FITNESS_DRIVERS.filter(d => d.status === 'critical');
  const expiring = MOCK_DRIVER_FITNESS_DRIVERS.filter(d => d.status === 'expiring');

  const kpis: KpiDef[] = [
    { label: 'BASIC Score', value: basicData.score.toFixed(1), subtext: `Threshold: ${basicData.threshold}`, status: basicData.isAbove ? 'danger' : 'good' },
    { label: 'Medical Expiring', value: expiring.length + critical.length, subtext: 'within 60 days', status: (expiring.length + critical.length) > 0 ? 'danger' : 'good' },
    { label: 'Drivers Flagged', value: basicData.topViolationCodes.filter(v => v.code.startsWith('391') || v.code.startsWith('383')).reduce((s, v) => s + v.count, 0), subtext: '391/383 violations', status: 'warning' },
    { label: 'OOS Events', value: basicData.oosCount, status: basicData.oosCount > 0 ? 'danger' : 'good' },
  ];

  return (
    <BasicPageLayout basicData={basicData} onBack={onBack} kpis={kpis}>
      {/* Critical Alerts */}
      {critical.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-red-700 mb-1">Critical: Medical Certificate Expiration</p>
            <p className="text-xs text-red-600">
              {critical.map(d => d.name).join(', ')} {critical.length === 1 ? 'has' : 'have'} expired or critically low medical certificate validity.
              Immediate action required to avoid disqualification.
            </p>
          </div>
        </div>
      )}

      {/* Driver Qualification Table */}
      <div className="bg-white rounded-xl border border-ax-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-ax-border">
          <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider">Driver Qualification Status</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-ax-surface-secondary border-b border-ax-border">
                {['Driver', 'CDL Number', 'Med Cert Expiry', 'Days Left', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 font-semibold text-ax-text-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ax-border-light">
              {MOCK_DRIVER_FITNESS_DRIVERS.map((driver) => (
                <tr key={driver.id} className="hover:bg-ax-surface-secondary transition-colors">
                  <td className="px-4 py-3 font-semibold text-ax-text">{driver.name}</td>
                  <td className="px-4 py-3 font-mono text-ax-text-secondary">{driver.cdl}</td>
                  <td className="px-4 py-3 font-mono text-ax-text-secondary">{driver.medCertExpiry}</td>
                  <td className={cn('px-4 py-3 font-mono font-bold', driver.daysLeft <= 30 ? 'text-red-600' : driver.daysLeft <= 90 ? 'text-amber-600' : 'text-ax-text')}>
                    {driver.daysLeft}d
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={driver.status === 'critical' ? 'danger' : driver.status === 'expiring' ? 'warning' : 'success'}>
                      {driver.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl border border-ax-border p-5">
        <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-4">Compliance Actions</p>
        <div className="space-y-2">
          {MOCK_COACH_ACTIONS.map((action, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-ax-surface-secondary rounded-lg">
              <span className={cn('h-1.5 w-1.5 rounded-full mt-1.5 shrink-0', i === 0 ? 'bg-red-500' : 'bg-ax-primary')} />
              <p className="text-xs text-ax-text">{action}</p>
            </div>
          ))}
        </div>
      </div>
    </BasicPageLayout>
  );
}
