import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, CircleAlert as AlertCircle, Cloud, FileQuestion } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export function EmptyState({
  title = 'No results found',
  description = 'Try searching with a different USDOT number',
  actionLabel = 'Back to Search',
  actionHref = '/',
}: EmptyStateProps) {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className="p-12 text-center">
        <div className="rounded-full bg-slate-100 p-6 w-fit mx-auto mb-6">
          <Search className="h-12 w-12 text-slate-400" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-3">{title}</h2>
        <p className="text-slate-600 mb-8">{description}</p>
        <Button asChild>
          <Link href={actionHref}>{actionLabel}</Link>
        </Button>
      </Card>
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'We encountered an error loading carrier data. Please try again.',
  actionLabel = 'Try Again',
  onRetry,
}: {
  title?: string;
  description?: string;
  actionLabel?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className="p-12 text-center border-red-200 bg-red-50">
        <div className="rounded-full bg-red-100 p-6 w-fit mx-auto mb-6">
          <AlertCircle className="h-12 w-12 text-red-600" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-3">{title}</h2>
        <p className="text-slate-600 mb-8">{description}</p>
        {onRetry && (
          <Button onClick={onRetry} variant="destructive">
            {actionLabel}
          </Button>
        )}
      </Card>
    </div>
  );
}

export function SourceUnavailableState({
  usdot,
  message,
  onRetry,
  onViewSample,
}: {
  usdot: string;
  message: string;
  onRetry?: () => void;
  onViewSample?: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className="p-12 text-center border-amber-200 bg-amber-50">
        <div className="rounded-full bg-amber-100 p-6 w-fit mx-auto mb-6">
          <Cloud className="h-12 w-12 text-amber-600" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-3">Live Data Unavailable</h2>
        <p className="text-slate-700 mb-2 font-medium">USDOT {usdot}</p>
        <p className="text-slate-600 mb-8">{message}</p>
        <div className="flex gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              Try Again
            </Button>
          )}
          {onViewSample && (
            <Button onClick={onViewSample}>
              View Sample Report
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export function ParseFailedState({
  usdot,
  message,
  onRetry,
  onViewSample,
}: {
  usdot: string;
  message: string;
  onRetry?: () => void;
  onViewSample?: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-16 max-w-2xl">
      <Card className="p-12 text-center border-blue-200 bg-blue-50">
        <div className="rounded-full bg-blue-100 p-6 w-fit mx-auto mb-6">
          <FileQuestion className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-3">Live Lookup Incomplete</h2>
        <p className="text-slate-700 mb-2 font-medium">USDOT {usdot}</p>
        <p className="text-slate-600 mb-8">{message}</p>
        <div className="flex gap-3 justify-center">
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              Try Again
            </Button>
          )}
          {onViewSample && (
            <Button onClick={onViewSample}>
              View Sample Report
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
