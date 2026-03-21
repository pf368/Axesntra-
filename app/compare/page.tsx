'use client';

import { useEffect, useState, FormEvent, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { RiskBadge } from '@/components/risk-badge';
import { TrendBadge } from '@/components/trend-badge';
import { CarrierBrief } from '@/lib/types';
import { formatPercentage, formatDelta } from '@/lib/risk-utils';
import { ChevronLeft, Search, X, ArrowRightLeft, Loader2 } from 'lucide-react';

/* ─── helpers ───────────────────────────────────────────── */

type SlotState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'loaded'; data: CarrierBrief };

async function fetchCarrier(usdot: string): Promise<CarrierBrief> {
  const res = await fetch(`/api/carriers/${usdot}`);
  const json = await res.json();
  if (!json.data) throw new Error(json.error || 'Carrier not found');
  return json.data as CarrierBrief;
}

/* ─── sub-components ─────────────────────────────────────── */

function SearchSlot({
  label,
  slot,
  onLoad,
  onClear,
}: {
  label: string;
  slot: SlotState;
  onLoad: (usdot: string) => void;
  onClear: () => void;
}) {
  const [query, setQuery] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) onLoad(trimmed);
  }

  if (slot.status === 'loaded') {
    return (
      <div className="flex items-center gap-2 min-w-0">
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-0.5">{label}</p>
          <p className="text-sm font-semibold text-slate-900 truncate">{slot.data.carrierName}</p>
          <p className="text-xs text-slate-500">USDOT {slot.data.usdot}</p>
        </div>
        <button
          onClick={onClear}
          className="ml-2 shrink-0 p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label={`Clear ${label}`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="USDOT number…"
            className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <button
          type="submit"
          disabled={slot.status === 'loading'}
          className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 disabled:opacity-50 transition-colors"
        >
          {slot.status === 'loading' ? '…' : 'Load'}
        </button>
      </form>
      {slot.status === 'error' && (
        <p className="mt-1.5 text-xs text-red-600">{slot.message}</p>
      )}
    </div>
  );
}

/* ─── comparison table rows ─────────────────────────────── */

type RowDef =
  | { type: 'header'; label: string }
  | { type: 'badges'; label: string; aEl: React.ReactNode; bEl: React.ReactNode }
  | { type: 'text'; label: string; aVal: string | number; bVal: string | number; higherIsBetter?: boolean };

