'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Brain, MessageSquare, Plus, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import type { CarrierBrief } from '@/lib/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Session {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
}

const QUICK_SUGGESTIONS = [
  'What are my highest-risk BASIC categories?',
  'Which drivers need immediate attention?',
  'How do I improve my Vehicle Maintenance score?',
  'What is my risk of a CSA intervention?',
  'Explain the SMS scoring methodology',
  'What DataQ challenges should I file?',
];

interface AiChatPageProps {
  carrier: CarrierBrief;
}

export function AiChatPage({ carrier }: AiChatPageProps) {
  const [sessions, setSessions] = useState<Session[]>([
    { id: 's1', title: 'Safety Overview', lastMessage: 'AI analysis complete', timestamp: new Date(Date.now() - 3600000) },
    { id: 's2', title: 'HOS Violations', lastMessage: 'Review 395.8 violations...', timestamp: new Date(Date.now() - 86400000) },
  ]);
  const [activeSession, setActiveSession] = useState('s1');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  async function sendMessage(text?: string) {
    const content = text ?? input.trim();
    if (!content || isThinking) return;
    setInput('');

    const userMsg: Message = { id: `u${Date.now()}`, role: 'user', content, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setIsThinking(true);

    try {
      const res = await fetch('/api/ai/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: content,
          carrierContext: {
            name: carrier.carrierName,
            usdot: carrier.usdot,
            overallRisk: carrier.overallRisk,
            scoreContributions: carrier.scoreContributions,
            aiSummary: carrier.aiSummary,
          },
        }),
      });

      const data = await res.json();
      const responseText = data.response || data.text || 'I was unable to generate a response. Please try again.';

      const assistantMsg: Message = { id: `a${Date.now()}`, role: 'assistant', content: responseText, timestamp: new Date() };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        id: `a${Date.now()}`,
        role: 'assistant',
        content: `Here's an AI analysis for ${carrier.carrierName} (USDOT ${carrier.usdot}): Based on your current profile, your overall risk level is **${carrier.overallRisk}**. ${carrier.executiveMemo || carrier.aiSummary || 'I recommend focusing on your highest-scoring BASIC categories first.'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function startNewSession() {
    const newSession: Session = { id: `s${Date.now()}`, title: 'New Conversation', lastMessage: '', timestamp: new Date() };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSession(newSession.id);
    setMessages([]);
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Session sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-ax-border bg-white">
        <div className="p-4 border-b border-ax-border">
          <button
            onClick={startNewSession}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-ax-border text-xs font-medium text-ax-text hover:bg-ax-border-light transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            New Conversation
          </button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {sessions.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSession(s.id)}
                className={cn(
                  'w-full text-left p-3 rounded-lg text-xs transition-colors',
                  activeSession === s.id ? 'bg-ax-primary/8 text-ax-primary' : 'text-ax-text-secondary hover:bg-ax-border-light'
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="h-3 w-3 shrink-0" />
                  <span className="font-semibold truncate">{s.title}</span>
                </div>
                <p className="text-[10px] text-ax-text-muted truncate">{s.lastMessage}</p>
              </button>
            ))}
          </div>
        </ScrollArea>
        <div className="p-4 border-t border-ax-border">
          <div className="flex items-center gap-2 text-xs text-ax-text-muted">
            <Brain className="h-3.5 w-3.5 text-ax-primary" />
            <span>Powered by Claude</span>
          </div>
        </div>
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-ax-surface-secondary">
        {/* Header */}
        <div className="bg-white border-b border-ax-border px-6 py-3.5 flex items-center gap-3 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-ax-primary/10 flex items-center justify-center">
            <Brain className="h-4 w-4 text-ax-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-ax-text">AI Safety Advisor</h1>
            <p className="text-[10px] text-ax-text-muted">{carrier.carrierName} · USDOT {carrier.usdot}</p>
          </div>
          <Badge variant="default" className="ml-auto gap-1.5">
            <Sparkles className="h-2.5 w-2.5" />
            Claude AI
          </Badge>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4 py-6">
          {messages.length === 0 ? (
            <WelcomeScreen carrier={carrier} onSuggestion={sendMessage} />
          ) : (
            <div className="max-w-3xl mx-auto space-y-4">
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-6 h-6 rounded-full bg-ax-primary/10 flex items-center justify-center mr-2.5 mt-1 shrink-0">
                        <Brain className="h-3 w-3 text-ax-primary" />
                      </div>
                    )}
                    <div className={cn(
                      'max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
                      msg.role === 'user'
                        ? 'bg-ax-primary text-white rounded-tr-sm'
                        : 'bg-white border border-ax-border text-ax-text rounded-tl-sm shadow-sm'
                    )}>
                      {msg.content.split('\n').map((line, i) => (
                        <p key={i} className={i > 0 ? 'mt-2' : ''}>{line}</p>
                      ))}
                      <p className={cn('text-[10px] mt-2 opacity-60', msg.role === 'user' ? 'text-right' : '')}>
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {isThinking && <ThinkingIndicator />}
            </div>
          )}
          <div ref={messagesEndRef} />
        </ScrollArea>

        {/* Input area */}
        <div className="bg-white border-t border-ax-border p-4 shrink-0">
          <div className="max-w-3xl mx-auto">
            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {QUICK_SUGGESTIONS.slice(0, 4).map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="text-[11px] px-2.5 py-1 rounded-full border border-ax-border text-ax-text-secondary hover:border-ax-primary/40 hover:text-ax-primary transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Ask anything about ${carrier.carrierName}'s safety profile…`}
                className="min-h-[44px] max-h-32 resize-none text-sm py-2.5"
                rows={1}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isThinking}
                className={cn(
                  'flex items-center justify-center w-10 h-10 rounded-lg transition-all shrink-0',
                  input.trim() && !isThinking
                    ? 'bg-ax-primary text-white hover:bg-ax-primary-hover'
                    : 'bg-ax-border-light text-ax-text-muted cursor-not-allowed'
                )}
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <p className="text-[10px] text-ax-text-muted mt-2 text-center">AI responses are based on FMCSA data and may not replace professional compliance advice.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="w-6 h-6 rounded-full bg-ax-primary/10 flex items-center justify-center mr-2.5 mt-1 shrink-0">
        <Brain className="h-3 w-3 text-ax-primary" />
      </div>
      <div className="bg-white border border-ax-border rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
        <span className="ax-thinking-dot h-2 w-2 rounded-full bg-ax-text-muted" />
        <span className="ax-thinking-dot h-2 w-2 rounded-full bg-ax-text-muted" />
        <span className="ax-thinking-dot h-2 w-2 rounded-full bg-ax-text-muted" />
      </div>
    </motion.div>
  );
}

function WelcomeScreen({ carrier, onSuggestion }: { carrier: CarrierBrief; onSuggestion: (s: string) => void }) {
  return (
    <div className="max-w-2xl mx-auto text-center py-8">
      <div className="w-12 h-12 rounded-2xl bg-ax-primary/10 flex items-center justify-center mx-auto mb-4">
        <Brain className="h-6 w-6 text-ax-primary" />
      </div>
      <h2 className="text-lg font-bold text-ax-text mb-2">AI Safety Advisor</h2>
      <p className="text-sm text-ax-text-secondary mb-1">
        I have full context on <strong>{carrier.carrierName}</strong>'s safety profile.
      </p>
      <p className="text-xs text-ax-text-muted mb-8">
        USDOT {carrier.usdot} · Risk: {carrier.overallRisk}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
        {QUICK_SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => onSuggestion(s)}
            className="p-3 rounded-xl border border-ax-border bg-white text-xs text-ax-text text-left hover:border-ax-primary/40 hover:shadow-sm transition-all"
          >
            <Sparkles className="h-3 w-3 text-ax-primary mb-1" />
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
