'use client';

import { motion } from 'motion/react';
import {
  AlertTriangle, Brain, ChevronRight,
  Truck, Shield, Clock, Zap, BarChart2, Activity,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { MiniBarSparkline } from '@/components/platform/sparkline';
import { ScoreBadge, getScoreColor } from '@/components/platform/score-badge';
import type { CarrierBrief } from '@/lib/types';

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
}

const BASIC_CARDS: BasicCardDef[] = [
  { label: 'Unsafe Driving', pageId: 'unsafe-driving', threshold: 65, icon: AlertTriangle },
  { label: 'HOS Compliance', pageId: 'hos-compliance', threshold: 65, icon: Clock },
  { label: 'Vehicle Maintenance', pageId: 'vehicle-maintenance', threshold: 65, icon: Truck },
  { label: 'Driver Fitness', pageId: 'driver-fitness', threshold: 65, icon: Shield },
  { label: 'Controlled Substances', pageId: 'controlled-substances', threshold: 65, icon: Zap },
  { label: 'Crash Indicator', pageId: 'crash-indicator', threshold: 65, icon: Activity },
  { label: 'Hazmat Compliance', pageId: 'hazardous-materials', threshold: 80, icon: AlertTriangle },
  { label: 'Safety Management', pageId: 'safety-management', threshold: 65, icon: BarChart2 },
];

function getSparklineData(label: string, score: number): number[] {
  const base = Math.max(score - 20, 0);
  return Array.from({ length: 8 }, (_, i) =>
    i === 7 ? score : Math.max(base + Math.sin(i * 0.8) * 15 + Math.random() * 8, 0)
  );
}

interface HomePageProps {
  data: CarrierBrief;
  onNavigate: (page: PlatformPage) => void;
}