function buildRows(a: CarrierBrief, b: CarrierBrief): RowDef[] {
  const riskOrder: Record<string, number> = { Low: 0, Moderate: 1, Elevated: 2, Severe: 3 };
  const trendOrder: Record<string, number> = { Improving: 0, Stable: 1, Worsening: 2 };

  return [
    { type: 'header', label: 'Risk Profile' },
    { type: 'badges', label: 'Overall Risk', aEl: <RiskBadge risk={a.overallRisk} />, bEl: <RiskBadge risk={b.overallRisk} /> },
    { type: 'badges', label: 'Trend', aEl: <TrendBadge trend={a.trend} />, bEl: <TrendBadge trend={b.trend} /> },
    { type: 'text', label: 'Confidence', aVal: a.confidence, bVal: b.confidence },
    { type: 'text', label: 'Status', aVal: a.status, bVal: b.status },

    { type: 'header', label: 'Fleet Info' },
    { type: 'text', label: 'Power Units', aVal: a.powerUnits, bVal: b.powerUnits, higherIsBetter: undefined },
    { type: 'text', label: 'Drivers', aVal: a.drivers, bVal: b.drivers, higherIsBetter: undefined },
    { type: 'text', label: 'Operation Type', aVal: a.operationType, bVal: b.operationType },

    { type: 'header', label: 'Key Metrics' },
    {
      type: 'text', label: 'Overall OOS Rate', higherIsBetter: false,
      aVal: formatPercentage(a.metrics.overallOOS) + ` (${formatDelta(a.metrics.overallOOSDelta)} vs avg)`,
      bVal: formatPercentage(b.metrics.overallOOS) + ` (${formatDelta(b.metrics.overallOOSDelta)} vs avg)`,
    },
    {
      type: 'text', label: 'Vehicle OOS Rate', higherIsBetter: false,
      aVal: formatPercentage(a.metrics.vehicleOOS),
      bVal: formatPercentage(b.metrics.vehicleOOS),
    },
    {
      type: 'text', label: 'Driver OOS Rate', higherIsBetter: false,
      aVal: formatPercentage(a.metrics.driverOOS),
      bVal: formatPercentage(b.metrics.driverOOS),
    },
    {
      type: 'text', label: 'Crashes (24 mo)', higherIsBetter: false,
      aVal: a.metrics.crashes24mo,
      bVal: b.metrics.crashes24mo,
    },
    { type: 'text', label: 'BASIC Exposure', aVal: a.metrics.basicExposure, bVal: b.metrics.basicExposure },
    { type: 'text', label: 'MCS-150 Freshness', aVal: a.metrics.mcs150Freshness, bVal: b.metrics.mcs150Freshness },

    { type: 'header', label: 'Risk by Category' },
    { type: 'badges', label: 'Maintenance', aEl: <RiskBadge risk={a.riskChips.maintenance} size="sm" />, bEl: <RiskBadge risk={b.riskChips.maintenance} size="sm" /> },
    { type: 'badges', label: 'Crash', aEl: <RiskBadge risk={a.riskChips.crash} size="sm" />, bEl: <RiskBadge risk={b.riskChips.crash} size="sm" /> },
    { type: 'badges', label: 'Driver', aEl: <RiskBadge risk={a.riskChips.driver} size="sm" />, bEl: <RiskBadge risk={b.riskChips.driver} size="sm" /> },
    { type: 'badges', label: 'Hazmat', aEl: <RiskBadge risk={a.riskChips.hazmat} size="sm" />, bEl: <RiskBadge risk={b.riskChips.hazmat} size="sm" /> },
    { type: 'badges', label: 'Admin Freshness', aEl: <RiskBadge risk={a.riskChips.admin} size="sm" />, bEl: <RiskBadge risk={b.riskChips.admin} size="sm" /> },
  ];
}

/* ─── page ───────────────────────────────────────────────── */

