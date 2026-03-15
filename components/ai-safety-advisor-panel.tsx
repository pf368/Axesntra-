'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { AiInsight } from '@/lib/ai-advisory';
import { Sparkles, ChevronDown, ChevronUp, TriangleAlert as AlertTriangle, Target, Zap, ArrowRight } from 'lucide-react';

interface AiSafetyAdvisorPanelProps {
  insight: AiInsight;
}

export function AiSafetyAdvisorPanel({ insight }: AiSafetyAdvisorPanelProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <Card className="relative overflow-hidden border-l-4 border-l-teal-600 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white shadow-lg">
      <div className="absolute right-0 top-0 h-64 w-64 -translate-y-16 translate-x-16 rounded-full bg-teal-600/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-12 translate-y-12 rounded-full bg-teal-600/5 blur-2xl" />

      <div className="relative p-6">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600/20">
              <Sparkles className="h-5 w-5 text-teal-400" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-teal-400">
                AI Safety Advisor
              </p>
              <p className="text-lg font-semibold text-white">Risk Analysis & Recommendations</p>
            </div>
          </div>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-slate-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-slate-400" />
          )}
        </button>

        <div
          className={`grid transition-all duration-300 ease-in-out ${
            expanded ? 'mt-6 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
          }`}
        >
          <div className="overflow-hidden">
            <div className="mb-6 rounded-lg border border-red-500/30 bg-red-950/40 p-4">
              <div className="mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-400" />
                <p className="text-xs font-semibold uppercase tracking-wider text-red-400">
                  Top Risk Signal Detected
                </p>
              </div>
              <p className="text-base font-semibold text-white">{insight.topSignal}</p>
            </div>

            <div className="mb-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Why It Matters
              </p>
              <p className="text-sm leading-relaxed text-slate-300">{insight.whyItMatters}</p>
            </div>

            <div className="mb-6">
              <div className="mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-teal-400" />
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-400">
                  Recommended Immediate Actions
                </p>
              </div>
              <div className="space-y-2">
                {insight.immediateActions.map((action, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg bg-white/5 px-4 py-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-600/30 text-xs font-bold text-teal-400">
                      {i + 1}
                    </span>
                    <p className="text-sm text-slate-300">{action}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                    Operational Fix
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">{insight.operationalFix}</p>
              </div>

              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <ArrowRight className="h-4 w-4 text-emerald-400" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                    Estimated Impact
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-slate-300">{insight.estimatedImpact}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