export function HomePage({ data, onNavigate }: HomePageProps) {
  const axesntraScore = data.scoreContributions.length > 0
    ? data.scoreContributions.reduce((acc, s) => acc + s.score * s.weight, 0) /
      data.scoreContributions.reduce((acc, s) => acc + s.weight, 0)
    : 54.2;

  const needsAttention = data.scoreContributions.filter((s) => s.score >= 65);

  return (
    <div className="flex-1 overflow-y-auto bg-ax-surface-secondary">
      {/* Top command bar */}
      <div className="bg-white border-b border-ax-border px-6 py-3 flex items-center gap-4 sticky top-0 z-10">
        <div>
          <h1 className="text-sm font-bold text-ax-text uppercase tracking-wide">{data.carrierName}</h1>
          <p className="text-xs text-ax-text-muted font-mono">USDOT {data.usdot} · {data.operationType}</p>
        </div>
        {data.source === 'public-live' && (
          <Badge variant="success" className="ml-auto gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Data
          </Badge>
        )}
      </div>

      <div className="p-6 space-y-6">
        {/* Command Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Axesntra Score */}
          <div className="bg-white rounded-xl border border-ax-border p-5 flex items-start gap-4">
            <div className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center font-bold font-mono text-lg shrink-0',
              axesntraScore >= 70 ? 'bg-red-50 text-red-600' :
              axesntraScore >= 50 ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
            )}>
              {axesntraScore.toFixed(1)}
            </div>
            <div>
              <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-0.5">Axesntra Score</p>
              <p className="text-sm font-semibold text-ax-text">
                {axesntraScore >= 70 ? 'Elevated Risk' : axesntraScore >= 50 ? 'Needs Attention' : 'Within Range'}
              </p>
              <p className="text-xs text-ax-text-muted mt-0.5">{data.overallRisk} risk level</p>
            </div>
          </div>

          {/* Needs Attention */}
          <div className="bg-white rounded-xl border border-ax-border p-5">
            <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-3">Needs Attention</p>
            {needsAttention.length === 0 ? (
              <p className="text-sm text-emerald-600 font-medium">All BASICs within threshold</p>
            ) : (
              <div className="space-y-2">
                {needsAttention.slice(0, 3).map((s) => (
                  <div key={s.category} className="flex items-center gap-2 text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0" />
                    <span className="text-ax-text font-medium flex-1 truncate">{s.category}</span>
                    <span className="font-mono font-bold text-red-600">{s.score.toFixed(1)}</span>
                  </div>
                ))}
                {needsAttention.length > 3 && (
                  <p className="text-xs text-ax-text-muted">+{needsAttention.length - 3} more</p>
                )}
              </div>
            )}
          </div>

          {/* AI Briefing */}
          <div className="bg-ax-primary/5 border border-ax-primary/20 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4 text-ax-primary" />
              <p className="text-xs font-semibold text-ax-primary uppercase tracking-wider">AI Safety Briefing</p>
            </div>
            <p className="text-sm text-ax-text leading-relaxed line-clamp-3">
              {data.executiveMemo || data.aiSummary || 'AI analysis available. Click AI Assistant for full briefing.'}
            </p>
            <button
              onClick={() => onNavigate('ai-chat')}
              className="mt-3 flex items-center gap-1 text-xs font-semibold text-ax-primary hover:underline"
            >
              Full Analysis <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* BASIC Cards Grid */}
        <div>
          <h2 className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-3">BASIC Score Categories</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {BASIC_CARDS.map((card, idx) => {
              const contribution = data.scoreContributions.find(
                (s) => s.category.toLowerCase().replace(/\s+/g, '-') === card.pageId.replace('-detail', '') ||
                       s.category === card.label
              );
              const score = contribution?.score ?? 0;
              const sparkData = getSparklineData(card.label, score);
              const Icon = card.icon;
              const isAbove = score >= card.threshold;

              return (
                <motion.button
                  key={card.pageId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => onNavigate(card.pageId)}
                  className={cn(
                    'bg-white rounded-xl border p-4 text-left hover:shadow-md transition-all group',
                    isAbove ? 'border-red-200 hover:border-red-300' : 'border-ax-border hover:border-ax-primary/30'
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center',
                      isAbove ? 'bg-red-50' : 'bg-ax-primary/8'
                    )}>
                      <Icon className={cn('h-4 w-4', isAbove ? 'text-red-500' : 'text-ax-primary')} />
                    </div>
                    <ScoreBadge score={score} threshold={card.threshold} size="sm" />
                  </div>
                  <p className="text-xs font-semibold text-ax-text mb-1 leading-tight">{card.label}</p>
                  <div className="flex items-end justify-between gap-2">
                    <div>
                      <span className={cn('text-xl font-bold font-mono', getScoreColor(score, card.threshold))}>
                        {score > 0 ? score.toFixed(0) : '—'}
                      </span>
                      <span className="text-xs text-ax-text-muted ml-1">/{card.threshold}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-ax-text-muted group-hover:text-ax-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div className="mt-2">
                    <MiniBarSparkline data={sparkData} threshold={card.threshold} height={28} />
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* OOS Rates + Inspection Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            {/* Out-of-Service Rates */}
            <div className="bg-white rounded-2xl border border-ax-border p-6">
              <p className="text-[11px] font-semibold text-ax-text-muted uppercase tracking-[0.1em] mb-6">Out-of-Service Rates</p>

              <div className="space-y-6">
                <OosRow
                  label="Vehicle"
                  carrierRate={data.metrics.vehicleOOS}
                  nationalRate={23.4}
                />
                <OosRow
                  label="Driver"
                  carrierRate={data.metrics.driverOOS}
                  nationalRate={6.7}
                />
                <OosRow
                  label="Hazmat"
                  carrierRate={null}
                  nationalRate={4.4}
                />
              </div>
            </div>

            {/* Inspection Activity */}
            <div className="bg-white rounded-2xl border border-ax-border p-6">
              <p className="text-[11px] font-semibold text-ax-text-muted uppercase tracking-[0.1em] mb-6">Inspection Activity</p>

              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <p className="text-4xl font-bold font-mono text-ax-text tracking-tight">14</p>
                  <p className="text-xs text-ax-text-muted mt-1">Inspections</p>
                  <p className="text-[10px] text-ax-text-muted">last 30 days</p>
                </div>
                <div>
                  <p className="text-4xl font-bold font-mono text-ax-text tracking-tight">9</p>
                  <p className="text-xs text-ax-text-muted mt-1">Level I</p>
                  <p className="text-[10px] text-ax-text-muted">full inspections</p>
                </div>
                <div>
                  <p className="text-4xl font-bold font-mono text-emerald-600 tracking-tight">6</p>
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
      <div className="flex items-center gap-3 mb-1">
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
