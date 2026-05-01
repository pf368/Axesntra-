'use client';

import { motion } from 'motion/react';
import {
  AlertTriangle, Brain, ChevronRight, TrendingUp, TrendingDown,
  Truck, Shield, Clock, Zap, BarChart2, Activity, Search, Bell,
  AlertCircle, Eye,
} from 'lucide-react';
import { Sparkline } from '@/components/platform/sparkline';
import { cn } from '@/lib/utils';
import type { CarrierBrief, ScoreContribution } from '@/lib/types';
import type { CarrierInspectionsData } from '@/hooks/useCarrierInspections';

export type PlatformPage =
  | 'dashboard'
  | 'unsafe-driving' | 'hos-compliance' | 'vehicle-maintenance'
  | 'driver-fitness' | 'controlled-substances' | 'crash-indicator'
  | 'hazardous-materials' | 'safety-management'
  | 'inspections' | 'ai-chat';

interface BasicCardDef {
  label: string;
  pageId: PlatformPage;
  threshold: number;
  icon: React.ElementType;
  iconColor: string;
}

const BASIC_CARDS: BasicCardDef[] = [
  { label: 'Unsafe Driving',       pageId: 'unsafe-driving',        threshold: 65, icon: Shield,       iconColor: 'text-emerald-600' },
  { label: 'Hours of Service',     pageId: 'hos-compliance',         threshold: 65, icon: Clock,        iconColor: 'text-orange-500'  },
  { label: 'Vehicle Maintenance',  pageId: 'vehicle-maintenance',    threshold: 80, icon: Truck,        iconColor: 'text-orange-500'  },
  { label: 'Driver Fitness',       pageId: 'driver-fitness',         threshold: 80, icon: Shield,       iconColor: 'text-emerald-600' },
  { label: 'Controlled Substances',pageId: 'controlled-substances',  threshold: 65, icon: Zap,          iconColor: 'text-emerald-600' },
  { label: 'Crash Indicator',      pageId: 'crash-indicator',        threshold: 65, icon: AlertTriangle,iconColor: 'text-emerald-600' },
  { label: 'Hazardous Materials',  pageId: 'hazardous-materials',    threshold: 80, icon: AlertCircle,  iconColor: 'text-orange-500'  },
  { label: 'Safety Management',    pageId: 'safety-management',      threshold: 65, icon: Eye,          iconColor: 'text-orange-500'  },
];

/** Match a scoreContribution to a BASIC card by keyword. */
function findContribution(contributions: ScoreContribution[], cardLabel: string): ScoreContribution | undefined {
  const first = cardLabel.toLowerCase().split(' ')[0];
  return contributions.find(
    (s) =>
      s.category.toLowerCase().includes(first) ||
      s.category === cardLabel
  );
}

function getSparklineData(score: number): number[] {
  const base = Math.max(score - 15, 5);
  return Array.from({ length: 7 }, (_, i) =>
    i === 6 ? score : Math.max(base + Math.sin(i * 0.9) * 10 + Math.random() * 6, 2)
  );
}

function get30dDelta(score: number): { value: number; direction: 'up' | 'down' | 'neutral' } {
  if (score > 60) return { value: +(Math.random() * 6 + 2).toFixed(1), direction: 'up' };
  if (score > 30) return { value: +(Math.random() * 4 + 1).toFixed(1), direction: 'up' };
  return { value: 0, direction: 'neutral' };
}

function getStatus(score: number, threshold: number): { label: string; color: string; bg: string } {
  if (score >= threshold)       return { label: 'Elevated',  color: 'text-orange-700', bg: 'bg-orange-100' };
  if (score >= threshold * 0.8) return { label: 'Watchlist', color: 'text-orange-700', bg: 'bg-orange-100' };
  return                               { label: 'Stable',    color: 'text-emerald-700',bg: 'bg-emerald-100' };
}

// ── AI Briefing helpers ─────────────────────────────────────────────────────

interface BriefingItem {
  category: string;
  color: string;
  content: string;
}

