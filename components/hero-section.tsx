'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Loader, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroChat } from '@/components/hero-chat';

/* ── Animated background grid ── */
function AnimatedGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <svg className="absolute inset-0 w-full" style={{ height: '200%', top: 0 }} xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="hero-grid" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(148,163,184,0.08)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)" className="animate-grid-scroll" />
      </svg>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 40%, rgba(15,23,42,0.4) 100%)' }} />
    </div>
  );
}

export function HeroSection() {
  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-24 text-white overflow-hidden">
      <AnimatedGrid />

      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* ── Left column ── */}
          <div className="flex-1 min-w-0 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full" />
              Currently in private pilot · 40+ teams enrolled
            </div>

            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Your AI safety analyst.{'\n'}Ask anything about any carrier.
            </h1>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto lg:mx-0">
              Axesntra reads every FMCSA record, scores every violation, and answers your questions in plain English — so your team can make faster, better-documented decisions.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-3 divide-x divide-white/10 bg-slate-800/60 rounded-xl mb-6 max-w-xl mx-auto lg:mx-0">
              {[
                { value: '98%', label: 'Pilot retention rate' },
                { value: '12k+', label: 'Carrier briefs generated' },
                { value: 'Daily', label: 'Updated via FMCSA SMS' },
              ].map((stat) => (
                <div key={stat.value} className="flex flex-col items-center justify-center text-center px-4 py-4">
                  <p className="text-white font-bold text-xl leading-tight">{stat.value}</p>
                  <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTA row */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/early-access"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold px-7 py-3.5 rounded-xl transition-colors"
              >
                Get access
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/#live-demo"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:border-white/40 text-white text-base font-semibold px-7 py-3.5 rounded-xl transition-colors"
              >
                See a live demo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* ── Right column: HeroChat (desktop only) ── */}
          <div className="hidden lg:block flex-shrink-0 w-[480px]">
            <div className="relative">
              <div className="absolute inset-0 -z-10 scale-110" style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.12), transparent 70%)' }} />
              <HeroChat />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
