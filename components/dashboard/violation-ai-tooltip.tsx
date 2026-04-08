'use client';

import { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { getViolationAiContext } from '@/lib/violation-ai-context';

interface ViolationAiTooltipProps {
  code: string;
  basicCategory: string;
}

export function ViolationAiTooltip({ code, basicCategory }: ViolationAiTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-0.5 rounded px-1 py-0.5 text-ai-teal hover:bg-ai-teal/10 transition-colors"
        title="AI Explanation"
      >
        <Sparkles className="h-3 w-3" />
      </button>
    );
  }

  const context = getViolationAiContext(code, basicCategory);

  return (
    <div className="mt-2 rounded-lg bg-ai-teal/5 border border-ai-teal/10 p-3 text-xs">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5 text-ai-teal" />
          <span className="font-semibold text-ai-teal uppercase tracking-wider text-[10px]">
            AI Analysis — {code}
          </span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-on-surface-variant hover:text-foreground transition-colors"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="space-y-2 text-on-surface-variant leading-relaxed">
        <div>
          <span className="font-semibold text-foreground">What it means: </span>
          {context.meaning}
        </div>
        <div>
          <span className="font-semibold text-foreground">Risk: </span>
          {context.risk}
        </div>
        <div>
          <span className="font-semibold text-foreground">Prevention: </span>
          {context.prevention}
        </div>
      </div>
    </div>
  );
}
