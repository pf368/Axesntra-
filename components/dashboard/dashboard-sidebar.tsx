'use client';

import {
  Truck,
  TriangleAlert,
  ClipboardCheck,
  ClipboardList,
  Sparkles,
  Settings,
  HelpCircle,
} from 'lucide-react';

export type DashboardTab = 'overview' | 'violations' | 'inspections' | 'remediation' | 'ai';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
}

const NAV_ITEMS: { id: DashboardTab; icon: typeof Truck; label: string }[] = [
  { id: 'overview', icon: Truck, label: 'Overview' },
  { id: 'violations', icon: TriangleAlert, label: 'Violations' },
  { id: 'inspections', icon: ClipboardCheck, label: 'Inspections' },
  { id: 'remediation', icon: ClipboardList, label: 'Remediation' },
  { id: 'ai', icon: Sparkles, label: 'AI Advisor' },
];

export function DashboardSidebar({ activeTab, onTabChange }: DashboardSidebarProps) {
  return (
    <>
      {/* Desktop: vertical icon rail */}
      <nav className="hidden lg:flex flex-col items-center py-4 h-full border-r border-on-surface/[0.06]">
        <div className="flex flex-col items-center gap-1 flex-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                title={item.label}
                className={`group relative flex h-10 w-10 items-center justify-center rounded-lg transition-all ${
                  isActive
                    ? 'bg-indigo/10 text-indigo'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.2 : 1.8} />
                {/* Tooltip */}
                <span className="pointer-events-none absolute left-full ml-2 rounded-md bg-foreground px-2 py-1 text-[11px] font-medium text-background opacity-0 shadow-ambient transition-opacity group-hover:opacity-100 whitespace-nowrap z-50">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col items-center gap-1 mt-auto">
          <button className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors" title="Settings">
            <Settings className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container transition-colors" title="Help">
            <HelpCircle className="h-[18px] w-[18px]" strokeWidth={1.8} />
          </button>
        </div>
      </nav>

      {/* Mobile: horizontal bottom bar */}
      <nav className="lg:hidden flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 transition-colors ${
                isActive
                  ? 'text-indigo'
                  : 'text-on-surface-variant'
              }`}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="text-[9px] font-medium tracking-wider uppercase">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
