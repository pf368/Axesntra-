import Link from 'next/link';

const PERSONAS = [
  {
    icon: '📋',
    iconBg: 'bg-blue-50',
    title: 'For Underwriters',
    body: 'Screen new submissions in minutes, not hours. Get AI-written risk summaries ready for your committee — with every BASIC scored, trended, and explained in plain English.',
    bullets: [
      'Multi-factor risk scoring across 5 BASIC categories',
      'AI-generated underwriting memos',
      '12-month trend to catch deteriorating carriers early',
    ],
    cta: 'See the underwriting workflow →',
    href: '/early-access?role=underwriter',
  },
  {
    icon: '🚛',
    iconBg: 'bg-emerald-50',
    title: 'For Freight Brokers',
    body: "Vet carriers before they touch your customer's freight. Build a consistent, repeatable screening process with audit-ready documentation on every decision.",
    bullets: [
      'Pre-onboarding carrier vetting in seconds',
      'Re-screening alerts when a carrier deteriorates',
      'Exportable brief for your carrier file',
    ],
    cta: 'See the broker workflow →',
    href: '/early-access?role=broker',
  },
  {
    icon: '🛡',
    iconBg: 'bg-amber-50',
    title: 'For Safety & Compliance',
    body: "Monitor your fleet's FMCSA profile continuously. Know when a trend is turning negative before it becomes a roadside intervention, an OOS event, or an enforcement action.",
    bullets: [
      'Daily monitoring of your active carrier roster',
      'Proactive alerts when any BASIC crosses threshold',
      'AI-generated compliance programs tied to your specific violations',
    ],
    cta: 'See the safety workflow →',
    href: '/early-access?role=safety',
  },
];

export function PersonaCards() {
  return (
    <section id="personas" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-[1100px]">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Built for Your Workflow</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            One platform, tailored to your role
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Every team manages carrier risk differently. Axesntra adapts to how you actually work.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {PERSONAS.map((p) => (
            <Link
              key={p.title}
              href={p.href}
              className="group border border-slate-200 rounded-[14px] p-7 hover:border-blue-400 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer block"
            >
              <div className={`w-10 h-10 ${p.iconBg} rounded-lg flex items-center justify-center mb-4 text-lg`}>
                {p.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{p.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{p.body}</p>
              <ul className="space-y-2 mb-5">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-slate-600">
                    <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                    {b}
                  </li>
                ))}
              </ul>
              <span className="text-sm text-blue-600 group-hover:text-blue-500 font-medium transition-colors">
                {p.cta}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
