'use client';

import { useState, useEffect, useCallback } from 'react';
import { RiskLevel, TrendDirection } from '@/lib/types';

export interface WatchlistEntry {
  usdot: string;
  carrierName: string;
  overallRisk: RiskLevel;
  trend: TrendDirection;
  trackedAt: string;
}

const STORAGE_KEY = 'axesntra_watchlist';

function readStorage(): WatchlistEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeStorage(entries: WatchlistEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([]);

  useEffect(() => {
    setWatchlist(readStorage());
  }, []);

  const isTracked = useCallback(
    (usdot: string) => watchlist.some((e) => e.usdot === usdot),
    [watchlist]
  );

  const track = useCallback((entry: Omit<WatchlistEntry, 'trackedAt'>) => {
    setWatchlist((prev) => {
      if (prev.some((e) => e.usdot === entry.usdot)) return prev;
      const next = [{ ...entry, trackedAt: new Date().toISOString() }, ...prev];
      writeStorage(next);
      return next;
    });
  }, []);

  const untrack = useCallback((usdot: string) => {
    setWatchlist((prev) => {
      const next = prev.filter((e) => e.usdot !== usdot);
      writeStorage(next);
      return next;
    });
  }, []);

  const toggle = useCallback(
    (entry: Omit<WatchlistEntry, 'trackedAt'>) => {
      if (isTracked(entry.usdot)) {
        untrack(entry.usdot);
      } else {
        track(entry);
      }
    },
    [isTracked, track, untrack]
  );

  return { watchlist, isTracked, track, untrack, toggle };
}
