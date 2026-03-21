'use client';

import Link from 'next/link';
import { ArrowRight, Clock, BookOpen, Search } from 'lucide-react';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface RelatedResource {
  href: string;
  title: string;
  category: string;
}

const ALL_RESOURCES: RelatedResource[] = [
  { href: '/resources/what-is-carrier-risk-intelligence', title: 'What Is Carrier Risk Intelligence?', category: 'Guide' },
  { href: '/resources/how-to-evaluate-whether-a-carrier-is-safe', title: 'How to Evaluate Whether a Carrier Is Safe', category: 'Guide' },
  { href: '/resources/crash-history-vs-inspection-history', title: 'Crash History vs Inspection History', category: 'Guide' },
  { href: '/resources/what-does-out-of-service-mean-in-trucking', title: 'What Does Out-of-Service Mean in Trucking?', category: 'Guide' },
  { href: '/resources/how-to-read-a-carrier-risk-report', title: 'How to Read a Carrier Risk Report', category: 'Guide' },
  { href: '/resources/why-one-time-carrier-screening-is-not-enough', title: 'Why One-Time Carrier Screening Is Not Enough', category: 'Guide' },
];

interface ContentPageProps {
  title: string;
  intro: string;
  children: React.ReactNode;
  cta?: {
    href: string;
    label: string;
  };
  category?: string;
  readingTime?: string;
  currentHref?: string;
}

function InlineSearchCta() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    if (/^\d+$/.test(trimmed)) {
      router.push(`/carrier/${trimmed}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(trimmed)}`);
    }
  }

  return (
    <div className="not-prose my-10 rounded-xl border border-sky-200 bg-sky-50 px-6 py-7">
      <p className="text-xs font-bold uppercase tracking-widest text-sky-600 mb-2">
        Try It Yourself
      </p>
      <p className="text-slate-700 font-medium mb-4">
        Look up any carrier instantly — enter a USDOT number or carrier name.
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="USDOT number or carrier name…"
            className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
        <button
          type="submit"
          className="shrink-0 rounded-lg bg-sky-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-sky-400 transition-colors"
        >
          Search
        </button>
      </form>
      <p className="mt-3 text-xs text-slate-500">
        Or{' '}
        <Link href="/sample-report" className="text-sky-600 underline underline-offset-2 hover:text-sky-500">
          view a sample report
        </Link>{' '}
        to see the full risk profile.
      </p>
    </div>
  );
}

export function ContentPage({
  title,
  intro,
  children,
  cta,
  category = 'Guide',
  readingTime = '4 min read',
  currentHref,
}: ContentPageProps) {
  const related = ALL_RESOURCES.filter((r) => r.href !== currentHref).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Article Hero ────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 pt-14 pb-20">
        <div className="container mx-auto max-w-4xl px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-10 text-sm">
            <Link href="/resources" className="text-slate-400 hover:text-white transition-colors">
              Resources
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-slate-500">{category}</span>
          </nav>

          {/* Category badge */}
          <div className="mb-6">
            <span className="inline-block text-xs font-bold tracking-widest uppercase text-sky-400 border border-sky-400/30 bg-sky-400/10 px-3 py-1.5 rounded-full">
              {category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-8 max-w-3xl">
            {title}
          </h1>

          {/* Meta row */}
          <div className="flex items-center gap-5 text-slate-400 text-sm">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 opacity-70" />
              {readingTime}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 opacity-70" />
              Axesntra
            </span>
          </div>
        </div>
      </div>

      {/* ── Quick Answer band ───────────────────────────────── */}
      <div className="bg-slate-50 border-b border-slate-200">
        <div className="container mx-auto max-w-3xl px-6 py-9">
          <div className="border-l-4 border-sky-500 pl-6">
            <p className="text-[11px] font-bold text-sky-600 uppercase tracking-widest mb-2">
              Quick Answer
            </p>
            <p className="text-slate-700 text-lg leading-relaxed">{intro}</p>
          </div>
        </div>
      </div>

      {/* ── Article body ────────────────────────────────────── */}
      <div className="container mx-auto max-w-3xl px-6 py-16">
        <div
          className="
            prose prose-slate max-w-none
            prose-headings:text-slate-900 prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-14 prose-h2:mb-5 prose-h2:pb-4 prose-h2:border-b prose-h2:border-slate-100
            prose-h3:text-xl prose-h3:font-semibold prose-h3:mt-10 prose-h3:mb-4
            prose-p:text-slate-600 prose-p:leading-[1.9] prose-p:text-[1.05rem]
            prose-li:text-slate-600 prose-li:leading-relaxed
            prose-ul:my-5 prose-ul:space-y-2
            prose-ol:my-5 prose-ol:space-y-2
            prose-strong:text-slate-800 prose-strong:font-semibold
          "
        >
          {children}
        </div>
      </div>

      {/* ── Inline search CTA ───────────────────────────────── */}
      <div className="container mx-auto max-w-3xl px-6 pb-4">
        <InlineSearchCta />
      </div>

      {/* ── CTA panel ───────────────────────────────────────── */}
      {cta && (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 px-6">
          <div className="container mx-auto max-w-2xl text-center">
            <p className="text-[11px] font-bold text-sky-400 uppercase tracking-widest mb-5">
              See It In Action
            </p>
            <h2 className="text-3xl font-bold text-white mb-5 leading-snug">
              Carrier risk intelligence, applied.
            </h2>
            <p className="text-slate-400 mb-10 leading-relaxed max-w-lg mx-auto">
              See how Axesntra turns inspection records, crash data, and trend signals into a structured risk view for every carrier you evaluate.
            </p>
            <Link
              href={cta.href}
              className="inline-flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white px-8 py-4 rounded-lg font-semibold transition-colors group shadow-lg shadow-sky-500/20"
            >
              {cta.label}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      )}

      {/* ── Related resources ───────────────────────────────── */}
      {related.length > 0 && (
        <div className="bg-slate-50 border-t border-slate-200 py-16 px-6">
          <div className="container mx-auto max-w-4xl">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-8">
              Related Resources
            </p>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="group bg-white rounded-xl border border-slate-200 p-6 hover:border-slate-300 hover:shadow-md transition-all duration-200"
                >
                  <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider mb-3 block">
                    {r.category}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-900 group-hover:text-slate-700 mb-4 leading-snug">
                    {r.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-xs text-slate-400 group-hover:text-slate-600 transition-colors">
                    Read article{' '}
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4 pt-6 border-t border-slate-200">
              <span className="text-sm text-slate-500">Ready to screen a carrier?</span>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 hover:text-sky-500 transition-colors"
              >
                <Search className="h-3.5 w-3.5" />
                Search a carrier
              </Link>
              <Link
                href="/sample-report"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                View sample report
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