function ComparePageInner() {
  const searchParams = useSearchParams();

  const [slotA, setSlotA] = useState<SlotState>({ status: 'idle' });
  const [slotB, setSlotB] = useState<SlotState>({ status: 'idle' });

  async function loadSlot(usdot: string, setter: (s: SlotState) => void) {
    setter({ status: 'loading' });
    try {
      const data = await fetchCarrier(usdot);
      setter({ status: 'loaded', data });
    } catch (e: unknown) {
      setter({ status: 'error', message: e instanceof Error ? e.message : 'Failed to load' });
    }
  }

  // Pre-load from query params (?a=USDOT1&b=USDOT2)
  const initA = searchParams.get('a');
  const initB = searchParams.get('b');
  useEffect(() => {
    if (initA) loadSlot(initA, setSlotA);
    if (initB) loadSlot(initB, setSlotB);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bothLoaded = slotA.status === 'loaded' && slotB.status === 'loaded';
  const rows = bothLoaded ? buildRows(
    (slotA as { status: 'loaded'; data: CarrierBrief }).data,
    (slotB as { status: 'loaded'; data: CarrierBrief }).data,
  ) : [];

  const dataA = slotA.status === 'loaded' ? slotA.data : null;
  const dataB = slotB.status === 'loaded' ? slotB.data : null;

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8 max-w-5xl">

        {/* ── back nav ── */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors mb-6">
          <ChevronLeft className="h-4 w-4" />
          Back to Search
        </Link>

        {/* ── header ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRightLeft className="h-5 w-5 text-slate-700" />
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Compare Carriers</h1>
          </div>
          <p className="text-slate-600 text-sm">Load two carriers to compare their risk profiles side by side.</p>
        </div>

        {/* ── carrier selectors ── */}
        <Card className="p-5 mb-8">
          <div className="grid sm:grid-cols-2 gap-6">
            <SearchSlot
              label="Carrier A"
              slot={slotA}
              onLoad={(usdot) => loadSlot(usdot, setSlotA)}
              onClear={() => setSlotA({ status: 'idle' })}
            />
            <SearchSlot
              label="Carrier B"
              slot={slotB}
              onLoad={(usdot) => loadSlot(usdot, setSlotB)}
              onClear={() => setSlotB({ status: 'idle' })}
            />
          </div>
        </Card>

        {/* ── comparison table ── */}
        {bothLoaded && dataA && dataB ? (
          <Card className="overflow-hidden">
            {/* sticky header row */}
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] text-sm">
                <thead>
                  <tr className="bg-slate-900 text-white">
                    <th className="px-5 py-4 text-left font-semibold text-slate-300 w-40">Metric</th>
                    <th className="px-5 py-4 text-left font-semibold">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Carrier A</p>
                        <p className="text-white truncate max-w-[180px]">{dataA.carrierName}</p>
                        <p className="text-xs text-slate-400">USDOT {dataA.usdot}</p>
                      </div>
                    </th>
                    <th className="px-5 py-4 text-left font-semibold">
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Carrier B</p>
                        <p className="text-white truncate max-w-[180px]">{dataB.carrierName}</p>
                        <p className="text-xs text-slate-400">USDOT {dataB.usdot}</p>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => {
                    if (row.type === 'header') {
                      return (
                        <tr key={i} className="bg-slate-100">
                          <td colSpan={3} className="px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-slate-500">
                            {row.label}
                          </td>
                        </tr>
                      );
                    }

                    if (row.type === 'badges') {
                      return (
                        <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/50">
                          <td className="px-5 py-3 text-slate-600 font-medium">{row.label}</td>
                          <td className="px-5 py-3">{row.aEl}</td>
                          <td className="px-5 py-3">{row.bEl}</td>
                        </tr>
                      );
                    }

                    // text row — highlight lower value when higherIsBetter=false for numeric fields
                    const aNum = typeof row.aVal === 'number' ? row.aVal : parseFloat(String(row.aVal));
                    const bNum = typeof row.bVal === 'number' ? row.bVal : parseFloat(String(row.bVal));
                    const canHighlight = row.higherIsBetter === false && !isNaN(aNum) && !isNaN(bNum) && aNum !== bNum;
                    const aWins = canHighlight && aNum < bNum;
                    const bWins = canHighlight && bNum < aNum;

                    return (
                      <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/50">
                        <td className="px-5 py-3 text-slate-600 font-medium">{row.label}</td>
                        <td className={`px-5 py-3 font-medium ${aWins ? 'text-emerald-700' : 'text-slate-900'}`}>
                          {row.aVal}
                        </td>
                        <td className={`px-5 py-3 font-medium ${bWins ? 'text-emerald-700' : 'text-slate-900'}`}>
                          {row.bVal}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* footer links */}
            <div className="bg-slate-50 border-t border-slate-200 px-5 py-4 flex flex-wrap gap-4 text-sm">
              <Link href={`/carrier/${dataA.usdot}`} className="text-sky-600 hover:text-sky-500 font-medium transition-colors">
                Full report: {dataA.carrierName} →
              </Link>
              <Link href={`/carrier/${dataB.usdot}`} className="text-sky-600 hover:text-sky-500 font-medium transition-colors">
                Full report: {dataB.carrierName} →
              </Link>
            </div>
          </Card>
        ) : (
          !bothLoaded && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-8 py-16 text-center text-slate-400">
              <ArrowRightLeft className="h-8 w-8 mx-auto mb-3 opacity-40" />
              <p className="font-medium text-slate-600">Load two carriers above to see the comparison</p>
              <p className="text-sm mt-1">Enter a USDOT number in each slot to get started</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="bg-slate-50 min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    }>
      <ComparePageInner />
    </Suspense>
  );
}
