import { CircleCheck as CheckCircle2 } from 'lucide-react';

interface ViolationWorkflowStepsProps {
  steps: string[];
  conclusion?: string;
}

export function ViolationWorkflowSteps({ steps, conclusion }: ViolationWorkflowStepsProps) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
        Compliance Workflow
      </p>

      <div className="relative space-y-0">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <div key={i} className="relative flex items-start gap-3 pb-4 last:pb-0">
              {!isLast && (
                <div className="absolute left-[11px] top-6 h-[calc(100%-8px)] w-0.5 bg-slate-200" />
              )}
              <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-teal-400 bg-teal-50">
                <span className="text-[10px] font-bold text-teal-700">{i + 1}</span>
              </div>
              <span className="pt-0.5 text-sm text-slate-700">{step}</span>
            </div>
          );
        })}
      </div>

      {conclusion && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          <p className="text-sm font-medium text-emerald-800">{conclusion}</p>
        </div>
      )}
    </div>
  );
}
