import Link from 'next/link';
import { BarChart3, ClipboardList, Zap, ArrowLeftRight, ChevronRight } from 'lucide-react';

export function ProductShowcase() {
  return (
    <section className="py-32 bg-sb-surface-container-low">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[240px]">
          {/* Feature 1: Predictive BASICs */}
          <div className="md:col-span-2 lg:col-span-2 bg-white rounded-3xl p-8 flex flex-col justify-between border border-sb-outline-variant/10 group hover:border-sb-primary/50 transition-colors">
            <div>
              <BarChart3 className="h-8 w-8 text-sb-primary mb-4" />
              <h3 className="text-2xl font-bold mb-2 text-sb-on-background">Predictive BASICs</h3>
              <p className="text-sb-on-surface-variant text-sm">
                See your SMS scores updated daily, not monthly. We predict your percentile ranking
                before the FMCSA publishes it.
              </p>
            </div>
            <div className="flex items-center gap-2 text-sb-primary font-bold text-sm">
              Learn more <ChevronRight className="h-4 w-4" />
            </div>
          </div>

          {/* Feature 2: Audit Readiness */}
          <div className="bg-sb-on-background text-white rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group">
            <div className="z-10">
              <ClipboardList className="h-8 w-8 text-sb-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Audit Readiness</h3>
              <p className="text-slate-400 text-xs">
                Real-time simulation of a DOT New Entrant or Focused Audit.
              </p>
            </div>
            <div className="absolute bottom-[-20%] right-[-10%] w-32 h-32 bg-sb-primary/20 blur-3xl rounded-full" />
          </div>

          {/* Feature 3: Smart Actions */}
          <div className="bg-white rounded-3xl p-8 flex flex-col justify-between border border-sb-outline-variant/10">
            <div>
              <div className="w-10 h-10 rounded-full bg-sb-error-container flex items-center justify-center text-sb-on-error-container mb-4">
                <Zap className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-sb-on-background">Smart Actions</h3>
              <p className="text-sb-on-surface-variant text-xs">
                Automatically generated corrective actions for every violation found.
              </p>
            </div>
          </div>

          {/* Feature 4: Benchmark */}
          <div className="bg-white rounded-3xl p-8 flex flex-col justify-between border border-sb-outline-variant/10">
            <div>
              <ArrowLeftRight className="h-8 w-8 text-sb-secondary mb-4" />
              <h3 className="text-xl font-bold mb-2 text-sb-on-background">Benchmark</h3>
              <p className="text-sb-on-surface-variant text-xs">
                Compare your safety performance against peer fleets of similar size.
              </p>
            </div>
          </div>

          {/* Feature 5: One workspace banner */}
          <div className="md:col-span-3 lg:col-span-3 bg-sb-primary rounded-3xl p-10 flex flex-col md:flex-row items-center gap-10 text-white overflow-hidden relative">
            <div className="md:w-1/2 z-10">
              <h3 className="text-3xl font-extrabold mb-4 leading-tight">
                One workspace for your entire safety team.
              </h3>
              <p className="text-blue-200/80 mb-8">
                Assign violations to terminal managers, track training completion, and manage your
                DataQs in a single, high-performance interface.
              </p>
              <Link
                href="/early-access"
                className="inline-block bg-white text-sb-primary px-6 py-3 rounded-xl font-bold text-sm hover:bg-sb-surface-container-low transition-all"
              >
                Explore Platform
              </Link>
            </div>
            <div className="md:w-1/2 relative">
              {/* CSS-only dashboard placeholder */}
              <div className="rounded-xl bg-white/10 backdrop-blur-sm p-6 border border-white/20 transform rotate-3 group-hover:rotate-0 transition-transform duration-500">
                <div className="flex gap-2 mb-4">
                  <div className="h-2 w-2 rounded-full bg-red-400" />
                  <div className="h-2 w-2 rounded-full bg-yellow-400" />
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-3/4 bg-white/20 rounded" />
                  <div className="h-8 w-full bg-white/10 rounded" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-12 bg-white/15 rounded" />
                    <div className="h-12 bg-white/10 rounded" />
                    <div className="h-12 bg-white/15 rounded" />
                  </div>
                  <div className="h-3 w-1/2 bg-white/20 rounded" />
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-full h-full bg-black/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
