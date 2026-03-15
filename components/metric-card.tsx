import { Card } from '@/components/ui/card';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  subtitle?: string;
  icon?: LucideIcon;
}

export function MetricCard({ title, value, delta, deltaPositive, subtitle, icon: Icon }: MetricCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-medium text-slate-600">{title}</span>
        {Icon && (
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
            <Icon className="h-4 w-4 text-slate-500" />
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-900 mb-1">{value}</div>
      {delta && (
        <div className={cn('text-xs font-medium', deltaPositive ? 'text-emerald-600' : 'text-red-600')}>
          {delta}
        </div>
      )}
      {subtitle && <div className="text-xs text-slate-500 mt-1">{subtitle}</div>}
    </Card>
  );
}
