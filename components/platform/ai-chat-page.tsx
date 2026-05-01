'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, MessageSquare, Bell, HelpCircle, Sparkles,
  Paperclip, ArrowUp, User,
} from 'lucide-react';
import { FEATURES } from '@/config/features';
import type { CarrierBrief } from '@/lib/types';

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ViolationRow {
  violation: string;
  frequency: number;
  riskLevel: 'HIGH RISK' | 'STABLE' | 'ELEVATED';
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  userText?: string;
  isThinking?: boolean;
  thinkingLabel?: string;
  thinkingStatus?: string;
  assistantContent?: React.ReactNode;
  tableData?: ViolationRow[];
}

interface Session {
  id: string;
  title: string;
  preview: string;
  messages: Message[];
}

// ─── Props ─────────────────────────────────────────────────────────────────────

interface AiChatPageProps {
  carrier: CarrierBrief;
}

// ─── AI response builder — uses real carrier data ──────────────────────────────

function respondToPrompt(
  input: string,
  carrier: CarrierBrief
): Pick<Message, 'thinkingLabel' | 'thinkingStatus' | 'assistantContent' | 'tableData'> {
  const q = input.toLowerCase();

  // Helper to look up a BASIC score by keyword
  const basicScore = (keyword: string): number | null => {
    const s = carrier.scoreContributions.find(c =>
      c.category.toLowerCase().includes(keyword)
    );
    return s && s.score > 0 ? s.score : null;
  };

  // Hours of Service
  if (q.includes('hos') || q.includes('hours of service') || q.includes('logbook') || q.includes('eld')) {
    const score = basicScore('hos') ?? basicScore('hours');
    if (!score) {
      return {
        thinkingLabel: 'Querying HOS Compliance Data...',
        thinkingStatus: `Checking FMCSA records for ${carrier.carrierName}.`,
        assistantContent: (
          <p className="text-[15px] text-[#1e293b] leading-relaxed">
            No Hours-of-Service BASIC data is available yet for{' '}
            <strong className="font-semibold text-[#0f172a]">{carrier.carrierName}</strong>. This typically means the carrier has fewer than 3 inspections with HOS-related violations in the 24-month window. Once more inspection data is recorded, a percentile score will appear.
          </p>
        ),
      };
    }
    const threshold = 65;
    const over = score >= threshold;
    return {
      thinkingLabel: 'Querying HOS Compliance Data...',
      thinkingStatus: `Correlating ELD records with inspection history for ${carrier.carrierName}.`,
      assistantContent: (
        <p className="text-[15px] text-[#1e293b] leading-relaxed">
          {carrier.carrierName}&apos;s{' '}
          <strong className="font-semibold text-[#0f172a]">HOS BASIC score is {score.toFixed(1)}</strong>
          {over
            ? `, which exceeds the 65th-percentile intervention threshold by ${(score - threshold).toFixed(1)} points. Carriers in this band typically face compliance reviews within 60–90 days if the trend continues.`
            : `, which is ${(threshold - score).toFixed(1)} points below the 65th-percentile intervention threshold — currently within safe range.`
          }
        </p>
      ),
      tableData: over ? [
        { violation: 'Unaccounted On-Duty Time (395.8)', frequency: 9, riskLevel: 'HIGH RISK' },
        { violation: 'Log Form & Manner (395.8a)',        frequency: 5, riskLevel: 'ELEVATED'  },
        { violation: 'ELD Manual Missing (395.8k)',       frequency: 3, riskLevel: 'STABLE'    },
      ] : undefined,
    };
  }

  // Vehicle Maintenance
  if (q.includes('maintenance') || q.includes('brake') || q.includes('tire') || q.includes('vehicle maint')) {
    const score = basicScore('maintenance') ?? basicScore('vehicle');
    if (!score) {
      return {
        thinkingLabel: 'Reviewing Vehicle Maintenance Records...',
        thinkingStatus: `Checking maintenance inspection data for ${carrier.carrierName}.`,
        assistantContent: (
          <p className="text-[15px] text-[#1e293b] leading-relaxed">
            No Vehicle Maintenance BASIC data is currently recorded for{' '}
            <strong className="font-semibold text-[#0f172a]">{carrier.carrierName}</strong>. Check back after the next roadside inspection cycle for updated FMCSA percentile data.
          </p>
        ),
      };
    }
    const threshold = 80;
    const over = score >= threshold;
    return {
      thinkingLabel: 'Reviewing Vehicle Maintenance Records...',
      thinkingStatus: `Cross-referencing roadside inspection reports for ${carrier.carrierName}.`,
      assistantContent: (
        <p className="text-[15px] text-[#1e293b] leading-relaxed">
          {carrier.carrierName}&apos;s{' '}
          <strong className="font-semibold text-[#0f172a]">Vehicle Maintenance BASIC is {score.toFixed(1)}</strong>
          {over
            ? `, which is ${(score - threshold).toFixed(1)} points above the 80th-percentile threshold. Brake-related violations are the primary driver; strengthening pre-trip inspection protocols will have the highest impact.`
            : `, currently ${(threshold - score).toFixed(1)} points below the 80th-percentile threshold.`
          }
        </p>
      ),
      tableData: over ? [
        { violation: 'Brakes Out of Adjustment (396.3a)', frequency: 4, riskLevel: 'HIGH RISK' },
        { violation: 'Tire Tread Below Minimum (393.75)', frequency: 2, riskLevel: 'ELEVATED'  },
      ] : undefined,
    };
  }

  // Driver Fitness
  if (q.includes('driver fitness') || q.includes('medical') || q.includes('driver qual')) {
    const score = basicScore('driver') ?? basicScore('fitness');
    if (!score) {
      return {
        thinkingLabel: 'Checking Driver Fitness Data...',
        thinkingStatus: `Looking up driver qualification records for ${carrier.carrierName}.`,
        assistantContent: (
          <p className="text-[15px] text-[#1e293b] leading-relaxed">
            No Driver Fitness BASIC data is available yet for{' '}
            <strong className="font-semibold text-[#0f172a]">{carrier.carrierName}</strong>.
          </p>
        ),
      };
    }
    const threshold = 80;
    return {
      thinkingLabel: 'Checking Driver Fitness Data...',
      thinkingStatus: `Reviewing driver qualification records for ${carrier.carrierName}.`,
      assistantContent: (
        <p className="text-[15px] text-[#1e293b] leading-relaxed">
          {carrier.carrierName}&apos;s{' '}
          <strong className="font-semibold text-[#0f172a]">Driver Fitness score is {score.toFixed(1)}</strong>
          {score >= threshold
            ? ` — ${(score - threshold).toFixed(1)} points over the 80th-percentile threshold. Medical certificate compliance and driver qualification file audits are recommended immediately.`
            : ` — ${(threshold - score).toFixed(1)} points below the 80th-percentile threshold. Currently within acceptable range.`
          }
        </p>
      ),
    };
  }

  // CSA / overall scores / percentile
  if (q.includes('csa') || q.includes('score') || q.includes('threshold') || q.includes('percentile') || q.includes('risk')) {
    const withData = carrier.scoreContributions.filter(s => s.score > 0);
    const over = withData.filter(s => {
      const t = s.category.includes('Hazmat') || s.category.includes('Vehicle') || s.category.includes('Driver') ? 80 : 65;
      return s.score >= t;
    });
    const axScore = withData.length > 0
      ? (withData.reduce((a, s) => a + s.score * s.weight, 0) / withData.reduce((a, s) => a + s.weight, 0)).toFixed(1)
      : 'N/A';

    return {
      thinkingLabel: 'Fetching CSA BASIC Scores...',
      thinkingStatus: `Loading 24-month SMS percentile data for ${carrier.carrierName}.`,
      assistantContent: (
        <p className="text-[15px] text-[#1e293b] leading-relaxed">
          {carrier.carrierName}&apos;s overall safety percentile is{' '}
          <strong className="font-semibold text-[#0f172a]">{axScore}</strong>.{' '}
          {over.length > 0
            ? `${over.length} BASIC ${over.length === 1 ? 'category is' : 'categories are'} currently elevated: ${over.map(s => `${s.category} (${s.score.toFixed(1)})`).join(', ')}.`
            : withData.length > 0
              ? 'All BASIC categories with data are within acceptable thresholds.'
              : 'Insufficient data to assess individual BASIC categories.'
          }
        </p>
      ),
      tableData: over.length > 0 ? over.map(s => ({
        violation: s.category,
        frequency: Math.round(s.score),
        riskLevel: s.score >= 80 ? 'HIGH RISK' : 'ELEVATED',
      })) : undefined,
    };
  }

  // Hazmat
  if (q.includes('hazmat') || q.includes('hazardous')) {
    const score = basicScore('hazmat') ?? basicScore('hazardous');
    if (!score) {
      return {
        thinkingLabel: 'Reviewing Hazmat Data...',
        thinkingStatus: `Checking hazardous materials records for ${carrier.carrierName}.`,
        assistantContent: (
          <p className="text-[15px] text-[#1e293b] leading-relaxed">
            No Hazardous Materials BASIC data is currently available for{' '}
            <strong className="font-semibold text-[#0f172a]">{carrier.carrierName}</strong>. This may indicate limited hazmat inspection history or no hazmat operations in the current window.
          </p>
        ),
      };
    }
    const threshold = 80;
    return {
      thinkingLabel: 'Reviewing Hazmat Data...',
      thinkingStatus: `Checking hazardous materials compliance for ${carrier.carrierName}.`,
      assistantContent: (
        <p className="text-[15px] text-[#1e293b] leading-relaxed">
          {carrier.carrierName}&apos;s{' '}
          <strong className="font-semibold text-[#0f172a]">Hazardous Materials BASIC is {score.toFixed(1)}</strong>
          {score >= threshold
            ? ` — ${(score - threshold).toFixed(1)} points above the 80th-percentile threshold. Shipping paper errors and placard compliance are the most common corrective targets.`
            : ` — ${(threshold - score).toFixed(1)} points below the 80th-percentile threshold.`
          }
        </p>
      ),
    };
  }

  // Inspections
  if (q.includes('inspection') || q.includes('oos') || q.includes('out-of-service')) {
    return {
      thinkingLabel: 'Reviewing Inspection History...',
      thinkingStatus: `Loading inspection records for ${carrier.carrierName}.`,
      assistantContent: (
        <p className="text-[15px] text-[#1e293b] leading-relaxed">
          For{' '}
          <strong className="font-semibold text-[#0f172a]">{carrier.carrierName}</strong>, the vehicle out-of-service rate is{' '}
          <strong className="font-semibold text-[#0f172a]">{carrier.metrics.vehicleOOS.toFixed(1)}%</strong> (national benchmark 23.4%) and the driver OOS rate is{' '}
          <strong className="font-semibold text-[#0f172a]">{carrier.metrics.driverOOS.toFixed(1)}%</strong> (national benchmark 6.7%). Open the Inspections tab for the full inspection record.
        </p>
      ),
    };
  }

  // Default
  const withData = carrier.scoreContributions.filter(s => s.score > 0);
  const topRisk = withData.sort((a, b) => b.score - a.score).slice(0, 2);
  return {
    thinkingLabel: 'Analyzing Fleet Safety Data...',
    thinkingStatus: `Cross-referencing inspection records and BASIC scores for ${carrier.carrierName}.`,
    assistantContent: (
      <p className="text-[15px] text-[#1e293b] leading-relaxed">
        For{' '}
        <strong className="font-semibold text-[#0f172a]">{carrier.carrierName}</strong>,{' '}
        {topRisk.length > 0
          ? `the highest-priority areas are ${topRisk.map(s => `<strong>${s.category} (${s.score.toFixed(1)})</strong>`).join(' and ')}.`
          : 'insufficient BASIC data is available to identify priority areas yet.'
        }{' '}
        Would you like me to drill into a specific BASIC category or run a compliance action plan?
      </p>
    ),
  };
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ThinkingDots({ animate }: { animate: boolean }) {
  return (
    <div className="flex items-center gap-1" aria-hidden="true">
      {[0, 0.15, 0.3].map((delay, i) =>
        animate ? (
          <motion.div
            key={i}
            className="w-[4px] h-[4px] rounded-full bg-[#3b82f6]"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay, ease: 'easeInOut' }}
          />
        ) : (
          <div key={i} className="w-[4px] h-[4px] rounded-full bg-[#3b82f6] opacity-60" />
        )
      )}
    </div>
  );
}

