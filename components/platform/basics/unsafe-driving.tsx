'use client';

import { BasicPageLayout, type KpiDef } from './basic-page-layout';
import { KpiCard } from '@/components/platform/kpi-card';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { BasicPageData } from '@/lib/basic-data-adapter';
import type { CarrierBrief } from '@/lib/types';
import { MOCK_DRIVERS, MOCK_COACH_ACTIONS } from '@/lib/platform-mock-data';
import { Phone, ChevronRight } from 'lucide-react';

interface Props { basicData: BasicPageData; carrier: CarrierBrief; onBack: () => void; }

export function UnsafeDrivingPage({ basicData, carrier, onBack }: Props) {
  const [selectedDriver, setSelectedDriver] = useState<typeof MOCK_DRIVERS[0] | null>(null);

  const kpis: KpiDef[] = [
    { label: 'BASIC Score', value: basicData.score.toFixed(1), subtext: `Threshold: ${basicData.threshold}`, status: basicData.isAbove ? 'danger' : 'good' },
    { label: 'Speeding Violations', value: basicData.topViolationCodes.filter(v => v.code.startsWith('392')).reduce((s, v) => s + v.count, 0), subtext: '392 series', status: 'warning' },
    { label: 'OOS Events', value: basicData.oosCount, subtext: 'out-of-service', status: basicData.oosCount > 0 ? 'danger' : 'good' },
    { label: 'High-Risk Drivers', value: MOCK_DRIVERS.filter(d => d.severity === 'high').length, subtext: 'requiring attention', status: 'warning' },
  ];

  return (
    <BasicPageLayout basicData={basicData} onBack={onBack} kpis={kpis}>
      {/* Driver Risk Table */}
      <div className="bg-white rounded-xl border border-ax-border overflow-hidden">
        <div className="px-5 py-3.5 border-b border-ax-border">
          <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider">Driver Risk Analysis</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-ax-surface-secondary border-b border-ax-border">
                {['Driver', 'License', 'State', 'Violations', 'OOS', 'Last Violation', 'Risk', ''].map((h) => (
                  <th key={h} className="text-left px-4 py-2.5 font-semibold text-ax-text-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ax-border-light">
              {MOCK_DRIVERS.map((driver) => (
                <tr key={driver.id} className="hover:bg-ax-surface-secondary transition-colors cursor-pointer" onClick={() => setSelectedDriver(driver)}>
                  <td className="px-4 py-3 font-semibold text-ax-text">{driver.name}</td>
                  <td className="px-4 py-3 font-mono text-ax-text-secondary">{driver.license}</td>
                  <td className="px-4 py-3 text-ax-text-secondary font-mono">{driver.state}</td>
                  <td className="px-4 py-3 font-mono font-bold text-ax-text">{driver.violations}</td>
                  <td className="px-4 py-3">
                    {driver.oosCount > 0 ? <Badge variant="danger" className="text-[10px]">{driver.oosCount} OOS</Badge> : <span className="text-ax-text-muted">—</span>}
                  </td>
                  <td className="px-4 py-3 text-ax-text-secondary font-mono">{driver.lastViolation}</td>
                  <td className="px-4 py-3">
                    <Badge variant={driver.severity === 'high' ? 'danger' : driver.severity === 'medium' ? 'warning' : 'secondary'}>
                      {driver.severity}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <ChevronRight className="h-4 w-4 text-ax-text-muted" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Center */}
      <ActionCenter />

      {/* Driver Detail Drawer */}
      <Sheet open={!!selectedDriver} onOpenChange={() => setSelectedDriver(null)}>
        <SheetContent side="right">
          {selectedDriver && (
            <>
              <SheetHeader>
                <SheetTitle>{selectedDriver.name}</SheetTitle>
                <p className="text-xs text-ax-text-secondary font-mono">{selectedDriver.license} · {selectedDriver.state}</p>
              </SheetHeader>
              <div className="px-6 py-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <KpiCard label="Violations" value={selectedDriver.violations} status={selectedDriver.severity === 'high' ? 'danger' : 'warning'} />
                  <KpiCard label="OOS Count" value={selectedDriver.oosCount} status={selectedDriver.oosCount > 0 ? 'danger' : 'good'} />
                </div>
                <div className="bg-ax-surface-secondary rounded-lg p-4">
                  <p className="text-xs font-semibold text-ax-text mb-1">Contact</p>
                  <div className="flex items-center gap-2 text-sm text-ax-text-secondary">
                    <Phone className="h-3.5 w-3.5" />
                    {selectedDriver.contact}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-3">Coaching Actions</p>
                  <ul className="space-y-2">
                    {MOCK_COACH_ACTIONS.slice(0, 3).map((a, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-ax-text-secondary">
                        <span className="h-1.5 w-1.5 rounded-full bg-ax-primary mt-1.5 shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </BasicPageLayout>
  );
}

function ActionCenter() {
  return (
    <div className="bg-white rounded-xl border border-ax-border p-5">
      <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-4">Action Center</p>
      <div className="space-y-2">
        {MOCK_COACH_ACTIONS.map((action, i) => (
          <div key={i} className="flex items-start gap-3 p-3 bg-ax-surface-secondary rounded-lg hover:bg-ax-border-light transition-colors cursor-pointer">
            <span className={cn('h-1.5 w-1.5 rounded-full mt-1.5 shrink-0', i === 0 ? 'bg-red-500' : i === 1 ? 'bg-amber-500' : 'bg-ax-primary')} />
            <p className="text-xs text-ax-text">{action}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
