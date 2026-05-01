'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Filter,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Search,
  Download,
  Sparkles,
  MapPin,
  User,
  Truck,
  Clock,
  MessageSquare,
  Check,
  X,
  FileText,
  Hash,
  ClipboardList,
  Building2,
  AlertTriangle,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { FEATURES } from '@/config/features';
import type { RichInspection } from '@/lib/types';
import type { InspectionKPIs } from '@/hooks/useCarrierInspections';

// ─── Types ─────────────────────────────────────────────────────────────────────

type SortField = 'date' | 'driverName' | 'vehicleMake' | 'violations' | 'severityScore';
type SortDir = 'asc' | 'desc';

// ─── Props ─────────────────────────────────────────────────────────────────────

interface InspectionsPageProps {
  inspections: RichInspection[];
  kpis: InspectionKPIs;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

const formatDate = (d: string) => {
  const dt = new Date(d + 'T00:00:00');
  return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const toggleArr = (arr: string[], val: string): string[] =>
  arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

// ─── Small Badge Components ────────────────────────────────────────────────────

const LevelBadge = ({ level }: { level: string }) => (
  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold bg-[#f1f5f9] text-[#475569] border border-[#e2e8f0] shrink-0">
    {level}
  </span>
);

const StatusBadge = ({ status }: { status: string }) => {
  const cfg: Record<string, string> = {
    'New':         'bg-[#eff6ff] text-[#1d4ed8] border-[#bfdbfe]',
    'In Progress': 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]',
    'Resolved':    'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]',
  };
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${cfg[status] ?? ''}`}>
      {status}
    </span>
  );
};

const SeverityBadge = ({ score }: { score: number }) => {
  const color  = score >= 7 ? '#ef4444' : score >= 4 ? '#f59e0b' : '#10b981';
  const bg     = score >= 7 ? '#fef2f2' : score >= 4 ? '#fffbeb' : '#f0fdf4';
  const border = score >= 7 ? '#fecaca' : score >= 4 ? '#fde68a' : '#bbf7d0';
  return (
    <span
      className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border-2 shrink-0"
      style={{ color, backgroundColor: bg, borderColor: border }}
    >
      {score}
    </span>
  );
};

// ─── FilterSection ─────────────────────────────────────────────────────────────

function FilterSection({ title, children, defaultOpen = true }: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-2 text-[10px] font-semibold text-[#94a3b8] uppercase tracking-widest hover:text-[#64748b] transition-colors"
      >
        {title}
        {open ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
      </button>
      {open && <div className="mt-2 space-y-2">{children}</div>}
    </div>
  );
}

// ─── CheckItem ────────────────────────────────────────────────────────────────

function CheckItem({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group select-none">
      <div
        role="checkbox"
        aria-checked={checked}
        tabIndex={0}
        onClick={onChange}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onChange(); } }}
        className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-all focus:outline-none focus:ring-2 focus:ring-[#4f39f6]/40 ${
          checked ? 'bg-[#4f39f6] border-[#4f39f6]' : 'border-[#d1d5db] group-hover:border-[#4f39f6]'
        }`}
      >
        {checked && <Check className="w-2.5 h-2.5 text-white" />}
      </div>
      <span className="text-sm text-[#374151] group-hover:text-[#0f172b] transition-colors">{label}</span>
    </label>
  );
}

// ─── FilterToggle ─────────────────────────────────────────────────────────────

function FilterToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-[#374151]">{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`w-9 h-5 rounded-full relative transition-colors shrink-0 focus:outline-none focus:ring-2 focus:ring-[#4f39f6]/40 ${checked ? 'bg-[#4f39f6]' : 'bg-[#e5e7eb]'}`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
            checked ? 'translate-x-4' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

// ─── Detail Drawer ─────────────────────────────────────────────────────────────

function DetailDrawer({ inspection, onClose }: { inspection: RichInspection; onClose: () => void }) {
  const [moreOpen, setMoreOpen] = useState(false);

  return (
    <AnimatePresence>
      <>
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/20 z-[70]"
          onClick={onClose}
        />

        <motion.div
          key="drawer"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 340, damping: 32 }}
          className="fixed top-0 right-0 h-screen w-[600px] bg-white shadow-2xl z-[80] flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Inspection Details"
        >
          {/* Fixed Header */}
          <div className="shrink-0 px-6 pt-6 pb-4 border-b border-[#e5e7eb] bg-white">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3 min-w-0">
                <h2 className="text-base font-semibold text-[#0f172b] shrink-0">Inspection Details</h2>
                <LevelBadge level={inspection.level} />
                <span className="text-sm text-[#64748b]">{formatDate(inspection.date)}</span>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg hover:bg-[#f1f5f9] text-[#64748b] hover:text-[#0f172b] transition-colors shrink-0 ml-3 focus:outline-none focus:ring-2 focus:ring-[#4f39f6]/40"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-8 gap-y-3.5">
              {[
                { Icon: User,         label: 'Driver',        value: inspection.driverName,                                              mono: false },
                { Icon: MapPin,       label: 'Location',      value: `${inspection.location.city}, ${inspection.location.state}`,       mono: false },
                { Icon: Hash,         label: 'VIN',           value: inspection.vin,                                                     mono: true  },
                { Icon: ClipboardList,label: 'Type',          value: inspection.type,                                                    mono: false },
                { Icon: Truck,        label: 'Vehicle Make',  value: inspection.vehicleMake,                                             mono: false },
                { Icon: Truck,        label: 'Vehicle Model', value: `${inspection.vehicleModel} (${inspection.vehicleYear})`,           mono: false },
              ].map(({ Icon, label, value, mono }) => (
                <div key={label} className="flex items-start gap-2.5">
                  <Icon className="w-3.5 h-3.5 text-[#94a3b8] mt-1 shrink-0" />
                  <div className="min-w-0">
                    <div className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider leading-none mb-1">{label}</div>
                    <div
                      className="text-sm text-[#0f172b] truncate"
                      style={mono ? { fontFamily: 'JetBrains Mono, monospace', fontSize: 11 } : {}}
                    >
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setMoreOpen(!moreOpen)}
              aria-expanded={moreOpen}
              className="mt-4 flex items-center gap-1.5 text-xs font-medium text-[#4f39f6] hover:text-[#4338ca] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4f39f6]/40 rounded"
            >
              {moreOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {moreOpen ? 'Hide Details' : 'More Details'}
            </button>

            <AnimatePresence>
              {moreOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 pt-3 border-t border-[#f1f5f9] grid grid-cols-2 gap-x-8 gap-y-3.5">
                    {[
                      { Icon: Hash,         label: 'Plate Number', value: inspection.plateNumber, mono: true  },
                      { Icon: MapPin,       label: 'Plate State',  value: inspection.plateState,  mono: false },
                      { Icon: FileText,     label: 'Report #',     value: inspection.reportNumber, mono: true  },
                      { Icon: MapPin,       label: 'Report State', value: inspection.reportState,  mono: false },
                      { Icon: Clock,        label: 'Start Time',   value: inspection.startTime,    mono: true  },
                      { Icon: Clock,        label: 'End Time',     value: inspection.endTime,      mono: true  },
                    ].map(({ Icon, label, value, mono }) => (
                      <div key={label} className="flex items-start gap-2.5">
                        <Icon className="w-3.5 h-3.5 text-[#94a3b8] mt-1 shrink-0" />
                        <div className="min-w-0">
                          <div className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider leading-none mb-1">{label}</div>
                          <div
                            className="text-sm text-[#0f172b]"
                            style={mono ? { fontFamily: 'JetBrains Mono, monospace', fontSize: 11 } : {}}
                          >
                            {value}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="col-span-2 flex items-start gap-2.5">
                      <Building2 className="w-3.5 h-3.5 text-[#94a3b8] mt-1 shrink-0" />
                      <div>
                        <div className="text-[10px] font-semibold text-[#94a3b8] uppercase tracking-wider leading-none mb-1">Facility</div>
                        <div className="text-sm text-[#0f172b]">{inspection.facility}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
            {inspection.aiInsights.length > 0 && (
              <div
                className="rounded-xl border border-[#ede9fe] p-5"
                style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%)' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-lg bg-[#4f39f6] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#4338ca]">AI Insights</h3>
                </div>
                <div className="space-y-4">
                  {inspection.aiInsights.map((insight, i) => {
                    const riskCfg: Record<string, string> = {
                      High:   'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]',
                      Medium: 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]',
                      Low:    'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]',
                    };
                    return (
                      <div key={i} className="bg-white/80 rounded-lg p-4 border border-[#ede9fe]">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span className="text-sm font-semibold text-[#1e1b4b]">{insight.label}</span>
                          <span className={`px-1.5 py-0.5 rounded text-xs font-medium border ${riskCfg[insight.riskLevel]}`}>
                            {insight.riskLevel} Risk
                          </span>
                        </div>
                        <p className="text-sm text-[#4b5563] mb-3 leading-relaxed">{insight.description}</p>
                        <div>
                          <div className="text-[10px] font-semibold text-[#6d28d9] uppercase tracking-wider mb-2">Suggested Actions</div>
                          <ul className="space-y-1.5">
                            {insight.suggestedActions.map((action, j) => (
                              <li key={j} className="flex items-start gap-2 text-sm text-[#374151]">
                                <Check className="w-3.5 h-3.5 text-[#4f39f6] mt-0.5 shrink-0" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-semibold text-[#0f172b] mb-3">
                Violations ({inspection.violations.length})
              </h3>
              <div className="space-y-3">
                {inspection.violations.map((v, i) => {
                  const sevCfg: Record<string, string> = {
                    Critical: 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]',
                    Major:    'bg-[#fffbeb] text-[#92400e] border-[#fde68a]',
                    Minor:    'bg-[#f0fdf4] text-[#166534] border-[#bbf7d0]',
                  };
                  return (
                    <div key={i} className="bg-[#f9fafb] rounded-lg border border-[#e5e7eb] p-4">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className="text-xs font-semibold text-[#4f39f6] bg-[#f5f3ff] px-2 py-0.5 rounded border border-[#ede9fe]"
                          style={{ fontFamily: 'JetBrains Mono, monospace' }}
                        >
                          {v.code}
                        </span>
                        {v.oos && (
                          <span className="text-xs font-bold text-white bg-[#dc2626] px-2 py-0.5 rounded">OOS</span>
                        )}
                      </div>
                      <p className="text-sm text-[#374151] mb-3 leading-relaxed">{v.description}</p>
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium border ${sevCfg[v.severity]}`}>
                          {v.severity}
                        </span>
                        <span className="text-xs text-[#475569] bg-[#f1f5f9] px-2 py-0.5 rounded border border-[#e2e8f0]">
                          {v.basicCategory}
                        </span>
                        <span className="text-xs text-[#6b7280]">
                          Time Weight: <span className="font-semibold text-[#374151]">{v.timeWeight}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {inspection.notes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-[#64748b]" />
                  <h3 className="text-sm font-semibold text-[#0f172b]">Notes</h3>
                </div>
                <div className="space-y-2">
                  {inspection.notes.map((note, i) => (
                    <div key={i} className="bg-[#f8fafc] rounded-lg border border-[#e5e7eb] px-4 py-3 text-sm text-[#374151] leading-relaxed">
                      {note}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fixed Footer — actions hidden when feature flags are off */}
          {(FEATURES.featureAssignTask || FEATURES.featureMarkReviewed || FEATURES.featureAddNote) && (
            <div className="shrink-0 px-6 py-4 border-t border-[#e5e7eb] bg-white space-y-2.5">
              {(FEATURES.featureAssignTask || FEATURES.featureMarkReviewed) && (
                <div className="grid grid-cols-2 gap-3">
                  {FEATURES.featureAssignTask && (
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#4f39f6] hover:bg-[#4338ca] text-white rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#4f39f6]/40">
                      <ClipboardList className="w-4 h-4" />
                      Assign Task
                    </button>
                  )}
                  {FEATURES.featureMarkReviewed && (
                    <button className="flex items-center justify-center gap-2 px-4 py-2.5 border border-[#e5e7eb] rounded-lg text-sm font-medium text-[#374151] hover:bg-[#f8fafc] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4f39f6]/40">
                      <Check className="w-4 h-4" />
                      Mark as Reviewed
                    </button>
                  )}
                </div>
              )}
              {FEATURES.featureAddNote && (
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-[#4f39f6] hover:bg-[#f5f3ff] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#4f39f6]/40">
                  <MessageSquare className="w-4 h-4" />
                  Add Note
                </button>
              )}
            </div>
          )}
        </motion.div>
      </>
    </AnimatePresence>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function InspectionsPage({ inspections, kpis }: InspectionsPageProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedInspection, setSelectedInspection] = useState<RichInspection | null>(null);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeQuickFilter, setActiveQuickFilter] = useState<string | null>(null);
  const [savedViewsOpen, setSavedViewsOpen] = useState(false);

  const [filterLevels, setFilterLevels] = useState<string[]>([]);
  const [filterTypes, setFilterTypes] = useState<string[]>([]);
  const [filterStates, setFilterStates] = useState<string[]>([]);
  const [filterDriverOOS, setFilterDriverOOS] = useState(false);
  const [filterVehicleOOS, setFilterVehicleOOS] = useState(false);
  const [filterSeverities, setFilterSeverities] = useState<string[]>([]);
  const [filterAINeedsAttention, setFilterAINeedsAttention] = useState(false);
  const [filterAIRepeatViolations, setFilterAIRepeatViolations] = useState(false);
  const [filterStatuses, setFilterStatuses] = useState<string[]>([]);

  const activeFilterCount =
    filterLevels.length + filterTypes.length + filterStates.length +
    (filterDriverOOS ? 1 : 0) + (filterVehicleOOS ? 1 : 0) +
    filterSeverities.length + (filterAINeedsAttention ? 1 : 0) +
    (filterAIRepeatViolations ? 1 : 0) + filterStatuses.length;

  const clearAllFilters = () => {
    setFilterLevels([]); setFilterTypes([]); setFilterStates([]);
    setFilterDriverOOS(false); setFilterVehicleOOS(false);
    setFilterSeverities([]); setFilterAINeedsAttention(false);
    setFilterAIRepeatViolations(false); setFilterStatuses([]);
    setSearchQuery(''); setActiveQuickFilter(null);
  };

  // KPI tiles use pre-computed counts from useCarrierInspections (always show unfiltered totals)
  const quickFilters = useMemo(() => [
    { label: 'High Risk',        count: kpis.highRisk    },
    { label: 'OOS',              count: kpis.oos         },
    { label: 'Needs Review',     count: kpis.needsReview },
    { label: 'Repeat Violations',count: kpis.repeat      },
    { label: 'Clean Inspections',count: kpis.clean       },
  ], [kpis]);

  // Derive unique states from actual carrier inspections for the filter sidebar
  const availableStates = useMemo(
    () => Array.from(new Set(inspections.map(i => i.location.state))).sort(),
    [inspections]
  );

  const filteredAndSorted = useMemo(() => {
    let data = [...inspections];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(i =>
        i.driverName.toLowerCase().includes(q) ||
        i.vin.toLowerCase().includes(q) ||
        i.location.city.toLowerCase().includes(q) ||
        i.location.state.toLowerCase().includes(q) ||
        i.violations.some(v => v.code.toLowerCase().includes(q)) ||
        i.vehicleMake.toLowerCase().includes(q) ||
        i.vehicleModel.toLowerCase().includes(q)
      );
    }

    if (filterLevels.length > 0)       data = data.filter(i => filterLevels.includes(i.level));
    if (filterTypes.length > 0)        data = data.filter(i => filterTypes.includes(i.type));
    if (filterStates.length > 0)       data = data.filter(i => filterStates.includes(i.location.state));
    if (filterDriverOOS)               data = data.filter(i => i.driverOOS);
    if (filterVehicleOOS)              data = data.filter(i => i.vehicleOOS);
    if (filterSeverities.length > 0)
      data = data.filter(i => i.violations.some(v => filterSeverities.includes(v.severity)));
    if (filterAINeedsAttention)        data = data.filter(i => i.aiInsights.length > 0);
    if (filterAIRepeatViolations)
      data = data.filter(i => i.aiInsights.some(a => a.type === 'repeat-violation'));
    if (filterStatuses.length > 0)     data = data.filter(i => filterStatuses.includes(i.status));

    if (activeQuickFilter === 'High Risk')
      data = data.filter(i => i.severityScore >= 7);
    else if (activeQuickFilter === 'OOS')
      data = data.filter(i => i.driverOOS || i.vehicleOOS);
    else if (activeQuickFilter === 'Needs Review')
      data = data.filter(i => i.status === 'New');
    else if (activeQuickFilter === 'Repeat Violations')
      data = data.filter(i => i.aiInsights.some(a => a.type === 'repeat-violation'));
    else if (activeQuickFilter === 'Clean Inspections')
      data = data.filter(i => i.severityScore <= 3);

    data.sort((a, b) => {
      let valA: string | number, valB: string | number;
      switch (sortField) {
        case 'date':          valA = a.date;             valB = b.date;             break;
        case 'driverName':    valA = a.driverName;       valB = b.driverName;       break;
        case 'vehicleMake':   valA = a.vehicleMake;      valB = b.vehicleMake;      break;
        case 'violations':    valA = a.violations.length;valB = b.violations.length;break;
        case 'severityScore': valA = a.severityScore;    valB = b.severityScore;    break;
        default:              valA = a.date;             valB = b.date;
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return data;
  }, [
    inspections, searchQuery, filterLevels, filterTypes, filterStates,
    filterDriverOOS, filterVehicleOOS, filterSeverities,
    filterAINeedsAttention, filterAIRepeatViolations, filterStatuses,
    activeQuickFilter, sortField, sortDir,
  ]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronDown className="w-3 h-3 text-[#d1d5db]" />;
    return sortDir === 'asc'
      ? <ChevronUp className="w-3 h-3 text-[#4f39f6]" />
      : <ChevronDown className="w-3 h-3 text-[#4f39f6]" />;
  };

  const columns: { key: string; label: string; sortField?: SortField; width?: string }[] = [
    { key: 'date',     label: 'Date',       sortField: 'date',          width: 'w-28' },
    { key: 'level',    label: 'Level',                                   width: 'w-16' },
    { key: 'location', label: 'Location',                                width: 'w-36' },
    { key: 'driver',   label: 'Driver',     sortField: 'driverName',    width: 'w-36' },
    { key: 'vehicle',  label: 'Vehicle',    sortField: 'vehicleMake',   width: 'w-44' },
    { key: 'viol',     label: 'Violations', sortField: 'violations',    width: 'w-24' },
    { key: 'oos',      label: 'OOS',                                     width: 'w-24' },
    { key: 'severity', label: 'Severity',   sortField: 'severityScore', width: 'w-20' },
    { key: 'ai',       label: 'AI Insights',                             width: 'w-36' },
    { key: 'status',   label: 'Status',                                  width: 'w-28' },
  ];

  return (
    <div className="h-full overflow-hidden flex">
      {/* Left Filter Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="shrink-0 overflow-hidden border-r border-[#e5e7eb] bg-white"
      >
        <div className="w-[280px] h-full flex flex-col">
          <div className="shrink-0 px-4 py-4 border-b border-[#e5e7eb] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#64748b]" />
              <span className="text-sm font-semibold text-[#0f172b]">Filters</span>
              {activeFilterCount > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#4f39f6] text-white rounded-full leading-none">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {activeFilterCount > 0 && (
                <button onClick={clearAllFilters} className="text-[11px] text-[#4f39f6] hover:text-[#4338ca] font-medium transition-colors">
                  Clear all
                </button>
              )}
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 rounded hover:bg-[#f1f5f9] text-[#94a3b8] hover:text-[#64748b] transition-colors"
                aria-label="Close filters"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
            <FilterSection title="Inspection Filters">
              <div className="mb-3">
                <div className="text-xs font-medium text-[#64748b] mb-2">Inspection Level</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {['I', 'II', 'III', 'IV', 'V', 'VI'].map(l => (
                    <CheckItem key={l} label={`Lvl ${l}`} checked={filterLevels.includes(l)} onChange={() => setFilterLevels(prev => toggleArr(prev, l))} />
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-[#64748b] mb-2">Inspection Type</div>
                <div className="space-y-2">
                  {['Roadside', 'Compliance', 'Follow-up'].map(t => (
                    <CheckItem key={t} label={t} checked={filterTypes.includes(t)} onChange={() => setFilterTypes(prev => toggleArr(prev, t))} />
                  ))}
                </div>
              </div>
            </FilterSection>

            <FilterSection title="Entity Filters">
              <div className="text-xs font-medium text-[#64748b] mb-2">Location / State</div>
              <div className="space-y-2">
                {availableStates.map(s => (
                  <CheckItem key={s} label={s} checked={filterStates.includes(s)} onChange={() => setFilterStates(prev => toggleArr(prev, s))} />
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Safety & Risk">
              <div className="space-y-3 mb-3">
                <FilterToggle label="Driver OOS"  checked={filterDriverOOS}  onChange={() => setFilterDriverOOS(p => !p)}  />
                <FilterToggle label="Vehicle OOS" checked={filterVehicleOOS} onChange={() => setFilterVehicleOOS(p => !p)} />
              </div>
              <div className="text-xs font-medium text-[#64748b] mb-2">Violation Severity</div>
              <div className="space-y-2">
                {['Critical', 'Major', 'Minor'].map(sev => (
                  <CheckItem key={sev} label={sev} checked={filterSeverities.includes(sev)} onChange={() => setFilterSeverities(prev => toggleArr(prev, sev))} />
                ))}
              </div>
            </FilterSection>

            <div
              className="rounded-xl p-4 border border-[#ede9fe] space-y-3"
              style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-[#4f39f6] flex items-center justify-center shrink-0">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-[10px] font-semibold text-[#6d28d9] uppercase tracking-widest">AI Insights</span>
              </div>
              <div className="space-y-2">
                <CheckItem label="Needs Attention"  checked={filterAINeedsAttention}   onChange={() => setFilterAINeedsAttention(p => !p)}   />
                <CheckItem label="Repeat Violations" checked={filterAIRepeatViolations} onChange={() => setFilterAIRepeatViolations(p => !p)} />
              </div>
            </div>

            <FilterSection title="Workflow">
              <div className="space-y-2">
                {['New', 'In Progress', 'Resolved'].map(st => (
                  <CheckItem key={st} label={st} checked={filterStatuses.includes(st)} onChange={() => setFilterStatuses(prev => toggleArr(prev, st))} />
                ))}
              </div>
            </FilterSection>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden bg-[#f9fafb]">
        {/* Top Header */}
        <div className="shrink-0 px-6 py-4 bg-white border-b border-[#e5e7eb]">
          <div className="flex items-center gap-3 mb-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                aria-label="Open filters"
                className="flex items-center gap-1.5 px-3 py-1.5 border border-[#e5e7eb] rounded-lg text-sm text-[#64748b] hover:bg-[#f8fafc] transition-colors shrink-0"
              >
                <Filter className="w-3.5 h-3.5" />
                {activeFilterCount > 0 && (
                  <span className="text-xs font-bold text-[#4f39f6]">{activeFilterCount}</span>
                )}
              </button>
            )}
            <h1 className="text-base font-semibold text-[#0f172b]">Inspections</h1>
            <div className="flex-1" />

            <div className="relative">
              <button
                onClick={() => setSavedViewsOpen(p => !p)}
                aria-expanded={savedViewsOpen}
                className="flex items-center gap-2 px-3 py-1.5 border border-[#e5e7eb] rounded-lg text-sm text-[#374151] hover:bg-[#f8fafc] transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-[#94a3b8]" />
                All Inspections
                <ChevronDown className="w-3.5 h-3.5 text-[#94a3b8]" />
              </button>
              <AnimatePresence>
                {savedViewsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="absolute top-full left-0 mt-1 w-44 bg-white rounded-lg border border-[#e5e7eb] shadow-lg z-20 py-1"
                  >
                    {['All Inspections', 'Critical Only', 'Unresolved'].map(v => (
                      <button key={v} onClick={() => setSavedViewsOpen(false)} className="w-full text-left px-4 py-2 text-sm text-[#374151] hover:bg-[#f8fafc] transition-colors">
                        {v}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button className="flex items-center gap-2 px-3 py-1.5 border border-[#e5e7eb] rounded-lg text-sm text-[#374151] hover:bg-[#f8fafc] transition-colors">
              <Calendar className="w-3.5 h-3.5 text-[#94a3b8]" />
              Last 90 days
            </button>

            {/* Export — only rendered when feature flag is on */}
            {FEATURES.featureExport && (
              <button className="flex items-center gap-2 px-3 py-1.5 border border-[#e5e7eb] rounded-lg text-sm text-[#374151] hover:bg-[#f8fafc] transition-colors">
                <Download className="w-3.5 h-3.5 text-[#94a3b8]" />
                Export
              </button>
            )}
          </div>

          <div className="relative mb-3">
            <Search className="w-4 h-4 text-[#94a3b8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by driver, vehicle, VIN, violation code..."
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-[#e5e7eb] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4f39f6]/20 focus:border-[#4f39f6] text-[#0f172b] placeholder-[#94a3b8] bg-white transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b] transition-colors" aria-label="Clear search">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* KPI quick-filter pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {quickFilters.map(pill => {
              const active = activeQuickFilter === pill.label;
              return (
                <motion.button
                  key={pill.label}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setActiveQuickFilter(active ? null : pill.label)}
                  aria-pressed={active}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#4f39f6]/40 ${
                    active
                      ? 'bg-[#4f39f6] text-white shadow-sm shadow-[#4f39f6]/30 ring-2 ring-[#4f39f6]'
                      : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                  }`}
                >
                  {pill.label}
                  <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[10px] font-bold leading-none ${active ? 'bg-white/25 text-white' : 'bg-[#e2e8f0] text-[#64748b]'}`}>
                    {pill.count}
                  </span>
                </motion.button>
              );
            })}
            {activeQuickFilter && (
              <button onClick={() => setActiveQuickFilter(null)} className="text-xs text-[#4f39f6] hover:text-[#4338ca] font-medium transition-colors ml-1">
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Data Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full border-collapse min-w-[900px]">
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                {columns.map(col => (
                  <th
                    key={col.key}
                    className={`text-left px-4 py-3 text-[10px] font-semibold text-[#6b7280] uppercase tracking-wider whitespace-nowrap ${col.width ?? ''} ${col.sortField ? 'cursor-pointer hover:text-[#4f39f6] select-none' : ''}`}
                    onClick={col.sortField ? () => handleSort(col.sortField!) : undefined}
                    aria-sort={col.sortField === sortField ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortField && <SortIcon field={col.sortField} />}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#f1f5f9]">
              {filteredAndSorted.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-8 py-16 text-center">
                    <FileText className="w-10 h-10 text-[#e2e8f0] mx-auto mb-3" />
                    <div className="text-sm font-medium text-[#374151]">No inspections match these filters</div>
                    <div className="text-xs text-[#94a3b8] mt-1">Try adjusting your filters or search query</div>
                    {activeFilterCount > 0 && (
                      <button
                        onClick={clearAllFilters}
                        className="mt-3 text-xs text-[#4f39f6] hover:text-[#4338ca] font-medium transition-colors"
                      >
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filteredAndSorted.map(ins => {
                  const isSelected = selectedInspection?.id === ins.id;
                  const oosTypes: string[] = [];
                  if (ins.driverOOS) oosTypes.push('Driver');
                  if (ins.vehicleOOS) oosTypes.push('Vehicle');

                  return (
                    <motion.tr
                      key={ins.id}
                      onClick={() => setSelectedInspection(prev => prev?.id === ins.id ? null : ins)}
                      whileHover={{ backgroundColor: isSelected ? '#eff6ff' : '#f8fafc' }}
                      className={`cursor-pointer transition-colors ${isSelected ? 'bg-[#eff6ff]' : 'hover:bg-[#f8fafc]'}`}
                    >
                      <td className="px-4 py-3.5">
                        <span className="text-sm text-[#374151]" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
                          {formatDate(ins.date)}
                        </span>
                      </td>
                      <td className="px-4 py-3.5"><LevelBadge level={ins.level} /></td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#94a3b8] shrink-0" />
                          <span className="text-sm text-[#374151] whitespace-nowrap">{ins.location.city}, {ins.location.state}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#eff6ff] flex items-center justify-center shrink-0">
                            <User className="w-3 h-3 text-[#3b82f6]" />
                          </div>
                          <span className="text-sm font-medium text-[#0f172b] whitespace-nowrap">{ins.driverName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="text-xs font-semibold text-[#0f172b]" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
                          {ins.vin}
                        </div>
                        <div className="text-xs text-[#94a3b8] mt-0.5">{ins.vehicleMake} {ins.vehicleModel}</div>
                      </td>
                      <td className="px-4 py-3.5">
                        {(() => {
                          const cnt = ins.violations.length;
                          const color = cnt === 0 ? '#10b981' : cnt === 1 ? '#f59e0b' : '#ef4444';
                          const bg    = cnt === 0 ? '#f0fdf4' : cnt === 1 ? '#fffbeb' : '#fef2f2';
                          return (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold" style={{ color, backgroundColor: bg }}>
                              {cnt}
                            </span>
                          );
                        })()}
                      </td>
                      <td className="px-4 py-3.5">
                        {oosTypes.length > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5 text-[#ef4444] shrink-0" />
                            <span className="text-xs font-semibold text-[#dc2626] whitespace-nowrap">{oosTypes.join(' / ')}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#d1d5db]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5"><SeverityBadge score={ins.severityScore} /></td>
                      <td className="px-4 py-3.5">
                        {ins.aiInsights.length > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#f5f3ff] text-[#4f39f6] border border-[#ede9fe] whitespace-nowrap">
                            <Sparkles className="w-3 h-3 shrink-0" />
                            {ins.aiInsights[0].label}
                          </span>
                        ) : (
                          <span className="text-xs text-[#d1d5db]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3.5"><StatusBadge status={ins.status} /></td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer — total matches useCarrierInspections.totalCount (P0.1) */}
        <div className="shrink-0 px-6 py-2.5 bg-white border-t border-[#f1f5f9] flex items-center justify-between">
          <span className="text-xs text-[#94a3b8]">
            Showing <span className="font-medium text-[#374151]">{filteredAndSorted.length}</span> of{' '}
            <span className="font-medium text-[#374151]">{inspections.length}</span> inspections
          </span>
          <div className="flex items-center gap-1">
            <button className="p-1 rounded hover:bg-[#f8fafc] text-[#94a3b8] hover:text-[#64748b] transition-colors" aria-label="Previous page">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-[#374151] px-2">Page 1 of 1</span>
            <button className="p-1 rounded hover:bg-[#f8fafc] text-[#94a3b8] hover:text-[#64748b] transition-colors" aria-label="Next page">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Detail Drawer */}
      {selectedInspection && (
        <DetailDrawer
          key={selectedInspection.id}
          inspection={selectedInspection}
          onClose={() => setSelectedInspection(null)}
        />
      )}
    </div>
  );
}