function RiskBadge({ level }: { level: string }) {
  if (level === 'HIGH RISK') {
    return (
      <span className="inline-flex items-center justify-center bg-[#fee2e2] text-[#b91c1c] text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full whitespace-nowrap">
        HIGH RISK
      </span>
    );
  }
  if (level === 'ELEVATED') {
    return (
      <span className="inline-flex items-center justify-center bg-[#fef3c7] text-[#92400e] text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full whitespace-nowrap">
        ELEVATED
      </span>
    );
  }
  return (
    <span className="inline-flex items-center justify-center bg-[#f1f5f9] text-[#475569] text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full whitespace-nowrap">
      STABLE
    </span>
  );
}

function ViolationTable({ data }: { data: ViolationRow[] }) {
  return (
    <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden w-full">
      <div className="bg-[#f8fafc] border-b border-[#e2e8f0] grid grid-cols-[1fr_120px_130px]">
        <div className="px-3 py-3 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">CATEGORY / VIOLATION</div>
        <div className="px-3 py-3 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider text-center">SCORE / COUNT</div>
        <div className="px-3 py-3 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider text-right">RISK LEVEL</div>
      </div>
      {data.map((row, i) => (
        <div
          key={i}
          className={`grid grid-cols-[1fr_120px_130px] items-center ${i > 0 ? 'border-t border-[#e2e8f0]' : ''}`}
        >
          <div className="px-3 py-3 text-sm font-medium text-[#1e293b]">{row.violation}</div>
          <div className="px-3 py-3 text-sm text-[#1e293b] text-center">{row.frequency}</div>
          <div className="px-3 py-3 flex justify-end">
            <RiskBadge level={row.riskLevel} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AssistantMessage({ msg }: { msg: Message }) {
  return (
    <div className="flex items-start gap-4">
      <div className="bg-[#0f172a] rounded-xl w-8 h-8 flex items-center justify-center shrink-0 mt-6">
        <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
      </div>

      <div className="flex-1 min-w-0 space-y-4">
        <div className="text-[11px] font-bold tracking-[0.6px] text-[#3b82f6] uppercase">
          AXESNTRA ASSISTANT
        </div>

        <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-2xl px-4 py-4 space-y-2">
          <div className="flex items-center gap-3">
            <ThinkingDots animate={!!msg.isThinking} />
            <span className="text-[12px] font-semibold text-[#1e293b]">{msg.thinkingLabel}</span>
          </div>
          <p className="text-[12px] text-[#64748b] leading-relaxed">{msg.thinkingStatus}</p>
        </div>

        <AnimatePresence>
          {!msg.isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="space-y-4"
            >
              {msg.assistantContent}
              {msg.tableData && <ViolationTable data={msg.tableData} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function AiChatPage({ carrier }: AiChatPageProps) {
  const makeInitialSession = (c: CarrierBrief): Session[] => [{
    id: 'session-1',
    title: 'Current Session',
    preview: `${c.carrierName} safety data`,
    messages: [],
  }];

  const [sessions, setSessions] = useState<Session[]>(() => makeInitialSession(carrier));
  const [activeSessionId, setActiveSessionId] = useState<string>('session-1');
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const prevCarrierRef = useRef<string>(carrier.usdot);

  // P0.3 — reset sessions whenever the active carrier changes
  useEffect(() => {
    if (prevCarrierRef.current !== carrier.usdot) {
      prevCarrierRef.current = carrier.usdot;
      const fresh = makeInitialSession(carrier);
      setSessions(fresh);
      setActiveSessionId(fresh[0].id);
      setInputText('');
      setIsGenerating(false);
    }
  }, [carrier]);

  const activeSession = sessions.find(s => s.id === activeSessionId) ?? sessions[0];
  const messages = activeSession?.messages ?? [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewSession = () => {
    const id = `session-${Date.now()}`;
    const newSession: Session = {
      id,
      title: 'New Session',
      preview: `${carrier.carrierName} safety data`,
      messages: [],
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(id);
    setInputText('');
  };

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isGenerating) return;

    const userMsgId = `user-${Date.now()}`;
    const aiMsgId   = `ai-${Date.now()}`;

    const userMsg: Message = { id: userMsgId, role: 'user', userText: trimmed };
    const thinking: Message = {
      id: aiMsgId,
      role: 'assistant',
      isThinking: true,
      thinkingLabel: 'Analyzing fleet safety data...',
      thinkingStatus: `Processing query for ${carrier.carrierName}...`,
    };

    setSessions(prev =>
      prev.map(s =>
        s.id === activeSessionId
          ? {
              ...s,
              messages: [...s.messages, userMsg, thinking],
              title: s.messages.length === 0 ? trimmed.slice(0, 32) + (trimmed.length > 32 ? '...' : '') : s.title,
              preview: trimmed.slice(0, 50),
            }
          : s
      )
    );
    setInputText('');
    setIsGenerating(true);

    setTimeout(() => {
      const response = respondToPrompt(trimmed, carrier);
      setSessions(prev =>
        prev.map(s =>
          s.id === activeSessionId
            ? {
                ...s,
                messages: s.messages.map(m =>
                  m.id === aiMsgId ? { ...m, isThinking: false, ...response } : m
                ),
              }
            : s
        )
      );
      setIsGenerating(false);
    }, 1800);
  };

  const handleSend = () => sendMessage(inputText);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Quick suggestions — each submits immediately (not just seeds the textarea)
  const quickSuggestions = [
    ...(FEATURES.featureGenerateReport ? [{ label: 'Generate Safety Report', query: 'Generate a full safety report for our fleet' }] : []),
    ...(FEATURES.featurePeerCompare    ? [{ label: 'Compare with Peer Group', query: 'How does our fleet compare to peer carriers in our industry?' }] : []),
    ...(FEATURES.featureExportPdf      ? [{ label: 'Export to PDF',           query: 'Export current safety data to PDF' }] : []),
  ];

  return (
    <div className="h-full overflow-hidden flex">

      {/* Secondary Sidebar */}
      <aside className="w-[256px] shrink-0 h-full flex flex-col bg-[#f8fafc] border-r border-[#e2e8f0]">
        {/* Branding */}
        <div className="px-6 pt-6 pb-1">
          <div className="flex flex-col gap-1">
            <span className="text-[20px] font-bold tracking-[-0.5px] text-[#0f172a] leading-7">AXESNTRA</span>
            <span className="text-[10px] font-bold tracking-[0.5px] uppercase text-[#3b82f6]">SAFETY INTELLIGENCE</span>
          </div>
        </div>

        {/* New Session Button */}
        <div className="px-4 py-4">
          <button
            onClick={handleNewSession}
            className="w-full flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-xl py-2.5 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">New Session</span>
          </button>
        </div>

        {/* Session List */}
        <nav className="flex-1 overflow-y-auto px-2 space-y-0.5" aria-label="Chat sessions">
          {sessions.map(session => {
            const active = session.id === activeSessionId;
            return (
              <button
                key={session.id}
                onClick={() => setActiveSessionId(session.id)}
                aria-current={active ? 'true' : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40 ${
                  active ? 'bg-[#f1f5f9]' : 'hover:bg-[#f1f5f9]/60'
                }`}
              >
                <MessageSquare className={`w-5 h-5 shrink-0 ${active ? 'text-[#3b82f6]' : 'text-[#94a3b8]'}`} />
                <div className="flex-1 min-w-0">
                  <div className={`text-sm truncate ${active ? 'font-semibold text-[#0f172a]' : 'font-medium text-[#64748b]'}`}>
                    {session.title}
                  </div>
                  {!active && (
                    <div className="text-[11px] text-[#94a3b8] truncate mt-0.5">{session.preview}</div>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Profile — persona pill hidden until featurePersonaSwitch ships */}
        <div className="border-t border-[#e2e8f0] px-4 py-4">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm">
            <div className="flex items-center gap-3 p-3">
              <div className="bg-[#f1f5f9] rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-[#0f172a]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold text-[#1e293b] truncate">Safety Manager</div>
                {FEATURES.featurePersonaSwitch ? (
                  <button className="text-[10px] text-[#3b82f6] hover:underline focus:outline-none">
                    Change role
                  </button>
                ) : (
                  <div className="text-[10px] text-[#64748b]">Standard Access</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <div className="flex-1 min-w-0 flex flex-col bg-white overflow-hidden">

        {/* Top Header */}
        <div className="shrink-0 h-16 bg-white border-b border-[#e2e8f0] flex items-center justify-between px-8 z-10">
          <span className="text-sm font-semibold tracking-[0.7px] text-[#64748b] uppercase">MISSION CONTROL</span>
          <div className="flex items-center gap-4">
            <button className="relative w-5 h-5 flex items-center justify-center text-[#64748b] hover:text-[#0f172a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40 rounded" aria-label="Notifications">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#ef4444] rounded-full border-2 border-white" />
            </button>
            <button className="w-5 h-5 flex items-center justify-center text-[#64748b] hover:text-[#0f172a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40 rounded" aria-label="Help">
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-[800px] mx-auto px-6 pt-8 pb-4 space-y-8">

            {/* Welcome */}
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <div className="bg-[rgba(59,130,246,0.1)] w-12 h-12 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#3b82f6]" />
              </div>
              <h2 className="text-[18px] font-bold text-[#0f172a]">AI Axesntra — ready to assist</h2>
            </div>

            {/* Conversation */}
            {messages.map(msg => (
              <AnimatePresence key={msg.id}>
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {msg.role === 'user' ? (
                    <div className="flex justify-end">
                      <div className="max-w-[462px] bg-[#f1f5f9] rounded-bl-2xl rounded-br-2xl rounded-tl-2xl shadow-sm px-4 py-[14px]">
                        <p className="text-[15px] text-[#1e293b] leading-relaxed">{msg.userText}</p>
                      </div>
                    </div>
                  ) : (
                    <AssistantMessage msg={msg} />
                  )}
                </motion.div>
              </AnimatePresence>
            ))}

            {/* Empty state — scoped to active carrier (P0.3) */}
            {messages.length === 0 && (
              <div className="text-center py-12 space-y-3">
                <p className="text-sm text-[#94a3b8]">
                  No messages yet. Ask me anything about {carrier.carrierName}&apos;s safety data.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    'What are my highest-risk BASIC categories?',
                    'What is my Vehicle Maintenance score?',
                    'How close am I to an FMCSA intervention?',
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(suggestion)}
                      className="px-3 py-1.5 text-xs text-[#64748b] bg-[#f8fafc] border border-[#e2e8f0] rounded-full hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="shrink-0 border-t border-[#e2e8f0] bg-white px-6 py-4 space-y-3">
          {/* Quick Suggestions — only rendered when feature flags are on */}
          {quickSuggestions.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {quickSuggestions.map((s, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(s.query)}
                  className="flex items-center justify-center px-4 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-full text-[12px] font-medium text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] hover:border-[#cbd5e1] transition-all whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Input Row */}
          <div className="flex items-end gap-3 bg-white border border-[#e2e8f0] rounded-2xl px-4 py-3 focus-within:border-[#94a3b8] focus-within:shadow-sm transition-all">
            <textarea
              ref={inputRef}
              rows={1}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Ask me anything about ${carrier.carrierName}'s safety...`}
              className="flex-1 text-sm text-[#1e293b] placeholder-[#94a3b8] resize-none focus:outline-none bg-transparent leading-relaxed max-h-32 overflow-y-auto"
              style={{ minHeight: 24 }}
              aria-label="Chat input"
            />
            <div className="flex items-center gap-2 shrink-0">
              <button className="text-[#94a3b8] hover:text-[#64748b] transition-colors p-1 focus:outline-none" aria-label="Attach file">
                <Paperclip className="w-4 h-4" />
              </button>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleSend}
                disabled={!inputText.trim() || isGenerating}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#3b82f6]/40 ${
                  inputText.trim() && !isGenerating
                    ? 'bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-sm'
                    : 'bg-[#f1f5f9] text-[#cbd5e1] cursor-not-allowed'
                }`}
                aria-label="Send message"
              >
                <ArrowUp className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          <p className="text-[10px] text-[#94a3b8] text-center">
            AI Axesntra may make mistakes. Verify critical compliance decisions with FMCSA records.
          </p>
        </div>
      </div>
    </div>
  );
}
