import { cn } from '@/lib/utils';
import { Info, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react';

interface InsightCardProps {
  children: React.ReactNode;
  variant?: 'info' | 'warning' | 'success';
}

export function InsightCard({ children, variant = 'info' }: InsightCardProps) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  };

  const icons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle,
  };

  const Icon = icons[variant];

  return (
    <div className={cn('flex items-start gap-3 rounded-lg border p-4', styles[variant])}>
      <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
      <p className="text-sm">{children}</p>
    </div>
  );
}
