import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Tag } from 'lucide-react';
import { ARTICLES, CATEGORY_BADGE, getRelatedArticles } from '@/lib/resources';
import { mdToHtml } from '@/lib/markdown';

// ─── SSG: only Phase 1 articles ───────────────────────────────────────────────
export function generateStaticParams() {
  return ARTICLES.filter((a) => a.phase === 1).map((a) => ({ slug: a.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};
  return {
    title: `${article.title} | Axesntra`,
    description: article.seo_description,
  };
}

// ─── Category badge ───────────────────────────────────────────────────────────
function CategoryBadge({ category }: { category: string }) {
  const c = CATEGORY_BADGE[category];
  if (!c) return null;
  return (
    <span
      style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
      className="inline-block text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded"
    >
      {category}
    </span>
  );
}

// ─── Related article card ─────────────────────────────────────────────────────
function RelatedCard({
  article,
}: {
  article: (typeof ARTICLES)[number];
}) {
  return (
    <Link
      href={`/resources/${article.slug}`}
      className="group flex flex-col bg-white rounded-xl border border-slate-200 p-5 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="mb-2">
        <CategoryBadge category={article.category} />
      </div>
      <p className="text-sm font-semibold text-slate-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors flex-1">
        {article.headline}
      </p>
      <span className="inline-flex items-center gap-1 text-xs text-slate-400 group-hover:text-blue-600 transition-colors mt-auto">
        Read <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
      </span>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = ARTICLES.find((a) => a.slug === slug && a.phase === 1);
  if (!article) notFound();

  const related = getRelatedArticles(article, ARTICLES);
  const bodyHtml = mdToHtml(article.body);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Dark navy hero ──────────────────────────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #050c1a 0%, #0a1528 50%, #0d1e38 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
        className="py-16 md:py-20"
      >
        <div className="max-w-4xl mx-auto px-6 md:px-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 mb-8 text-xs text-slate-500">
            <Link href="/" className="hover:text-slate-300 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/resources" className="hover:text-slate-300 transition-colors">
              Resources
            </Link>
            <span>/</span>
            <span className="text-slate-400 truncate max-w-[200px]">{article.title}</span>
          </nav>

          {/* Category + tags */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <CategoryBadge category={article.category} />
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[10px] text-slate-400 border border-white/10 rounded px-2 py-0.5"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>

          {/* Headline */}
          <h1
            className="text-3xl md:text-4xl font-bold text-white leading-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            {article.title}
          </h1>
        </div>
      </div>

      {/* ── Article body ────────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-6 md:px-10 py-14">
        <div className="grid lg:grid-cols-[1fr_280px] gap-12 items-start">
          {/* Body */}
          <article>
            <div
              className="prose prose-slate prose-sm sm:prose max-w-none
                prose-headings:font-semibold prose-headings:tracking-tight
                prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4
                prose-h3:text-base prose-h3:mt-8 prose-h3:mb-3
                prose-p:leading-relaxed prose-p:text-slate-700
                prose-li:text-slate-700 prose-li:leading-relaxed
                prose-strong:text-slate-900
                prose-code:text-blue-700 prose-code:bg-blue-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs prose-code:font-normal
                prose-table:text-sm prose-th:bg-slate-100 prose-th:font-semibold
                prose-hr:border-slate-200
                prose-a:text-blue-600 hover:prose-a:text-blue-700"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />

            {/* Back link */}
            <div className="mt-14 pt-8 border-t border-slate-200">
              <Link
                href="/resources"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Resources
              </Link>
            </div>
          </article>

          {/* Sidebar CTA */}
          <aside className="hidden lg:block">
            <div
              className="rounded-xl p-6 sticky top-8"
              style={{
                background: 'linear-gradient(135deg, #050c1a 0%, #0d1e38 100%)',
                border: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <p
                style={{
                  fontFamily: 'var(--font-jetbrains-mono, monospace)',
                  color: '#3b82f6',
                }}
                className="text-[10px] uppercase tracking-widest mb-3"
              >
                AI Safety Advisor
              </p>
              <h3 className="text-base font-semibold text-white leading-snug mb-3">
                {article.cta_primary}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-5">
                Ask about {article.category.toLowerCase()} violations, get instant corrective action
                plans, and prepare for FMCSA audits — powered by AI.
              </p>
              <Link
                href="/early-access"
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors group w-full"
              >
                Get Early Access
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </aside>
        </div>

        {/* Mobile CTA */}
        <div
          className="lg:hidden mt-12 rounded-xl p-6"
          style={{
            background: 'linear-gradient(135deg, #050c1a 0%, #0d1e38 100%)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <p
            style={{ fontFamily: 'var(--font-jetbrains-mono, monospace)', color: '#3b82f6' }}
            className="text-[10px] uppercase tracking-widest mb-2"
          >
            AI Safety Advisor
          </p>
          <h3 className="text-base font-semibold text-white leading-snug mb-3">
            {article.cta_primary}
          </h3>
          <Link
            href="/early-access"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold py-2.5 px-5 rounded-lg transition-colors group"
          >
            Get Early Access
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-16">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-5">
              Related Guides
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((a) => (
                <RelatedCard key={a.slug} article={a} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
