'use client';

import { useState, useEffect, useCallback } from 'react';

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  isLoading?: boolean;
  followUps?: string[];
}

const MESSAGES: ChatMessage[] = [
  { role: 'user', text: 'Should I approve ACME Transport for our book?' },
  { role: 'ai', text: 'Pulling FMCSA record for USDOT 491180...', isLoading: true },
  {
    role: 'ai',
    text: '**ACME Transport — Elevated Risk · Worsening trend**\n\nVehicle maintenance is at the 89th percentile — above FMCSA\'s 80th-percentile intervention threshold. Three new OOS events in Q1 2026. Crash indicator trending up at 71st percentile.\n\n**My recommendation:** Conditional approval. Require their maintenance action plan within 30 days and add to your watchlist for monthly monitoring.',
    followUps: [
      'Draft a conditional approval memo',
      'Compare to similar-sized carriers',
      'What if they fix maintenance?',
    ],
  },
];

function formatBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function HeroChat() {
  const [visibleMessages, setVisibleMessages] = useState<ChatMessage[]>([]);
  const [showLoader, setShowLoader] = useState(false);
  const [cycle, setCycle] = useState(0);

  const prefersReducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const runSequence = useCallback(() => {
    setVisibleMessages([]);
    setShowLoader(false);

    if (prefersReducedMotion) {
      setVisibleMessages(MESSAGES.filter((m) => !m.isLoading));
      return;
    }

    // Message 1: user
    const t1 = setTimeout(() => {
      setVisibleMessages([MESSAGES[0]]);
    }, 400);

    // Message 2: loading
    const t2 = setTimeout(() => {
      setShowLoader(true);
    }, 1600);

    // Message 3: replace loader with final AI response
    const t3 = setTimeout(() => {
      setShowLoader(false);
      setVisibleMessages([MESSAGES[0], MESSAGES[2]]);
    }, 2400);

    // Restart cycle
    const t4 = setTimeout(() => {
      setCycle((c) => c + 1);
    }, 10000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [prefersReducedMotion]);

  useEffect(() => {
    const cleanup = runSequence();
    return cleanup;
  }, [cycle, runSequence]);

  return (
    <div
      className="rounded-[14px] border border-white/[0.08] overflow-hidden"
      style={{ background: '#1E293B' }}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.08]">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
        </div>
        <span className="text-[11px] text-slate-500 ml-2">Axesntra — AI Safety Advisor</span>
      </div>

      {/* Chat area */}
      <div className="px-4 py-4 space-y-3 min-h-[280px]">
        {visibleMessages.map((msg, i) => (
          <div
            key={`${cycle}-${i}`}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
          >
            <div
              className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#27272A] text-zinc-300'
              }`}
            >
              {msg.text.split('\n').map((line, j) => (
                <p key={j} className={j > 0 ? 'mt-2' : ''}>
                  {msg.role === 'ai' ? formatBold(line) : line}
                </p>
              ))}
            </div>
          </div>
        ))}

        {showLoader && (
          <div className="flex justify-start animate-fade-in-up">
            <div className="bg-[#27272A] text-zinc-400 rounded-xl px-3.5 py-2.5 text-sm flex items-center gap-1.5">
              <span className="inline-flex gap-1">
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            </div>
          </div>
        )}

        {/* Follow-up chips */}
        {visibleMessages.length === 2 && visibleMessages[1].followUps && (
          <div className="flex flex-wrap gap-2 pt-1 animate-fade-in-up">
            {visibleMessages[1].followUps.map((chip) => (
              <span
                key={chip}
                className="text-xs bg-[#27272A] text-zinc-400 px-3 py-1.5 rounded-full border border-zinc-700"
              >
                {chip}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Mock input bar */}
      <div className="px-4 py-3 border-t border-white/[0.08] flex gap-2">
        <div className="flex-1 bg-[#27272A] rounded-lg px-3 py-2 text-sm text-zinc-600">
          Ask about any carrier...
        </div>
        <div className="bg-indigo-600/50 text-indigo-300 text-sm px-3 py-2 rounded-lg">
          Send
        </div>
      </div>
    </div>
  );
}
