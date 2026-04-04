'use client';

import Link from 'next/link';
import { useState } from 'react';
import { BookOpen, CircleHelp as HelpCircle, ClipboardList, Building2, ArrowRight } from 'lucide-react';

const FEATURED = {
  href: '/resources/what-is-carrier-risk-intelligence',
  category: 'Guide',
  title: 'What Is Carrier Risk Intelligence?',
  excerpt:
    'Carrier risk intelligence combines inspection history, crash data, out-of-service events, and trend direction into a structured, repeatable view of motor carrier exposure — so every review considers the same signals.',
  role: 'All',
};

const GUIDES = [
  {
    href: '/resources/how-to-evaluate-whether-a-carrier-is-safe',
    title: 'How to Evaluate Whether a Carrier Is Safe',
    excerpt: 'A structured approach to reviewing inspection rates, crash activity, OOS history, and trend direction together.',
    role: 'All',
  },
  {
    href: '/resources/crash-history-vs-inspection-history',
    title: 'Crash History vs Inspection History',
    excerpt: 'Understand what each signal tells you — and why combining them gives a more reliable picture.',
    role: 'Underwriters',
  },
  {
    href: '/resources/what-does-out-of-service-mean-in-trucking',
    title: 'What Does Out-of-Service Mean in Trucking?',
    excerpt: 'Learn what triggers an OOS event, why it matters, and how to weight it in a carrier review.',
    role: 'Safety & Compliance',
  },
  {
    href: '/resources/how-to-read-a-carrier-risk-report',
    title: 'How to Read a Carrier Risk Report',
    excerpt: 'A section-by-section breakdown of what risk reports contain and how to interpret each signal.',
    role: 'All',
  },
  {
    href: '/resources/why-one-time-carrier-screening-is-not-enough',
    title: 'Why One-Time Carrier Screening Is Not Enough',
    excerpt: 'Carrier risk profiles change over time. Here is why ongoing monitoring is part of a complete program.',
    role: 'Fleet Operators',
  },
];

const QUESTIONS = [
  { href: '/questions/what-is-a-csa-score', title: 'What Is a CSA Score?', excerpt: "The FMCSA metric that reflects a carrier's safety performance across seven behavior categories.", role: 'All' },
  { href: '/questions/what-is-a-bad-csa-score', title: 'What Is a Bad CSA Score?', excerpt: 'How to interpret elevated scores and what thresholds tend to draw regulatory attention.', role: 'Underwriters' },
  { href: '/questions/how-do-you-check-if-a-carrier-is-safe', title: 'How Do You Check If a Carrier Is Safe?', excerpt: 'The data sources and review steps that give you a defensible answer to that question.', role: 'Freight Brokers' },
  { href: '/questions/what-does-a-conditional-safety-rating-mean', title: 'What Does a Conditional Safety Rating Mean?', excerpt: "What FMCSA's conditional rating signals and how to factor it into your decision.", role: 'Underwriters' },
  { href: '/questions/what-does-inactive-authority-mean', title: 'What Does Inactive Authority Mean?', excerpt: 'When operating authority goes inactive and what that means for the carriers you work with.', role: 'Freight Brokers' },
];

const PLAYBOOKS = [
  { href: '/playbooks/carrier-vetting-checklist-for-brokers', title: 'Carrier Vetting Checklist for Brokers', excerpt: 'A step-by-step carrier review process designed for freight broker workflows.', role: 'Freight Brokers' },
  { href: '/playbooks/what-to-do-after-an-out-of-service-event', title: 'What to Do After an Out-of-Service Event', excerpt: 'A response guide for teams managing relationships with carriers that have recent OOS activity.', role: 'Safety & Compliance' },
  { href: '/playbooks/how-to-build-a-carrier-watchlist-process', title: 'How to Build a Carrier Watchlist Process', excerpt: 'How to structure a carrier monitoring workflow that flags risk changes before they become incidents.', role: 'All' },
];

