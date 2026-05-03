'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Search, Tag } from 'lucide-react';
import {
  type Article,
  CATEGORY_FILTERS,
  CATEGORY_BADGE,
  getPhase1Articles,
  filterByChip,
  searchArticles,
} from '@/lib/resources';

// ─── Category badge pill ──────────────────────────────────────────────────────
function CategoryBadge({ category }: { category: string }) {
  const c = CATEGORY_BADGE[category];
  if (!c) return null;
  return (
    <span
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
      className="inline-block text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded"
    >
      {category}
    </span>
  );
}

// ─── Article card ─────────────────────────────────────────────────────────────
function ArticleCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/resources/${article.slug}`}
      className="group flex flex-col bg-white rounded-xl border border-slate-200 p-6 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="mb-3">
        <CategoryBadge category={article.category} />
      </div>
      <h3 className="text-[0.92rem] font-semibold text-slate-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors flex-1">
        {article.headline}
      </h3>
      <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
        {article.seo_description}
      </p>
      <div className="flex flex-wrap gap-1.5 mb-4">
        {article.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5"
          >
            <Tag className="w-2.5 h-2.5" />
            {tag}
          </span>
        ))}
      </div>
      <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-blue-600 transition-colors">
        Read guide
        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </Link>
  );
}

// ─── Featured card (larger) ───────────────────────────────────────────────────
function FeaturedCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/resources/${article.slug}`}
      className="group flex flex-col bg-white rounded-xl border border-slate-200 p-7 hover:border-blue-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="mb-3">
        <CategoryBadge category={article.category} />
      </div>
      <h3 className="text-base font-semibold text-slate-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors">
        {article.headline}
      </h3>
      <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-3 flex-1">
        {article.seo_description}
      </p>
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
        Read guide
        <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </Link>
  );
}

// ─── Main hub component ───────────────────────────────────────────────────────
export function ResourcesHub() {
  const phase1 = getPhase1Articles();
  const featured = phase1.filter((a) => a.featured);

  const [activeChip, setActiveChip] = useState<string>('All');
  const [query, setQuery] = useState('');

  const filtered = searchArticles(filterByChip(phase1, activeChip), query);
  const featuredFiltered = query
    ? filtered.filter((a) => a.featured)
    : filterByChip(featured, activeChip);
  const gridArticles = query
    ? filtered
    : filtered.filter((a) => !a.featured || activeChip !== 'All');

  // When a category filter is active or search is active, show all results flat;
  // when All + no search, show featured row then the rest.
  const showFeaturedRow = !query && activeChip === 'All' && featuredFiltered.length > 0;
  const mainGrid = showFeaturedRow ? phase1.filter((a) => !a.featured) : filtered;

  return (
    <div>
      {/* ── Dark navy hero ─────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'linear-gradient(135deg, #050c1a 0%, #0a1528 50%, #0d1e38 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
        className="py-24"
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10">
          <p
            style={{ fontFamily: 'var(--font-jetbrains-mono, monospace)', color: '#3b82f6' }}
            className="text-[11px] uppercase tracking-widest mb-5"
          >
            DOT Compliance Resources
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5 max-w-3xl"
            style={{ letterSpacing: '-0.02em' }}>
            Fleet Safety Compliance Guides
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl leading-relaxed mb-10">
            Plain-language guides on DOT violations, CSA BASICs, FMCSA audits, and corrective
            actions — built for fleet safety managers, owner-operators, and compliance teams.
          </p>

          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              type="search"
              placeholder="Search guides, violations, regulations…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (e.target.value) setActiveChip('All');
              }}
              className="w-full pl-11 pr-4 py-3 rounded-lg text-sm text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-blue-500/40"
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.10)',
              }}
            />
          </div>
        </div>
      </section>

      {/* ── Category chips ──────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 md:px-10 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {CATEGORY_FILTERS.map((chip) => (
            <button
              key={chip}
              onClick={() => {
                setActiveChip(chip);
                setQuery('');
              }}
              className={`flex-shrink-0 text-xs font-medium px-3.5 py-1.5 rounded-full border transition-all ${
                activeChip === chip && !query
                  ? 'bg-slate-900 text-white border-slate-900'
                  : 'text-slate-600 border-slate-200 bg-white hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-14">
        {/* Search results */}
        {query && (
          <div className="mb-10">
            <p className="text-sm text-slate-500 mb-6">
              {filtered.length === 0
                ? `No results for "${query}"`
                : `${filtered.length} result${filtered.length !== 1 ? 's' : ''} for "${query}"`}
            </p>
            {filtered.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Featured row (All + no search) */}
        {showFeaturedRow && (
          <section className="mb-14">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5">
              Featured Guides
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredFiltered.map((a) => (
                <FeaturedCard key={a.slug} article={a} />
              ))}
            </div>
          </section>
        )}

        {/* Main grid */}
        {!query && (
          <section>
            {showFeaturedRow && (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5">
                {activeChip === 'All' ? 'All Guides' : activeChip}
              </p>
            )}
            {!showFeaturedRow && activeChip !== 'All' && (
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5">
                {activeChip}
              </p>
            )}
            {mainGrid.length === 0 ? (
              <p className="text-sm text-slate-400 py-12 text-center">
                No guides in this category yet — check back soon.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {mainGrid.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Bottom CTA */}
        <div
          className="mt-20 rounded-2xl px-10 py-14 text-center"
          style={{
            background: 'linear-gradient(135deg, #050c1a 0%, #0d1e38 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <p
            style={{ fontFamily: 'var(--font-jetbrains-mono, monospace)', color: '#3b82f6' }}
            className="text-[11px] uppercase tracking-widest mb-4"
          >
            AI-Powered Compliance
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 max-w-lg mx-auto leading-snug"
            style={{ letterSpacing: '-0.02em' }}>
            Let AI answer your DOT compliance questions instantly
          </h2>
          <p className="text-slate-400 mb-9 max-w-md mx-auto leading-relaxed text-sm">
            Axesntra&apos;s AI Safety Advisor explains violations, generates corrective action plans, and
            helps you prepare for audits — in plain language.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/early-access"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-7 py-3 rounded-lg text-sm font-semibold transition-colors group"
            >
              Get Early Access
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 text-slate-300 hover:text-white px-7 py-3 rounded-lg text-sm font-medium transition-colors border border-white/10 hover:border-white/20"
            >
              See How It Works
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
