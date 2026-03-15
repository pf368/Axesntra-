import Link from 'next/link';
import { Shield } from 'lucide-react';

const FOOTER_SECTIONS = [
  {
    title: 'Product',
    links: [
      { href: '/commercial/carrier-risk-monitoring-software', label: 'Carrier Risk Monitoring Software' },
      { href: '/commercial/broker-carrier-screening-software', label: 'Broker Carrier Screening Software' },
      { href: '/commercial/carrier-screening-for-underwriters', label: 'Carrier Screening for Underwriters' },
      { href: '/commercial/carrier-watchlist-alerts', label: 'Carrier Watchlist Alerts' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { href: '/resources/what-is-carrier-risk-intelligence', label: 'What Is Carrier Risk Intelligence?' },
      { href: '/resources/how-to-evaluate-whether-a-carrier-is-safe', label: 'How to Evaluate Whether a Carrier Is Safe' },
      { href: '/resources/crash-history-vs-inspection-history', label: 'Crash History vs Inspection History' },
      { href: '/resources/what-does-out-of-service-mean-in-trucking', label: 'What Does Out-of-Service Mean?' },
      { href: '/resources/how-to-read-a-carrier-risk-report', label: 'How to Read a Carrier Risk Report' },
    ],
  },
  {
    title: 'Playbooks',
    links: [
      { href: '/playbooks/carrier-vetting-checklist-for-brokers', label: 'Carrier Vetting Checklist for Brokers' },
      { href: '/playbooks/what-to-do-after-an-out-of-service-event', label: 'What to Do After an OOS Event' },
      { href: '/playbooks/how-to-build-a-carrier-watchlist-process', label: 'How to Build a Carrier Watchlist' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/methodology', label: 'Methodology' },
      { href: '/early-access', label: 'Early Access' },
      { href: '/sample-report', label: 'Sample Report' },
      { href: '/resources', label: 'All Resources' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="container mx-auto px-4 max-w-7xl py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center">
              <Shield className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <span className="text-sm font-semibold text-slate-300">Axesntra</span>
          </div>
          <p className="text-xs text-slate-500">
            Axesntra is for screening and decision-support purposes only. Not an official FMCSA safety rating.
          </p>
        </div>
      </div>
    </footer>
  );
}
