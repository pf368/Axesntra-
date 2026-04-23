'use client';

import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ChevronUp, ChevronDown, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { InspectionWithViolations } from '@/lib/types';

const QUICK_FILTERS = ['All', 'OOS', 'High Violations', 'Recent (90d)'] as const;
type QuickFilter = typeof QUICK_FILTERS[number];

type SortKey = 'date' | 'state' | 'violations' | 'oos';
type SortDir = 'asc' | 'desc';

interface InspectionsPageProps {
  inspections: InspectionWithViolations[];
  basicPercentile?: number;
}

export function InspectionsPage({ inspections, basicPercentile }: InspectionsPageProps) {
  const [search, setSearch] = useState('');
  const [quickFilter, setQuickFilter] = useState<QuickFilter>('All');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedInspection, setSelectedInspection] = useState<InspectionWithViolations | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let data = [...inspections];

    if (search) {
      const q = search.toLowerCase();
      data = data.filter((i) =>
        i.reportNumber.toLowerCase().includes(q) ||
        i.state.toLowerCase().includes(q) ||
        i.violations.some((v) => v.code.toLowerCase().includes(q) || (v.description || '').toLowerCase().includes(q))
      );
    }

    if (quickFilter === 'OOS') data = data.filter((i) => i.oos);
    if (quickFilter === 'High Violations') data = data.filter((i) => i.violationCount >= 3);
    if (quickFilter === 'Recent (90d)') {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 90);
      data = data.filter((i) => new Date(i.inspectionDate) >= cutoff);
    }

    data.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'date') cmp = a.inspectionDate.localeCompare(b.inspectionDate);
      else if (sortKey === 'state') cmp = a.state.localeCompare(b.state);
      else if (sortKey === 'violations') cmp = a.violationCount - b.violationCount;
      else if (sortKey === 'oos') cmp = (a.oos ? 1 : 0) - (b.oos ? 1 : 0);
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return data;
  }, [inspections, search, quickFilter, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  }

  const SortIcon = ({ col }: { col: SortKey }) =>
    sortKey === col
      ? sortDir === 'asc' ? <ChevronUp className="h-3 w-3 text-ax-primary" /> : <ChevronDown className="h-3 w-3 text-ax-primary" />
      : <ChevronDown className="h-3 w-3 text-ax-text-muted opacity-50" />;

  const oosCount = inspections.filter(i => i.oos).length;

  return (
    <div className="flex-1 overflow-y-auto bg-ax-surface-secondary">
      {/* Header */}
      <div className="bg-white border-b border-ax-border px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-sm font-bold text-ax-text uppercase tracking-wide">Inspection History</h1>
            <p className="text-xs text-ax-text-muted">SMS inspection records with violation details from FMCSA</p>
          </div>
          <div className="flex items-center gap-3">
            {basicPercentile !== undefined && (
              <Badge variant="warning" className="text-xs">Percentile: {basicPercentile.toFixed(0)}%</Badge>
            )}
            <Badge variant="secondary" className="text-xs font-mono">{inspections.length} total</Badge>
            {oosCount > 0 && <Badge variant="danger" className="text-xs font-mono">{oosCount} OOS</Badge>}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Search + Filters Row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ax-text-muted" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by report, state, or code…"
              className="pl-9"
            />
          </div>

          {/* Quick filter pills */}
          <div className="flex items-center gap-1.5">
            {QUICK_FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setQuickFilter(f)}
                className={cn(
                  'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
                  quickFilter === f
                    ? 'bg-ax-primary text-white'
                    : 'bg-white border border-ax-border text-ax-text-secondary hover:border-ax-primary/30 hover:text-ax-text'
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-ax-border p-12 text-center">
            <p className="text-sm text-ax-text-muted">No inspections match your filters.</p>
            <button onClick={() => { setSearch(''); setQuickFilter('All'); }} className="mt-2 text-xs text-ax-primary hover:underline">
              Clear filters
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-ax-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-ax-surface-secondary border-b border-ax-border">
                    <SortableHeader label="Date" col="date" sortKey={sortKey} sortDir={sortDir} onToggle={toggleSort} />
                    <SortableHeader label="State" col="state" sortKey={sortKey} sortDir={sortDir} onToggle={toggleSort} />
                    <th className="text-left px-4 py-2.5 font-semibold text-ax-text-muted uppercase tracking-wider">Report #</th>
                    <SortableHeader label="Violations" col="violations" sortKey={sortKey} sortDir={sortDir} onToggle={toggleSort} />
                    <SortableHeader label="OOS" col="oos" sortKey={sortKey} sortDir={sortDir} onToggle={toggleSort} />
                    <th className="text-left px-4 py-2.5 font-semibold text-ax-text-muted uppercase tracking-wider">Top Violations</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-ax-border-light">
                  {filtered.map((insp) => (
                    <tr
                      key={insp.reportNumber}
                      className="hover:bg-ax-surface-secondary transition-colors cursor-pointer"
                      onClick={() => setSelectedInspection(insp)}
                    >
                      <td className="px-4 py-3 font-mono text-ax-text">{insp.inspectionDate}</td>
                      <td className="px-4 py-3 font-mono text-ax-text-secondary">{insp.state}</td>
                      <td className="px-4 py-3 font-mono text-ax-text-secondary">{insp.reportNumber}</td>
                      <td className="px-4 py-3">
                        <span className={cn('font-mono font-bold', insp.violationCount >= 3 ? 'text-red-600' : insp.violationCount >= 1 ? 'text-amber-600' : 'text-ax-text-secondary')}>
                          {insp.violationCount}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {insp.oos ? (
                          <Badge variant="danger" className="text-[10px]">OOS</Badge>
                        ) : (
                          <span className="text-ax-text-muted">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 max-w-[240px]">
                        <div className="flex flex-wrap gap-1">
                          {insp.violations.slice(0, 3).map((v, i) => (
                            <span key={i} className="font-mono text-[10px] bg-ax-border-light text-ax-text-secondary px-1.5 py-0.5 rounded">
                              {v.code}
                            </span>
                          ))}
                          {insp.violations.length > 3 && (
                            <span className="text-[10px] text-ax-text-muted">+{insp.violations.length - 3}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-ax-text-muted">›</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="h-16" />
      </div>

      {/* Detail Drawer */}
      <Sheet open={!!selectedInspection} onOpenChange={() => setSelectedInspection(null)}>
        <SheetContent side="right">
          {selectedInspection && (
            <>
              <SheetHeader>
                <SheetTitle>Inspection #{selectedInspection.reportNumber}</SheetTitle>
                <SheetDescription>{selectedInspection.inspectionDate} · {selectedInspection.state}</SheetDescription>
              </SheetHeader>

              <div className="px-6 py-4 space-y-5 overflow-y-auto h-[calc(100vh-120px)]">
                {/* Summary row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-ax-surface-secondary rounded-lg p-3 text-center">
                    <p className="text-lg font-bold font-mono text-ax-text">{selectedInspection.violationCount}</p>
                    <p className="text-[10px] text-ax-text-muted uppercase tracking-wider">Violations</p>
                  </div>
                  <div className="bg-ax-surface-secondary rounded-lg p-3 text-center">
                    <p className="text-lg font-bold font-mono text-ax-text">{selectedInspection.totalSeverityWeight?.toFixed(1) ?? '—'}</p>
                    <p className="text-[10px] text-ax-text-muted uppercase tracking-wider">Severity Wt.</p>
                  </div>
                  <div className={cn('rounded-lg p-3 text-center', selectedInspection.oos ? 'bg-red-50' : 'bg-emerald-50')}>
                    <p className={cn('text-lg font-bold', selectedInspection.oos ? 'text-red-600' : 'text-emerald-600')}>
                      {selectedInspection.oos ? 'OOS' : 'Pass'}
                    </p>
                    <p className="text-[10px] text-ax-text-muted uppercase tracking-wider">Result</p>
                  </div>
                </div>

                {/* Violations List */}
                <div>
                  <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-3">Violations</p>
                  <div className="space-y-2">
                    {selectedInspection.violations.map((v, i) => (
                      <div key={i} className="p-3 bg-ax-surface-secondary rounded-lg">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-ax-text">{v.code}</span>
                          <Badge variant={v.oos ? 'danger' : 'warning'} className="text-[10px] shrink-0">
                            {v.oos ? 'OOS' : 'Warning'}
                          </Badge>
                        </div>
                        <p className="text-xs text-ax-text-secondary">{v.description || 'See regulation text'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI Insight */}
                <div className="bg-ax-primary/5 border border-ax-primary/20 rounded-lg p-4">
                  <p className="text-xs font-semibold text-ax-primary mb-2">AI Insight</p>
                  <p className="text-xs text-ax-text-secondary leading-relaxed">
                    This inspection shows {selectedInspection.violationCount > 2 ? 'multiple violations across categories' : 'isolated violations'}.
                    {selectedInspection.oos ? ' The OOS result will carry increased BASIC weight for 24 months.' : ' No out-of-service result limits SMS impact.'}
                    {' '}Consider documenting corrective action taken to strengthen your compliance posture.
                  </p>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SortableHeader({
  label, col, sortKey, sortDir, onToggle,
}: {
  label: string;
  col: SortKey;
  sortKey: SortKey;
  sortDir: SortDir;
  onToggle: (col: SortKey) => void;
}) {
  const isActive = sortKey === col;
  return (
    <th className="text-left px-4 py-2.5">
      <button
        onClick={() => onToggle(col)}
        className={cn('flex items-center gap-1 font-semibold text-[10px] uppercase tracking-wider hover:text-ax-primary transition-colors', isActive ? 'text-ax-primary' : 'text-ax-text-muted')}
      >
        {label}
        {isActive
          ? sortDir === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />
          : <ChevronDown className="h-3 w-3 opacity-50" />}
      </button>
    </th>
  );
}
