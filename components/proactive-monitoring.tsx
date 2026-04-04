import Link from 'next/link';

const ALERTS = [
  {
    severity: 'red',
    icon: '⚠',
    iconBg: 'bg-red-100',
    title: 'ACME Transport — Risk score jumped to 72',
    body: 'Vehicle maintenance percentile increased from 78th to 89th after 2 new OOS events this month. Crash indicator also worsening. Recommend immediate review before renewal.',
    meta: 'USDOT 491180 · Detected 2 hours ago · Commercial Auto book',
    primary: 'Review brief',
    secondary: 'Dismiss',
  },
  {
    severity: 'amber',
    icon: '📋',
    iconBg: 'bg-amber-100',
    title: 'Midwest Logistics — New inspection with violations',
    body: 'Roadside inspection in Indiana recorded 3 vehicle violations: brake adjustment, tire tread, lighting. No OOS issued, but the pattern matches pre-OOS deterioration in their history.',
    meta: 'USDOT 847291 · Detected yesterday · Freight Brokerage book',
    primary: 'Review brief',
    secondary: 'Dismiss',
  },
  {
    severity: 'green',
    icon: '✓',
    iconBg: 'bg-emerald-100',
    title: 'Northeast Express — Risk score improved to 28',
    body: 'All BASIC categories now below intervention thresholds. 90-day clean inspection record. Trend is stable-to-improving. No action needed at this time.',
    meta: 'USDOT 715394 · Updated 3 days ago · Fleet Operations',
    primary: null,
    secondary: 'View brief',
  },
];

export function ProactiveMonitoring() {
  return (
    <section className="py-20 bg-zinc-50">
      <div className="container mx-auto px-4 max-w-[1000px]">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Continuous Monitoring</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Your AI watches your book 24/7
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Axesntra monitors every carrier in your portfolio and alerts you the moment something changes — before it becomes a claim.
          </p>
        </div>

        {/* Alert feed */}
        <div className="space-y-4">
          {ALERTS.map((alert) => (
            <div
              key={alert.title}
              className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col md:flex-row md:items-start gap-4"
            >
              {/* Icon */}
              <div className={`w-10 h-10 ${alert.iconBg} rounded-lg flex items-center justify-center flex-shrink-0 text-lg`}>
                {alert.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900 text-sm mb-1">{alert.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-2">{alert.body}</p>
                <p className="text-xs text-slate-400">{alert.meta}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-shrink-0">
                {alert.primary && (
                  <span className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium cursor-default">
                    {alert.primary}
                  </span>
                )}
                <span className="text-xs border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg font-medium cursor-default">
                  {alert.secondary}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-slate-500 mt-8">
          Your full watchlist lives inside the platform.{' '}
          <Link href="/early-access" className="text-blue-600 hover:text-blue-500 font-medium">
            Join the pilot &rarr;
          </Link>
        </p>
      </div>
    </section>
  );
}
