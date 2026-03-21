'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

function ReportPreviewCard() {
  return (
    <div
      className="bg-white rounded-xl overflow-hidden w-full"
      style={{
        boxShadow: '0 24px 60px rgba(0,0,0,0.4)',
        transform: 'perspective(1000px) rotateX(4deg) rotateY(-6deg)',
        maskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 100%)',
      }}
    >
      {/* Card header */}
      <div className="bg-slate-900 px-5 py-4 border-b border-slate-700/60">
        <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-1">
          Carrier Risk Brief
        </p>
        <h3 className="text-white font-bold text-base leading-tight">ACME Transport LLC</h3>
        <p className="text-xs text-slate-500 mt-0.5">USDOT 491180 · MC-382901</p>
      </div>

      {/* Badges row */}
      <div className="px-5 pt-4 pb-3 flex items-start gap-4 border-b border-slate-100">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-1.5">
            Risk Assessment
          </p>
          <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            Elevated
          </span>
        </div>
        <div className="w-px self-stretch bg-slate-200" />
        <div>
          <p className="text-[10px] font-medium uppercase tracking-widest text-slate-400 mb-1.5">
            12-Month Trend
          </p>
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full text-xs font-semibold">
            ↗ Worsening
          </span>
        </div>
      </div>

      {/* At-a-Glance */}
      <div className="px-5 pt-4 pb-6 space-y-2.5">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-400 mb-3">
          At-a-Glance
        </p>

        {[
          { label: 'Top Driver of Risk', value: 'Vehicle Maintenance Deficiencies' },
          { label: 'Leading Score Contributor', value: 'Maintenance · 32%' },
          { label: 'Recommended Action', value: 'Weekly maintenance gate audit' },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-slate-200 border-l-4 p-3.5"
            style={{ borderLeftColor: '#f97316' }}
          >
            <p className="text-[10px] font-medium uppercase tracking-wider text-slate-400 mb-1">
              {item.label}
            </p>
            <p className="text-sm font-semibold text-slate-900 leading-snug">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

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

  const handleChipClick = (usdot: string) => {
    setQuery(usdot);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 text-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* ── Left column: search content ── */}
          <div className="flex-1 min-w-0 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
              Carrier Intelligence Platform
            </div>

            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Axesntra
            </h1>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto lg:mx-0">
              Carrier intelligence for insurance, freight, and transportation teams. Screen carriers, understand safety trends, and identify operational risk before it becomes exposure.
            </p>

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
                  <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6">
                    Analyze
                  </Button>
                </form>

                <div className="flex items-center justify-center lg:justify-start gap-2 flex-wrap">
                  <span className="text-xs text-slate-500">Try:</span>
                  {[
                    { label: 'ACME Transport', usdot: '491180' },
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

          {/* ── Right column: preview card (desktop only) ── */}
          <div className="hidden lg:block flex-shrink-0 w-[420px] translate-y-8">
            <ReportPreviewCard />
          </div>

        </div>
      </div>
    </div>
  );
}