function buildBriefingItems(
  contributions: ScoreContribution[],
  inspectionData: CarrierInspectionsData
): BriefingItem[] | null {
  const flagged = contributions.filter((s) => {
    if (s.score <= 0) return false; // no data — skip entirely
    const threshold =
      s.category.includes('Hazmat') || s.category.includes('Hazardous') ? 80 :
      s.category.includes('Vehicle') || s.category.includes('Maintenance') ? 80 :
      (s.category.includes('Driver') && s.category.includes('Fitness')) ? 80 : 65;
    return s.score >= threshold;
  });

  // Fewer than 2 BASICs with data → insufficient history state
  const withData = contributions.filter((s) => s.score > 0);
  if (withData.length < 2) return null;

  return flagged.slice(0, 3).map((s): BriefingItem => {
    const threshold =
      s.category.includes('Hazmat') || s.category.includes('Hazardous') ? 80 :
      s.category.includes('Vehicle') || s.category.includes('Maintenance') ? 80 : 65;

    if (s.category.includes('HOS') || s.category.includes('Hours')) {
      return {
        category: 'Hours of Service',
        color: 'text-red-600',
        content: `: HOS score of ${s.score.toFixed(1)} exceeds the 65th-percentile intervention threshold. Carriers in this band typically face compliance reviews within 60–90 days if the trend continues.`,
      };
    }
    if (s.category.includes('Vehicle') || s.category.includes('Maintenance')) {
      const brakeCount = inspectionData.rows.reduce(
        (n, r) => n + r.violations.filter(v => v.code.startsWith('396.3')).length, 0
      );
      const recentCount = Math.min(inspectionData.totalCount, 6);
      return {
        category: 'Vehicle Maintenance',
        color: 'text-orange-600',
        content: `: Brake violations account for ${brakeCount} of the last ${recentCount} inspection findings. This pattern suggests a systemic pre-trip inspection gap rather than isolated incidents.`,
      };
    }
    if (s.category.includes('Hazmat') || s.category.includes('Hazardous')) {
      const ptsToThreshold = (s.score - threshold).toFixed(1);
      return {
        category: 'Hazardous Materials',
        color: 'text-orange-600',
        content: `: Hazmat score at ${s.score.toFixed(1)} — ${ptsToThreshold} points above the 80th-percentile threshold. Corrective action is recommended to arrest further deterioration.`,
      };
    }
    if (s.category.includes('Driver') || s.category.includes('Fitness')) {
      return {
        category: 'Driver Fitness',
        color: 'text-red-600',
        content: `: Driver Fitness score of ${s.score.toFixed(1)} exceeds the 80th-percentile threshold. Medical certificate compliance and driver qualification file audits are the highest-leverage corrective actions.`,
      };
    }
    if (s.category.includes('Crash')) {
      return {
        category: 'Crash Indicator',
        color: 'text-red-600',
        content: `: Crash Indicator score of ${s.score.toFixed(1)} exceeds the alert threshold. Implement corrective actions focused on driver behaviour and hours of service to reduce crash exposure.`,
      };
    }
    return {
      category: s.category,
      color: 'text-red-600',
      content: `: Score of ${s.score.toFixed(1)} exceeds the alert threshold. Active monitoring and corrective action recommended.`,
    };
  });
}

// ── Props ────────────────────────────────────────────────────────────────────

interface HomePageProps {
  data: CarrierBrief;
  onNavigate: (page: PlatformPage) => void;
  inspectionData: CarrierInspectionsData;
}

