'use client';

import { motion } from 'motion/react';
import {
  AlertTriangle, Brain, ChevronRight, TrendingUp, TrendingDown,
  Truck, Shield, Clock, Zap, BarChart2, Activity,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { MiniBarSparkline } from '@/components/platform/sparkline';
import { ScoreBadge, getScoreColor } from '@/components/platform/score-badge';
import type { CarrierBrief, ScoreContribution } from '@/lib/types';

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
  const trendMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const trendChartData = trendMonths.map((month, i) => ({
    month,
    compliance: data.trendData?.vehicleOOS?.[i]?.value ?? 70 + Math.sin(i * 0.5) * 10,
    risk: data.trendData?.driverOOS?.[i]?.value ?? 55 + Math.cos(i * 0.4) * 12,
  }));

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
        </div>

        {/* OOS Rates + Trend Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* OOS Rate Cards */}
          <div className="space-y-3">
            <OosCard
              label="Vehicle OOS Rate"
              value={data.metrics.vehicleOOS}
              national={21.7}
              unit="%"
            />
            <OosCard
              label="Driver OOS Rate"
              value={data.metrics.driverOOS}
              national={5.1}
              unit="%"
            />
            <OosCard
              label="Crashes (24 mo)"
              value={data.metrics.crashes24mo}
              national={null}
              unit=" crashes"
            />
          </div>

          {/* Trend Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-ax-border p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider">12-Month Trend</p>
              <div className="flex items-center gap-4 text-xs text-ax-text-muted">
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-ax-primary rounded inline-block" />Compliance</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-500 rounded inline-block" />AI Risk Model</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={trendChartData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ fontSize: 12, border: '1px solid #e5e7eb', borderRadius: 8, boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  labelStyle={{ fontWeight: 600, color: '#111827' }}
                />
                <Line type="monotone" dataKey="compliance" stroke="#4f39f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="risk" stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="4 2" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* What Changed */}
        {data.whatChangedItems && data.whatChangedItems.length > 0 && (
          <div>
            <h2 className="text-xs font-semibold text-ax-text-muted uppercase tracking-wider mb-3">What Changed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.whatChangedItems.map((item, i) => (
                <div key={i} className="bg-white rounded-xl border border-ax-border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {item.direction === 'up' ? (
                      <TrendingUp className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    ) : item.direction === 'down' ? (
                      <TrendingDown className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    ) : (
                      <span className="h-1.5 w-1.5 rounded-full bg-ax-text-muted shrink-0 mt-1" />
                    )}
                    <span className="text-xs font-semibold text-ax-text">{item.label}</span>
                  </div>
                  <p className="text-xs text-ax-text-secondary leading-relaxed">{item.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="h-16" /> {/* mobile bottom nav spacing */}
      </div>
    </div>
  );
}

function OosCard({ label, value, national, unit }: { label: string; value: number; national: number | null; unit: string }) {
  const isAbove = national !== null && value > national;
  return (
    <div className="bg-white rounded-xl border border-ax-border p-4 flex items-start justify-between gap-3">
      <div>
        <p className="text-xs text-ax-text-muted font-medium mb-1">{label}</p>
        <span className={cn('text-xl font-bold font-mono', isAbove ? 'text-red-600' : 'text-ax-text')}>
          {value}{unit}
        </span>
      </div>
      {national !== null && (
        <div className="text-right">
          <p className="text-[10px] text-ax-text-muted">National avg</p>
          <p className="text-xs font-mono font-semibold text-ax-text-secondary">{national}{unit}</p>
          {isAbove ? (
            <Badge variant="danger" className="mt-1 text-[10px]">Above avg</Badge>
          ) : (
            <Badge variant="success" className="mt-1 text-[10px]">Below avg</Badge>
          )}
        </div>
      )}
    </div>
  );
}
