'use client';

import { Bell, HelpCircle, UserCircle } from 'lucide-react';
import { CarrierListItem } from '@/lib/types';

interface DashboardTopBarProps {
  carrierList: CarrierListItem[];
  selectedUsdot: string;
  onCarrierChange: (usdot: string) => void;
}

export function DashboardTopBar({ carrierList, selectedUsdot, onCarrierChange }: DashboardTopBarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 lg:px-6">
      {/* Left: brand */}
      <div className="flex items-center gap-4">
        <span className="text-lg font-semibold tracking-tight text-foreground">Axesntra</span>
        <span className="hidden sm:block font-mono text-[10px] font-medium tracking-[0.15em] uppercase text-on-surface-variant">
          Precision Intelligence Shell
        </span>
      </div>

      {/* Center: carrier selector */}
      <div className="flex-1 flex justify-center px-4">
        <select
          value={selectedUsdot}
          onChange={(e) => onCarrierChange(e.target.value)}
          className="w-full max-w-sm rounded-lg bg-surface px-3 py-2 text-sm text-foreground font-medium border-none outline-none focus:ring-1 focus:ring-indigo/30 transition-shadow"
        >
          {carrierList.map((carrier) => (
            <option key={carrier.usdot} value={carrier.usdot}>
              {carrier.carrierName} — {carrier.usdot}
              {carrier.source === 'live' ? ' (Live)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Right: utility icons */}
      <div className="flex items-center gap-1">
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors" title="Notifications">
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors" title="Help">
          <HelpCircle className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </button>
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors" title="Account">
          <UserCircle className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}
