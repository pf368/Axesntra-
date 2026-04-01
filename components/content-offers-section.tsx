'use client';

import { useState } from 'react';
import { ArrowRight, Mail, FileText, BarChart2, CheckCircle } from 'lucide-react';

type CardState = 'idle' | 'form' | 'done';

function InlineEmailForm({
  onSubmit,
  placeholder = 'you@company.com',
  submitLabel = 'Subscribe →',
}: {
  onSubmit: (email: string) => void;
  placeholder?: string;
  submitLabel?: string;
}) {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: POST { email } to /api/leads
    onSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-3">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="flex-shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        {submitLabel}
      </button>
    </form>
  );
}

export function ContentOffersSection() {
  const [digestState, setDigestState]   = useState<CardState>('idle');
  const [playbookState, setPlaybookState] = useState<CardState>('idle');

  return (
    <section className="py-20 bg-slate-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-3">
            Not ready for a pilot? Start here.
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Explore carrier risk intelligence at your own pace.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Card 1 — Weekly Risk Digest */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col">
            <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
              <Mail className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Weekly Risk Digest</h3>
            <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-4">
              Get a weekly email with carrier risk trends, FMCSA data changes, and screening best
              practices. Built for underwriters and safety teams.
            </p>

            {digestState === 'idle' && (
              <button
                onClick={() => setDigestState('form')}
                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Subscribe free
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}

            {digestState === 'form' && (
              <InlineEmailForm
                submitLabel="Subscribe →"
                onSubmit={() => setDigestState('done')}
              />
            )}

            {digestState === 'done' && (
              <div className="flex items-center gap-2 mt-1 text-emerald-400 text-sm font-medium">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                You&rsquo;re subscribed. First digest ships next Monday.
              </div>
            )}
          </div>

          {/* Card 2 — Carrier Vetting Playbook */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col">
            <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center mb-4">
              <FileText className="h-5 w-5 text-amber-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Carrier Vetting Playbook</h3>
            <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-4">
              A step-by-step guide to building a consistent carrier screening process using public
              FMCSA data. 12 pages, PDF.
            </p>

            {playbookState === 'idle' && (
              <button
                onClick={() => setPlaybookState('form')}
                className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                Download the playbook
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}

            {playbookState === 'form' && (
              <InlineEmailForm
                submitLabel="Send me the PDF →"
                onSubmit={() => setPlaybookState('done')}
              />
            )}

            {playbookState === 'done' && (
              <div className="flex items-center gap-2 mt-1 text-emerald-400 text-sm font-medium">
                <CheckCircle className="h-4 w-4 flex-shrink-0" />
                Check your inbox — the playbook is on its way.
              </div>
            )}
          </div>

          {/* Card 3 — Free Carrier Brief */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 flex flex-col">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
              <BarChart2 className="h-5 w-5 text-emerald-400" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Free Carrier Brief</h3>
            <p className="text-slate-400 text-sm leading-relaxed flex-1 mb-4">
              Enter any USDOT number and get a one-page risk brief emailed to you — no account
              needed. See Axesntra&rsquo;s output firsthand.
            </p>
            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              Get a free brief
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
