'use client';

import { LineChart, Line, ResponsiveContainer } from 'recharts';

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
  width?: number | string;
}

export function Sparkline({ data, color = '#4f39f6', height = 40, width = '100%' }: SparklineProps) {
  const chartData = data.map((value, i) => ({ i, value }));

  return (
    <ResponsiveContainer width={width} height={height}>
      <LineChart data={chartData} margin={{ top: 2, right: 2, bottom: 2, left: 2 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface MiniBarSparklineProps {
  data: number[];
  threshold?: number;
  height?: number;
}

export function MiniBarSparkline({ data, threshold = 65, height = 32 }: MiniBarSparklineProps) {
  const max = Math.max(...data, threshold);
  const isAboveThreshold = data[data.length - 1] >= threshold;

  return (
    <div className="flex items-end gap-0.5" style={{ height }}>
      {data.map((v, i) => {
        const pct = Math.max((v / max) * 100, 4);
        const isLast = i === data.length - 1;
        return (
          <div
            key={i}
            className="flex-1 rounded-sm transition-all"
            style={{
              height: `${pct}%`,
              background: isLast
                ? isAboveThreshold ? '#ef4444' : '#4f39f6'
                : isAboveThreshold ? '#fca5a5' : '#c7d2fe',
            }}
          />
        );
      })}
    </div>
  );
}
