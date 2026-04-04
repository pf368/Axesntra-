import Link from 'next/link';
import { Search, MessageSquare, MousePointerClick, ClipboardCheck } from 'lucide-react';

const STEPS = [
  {
    icon: Search,
    title: 'Ask about any carrier',
    desc: 'Enter a USDOT number or carrier name. The AI pulls the full FMCSA record: inspections, violations, crashes, OOS events, authority status, and 12-month trend data.',
  },
  {
    icon: MessageSquare,
    title: 'Get plain-English analysis',
    desc: "Instead of raw percentiles, you get a risk narrative: what's wrong, why it matters, and how it compares to similar carriers. Scored across 5 BASIC categories.",
  },
  {
    icon: MousePointerClick,
    title: 'Drill into any violation',
    desc: 'Click any violation code in the report and ask the AI: "Why is this an OOS? How do I prevent it? What internal control would catch this?" The AI explains each one in your workflow\'s context.',
  },
  {
    icon: ClipboardCheck,
    title: 'Act on recommendations',
    desc: 'Every brief ends with a prioritized remediation plan, AI-generated compliance programs, and documentation you can share with leadership — without building a deck from scratch.',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20" style={{ background: '#0B1120' }}>
      <div className="container mx-auto px-4 max-w-[1100px]">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">The AI Agent</p>
          <h2 className="text-3xl font-bold text-white mb-3">
            Not a dashboard. An advisor.
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            You ask questions. It analyzes the data, explains the risk, and tells you what to do.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {STEPS.map((step, i) => (
            <div key={step.title} className="text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center mx-auto mb-4">
                <step.icon className="h-5 w-5 text-white" />
              </div>
              <div className="text-xs font-medium text-indigo-400 uppercase tracking-wider mb-2">Step {i + 1}</div>
              <h3 className="font-semibold text-white mb-2 text-sm">{step.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA link */}
        <div className="text-center">
          <Link
            href="/sample-report"
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            See a full carrier brief with all analysis &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
