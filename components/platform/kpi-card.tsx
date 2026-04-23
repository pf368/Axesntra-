import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  status?: 'good' | 'warning' | 'danger' | 'neutral';
  className?: string;
  icon?: React.ReactNode;
}

const statusStyles = {
  good: 'text-emerald-600',
  warning: 'text-amber-600',
  danger: 'text-red-600',
  neutral: 'text-ax-text',
};

export function KpiCard({ label, value, subtext, trend, trendLabel, status = 'neutral', className, icon }: KpiCardProps) {
  return (
    <div className={cn('bg-white rounded-xl border border-ax-border p-4', className)}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-xs font-medium text-ax-text-muted uppercase tracking-wider leading-tight">{label}</span>
        {icon && <span className="text-ax-text-muted flex-shrink-0">{icon}</span>}
      </div>
      <div className={cn('text-2xl font-bold font-mono leading-none mb-1', statusStyles[status])}>
        {value}
      </div>
      {(subtext || trend) && (
        <div className="flex items-center gap-1.5 mt-1.5">
          {trend && (
            <span className={cn(
              'flex items-center gap-0.5 text-xs font-medium',
              trend === 'up' ? 'text-red-500' : trend === 'down' ? 'text-emerald-600' : 'text-ax-text-muted'
            )}>
              {trend === 'up' ? <TrendingUp className="h-3 w-3" /> : trend === 'down' ? <TrendingDown className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
              {trendLabel}
            </span>
          )}
          {subtext && <span className="text-xs text-ax-text-muted">{subtext}</span>}
        </div>
      )}
    </div>
  );
}
