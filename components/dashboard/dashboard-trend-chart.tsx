'use client';

import { TrendData } from '@/lib/types';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

interface DashboardTrendChartProps {
  data: TrendData;
}

export function DashboardTrendChart({ data }: DashboardTrendChartProps) {
  // Merge vehicle OOS and driver OOS into a single dataset
  const chartData = data.vehicleOOS.map((v, i) => ({
    month: v.month,
    compliance: v.value,
    aiRisk: data.driverOOS[i]?.value ?? 0,
  }));

  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.08em] text-foreground">
            Safety Measure Over Time
          </h2>
          <p className="mt-0.5 text-xs text-on-surface-variant">
            Aggregated trend analysis for trailing 12 months
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-indigo" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">Compliance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-ai-teal" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">AI Risk Model</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-surface-panel p-4 shadow-ambient">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(220, 13%, 93%)"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 10, fontFamily: 'var(--font-mono)', fill: 'hsl(240, 6%, 30%)' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fontFamily: 'var(--font-mono)', fill: 'hsl(240, 6%, 30%)' }}
              tickLine={false}
              axisLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                fontSize: 11,
                fontFamily: 'var(--font-mono)',
                borderRadius: 8,
                border: 'none',
                boxShadow: '0px 4px 20px rgba(100, 116, 139, 0.12)',
                padding: '8px 12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="compliance"
              name="Compliance"
              stroke="hsl(245, 72%, 48%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(245, 72%, 48%)' }}
            />
            <Line
              type="monotone"
              dataKey="aiRisk"
              name="AI Risk Model"
              stroke="hsl(173, 100%, 21%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(173, 100%, 21%)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
