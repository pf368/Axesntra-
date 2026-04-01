'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Loader, ArrowRight, Lock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CarrierBrief } from '@/lib/types';

/* ── Color maps ─────────────────────────────────────────────── */
const RISK_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Low:      { bg: 'bg-emerald-900/50', text: 'text-emerald-400', border: 'border-emerald-700/50' },
  Moderate: { bg: 'bg-amber-900/50',   text: 'text-amber-400',   border: 'border-amber-700/50'   },
  Elevated: { bg: 'bg-orange-900/50',  text: 'text-orange-400',  border: 'border-orange-700/50'  },
  Severe:   { bg: 'bg-red-900/50',     text: 'text-red-400',     border: 'border-red-700/50'     },
};

const TREND_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Improving: { bg: 'bg-emerald-900/50', text: 'text-emerald-400', border: 'border-emerald-700/50' },
  Stable:    { bg: 'bg-blue-900/50',    text: 'text-blue-400',    border: 'border-blue-700/50'    },
  Worsening: { bg: 'bg-red-900/50',     text: 'text-red-400',     border: 'border-red-700/50'     },
};

const TREND_ICON: Record<string, string> = {
  Improving: '↗',
  Stable:    '→',
  Worsening: '↘',
};

/* ── Animated background grid ─────────────────────────────── */
function AnimatedGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <svg
        className="absolute inset-0 w-full"
        style={{ height: '200%', top: 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" className="animate-grid-scroll" />
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(15,23,42,0.4) 100%)',
        }}
      />
    </div>
  );
}

