import { Brain, TrendingUp, AlertTriangle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AiQuadrant {
  label: string;
  content: string;
  type: 'summary' | 'trend' | 'risk' | 'action';
}

interface AiAnalysisPanelProps {
  basicName: string;
  score: number;
  threshold: number;
  quadrants?: AiQuadrant[];
  className?: string;
}

const quadrantIcons = {
  summary: Brain,
  trend: TrendingUp,
  risk: AlertTriangle,
  action: Lightbulb,
};

const quadrantColors = {
  summary: 'text-ax-primary bg-ax-primary/5',
  trend: 'text-blue-600 bg-blue-50',
  risk: 'text-amber-600 bg-amber-50',
  action: 'text-emerald-600 bg-emerald-50',
};

const defaultQuadrants = (basicName: string, score: number, threshold: number): AiQuadrant[] => [
  {
    label: 'AI Summary',
    type: 'summary',
    content: score >= threshold
      ? `${basicName} score of ${score.toFixed(1)} exceeds the ${threshold} threshold, requiring immediate attention. Violations in this category are actively impacting your SMS percentile.`
      : `${basicName} score of ${score.toFixed(1)} is currently below the ${threshold} alert threshold. Continued monitoring is recommended to prevent upward drift.`,
  },
  {
    label: 'Trend Analysis',
    type: 'trend',
    content: 'Based on recent inspection data, violation frequency has been tracked over the past 12 months. Drivers with multiple prior violations show elevated recurrence patterns.',
  },
  {
    label: 'Risk Factors',
    type: 'risk',
    content: score >= threshold
      ? 'Active intervention required. High-severity violations in this category carry multiplied BASIC weights and can trigger intervention notices from FMCSA.'
      : 'Monitor for new violations that could shift your percentile upward. Early corrective action programs are more effective than reactive remediation.',
  },
  {
    label: 'Recommended Actions',
    type: 'action',
    content: 'Review driver records for highest-risk individuals. Implement targeted training for specific violation codes. Document corrective actions to demonstrate good faith compliance.',
  },
];

export function AiAnalysisPanel({ basicName, score, threshold, quadrants, className }: AiAnalysisPanelProps) {
  const panels = quadrants ?? defaultQuadrants(basicName, score, threshold);

  return (
    <div className={cn('bg-white rounded-xl border border-ax-border overflow-hidden', className)}>
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-ax-border bg-ax-surface-secondary">
        <div className="w-6 h-6 rounded-md bg-ax-primary/10 flex items-center justify-center">
          <Brain className="h-3.5 w-3.5 text-ax-primary" />
        </div>
        <span className="text-xs font-semibold text-ax-text uppercase tracking-wider">AI Safety Analysis</span>
        <span className="ml-auto text-[10px] font-medium text-ax-primary bg-ax-primary/10 px-2 py-0.5 rounded-full">Live</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-ax-border">
        {panels.map((q) => {
          const Icon = quadrantIcons[q.type];
          const colorClass = quadrantColors[q.type];
          return (
            <div key={q.type} className="p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className={cn('flex items-center justify-center w-5 h-5 rounded', colorClass)}>
                  <Icon className="h-3 w-3" />
                </span>
                <span className="text-xs font-semibold text-ax-text">{q.label}</span>
              </div>
              <p className="text-sm text-ax-text-secondary leading-relaxed">{q.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
