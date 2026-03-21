'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, ArrowRight, Trash2, Shield, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { RiskBadge } from '@/components/risk-badge';
import { WatchlistEntry } from '@/hooks/useWatchlist';

const STORAGE_KEY = 'axesntra_watchlist';

function readWatchlist(): WatchlistEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function TrendIcon({ trend }: { trend: string }) {
  if (trend === 'Improving') return <TrendingDown className="h-4 w-4 text-emerald-500" />;
  if (trend === 'Worsening') return <TrendingUp className="h-4 w-4 text-red-500" />;
  return <Minus className="h-4 w-4 text-slate-400" />;
}

export default function WatchlistPage() {
  const [entries, setEntries] = useState<WatchlistEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEntries(readWatchlist());
    setMounted(true);
  }, []);

  const remove = (usdot: string) => {
    const next = entries.filter((e) => e.usdot !== usdot);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    setEntries(next);
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 py-10">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Bell className="h-5 w-5 text-blue-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Carrier Watchlist</h1>
          </div>
          <p className="text-slate-400 text-sm ml-12">
            Carriers you&apos;re tracking. Revisit their profiles to check for changes.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-3xl py-8">
        {entries.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-14 h-14 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="h-6 w-6 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">No carriers tracked yet</h2>
            <p className="text-slate-600 mb-6 max-w-sm mx-auto">
              Open any carrier report and click &ldquo;Track Carrier&rdquo; to add it here.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
            >
              Search carriers
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.usdot}
                className="flex items-center justify-between bg-white rounded-xl p-5 border border-slate-200 hover:shadow-sm transition-shadow"
              >
                <Link
                  href={`/carrier/${entry.usdot}`}
                  className="flex items-center gap-4 flex-1 group"
                >
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                    <Shield className="h-5 w-5 text-slate-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                      {entry.carrierName}
                    </p>
                    <p className="text-xs text-slate-500">
                      USDOT {entry.usdot} &middot; Added{' '}
                      {new Date(entry.trackedAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-3 ml-4">
                  <RiskBadge risk={entry.overallRisk} size="sm" />
                  <TrendIcon trend={entry.trend} />
                  <Link
                    href={`/carrier/${entry.usdot}`}
                    className="text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => remove(entry.usdot)}
                    className="text-slate-300 hover:text-red-500 transition-colors p-1"
                    title="Remove from watchlist"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
