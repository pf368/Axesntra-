import { ViolationResponseSection } from '@/lib/violation-scenarios';
import { Info, TriangleAlert as AlertTriangle, Search, Shield, ClipboardCheck, Workflow, CircleCheck as CheckCircle2, Scale } from 'lucide-react';

interface ViolationResponseSectionCardProps {
  section: ViolationResponseSection;
}

const iconMap = {
  info: Info,
  regulation: Scale,
  alert: AlertTriangle,
  search: Search,
  shield: Shield,
  checklist: ClipboardCheck,
  workflow: Workflow,
};

const highlightStyles: Record<string, { wrapper: string; heading: string }> = {
  blue: { wrapper: 'border-2 border-blue-200 bg-blue-50 rounded-lg p-4', heading: 'text-blue-700' },
  amber: { wrapper: 'border-2 border-amber-200 bg-amber-50 rounded-lg p-4', heading: 'text-amber-800' },
  red: { wrapper: 'border-2 border-red-200 bg-red-50 rounded-lg p-4', heading: 'text-red-700' },
  emerald: { wrapper: 'border-2 border-emerald-200 bg-emerald-50 rounded-lg p-4', heading: 'text-emerald-700' },
  teal: { wrapper: 'border-2 border-teal-200 bg-teal-50 rounded-lg p-4', heading: 'text-teal-700' },
};

export function ViolationResponseSectionCard({ section }: ViolationResponseSectionCardProps) {
  const Icon = iconMap[section.icon] || Info;
  const isHighlighted = section.highlighted;
  const colorKey = section.highlightColor || 'teal';
  const highlight = highlightStyles[colorKey];

  const iconColor =
    section.icon === 'alert'
      ? 'text-red-500'
      : section.icon === 'shield'
        ? 'text-blue-500'
        : section.icon === 'regulation'
          ? 'text-slate-600'
          : 'text-slate-500';

  const headingColor = isHighlighted ? highlight.heading : 'text-slate-600';

  return (
    <div className={isHighlighted ? highlight.wrapper : ''}>
      <div className="mb-2 flex items-center gap-2">
        <Icon className={`h-4 w-4 shrink-0 ${iconColor}`} />
        <p className={`text-xs font-semibold uppercase tracking-wider ${headingColor}`}>
          {section.heading}
        </p>
      </div>

      {typeof section.content === 'string' ? (
        <p className="text-sm leading-relaxed text-slate-700">{section.content}</p>
      ) : (
        <ul className="space-y-1.5">
          {section.content.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
              {item}
            </li>
          ))}
        </ul>
      )}

      {section.table && (
        <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50">
              <tr>
                {section.table.headers.map((h, i) => (
                  <th
                    key={i}
                    className="whitespace-nowrap px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {section.table.rows.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-3 py-2.5 text-sm ${
                        ci === 0 ? 'font-medium text-slate-900' : 'text-slate-600'
                      } ${
                        ci === 2
                          ? cell.startsWith('Required')
                            ? 'font-semibold text-emerald-700'
                            : cell.startsWith('Not')
                              ? 'text-red-600'
                              : 'text-slate-600'
                          : ''
                      }`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {section.subChecklist && (
        <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-600">
            {section.subChecklist.title}
          </p>
          <div className="space-y-2">
            {section.subChecklist.items.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-500" />
                <span className="text-sm text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {section.note && (
        <div className="mt-2.5 rounded border border-slate-200 bg-slate-50 px-3 py-2">
          <p className="text-xs leading-relaxed text-slate-600">
            <span className="font-semibold text-slate-700">Note: </span>
            {section.note}
          </p>
        </div>
      )}
    </div>
  );
}
