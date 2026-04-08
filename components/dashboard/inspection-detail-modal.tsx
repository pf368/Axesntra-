'use client';

import { X, Sparkles, Printer } from 'lucide-react';
import { InspectionWithViolations, CarrierBrief } from '@/lib/types';
import { ViolationAiTooltip } from './violation-ai-tooltip';

interface InspectionDetailModalProps {
  inspection: InspectionWithViolations;
  carrierData: CarrierBrief;
  onClose: () => void;
}

export function InspectionDetailModal({
  inspection,
  carrierData,
  onClose,
}: InspectionDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4 pt-16">
      <div className="w-full max-w-3xl rounded-xl bg-surface-panel shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-on-surface/[0.06] px-6 py-4">
          <h2 className="text-sm font-bold text-foreground">
            Detailed Inspection Report as of {inspection.inspectionDate || 'N/A'}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
              title="Print"
            >
              <Printer className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Carrier Information + Time/Location */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-indigo/5 p-4">
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-indigo">
                Carrier Information
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Carrier Name:</span>
                  <span className="font-medium text-foreground">{carrierData.carrierName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">U.S. DOT#:</span>
                  <span className="font-mono font-medium text-foreground">{carrierData.usdot}</span>
                </div>
                {carrierData.mc && (
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">MC#:</span>
                    <span className="font-mono font-medium text-foreground">{carrierData.mc}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-lg bg-indigo/5 p-4">
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-indigo">
                Time / Location
              </h3>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Report #:</span>
                  <span className="font-mono font-medium text-foreground">{inspection.reportNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">State:</span>
                  <span className="font-medium text-foreground">{inspection.state}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-on-surface-variant">Date:</span>
                  <span className="font-medium text-foreground">{inspection.inspectionDate}</span>
                </div>
                {inspection.level && (
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Level:</span>
                    <span className="font-medium text-foreground">{inspection.level}</span>
                  </div>
                )}
                {inspection.facility && (
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Facility:</span>
                    <span className="font-medium text-foreground">{inspection.facility}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          {inspection.vehicles && inspection.vehicles.length > 0 && (
            <div>
              <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-indigo">
                Vehicle Information
              </h3>
              <div className="overflow-x-auto rounded-lg border border-on-surface/[0.06]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-surface-container">
                      <th className="px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Unit</th>
                      <th className="px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Type</th>
                      <th className="px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Make</th>
                      <th className="px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Plate State</th>
                      <th className="px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Plate #</th>
                      <th className="px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">VIN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspection.vehicles.map((v, i) => (
                      <tr key={i} className="border-t border-on-surface/[0.04]">
                        <td className="px-3 py-2 font-mono text-foreground">{v.unit}</td>
                        <td className="px-3 py-2 text-foreground">{v.type}</td>
                        <td className="px-3 py-2 font-mono text-foreground">{v.make}</td>
                        <td className="px-3 py-2 text-foreground">{v.plateState}</td>
                        <td className="px-3 py-2 font-mono text-foreground">{v.plateNumber}</td>
                        <td className="px-3 py-2 font-mono text-[10px] text-on-surface-variant">{v.vin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Carrier Violations */}
          <div>
            <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-indigo">
              Carrier Violations
            </h3>
            {inspection.violations.length > 0 ? (
              <div className="overflow-x-auto rounded-lg border border-on-surface/[0.06]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-surface-container">
                      <th className="px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Vio Code</th>
                      <th className="px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">OOS</th>
                      <th className="px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Description</th>
                      <th className="px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">BASIC</th>
                      <th className="px-3 py-2 text-left font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">Sev.</th>
                      <th className="px-3 py-2 text-center font-mono text-[10px] font-bold uppercase tracking-wider text-on-surface-variant">AI</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inspection.violations.map((v, i) => (
                      <tr key={i} className="border-t border-on-surface/[0.04]">
                        <td className="px-3 py-2 font-mono font-medium text-foreground whitespace-nowrap">{v.code}</td>
                        <td className="px-3 py-2">
                          {v.oos ? (
                            <span className="rounded bg-red-100 px-1.5 py-0.5 text-[10px] font-bold text-red-700">OOS</span>
                          ) : (
                            <span className="text-on-surface-variant">No</span>
                          )}
                        </td>
                        <td className="px-3 py-2 text-on-surface-variant max-w-[240px]">{v.description}</td>
                        <td className="px-3 py-2 text-on-surface-variant whitespace-nowrap">{v.basicCategory}</td>
                        <td className="px-3 py-2 font-mono text-foreground">{v.severityWeight || '—'}</td>
                        <td className="px-3 py-2 text-center">
                          <ViolationAiTooltip code={v.code} basicCategory={v.basicCategory} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-on-surface-variant">No violations recorded for this inspection.</p>
            )}
          </div>

          {/* AI Annotation Summary */}
          {inspection.violations.length > 0 && (
            <div className="rounded-lg bg-ai-teal/5 border border-ai-teal/10 p-4">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-ai-teal" />
                <span className="text-[10px] font-bold uppercase tracking-wider text-ai-teal">
                  AI Inspection Summary
                </span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                This inspection in {inspection.state} on {inspection.inspectionDate} recorded{' '}
                {inspection.violations.length} violation{inspection.violations.length !== 1 ? 's' : ''}{' '}
                with a total severity weight of {inspection.totalSeverityWeight}.
                {inspection.oos && ' The inspection resulted in an out-of-service order.'}
                {' '}Click the <Sparkles className="inline h-3 w-3 text-ai-teal" /> icon next to any violation for a detailed AI explanation of what it means and how to prevent it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
