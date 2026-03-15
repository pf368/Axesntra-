import { getTrendColor } from '@/lib/risk-utils';
import { TrendDirection } from '@/lib/types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrendBadgeProps {
  trend: TrendDirection;
  size?: 'sm' | 'md' | 'lg';
}

export function TrendBadge({ trend, size = 'md' }: TrendBadgeProps) {
  const colorClass = getTrendColor(trend);

  const Icon = trend === 'Improving' ? TrendingDown : trend === 'Worsening' ? TrendingUp : Minus;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-semibold rounded border',
        colorClass,
        size === 'sm' && 'text-xs px-2 py-0.5',
        size === 'md' && 'text-sm px-2.5 py-1',
        size === 'lg' && 'text-base px-3 py-1.5'
      )}
    >
      <Icon className={cn(size === 'sm' ? 'h-3 w-3' : 'h-4 w-4')} />
      {trend}
    </span>
  );
}
