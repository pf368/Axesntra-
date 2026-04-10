import { Search, MessageSquare, MousePointerClick, ClipboardCheck, LucideIcon } from 'lucide-react';

const STEPS: { icon: LucideIcon; step: string; title: string; description: string }[] = [
  {
    icon: Search,
    step: 'Step 1',
    title: 'Ask about any carrier',
    description:
      'Enter a USDOT number. The AI pulls the full record: inspections, crashes, and 12-month trend data.',
  },
  {
    icon: MessageSquare,
    step: 'Step 2',
    title: 'Get plain-English analysis',
    description:
      "Instead of raw percentiles, you get a risk narrative: what's wrong and how it compares.",
  },
  {
    icon: MousePointerClick,
    step: 'Step 3',
    title: 'Drill into any violation',
    description:
      'Click any violation code and ask: "How do I prevent it?" The AI explains each one in context.',
  },
  {
    icon: ClipboardCheck,
    step: 'Step 4',
    title: 'Act on recommendations',
    description:
      'Every brief ends with a prioritized remediation plan and documentation you can share.',
  },
];

export function HowItWorks() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <span className="text-sb-primary font-bold text-xs tracking-widest uppercase mb-4 block">
            The AI Agent
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-6 text-slate-900">
            Not a dashboard. An AI Safety advisor.
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-slate-600">
            You ask questions. It analyzes the data, explains the risk, and tells you what to do.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STEPS.map((s) => (
            <div key={s.step} className="palantir-card p-8 text-center space-y-4">
              <div className="w-16 h-16 bg-sb-primary/5 rounded-full flex items-center justify-center mx-auto text-sb-primary mb-2 border border-sb-primary/10">
                <s.icon className="h-7 w-7" />
              </div>
              <span className="font-bold text-[10px] tracking-widest uppercase block text-sb-primary">
                {s.step}
              </span>
              <h3 className="text-xl font-bold text-slate-900">{s.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
