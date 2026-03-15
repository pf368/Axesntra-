import { Card } from '@/components/ui/card';
import { Info, Database, Calendar } from 'lucide-react';
import { DataSource } from '@/lib/types';

interface SourceMetadataCardProps {
  source: DataSource;
  lastRefreshed: string;
  sourceNotes?: string[];
  dataCoverage?: string[];
}

function getSourceBadge(source: DataSource) {
  switch (source) {
    case 'public-live':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full border border-blue-200">
          <Database className="h-3 w-3" />
          Public Live Data
        </span>
      );
    case 'hybrid':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full border border-emerald-200">
          <Database className="h-3 w-3" />
          Hybrid: Public + Derived
        </span>
      );
    case 'mock':
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 text-slate-700 text-xs font-medium rounded-full border border-slate-200">
          <Database className="h-3 w-3" />
          Demo Data
        </span>
      );
  }
}

export function SourceMetadataCard({
  source,
  lastRefreshed,
  sourceNotes,
  dataCoverage,
}: SourceMetadataCardProps) {
  const formattedDate = new Date(lastRefreshed).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="p-5 bg-gradient-to-br from-slate-50 to-white border-slate-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Info className="h-5 w-5 text-slate-600" />
          <h3 className="font-semibold text-slate-900">Report Metadata</h3>
        </div>
        {getSourceBadge(source)}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-slate-500" />
          <span className="text-slate-600">Last refreshed:</span>
          <span className="text-slate-900 font-medium">{formattedDate}</span>
        </div>

        {sourceNotes && sourceNotes.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
              Data Sources
            </h4>
            <ul className="space-y-1.5">
              {sourceNotes.map((note, index) => (
                <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-slate-400 mt-0.5">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {dataCoverage && dataCoverage.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
              Coverage Details
            </h4>
            <ul className="space-y-1.5">
              {dataCoverage.map((item, index) => (
                <li key={index} className="text-sm text-slate-600 flex items-start gap-2">
                  <span className="text-slate-400 mt-0.5">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-500 leading-relaxed">
            This is an internal screening-oriented brief based on public data sources.
            Not an official FMCSA safety rating, legal opinion, or underwriting decision.
          </p>
        </div>
      </div>
    </Card>
  );
}
