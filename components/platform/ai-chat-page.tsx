'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, MessageSquare, Bell, HelpCircle, Sparkles,
  Paperclip, ArrowUp, User,
} from 'lucide-react';
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

// ─── Simulated AI Responses ────────────────────────────────────────────────────

function buildAuditResponse(): Pick<Message, 'thinkingLabel' | 'thinkingStatus' | 'assistantContent' | 'tableData'> {
  return {
    thinkingLabel: 'Analyzing DOT Safety Data...',
    thinkingStatus: "I'm scanning FMCSA records and Texas region logs for Carrier 1775970.",
    assistantContent: (
      <p className="text-[15px] text-[#1e293b] leading-relaxed">
        Audit complete for{' '}
        <strong className="font-semibold text-[#0f172a]">
          Trans-Continental Logistics Inc (DOT 1775970)
        </strong>
        .<br />
        I&apos;ve identified a 14% increase in Hours-of-Service (HOS) violations near the Laredo border
        crossing over the last 90 days.
      </p>
    ),
    tableData: [
      { violation: 'False Log Entry (395.8e)', frequency: 12, riskLevel: 'HIGH RISK' },
      { violation: 'Local Laws (392.2C)', frequency: 4, riskLevel: 'STABLE' },
    ],
  };
}

function generateResponse(
  input: string
): Pick<Message, 'thinkingLabel' | 'thinkingStatus' | 'assistantContent' | 'tableData'> {
  const q = input.toLowerCase();

  if (q.includes('hos') || q.includes('hours of service') || q.includes('logbook') || q.includes('eld')) {
    return {
      thinkingLabel: 'Querying HOS Compliance Data...',
      thinkingStatus: 'Correlating ELD records with inspection history across all drivers.',
      assistantContent: (
        <p className="text-[15px] text-[#1e293b] leading-relaxed">
          Your fleet&apos;s <strong className="font-semibold text-[#0f172a]">HOS BASIC score is 72.8</strong>,
          which currently exceeds the 65th-percentile intervention threshold. Over the last 90 days, I&apos;ve
          found 3 repeat offenders with a pattern of unaccounted on-duty time. Immediate ELD audit and
          targeted driver training are recommended.
        </p>
      ),
      tableData: [
        { violation: 'Unaccounted On-Duty Time (395.8)', frequency: 9, riskLevel: 'HIGH RISK' },
        { violation: 'Log Form & Manner (395.8a)', frequency: 5, riskLevel: 'ELEVATED' },
        { violation: 'ELD Manual Missing (395.8k)', frequency: 3, riskLevel: 'STABLE' },
      ],
    };
  }

  if (q.includes('maintenance') || q.includes('brake') || q.includes('tire') || q.includes('vehicle')) {
    return {
      thinkingLabel: 'Reviewing Vehicle Maintenance Records...',
      thinkingStatus: 'Cross-referencing roadside inspection reports with PM schedule data.',
      assistantContent: (
        <p className="text-[15px] text-[#1e293b] leading-relaxed">
          Vehicle Maintenance BASIC stands at <strong className="font-semibold text-[#0f172a]">72.8</strong>,
          trending upward (+6.3 over 30 days). Brake-related violations account for 4 of the last 6
          inspection findings — a pattern suggesting a systemic pre-trip inspection gap rather than
          isolated incidents.
        </p>
      ),
      tableData: [
        { violation: 'Brakes Out of Adjustment (396.3a)', frequency: 4, riskLevel: 'HIGH RISK' },
        { violation: 'Tire Tread Below Minimum (393.75)', frequency: 2, riskLevel: 'ELEVATED' },
        { violation: 'Lighting (393.9)', frequency: 1, riskLevel: 'STABLE' },
      ],
    };
  }

  if (q.includes('csa') || q.includes('score') || q.includes('threshold') || q.includes('percentile')) {
    return {
      thinkingLabel: 'Fetching CSA BASIC Scores...',
      thinkingStatus: 'Loading 24-month SMS percentile data from FMCSA portal.',
      assistantContent: (
        <p className="text-[15px] text-[#1e293b] leading-relaxed">
          Your fleet&apos;s overall safety percentile is{' '}
          <strong className="font-semibold text-[#0f172a]">54.2</strong>. Three BASICs are currently in
          elevated territory: <strong className="font-semibold text-[#0f172a]">HOS Compliance (72.8)</strong>,{' '}
          <strong className="font-semibold text-[#0f172a]">Vehicle Maintenance (72.8)</strong>, and{' '}
          <strong className="font-semibold text-[#0f172a]">Hazardous Materials (68.5)</strong>. If current
          trends continue, a compliance review is likely within 60–90 days.
        </p>
      ),
      tableData: [
        { violation: 'HOS Compliance', frequency: 73, riskLevel: 'HIGH RISK' },
        { violation: 'Vehicle Maintenance', frequency: 73, riskLevel: 'HIGH RISK' },
        { violation: 'Hazardous Materials', frequency: 69, riskLevel: 'ELEVATED' },
      ],
    };
  }

  if (q.includes('report') || q.includes('pdf') || q.includes('export')) {
    return {
      thinkingLabel: 'Generating Safety Report...',
      thinkingStatus: 'Compiling inspection history, BASIC scores, and trend analysis.',
      assistantContent: (
        <p className="text-[15px] text-[#1e293b] leading-relaxed">
          I&apos;ve compiled a full safety report for{' '}
          <strong className="font-semibold text-[#0f172a]">North Star Logistics LLC (DOT 2847156)</strong>.
          The report includes a 24-month BASIC score history, top violation breakdown, driver risk rankings,
          and a prioritized action plan. You can export this as a PDF using the button below.
        </p>
      ),
    };
  }

  return {
    thinkingLabel: 'Analyzing Fleet Safety Data...',
    thinkingStatus: "I'm cross-referencing your inspection records and BASIC scores.",
    assistantContent: (
      <p className="text-[15px] text-[#1e293b] leading-relaxed">
        Based on your fleet&apos;s current data, the highest-priority areas are{' '}
        <strong className="font-semibold text-[#0f172a]">HOS Compliance</strong> and{' '}
        <strong className="font-semibold text-[#0f172a]">Vehicle Maintenance</strong>, both above the
        65th-percentile threshold. Would you like me to drill into a specific BASIC category, run a
        driver risk analysis, or generate a compliance action plan?
      </p>
    ),
  };
}

