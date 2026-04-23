'use client';

import { BasicPageLayout, type KpiDef } from './basic-page-layout';
import { Badge } from '@/components/ui/badge';
import type { BasicPageData } from '@/lib/basic-data-adapter';
import type { CarrierBrief } from '@/lib/types';
import { MOCK_COACH_ACTIONS } from '@/lib/platform-mock-data';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props { basicData: BasicPageData; carrier: CarrierBrief; onBack: () => void; }

const SMS_PROGRAMS = [
  { label: 'Driver Qualification Files', status: 'ok' },
  { label: 'Drug & Alcohol Program', status: 'ok' },
  { label: 'Hours of Service Policy', status: 'warning' },
  { label: 'Vehicle Maintenance Program', status: 'warning' },
  { label: 'Hazmat Program (if applicable)', status: 'ok' },
  { label: 'Accident Register', status: 'ok' },
  { label: 'Safety Management System (SMS)', status: 'missing' },
  { label: 'Driver Training Records', status: 'warning' },
];

export function SafetyManagementPage({ basicData, carrier, onBack }: Props) {
  const kpis: KpiDef[] = [
    { label: 'BASIC Score', value: basicData.score.toFixed(1), subtext: `Threshold: ${basicData.threshold}`, status: basicData.isAbove ? 'danger' : 'good' },
    { label: 'Violations', value: basicData.topViolationCodes.reduce((s, v) => s + v.count, 0), subtext: 'total', status: 'warning' },
    { label: 'Programs Missing', value: SMS_PROGRAMS.filter(p => p.status === 'missing').length, subtext: 'compliance programs', status: 'danger' },
    { label: 'OOS Events', value: basicData.oosCount, status: basicData.oosCount > 0 ? 'danger' : 'good' },
  ];

  return (
    <BasicPageLayout basicData={basicData} onBack={onBack} kpis={kpis}>
      {/* Program Compliance Status */}
      <div className="bg-white rounded-xl border border-ax-border p-5">
        <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-4">Compliance Program Status</p>
        <div className="space-y-2">
          {SMS_PROGRAMS.map((program) => (
            <div key={program.label} className="flex items-center justify-between p-3 bg-ax-surface-secondary rounded-lg">
              <div className="flex items-center gap-2.5">
                {program.status === 'ok' ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 shrink-0" />
                )}
                <span className="text-xs font-medium text-ax-text">{program.label}</span>
              </div>
              <Badge variant={program.status === 'ok' ? 'success' : program.status === 'warning' ? 'warning' : 'danger'}>
                {program.status === 'ok' ? 'Compliant' : program.status === 'warning' ? 'Needs Update' : 'Missing'}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-xl border border-ax-border p-5">
        <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-4">Corrective Actions</p>
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
