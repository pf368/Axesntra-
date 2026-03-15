'use client';

import { Card } from '@/components/ui/card';
import { TrendData } from '@/lib/types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TrendChartsProps {
  data: TrendData;
}

export function TrendCharts({ data }: TrendChartsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="p-5">
        <h3 className="font-semibold text-slate-900 mb-4 text-sm">Vehicle & Driver OOS Rate (%)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.vehicleOOS.map((v, i) => ({
            month: v.month,
            vehicleOOS: v.value,
            driverOOS: data.driverOOS[i]?.value,
          }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} interval={2} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Line type="monotone" dataKey="vehicleOOS" stroke="#ef4444" name="Vehicle OOS" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="driverOOS" stroke="#3b82f6" name="Driver OOS" dot={false} strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Card className="p-5">
        <h3 className="font-semibold text-slate-900 mb-4 text-sm">Inspections vs Violations</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data.inspections}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} interval={2} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar dataKey="value" fill="#94a3b8" name="Inspections" />
            <Bar dataKey="violations" fill="#ef4444" name="Violations" />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
