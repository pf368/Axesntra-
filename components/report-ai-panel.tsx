'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const CARRIER_CONTEXT = {
  name: 'ACME Transport LLC',
  usdot: '491180',
  risk: 'Elevated',
  trend: 'Worsening',
  score: 72,
};

const CANNED_RESPONSES: Record<string, string> = {
  'Summarize the top 3 risks':
    '1. **Vehicle Maintenance (89th percentile):** OOS rate of 34.1% is 13 points above the national benchmark. Brake, lighting, and tire violations are recurring. 2. **Hazmat Documentation (Elevated):** Shipping paper errors and placard issues in recent inspections — 3 related violations in 6 months. 3. **Historical Enforcement:** One closed enforcement case from 2024 suggesting a recurring pattern. The crash indicator (Moderate, 71st) is a secondary concern but trending up.',
  'Is this carrier insurable?':
    'Based on the public data: this carrier presents elevated but not disqualifying risk. The maintenance score (89th) exceeds standard intervention thresholds, which many insurers treat as a trigger for conditional rather than flat approval. Driver fitness (15th percentile) is clean — suggesting the problem is operational controls, not driver quality. A conditional approval with a 90-day re-evaluation would be defensible. A flat denial would also be defensible given the trend.',
  'What would change the score most?':
    'The highest-leverage action is reducing the vehicle OOS rate. Going from 34.1% to below the 21% national benchmark (achievable in 6–9 months with systematic maintenance controls) would drop the maintenance BASIC from 89th to roughly 55th percentile. That alone would likely move their overall risk from Elevated to Moderate. Clearing the hazmat documentation issues (low-effort fixes) would further improve the score.',
  'Draft an underwriting memo':
    '**Draft Underwriting Memo — ACME Transport LLC**\n\nDate: [Date] | Analyst: [Name] | USDOT: 491180\n\n**Risk Assessment:** Elevated. Vehicle maintenance deficiencies are the primary driver (89th percentile, above 80th intervention threshold). 12-month trend is worsening.\n\n**Recommendation:** Conditional approval subject to: (1) Carrier-provided maintenance action plan within 30 days; (2) Quarterly SMS monitoring review; (3) Automatic re-evaluation upon any new OOS event.\n\n**Data source:** FMCSA SMS, updated [date]. This assessment reflects publicly available data only.',
};

const CHIPS = Object.keys(CANNED_RESPONSES);

const VIOLATION_RESPONSE =
  'The 3 Q1 2026 OOS events were all vehicle-related: brake adjustment failure (396.3(a)(1)), lighting defect (396.3(a)(2)), and tire tread depth (393.75(a)). All point to insufficient pre-trip inspection discipline. The maintenance BASIC at the 89th percentile confirms a systemic pattern — not isolated events.';

const GENERIC_RESPONSE =
  'Great question — for fully contextualized AI answers across your entire carrier portfolio, [get early access →](/early-access). This demo advisor covers ACME Transport\'s profile specifically.';

interface Message {
  role: 'user' | 'ai';
  text: string;
}

function formatAIText(text: string) {
  // Simple markdown-like formatting for bold and links
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)) {
      const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (match) {
        return <Link key={i} href={match[2]} className="text-indigo-400 hover:text-indigo-300 underline">{match[1]}</Link>;
      }
    }
    return <span key={i}>{part}</span>;
  });
}

function ChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      text: "I've analyzed the full FMCSA record for ACME Transport. Their vehicle maintenance is the primary concern — 89th percentile with a worsening 12-month trend.\n\nWhat would you like to dig into?",
    },
  ]);
  const [showChips, setShowChips] = useState(true);
  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const handleResponse = (userText: string, responseText: string) => {
    setShowChips(false);
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages((prev) => [...prev, { role: 'ai', text: responseText }]);
    }, 600);
  };

  const handleChipClick = (chip: string) => {
    handleResponse(chip, CANNED_RESPONSES[chip]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || thinking) return;
    setInput('');

    const isViolationRelated = /violation|oos|OOS|maintenance/i.test(trimmed);
    handleResponse(trimmed, isViolationRelated ? VIOLATION_RESPONSE : GENERIC_RESPONSE);
  };

  const handleAskAnother = () => {
    setShowChips(true);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#27272A] flex items-center justify-between flex-shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">Ax</span>
            </div>
            <span className="text-sm font-semibold text-white">AI Advisor</span>
          </div>
          <p className="text-[11px] text-zinc-500 mt-0.5">Ask anything about ACME Transport LLC</p>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-500 hover:text-white transition-colors p-1"
          aria-label="Close AI panel"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* Carrier context */}
      <div className="mx-4 mt-3 px-3 py-2.5 bg-[#27272A] rounded-lg flex-shrink-0">
        <p className="text-xs text-zinc-300">
          <span className="mr-1">📋</span> {CARRIER_CONTEXT.name} · USDOT {CARRIER_CONTEXT.usdot}
        </p>
        <p className="text-[11px] text-zinc-500 mt-0.5">
          Risk: {CARRIER_CONTEXT.risk} · Trend: {CARRIER_CONTEXT.trend} · Score: {CARRIER_CONTEXT.score}
        </p>
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[90%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#27272A] text-zinc-300'
              }`}
            >
              {msg.text.split('\n').map((line, j) => (
                <p key={j} className={j > 0 ? 'mt-2' : ''}>
                  {msg.role === 'ai' ? formatAIText(line) : line}
                </p>
              ))}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex justify-start">
            <div className="bg-[#27272A] text-zinc-400 rounded-xl px-3.5 py-2.5 text-sm">
              Thinking...
            </div>
          </div>
        )}

        {/* Chips or "Ask another" */}
        {!thinking && showChips && messages.length >= 1 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="text-xs bg-[#27272A] text-zinc-300 px-3 py-1.5 rounded-full border border-zinc-700 hover:border-zinc-500 hover:text-white transition-colors"
                aria-label={chip}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {!thinking && !showChips && messages.length > 2 && (
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleAskAnother}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Ask another question &rarr;
            </button>
            <button
              onClick={() => {
                const lastAI = messages.filter((m) => m.role === 'ai').pop();
                if (lastAI) navigator.clipboard.writeText(lastAI.text);
              }}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors border border-zinc-700 px-2 py-1 rounded"
              aria-label="Copy response"
            >
              Copy
            </button>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-[#27272A] flex gap-2 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this carrier..."
          className="flex-1 bg-[#27272A] text-white text-sm rounded-lg px-3 py-2 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          aria-label="Ask a question about this carrier"
        />
        <button
          type="submit"
          disabled={thinking}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
          aria-label="Send message"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export function ReportAIPanel() {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      {/* Desktop: Fixed panel */}
      <div className="hidden lg:block">
        {/* Collapsed tab */}
        {!expanded && (
          <button
            onClick={() => setExpanded(true)}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-50 w-10 h-28 bg-gradient-to-b from-indigo-600 to-purple-700 rounded-l-lg flex flex-col items-center justify-center gap-2 hover:w-12 transition-all shadow-lg"
            aria-label="Open AI Advisor panel"
          >
            <span className="text-white text-xs font-bold">Ax</span>
            <span className="text-white text-[10px] writing-mode-vertical" style={{ writingMode: 'vertical-rl' }}>
              AI Advisor
            </span>
          </button>
        )}

        {/* Expanded panel */}
        <div
          className={`fixed right-0 top-16 bottom-0 w-[360px] bg-[#18181B] border-l border-[#27272A] z-50 transition-transform duration-300 ease-in-out ${
            expanded ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {expanded && <ChatPanel onClose={() => setExpanded(false)} />}
        </div>
      </div>

      {/* Mobile: Inline section at bottom */}
      <div className="lg:hidden">
        <section className="bg-[#18181B] border-t border-[#27272A]">
          <div className="container mx-auto max-w-3xl">
            <div className="h-[500px]">
              <ChatPanel onClose={() => {}} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