const COMMERCIAL = [
  { href: '/commercial/carrier-risk-monitoring-software', title: 'Carrier Risk Monitoring Software', excerpt: 'Continuous monitoring that surfaces changes in carrier risk profiles automatically.', role: 'Safety & Compliance' },
  { href: '/commercial/broker-carrier-screening-software', title: 'Broker Carrier Screening Software', excerpt: 'Built for freight brokerages that need fast, consistent carrier review at scale.', role: 'Freight Brokers' },
  { href: '/commercial/carrier-screening-for-underwriters', title: 'Carrier Screening for Underwriters', excerpt: 'Structured data to support underwriting decisions on new and renewal accounts.', role: 'Underwriters' },
  { href: '/commercial/carrier-watchlist-alerts', title: 'Carrier Watchlist Alerts', excerpt: "Automated alerts when a monitored carrier's risk profile changes materially.", role: 'Fleet Operators' },
];

const CATEGORY_NAV = [
  { label: 'Guides', icon: BookOpen, href: '#guides' },
  { label: 'Questions', icon: HelpCircle, href: '#questions' },
  { label: 'Playbooks', icon: ClipboardList, href: '#playbooks' },
  { label: 'Product', icon: Building2, href: '#product' },
];

const ROLE_FILTERS = ['All', 'Underwriters', 'Freight Brokers', 'Safety & Compliance', 'Fleet Operators'];

function matchesRole(itemRole: string, activeRole: string) {
  if (activeRole === 'All') return true;
  return itemRole === 'All' || itemRole === activeRole;
}

function ContentCard({
  href,
  title,
  excerpt,
  category,
}: {
  href: string;
  title: string;
  excerpt: string;
  category?: string;
}) {
  return (
    <Link
      href={href}
      className="group bg-white rounded-2xl border border-slate-200 p-7 flex flex-col hover:border-slate-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      {category && (
        <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest mb-3 block">
          {category}
        </span>
      )}
      <h3 className="font-semibold text-slate-900 group-hover:text-slate-700 text-[0.95rem] leading-snug mb-3 flex-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-2">{excerpt}</p>
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 group-hover:text-slate-700 transition-colors">
        Read article
        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </Link>
  );
}

function SectionHeader({
  id,
  icon: Icon,
  label,
  title,
}: {
  id: string;
  icon: React.ElementType;
  label: string;
  title: string;
}) {
  return (
    <div id={id} className="flex items-center gap-4 mb-8 pt-2">
      <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
        <Icon className="h-4.5 w-4.5 text-white h-[18px] w-[18px]" />
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</p>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      </div>
    </div>
  );
}

