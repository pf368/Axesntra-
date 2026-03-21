'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

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

    // Pure digits → direct carrier lookup; anything else → search results page
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
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 text-white">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6 uppercase tracking-wider">
          Carrier Intelligence Platform
        </div>

        <h1 className="text-5xl font-bold mb-4 leading-tight">
          Axesntra
        </h1>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          Carrier intelligence for insurance, freight, and transportation teams. Screen carriers, understand safety trends, and identify operational risk before it becomes exposure.
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
            <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto mb-4">
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

            <div className="flex items-center justify-center gap-2 flex-wrap">
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
    </div>
  );
}
