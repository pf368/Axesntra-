'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CarrierBrief } from '@/lib/types';
import { getGuidedPrompts, getGuidedPromptResponse, GuidedPromptResponse } from '@/lib/ai-advisory';
import { Sparkles, MessageSquare, ChevronRight, X, Loader } from 'lucide-react';

interface AiGuidedPromptPanelProps {
  data: CarrierBrief;
}

function parseAiResponse(answer: string, prompt: string): GuidedPromptResponse {
  // Parse the plain-text Claude response into sections by looking for
  // labeled headings (e.g. "**Heading:**" or "### Heading" patterns)
  const lines = answer.split('\n').filter((l) => l.trim());
  const sections: { heading: string; content: string | string[] }[] = [];

  let currentHeading = '';
  let currentLines: string[] = [];

  const flushSection = () => {
    if (!currentHeading) return;
    const bullets = currentLines
      .map((l) => l.replace(/^[-•*]\s*/, '').trim())
      .filter(Boolean);
    sections.push({
      heading: currentHeading,
      content: bullets.length > 1 ? bullets : (bullets[0] || currentLines.join(' ')),
    });
    currentLines = [];
  };

  for (const line of lines) {
    // Detect markdown headings or bolded labels
    const headingMatch =
      line.match(/^#{1,3}\s+(.+)/) ||
      line.match(/^\*{1,2}([^*]+)\*{1,2}:?\s*$/) ||
      line.match(/^([A-Z][^a-z]{0,30}):$/);

    if (headingMatch) {
      flushSection();
      currentHeading = headingMatch[1].replace(/\*+/g, '').replace(/:$/, '').trim();
    } else if (line.trim()) {
      currentLines.push(line.replace(/\*\*/g, '').trim());
    }
  }
  flushSection();

  // Fallback: put everything in one section
  if (sections.length === 0) {
    sections.push({ heading: 'Analysis', content: answer.trim() });
  }

  return { prompt, title: prompt, sections };
}

export function AiGuidedPromptPanel({ data }: AiGuidedPromptPanelProps) {
  const [activeResponse, setActiveResponse] = useState<GuidedPromptResponse | null>(null);
  const [loadingKey, setLoadingKey] = useState<string | null>(null);
  const [animatingOut, setAnimatingOut] = useState(false);
  const prompts = getGuidedPrompts(data);

  const handlePromptClick = async (key: string, label: string) => {
    setLoadingKey(key);
    setAnimatingOut(false);

    try {
      const res = await fetch('/api/ai/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: label, carrier: data }),
      });

      if (res.ok) {
        const json = await res.json();
        setActiveResponse(parseAiResponse(json.answer, label));
      } else {
        // Graceful fallback to static response
        const staticResponse = getGuidedPromptResponse(key, data);
        setActiveResponse(staticResponse);
      }
    } catch {
      // Network error or API not configured — use static fallback
      const staticResponse = getGuidedPromptResponse(key, data);
      setActiveResponse(staticResponse);
    } finally {
      setLoadingKey(null);
    }
  };

  const handleClose = () => {
    setAnimatingOut(true);
    setTimeout(() => {
      setActiveResponse(null);
      setAnimatingOut(false);
    }, 200);
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-100">
          <MessageSquare className="h-4 w-4 text-teal-700" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Ask AI About This Carrier</h2>
          <p className="text-xs text-slate-500">Select a question for AI-powered analysis</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {prompts.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handlePromptClick(key, label)}
            disabled={loadingKey !== null}
            className={`group flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm transition-all disabled:opacity-60 ${
              activeResponse?.prompt === label
                ? 'border-teal-300 bg-teal-50 text-teal-800'
                : 'border-slate-200 bg-white text-slate-700 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800'
            }`}
          >
            {loadingKey === key ? (
              <Loader className="h-3.5 w-3.5 animate-spin text-teal-600" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-teal-600 opacity-70 transition-opacity group-hover:opacity-100" />
            )}
            {label}
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5" />
          </button>
        ))}
      </div>

      {activeResponse && (
        <div
          className={`mt-4 transition-all duration-200 ${
            animatingOut ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
          }`}
        >
          <Card className="overflow-hidden border-teal-200">
            <div className="flex items-center justify-between border-b border-teal-100 bg-gradient-to-r from-teal-50 to-white p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-teal-600">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
                <p className="text-sm font-semibold text-slate-900">{activeResponse.title}</p>
              </div>
              <button
                onClick={handleClose}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 p-5">
              {activeResponse.sections.map((section, i) => (
                <div key={i} className={i > 0 ? 'pt-4' : ''}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {section.heading}
                  </p>
                  {Array.isArray(section.content) ? (
                    <ul className="space-y-2">
                      {section.content.map((item, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700"
                        >
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm leading-relaxed text-slate-700">{section.content}</p>
                  )}
                  {i < activeResponse.sections.length - 1 && (
                    <div className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
