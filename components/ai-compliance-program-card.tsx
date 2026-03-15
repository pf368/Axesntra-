'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ComplianceProgram } from '@/lib/ai-advisory';
import { Sparkles, Shield, ChevronDown, ChevronUp, CircleCheck as CheckCircle2 } from 'lucide-react';

interface AiComplianceProgramCardProps {
  programs: ComplianceProgram[];
}

const categoryColors: Record<string, { border: string; bg: string; text: string; badge: string }> = {
  Maintenance: { border: 'border-l-red-500', bg: 'bg-red-50', text: 'text-red-700', badge: 'bg-red-100 text-red-700 border-red-200' },
  Driver: { border: 'border-l-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  Hazmat: { border: 'border-l-orange-500', bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700 border-orange-200' },
  Crash: { border: 'border-l-rose-500', bg: 'bg-rose-50', text: 'text-rose-700', badge: 'bg-rose-100 text-rose-700 border-rose-200' },
  General: { border: 'border-l-slate-500', bg: 'bg-slate-50', text: 'text-slate-700', badge: 'bg-slate-100 text-slate-700 border-slate-200' },
};

export function AiComplianceProgramCards({ programs }: AiComplianceProgramCardProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
          <Shield className="h-4 w-4 text-teal-700" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Recommended Compliance Programs</h2>
          <p className="text-xs text-slate-500">AI-generated programs based on identified risk areas</p>
        </div>
      </div>

      <div className="space-y-3">
        {programs.map((program, index) => {
          const colors = categoryColors[program.category] || categoryColors.General;
          const isExpanded = expandedIndex === index;

          return (
            <Card
              key={index}
              className={`overflow-hidden border-l-4 ${colors.border} transition-shadow hover:shadow-md`}
            >
              <button
                onClick={() => setExpandedIndex(isExpanded ? null : index)}
                className="flex w-full items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${colors.bg}`}>
                    <Sparkles className={`h-4 w-4 ${colors.text}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`rounded border px-2 py-0.5 text-xs font-medium ${colors.badge}`}>
                        {program.category}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{program.title}</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-slate-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <div className="border-t border-slate-100 px-5 pb-5 pt-4">
                    <p className="mb-4 text-sm text-slate-600">{program.description}</p>

                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Program Components
                    </p>
                    <div className="mb-4 space-y-2">
                      {program.components.map((component, i) => (
                        <div key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
                          <p className="text-sm text-slate-700">{component}</p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                        Expected Outcome
                      </p>
                      <p className="text-sm text-emerald-800">{program.expectedOutcome}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
