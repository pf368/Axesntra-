'use client';

interface BasicScoreCardProps {
  label: string;
  score: number;
  status: 'GOOD' | 'WARNING' | 'ALERT';
  bars?: number[];
}

const STATUS_STYLES = {
  GOOD: 'bg-ai-teal/10 text-ai-teal',
  WARNING: 'bg-amber-50 text-amber-600',
  ALERT: 'bg-red-50 text-red-600',
};

const BAR_COLORS = {
  GOOD: ['bg-ai-teal/20', 'bg-ai-teal/30', 'bg-ai-teal/40', 'bg-ai-teal/50', 'bg-ai-teal/60', 'bg-ai-teal/70', 'bg-ai-teal/80', 'bg-ai-teal'],
  WARNING: ['bg-amber-100', 'bg-amber-200', 'bg-amber-300', 'bg-amber-400', 'bg-amber-500', 'bg-red-300', 'bg-red-400', 'bg-red-500'],
  ALERT: ['bg-red-100', 'bg-red-200', 'bg-red-300', 'bg-red-400', 'bg-red-500', 'bg-red-500', 'bg-red-600', 'bg-red-700'],
};

export function BasicScoreCard({ label, score, status, bars }: BasicScoreCardProps) {
  const displayBars = bars || generateBars(score, status);

  return (
    <div className="rounded-xl bg-surface-panel p-4 shadow-ambient">
      <p className="font-mono text-[10px] font-medium uppercase tracking-[0.12em] text-on-surface-variant">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="font-mono text-2xl font-semibold tracking-tight text-foreground">
          {score.toFixed(1)}
        </span>
        <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[status]}`}>
          {status}
        </span>
      </div>
      {/* Mini bar chart */}
      <div className="mt-3 flex items-end gap-[3px] h-5">
        {displayBars.map((height, i) => (
          <div
            key={i}
            className={`flex-1 rounded-sm ${BAR_COLORS[status][i % BAR_COLORS[status].length]}`}
            style={{ height: `${Math.max(height, 10)}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function generateBars(score: number, status: string): number[] {
  const base = Math.min(score, 100);
  return Array.from({ length: 8 }, (_, i) => {
    const noise = Math.sin(i * 1.5 + score) * 20;
    return Math.max(10, Math.min(100, base + noise));
  });
}
