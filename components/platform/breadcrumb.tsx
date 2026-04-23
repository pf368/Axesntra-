import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbProps {
  items: { label: string; onClick?: () => void }[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn('flex items-center gap-1.5 text-sm', className)} aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-ax-text-muted flex-shrink-0" />}
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="text-ax-primary hover:text-ax-primary-hover font-medium transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className={i === items.length - 1 ? 'text-ax-text font-semibold' : 'text-ax-text-secondary'}>
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
