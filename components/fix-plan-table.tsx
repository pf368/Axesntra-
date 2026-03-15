import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FixPlanItem } from '@/lib/types';

interface FixPlanTableProps {
  items: FixPlanItem[];
}

function getImpactBadge(impact: string) {
  if (impact === 'High') return 'bg-blue-100 text-blue-800 border-blue-200';
  if (impact === 'Medium') return 'bg-slate-100 text-slate-700 border-slate-200';
  return 'bg-slate-50 text-slate-600 border-slate-200';
}

function getEffortBadge(effort: string) {
  if (effort === 'Low') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (effort === 'Medium') return 'bg-amber-50 text-amber-700 border-amber-200';
  return 'bg-red-50 text-red-700 border-red-200';
}

export function FixPlanTable({ items }: FixPlanTableProps) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900 mb-4">Prioritized Remediation Plan</h2>
      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-900">Action</TableHead>
              <TableHead className="font-semibold text-slate-900">Why It Matters</TableHead>
              <TableHead className="w-24 text-center font-semibold text-slate-900">Impact</TableHead>
              <TableHead className="w-24 text-center font-semibold text-slate-900">Effort</TableHead>
              <TableHead className="font-semibold text-slate-900">Expected Effect</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.title} className="hover:bg-slate-50/50">
                <TableCell className="align-top font-medium text-slate-900">{item.title}</TableCell>
                <TableCell className="max-w-xs align-top text-sm text-slate-600">{item.description}</TableCell>
                <TableCell className="align-top text-center">
                  <span className={`inline-block rounded border px-2.5 py-1 text-xs font-medium ${getImpactBadge(item.impact)}`}>
                    {item.impact}
                  </span>
                </TableCell>
                <TableCell className="align-top text-center">
                  <span className={`inline-block rounded border px-2.5 py-1 text-xs font-medium ${getEffortBadge(item.effort)}`}>
                    {item.effort}
                  </span>
                </TableCell>
                <TableCell className="align-top text-sm text-slate-600">{item.expectedEffect}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
