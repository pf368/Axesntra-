import Link from 'next/link';
import { BookOpen, CircleHelp as HelpCircle, ClipboardList, Building2, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resources - Axesntra',
  description: 'Axesntra guides, quick-answer pages, and operational playbooks for insurance, brokerage, and transportation teams evaluating motor carriers.',
};

const GUIDES = [
  { href: '/resources/what-is-carrier-risk-intelligence', title: 'What Is Carrier Risk Intelligence?' },
  { href: '/resources/how-to-evaluate-whether-a-carrier-is-safe', title: 'How to Evaluate Whether a Carrier Is Safe' },
  { href: '/resources/crash-history-vs-inspection-history', title: 'Crash History vs Inspection History' },
  { href: '/resources/what-does-out-of-service-mean-in-trucking', title: 'What Does Out-of-Service Mean in Trucking?' },
  { href: '/resources/how-to-read-a-carrier-risk-report', title: 'How to Read a Carrier Risk Report' },
  { href: '/resources/why-one-time-carrier-screening-is-not-enough', title: 'Why One-Time Carrier Screening Is Not Enough' },
];

const QUESTIONS = [
  { href: '/questions/what-is-a-csa-score', title: 'What Is a CSA Score?' },
  { href: '/questions/what-is-a-bad-csa-score', title: 'What Is a Bad CSA Score?' },
  { href: '/questions/how-do-you-check-if-a-carrier-is-safe', title: 'How Do You Check If a Carrier Is Safe?' },
  { href: '/questions/what-does-a-conditional-safety-rating-mean', title: 'What Does a Conditional Safety Rating Mean?' },
  { href: '/questions/what-does-inactive-authority-mean', title: 'What Does Inactive Authority Mean?' },
];

const PLAYBOOKS = [
  { href: '/playbooks/carrier-vetting-checklist-for-brokers', title: 'Carrier Vetting Checklist for Brokers' },
  { href: '/playbooks/what-to-do-after-an-out-of-service-event', title: 'What to Do After an Out-of-Service Event' },
  { href: '/playbooks/how-to-build-a-carrier-watchlist-process', title: 'How to Build a Carrier Watchlist Process' },
];

const COMMERCIAL = [
  { href: '/commercial/carrier-risk-monitoring-software', title: 'Carrier Risk Monitoring Software' },
  { href: '/commercial/broker-carrier-screening-software', title: 'Broker Carrier Screening Software' },
  { href: '/commercial/carrier-screening-for-underwriters', title: 'Carrier Screening for Underwriters' },
  { href: '/commercial/carrier-watchlist-alerts', title: 'Carrier Watchlist Alerts' },
];

function ResourceSection({
  icon: Icon,
  title,
  items,
}: {
  icon: React.ElementType;
  title: string;
  items: { href: string; title: string }[];
}) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center">
          <Icon className="h-4 w-4 text-white" />
        </div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group bg-white rounded-xl p-5 border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all"
          >
            <h3 className="font-medium text-slate-900 group-hover:text-slate-700 mb-1 text-sm">
              {item.title}
            </h3>
            <span className="inline-flex items-center gap-1 text-xs text-slate-500 group-hover:text-slate-700 transition-colors">
              Read more <ArrowRight className="h-3 w-3" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 text-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="text-4xl font-bold mb-4">Resources</h1>
          <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">
            Axesntra resources are designed for insurance, brokerage, and transportation teams that need a more disciplined way to evaluate motor carriers. Explore guides, quick-answer pages, and operational playbooks built around real carrier screening workflows.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-16 space-y-14">
        <ResourceSection icon={BookOpen} title="Guides" items={GUIDES} />
        <ResourceSection icon={HelpCircle} title="Questions" items={QUESTIONS} />
        <ResourceSection icon={ClipboardList} title="Playbooks" items={PLAYBOOKS} />
        <ResourceSection icon={Building2} title="Product" items={COMMERCIAL} />
      </div>
    </div>
  );
}
