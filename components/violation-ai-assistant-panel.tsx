'use client';

import { ViolationAiResponse } from '@/lib/violation-scenarios';
import { ViolationResponseSectionCard } from '@/components/violation-response-section';
import { ViolationComplianceProgramBox } from '@/components/violation-compliance-program-box';
import { ViolationActionChecklist } from '@/components/violation-action-checklist';
import { ViolationWorkflowSteps } from '@/components/violation-workflow-steps';
import { Sparkles } from 'lucide-react';

interface ViolationAiAssistantPanelProps {
  response: ViolationAiResponse;
}

export function ViolationAiAssistantPanel({ response }: ViolationAiAssistantPanelProps) {
  return (
    <div className="bg-gradient-to-b from-slate-50 to-white px-6 py-6">
      <div className="mb-5 flex items-center gap-2 border-b border-slate-200 pb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-100">
          <Sparkles className="h-4 w-4 text-teal-600" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
            AI Violation Analysis
          </p>
          <p className="text-xs text-slate-500">{response.promptLabel}</p>
        </div>
      </div>

      <div className="space-y-4">
        {response.sections.map((section) => (
          <ViolationResponseSectionCard key={section.id} section={section} />
        ))}
      </div>

      {response.workflowSteps && response.workflowSteps.length > 0 && (
        <div className="mt-5">
          <ViolationWorkflowSteps
            steps={response.workflowSteps}
            conclusion={response.workflowConclusion}
          />
        </div>
      )}

      {response.complianceProgram && (
        <div className="mt-5">
          <ViolationComplianceProgramBox program={response.complianceProgram} />
        </div>
      )}

      {response.immediateActions && response.immediateActions.length > 0 && (
        <div className="mt-5">
          <ViolationActionChecklist actions={response.immediateActions} />
        </div>
      )}
    </div>
  );
}
