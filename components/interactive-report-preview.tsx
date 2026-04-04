'use client';

import { useState } from 'react';
import Link from 'next/link';

/* ────────────────── Constants ────────────────── */

const BASICS = [
  { label: 'Vehicle Maint.', pct: 89, color: 'bg-red-500' },
  { label: 'Crash Indicator', pct: 71, color: 'bg-amber-500' },
  { label: 'Unsafe Driving', pct: 62, color: 'bg-amber-400' },
  { label: 'HOS Compliance', pct: 38, color: 'bg-emerald-500' },
  { label: 'Driver Fitness', pct: 15, color: 'bg-emerald-400' },
];

const MONTHLY_HEIGHTS = [35, 38, 42, 40, 48, 55, 52, 60, 65, 68, 72, 78];
const MONTH_LABELS = ["May '25", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan '26", "Feb", "Mar", "Apr '26"];

const HISTORY_EVENTS = [
  { date: 'Mar 15, 2026', location: 'Ohio', violations: 3, oos: false },
  { date: 'Jan 22, 2026', location: 'Indiana', violations: 2, oos: true },
  { date: 'Dec 8, 2025', location: 'Illinois', violations: 1, oos: false },
  { date: 'Oct 3, 2025', location: 'Michigan', violations: 4, oos: true },
  { date: 'Aug 17, 2025', location: 'Kentucky', violations: 2, oos: true },
];

const ACTIONS = [
  { num: 1, title: 'Submit maintenance action plan', desc: 'Require carrier to provide a written maintenance improvement plan within 30 days addressing brake, lighting, and tire deficiencies.' },
  { num: 2, title: 'Add to monthly monitoring watchlist', desc: 'Set automated alerts for any new inspection, OOS event, or BASIC percentile change above 5 points.' },
  { num: 3, title: 'Schedule quarterly re-evaluation', desc: 'Reassess risk score every 90 days. If maintenance BASIC drops below 75th percentile, move to standard review cycle.' },
];

const CHAT_CHIPS: Record<string, string> = {
  'What caused the OOS events?':
    'The 3 Q1 2026 OOS events were all vehicle-related: brake adjustment failure (396.3(a)(1)), lighting defect (396.3(a)(2)), and tire tread depth (393.75(a)). All three point to the same root cause — insufficient pre-trip inspection discipline.',
  'Compare to similar-sized carriers':
    "Among interstate carriers with 35–50 power units, ACME's maintenance score (89th) is in the top 15% most risky. The median carrier in this size band is at the 52nd percentile. Their crash indicator (71st) is also above the 63rd-percentile median.",
  'Draft a conditional approval memo':
    'Here\'s a conditional approval memo template based on this carrier\'s profile: [ACME Transport LLC — Conditional Approval · Commercial Auto · Effective [Date]] This carrier is approved conditionally, subject to: (1) submission of maintenance action plan within 30 days, (2) quarterly risk review, (3) automatic re-evaluation if any additional OOS event occurs within 90 days.',
  'What improves their score most?':
    'The single highest-impact improvement is vehicle maintenance. Reducing their OOS rate from 34.1% to below the 21% national benchmark would drop their maintenance BASIC from the 89th to approximately the 55th percentile — moving overall risk from Elevated to Moderate within 6–9 months.',
};

/* ────────────────── Chat Panel ────────────────── */

function ChatRightPanel() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    {
      role: 'ai',
      text: '**ACME Transport is elevated risk** — vehicle maintenance at 89th percentile (above the 80th-percentile intervention threshold), with 3 OOS events in Q1 2026.\n\nThe 12-month trend is consistently worsening. Crash indicator at 71st is also approaching threshold.\n\n**Recommendation:** Conditional approval with quarterly reviews and a mandatory maintenance action plan within 30 days.',
    },
  ]);
  const [showChips, setShowChips] = useState(true);
  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState('');

  const handleChipClick = (chip: string) => {
    setShowChips(false);
    setMessages((prev) => [...prev, { role: 'user', text: chip }]);
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages((prev) => [...prev, { role: 'ai', text: CHAT_CHIPS[chip] }]);
    }, 600);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || thinking) return;
    setInput('');
    setShowChips(false);
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        {
          role: 'ai',
          text: 'Great question. For the full AI analysis on this and any other carrier, [get early access →](/early-access).',
        },
      ]);
    }, 600);
  };

  const handleReset = () => setShowChips(true);

  function formatText(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
      }
      const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (linkMatch) {
        return <Link key={i} href={linkMatch[2]} className="text-indigo-400 hover:text-indigo-300 underline">{linkMatch[1]}</Link>;
      }
      return <span key={i}>{part}</span>;
    });
  }

  return (
    <div className="flex flex-col h-full bg-[#18181B] border-l border-[#27272A]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#27272A] flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">Ax</span>
          </div>
          <span className="text-sm font-semibold text-white">Ask about this carrier</span>
        </div>
        <p className="text-[11px] text-zinc-500 mt-0.5">AI advisor · ACME Transport LLC</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[95%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-[#27272A] text-zinc-300'
              }`}
            >
              {msg.text.split('\n').map((line, j) => (
                <p key={j} className={j > 0 ? 'mt-2' : ''}>
                  {msg.role === 'ai' ? formatText(line) : line}
                </p>
              ))}
            </div>
          </div>
        ))}

        {thinking && (
          <div className="flex justify-start">
            <div className="bg-[#27272A] text-zinc-400 rounded-xl px-3.5 py-2.5 text-sm">Thinking...</div>
          </div>
        )}

        {!thinking && showChips && (
          <div className="flex flex-wrap gap-2 pt-1">
            {Object.keys(CHAT_CHIPS).map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="text-xs bg-[#27272A] text-zinc-300 px-3 py-1.5 rounded-full border border-zinc-700 hover:border-zinc-500 hover:text-white transition-colors text-left"
                aria-label={chip}
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {!thinking && !showChips && messages.length > 1 && (
          <button onClick={handleReset} className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
            Ask another question &rarr;
          </button>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-[#27272A] flex gap-2 flex-shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a follow-up question..."
          className="flex-1 bg-[#27272A] text-white text-sm rounded-lg px-3 py-2 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          aria-label="Ask a follow-up question"
        />
        <button
          type="submit"
          disabled={thinking}
          className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
          aria-label="Send"
        >
          Send
        </button>
      </form>
    </div>
  );
}

/* ────────────────── Data Tabs ────────────────── */

function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Carrier header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-slate-900">ACME Transport LLC</h3>
          <p className="text-xs text-slate-500 mt-0.5">USDOT 491180 · MC 123456 · Interstate · Authorized</p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full font-medium">
            Elevated Risk
          </span>
          <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
            ↗ Worsening
          </span>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Risk Score', value: '72', color: 'text-red-600' },
          { label: 'Flagged BASICs', value: '2', color: 'text-amber-600' },
          { label: '12-mo Trend', value: '↗', color: 'text-amber-600' },
          { label: 'Fix Actions', value: '3', color: 'text-blue-600' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-lg border border-slate-200 p-3 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* BASIC bars */}
      <div>
        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">BASIC Category Breakdown</p>
        <div className="space-y-2.5">
          {BASICS.map((b) => (
            <div key={b.label} className="flex items-center gap-3">
              <span className="text-xs text-slate-600 w-28 flex-shrink-0">{b.label}</span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${b.color} rounded-full transition-all`} style={{ width: `${b.pct}%` }} />
              </div>
              <span className="text-xs text-slate-500 w-10 text-right">{b.pct}th</span>
            </div>
          ))}
        </div>
      </div>

      {/* 12-month trend chart */}
      <div>
        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-3">12-Month Trend</p>
        <div className="flex items-end gap-1 h-24">
          {MONTHLY_HEIGHTS.map((h, i) => {
            const ratio = i / (MONTHLY_HEIGHTS.length - 1);
            const r = Math.round(34 + ratio * (239 - 34));
            const g = Math.round(197 + ratio * (68 - 197));
            const b = Math.round(94 + ratio * (68 - 94));
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t"
                  style={{ height: `${h}%`, backgroundColor: `rgb(${r},${g},${b})` }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex gap-1 mt-1">
          {MONTH_LABELS.map((m) => (
            <span key={m} className="flex-1 text-center text-[9px] text-slate-400">{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function HistoryTab() {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Recent Inspections</p>
      {HISTORY_EVENTS.map((evt, i) => (
        <div key={i} className="flex items-center justify-between bg-white rounded-lg border border-slate-200 p-3">
          <div>
            <p className="text-sm font-medium text-slate-900">{evt.date} · {evt.location}</p>
            <p className="text-xs text-slate-500">{evt.violations} violations · {evt.oos ? '1 OOS' : 'No OOS'}</p>
          </div>
          {evt.oos && (
            <span className="text-[10px] bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded-full font-medium">
              OOS
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function TrendTab() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-700 font-medium bg-amber-50 border border-amber-200 rounded-lg p-3">
        Risk score has increased 43 points over 12 months — driven by maintenance and crash category deterioration.
      </p>
      <div className="flex items-end gap-1.5 h-40">
        {MONTHLY_HEIGHTS.map((h, i) => {
          const ratio = i / (MONTHLY_HEIGHTS.length - 1);
          const r = Math.round(34 + ratio * (239 - 34));
          const g = Math.round(197 + ratio * (68 - 197));
          const b = Math.round(94 + ratio * (68 - 94));
          return (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className="w-full rounded-t"
                style={{ height: `${h}%`, backgroundColor: `rgb(${r},${g},${b})` }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex gap-1.5">
        {MONTH_LABELS.map((m) => (
          <span key={m} className="flex-1 text-center text-[9px] text-slate-400">{m}</span>
        ))}
      </div>
    </div>
  );
}

function ActionsTab() {
  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">Recommended Actions</p>
      {ACTIONS.map((a) => (
        <div key={a.num} className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-start gap-3">
            <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
              {a.num}
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">{a.title}</p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{a.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ────────────────── Main Component ────────────────── */

const TABS = ['Overview', 'History', 'Trend', 'Actions'] as const;

export function InteractiveReportPreview() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('Overview');

  return (
    <section id="live-demo" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-[1100px]">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Live Demo</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Explore a real carrier risk brief
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            This is what your team sees. Data on the left, AI advisor on the right. The analysis is real — from actual public FMCSA data.
          </p>
        </div>

        {/* Panel container */}
        <div className="bg-[#F4F4F5] border border-slate-200 rounded-2xl overflow-hidden">
          {/* Toolbar */}
          <div className="bg-white border-b border-slate-200 px-4 py-3 flex flex-col md:flex-row items-start md:items-center gap-3">
            <div className="flex-shrink-0">
              <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 w-56">
                ACME Transport LLC
              </div>
            </div>

            <div className="flex gap-1 flex-1 justify-center">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm px-4 py-1.5 rounded-lg transition-colors ${
                    activeTab === tab
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  aria-label={`${tab} tab`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <span className="text-xs border border-slate-200 text-slate-500 px-3 py-1.5 rounded-lg">Export PDF</span>
              <span className="text-xs border border-slate-200 text-slate-500 px-3 py-1.5 rounded-lg">Add to watchlist</span>
            </div>
          </div>

          {/* Main body */}
          <div className="grid lg:grid-cols-5">
            {/* Left panel: 60% */}
            <div className="lg:col-span-3 p-6 overflow-y-auto max-h-[600px]">
              {activeTab === 'Overview' && <OverviewTab />}
              {activeTab === 'History' && <HistoryTab />}
              {activeTab === 'Trend' && <TrendTab />}
              {activeTab === 'Actions' && <ActionsTab />}
            </div>

            {/* Right panel: 40% — hidden on mobile */}
            <div className="hidden lg:flex lg:col-span-2 h-[600px]">
              <ChatRightPanel />
            </div>
          </div>
        </div>

        {/* Below panel CTA */}
        <p className="text-center text-sm text-slate-500 mt-6">
          This is a real carrier brief, generated from public FMCSA data.{' '}
          <Link href="/sample-report" className="text-blue-600 hover:text-blue-500 font-medium">
            View the full report &rarr;
          </Link>
        </p>
      </div>
    </section>
  );
}
