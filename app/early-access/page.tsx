'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CircleCheck as CheckCircle, Shield, TrendingUp, Building2, Truck, ArrowRight } from 'lucide-react';

const USE_CASES = [
  {
    icon: Shield,
    title: 'Underwriting workflow',
    description: 'Screen new accounts more consistently and use trend analysis to prioritize deeper review.',
  },
  {
    icon: Building2,
    title: 'Broker carrier screening',
    description: 'Give brokerage teams a more structured way to review carrier safety and operational exposure.',
  },
  {
    icon: TrendingUp,
    title: 'Carrier monitoring',
    description: 'Track whether carrier profiles are stable or deteriorating after the initial review.',
  },
  {
    icon: Truck,
    title: 'Remediation guidance',
    description: 'Use issue-level insights and fix plans to support action rather than just flagging risk.',
  },
];

export default function EarlyAccessPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-sm font-medium px-3 py-1.5 rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
            Currently in private pilot
          </div>
          <h1 className="text-4xl font-bold mb-4">Request Early Access to Axesntra</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Axesntra is currently being refined with a limited group of insurance, brokerage, and transportation teams. Early access users help shape the product while gaining direct exposure to the current screening, trend analysis, and remediation workflow.
          </p>
        </div>
      </div>

      {/* ── Social proof / trust strip ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto max-w-5xl px-4 py-8">
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-slate-900">40+</p>
              <p className="text-sm text-slate-500 mt-1">Teams in the pilot program</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">12,000+</p>
              <p className="text-sm text-slate-500 mt-1">Carrier briefs generated</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-slate-900">98%</p>
              <p className="text-sm text-slate-500 mt-1">Pilot retention rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Testimonials ── */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto max-w-5xl px-4 py-10">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 text-center">What early users are saying</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                &ldquo;We replaced a manual spreadsheet process with Axesntra briefs. Our underwriting team reviews carriers in half the time and with more confidence.&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-slate-900">VP of Underwriting</p>
                <p className="text-xs text-slate-500">Regional commercial auto insurer</p>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-6">
              <p className="text-slate-700 text-sm leading-relaxed mb-4">
                &ldquo;The trend analysis is what sold us. Seeing whether a carrier is improving or declining over 12 months is something we didn&rsquo;t have before.&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold text-slate-900">Director of Safety</p>
                <p className="text-xs text-slate-500">Mid-size freight brokerage</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-6">What early access includes</h2>
            <div className="space-y-4 mb-10">
              {[
                'Unlimited carrier risk briefs during the pilot period',
                'Multi-factor carrier scoring with issue-level breakdowns',
                '12-month trend analysis across key indicators',
                'Executive memo summaries for underwriting and screening workflows',
                'AI-assisted remediation guidance tied to carrier issues',
                'Direct feedback access to influence the product roadmap',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-6">Who early access is built for</h2>
            <div className="grid grid-cols-2 gap-4">
              {USE_CASES.map((uc) => (
                <div key={uc.title} className="bg-white rounded-xl p-4 border border-slate-100">
                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mb-3">
                    <uc.icon className="h-4 w-4 text-slate-700" />
                  </div>
                  <h3 className="font-semibold text-slate-900 text-sm mb-1">{uc.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{uc.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            {submitted ? (
              <Card className="p-8 text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Request received</h3>
                <p className="text-slate-600 mb-4">
                  We will review your request and follow up to discuss your workflow, use case, and fit for the pilot group.
                </p>
                <p className="text-sm text-slate-500">
                  Questions? Reach us at <a href="mailto:pilot@axesntra.com" className="text-blue-600 hover:underline">pilot@axesntra.com</a>
                </p>
              </Card>
            ) : (
              <Card className="p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-2">Apply for early access</h2>
                <p className="text-slate-600 text-sm mb-6">
                  Tell us about your team and how you expect to use Axesntra. We review all requests and respond directly.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Work email
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Company name
                    </label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Acme Insurance Co."
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Your role
                    </label>
                    <select
                      required
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white"
                    >
                      <option value="">Select your role</option>
                      <option value="underwriter">Underwriter</option>
                      <option value="risk-manager">Risk Manager</option>
                      <option value="broker">Broker / Agent</option>
                      <option value="claims">Claims Professional</option>
                      <option value="operations">Operations / 3PL</option>
                      <option value="executive">Executive / Leadership</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <Button type="submit" className="w-full" size="lg">
                    Request Access
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  <p className="text-xs text-slate-500 text-center">
                    Request access if you want to use Axesntra in underwriting, brokerage, carrier review, or transportation risk workflows.
                  </p>
                </form>
                <div className="mt-5 pt-5 border-t border-slate-100 flex items-center gap-3">
                  <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                  <p className="text-xs text-slate-500">
                    <span className="font-semibold text-slate-700">Limited spots remaining</span> — we onboard new teams each month and prioritize by workflow fit.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
