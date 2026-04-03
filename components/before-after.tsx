export function BeforeAfter() {
  return (
    <section className="py-20 bg-zinc-100">
      <div className="container mx-auto px-4 max-w-[1100px]">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">See the Difference</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            From raw government data to actionable intelligence
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            The same carrier. The same public FMCSA data. A completely different experience.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          {/* ── Before card ── */}
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
            <div className="bg-red-600 text-white px-5 py-3 text-sm font-semibold">
              Before — Raw FMCSA data
            </div>
            <div className="p-5 space-y-4">
              {/* SAFER header */}
              <div className="bg-[#1E3A5F] text-white px-3 py-2 rounded text-xs font-serif">
                FMCSA SAFER System — Company Snapshot
              </div>
              {/* Identity table */}
              <table className="w-full text-xs font-mono">
                <tbody>
                  {[
                    ['USDOT Number', '491180'],
                    ['Legal Name', 'ACME TRANSPORT LLC'],
                    ['Operating Status', 'AUTHORIZED'],
                    ['Entity Type', 'CARRIER'],
                  ].map(([k, v], i) => (
                    <tr key={k} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                      <td className="px-2 py-1.5 text-slate-600 font-medium w-1/2">{k}</td>
                      <td className="px-2 py-1.5 text-slate-900">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* SMS BASIC table */}
              <div className="text-xs font-semibold text-slate-700 mt-3 mb-1">SMS BASIC RESULTS</div>
              <table className="w-full text-xs font-mono border border-slate-200">
                <thead>
                  <tr className="bg-slate-100 text-slate-600">
                    <th className="text-left px-2 py-1.5 font-medium">BASIC</th>
                    <th className="text-center px-2 py-1.5 font-medium">Measure</th>
                    <th className="text-center px-2 py-1.5 font-medium">%ile</th>
                    <th className="text-center px-2 py-1.5 font-medium">Threshold</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Unsafe Driving', '0.85', '62', '65'],
                    ['HOS Compliance', '0.45', '38', '65'],
                    ['Vehicle Maint.', '1.92', '89', '80'],
                    ['Crash Indicator', '1.15', '71', '65'],
                    ['Driver Fitness', '0.22', '15', '80'],
                  ].map(([basic, measure, pctile, threshold], i) => (
                    <tr key={basic} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      <td className="px-2 py-1.5 text-slate-700">{basic}</td>
                      <td className="text-center px-2 py-1.5 text-slate-900">{measure}</td>
                      <td className="text-center px-2 py-1.5 text-slate-900">{pctile}</td>
                      <td className="text-center px-2 py-1.5 text-slate-500">{threshold}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-[11px] text-slate-500 italic mt-2">
                Average time to manually interpret and document: 35–45 minutes per carrier.
              </p>
            </div>
          </div>

          {/* ── Arrow (desktop: center, mobile: down) ── */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center shadow-sm z-10">
            <span className="text-slate-400 text-lg">&rarr;</span>
          </div>

          {/* ── After card ── */}
          <div className="rounded-xl overflow-hidden border border-slate-200 bg-white">
            <div className="bg-emerald-600 text-white px-5 py-3 text-sm font-semibold">
              After — Axesntra risk brief
            </div>
            <div className="p-5 space-y-4">
              {/* Carrier header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">ACME Transport LLC</h3>
                  <p className="text-xs text-slate-500">USDOT 491180 · MC 123456</p>
                </div>
                <div className="w-14 h-14 rounded-full border-4 border-red-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-red-600">72</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex gap-2">
                <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-full font-medium">
                  Elevated Risk
                </span>
                <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
                  Worsening Trend
                </span>
              </div>

              {/* AI summary */}
              <div className="bg-slate-50 rounded-lg p-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Vehicle maintenance is the primary risk driver at the 89th percentile, above the 80th-percentile intervention threshold. Three OOS events in Q1 2026 confirm a worsening pattern. Recommend conditional approval with a 30-day maintenance action plan.
                </p>
              </div>

              {/* BASIC bars */}
              <div className="space-y-2.5">
                {[
                  { label: 'Vehicle Maint.', pct: 89, color: 'bg-red-500' },
                  { label: 'Crash Indicator', pct: 71, color: 'bg-amber-500' },
                  { label: 'Unsafe Driving', pct: 62, color: 'bg-amber-400' },
                  { label: 'HOS Compliance', pct: 38, color: 'bg-emerald-500' },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 w-28 flex-shrink-0">{b.label}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${b.color} rounded-full`} style={{ width: `${b.pct}%` }} />
                    </div>
                    <span className="text-xs text-slate-500 w-8 text-right">{b.pct}th</span>
                  </div>
                ))}
              </div>

              {/* Recommended actions */}
              <div className="space-y-2">
                {[
                  'Require maintenance action plan within 30 days',
                  'Add to watchlist for monthly monitoring',
                  'Schedule quarterly re-evaluation',
                ].map((action, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-xs text-slate-700">{action}</span>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-emerald-600 font-medium">
                Generated in under 3 seconds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
