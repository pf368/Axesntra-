import { cn } from '@/lib/utils';

interface ScoreBadgeProps {
  score: number;
  threshold?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

function getScoreStatus(score: number, threshold = 65): { label: string; color: string; bg: string; dot: string } {
  if (score === 0) return { label: 'No Data', color: 'text-ax-text-muted', bg: 'bg-gray-50', dot: 'bg-gray-300' };
  if (score < threshold * 0.6) return { label: 'Good', color: 'text-emerald-700', bg: 'bg-emerald-50', dot: 'bg-emerald-500' };
  if (score < threshold) return { label: 'Monitor', color: 'text-amber-700', bg: 'bg-amber-50', dot: 'bg-amber-500' };
  if (score < threshold * 1.2) return { label: 'Alert', color: 'text-orange-700', bg: 'bg-orange-50', dot: 'bg-orange-500' };
  return { label: 'Critical', color: 'text-red-700', bg: 'bg-red-50', dot: 'bg-red-500' };
}

export function ScoreBadge({ score, threshold = 65, size = 'sm', showLabel = false, className }: ScoreBadgeProps) {
  const status = getScoreStatus(score, threshold);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5 font-semibold',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        status.bg,
        status.color,
        sizeClasses[size],
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', status.dot)} />
      {showLabel ? status.label : score.toFixed(1)}
    </span>
  );
}

export function getScoreColor(score: number, threshold = 65): string {
  if (score === 0) return 'text-ax-text-muted';
  if (score < threshold * 0.6) return 'text-emerald-600';
  if (score < threshold) return 'text-amber-600';
  if (score < threshold * 1.2) return 'text-orange-600';
  return 'text-red-600';
}

export function getScoreStatusLabel(score: number, threshold = 65): string {
  return getScoreStatus(score, threshold).label;
}

export function getScoreBg(score: number, threshold = 65): string {
  return getScoreStatus(score, threshold).bg;
}
