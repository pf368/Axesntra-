import Link from 'next/link';
import { BookOpen, FileText, ClipboardList } from 'lucide-react';

const OFFERS = [
  {
    icon: BookOpen,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50',
    title: 'What Is Carrier Risk Intelligence?',
    desc: 'A complete guide to how inspection, crash, and OOS data combine into a structured carrier risk view.',
    href: '/resources/what-is-carrier-risk-intelligence',
    cta: 'Read the guide',
  },
  {
    icon: FileText,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50',
    title: 'See a Live Carrier Brief',
    desc: 'Explore a full risk report with scores, trends, AI analysis, and remediation plans — built from real FMCSA data.',
    href: '/sample-report',
    cta: 'See a live demo',
  },
  {
    icon: ClipboardList,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50',
    title: 'Carrier Vetting Checklist',
    desc: 'A step-by-step review process designed for freight brokers screening carriers before onboarding.',
    href: '/playbooks/carrier-vetting-checklist-for-brokers',
    cta: 'Get the checklist',
  },
];

export function MidFunnelOffers() {
  return (
    <section className="py-20 bg-slate-50">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Not ready for a pilot? Explore first.
          </h2>
          <p className="text-slate-600">
            Explore carrier risk intelligence at your own pace.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {OFFERS.map((offer) => (
            <Link
              key={offer.title}
              href={offer.href}
              className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 block"
            >
              <div className={`w-10 h-10 ${offer.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                <offer.icon className={`h-5 w-5 ${offer.iconColor}`} />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">{offer.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">{offer.desc}</p>
              <span className="text-sm text-blue-600 group-hover:text-blue-500 font-medium transition-colors">
                {offer.cta} &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
