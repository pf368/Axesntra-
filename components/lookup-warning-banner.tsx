import { Card } from '@/components/ui/card';
import { CircleAlert as AlertCircle, Cloud, Info } from 'lucide-react';

interface LookupWarningBannerProps {
  lookupStatus: string;
}

export function LookupWarningBanner({ lookupStatus }: LookupWarningBannerProps) {
  if (lookupStatus === 'parse_failed') {
    return (
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-blue-900 text-sm mb-1">
              Live Public Lookup Incomplete
            </h3>
            <p className="text-sm text-blue-800">
              We reached the public FMCSA source but could not parse all fields. Some report sections are using fallback or derived data.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (lookupStatus === 'source_unavailable') {
    return (
      <Card className="p-4 bg-amber-50 border-amber-200">
        <div className="flex items-start gap-3">
          <Cloud className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-amber-900 text-sm mb-1">
              Live Data Temporarily Unavailable
            </h3>
            <p className="text-sm text-amber-800">
              The public FMCSA source was temporarily unavailable. This report is using fallback or derived data.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  if (lookupStatus === 'Using demonstration data') {
    return (
      <Card className="p-4 bg-slate-50 border-slate-200">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-slate-600 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-slate-900 text-sm mb-1">
              Demonstration Data
            </h3>
            <p className="text-sm text-slate-700">
              This report is using demonstration data for preview purposes.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return null;
}
