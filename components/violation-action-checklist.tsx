import { TriangleAlert as AlertTriangle } from 'lucide-react';

interface ViolationActionChecklistProps {
  actions: string[];
}

export function ViolationActionChecklist({ actions }: ViolationActionChecklistProps) {
  return (
    <div className="rounded-lg border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100">
          <AlertTriangle className="h-4 w-4 text-amber-700" />
        </div>
        <p className="text-sm font-bold text-amber-900">Recommended Immediate Actions</p>
      </div>

      <ul className="space-y-2.5">
        {actions.map((action, i) => (
          <li key={i} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-800">
              {i + 1}
            </span>
            <span className="text-sm leading-relaxed text-slate-700">{action}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
