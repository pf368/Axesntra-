import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-xl text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          See your own carriers analyzed live
        </h2>
        <p className="text-slate-600 leading-relaxed mb-8">
          Bring your USDOT numbers to a 15-minute call. We&apos;ll generate real briefs during the session — no pitch deck, no slides, no commitment.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-4">
          <Link
            href="/early-access"
            className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
          >
            Book a 15-min walkthrough
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/#search"
            className="inline-flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-6 py-3 rounded-lg font-medium hover:border-slate-400 transition-colors"
          >
            Try free — 3 lookups/month
          </Link>
        </div>
        <p className="text-xs text-slate-500">
          No credit card required. We review all access requests personally.
        </p>
      </div>
    </section>
  );
}
