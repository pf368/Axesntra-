import { ComplianceProgramSummary } from '@/lib/violation-scenarios';
import { Shield, CircleCheck as CheckCircle2 } from 'lucide-react';

interface ViolationComplianceProgramBoxProps {
  program: ComplianceProgramSummary;
}

export function ViolationComplianceProgramBox({ program }: ViolationComplianceProgramBoxProps) {
  return (
    <div className="rounded-lg border-2 border-teal-200 bg-gradient-to-br from-teal-50 to-white p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
          <Shield className="h-4 w-4 text-teal-700" />
        </div>
        <p className="text-sm font-bold text-teal-900">{program.title}</p>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {program.items.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" />
            <span className="text-sm text-slate-700">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
