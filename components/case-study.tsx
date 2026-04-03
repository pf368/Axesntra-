import Link from 'next/link';

export function CaseStudy() {
  return (
    <section className="py-20" style={{ background: '#0B1120' }}>
      <div className="container mx-auto px-4 max-w-[900px]">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">Case Study</p>
          <h2 className="text-3xl font-bold text-white mb-3">
            How a regional insurer transformed carrier review
          </h2>
        </div>

        {/* Card */}
        <div className="bg-[#27272A] rounded-2xl p-10 md:p-12">
          {/* Pull quote */}
          <blockquote className="text-xl text-white leading-relaxed mb-10 border-l-4 border-indigo-500 pl-6">
            &ldquo;We replaced a 45-minute manual spreadsheet process with a 3-minute Axesntra brief. Our underwriting team reviews carriers in half the time and with significantly more confidence.&rdquo;
          </blockquote>

          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-6 mb-10">
            {[
              { value: '60%', label: 'Faster carrier review', color: 'text-emerald-400' },
              { value: '3', label: 'At-risk carriers caught in first month', color: 'text-amber-400' },
              { value: '98%', label: 'Pilot team retention after 6 months', color: 'text-blue-400' },
            ].map((m) => (
              <div key={m.label} className="text-center">
                <p className={`text-3xl font-bold ${m.color}`}>{m.value}</p>
                <p className="text-sm text-zinc-400 mt-1">{m.label}</p>
              </div>
            ))}
          </div>

          {/* Attribution */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-zinc-600 flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-zinc-300">VP</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">VP of Underwriting</p>
              <p className="text-xs text-zinc-400">Commercial Auto Insurance · Southeast US · 200–500 employees · Pilot user, 6 months</p>
            </div>
          </div>
        </div>

        {/* Below card CTA */}
        <p className="text-center text-sm text-zinc-400 mt-8">
          <Link href="/early-access" className="text-white hover:text-indigo-300 font-medium transition-colors">
            Join 40+ teams already in the pilot &rarr;
          </Link>
        </p>
      </div>
    </section>
  );
}