export default function ResourcesPage() {
  const [activeRole, setActiveRole] = useState('All');

  const filteredGuides = GUIDES.filter((g) => matchesRole(g.role, activeRole));
  const filteredQuestions = QUESTIONS.filter((q) => matchesRole(q.role, activeRole));
  const filteredPlaybooks = PLAYBOOKS.filter((p) => matchesRole(p.role, activeRole));
  const filteredCommercial = COMMERCIAL.filter((c) => matchesRole(c.role, activeRole));
  const showFeatured = matchesRole(FEATURED.role, activeRole);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 py-24">
        <div className="container mx-auto max-w-5xl px-6">
          <p className="text-[11px] font-bold text-sky-400 uppercase tracking-widest mb-5">
            Knowledge Center
          </p>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6 max-w-3xl">
            Resources for Carrier Risk Teams
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed mb-10">
            Guides, quick-answers, and operational playbooks built around real carrier screening workflows — for insurance, brokerage, and transportation teams.
          </p>
          {/* Category nav pills */}
          <div className="flex flex-wrap gap-3">
            {CATEGORY_NAV.map((cat) => (
              <a
                key={cat.label}
                href={cat.href}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors border border-white/10 hover:border-white/20"
              >
                <cat.icon className="h-3.5 w-3.5 opacity-70" />
                {cat.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-6 py-16 space-y-20">
        {/* ── Role filter ────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-slate-500 mr-1">By role:</span>
          {ROLE_FILTERS.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              aria-label={`Filter by ${role}`}
              className={`text-sm px-4 py-1.5 rounded-full transition-colors ${
                activeRole === role
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {/* ── Featured article ──────────────────────────────── */}
        {showFeatured && (
          <section>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">
              Featured
            </p>
            <Link
              href={FEATURED.href}
              className="group block bg-slate-900 rounded-2xl p-10 md:p-14 hover:bg-slate-800 transition-all duration-200 border border-slate-700 hover:border-slate-600 hover:shadow-2xl"
            >
              <span className="inline-block text-[10px] font-bold text-sky-400 uppercase tracking-widest border border-sky-400/30 bg-sky-400/10 px-3 py-1 rounded-full mb-6">
                {FEATURED.category}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-white leading-snug mb-5 max-w-2xl group-hover:text-slate-100">
                {FEATURED.title}
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed max-w-2xl mb-8">
                {FEATURED.excerpt}
              </p>
              <span className="inline-flex items-center gap-2 text-sky-400 font-semibold group-hover:text-sky-300 transition-colors">
                Read the guide
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </section>
        )}

        {/* ── Guides ───────────────────────────────────────── */}
        {filteredGuides.length > 0 && (
          <section>
            <SectionHeader id="guides" icon={BookOpen} label="In-depth" title="Guides" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredGuides.map((item) => (
                <ContentCard key={item.href} {...item} category="Guide" />
              ))}
            </div>
          </section>
        )}

        {/* ── Divider ──────────────────────────────────────── */}
        {filteredGuides.length > 0 && filteredQuestions.length > 0 && <hr className="border-slate-200" />}

        {/* ── Questions ────────────────────────────────────── */}
        {filteredQuestions.length > 0 && (
          <section>
            <SectionHeader id="questions" icon={HelpCircle} label="Quick Answers" title="Questions" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredQuestions.map((item) => (
                <ContentCard key={item.href} {...item} category="Q&A" />
              ))}
            </div>
          </section>
        )}

        {/* ── Divider ──────────────────────────────────────── */}
        {filteredQuestions.length > 0 && filteredPlaybooks.length > 0 && <hr className="border-slate-200" />}

        {/* ── Playbooks ────────────────────────────────────── */}
        {filteredPlaybooks.length > 0 && (
          <section>
            <SectionHeader id="playbooks" icon={ClipboardList} label="Step-by-step" title="Playbooks" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredPlaybooks.map((item) => (
                <ContentCard key={item.href} {...item} category="Playbook" />
              ))}
            </div>
          </section>
        )}

        {/* ── Divider ──────────────────────────────────────── */}
        {filteredPlaybooks.length > 0 && filteredCommercial.length > 0 && <hr className="border-slate-200" />}

        {/* ── Product ──────────────────────────────────────── */}
        {filteredCommercial.length > 0 && (
          <section>
            <SectionHeader id="product" icon={Building2} label="Platform" title="Product" />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredCommercial.map((item) => (
                <ContentCard key={item.href} {...item} category="Product" />
              ))}
            </div>
          </section>
        )}

        {/* ── Bottom CTA ───────────────────────────────────── */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl px-10 py-14 text-center border border-slate-700">
          <p className="text-[11px] font-bold text-sky-400 uppercase tracking-widest mb-4">
            Ready to Get Started?
          </p>
          <h2 className="text-3xl font-bold text-white mb-4 max-w-lg mx-auto leading-snug">
            Put carrier risk intelligence to work
          </h2>
          <p className="text-slate-400 mb-9 max-w-md mx-auto leading-relaxed">
            See how Axesntra structures carrier data into a clear, repeatable risk view — for screening, monitoring, and team-level consistency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sample-report"
              className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white px-7 py-3.5 rounded-lg font-semibold transition-colors group shadow-lg shadow-sky-500/20"
            >
              See a live demo
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/early-access"
              className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white px-7 py-3.5 rounded-lg font-semibold transition-colors border border-white/20 hover:border-white/30"
            >
              Request Early Access
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
