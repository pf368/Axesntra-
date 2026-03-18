'use client';

import { useState } from 'react';
import { IssueExplanation } from '@/lib/ai-advisory';
import { Sparkles, ChevronDown, ChevronUp, Search, Shield, Lightbulb, ArrowRight, Info, Zap } from 'lucide-react';

interface AiIssueInsightCardProps {
  issue: IssueExplanation;
  triggerLabel?: string;
}

export function AiIssueInsightCard({ issue, triggerLabel = 'Ask AI: Why is this a problem?' }: AiIssueInsightCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-3">
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-2 rounded-md border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700 transition-all hover:border-teal-300 hover:bg-teal-100"
      >
        <Sparkles className="h-3 w-3 text-teal-600 transition-transform group-hover:scale-110" />
        {triggerLabel}
        {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      </button>

      <div
        className={`grid transition-all duration-300 ease-in-out ${
          open ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5">
            <div className="mb-4 flex items-center gap-2 border-b border-slate-200 pb-3">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-teal-100">
                <Sparkles className="h-3.5 w-3.5 text-teal-600" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                  AI Analysis: {issue.issueType}
                </p>
                {issue.summary && (
                  <p className="mt-0.5 text-xs text-slate-500">{issue.summary}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">

              {/* Section 1: What this means */}
              {issue.meaning && (
                <div>
                  <div className="mb-1.5 flex items-center gap-1.5">
                    <Info className="h-3.5 w-3.5 text-slate-500" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      What This Means
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-700">{issue.meaning}</p>
                </div>
              )}

              {/* Section 2: Root Cause */}
              <div>
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Search className="h-3.5 w-3.5 text-slate-500" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Likely Root Cause
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{issue.rootCause}</p>
              </div>

              {/* Section 3: Why It Matters */}
              <div>
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-slate-500" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Why It Matters
                  </p>
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{issue.whyItMatters}</p>
              </div>

              {/* Section 4: How to Prevent It */}
              <div>
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5 text-slate-500" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    How to Prevent It
                  </p>
                </div>
                <ul className="space-y-1.5">
                  {(issue.preventionSteps ?? issue.recommendedActions).map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[10px] font-bold text-teal-700">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Section 5: Suggested Controls */}
              <div>
                <div className="mb-1.5 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-slate-500" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Suggested Controls
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {issue.suggestedControls.map((control, i) => (
                    <span
                      key={i}
                      className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
                    >
                      {control}
                    </span>
                  ))}
                </div>
              </div>

              {/* Section 6: Immediate Actions */}
              {issue.immediateActions && issue.immediateActions.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <div className="mb-2 flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-amber-600" />
                    <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                      Immediate Next Actions
                    </p>
                  </div>
                  <ul className="space-y-1.5">
                    {issue.immediateActions.map((action, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-amber-900">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-amber-800">
                          {i + 1}
                        </span>
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Best Next Step */}
              <div className="rounded-lg border border-teal-200 bg-teal-50 p-3">
                <div className="mb-1 flex items-center gap-1.5">
                  <ArrowRight className="h-3.5 w-3.5 text-teal-600" />
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                    Best Next Step
                  </p>
                </div>
                <p className="text-sm font-medium text-teal-800">{issue.bestNextStep}</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