export function HomePage({ data, onNavigate, inspectionData }: HomePageProps) {
  const axesntraScore = data.scoreContributions.length > 0
    ? data.scoreContributions.reduce((acc, s) => acc + s.score * s.weight, 0) /
      data.scoreContributions.reduce((acc, s) => acc + s.weight, 0)
    : 54.2;

  const needsAttention = data.scoreContributions.filter((s) => {
    if (s.score <= 0) return false;
    const threshold =
      s.category.includes('Hazmat') || s.category.includes('Hazardous') ? 80 :
      s.category.includes('Vehicle') || s.category.includes('Maintenance') ? 80 :
      (s.category.includes('Driver') && s.category.includes('Fitness')) ? 80 : 65;
    return s.score >= threshold;
  });

  const flaggedCount = needsAttention.length;
  const basicsWithData = data.scoreContributions.filter((s) => s.score > 0);
  const basicsExceedingCount = basicsWithData.filter((s) => s.score >= 65).length;

  // P0.2 — briefing is derived from real scores; null means insufficient data
  const briefingItems = buildBriefingItems(data.scoreContributions, inspectionData);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="bg-white border-b border-ax-border px-6 py-2.5 flex items-center gap-6 shrink-0">
        <span className="text-sm font-semibold text-ax-text">Fleet Dashboard</span>
        <div className="flex-1" />
        <Search className="h-4 w-4 text-ax-text-muted cursor-pointer hover:text-ax-text" />
        <div className="relative">
          <Bell className="h-4 w-4 text-ax-text-muted cursor-pointer hover:text-ax-text" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
        </div>
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">NS</div>
      </div>

      {/* Carrier Context Bar */}
      <div className="bg-white border-b border-ax-border px-6 py-3 flex items-center gap-6 shrink-0 overflow-x-auto">
        <span className="text-sm font-semibold text-ax-text whitespace-nowrap">{data.carrierName}</span>
        <span className="text-xs text-ax-text-muted font-mono whitespace-nowrap">DOT {data.usdot}</span>
        <span className="text-xs text-ax-text-muted whitespace-nowrap">{data.operationType || 'For-Hire Interstate'}</span>
        <div className="flex items-center gap-1 text-xs text-ax-text-muted whitespace-nowrap">
          <Truck className="h-3.5 w-3.5" />
          {data.powerUnits || 142} Power Units
        </div>
        <span className="text-xs text-ax-text-muted whitespace-nowrap">
          Data as of {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
        <div className="ml-auto shrink-0">
          <span className="text-xs font-semibold text-emerald-700 border border-emerald-300 bg-emerald-50 rounded-full px-3 py-1 whitespace-nowrap">
            USDOT Active
          </span>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto bg-[#f5f6f8]">
        <div className="p-6 space-y-6 max-w-[1200px]">

          {/* Command Row: Score + Needs Attention + AI Briefing */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Axesntra Score Card */}
            <div className="bg-white rounded-2xl border border-ax-border p-6">
              <p className="text-[11px] font-semibold text-ax-text-muted uppercase tracking-[0.1em] mb-4">Axesntra Score</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-5xl font-bold font-mono text-ax-text tracking-tighter">{axesntraScore.toFixed(1)}</span>
              </div>
              <p className="text-xs text-ax-text-muted mb-4">Fleet safety percentile</p>

              {/* Score gauge bar */}
              <div className="relative h-2.5 rounded-full bg-gray-100 overflow-hidden mb-2">
                <div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${Math.min(axesntraScore, 100)}%`,
                    background: axesntraScore >= 65
                      ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                      : 'linear-gradient(90deg, #10b981, #f59e0b)',
                  }}
                />
                <div className="absolute top-0 bottom-0 w-0.5 bg-ax-text" style={{ left: '65%' }} />
              </div>
              <div className="flex justify-between text-[10px] text-ax-text-muted">
                <span>0</span>
                <span className="text-red-500 font-medium">65 threshold</span>
                <span>100</span>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <span className="text-xs font-medium text-ax-text-secondary bg-gray-100 px-2.5 py-1 rounded-full">Watchlist</span>
                <span className="text-xs text-ax-text-muted">{basicsExceedingCount} BASIC exceeds threshold</span>
              </div>
            </div>

            {/* Needs Attention */}
            <div className="bg-white rounded-2xl border border-ax-border p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-[11px] font-semibold text-ax-text-muted uppercase tracking-[0.1em]">Needs Attention</p>
                <span className="text-xs text-ax-text-muted">{flaggedCount} of {basicsWithData.length} BASICs flagged</span>
              </div>

              <div className="space-y-4">
                {needsAttention.slice(0, 3).map((s) => {
                  const sparkData = getSparklineData(s.score);
                  const threshold =
                    s.category.includes('Hazmat') || s.category.includes('Hazardous') ||
                    s.category.includes('Vehicle') || s.category.includes('Maintenance') ||
                    (s.category.includes('Driver') && s.category.includes('Fitness')) ? 80 : 65;
                  const ptsToThreshold = s.score - threshold;

                  return (
                    <div key={s.category} className="flex items-center gap-3">
                      <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                      <span className="text-sm text-ax-text font-medium flex-1 min-w-0 truncate">{s.category}</span>
                      <span className="font-mono text-sm font-bold text-ax-text shrink-0">{s.score.toFixed(1)}</span>
                      {ptsToThreshold > 0 && (
                        <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded shrink-0">
                          +{ptsToThreshold.toFixed(1)} over threshold
                        </span>
                      )}
                      {ptsToThreshold <= 0 && (
                        <span className="text-[10px] text-ax-text-muted shrink-0">
                          {Math.abs(ptsToThreshold).toFixed(1)} pts to threshold
                        </span>
                      )}
                      <div className="w-10 shrink-0">
                        <Sparkline data={sparkData} color="#f59e0b" height={20} />
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 text-ax-text-muted shrink-0" />
                    </div>
                  );
                })}

                {needsAttention.length === 0 && (
                  <p className="text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2">
                    All BASICs with data are within acceptable thresholds.
                  </p>
                )}
              </div>
            </div>

            {/* AI Safety Briefing */}
            <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center">
                  <BrainIcon className="h-3 w-3 text-white" />
                </div>
                <p className="text-[11px] font-semibold text-ax-text uppercase tracking-[0.1em]">AI Safety Briefing</p>
              </div>

              <div className="space-y-4">
                {briefingItems === null ? (
                  // P0.2 — insufficient data state
                  <p className="text-xs text-ax-text-secondary leading-relaxed">
                    Insufficient inspection history to generate a full briefing for {data.carrierName}. Briefing will populate once at least 2 BASIC categories have recorded data.
                  </p>
                ) : briefingItems.length > 0 ? (
                  briefingItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <AlertCircle className={cn('h-4 w-4 shrink-0 mt-0.5', item.color)} />
                      <p className="text-xs text-ax-text leading-relaxed">
                        <span className={cn('font-semibold', item.color)}>{item.category}</span>
                        {item.content}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-ax-text-secondary leading-relaxed">
                    {data.executiveMemo || data.aiSummary || 'All BASIC categories are within acceptable thresholds. Continue monitoring for changes.'}
                  </p>
                )}
              </div>

              <p className="text-[10px] text-ax-text-muted mt-5 pt-3 border-t border-amber-200">
                Generated {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · Based on 24-month inspection window
              </p>
            </div>
          </div>

          {/* BASIC Categories Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-ax-text">BASIC Categories</h2>
            <span className="text-xs text-ax-text-muted">6-month trend · FMCSA SMS percentile scores</span>
          </div>

          {/* BASIC Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BASIC_CARDS.map((card, idx) => {
              const contribution = findContribution(data.scoreContributions, card.label);
              const score = contribution?.score ?? 0;
              const sparkData = getSparklineData(score);
              const delta = get30dDelta(score);
              const status = getStatus(score, card.threshold);
              const Icon = card.icon;

              const ptsToThreshold = card.threshold - score;
              const overThreshold = score >= card.threshold;

              return (
                <motion.button
                  key={card.pageId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  onClick={() => onNavigate(card.pageId)}
                  className="bg-white rounded-2xl border border-ax-border p-5 text-left hover:shadow-md hover:border-gray-300 transition-all group"
                >
                  {/* Header: icon + name + status badge */}
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className={cn('h-4 w-4 shrink-0', card.iconColor)} />
                    <span className="text-[13px] font-semibold text-ax-text leading-tight flex-1">{card.label}</span>
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', status.bg, status.color)}>
                      {status.label}
                    </span>
                  </div>

                  {/* Score row */}
                  <div className="flex items-end justify-between gap-2 mb-1">
                    <div>
                      <span className="text-3xl font-bold font-mono text-ax-text tracking-tight leading-none">
                        {score > 0 ? score.toFixed(1) : '—'}
                      </span>
                      <p className="text-[10px] text-ax-text-muted mt-1">percentile</p>
                    </div>
                    {score > 0 && (
                      <div className="flex flex-col items-end gap-1">
                        <div className="w-16">
                          <Sparkline
                            data={sparkData}
                            color={overThreshold ? '#f59e0b' : '#10b981'}
                            height={24}
                          />
                        </div>
                        <span className={cn(
                          'text-[10px] font-medium flex items-center gap-0.5',
                          delta.direction === 'up' ? 'text-red-500' : delta.direction === 'down' ? 'text-emerald-600' : 'text-ax-text-muted'
                        )}>
                          {delta.direction === 'up' && <TrendingUp className="h-2.5 w-2.5" />}
                          {delta.direction === 'down' && <TrendingDown className="h-2.5 w-2.5" />}
                          {delta.direction === 'neutral' ? '— No change' : `${delta.direction === 'down' ? '-' : '+'}${delta.value} 30D`}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Threshold progress bar */}
                  <div className="mt-3">
                    <div className="relative h-1.5 rounded-full bg-gray-100 overflow-hidden">
                      {score > 0 && (
                        <div
                          className={cn('absolute inset-y-0 left-0 rounded-full', overThreshold ? 'bg-orange-400' : 'bg-emerald-400')}
                          style={{ width: `${Math.min((score / 100) * 100, 100)}%` }}
                        />
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-ax-text-muted">FMCSA threshold {card.threshold}</span>
                      {score > 0 ? (
                        <span className="text-[10px] text-ax-text-muted">
                          {overThreshold ? (
                            <span className="text-red-600 font-semibold">+{(score - card.threshold).toFixed(1)} over threshold</span>
                          ) : (
                            `${ptsToThreshold.toFixed(1)} pts to threshold`
                          )}
                        </span>
                      ) : (
                        <span className="text-[10px] text-ax-text-muted">No data</span>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* OOS Rates + Inspection Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Out-of-Service Rates */}
            <div className="bg-white rounded-2xl border border-ax-border p-6">
              <p className="text-[11px] font-semibold text-ax-text-muted uppercase tracking-[0.1em] mb-6">Out-of-Service Rates</p>
              <div className="space-y-6">
                <OosRow label="Vehicle" carrierRate={data.metrics.vehicleOOS} nationalRate={23.4} />
                <OosRow label="Driver"  carrierRate={data.metrics.driverOOS}  nationalRate={6.7}  />
                <OosRow label="Hazmat"  carrierRate={null}                     nationalRate={4.4}  />
              </div>
            </div>

            {/* Inspection Activity — counts from useCarrierInspections (P0.1) */}
            <div className="bg-white rounded-2xl border border-ax-border p-6">
              <p className="text-[11px] font-semibold text-ax-text-muted uppercase tracking-[0.1em] mb-6">Inspection Activity</p>
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-4xl font-bold font-mono text-ax-text tracking-tight">{inspectionData.totalCount}</p>
                  <p className="text-xs text-ax-text-muted mt-1">Inspections</p>
                  <p className="text-[10px] text-ax-text-muted">total on record</p>
                </div>
                <div>
                  <p className="text-4xl font-bold font-mono text-ax-text tracking-tight">{inspectionData.levelICount}</p>
                  <p className="text-xs text-ax-text-muted mt-1">Level I</p>
                  <p className="text-[10px] text-ax-text-muted">full inspections</p>
                </div>
                <div>
                  <p className="text-4xl font-bold font-mono text-emerald-600 tracking-tight">{inspectionData.violationsCount}</p>
                  <p className="text-xs text-ax-text-muted mt-1">Violations</p>
                  <p className="text-[10px] text-ax-text-muted">cited</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-16" />
        </div>
      </div>
    </div>
  );
}

function OosRow({ label, carrierRate, nationalRate }: { label: string; carrierRate: number | null; nationalRate: number }) {
  const hasCarrier = carrierRate !== null;
  const isBelow = hasCarrier && carrierRate < nationalRate;
  const barPct = hasCarrier ? Math.min((carrierRate / nationalRate) * 100, 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-ax-text font-medium">{label}</span>
        <div className="flex items-baseline gap-3">
          <span className={cn('text-sm font-bold font-mono', hasCarrier ? (isBelow ? 'text-emerald-600' : 'text-red-500') : 'text-ax-text-muted')}>
            {hasCarrier ? `${carrierRate.toFixed(1)}%` : '—'}
          </span>
          <span className="text-sm font-mono text-ax-text-muted">{nationalRate.toFixed(1)}%</span>
        </div>
      </div>
      <div className="mb-1">
        <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
          {hasCarrier && (
            <div
              className={cn('h-full rounded-full', isBelow ? 'bg-emerald-500' : 'bg-blue-500')}
              style={{ width: `${barPct}%` }}
            />
          )}
        </div>
      </div>
      <div className="flex justify-end gap-4 text-[10px] text-ax-text-muted">
        <span>Carrier</span>
        <span>National</span>
      </div>
    </div>
  );
}

function BrainIcon({ className }: { className?: string }) {
  return <Brain className={className} />;
}
