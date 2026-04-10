import Link from 'next/link';

const FOOTER_COLUMNS = [
  {
    title: 'Product',
    links: [
      { href: '/commercial/carrier-risk-monitoring-software', label: 'Risk Monitoring' },
      { href: '/resources/what-is-carrier-risk-intelligence', label: 'AI Safety Advisor' },
      { href: '/resources', label: 'DataQ Management' },
      { href: '/pricing', label: 'Pricing' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { href: '/early-access?role=owner', label: 'Owner Operators' },
      { href: '/early-access?role=fleet', label: 'Mid-Market Fleets' },
      { href: '/early-access?role=enterprise', label: 'Enterprise Logistics' },
      { href: '/commercial/carrier-screening-for-underwriters', label: 'Insurance Partners' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: '/methodology', label: 'About Us' },
      { href: '/early-access', label: 'Careers' },
      { href: '/early-access', label: 'Contact' },
      { href: '/early-access', label: 'Privacy' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { href: '#', label: 'LinkedIn' },
      { href: '#', label: 'Twitter' },
      { href: '/resources', label: 'Resources' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-sb-surface-container-low py-20 border-t border-sb-outline-variant/10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
          {/* Brand column */}
          <div className="col-span-2">
            <span className="text-2xl font-bold tracking-tighter text-blue-900 mb-6 block">
              Axesntra
            </span>
            <p className="text-sm text-sb-on-surface-variant leading-relaxed max-w-xs">
              The intelligence layer for commercial fleet safety and FMCSA compliance. Built for the
              modern safety manager.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title}>
              <h5 className="font-bold text-sb-on-background mb-6 uppercase tracking-widest text-xs">
                {col.title}
              </h5>
              <ul className="space-y-4 text-sm text-sb-on-surface-variant">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="hover:text-sb-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-sb-outline-variant/20 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-sb-on-surface-variant">
            &copy; 2024 Axesntra Intelligence. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-sb-on-surface-variant hover:text-sb-primary">
              Terms of Service
            </Link>
            <Link href="#" className="text-xs text-sb-on-surface-variant hover:text-sb-primary">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
