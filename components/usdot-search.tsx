'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader, Zap, ExternalLink } from 'lucide-react';

const SAMPLE_CARRIERS = [
  { label: 'ACME Transport', usdot: '491180' },
  { label: 'Midwest Logistics', usdot: '847291' },
  { label: 'Northeast Express', usdot: '715394' },
];

export function UsdotSearch() {
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
    <section id="search" className="dotted-bg py-24 relative overflow-hidden bg-white">
      <div className="max-w-4xl mx-auto px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-slate-900">
          See what the FMCSA says about you.
        </h2>
        <p className="text-slate-600 mb-12 text-lg">
          Instant intelligence for any USDOT number. No credit card required.
        </p>

        {loading ? (
          <div className="max-w-2xl mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/50">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Loader className="h-5 w-5 text-sb-primary animate-spin" />
              <span className="text-slate-600 text-sm">Analyzing carrier data...</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-sb-primary rounded-full animate-progress" />
            </div>
          </div>
        ) : (
          <>
            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="bg-white/80 backdrop-blur-sm p-2 rounded-2xl flex flex-col md:flex-row gap-2 max-w-2xl mx-auto mb-6 shadow-2xl border border-white/50"
            >
              <div className="flex-1 flex items-center px-4 gap-3 bg-white rounded-xl shadow-inner">
                <Search className="h-5 w-5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter USDOT # or Carrier Name"
                  className="w-full py-4 border-none focus:ring-0 focus:outline-none text-sb-on-background font-medium placeholder:text-slate-400 bg-transparent"
                  aria-label="Enter USDOT number"
                />
              </div>
              <button
                type="submit"
                className="bg-sb-primary hover:bg-sb-primary-container text-white px-8 py-4 rounded-xl font-bold transition-all active:scale-95"
              >
                Analyze Profile
              </button>
            </form>

            {/* Sample chips */}
            <div className="flex items-center justify-center gap-2 flex-wrap mb-16">
              <span className="text-xs text-slate-500">Try:</span>
              {SAMPLE_CARRIERS.map((chip) => (
                <button
                  key={chip.usdot}
                  onClick={() => setQuery(chip.usdot)}
                  className="text-xs px-3 py-1.5 rounded-full bg-sb-surface-container-high text-sb-on-surface-variant hover:bg-sb-surface-container-highest transition-colors"
                >
                  {chip.label} ({chip.usdot})
                </button>
              ))}
            </div>
          </>
        )}

        {/* Mock AI Advisor Result */}
        {!loading && (
          <div className="max-w-3xl mx-auto text-left">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 rounded-lg ai-gradient flex items-center justify-center">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 leading-none">AI Safety Advisor Summary</h4>
                  <p className="text-xs text-slate-500 uppercase tracking-widest mt-1">
                    Carrier: West-Edge Logistics (USDOT 312****)
                  </p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-1 bg-sb-error rounded-full" />
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <strong className="text-slate-900">Critical Alert:</strong> Vehicle Maintenance
                    BASIC has crossed the 80% intervention threshold. Recent roadside inspections show
                    a recurring pattern of{' '}
                    <span className="text-sb-error bg-sb-error/10 px-1 rounded font-mono text-xs">
                      393.45
                    </span>{' '}
                    violations (brake hose tubing).
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="w-1 bg-slate-400 rounded-full" />
                  <p className="text-sm text-slate-600 leading-relaxed">
                    <strong className="text-slate-900">Trend Analysis:</strong> Your
                    inspection-to-violation ratio has improved by 14% over the last 90 days, largely
                    driven by better pre-trip documentation in the Northeast region.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100">
                  <a
                    href="/sample-report"
                    className="text-sb-primary font-bold text-sm flex items-center gap-2 hover:underline"
                  >
                    View full risk assessment report
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
