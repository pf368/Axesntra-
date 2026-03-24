'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CircleCheck as CheckCircle,
  Circle,
  ArrowRight,
  Shield,
  Building2,
  Zap,
} from 'lucide-react';

const TIERS = [
  {
    name: 'Free',
    icon: Shield,
    description: 'For fleet operators, safety managers, or anyone who wants to check a USDOT record before committing.',
    price: '$0 / month',
    priceNote: 'No credit card required',
    features: [
      '3 carrier lookups per month',
      'Basic risk score (overall only)',
      'Authority & operating status check',
      'Safety rating summary',
    ],
    freeFeatures: true,
    cta: 'Start free — no card needed',
    ctaHref: '/early-access',
    highlight: false,
  },
  {
    name: 'Starter',
    icon: Zap,
    description: 'For brokers, safety managers, and teams who need full AI-powered risk briefs and trend data.',
    price: null,
    priceNote: null,
    features: [
      'Carrier risk briefs on demand',
      'Multi-factor risk scoring',
      '12-month trend analysis',
      'Executive memo summaries',
      'Email support',
    ],
    freeFeatures: false,
    cta: 'Get Started',
    ctaHref: '#contact',
    highlight: false,
  },
  {
    name: 'Professional',
    icon: Shield,
    description: 'For underwriting, safety, or brokerage teams that need deeper analysis and monitoring.',
    price: null,
    priceNote: null,
    features: [
      'Everything in Starter',
      'Carrier watchlist with alerts',
      'AI-assisted remediation guidance',
      'Score contribution breakdowns',
      'Carrier comparison tools',
      'Priority support',
    ],
    freeFeatures: false,
    cta: 'Contact Sales',
    ctaHref: '#contact',
    highlight: true,
  },
  {
    name: 'Enterprise',
    icon: Building2,
    description: 'For organizations that need volume, integrations, and dedicated onboarding.',
    price: null,
    priceNote: null,
    features: [
      'Everything in Professional',
      'API access',
      'Custom integrations',
      'Bulk carrier screening',
      'Dedicated account manager',
      'Custom reporting',
    ],
    freeFeatures: false,
    cta: 'Contact Sales',
    ctaHref: '#contact',
    highlight: false,
  },
];

export default function PricingPage() {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [interest, setInterest] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Hero ── */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-16 pb-20 text-white">
        <div className="container mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Choose the plan that fits your team. All plans include full carrier risk briefs powered by public FMCSA data.
          </p>
        </div>
      </div>

      {/* ── Tier cards ── */}
      <div className="container mx-auto max-w-6xl px-4 -mt-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIERS.map((tier) => (
            <Card
              key={tier.name}
              className={`p-6 flex flex-col ${
                tier.highlight
                  ? 'ring-2 ring-sky-500 shadow-lg relative'
                  : ''
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-500 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${tier.highlight ? 'bg-sky-100' : 'bg-slate-100'}`}>
                  <tier.icon className={`h-4 w-4 ${tier.highlight ? 'text-sky-600' : 'text-slate-600'}`} />
                </div>
                <h2 className="text-lg font-bold text-slate-900">{tier.name}</h2>
              </div>
              <p className="text-sm text-slate-600 mb-5 leading-relaxed">{tier.description}</p>
              {tier.price ? (
                <p className="text-2xl font-bold text-slate-900 mb-5">
                  {tier.price}
                  {tier.priceNote && (
                    <span className="block text-xs font-normal text-slate-500 mt-1">{tier.priceNote}</span>
                  )}
                </p>
              ) : (
                <p className="text-2xl font-bold text-slate-900 mb-5">
                  Contact us
                  <span className="block text-xs font-normal text-slate-500 mt-1">Custom pricing for your team</span>
                </p>
              )}
              <ul className="space-y-2.5 mb-6 flex-1">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-700">
                    {tier.freeFeatures ? (
                      <Circle className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    )}
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={tier.ctaHref}
                className={`block text-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors ${
                  tier.freeFeatures
                    ? 'border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                    : tier.highlight
                    ? 'bg-sky-500 text-white hover:bg-sky-400'
                    : 'bg-slate-900 text-white hover:bg-slate-700'
                }`}
              >
                {tier.cta}
              </a>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Contact form ── */}
      <div id="contact" className="container mx-auto max-w-xl px-4 py-20">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Talk to our team</h2>
          <p className="text-slate-600 text-sm">
            Tell us about your workflow and we&rsquo;ll help you find the right plan. No commitment required.
          </p>
        </div>

        {submitted ? (
          <Card className="p-8 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">We&rsquo;ll be in touch</h3>
            <p className="text-slate-600 mb-4">
              Our team will follow up within one business day to discuss your needs and walk through a demo.
            </p>
            <p className="text-sm text-slate-500">
              Questions? Email us at{' '}
              <a href="mailto:sales@axesntra.com" className="text-blue-600 hover:underline">
                sales@axesntra.com
              </a>
            </p>
          </Card>
        ) : (
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Work email</label>
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Company name</label>
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
                <label className="block text-sm font-medium text-slate-700 mb-1.5">What are you interested in?</label>
                <select
                  required
                  value={interest}
                  onChange={(e) => setInterest(e.target.value)}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent bg-white"
                >
                  <option value="">Select a plan</option>
                  <option value="starter">Starter</option>
                  <option value="professional">Professional</option>
                  <option value="enterprise">Enterprise</option>
                  <option value="not-sure">Not sure yet</option>
                </select>
              </div>
              <Button type="submit" className="w-full" size="lg">
                Request Pricing
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <p className="text-xs text-slate-500 text-center">
                No credit card required. We&rsquo;ll schedule a call to walk through your use case.
              </p>
            </form>
          </Card>
        )}
      </div>

      {/* ── Bottom CTA ── */}
      <div className="bg-slate-900 py-12 px-4 text-center">
        <p className="text-slate-400 text-sm mb-3">Not ready for a call?</p>
        <Link
          href="/sample-report"
          className="inline-flex items-center gap-2 text-white font-semibold hover:text-sky-400 transition-colors"
        >
          See a sample carrier report first
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
