'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { ViolationScenario } from '@/lib/violation-scenarios';
import { ViolationAiAssistantPanel } from '@/components/violation-ai-assistant-panel';
import { TriangleAlert as AlertTriangle, Sparkles, ShieldAlert, Tag, ChevronDown, ChevronUp } from 'lucide-react';

interface ViolationScenarioCardProps {
  scenario: ViolationScenario;
}

function SeverityBadge({ severity }: { severity: ViolationScenario['severity'] }) {
  const styles = {
    OOS: 'bg-red-100 text-red-800 border-red-200',
    'Non-OOS': 'bg-amber-100 text-amber-800 border-amber-200',
    Warning: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${styles[severity]}`}
    >
      {severity === 'OOS' && <AlertTriangle className="h-3 w-3" />}
      {severity}
    </span>
  );
}

export function ViolationScenarioCard({ scenario }: ViolationScenarioCardProps) {
  const [activePrompt, setActivePrompt] = useState<string | null>(null);

  const promptKeys = Object.keys(scenario.aiResponses);
  const activeResponse = activePrompt ? scenario.aiResponses[activePrompt] : null;

  const handlePromptClick = (key: string) => {
    setActivePrompt(activePrompt === key ? null : key);
  };

  return (
    <Card className="overflow-hidden border-l-4 border-l-red-500">
      <div className="p-6">
        <div className="mb-5 flex items-start gap-4">
          <div className="rounded-xl bg-red-50 p-3">
            <ShieldAlert className="h-6 w-6 text-red-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded bg-slate-900 px-2 py-0.5 font-mono text-xs font-bold text-white">
                {scenario.code}
              </span>
              <SeverityBadge severity={scenario.severity} />
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Tag className="h-3 w-3" />
                {scenario.category}
              </span>
            </div>
            <h3 className="mb-2 text-sm font-semibold leading-snug text-slate-900">
              {scenario.title}
            </h3>
            <p className="text-sm leading-relaxed text-slate-600">{scenario.summary}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {promptKeys.map((key) => {
            const response = scenario.aiResponses[key];
            const isActive = activePrompt === key;
            return (
              <button
                key={key}
                onClick={() => handlePromptClick(key)}
                className={`group flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? 'border-teal-400 bg-teal-50 text-teal-800 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700'
                }`}
              >
                <Sparkles
                  className={`h-3.5 w-3.5 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-teal-600' : 'text-teal-500'
                  }`}
                />
                {response.promptLabel}
                {isActive ? (
                  <ChevronUp className="h-3 w-3" />
                ) : (
                  <ChevronDown className="h-3 w-3" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`grid transition-all duration-500 ease-in-out ${
          activeResponse ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          {activeResponse && (
            <div className="border-t border-slate-200">
              <ViolationAiAssistantPanel response={activeResponse} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
