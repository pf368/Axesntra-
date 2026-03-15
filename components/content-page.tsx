import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface ContentPageProps {
  title: string;
  intro: string;
  children: React.ReactNode;
  cta?: {
    href: string;
    label: string;
  };
}

export function ContentPage({ title, intro, children, cta }: ContentPageProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16 text-white">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-slate-300 max-w-3xl leading-relaxed">{intro}</p>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 py-16">
        <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-h2:text-2xl prose-h2:font-semibold prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-3 prose-p:text-slate-700 prose-p:leading-relaxed prose-li:text-slate-700 prose-ul:space-y-2">
          {children}
        </div>

        {cta && (
          <div className="mt-16 pt-8 border-t border-slate-200 text-center">
            <Link
              href={cta.href}
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
            >
              {cta.label}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
