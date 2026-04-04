'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SAMPLE_CARRIERS = [
  { label: 'ACME Transport (Mock)', usdot: '491180', source: 'mock' as const },
  { label: 'ACME Transport (Live API)', usdot: '491180', source: 'api' as const },
  { label: 'Midwest Logistics (Mock)', usdot: '847291', source: 'mock' as const },
  { label: 'Northeast Express (Mock)', usdot: '715394', source: 'mock' as const },
];

export function UsdotSearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [useApi, setUseApi] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    if (/^\d+$/.test(trimmed)) {
      if (useApi) {
        router.push(`/carrier/${trimmed}?source=fmcsa-api`);
      } else {
        router.push(`/carrier/${trimmed}`);
      }
    } else {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const handleChipClick = (usdot: string, source: 'mock' | 'api') => {
    setQuery(usdot);
    if (source === 'api') {
      setUseApi(true);
    } else {
      setUseApi(false);
    }
  };

  return (
    <section id="search" className="py-12" style={{ background: '#1a2535' }}>
      <div className="container mx-auto max-w-xl px-4">
        <p className="text-xs text-slate-500 mb-2 text-center uppercase tracking-wider">
          Check your own DOT record
        </p>

        {loading ? (
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Loader className="h-5 w-5 text-blue-400 animate-spin" />
              <span className="text-slate-300 text-sm">
                {useApi ? 'Fetching live FMCSA API data...' : 'Analyzing carrier data...'}
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 rounded-full animate-progress" />
            </div>
          </div>
        ) : (
          <>
            <form onSubmit={handleSearch} className="flex gap-3 mb-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter any USDOT number — including your own"
                  className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-400"
                  aria-label="Enter USDOT number"
                />
              </div>
              <Button type="submit" size="lg" className="bg-blue-600 hover:bg-blue-700 rounded-xl px-6">
                Analyze
              </Button>
            </form>

            {/* Data source toggle */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-xs text-slate-500">Data source:</span>
              <button
                onClick={() => setUseApi(false)}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  !useApi
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/10 text-slate-400 border border-white/10 hover:bg-white/20'
                }`}
              >
                Scraped / Mock
              </button>
              <button
                onClick={() => setUseApi(true)}
                className={`text-xs px-3 py-1 rounded-full transition-colors ${
                  useApi
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white/10 text-slate-400 border border-white/10 hover:bg-white/20'
                }`}
              >
                Live FMCSA API
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500">Try:</span>
              {SAMPLE_CARRIERS.map((chip) => (
                <button
                  key={`${chip.usdot}-${chip.source}`}
                  onClick={() => handleChipClick(chip.usdot, chip.source)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-colors border ${
                    chip.source === 'api'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                      : 'bg-white/10 hover:bg-white/20 text-slate-300 border-white/10'
                  }`}
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
