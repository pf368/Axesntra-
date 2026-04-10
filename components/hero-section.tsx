import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

function DataStreamCards() {
  return (
    <div className="w-full md:w-1/3 h-full overflow-hidden data-stream flex flex-col gap-4 font-mono text-[10px] text-slate-400">
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
        {`{"record_id": "92834", "carrier_name": "LOGISTICS_CORP", "violation_code": "395.8", "severity": 7}`}
      </div>
      <div className="p-3 bg-slate-100 rounded-lg border border-slate-200">
        INSPECTION_DATE: 2023-11-12 | LOCATION: OH-71 | UNIT_ID: 10292
      </div>
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
        {`{"crash_event": true, "fatalities": 0, "tow_away": true, "hazmat": false}`}
      </div>
      <div className="p-3 bg-slate-100 rounded-lg border border-slate-200 opacity-40">
        CARRIER_CENSUS_DATA_RAW_SQL_FETCH_COMPLETE...
      </div>
      <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
        {`{"vin": "1FDWF5HT6", "plate": "P928312", "violations": ["392.2"]}`}
      </div>
    </div>
  );
}

function ProcessingEngine() {
  return (
    <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
      <div className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-10 animate-pulse" />
      <div className="relative w-full h-full ai-gradient rounded-3xl shadow-xl flex items-center justify-center text-white border border-white/20">
        <Zap className="h-10 w-10" />
      </div>
    </div>
  );
}

function InsightCards() {
  const insights = [
    {
      label: 'High Risk Violation',
      labelColor: 'text-white',
      time: '2m ago',
      text: 'Hours of Service (HOS) trending 12% above threshold.',
      bold: true,
    },
    {
      label: 'AI Summary',
      labelColor: 'text-slate-400',
      text: (
        <>
          Fleet safety score improved by{' '}
          <span className="text-white font-bold">4.2 pts</span> after corrective action.
        </>
      ),
      bold: false,
    },
    {
      label: 'Next Action',
      labelColor: 'text-white',
      text: 'Schedule Level II Inspection for 14 units at Houston yard.',
      bold: true,
    },
  ];

  return (
    <div className="w-full md:w-1/2 h-full flex flex-col gap-4">
      {insights.map((insight) => (
        <div key={insight.label} className="gradient-border-container shadow-xl">
          <div className="p-4 dark-insight-box rounded-xl border-l-4 overflow-hidden">
            <div className="flex justify-between items-start mb-2">
              <span className={`text-[10px] font-bold tracking-tighter uppercase ${insight.labelColor}`}>
                {insight.label}
              </span>
              {insight.time && (
                <span className="text-[10px] text-white/40 font-mono">{insight.time}</span>
              )}
            </div>
            <p className={`text-xs ${insight.bold ? 'font-semibold text-white' : 'text-white/70'} leading-relaxed`}>
              {insight.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-20 pb-32 bg-sb-surface">
      <div className="max-w-7xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center">
        {/* Left column */}
        <div className="z-10">
          <span className="inline-block px-3 py-1 bg-sb-surface-container-high text-sb-primary font-semibold text-xs tracking-widest rounded mb-6 uppercase">
            Built for safety managers, DOT managers, fleet managers, and owners.
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter text-sb-on-background leading-tight mb-6">
            Know your FMCSA risk before the next inspection, audit, or renewal.
          </h1>
          <p className="text-lg text-sb-on-surface-variant max-w-xl mb-10 leading-relaxed">
            Axesntra turns public FMCSA data into a live safety workspace for fleets — with an AI
            Safety Advisor that shows what changed, why it matters, and what to fix next.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/#search"
              className="ai-gradient text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-sb-primary/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
            >
              Check your DOT profile
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/early-access"
              className="bg-sb-surface-container-lowest border border-sb-outline-variant/30 text-sb-on-surface px-8 py-4 rounded-xl font-bold text-lg hover:bg-sb-surface-container-low transition-colors text-center"
            >
              Request a Demo
            </Link>
          </div>
        </div>

        {/* Right column: Intelligence Engine visual */}
        <div className="relative h-[600px] hidden lg:flex items-center justify-center">
          <div className="palantir-card-light w-full h-full overflow-hidden flex flex-col md:flex-row items-center justify-between p-8 gap-4">
            <DataStreamCards />
            <ProcessingEngine />
            <InsightCards />
          </div>
        </div>
      </div>
    </section>
  );
}
