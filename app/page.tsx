import { HeroSearch } from '@/components/hero-search';
import { ContentOffersSection } from '@/components/content-offers-section';
import Link from 'next/link';
import { ArrowRight, Shield, TrendingUp, FileText, Zap, Building2, Truck, Users, ClipboardList, Search, ChartBar as BarChart3, BookOpen, Activity } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <HeroSearch />

      {/* ── Metrics strip ── */}
      <section style={{ background: '#1a2535' }}>
        <div className="container mx-auto max-w-5xl px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x md:divide-white/10">
            {[
              { value: '600,000+', label: 'active USDOT carriers tracked' },
              { value: '5',        label: 'risk categories scored per carrier' },
              { value: '12 months', label: 'of trend data per brief' },
              { value: 'Updated daily', label: 'via FMCSA SMS feed' },
            ].map((stat, i) => (
              <div
                key={stat.value}
                className={`flex flex-col items-center justify-center text-center px-6 py-6 md:py-0${
                  i >= 2 ? ' border-t border-white/10 md:border-t-0' : ''
                }`}
              >
                <p
                  className="text-white font-semibold"
                  style={{ fontSize: '28px', lineHeight: '1.2', letterSpacing: '-0.02em' }}
                >
                  {stat.value}
                </p>
                <p className="mt-1" style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 400 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
            Public carrier data is useful. Raw public carrier data is not enough.
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed text-center max-w-3xl mx-auto">
            Carrier records contain real signal, but most teams still have to interpret that signal manually. That creates inconsistency. One reviewer focuses on crashes. Another focuses on inspections. Another misses the trend entirely. Axesntra brings those inputs into one workflow so users can evaluate carriers with more speed, more context, and less guesswork.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              What Axesntra provides
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Multi-factor risk scoring</h3>
              <p className="text-sm text-slate-600">Evaluate carriers using maintenance, crash, driver, hazmat, and trend indicators rather than isolated records.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">12-month trend analysis</h3>
              <p className="text-sm text-slate-600">Understand whether a carrier is improving, stable, or deteriorating over time.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Executive-ready summaries</h3>
              <p className="text-sm text-slate-600">Give underwriters, brokers, and risk leaders concise written briefs, not just data tables.</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
              <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-5 w-5 text-rose-600" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">AI-assisted fix plans</h3>
              <p className="text-sm text-slate-600">Surface remediation actions tied to the actual issues found in the carrier profile.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Built for every team managing fleet risk
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-xl p-8 border border-slate-100">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Insurance teams</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Screen new accounts, support underwriting review, and monitor carrier deterioration across the book.</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-8 border border-slate-100">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center mb-4">
                <Truck className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Freight brokers</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Create a more repeatable onboarding and re-screening process for carriers moving customer freight.</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-8 border border-slate-100">
              <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-5 w-5 text-amber-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Risk and compliance leaders</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Track higher-risk carriers, standardize review criteria, and document why action was taken.</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-8 border border-slate-100">
              <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center mb-4">
                <ClipboardList className="h-5 w-5 text-rose-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Transportation operators and 3PLs</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Use carrier intelligence to support vendor review and escalation workflows.</p>
            </div>

            <div className="bg-slate-50 rounded-xl p-8 border border-slate-100">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center mb-4">
                <Truck className="h-5 w-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Fleet operators</h3>
              <p className="text-sm text-slate-600 leading-relaxed">Construction, landscaping, utilities, and any business with a DOT number and drivers. Know your FMCSA safety profile before the next renewal, roadside inspection, or incident.</p>
            </div>
          </div>
        </div>
      </section>

      <ContentOffersSection />

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 text-center">
            One-time screening does not solve ongoing risk
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed text-center max-w-3xl mx-auto">
            A carrier that looked acceptable last month may not look acceptable now. New inspections, crash activity, out-of-service events, and worsening patterns can materially change exposure. Axesntra is designed to support both initial review and ongoing monitoring so teams are not making decisions off stale snapshots.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              How it works
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Search className="h-5 w-5 text-white" />
              </div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Step 1</div>
              <h3 className="font-semibold text-slate-900 mb-2">Pull the carrier profile</h3>
              <p className="text-sm text-slate-600">Enter a USDOT number and retrieve the carrier&apos;s public safety and operating data.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Step 2</div>
              <h3 className="font-semibold text-slate-900 mb-2">Translate records into risk signals</h3>
              <p className="text-sm text-slate-600">Inspections, crashes, OOS events, and trends are scored across multiple risk categories.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Step 3</div>
              <h3 className="font-semibold text-slate-900 mb-2">Generate a usable brief</h3>
              <p className="text-sm text-slate-600">Receive an executive summary, risk drivers, trend charts, and remediation guidance in one report.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Step 4</div>
              <h3 className="font-semibold text-slate-900 mb-2">Take action</h3>
              <p className="text-sm text-slate-600">Approve, escalate, monitor, or decline based on a structured view of the carrier&apos;s risk profile.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mid-page Sample Report CTA ── */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl px-8 py-7">
            <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center">
              {/* Left: copy + preview card */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">See it before you sign up</p>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">
                  Read a real carrier risk brief →
                </h2>
                <p className="text-blue-700 text-sm leading-relaxed mb-5">
                  From raw FMCSA data to a complete risk brief — trend charts, risk scores, and remediation steps — in seconds.
                </p>
                {/* Preview card */}
                <div className="bg-white border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">ACME Transport LLC · Sample brief</p>
                    <p className="text-xs text-blue-600">4 risk categories · 12-month trend · 3 remediation actions</p>
                  </div>
                </div>
              </div>
              {/* Right: CTA buttons */}
              <div className="flex flex-col gap-3 flex-shrink-0">
                <Link
                  href="/sample-report"
                  className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-900 font-semibold text-sm px-6 py-3 rounded-xl hover:border-slate-300 transition-colors"
                >
                  View sample report
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/early-access"
                  className="text-sm text-slate-600 hover:text-slate-900 underline text-center transition-colors"
                >
                  Or request early access
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-4">See it in action</h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              From raw FMCSA data to a complete carrier risk brief — in seconds.
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl" style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full block"
              style={{ aspectRatio: '16/9' }}
            >
              <source src="/axesntra-promo.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">See what a carrier risk brief looks like in practice</h2>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Explore the sample report to understand how public FMCSA data becomes a risk brief with scores, trends, issue summaries, and remediation guidance.
          </p>
          <Link
            href="/sample-report"
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            View Sample Report
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-4">Request early access</h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            We are working with a select group of insurance, brokerage, and transportation teams to refine the product in live workflows.
          </p>
          <Link
            href="/early-access"
            className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors"
          >
            Request Early Access
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
