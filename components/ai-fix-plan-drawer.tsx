'use client';

import { useState } from 'react';
import { CarrierBrief, FixPlanItem } from '@/lib/types';
import { getFixPlanExplanation, FixPlanExplanation } from '@/lib/ai-advisory';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Sparkles, ChevronDown, ChevronUp, Wrench, ArrowRight, Cog } from 'lucide-react';

interface AiFixPlanDrawerProps {
  fixPlan: FixPlanItem[];
  data: CarrierBrief;
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

function ExpandedExplanation({ explanation }: { explanation: FixPlanExplanation }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-5">
      <div className="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2">
        <Sparkles className="h-3.5 w-3.5 text-teal-600" />
        <p className="text-xs font-semibold uppercase tracking-wider text-teal-700">
          AI Implementation Guide
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5">
            <ArrowRight className="h-3 w-3 text-slate-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Why This Matters
            </p>
          </div>
          <p className="text-sm leading-relaxed text-slate-700">{explanation.whyThisMatters}</p>
        </div>

        <div>
          <div className="mb-1.5 flex items-center gap-1.5">
            <Wrench className="h-3 w-3 text-slate-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              What It Addresses
            </p>
          </div>
          <p className="text-sm leading-relaxed text-slate-700">{explanation.whatItAddresses}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-1.5 flex items-center gap-1.5">
            <Cog className="h-3 w-3 text-slate-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              How to Implement
            </p>
          </div>
          <ul className="space-y-1.5">
            {explanation.howToImplement.map((step, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-teal-100 text-[10px] font-bold text-teal-700">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="mb-1.5 flex items-center gap-1.5">
            <Cog className="h-3 w-3 text-slate-500" />
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Systems / Resources Needed
            </p>
          </div>
          <ul className="space-y-1.5">
            {explanation.systemsNeeded.map((system, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                {system}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export function AiFixPlanDrawer({ fixPlan, data }: AiFixPlanDrawerProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  return (
    <Card className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-semibold text-slate-900">Action</TableHead>
            <TableHead className="font-semibold text-slate-900">Why It Matters</TableHead>
            <TableHead className="w-24 text-center font-semibold text-slate-900">Impact</TableHead>
            <TableHead className="w-24 text-center font-semibold text-slate-900">Effort</TableHead>
            <TableHead className="font-semibold text-slate-900">Expected Effect</TableHead>
            <TableHead className="w-12" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {fixPlan.map((item) => {
            const isExpanded = expandedItem === item.title;
            const explanation = isExpanded ? getFixPlanExplanation(item.title, data) : null;

            return (
              <>
                <TableRow
                  key={item.title}
                  className={`cursor-pointer transition-colors hover:bg-slate-50/50 ${
                    isExpanded ? 'bg-teal-50/30' : ''
                  }`}
                  onClick={() => setExpandedItem(isExpanded ? null : item.title)}
                >
                  <TableCell className="align-top font-medium text-slate-900">
                    {item.title}
                  </TableCell>
                  <TableCell className="max-w-xs align-top text-sm text-slate-600">
                    {item.description}
                  </TableCell>
                  <TableCell className="align-top text-center">
                    <span
                      className={`inline-block rounded border px-2.5 py-1 text-xs font-medium ${getImpactBadge(item.impact)}`}
                    >
                      {item.impact}
                    </span>
                  </TableCell>
                  <TableCell className="align-top text-center">
                    <span
                      className={`inline-block rounded border px-2.5 py-1 text-xs font-medium ${getEffortBadge(item.effort)}`}
                    >
                      {item.effort}
                    </span>
                  </TableCell>
                  <TableCell className="align-top text-sm text-slate-600">
                    {item.expectedEffect}
                  </TableCell>
                  <TableCell className="align-top">
                    <div className="flex items-center gap-1 text-teal-600">
                      <Sparkles className="h-3 w-3" />
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </div>
                  </TableCell>
                </TableRow>
                {isExpanded && explanation && (
                  <TableRow key={`${item.title}-detail`}>
                    <TableCell colSpan={6} className="bg-slate-50/50 p-4">
                      <ExpandedExplanation explanation={explanation} />
                    </TableCell>
                  </TableRow>
                )}
              </>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );
}
