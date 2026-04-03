'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
    <section id="search" className="py-12" style={{ background: '#1a2535' }}>
      <div className="container mx-auto max-w-xl px-4">
        <p className="text-xs text-slate-500 mb-2 text-center uppercase tracking-wider">
          Check your own DOT record
        </p>

        {loading ? (
          <div className="bg-white/10 backdrop-blur rounded-2xl p-8">
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
            <form onSubmit={handleSearch} className="flex gap-3 mb-4">
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

            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span className="text-xs text-slate-500">Try:</span>
              {[
                { label: 'ACME Transport', usdot: '491180' },
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
    </section>
  );
}
