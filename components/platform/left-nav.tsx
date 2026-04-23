'use client';

import { motion } from 'motion/react';
import { LayoutDashboard, ClipboardList, Sparkles, Settings, ChevronDown, Bell, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import type { CarrierListItem } from '@/lib/types';

export type NavSection = 'home' | 'inspections' | 'ai';

interface NavItem {
  id: NavSection;
  label: string;
  icon: React.ElementType;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'inspections', label: 'Inspections', icon: ClipboardList, badge: 14 },
  { id: 'ai', label: 'AI Assistant', icon: Sparkles },
];

interface LeftNavProps {
  activeNav: NavSection;
  onNavChange: (nav: NavSection) => void;
  carrierList: CarrierListItem[];
  selectedUsdot: string;
  onCarrierChange: (usdot: string) => void;
  carrierName?: string;
  alertItems?: { color: string; text: string }[];
}

export function LeftNav({ activeNav, onNavChange, carrierList, selectedUsdot, onCarrierChange, carrierName, alertItems }: LeftNavProps) {
  const alerts = alertItems ?? [
    { color: 'bg-red-500', text: 'HOS exceeds threshold' },
    { color: 'bg-amber-500', text: 'Vehicle maint. rising' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[180px] shrink-0 bg-[#fafbfc] h-screen sticky top-0 overflow-y-auto">
      {/* Brand */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">A</span>
        </div>
        <span className="text-sm font-bold tracking-tight text-ax-text">Axesntra</span>
      </div>

      {/* Carrier Selector */}
      <div className="px-3 pb-4">
        <div className="relative">
          <select
            value={selectedUsdot}
            onChange={(e) => onCarrierChange(e.target.value)}
            className="w-full appearance-none bg-white border border-ax-border rounded-lg pl-3 pr-7 py-2 text-xs font-medium text-ax-text focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer"
          >
            {carrierList.map((c) => (
              <option key={c.usdot} value={c.usdot}>
                {c.carrierName || `DOT ${c.usdot}`}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ax-text-muted pointer-events-none" />
        </div>
      </div>

      {/* Menu label */}
      <div className="px-5 mb-1">
        <p className="text-[10px] font-semibold text-ax-text-muted uppercase tracking-[0.12em]">Menu</p>
      </div>

      {/* Navigation */}
      <nav className="px-3 flex-1">
        <div className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onNavChange(item.id)}
                className={cn(
                  'relative w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors text-left',
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-ax-text-secondary hover:text-ax-text hover:bg-gray-100'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-blue-50 rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon className={cn('h-4 w-4 relative z-10 shrink-0', isActive ? 'text-blue-600' : 'text-ax-text-muted')} />
                <span className="relative z-10 flex-1">{item.label}</span>
                {item.badge !== undefined && (
                  <span className={cn(
                    'relative z-10 text-[10px] font-semibold min-w-[20px] h-[18px] px-1 rounded flex items-center justify-center',
                    isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-600'
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Alerts Section */}
        <div className="mt-8">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Bell className="h-3.5 w-3.5 text-amber-600" />
              <span className="text-xs font-semibold text-amber-800">Alerts</span>
              <span className="ml-auto text-[10px] font-bold text-amber-700 bg-amber-200 rounded px-1.5 py-0.5">
                {alerts.length} new
              </span>
            </div>
            <div className="space-y-1.5">
              {alerts.map((a, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', a.color)} />
                  <span className="text-[11px] text-amber-900">{a.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 space-y-1">
        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] text-ax-text-secondary hover:text-ax-text hover:bg-gray-100 transition-colors">
          <Settings className="h-4 w-4 text-ax-text-muted" />
          <span>Settings</span>
        </button>

        <div className="pt-2 flex items-center gap-2 px-2">
          <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
            NS
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-ax-text truncate">North Star</p>
            <p className="text-[10px] text-ax-text-muted truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* Mobile bottom nav */
interface MobileNavProps {
  activeNav: NavSection;
  onNavChange: (nav: NavSection) => void;
}

export function MobileBottomNav({ activeNav, onNavChange }: MobileNavProps) {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-ax-border z-40 flex">
      {NAV_ITEMS.map((item) => {
        const isActive = activeNav === item.id;
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onNavChange(item.id)}
            className={cn(
              'flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors relative',
              isActive ? 'text-blue-600' : 'text-ax-text-muted'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="mobile-nav-indicator"
                className="absolute top-0 inset-x-4 h-0.5 bg-blue-600 rounded-full"
                transition={{ type: 'spring', bounce: 0.3, duration: 0.4 }}
              />
            )}
            <div className="relative">
              <Icon className="h-5 w-5" />
              {item.badge !== undefined && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                  {item.badge > 9 ? '9+' : item.badge}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
