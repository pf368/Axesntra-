'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Loader, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ── Animated background grid ─────────────────────────────── */
function AnimatedGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      aria-hidden="true"
    >
      {/* SVG repeating grid that scrolls upward */}
      <svg
        className="absolute inset-0 w-full"
        style={{ height: '200%', top: 0 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path
              d="M 48 0 L 0 0 0 48"
              fill="none"
              stroke="rgba(148,163,184,0.08)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="url(#hero-grid)"
          className="animate-grid-scroll"
        />
      </svg>

      {/* Radial gradient overlay — keeps center text readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(15,23,42,0.4) 100%)',
        }}
      />
    </div>
  );
}

/* ── Report preview card ──────────────────────────────────── */
function ReportPreviewCard() {
  return (
    <div
      className="bg-white rounded-2xl overflow-hidden w-full"
      style={{
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        transform: 'translateY(-8px)',
        maskImage: 'linear-gradient(to bottom, black 55%, transparent 95%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 55%, transparent 95%)',
      }}
    >
      {/* ── Dark header bar ── */}
      <div className="bg-[#0f172a] px-5 py-4 border-b border-slate-700/50">
        <p className="text-[10px] font-bold tracking-[0.22em] uppercase text-slate-400 mb-1.5">
          Carrier Risk Brief
        </p>
        <h3 className="text-white font-bold text-lg leading-tight mb-0.5">
          ACME Transport LLC
        </h3>
        <p className="text-xs text-slate-500">USDOT 491180 | MC 123456</p>
      </div>

      {/* ── Two-column content area ── */}
      <div className="flex gap-0 divide-x divide-slate-100">

        {/* Left: badges */}
        <div className="flex-1 px-5 py-4 space-y-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-1.5">
              Risk Assessment
            </p>
            <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0" />
              Elevated
            </span>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-1.5">
              12-Month Trend
            </p>
            <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-semibold">
              ↗ Worsening
            </span>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-1.5">
              Confidence
            </p>
            <p className="text-sm font-semibold text-slate-900">Moderate</p>
          </div>
        </div>

        {/* Right: At-a-Glance cards */}
        <div className="flex-1 px-4 py-4 space-y-2">
          <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-400 mb-2">
            At-a-Glance
          </p>
          {[
            { label: 'Top Driver of Risk',        value: 'Vehicle Maintenance Deficiencies' },
            { label: 'Leading Score Contributor',  value: 'Maintenance · 32%' },
            { label: 'Recommended Action',         value: 'Weekly maintenance gate audit' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-slate-200 border-l-4 px-3 py-2.5"
              style={{ borderLeftColor: '#f97316' }}
            >
              <p className="text-[9px] font-medium uppercase tracking-wider text-slate-400 mb-0.5">
                {item.label}
              </p>
              <p className="text-xs font-semibold text-slate-900 leading-snug">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── AI Safety Advisor bar ── */}
      <div className="bg-slate-900 px-5 py-3 flex items-center gap-2.5">
        <div className="w-6 h-6 bg-teal-500/20 rounded-md flex items-center justify-center flex-shrink-0">
          <Sparkles className="h-3.5 w-3.5 text-teal-400" />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-teal-400">
            AI Safety Advisor
          </p>
          <p className="text-[11px] text-slate-400">Risk Analysis &amp; Recommendations</p>
        </div>
      </div>
    </div>
  );
}

/* ── Hero component ───────────────────────────────────────── */
export function HeroSearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    if (/^\d+$/.test(trimmed)) {
      router.push(`/carrier/${trimmed}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 text-white overflow-hidden">
      {/* Animated background grid */}
      <AnimatedGrid />

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* ── Left column: search content ── */}
          <div className="flex-1 min-w-0 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              Currently in private pilot · 40+ teams enrolled
            </div>

            <h1 className="text-5xl font-bold mb-4 leading-tight">Carrier intelligence for insurance and freight</h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              Screen carriers, understand safety trends, and identify operational risk before it becomes exposure.
            </p>

            {/* ── Stats row ── */}
            <div className="grid grid-cols-3 divide-x divide-white/10 bg-slate-800/60 rounded-xl mb-6 max-w-xl mx-auto lg:mx-0">
              {[
                { value: '98%',    label: 'Pilot retention rate' },
                { value: '12k+',   label: 'Carrier briefs generated' },
                { value: 'Daily',  label: 'Updated via FMCSA SMS' },
              ].map((stat) => (
                <div key={stat.value} className="flex flex-col items-center justify-center text-center px-4 py-4">
                  <p className="text-white font-bold text-xl leading-tight">{stat.value}</p>
                  <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* ── Primary CTA ── */}
            <div className="mb-8 flex justify-center lg:justify-start">
              <Link
                href="/early-access"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold px-7 py-3.5 rounded-xl transition-colors"
              >
                Request early access
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {loading ? (
              <div className="bg-white/10 backdrop-blur rounded-2xl p-8 max-w-xl mx-auto lg:mx-0">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Loader className="h-5 w-5 text-blue-400 animate-spin" />
                  <span className="text-slate-300 text-sm">Analyzing carrier data...</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full animate-progress" />
                </div>
              </div>
            ) : (
              <>
                <p className="text-xs text-slate-500 mb-2 text-center lg:text-left uppercase tracking-wider">Or explore a carrier now</p>
                <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto lg:mx-0 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Enter a USDOT number or carrier name"
                      className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-400"
                    />
                  </div>
                  <Button
                    type="submit"
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6"
                  >
                    Analyze
                  </Button>
                </form>

                <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
                  <span className="text-xs text-slate-500">Try:</span>
                  {[
                    { label: 'ACME Transport',    usdot: '491180' },
                    { label: 'Midwest Logistics', usdot: '847291' },
                    { label: 'Northeast Express', usdot: '715394' },
                  ].map((chip) => (
                    <button
                      key={chip.usdot}
                      onClick={() => setQuery(chip.usdot)}
                      className="text-xs bg-white/10 hover:bg-white/20 text-slate-300 px-3 py-1.5 rounded-full transition-colors border border-white/10"
                    >
                      {chip.label} ({chip.usdot})
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── Right column: preview card + glow (desktop only) ── */}
          <div className="hidden lg:block relative flex-shrink-0 w-[480px] translate-y-10">
            {/* Blue glow behind the card */}
            <div
              className="absolute inset-0 -z-10 scale-110"
              style={{
                background:
                  'radial-gradient(ellipse, rgba(59,130,246,0.15), transparent 70%)',
              }}
            />
            <ReportPreviewCard />
          </div>

        </div>
      </div>
    </div>
  );
}
