'use client';

import { useState } from 'react';
import { BasicPageLayout, type KpiDef } from './basic-page-layout';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { KpiCard } from '@/components/platform/kpi-card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import type { BasicPageData } from '@/lib/basic-data-adapter';
import type { CarrierBrief } from '@/lib/types';
import { MOCK_UNITS, MOCK_VIOLATION_BREAKDOWN, MOCK_COACH_ACTIONS } from '@/lib/platform-mock-data';

interface Props { basicData: BasicPageData; carrier: CarrierBrief; onBack: () => void; }

export function VehicleMaintenancePage({ basicData, carrier, onBack }: Props) {
  const [selectedUnit, setSelectedUnit] = useState<typeof MOCK_UNITS[0] | null>(null);

  const kpis: KpiDef[] = [
    { label: 'BASIC Score', value: basicData.score.toFixed(1), subtext: `Threshold: ${basicData.threshold}`, status: basicData.isAbove ? 'danger' : 'good' },
    { label: 'Critical Units', value: MOCK_UNITS.filter(u => u.status === 'critical').length, subtext: 'requiring repair', status: 'danger' },
    { label: 'Lamp/Brake Violations', value: basicData.topViolationCodes.filter(v => v.code.startsWith('393')).reduce((s, v) => s + v.count, 0), subtext: '393 series', status: 'warning' },
    { label: 'OOS Events', value: basicData.oosCount, status: basicData.oosCount > 0 ? 'danger' : 'good' },
  ];

  const defectCategories = [
    { name: 'Brakes', value: 35, color: '#ef4444' },
    { name: 'Lights', value: 28, color: '#f59e0b' },
    { name: 'Tires', value: 18, color: '#4f39f6' },
    { name: 'Steering', value: 12, color: '#10b981' },
    { name: 'Other', value: 7, color: '#9ca3af' },
  ];

  return (
    <BasicPageLayout basicData={basicData} onBack={onBack} kpis={kpis}>
      {/* Unit Risk Table */}
      <div className="bg-white rounded-xl border border-ax-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-ax-border">
          <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider">Unit Risk Analysis</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-ax-surface-secondary border-b border-ax-border">
                {['Unit', 'VIN', 'Year / Make', 'Violations', 'OOS', 'Last Inspection', 'Status'].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 font-semibold text-ax-text-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ax-border-light">
              {MOCK_UNITS.map((unit) => (
                <tr key={unit.id} className="hover:bg-ax-surface-secondary transition-colors cursor-pointer" onClick={() => setSelectedUnit(unit)}>
                  <td className="px-4 py-3 font-semibold text-ax-text">{unit.unit}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ax-text-secondary">{unit.vin}</td>
                  <td className="px-4 py-3 text-ax-text-secondary">{unit.year} {unit.make}</td>
                  <td className="px-4 py-3 font-mono font-bold text-ax-text">{unit.violations}</td>
                  <td className="px-4 py-3">
                    {unit.oosCount > 0 ? <Badge variant="danger" className="text-[10px]">{unit.oosCount}</Badge> : <span className="text-ax-text-muted">—</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-ax-text-secondary">{unit.lastInspection}</td>
                  <td className="px-4 py-3">
                    <Badge variant={unit.status === 'critical' ? 'danger' : unit.status === 'warning' ? 'warning' : 'success'}>
                      {unit.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Defect Category Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-ax-border p-5">
          <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-4">Defect Category Breakdown</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={defectCategories} cx="50%" cy="50%" innerRadius={45} outerRadius={75} paddingAngle={2} dataKey="value">
                {defectCategories.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-ax-border p-5">
          <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-4">Recommended Actions</p>
          <div className="space-y-2">
            {MOCK_COACH_ACTIONS.map((action, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-ax-surface-secondary rounded-lg">
                <span className={cn('h-1.5 w-1.5 rounded-full mt-1.5 shrink-0', i === 0 ? 'bg-red-500' : 'bg-ax-primary')} />
                <p className="text-xs text-ax-text">{action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Unit Detail Drawer */}
      <Sheet open={!!selectedUnit} onOpenChange={() => setSelectedUnit(null)}>
        <SheetContent side="right">
          {selectedUnit && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedUnit.unit}</SheetTitle>
                <p className="text-xs text-ax-text-secondary font-mono">{selectedUnit.vin}</p>
              </SheetHeader>
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <KpiCard label="Violations" value={selectedUnit.violations} status={selectedUnit.status === 'critical' ? 'danger' : 'warning'} />
                  <KpiCard label="OOS Count" value={selectedUnit.oosCount} status={selectedUnit.oosCount > 0 ? 'danger' : 'good'} />
                </div>
                <div className="bg-ax-surface-secondary rounded-lg p-4">
                  <p className="text-xs font-semibold text-ax-text mb-2">Vehicle Details</p>
                  <dl className="space-y-1 text-xs">
                    <div className="flex justify-between"><dt className="text-ax-text-muted">Year/Make</dt><dd className="font-medium text-ax-text">{selectedUnit.year} {selectedUnit.make}</dd></div>
                    <div className="flex justify-between"><dt className="text-ax-text-muted">Last Inspection</dt><dd className="font-mono text-ax-text">{selectedUnit.lastInspection}</dd></div>
                  </dl>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </BasicPageLayout>
  );
}
