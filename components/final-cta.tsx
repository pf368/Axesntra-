import Link from 'next/link';

export function FinalCTA() {
  return (
    <section className="py-32 bg-sb-surface-container-lowest border-t border-sb-outline-variant/10">
      <div className="max-w-4xl mx-auto px-8 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-sb-on-background mb-6">
          Start knowing your risk today.
        </h2>
        <p className="text-xl text-sb-on-surface-variant mb-12">
          Join hundreds of safety managers using Axesntra to protect their carriers.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            href="/#search"
            className="ai-gradient text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-xl shadow-sb-primary/30 hover:scale-[1.05] transition-all"
          >
            Check your DOT profile
          </Link>
          <span className="text-sb-on-surface-variant font-medium">or</span>
          <Link
            href="/early-access"
            className="text-sb-on-background font-bold border-b-2 border-sb-on-background/10 hover:border-sb-primary transition-colors text-xl pb-1"
          >
            Contact Sales
          </Link>
        </div>
      </div>
    </section>
  );
}