// ─── Initial session ───────────────────────────────────────────────────────────

const auditData = buildAuditResponse();

const INITIAL_SESSION: Session = {
  id: 'session-1',
  title: 'Current Assistant',
  preview: 'Safety audit DOT #1775970',
  messages: [
    {
      id: 'user-1',
      role: 'user',
      userText:
        'Execute a safety audit for Carrier DOT #1775970. Cross-reference ELD logs with recent OOS inspection patterns in the Texas corridor.',
    },
    {
      id: 'ai-1',
      role: 'assistant',
      isThinking: false,
      ...auditData,
    },
  ],
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function ThinkingDots({ animate }: { animate: boolean }) {
  return (
    <div className="flex items-center gap-1">
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
        <div className="px-3 py-3 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider">VIOLATION</div>
        <div className="px-3 py-3 text-[11px] font-semibold text-[#64748b] uppercase tracking-wider text-center">FREQUENCY</div>
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
      {/* Avatar */}
      <div className="bg-[#0f172a] rounded-xl w-8 h-8 flex items-center justify-center shrink-0 mt-6">
        <Sparkles className="w-4 h-4 text-white" />
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
  const [sessions, setSessions] = useState<Session[]>([INITIAL_SESSION]);
  const [activeSessionId, setActiveSessionId] = useState<string>('session-1');
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
      preview: 'Start a new conversation',
      messages: [],
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(id);
    setInputText('');
  };

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || isGenerating) return;

    const userMsgId = `user-${Date.now()}`;
    const aiMsgId = `ai-${Date.now()}`;

    const userMsg: Message = { id: userMsgId, role: 'user', userText: text };
    const thinkingMsg: Message = {
      id: aiMsgId,
      role: 'assistant',
      isThinking: true,
      thinkingLabel: 'Analyzing fleet safety data...',
      thinkingStatus: `Processing your query about "${text.slice(0, 60)}${text.length > 60 ? '...' : ''}"`,
    };

    setSessions(prev =>
      prev.map(s =>
        s.id === activeSessionId
          ? {
              ...s,
              messages: [...s.messages, userMsg, thinkingMsg],
              title: s.messages.length === 0 ? text.slice(0, 32) + (text.length > 32 ? '...' : '') : s.title,
              preview: text.slice(0, 50),
            }
          : s
      )
    );
    setInputText('');
    setIsGenerating(true);

    setTimeout(() => {
      const response = generateResponse(text);
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
    }, 2200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickSuggestions = [
    { label: 'Generate Safety Report', query: 'Generate a full safety report for our fleet' },
    { label: 'Compare with Peer Group', query: 'How does our fleet compare to peer carriers in our industry?' },
    { label: 'Export to PDF', query: 'I need to export current safety data to PDF for my safety director' },
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
            className="w-full flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-[#1e293b] text-white rounded-xl py-2.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm font-medium">New Session</span>
          </button>
        </div>

        {/* Session List */}
        <nav className="flex-1 overflow-y-auto px-2 space-y-0.5">
          {sessions.map(session => {
            const active = session.id === activeSessionId;
            return (
              <button
                key={session.id}
                onClick={() => setActiveSessionId(session.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
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

        {/* Profile */}
        <div className="border-t border-[#e2e8f0] px-4 py-4">
          <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm">
            <div className="flex items-center gap-3 p-3">
              <div className="bg-[#f1f5f9] rounded-full w-8 h-8 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-[#0f172a]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-bold text-[#1e293b] truncate">Safety Manager</div>
                <div className="text-[10px] text-[#64748b]">Standard Access</div>
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
            <button className="relative w-5 h-5 flex items-center justify-center text-[#64748b] hover:text-[#0f172a] transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#ef4444] rounded-full border-2 border-white" />
            </button>
            <button className="w-5 h-5 flex items-center justify-center text-[#64748b] hover:text-[#0f172a] transition-colors">
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
              <h2 className="text-[18px] font-bold text-[#0f172a]">AI Axesntra - ready to assist</h2>
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

            {/* Empty state */}
            {messages.length === 0 && (
              <div className="text-center py-12 space-y-3">
                <p className="text-sm text-[#94a3b8]">
                  No messages yet. Ask me anything about {carrier.carrierName}&apos;s safety data.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {[
                    'What are my highest-risk BASIC categories?',
                    'Which drivers have the most violations?',
                    'How close am I to an FMCSA intervention?',
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => { setInputText(suggestion); inputRef.current?.focus(); }}
                      className="px-3 py-1.5 text-xs text-[#64748b] bg-[#f8fafc] border border-[#e2e8f0] rounded-full hover:bg-[#f1f5f9] hover:text-[#0f172a] transition-colors"
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
          {/* Quick Suggestions */}
          <div className="flex items-center gap-2 flex-wrap">
            {quickSuggestions.map((s, i) => (
              <button
                key={i}
                onClick={() => { setInputText(s.query); inputRef.current?.focus(); }}
                className="flex items-center justify-center px-4 py-1.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-full text-[12px] font-medium text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a] hover:border-[#cbd5e1] transition-all whitespace-nowrap"
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Input Row */}
          <div className="flex items-end gap-3 bg-white border border-[#e2e8f0] rounded-2xl px-4 py-3 focus-within:border-[#94a3b8] focus-within:shadow-sm transition-all">
            <textarea
              ref={inputRef}
              rows={1}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything about your fleet's safety..."
              className="flex-1 text-sm text-[#1e293b] placeholder-[#94a3b8] resize-none focus:outline-none bg-transparent leading-relaxed max-h-32 overflow-y-auto"
              style={{ minHeight: 24 }}
            />
            <div className="flex items-center gap-2 shrink-0">
              <button className="text-[#94a3b8] hover:text-[#64748b] transition-colors p-1">
                <Paperclip className="w-4 h-4" />
              </button>
              <motion.button
                whileTap={{ scale: 0.92 }}
                onClick={handleSend}
                disabled={!inputText.trim() || isGenerating}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  inputText.trim() && !isGenerating
                    ? 'bg-[#0f172a] hover:bg-[#1e293b] text-white shadow-sm'
                    : 'bg-[#f1f5f9] text-[#cbd5e1] cursor-not-allowed'
                }`}
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