/* ── Step indicator ─────────────────────────────────────────── */
const STEP_LABELS = ['Enter DOT #', 'See teaser', 'Unlock full brief'];

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  return (
    <div className="flex items-start justify-center mb-10">
      {STEP_LABELS.map((label, i) => {
        const num = i + 1;
        const isComplete = step > num;
        const isActive  = step === num;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isComplete ? 'bg-emerald-500 text-white' :
                  isActive   ? 'bg-blue-500 text-white'    :
                               'bg-slate-700 text-slate-400'
                }`}
              >
                {isComplete ? '✓' : num}
              </div>
              <span
                className={`text-[11px] font-medium whitespace-nowrap ${
                  isActive   ? 'text-blue-300'   :
                  isComplete ? 'text-emerald-400' :
                               'text-slate-500'
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div
                className={`w-14 h-px mx-2 mb-4 transition-colors ${
                  step > num ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ── Report preview card (step 1 right column) ──────────────── */
function ReportPreviewCard() {
  return (
    <Link href="/sample-report" className="block group">
      <div
        className="bg-[#0f172a] rounded-2xl overflow-hidden w-full transition-all duration-200 group-hover:ring-2 group-hover:ring-blue-500/50 group-hover:shadow-[0_0_40px_rgba(59,130,246,0.15)]"
        style={{
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          transform: 'translateY(-8px)',
          maskImage: 'linear-gradient(to bottom, black 65%, transparent 95%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 65%, transparent 95%)',
        }}
      >
        {/* Header */}
        <div className="px-5 py-5 border-b border-slate-700/60">
          <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-slate-500 mb-2">
            Carrier Risk Brief
          </p>
          <h3 className="text-white font-bold text-xl leading-tight mb-1">ACME Transport LLC</h3>
          <p className="text-xs text-slate-500">USDOT 491180 · MC 123456</p>
        </div>

        {/* Badges */}
        <div className="px-5 py-4 flex flex-wrap gap-2 border-b border-slate-700/60">
          <span className="inline-flex items-center gap-1.5 bg-amber-900/50 text-amber-400 border border-amber-700/50 px-3 py-1.5 rounded-full text-xs font-semibold">
            ↗ Elevated risk
          </span>
          <span className="inline-flex items-center gap-1 bg-red-900/40 text-red-400 border border-red-700/40 px-3 py-1.5 rounded-full text-xs font-semibold">
            Worsening trend
          </span>
        </div>

        {/* Metrics */}
        <div className="px-5 py-4 flex gap-8 border-b border-slate-700/60">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500 mb-1">Top Driver</p>
            <p className="text-sm font-semibold text-white">Vehicle Maintenance</p>
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500 mb-1">Confidence</p>
            <p className="text-sm font-semibold text-white">Moderate</p>
          </div>
        </div>

        {/* Recommended action */}
        <div className="px-5 py-4 border-b border-slate-700/60">
          <div className="bg-slate-800/70 rounded-xl px-4 py-3">
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-500 mb-1">
              Recommended Action
            </p>
            <p className="text-sm font-semibold text-white leading-snug">
              Weekly maintenance gate audit
            </p>
          </div>
        </div>

        {/* CTA footer */}
        <div className="px-5 py-3">
          <p className="text-xs text-blue-400 group-hover:text-blue-300 transition-colors flex items-center gap-1">
            View full sample report
            <ArrowRight className="h-3 w-3" />
          </p>
        </div>
      </div>
    </Link>
  );
}

/* ── Teaser view (step 2) ───────────────────────────────────── */
function TeaserView({
  brief,
  email,
  setEmail,
  onEmailSubmit,
}: {
  brief: CarrierBrief;
  email: string;
  setEmail: (v: string) => void;
  onEmailSubmit: (e: React.FormEvent) => void;
}) {
  const riskC  = RISK_COLORS[brief.overallRisk]  ?? RISK_COLORS.Moderate;
  const trendC = TREND_COLORS[brief.trend]        ?? TREND_COLORS.Stable;
  const trendIcon = TREND_ICON[brief.trend] ?? '→';

  const elevatedCount = Object.values(brief.riskChips).filter(
    (r) => r === 'Elevated' || r === 'Severe',
  ).length;
  const fixCount = brief.fixPlan?.length ?? 0;

  const statCards = [
    { label: 'Overall Risk',     value: brief.overallRisk,          color: riskC.text  },
    { label: 'Risk Categories',  value: `${elevatedCount} flagged`, color: 'text-white' },
    { label: '12-mo Trend',      value: brief.trend,                color: trendC.text },
    { label: 'Fix Actions',      value: `${fixCount} actions`,      color: 'text-white' },
  ];

  const categoryLabels: Record<string, string> = {
    maintenance: 'Vehicle Maintenance',
    crash:       'Crash History',
    driver:      'Driver Safety',
    hazmat:      'Hazmat Compliance',
    admin:       'Administrative',
  };

  const barWidth: Record<string, string> = {
    Low:      'w-2/12',
    Moderate: 'w-5/12',
    Elevated: 'w-8/12',
    Severe:   'w-11/12',
  };

  const barColor: Record<string, string> = {
    Low:      'bg-emerald-500',
    Moderate: 'bg-amber-500',
    Elevated: 'bg-orange-500',
    Severe:   'bg-red-500',
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Carrier header */}
      <div className="bg-slate-800/60 rounded-2xl p-5 mb-4 border border-slate-700/50">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">{brief.carrierName}</h2>
            <p className="text-slate-400 text-sm">
              USDOT {brief.usdot}{brief.mc ? ` · MC ${brief.mc}` : ''}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center bg-slate-700/60 text-slate-300 border border-slate-600/50 px-3 py-1.5 rounded-full text-xs font-medium">
              {brief.status}
            </span>
            <span className={`inline-flex items-center gap-1 ${riskC.bg} ${riskC.text} border ${riskC.border} px-3 py-1.5 rounded-full text-xs font-semibold`}>
              ↗ {brief.overallRisk} risk
            </span>
            <span className={`inline-flex items-center gap-1 ${trendC.bg} ${trendC.text} border ${trendC.border} px-3 py-1.5 rounded-full text-xs font-semibold`}>
              {trendIcon} {brief.trend} trend
            </span>
          </div>
        </div>
      </div>

      {/* 4 headline stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {statCards.map((card) => (
          <div key={card.label} className="bg-slate-800/60 rounded-xl p-4 border border-slate-700/50">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              {card.label}
            </p>
            <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Blurred locked section */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-700/50">
        {/* Blurred content */}
        <div style={{ filter: 'blur(5px)', opacity: 0.45, pointerEvents: 'none', userSelect: 'none' }}>
          {/* Risk category breakdown */}
          <div className="bg-slate-800/60 px-5 py-4 border-b border-slate-700/50">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Risk Category Breakdown
            </p>
            <div className="space-y-3">
              {(Object.entries(brief.riskChips) as [string, string][]).map(([key, level]) => {
                const c = RISK_COLORS[level] ?? RISK_COLORS.Low;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 w-36 flex-shrink-0">
                      {categoryLabels[key] ?? key}
                    </span>
                    <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                      <div className={`h-2 rounded-full ${barColor[level] ?? 'bg-slate-500'} ${barWidth[level] ?? 'w-1/2'}`} />
                    </div>
                    <span className={`text-xs font-semibold ${c.text} w-16 text-right`}>{level}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Trend chart placeholder */}
          <div className="bg-slate-800/60 px-5 py-4 border-b border-slate-700/50">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              12-Month Trend Chart
            </p>
            <div className="h-20 flex items-end gap-1.5 pb-1">
              {[38, 52, 45, 60, 55, 68, 62, 75, 70, 78, 83, 90].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 bg-blue-500/40 rounded-t transition-all"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Remediation actions */}
          <div className="bg-slate-800/60 px-5 py-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Recommended Remediation Actions
            </p>
            <div className="space-y-3">
              {(brief.fixPlan ?? []).slice(0, 3).map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-700/40 rounded-lg p-3">
                  <span className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lock card overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-slate-900/20 to-slate-900/75 p-4">
          <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-600/60 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <h3 className="text-white font-bold text-lg text-center mb-1">Full brief is ready</h3>
            <p className="text-slate-400 text-sm text-center mb-5 leading-relaxed">
              Enter your work email to unlock the complete risk breakdown, trend charts, and remediation plan.
            </p>
            <form onSubmit={onEmailSubmit} className="space-y-3">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full px-3 py-2.5 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Unlock brief
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </form>
            <p className="text-center text-xs text-slate-500 mt-3">
              No spam. Instant access to the full report.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Success view (step 3) ──────────────────────────────────── */
function SuccessView({ usdot, onReset }: { usdot: string; onReset: () => void }) {
  return (
    <div className="max-w-md mx-auto text-center py-8">
      <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="h-8 w-8 text-emerald-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Brief unlocked!</h2>
      <p className="text-slate-400 mb-6 leading-relaxed">
        Your full carrier risk report is ready. Click below to view the complete breakdown.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href={`/carrier/${usdot}`}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors"
        >
          View full report
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center gap-2 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 px-6 py-3 rounded-xl transition-colors text-sm"
        >
          Search another carrier
        </button>
      </div>
    </div>
  );
}

/* ── Hero component ───────────────────────────────────────── */
export function HeroSearch() {
  const [step, setStep]               = useState<1 | 2 | 3>(1);
  const [query, setQuery]             = useState('');
  const [loading, setLoading]         = useState(false);
  const [brief, setBrief]             = useState<CarrierBrief | null>(null);
  const [fetchError, setFetchError]   = useState<string | null>(null);
  const [email, setEmail]             = useState('');
  const [activeUsdot, setActiveUsdot] = useState('');

  const runSearch = async (usdotValue: string) => {
    const trimmed = usdotValue.trim();
    if (!trimmed) return;

    setActiveUsdot(trimmed);
    setLoading(true);
    setFetchError(null);

    try {
      const [data] = await Promise.all([
        fetch(`/api/carriers/${encodeURIComponent(trimmed)}`).then((r) => r.json()),
        new Promise((r) => setTimeout(r, 1200)),
      ]) as [{ status: string; brief?: CarrierBrief; fallbackBrief?: CarrierBrief; message?: string }, unknown];

      const foundBrief = data.brief ?? data.fallbackBrief;
      if (foundBrief) {
        setBrief(foundBrief);
        setStep(2);
      } else {
        setFetchError(
          data.status === 'not_found'
            ? `USDOT ${trimmed} was not found. Please try a different number.`
            : 'Unable to retrieve carrier data. Please try again.',
        );
      }
    } catch {
      setFetchError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(query);
  };

  const handleChipClick = (usdot: string) => {
    setQuery(usdot);
    runSearch(usdot);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: POST { email, usdot: activeUsdot } to /api/leads
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setQuery('');
    setBrief(null);
    setFetchError(null);
    setEmail('');
    setActiveUsdot('');
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 pb-20 text-white overflow-hidden">
      <AnimatedGrid />

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        {/* Step indicator — always visible */}
        <StepIndicator step={step} />

        {/* ── Step 1: Search ── */}
        {step === 1 && (
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            {/* Left column */}
            <div className="flex-1 min-w-0 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
                <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                Currently in private pilot · 40+ teams enrolled
              </div>

              <h1 className="text-5xl font-bold mb-4 leading-tight">
                Your FMCSA record is public. Understanding it shouldn&apos;t be hard.
              </h1>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                Every violation, crash, and out-of-service event on your USDOT record is visible to your insurer, your customers, and anyone who looks. Axesntra shows you what they see — and what to do about it.
              </p>

              {/* Stats row */}
              <div className="grid grid-cols-3 divide-x divide-white/10 bg-slate-800/60 rounded-xl mb-6 max-w-xl mx-auto lg:mx-0">
                {[
                  { value: '98%',   label: 'Pilot retention rate'      },
                  { value: '12k+',  label: 'Carrier briefs generated'  },
                  { value: 'Daily', label: 'Updated via FMCSA SMS'     },
                ].map((stat) => (
                  <div key={stat.value} className="flex flex-col items-center justify-center text-center px-4 py-4">
                    <p className="text-white font-bold text-xl leading-tight">{stat.value}</p>
                    <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Primary + secondary CTA buttons */}
              <div className="mb-8 flex flex-wrap items-center gap-3 justify-center lg:justify-start">
                <Link
                  href="/early-access"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold px-7 py-3.5 rounded-xl transition-colors"
                >
                  Request early access
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/sample-report"
                  className="inline-flex items-center gap-2 border border-white/25 hover:border-white/50 bg-white/5 hover:bg-white/10 text-white text-base font-semibold px-7 py-3.5 rounded-xl transition-colors"
                >
                  See a sample report
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {loading ? (
                <div className="bg-white/10 backdrop-blur rounded-2xl p-8 max-w-xl mx-auto lg:mx-0">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Loader className="h-5 w-5 text-blue-400 animate-spin" />
                    <span className="text-slate-300 text-sm">
                      Pulling FMCSA data for USDOT {activeUsdot}...
                    </span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full animate-progress" />
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-500 mb-2 text-center lg:text-left uppercase tracking-wider">
                    Or check your own DOT record
                  </p>
                  <form onSubmit={handleFormSubmit} className="flex gap-3 max-w-xl mx-auto lg:mx-0 mb-2">
                    <div className="flex-1 relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                      <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter any USDOT number — including your own"
                        className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-400"
                      />
                    </div>
                    <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6">
                      Analyze
                    </Button>
                  </form>

                  {/* No-email note */}
                  <p className="text-xs text-emerald-400 mb-3 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
                    ✓ No email required to search — just enter a DOT number and click Analyze
                  </p>

                  {fetchError && (
                    <p className="text-xs text-red-400 mb-3 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
                      {fetchError}
                    </p>
                  )}

                  {/* Try: chips */}
                  <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
                    <span className="text-xs text-slate-500">Try:</span>
                    {[
                      { label: 'ACME Transport',    usdot: '491180' },
                      { label: 'Midwest Logistics', usdot: '847291' },
                      { label: 'Northeast Express', usdot: '715394' },
                    ].map((chip) => (
                      <button
                        key={chip.usdot}
                        onClick={() => handleChipClick(chip.usdot)}
                        className="text-xs bg-white/10 hover:bg-white/20 text-slate-300 px-3 py-1.5 rounded-full transition-colors border border-white/10"
                      >
                        {chip.label} ({chip.usdot})
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right column: preview card (desktop only) */}
            <div className="hidden lg:block relative flex-shrink-0 w-[480px] translate-y-10">
              <div
                className="absolute inset-0 -z-10 scale-110"
                style={{ background: 'radial-gradient(ellipse, rgba(59,130,246,0.15), transparent 70%)' }}
              />
              <ReportPreviewCard />
            </div>
          </div>
        )}

        {/* ── Step 2: Teaser ── */}
        {step === 2 && brief && (
          <TeaserView
            brief={brief}
            email={email}
            setEmail={setEmail}
            onEmailSubmit={handleEmailSubmit}
          />
        )}

        {/* ── Step 3: Success ── */}
        {step === 3 && (
          <SuccessView usdot={activeUsdot} onReset={handleReset} />
        )}
      </div>
    </div>
  );
}
