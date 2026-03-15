import { Card } from '@/components/ui/card';
import { RiskBadge } from '@/components/risk-badge';
import { TrendBadge } from '@/components/trend-badge';
import { CarrierBrief } from '@/lib/types';
import { Building2, Truck, Users, Calendar } from 'lucide-react';

interface CarrierHeaderCardProps {
  data: CarrierBrief;
}

export function CarrierHeaderCard({ data }: CarrierHeaderCardProps) {
  return (
    <Card className="p-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <RiskBadge risk={data.overallRisk} size="lg" />
            <TrendBadge trend={data.trend} size="lg" />
            <span className="text-sm text-slate-500 border border-slate-200 px-2.5 py-1 rounded">
              {data.confidence} Confidence
            </span>
          </div>
          <p className="text-slate-700 leading-relaxed text-sm">{data.executiveMemo}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <div>
              <div className="text-slate-500 text-xs">Status</div>
              <div className="font-medium text-slate-900">{data.status}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Truck className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <div>
              <div className="text-slate-500 text-xs">Power Units</div>
              <div className="font-medium text-slate-900">{data.powerUnits}</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <div>
              <div className="text-slate-500 text-xs">Drivers</div>
              <div className="font-medium text-slate-900">{data.drivers}</div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-slate-400 flex-shrink-0" />
            <div>
              <div className="text-slate-500 text-xs">MCS-150 Updated</div>
              <div className="font-medium text-slate-900">{data.mcs150Updated}</div>
            </div>
          </div>
          <div className="text-sm">
            <div className="text-slate-500 text-xs mb-1">Operation Type</div>
            <div className="font-medium text-slate-900">{data.operationType}</div>
          </div>
          <div className="text-sm">
            <div className="text-slate-500 text-xs mb-1">Data Freshness</div>
            <div className="font-medium text-slate-900 text-xs">{data.dataFreshness}</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
