'use client';

import { motion, AnimatePresence } from 'motion/react';
import { Home, ClipboardList, MessageSquare, Settings, HelpCircle, ChevronDown, Truck } from 'lucide-react';
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
  { id: 'home', label: 'Dashboard', icon: Home },
  { id: 'inspections', label: 'Inspections', icon: ClipboardList, badge: 14 },
  { id: 'ai', label: 'AI Assistant', icon: MessageSquare },
];

interface LeftNavProps {
  activeNav: NavSection;
  onNavChange: (nav: NavSection) => void;
  carrierList: CarrierListItem[];
  selectedUsdot: string;
  onCarrierChange: (usdot: string) => void;
  carrierName?: string;
}

export function LeftNav({ activeNav, onNavChange, carrierList, selectedUsdot, onCarrierChange, carrierName }: LeftNavProps) {
  return (
    <aside className="hidden lg:flex flex-col w-[220px] shrink-0 border-r border-ax-border bg-white h-screen sticky top-0 overflow-y-auto">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-ax-border">
        <span className="text-base font-bold tracking-tight text-ax-text">Axesntra</span>
        <span className="ml-1.5 text-xs text-ax-text-muted font-medium">Platform</span>
      </div>

      {/* Carrier Selector */}
      <div className="px-3 py-3 border-b border-ax-border">
        <label className="text-[10px] font-semibold text-ax-text-muted uppercase tracking-wider block mb-1.5 px-2">
          Active Carrier
        </label>
        <div className="relative">
          <select
            value={selectedUsdot}
            onChange={(e) => onCarrierChange(e.target.value)}
            className="w-full appearance-none bg-ax-surface-secondary border border-ax-border rounded-lg pl-3 pr-8 py-2 text-xs font-medium text-ax-text focus:outline-none focus:ring-2 focus:ring-ax-primary/20 focus:border-ax-primary cursor-pointer transition-colors"
          >
            {carrierList.map((c) => (
              <option key={c.usdot} value={c.usdot}>
                {c.carrierName || `DOT ${c.usdot}`}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-ax-text-muted pointer-events-none" />
        </div>
        {carrierName && (
          <div className="flex items-center gap-1.5 mt-2 px-1">
            <Truck className="h-3 w-3 text-ax-text-muted shrink-0" />
            <span className="text-[10px] text-ax-text-muted truncate">{carrierName}</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <div className="relative space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => onNavChange(item.id)}
                className={cn(
                  'relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left',
                  isActive
                    ? 'text-ax-primary bg-ax-primary/8'
                    : 'text-ax-text-secondary hover:text-ax-text hover:bg-ax-border-light'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-ax-primary/8 rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <Icon className={cn('h-4 w-4 relative z-10 shrink-0', isActive ? 'text-ax-primary' : 'text-ax-text-muted')} />
                <span className="relative z-10 flex-1">{item.label}</span>
                {item.badge !== undefined && (
                  <Badge variant={isActive ? 'default' : 'secondary'} className="relative z-10 text-[10px] h-4 px-1.5 font-mono">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </div>

        {/* Alerts Section */}
        <div className="mt-6">
          <p className="text-[10px] font-semibold text-ax-text-muted uppercase tracking-wider px-3 mb-2">
            Alerts
          </p>
          <div className="space-y-1">
            <AlertItem dot="bg-red-500" text="2 OOS violations detected" />
            <AlertItem dot="bg-amber-500" text="SMS score trending up" />
            <AlertItem dot="bg-blue-500" text="Renewal in 47 days" />
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-ax-border space-y-0.5">
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-ax-text-secondary hover:text-ax-text hover:bg-ax-border-light transition-colors">
          <Settings className="h-4 w-4 text-ax-text-muted" />
          <span>Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-ax-text-secondary hover:text-ax-text hover:bg-ax-border-light transition-colors">
          <HelpCircle className="h-4 w-4 text-ax-text-muted" />
          <span>Help & Support</span>
        </button>
        <div className="mt-2 pt-2 border-t border-ax-border flex items-center gap-2.5 px-1">
          <div className="w-7 h-7 rounded-full bg-ax-primary/10 flex items-center justify-center text-ax-primary text-xs font-bold shrink-0">
            SM
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-ax-text truncate">Safety Manager</p>
            <p className="text-[10px] text-ax-text-muted truncate">admin@axesntra.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

function AlertItem({ dot, text }: { dot: string; text: string }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-ax-border-light cursor-pointer">
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dot)} />
      <span className="text-xs text-ax-text-secondary truncate">{text}</span>
    </div>
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
              isActive ? 'text-ax-primary' : 'text-ax-text-muted'
            )}
          >
            {isActive && (
              <motion.div
                layoutId="mobile-nav-indicator"
                className="absolute top-0 inset-x-4 h-0.5 bg-ax-primary rounded-full"
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
