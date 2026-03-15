import { getRiskColor } from '@/lib/risk-utils';
import { RiskLevel } from '@/lib/types';
import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  risk: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskBadge({ risk, size = 'md' }: RiskBadgeProps) {
  const colorClass = getRiskColor(risk);

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded border',
        colorClass,
        size === 'sm' && 'text-xs px-2 py-0.5',
        size === 'md' && 'text-sm px-2.5 py-1',
        size === 'lg' && 'text-base px-3 py-1.5'
      )}
    >
      {risk}
    </span>
  );
}
