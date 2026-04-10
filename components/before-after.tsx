import { Clock, BadgeCheck, TrendingUp, CheckCircle, Brain, Zap } from 'lucide-react';

export function BeforeAfter() {
  return (
    <section id="transform" className="py-32 bg-sb-surface">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-extrabold tracking-tighter text-sb-on-background mb-4">
            From FMCSA data to actionable intelligence.
          </h2>
          <p className="text-sb-on-surface-variant text-lg">
            Stop wrestling with legacy government portals. Start acting on insight.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          {/* Before Card */}
          <div className="group">
            <div className="mb-6 flex items-center gap-2">
              <Clock className="h-5 w-5 text-slate-400" />
              <span className="font-bold text-slate-500 uppercase tracking-widest text-xs">
                The Old Way: Static Data
              </span>
            </div>
            <div className="bg-sb-surface-container-high rounded-3xl p-8 h-full border border-sb-outline-variant/20 grayscale group-hover:grayscale-0 transition-all duration-700">
              <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
                <div className="h-2 w-1/3 bg-slate-200 rounded mb-2" />
                <div className="h-10 w-full bg-slate-50 rounded mb-2" />
                <div className="h-10 w-full bg-slate-50 rounded" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-full bg-slate-200/50 rounded" />
                <div className="h-4 w-4/5 bg-slate-200/50 rounded" />
                <div className="h-4 w-5/6 bg-slate-200/50 rounded" />
              </div>
              <div className="mt-8 pt-8 border-t border-slate-200 text-slate-400 italic text-sm">
                &ldquo;Searching through the SMS portal takes hours. By the time I find the issue,
                the driver is already back on the road.&rdquo;
              </div>
            </div>
          </div>

          {/* After Card */}
          <div className="group">
            <div className="mb-6 flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-sb-primary" />
              <span className="font-bold text-sb-primary uppercase tracking-widest text-xs">
                The Axesntra Way: Live Intelligence
              </span>
            </div>
            <div className="bg-white rounded-3xl p-1 shadow-2xl border border-sb-primary/10 h-full">
              <div className="bg-sb-surface-container-lowest rounded-[1.4rem] p-8 h-full relative overflow-hidden">
                {/* AI Badge */}
                <div className="absolute top-4 right-4 bg-sb-primary/10 text-sb-primary px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border border-sb-primary/20">
                  <Zap className="h-3 w-3" />
                  AI ACTIVE
                </div>

                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-sb-primary rounded-xl flex items-center justify-center text-white">
                    <TrendingUp className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-sb-on-background leading-none">
                      Renewal Readiness
                    </h4>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      94% Compliant &bull; Improving
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-sb-surface-container-low p-4 rounded-xl">
                    <span className="block text-[10px] uppercase tracking-wider text-sb-on-surface-variant font-bold mb-1">
                      Risk Score
                    </span>
                    <span className="text-2xl font-mono font-bold text-sb-on-background tracking-tighter">
                      0.14
                    </span>
                  </div>
                  <div className="bg-sb-surface-container-low p-4 rounded-xl">
                    <span className="block text-[10px] uppercase tracking-wider text-sb-on-surface-variant font-bold mb-1">
                      Violations
                    </span>
                    <span className="text-2xl font-mono font-bold text-sb-error tracking-tighter">
                      -22%
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-100 rounded-lg border-l-4 border-slate-400 flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-slate-500 flex-shrink-0" />
                    <span className="text-xs font-semibold text-sb-on-surface">
                      Data refresh complete: 4 new inspections synced.
                    </span>
                  </div>
                  <div className="p-3 bg-sb-primary/5 rounded-lg border-l-4 border-sb-primary flex items-center gap-3">
                    <Brain className="h-5 w-5 text-sb-primary flex-shrink-0" />
                    <span className="text-xs font-semibold text-sb-on-surface">
                      AI Suggestion: Update Maintenance Plan for Unit 402.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
