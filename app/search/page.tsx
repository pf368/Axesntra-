'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ArrowRight, Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { RiskBadge } from '@/components/risk-badge';
import { CarrierListItem } from '@/lib/types';

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';
  const [results, setResults] = useState<CarrierListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (!query) return;
    setLoading(true);
    fetch(`/api/carriers?q=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((json) => setResults(json.data || []))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchInput.trim();
    if (!trimmed) return;
    if (/^\d+$/.test(trimmed)) {
      router.push(`/carrier/${trimmed}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const TrendIcon = ({ trend }: { trend: string }) => {
    if (trend === 'Improving') return <TrendingDown className="h-4 w-4 text-emerald-500" />;
    if (trend === 'Worsening') return <TrendingUp className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-slate-400" />;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by carrier name or USDOT number"
                className="w-full pl-12 pr-4 py-3.5 bg-white text-slate-900 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder:text-slate-400"
                autoFocus
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl py-8">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 animate-pulse h-20" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <>
            <p className="text-sm text-slate-500 mb-4">
              {results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
            </p>
            <div className="space-y-2">
              {results.map((carrier) => (
                <Link
                  key={carrier.usdot}
                  href={`/carrier/${carrier.usdot}`}
                  className="flex items-center justify-between bg-white rounded-xl p-5 border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                      <Shield className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {carrier.carrierName}
                      </p>
                      <p className="text-xs text-slate-500">USDOT {carrier.usdot}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <RiskBadge risk={carrier.overallRisk} size="sm" />
                    <TrendIcon trend={carrier.trend} />
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </>
        ) : query ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No carriers found</h2>
            <p className="text-slate-600 mb-6 max-w-sm mx-auto">
              No results for &ldquo;{query}&rdquo;. Try a USDOT number directly, or check the spelling.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
            >
              Back to search
            </Link>
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500">Enter a carrier name or USDOT number above to search.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
