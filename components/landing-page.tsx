'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import './landing-page.css';

// ─── ICON ─────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = 'currentColor' }: { name: string; size?: number; color?: string }) => {
  const s = { stroke: color, fill: 'none', strokeWidth: '1.5', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const icons: Record<string, React.ReactNode> = {
    shield: <svg width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
    truck: <svg width={size} height={size} viewBox="0 0 24 24" {...s}><rect x="1" y="3" width="15" height="13" rx="1" /><path d="M16 8h4l3 3v5h-7V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
    alert: <svg width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" {...s}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>,
    search: <svg width={size} height={size} viewBox="0 0 24 24" {...s}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    zap: <svg width={size} height={size} viewBox="0 0 24 24" {...s}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    eye: <svg width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>,
    doc: <svg width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
    grid: <svg width={size} height={size} viewBox="0 0 24 24" {...s}><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
    trend: <svg width={size} height={size} viewBox="0 0 24 24" {...s}><polyline points="22 7 13.5 15.5 8.5 10.5 2 17" /><polyline points="16 7 22 7 22 13" /></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    send: <svg width={size} height={size} viewBox="0 0 24 24" {...s}><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" {...s}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    chat: <svg width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
  };
  return <>{icons[name] ?? null}</>;
};

// ─── PERSONA ILLUSTRATIONS ────────────────────────────────────────────────────
const PersonaIllustration = ({ kind, color }: { kind: string; color: string }) => {
  const w = 600, h = 260;
  const bg = 'var(--bg2)';
  const accentDim = `${color}40`;
  const accentSoft = `${color}1a`;
  const ink = 'var(--text)';
  const muted = 'var(--text-muted)';
  const common = { width: '100%', height: '100%', viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: 'xMidYMid slice' as const };

  if (kind === 'safety') return (
    <svg {...common}>
      <defs><linearGradient id="g-safety" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={accentSoft} /><stop offset="1" stopColor="transparent" /></linearGradient></defs>
      <rect width={w} height={h} fill={bg} />
      <rect width={w} height={h} fill="url(#g-safety)" />
      {[...Array(12)].map((_, i) => <line key={i} x1={i * 50} y1="0" x2={i * 50} y2={h} stroke={accentDim} strokeWidth="0.5" opacity="0.25" />)}
      <g transform={`translate(${w / 2 - 60}, 40)`}>
        <path d="M60 0 L120 22 L120 90 Q120 140 60 175 Q0 140 0 90 L0 22 Z" fill={accentSoft} stroke={color} strokeWidth="2" />
        <path d="M30 90 L52 112 L92 60" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(40, 170)">
        {[40, 70, 28, 56, 80, 36].map((bh, i) => <rect key={i} x={i * 20} y={70 - bh} width="12" height={bh} fill={color} opacity={0.3 + i * 0.1} rx="2" />)}
      </g>
      <g transform={`translate(${w - 160}, 170)`}>
        <rect width="120" height="60" rx="6" fill="none" stroke={accentDim} strokeWidth="1" />
        <text x="10" y="22" fill={muted} fontSize="9" fontFamily="var(--lp-mono)" letterSpacing="1">BASIC SCORE</text>
        <text x="10" y="48" fill={ink} fontSize="22" fontWeight="700">78.2</text>
        <circle cx="105" cy="40" r="6" fill={color} />
      </g>
    </svg>
  );

  if (kind === 'fleet') {
    const stars = [
      { cx: 45, cy: 23, o: 0.3 }, { cx: 130, cy: 67, o: 0.45 }, { cx: 210, cy: 15, o: 0.2 },
      { cx: 290, cy: 50, o: 0.35 }, { cx: 380, cy: 28, o: 0.4 }, { cx: 450, cy: 70, o: 0.25 },
      { cx: 520, cy: 40, o: 0.3 }, { cx: 80, cy: 95, o: 0.2 }, { cx: 165, cy: 110, o: 0.45 },
      { cx: 240, cy: 80, o: 0.3 }, { cx: 320, cy: 100, o: 0.4 }, { cx: 400, cy: 55, o: 0.2 },
      { cx: 480, cy: 90, o: 0.35 }, { cx: 550, cy: 20, o: 0.25 }, { cx: 100, cy: 45, o: 0.4 },
      { cx: 350, cy: 75, o: 0.3 }, { cx: 500, cy: 110, o: 0.2 }, { cx: 60, cy: 115, o: 0.35 },
      { cx: 420, cy: 35, o: 0.45 }, { cx: 580, cy: 65, o: 0.3 },
    ];
    return (
      <svg {...common}>
        <rect width={w} height={h} fill={bg} />
        <rect x="0" y={h - 50} width={w} height="50" fill="var(--bg3)" />
        {[...Array(8)].map((_, i) => <rect key={i} x={i * 80 + 20} y={h - 26} width="40" height="4" fill={color} opacity="0.5" />)}
        {stars.map((st, i) => <circle key={i} cx={st.cx} cy={st.cy} r="1" fill={color} opacity={st.o} />)}
        <g transform="translate(140, 90)">
          <rect x="0" y="20" width="70" height="65" rx="6" fill={color} />
          <rect x="8" y="30" width="50" height="22" rx="3" fill={bg} opacity="0.4" />
          <rect x="0" y="80" width="70" height="8" fill="var(--bg3)" />
          <rect x="75" y="0" width="200" height="85" rx="4" fill={bg} stroke={color} strokeWidth="2" />
          {[...Array(7)].map((_, i) => <line key={i} x1={90 + i * 28} y1="8" x2={90 + i * 28} y2="78" stroke={color} strokeWidth="1" opacity="0.3" />)}
          <rect x="180" y="30" width="80" height="28" rx="3" fill={color} opacity="0.18" />
          <text x="220" y="48" fill={color} fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="var(--lp-mono)" letterSpacing="2">USDOT</text>
          <circle cx="20" cy="100" r="14" fill="#0a0a0a" stroke={color} strokeWidth="2" />
          <circle cx="20" cy="100" r="6" fill={color} opacity="0.4" />
          <circle cx="120" cy="100" r="14" fill="#0a0a0a" stroke={color} strokeWidth="2" />
          <circle cx="120" cy="100" r="6" fill={color} opacity="0.4" />
          <circle cx="240" cy="100" r="14" fill="#0a0a0a" stroke={color} strokeWidth="2" />
          <circle cx="240" cy="100" r="6" fill={color} opacity="0.4" />
        </g>
        {[40, 60, 80, 100].map((y, i) => <line key={i} x1="20" y1={y + 50} x2={80 + i * 5} y2={y + 50} stroke={color} strokeWidth="2" strokeLinecap="round" opacity={0.15 + i * 0.08} />)}
        <g transform={`translate(${w - 150}, 30)`}>
          <rect width="120" height="28" rx="14" fill={accentSoft} stroke={accentDim} />
          <circle cx="14" cy="14" r="4" fill={color} />
          <text x="26" y="18" fill={color} fontSize="10" fontWeight="600" fontFamily="var(--lp-mono)" letterSpacing="1">FLEET ONLINE</text>
        </g>
      </svg>
    );
  }

  if (kind === 'broker') return (
    <svg {...common}>
      <rect width={w} height={h} fill={bg} />
      {[{ x: 120, y: 80, r: 10 }, { x: 300, y: 60, r: 14 }, { x: 480, y: 90, r: 10 }, { x: 200, y: 170, r: 12 }, { x: 380, y: 180, r: 10 }, { x: 90, y: 200, r: 8 }, { x: 520, y: 190, r: 9 }].map((n, i) => <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={color} opacity={0.4 + (i % 3) * 0.2} />)}
      {[['120,80', '300,60'], ['300,60', '480,90'], ['120,80', '200,170'], ['200,170', '380,180'], ['300,60', '200,170'], ['480,90', '380,180'], ['90,200', '200,170'], ['380,180', '520,190']].map((p, i) => <line key={i} x1={p[0].split(',')[0]} y1={p[0].split(',')[1]} x2={p[1].split(',')[0]} y2={p[1].split(',')[1]} stroke={color} strokeWidth="1.5" opacity="0.35" />)}
      <g transform={`translate(${w / 2 - 36}, ${h / 2 - 36})`}>
        <circle cx="36" cy="36" r="36" fill={bg} stroke={color} strokeWidth="2" />
        <circle cx="36" cy="36" r="28" fill={accentSoft} />
        <path d="M22 36 L32 46 L52 26" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );

  if (kind === 'underwriter') return (
    <svg {...common}>
      <rect width={w} height={h} fill={bg} />
      <g transform="translate(60, 40)">
        <rect x="20" y="20" width="170" height="200" rx="8" fill="var(--bg3)" opacity="0.6" />
        <rect x="10" y="10" width="170" height="200" rx="8" fill="var(--bg3)" />
        <rect x="0" y="0" width="170" height="200" rx="8" fill={bg} stroke={color} strokeWidth="2" />
        {[28, 54, 80, 106, 132, 158].map((y, i) => <rect key={i} x="18" y={y} width={120 - i * 10} height="4" rx="2" fill={color} opacity={0.5 - i * 0.06} />)}
      </g>
      <g transform="translate(290, 60)">
        <rect width="240" height="160" rx="8" fill="none" stroke={accentDim} strokeWidth="1" />
        <line x1="20" y1="130" x2="220" y2="130" stroke={accentDim} strokeWidth="1" />
        <polyline points="20,110 50,90 80,100 110,70 140,80 170,50 200,40 220,30" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <polygon points="20,110 50,90 80,100 110,70 140,80 170,50 200,40 220,30 220,130 20,130" fill={color} opacity="0.15" />
        <text x="20" y="20" fill={muted} fontSize="9" fontFamily="var(--lp-mono)" letterSpacing="1">RISK TREND · 90D</text>
      </g>
    </svg>
  );

  return null;
};

// ─── DASHBOARD MOCK ───────────────────────────────────────────────────────────
const DashboardMock = () => {
  const basics = [
    { label: 'Vehicle Maintenance', pct: 84, color: 'var(--red)' },
    { label: 'Unsafe Driving', pct: 61, color: 'var(--amber)' },
    { label: 'HOS Compliance', pct: 47, color: 'var(--amber)' },
    { label: 'Crash Indicator', pct: 72, color: 'var(--red)' },
    { label: 'Driver Fitness', pct: 38, color: 'var(--green)' },
    { label: 'Controlled Substances', pct: 12, color: 'var(--green)' },
  ];
  const inspections = [
    { date: 'Apr 14', type: 'Level I', result: 'OOS', violation: 'Brake system' },
    { date: 'Mar 28', type: 'Level II', result: 'OOS', violation: 'Tire condition' },
    { date: 'Mar 09', type: 'Level I', result: 'Warn', violation: 'Lighting' },
  ];
  return (
    <div style={{ background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', fontFamily: 'var(--lp-font)', height: '100%' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon name="truck" size={13} color="var(--blue)" />
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)' }}>Carrier Intelligence</span>
        </div>
        <span style={{ fontFamily: 'var(--lp-mono)', fontSize: 10, color: 'var(--text-dim)' }}>USDOT 1234567</span>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0 }}>
            <svg width="72" height="72" viewBox="0 0 72 72">
              <circle cx="36" cy="36" r="28" fill="none" stroke="var(--bg3)" strokeWidth="5" />
              <circle cx="36" cy="36" r="28" fill="none" stroke="var(--red)" strokeWidth="5" strokeDasharray={`${0.72 * 175.9} 175.9`} strokeDashoffset="44" strokeLinecap="round" transform="rotate(-90 36 36)" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'var(--lp-mono)', color: 'var(--text)', lineHeight: 1 }}>72</span>
              <span style={{ fontSize: 9, color: 'var(--text-dim)', marginTop: 1 }}>RISK</span>
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: 6 }}>
              <span className="risk-badge risk-high" style={{ fontSize: 10 }}>● Elevated Risk</span>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[{ val: '2', label: 'OOS Events', color: 'var(--red)' }, { val: '11', label: 'Violations', color: 'var(--amber)' }, { val: '3', label: 'Crashes', color: 'var(--text)' }].map((s) => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--lp-mono)', fontSize: 14, fontWeight: 600, color: s.color }}>{s.val}</div>
                  <div style={{ fontSize: 9, color: 'var(--text-dim)', marginTop: 1 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ height: 1, background: 'var(--border)' }} />
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 8, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--lp-mono)' }}>BASIC Categories</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {basics.map((b) => (
              <div key={b.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{b.label}</span>
                  <span style={{ fontFamily: 'var(--lp-mono)', fontSize: 10, color: b.color }}>{b.pct}%</span>
                </div>
                <div className="basic-bar-track"><div className="basic-bar-fill" style={{ width: `${b.pct}%`, background: b.color, opacity: 0.8 }} /></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 1, background: 'var(--border)' }} />
        <div>
          <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 8, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'var(--lp-mono)' }}>Recent Inspections</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {inspections.map((ins, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6, background: 'var(--bg2)' }}>
                <span style={{ fontFamily: 'var(--lp-mono)', fontSize: 10, color: 'var(--text-dim)', width: 44 }}>{ins.date}</span>
                <span style={{ fontFamily: 'var(--lp-mono)', fontSize: 10, color: 'var(--text-muted)', width: 48 }}>{ins.type}</span>
                <span className={`risk-badge ${ins.result === 'OOS' ? 'risk-high' : 'risk-elevated'}`} style={{ fontSize: 9, padding: '1px 5px' }}>{ins.result}</span>
                <span style={{ fontSize: 10.5, color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ins.violation}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── AI CHAT LOOP DEMO ────────────────────────────────────────────────────────
const CONVERSATIONS = [
  {
    question: 'What caused Vehicle Maintenance to become our highest-risk BASIC?',
    answer: 'Vehicle Maintenance increased because recent inspections show recurring brake, tire, and lighting violations. Two of the inspections resulted in out-of-service findings, which indicates the issue is not isolated. Recommended next steps: perform a targeted maintenance audit, review pre-trip inspection quality, assign corrective actions by unit, and monitor follow-up inspections over the next 30 days.',
    actions: ['Schedule maintenance audit', 'Review pre-trip logs', 'Monitor 30 days'],
  },
  {
    question: 'Does this carrier pose a risk for an upcoming load?',
    answer: 'Yes — this carrier has elevated risk across Vehicle Maintenance (84th percentile) and Crash Indicator (72nd percentile). Two recent OOS events involving brake and tire defects suggest systemic maintenance issues. Recommend requesting a maintenance certification, verifying insurance is current, and setting a 30-day watchlist alert before assigning future loads.',
    actions: ['View carrier profile', 'Set watchlist alert', 'Request cert docs'],
  },
  {
    question: 'What should we fix first to reduce our CSA exposure?',
    answer: 'Prioritize Vehicle Maintenance — it carries the highest OOS risk and is driving the most BASIC percentile movement. Specifically, units with brake and tire violations in the last 60 days should be pulled for immediate inspection. Addressing these before the next roadside inspection window can reduce OOS exposure and prevent BASIC percentile increases.',
    actions: ['Generate action plan', 'Flag high-risk units', 'Export summary'],
  },
  {
    question: 'Draft a corrective action plan for our fleet.',
    answer: 'Corrective Action Plan — USDOT 1234567: (1) Immediate: Pull units with brake/tire violations for targeted inspection within 48 hours. (2) High priority: Reinforce pre-trip inspection documentation for all active drivers within 7 days. (3) Ongoing: Assign a 30-day follow-up monitoring window for Vehicle Maintenance BASIC. (4) Documentation: Create driver coaching notes for inspection compliance.',
    actions: ['Export action plan', 'Assign to team', 'Set reminders'],
  },
];

const AIChatLoopDemo = () => {
  const [convIdx, setConvIdx] = useState(0);
  const [phase, setPhase] = useState<'typing-q' | 'typing-dots' | 'showing-a' | 'pause-a'>('typing-q');
  const [displayedQ, setDisplayedQ] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [glowActive, setGlowActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const conv = CONVERSATIONS[convIdx];

  useEffect(() => {
    setDisplayedQ(''); setShowAnswer(false); setShowSources(false); setGlowActive(false); setPhase('typing-q');
  }, [convIdx]);

  useEffect(() => {
    if (phase === 'typing-q') {
      const fullQ = conv.question;
      if (displayedQ.length < fullQ.length) {
        timerRef.current = setTimeout(() => setDisplayedQ(fullQ.slice(0, displayedQ.length + 1)), 38);
      } else {
        timerRef.current = setTimeout(() => setPhase('typing-dots'), 400);
      }
    }
    if (phase === 'typing-dots') {
      setGlowActive(true);
      timerRef.current = setTimeout(() => { setShowAnswer(true); setPhase('showing-a'); }, 1600);
    }
    if (phase === 'showing-a') {
      timerRef.current = setTimeout(() => setShowSources(true), 500);
      timerRef.current = setTimeout(() => setPhase('pause-a'), 3600);
    }
    if (phase === 'pause-a') {
      timerRef.current = setTimeout(() => setConvIdx((i) => (i + 1) % CONVERSATIONS.length), 2200);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, displayedQ, conv]);

  const glowShadow = glowActive
    ? '0 0 0 1px rgba(0,116,255,0.3), 0 0 20px rgba(0,116,255,0.15), 0 0 40px rgba(0,212,255,0.1)'
    : '0 0 0 1px rgba(0,116,255,0.1)';

  return (
    <div style={{ background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%', width: '100%', minWidth: 0, position: 'relative', contain: 'layout size' }}>
      <div style={{ position: 'absolute', inset: -1, borderRadius: 20, pointerEvents: 'none', zIndex: 0, boxShadow: glowShadow, transition: 'box-shadow 0.8s ease' }} />
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10, background: 'var(--bg2)', position: 'relative', zIndex: 1 }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(0,116,255,0.4)' }}>
          <Icon name="shield" size={15} color="white" />
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>AI Safety Advisor</div>
          <div style={{ fontSize: 10, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'lp-pulse-dot 2s ease infinite' }} />
            Connected · FMCSA · CSA · SAFER
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 5 }}>
          {CONVERSATIONS.map((_, i) => (
            <div key={i} style={{ width: i === convIdx ? 16 : 5, height: 5, borderRadius: 3, background: i === convIdx ? 'var(--blue)' : 'rgba(0,116,255,0.15)', transition: 'all 0.4s ease' }} />
          ))}
        </div>
      </div>
      <div style={{ flex: 1, padding: '18px 18px 12px', display: 'flex', flexDirection: 'column', gap: 14, overflowY: 'auto', overflowX: 'hidden', position: 'relative', zIndex: 1, minHeight: 0, width: '100%', boxSizing: 'border-box' }}>
        {phase === 'typing-q' && displayedQ.length === 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
            {['What should we fix first?', 'Explain this violation', 'Draft a CAP', 'Screen this carrier'].map((p, i) => (
              <div key={i} style={{ padding: '5px 11px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--lp-font)' }}>{p}</div>
            ))}
          </div>
        )}
        {displayedQ.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
            <div style={{ background: 'var(--blue)', border: '1px solid var(--blue)', borderRadius: '12px 12px 3px 12px', padding: '10px 14px', fontSize: 13, color: '#fff', maxWidth: '85%', minWidth: 0, wordBreak: 'break-word', lineHeight: 1.55 }}>
              {displayedQ}
              {phase === 'typing-q' && displayedQ.length < conv.question.length && (
                <span style={{ display: 'inline-block', width: 7, height: 14, background: 'var(--blue)', borderRadius: 1, marginLeft: 2, verticalAlign: 'middle', animation: 'lp-blink 0.9s step-start infinite', flexShrink: 0 }} />
              )}
            </div>
          </div>
        )}
        {phase === 'typing-dots' && (
          <div style={{ display: 'flex', gap: 5, padding: '10px 14px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px 12px 12px 3px', width: 'fit-content', minWidth: 0 }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--blue)', animation: `lp-pulse-dot 1.1s ease ${i * 0.18}s infinite` }} />)}
          </div>
        )}
        {showAnswer && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, animation: 'lp-fadeUp 0.4s ease forwards', width: '100%', minWidth: 0 }}>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '12px 12px 12px 3px', padding: '12px 14px', fontSize: 12.5, color: 'var(--text)', lineHeight: 1.65, wordBreak: 'break-word', width: '100%', boxSizing: 'border-box' }}>
              {conv.answer}
            </div>
            {showSources && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', animation: 'lp-fadeUp 0.3s ease forwards' }}>
                {conv.actions.map((a, i) => (
                  <div key={i} style={{ padding: '4px 10px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 11, color: 'var(--blue)', fontFamily: 'var(--lp-font)' }}>{a}</div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div style={{ padding: '12px 16px 14px', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'relative', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 6, boxShadow: glowActive ? '0 0 0 1px rgba(0,116,255,0.35), 0 0 12px rgba(0,116,255,0.15)' : '0 2px 8px rgba(0,0,0,0.2)', transition: 'box-shadow 0.6s ease' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          </div>
          <div style={{ flex: 1, fontSize: 12.5, color: 'var(--text-muted)', fontFamily: 'var(--lp-font)', lineHeight: 1.4, padding: '2px 4px' }}>
            <span style={{ color: 'var(--text-dim)' }}>Ask about DOT compliance, carriers, violations...</span>
          </div>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: phase === 'showing-a' || phase === 'pause-a' ? 'var(--blue)' : 'var(--bg3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.3s ease' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: 7, fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--lp-mono)', letterSpacing: '0.04em' }}>ASK ANYTHING · DOT · FMCSA · CSA · VIOLATIONS · CARRIERS</div>
      </div>
    </div>
  );
};

// ─── AI CHAT MOCK ─────────────────────────────────────────────────────────────
const AIChatMock = () => {
  const initialMessages = [
    { role: 'user', content: 'Why did Vehicle Maintenance become our highest-risk BASIC?' },
    { role: 'ai', content: 'Vehicle Maintenance increased because recent inspections show recurring brake, tire, and lighting violations. Two of the inspections resulted in out-of-service findings, which indicates the issue is not isolated.', actions: ['Assign maintenance audit', 'Review pre-trip inspections', 'Monitor 30-day follow-up'] },
  ];
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const handleSend = (text?: string) => {
    const q = text ?? input;
    if (!q.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: q }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { role: 'ai', content: 'Based on current FMCSA data, this carrier shows elevated risk across Vehicle Maintenance and Crash Indicator BASICs. Recommended next steps include a targeted maintenance audit, pre-trip inspection review, and a 30-day follow-up monitoring window.', actions: ['View violation breakdown', 'Generate corrective plan', 'Set monitoring alert'] }]);
    }, 1400);
  };

  useEffect(() => { if (endRef.current) endRef.current.scrollTop = endRef.current.scrollHeight; }, [messages, typing]);

  return (
    <div style={{ background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 14, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 26, height: 26, borderRadius: 6, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="shield" size={13} color="white" /></div>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', lineHeight: 1.2 }}>AI Safety Advisor</div>
          <div style={{ fontSize: 10, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'lp-pulse-dot 2s ease infinite' }} />
            Connected to FMCSA · CSA · SAFER
          </div>
        </div>
      </div>
      <div ref={endRef} style={{ flex: 1, overflowY: 'auto', padding: 14, display: 'flex', flexDirection: 'column', gap: 12, minHeight: 0 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {msg.role === 'user' ? (
              <div style={{ background: 'rgba(0,116,255,0.18)', border: '1px solid rgba(0,116,255,0.25)', borderRadius: '10px 10px 2px 10px', padding: '8px 12px', fontSize: 12, color: 'var(--text)', maxWidth: '85%', lineHeight: 1.5 }}>{msg.content}</div>
            ) : (
              <div style={{ maxWidth: '95%', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px 10px 10px 2px', padding: '10px 12px', fontSize: 12, color: 'var(--text)', lineHeight: 1.6 }}>{msg.content}</div>
                {msg.actions && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                    {msg.actions.map((a, j) => (
                      <button key={j} style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 5, padding: '3px 9px', fontSize: 10.5, color: 'var(--blue)', cursor: 'pointer', fontFamily: 'var(--lp-font)', transition: 'all 0.15s' }}>{a}</button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', gap: 4, padding: '8px 12px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '10px 10px 10px 2px', width: 'fit-content' }}>
            {[0, 1, 2].map((i) => <div key={i} style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--blue)', animation: `lp-pulse-dot 1.2s ease ${i * 0.2}s infinite` }} />)}
          </div>
        )}
      </div>
      <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask about DOT compliance, carriers, violations..."
          style={{ flex: 1, background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 8, padding: '7px 12px', fontSize: 12, color: 'var(--text)', fontFamily: 'var(--lp-font)', outline: 'none' }} />
        <button onClick={() => handleSend()} style={{ width: 30, height: 30, borderRadius: 7, background: 'var(--blue)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0, marginTop: 'auto' }}>
          <Icon name="send" size={12} color="white" />
        </button>
      </div>
    </div>
  );
};

// ─── NAV ──────────────────────────────────────────────────────────────────────
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '0 40px', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: scrolled ? 'rgba(245,248,252,0.95)' : 'transparent', backdropFilter: scrolled ? 'blur(16px)' : 'none', borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent', transition: 'all 0.2s ease' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(0,116,255,0.5)' }}>
          <Icon name="shield" size={14} color="#fff" />
        </div>
        <Link href="/" style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.02em', color: 'var(--text)', textDecoration: 'none' }}>Axesntra</Link>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {[['Product', '#platform-tour'], ['AI Safety Advisor', '#ai-advisor'], ['Use Cases', '#use-cases'], ['Platform Tour', '#platform-tour'], ['Resources', '/resources']].map(([label, href]) => (
          <a key={label} href={href} style={{ color: 'var(--text-muted)', fontSize: 13, fontWeight: 400, padding: '6px 12px', borderRadius: 6, textDecoration: 'none', transition: 'color 0.15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}>{label}</a>
        ))}
      </div>
      <Link href="/early-access" className="lp-btn-primary" style={{ fontSize: 13, padding: '7px 16px' }}>Get Early Access</Link>
    </nav>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = () => {
  const [dark, setDark] = useState(false);
  const btnHandlers = {
    onMouseEnter: () => setDark(true),
    onMouseLeave: () => setDark(false),
  };
  const t = (light: string, darkVal: string) => dark ? darkVal : light;

  return (
    <section style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Background images — stacked, same crop, cross-fade on hover */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/hero-light.png" alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: dark ? 0 : 1, transition: 'opacity 0.8s ease', zIndex: 0 }} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/hero-dark.png" alt="" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', opacity: dark ? 1 : 0, transition: 'opacity 0.8s ease', zIndex: 0 }} />

      {/* Gradient scrim — left side for text legibility */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, background: dark ? 'linear-gradient(to right, rgba(4,6,12,0.72) 0%, rgba(4,6,12,0.45) 55%, transparent 100%)' : 'linear-gradient(to right, rgba(245,248,252,0.78) 0%, rgba(245,248,252,0.5) 55%, transparent 100%)', transition: 'background 0.8s ease' }} />

      <div className="lp-container" style={{ position: 'relative', zIndex: 2, paddingTop: 136, paddingBottom: 80, flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', minWidth: 0 }}>
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ fontSize: 'clamp(40px, 4.6vw, 64px)', fontWeight: 700, letterSpacing: '-0.035em', lineHeight: 1.04, marginBottom: 22, color: t('var(--text)', '#ffffff'), transition: 'color 0.8s ease' }}>
              DOT violations happen.<br />
              <span style={{ color: t('var(--blue)', '#60b0ff'), transition: 'color 0.8s ease' }}>Axesntra tells you exactly what to do next.</span>
            </h1>
            <p style={{ fontSize: 17, color: t('var(--text-muted)', 'rgba(200,215,240,0.85)'), marginBottom: 36, lineHeight: 1.65, maxWidth: 520, transition: 'color 0.8s ease' }}>
              Axesntra reads FMCSA, CSA, SAFER, inspection, violation, crash, and BASIC data — then explains what matters in plain English so safety teams can act faster.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/early-access" className="lp-btn-primary" style={{ fontSize: 15, padding: '13px 28px' }} {...btnHandlers}>
                Get Early Access <Icon name="arrow" size={14} color="white" />
              </Link>
              <Link href="/sample-report" className="lp-btn-secondary" style={{ fontSize: 15, padding: '13px 26px', borderColor: dark ? 'rgba(255,255,255,0.3)' : undefined, color: dark ? 'rgba(220,230,255,0.9)' : undefined, transition: 'all 0.3s ease' }} {...btnHandlers}>
                <Icon name="zap" size={14} color={dark ? 'rgba(220,230,255,0.7)' : 'var(--text-muted)'} /> View interactive demo
              </Link>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateRows: '1fr 1fr', gap: 18, height: 560, minWidth: 0, position: 'relative' }}>
            <div className="glow-card" style={{ minWidth: 0, minHeight: 0 }}><div><DashboardMock /></div></div>
            <div className="glow-card" style={{ minWidth: 0, minHeight: 0 }}><div><AIChatLoopDemo /></div></div>
          </div>
        </div>
        <div style={{ marginTop: 64, display: 'flex', gap: 0, borderTop: `1px solid ${dark ? 'rgba(255,255,255,0.15)' : 'var(--border)'}`, paddingTop: 28, transition: 'border-color 0.8s ease' }}>
          {[{ val: 'FMCSA', sub: 'Official data source' }, { val: 'CSA', sub: 'All 7 BASICs' }, { val: 'SAFER', sub: 'Authority & registration' }, { val: 'Real-time', sub: 'Inspection & violation data' }, { val: 'Plain English', sub: 'AI-generated answers' }].map((s, i) => (
            <div key={i} style={{ flex: 1, paddingRight: 24, borderRight: i < 4 ? `1px solid ${dark ? 'rgba(255,255,255,0.15)' : 'var(--border)'}` : 'none', paddingLeft: i > 0 ? 24 : 0, transition: 'border-color 0.8s ease' }}>
              <div style={{ fontFamily: 'var(--lp-mono)', fontSize: 13, fontWeight: 600, color: t('var(--blue)', '#60b0ff'), marginBottom: 3, transition: 'color 0.8s ease' }}>{s.val}</div>
              <div style={{ fontSize: 11.5, color: t('var(--text-dim)', 'rgba(180,200,230,0.7)'), transition: 'color 0.8s ease' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── LOGOS BAR ────────────────────────────────────────────────────────────────
const LogosBar = () => (
  <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '18px 0', background: 'var(--bg1)', overflow: 'hidden' }}>
    <div className="lp-container">
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <span style={{ fontFamily: 'var(--lp-mono)', fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', flexShrink: 0, paddingRight: 28, borderRight: '1px solid var(--border)' }}>Data Sources</span>
        <div style={{ display: 'flex', gap: 0, flex: 1, overflow: 'hidden' }}>
          {['FMCSA Portal', 'CSA BASICs', 'SAFER System', 'SMS Data', 'Inspection Records', 'Violation DB', 'Crash Data', 'Authority Filings', 'OOS Events'].map((src, i) => (
            <div key={i} style={{ flex: '0 0 auto', padding: '6px 22px', borderRight: '1px solid var(--border)', fontSize: 12, fontFamily: 'var(--lp-mono)', fontWeight: 500, color: 'var(--text-dim)', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>{src}</div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ─── PROBLEM SECTION ──────────────────────────────────────────────────────────
const ProblemSection = () => {
  const pains = ['Raw FMCSA data is hard to read quickly', 'Violation codes lack operational context', "BASIC percentiles don't explain root cause", 'Out-of-service events handled reactively', 'Safety teams spend hours creating reports manually', 'Brokers need faster carrier screening workflows', 'Underwriters need consistent carrier risk documentation', "Fleet owners don't know what to fix before violations escalate"];
  return (
    <section className="lp-section" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="lp-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
          <div>
            <span className="lp-section-label">The Problem</span>
            <h2 className="lp-section-title">DOT compliance data is fragmented, slow, and hard to interpret.</h2>
            <p className="lp-section-sub" style={{ marginBottom: 32 }}>Safety teams jump between FMCSA, SAFER, CSA, inspection records, violation codes, spreadsheets, and internal notes. The data exists — but acting on it takes too long.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {pains.map((p, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '16px 1fr', gap: 10, alignItems: 'start' }}>
                  <div style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--red-dim)', border: '1px solid oklch(58% 0.18 25 / 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 4 }}>
                    <div style={{ width: 5, height: 1.5, background: 'var(--red)', borderRadius: 1 }} />
                  </div>
                  <span style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.55 }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', aspectRatio: '4/3', position: 'relative' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80&auto=format&fit=crop" alt="Semi truck on highway" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.75) saturate(0.9)' }} />
              <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20, padding: '14px 16px', background: 'var(--bg2)', backdropFilter: 'blur(12px)', border: '1px solid var(--border)', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--blue)', animation: 'lp-pulse-dot 2s ease infinite' }} />
                  <span style={{ fontFamily: 'var(--lp-mono)', fontSize: 10, color: 'var(--blue)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Axesntra AI Safety Advisor</span>
                </div>
                <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic' }}>"Brake violations in last 3 inspections resulted in 2 OOS findings. Recommend immediate maintenance audit and pre-trip inspection review."</p>
                <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                  <span className="risk-badge risk-high" style={{ fontSize: 9 }}>Action required</span>
                  <span style={{ fontFamily: 'var(--lp-mono)', fontSize: 9, color: 'var(--text-dim)', padding: '3px 0', display: 'flex', alignItems: 'center' }}>Vehicle Maintenance · BASIC 84th pct</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── WORKFLOW SECTION ─────────────────────────────────────────────────────────
const WorkflowSection = () => {
  const steps = [
    { num: '01', icon: 'search', title: 'Connect or search', desc: 'Enter a USDOT number, carrier name, VIN, vehicle type, violation code, or inspection record.', detail: 'USDOT · Carrier Name · VIN · Violation Code' },
    { num: '02', icon: 'grid', title: 'Analyze', desc: 'Axesntra reviews FMCSA data, inspections, crashes, BASIC categories, OOS events, authority status, trends, and violation severity.', detail: 'FMCSA · CSA · SAFER · BASICs · OOS' },
    { num: '03', icon: 'zap', title: 'Act', desc: 'The AI Safety Advisor explains the issue, recommends corrective actions, and creates documentation for safety, operations, underwriting, or broker review.', detail: 'Explanations · Corrective Plans · Reports' },
  ];
  return (
    <section className="lp-section" style={{ background: 'var(--bg1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="lp-container">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="lp-section-label">How it works</span>
          <h2 className="lp-section-title">From raw FMCSA records to AI-generated safety intelligence.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 40px 1fr 40px 1fr', alignItems: 'stretch', gap: 0 }}>
          {steps.map((step, i) => (
            <>
              <div key={step.num} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, display: 'flex', flexDirection: 'column', gap: 14, position: 'relative', overflow: 'hidden', height: '100%' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: 'var(--blue)', opacity: 0.5 }} />
                <span style={{ fontFamily: 'var(--lp-mono)', fontSize: 11, color: 'var(--blue)', opacity: 0.7 }}>STEP {step.num}</span>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(0,116,255,0.12)', border: '1px solid rgba(0,116,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={step.icon} size={18} color="var(--blue)" />
                </div>
                <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--text)' }}>{step.title}</div>
                <p style={{ fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.6, flex: 1 }}>{step.desc}</p>
                <div style={{ padding: '6px 10px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6 }}>
                  <span style={{ fontFamily: 'var(--lp-mono)', fontSize: 10, color: 'var(--text-dim)' }}>{step.detail}</span>
                </div>
              </div>
              {i < 2 && (
                <div key={`arrow-${i}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 80 }}>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[...Array(3)].map((_, j) => <div key={j} style={{ width: 4, height: 4, borderRadius: '50%', background: `rgba(0,116,255,${0.3 + j * 0.25})` }} />)}
                  </div>
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── AI ADVISOR SECTION ───────────────────────────────────────────────────────
const AIAdvisorSection = () => {
  const sources = [
    { label: '3 Inspections', sub: 'Apr 14, Mar 28, Mar 09', icon: 'doc', color: 'var(--blue)' },
    { label: 'Violation Codes', sub: '392.9A · 393.45 · 393.75', icon: 'alert', color: 'var(--amber)' },
    { label: '2 OOS Events', sub: 'Brake system · Tire condition', icon: 'alert', color: 'var(--red)' },
    { label: 'BASIC Trend', sub: 'Vehicle Maint. +18% / 60d', icon: 'trend', color: 'var(--red)' },
    { label: 'Next Actions', sub: '4 recommended steps', icon: 'check', color: 'var(--green)' },
  ];
  return (
    <section id="ai-advisor" className="lp-section" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="lp-container">
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span className="lp-section-label">AI Safety Advisor</span>
          <h2 className="lp-section-title">Not a dashboard.<br />A DOT compliance advisor.</h2>
          <p className="lp-section-sub" style={{ margin: '0 auto' }}>Ask questions about carriers, drivers, vehicles, inspections, violations, and BASIC categories. Get plain-English answers with source-linked evidence and recommended actions.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, alignItems: 'start' }}>
          <div style={{ height: 560 }}><AIChatLoopDemo /></div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--lp-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 2 }}>Referenced Sources</div>
            {sources.map((s, i) => (
              <div key={i} style={{ padding: '12px 14px', background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 10, display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer', transition: 'border-color 0.15s' }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-bright)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}>
                <div style={{ width: 28, height: 28, borderRadius: 6, background: `${s.color}22`, border: `1px solid ${s.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name={s.icon} size={13} color={s.color} />
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{s.label}</div>
                  <div style={{ fontFamily: 'var(--lp-mono)', fontSize: 10, color: 'var(--text-dim)' }}>{s.sub}</div>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 4, padding: '12px 14px', background: 'rgba(0,116,255,0.07)', border: '1px solid rgba(0,116,255,0.2)', borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: 'var(--blue)', marginBottom: 4, fontWeight: 500 }}>Capabilities</div>
              {['Explain violations in plain English', 'Draft corrective action plans', 'Create leadership summaries', 'Document underwriting reviews', 'Generate broker screening notes'].map((cap, i) => (
                <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 5 }}>
                  <Icon name="check" size={10} color="var(--blue)" />
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{cap}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── USE CASES SECTION ────────────────────────────────────────────────────────
const UseCasesSection = () => {
  const cards = [
    { audience: 'Safety & DOT Managers', icon: 'shield', color: 'var(--blue)', illustration: 'safety', desc: 'Monitor DOT compliance, explain violations, identify risk trends, and create corrective action plans before issues repeat.', caps: ['BASIC category analysis', 'Violation explanations', 'OOS review', 'Corrective action plans', 'Safety summaries'] },
    { audience: 'Fleet Operators', icon: 'truck', color: 'var(--amber)', illustration: 'fleet', desc: 'Understand driver and vehicle requirements, monitor out-of-service exposure, and prioritize the highest-risk compliance issues.', caps: ['GVWR-based guidance', 'Driver requirements', 'HOS and ELD guidance', 'Maintenance risk alerts', 'Vehicle compliance'] },
    { audience: 'Freight Brokers', icon: 'eye', color: 'var(--green)', illustration: 'broker', desc: 'Screen carriers before onboarding, monitor safety deterioration, and document carrier risk decisions for every load.', caps: ['Carrier risk screening', 'Authority status checks', 'Watchlist monitoring', 'Risk summaries', 'AI review notes'] },
    { audience: 'Commercial Auto Underwriters', icon: 'doc', color: 'oklch(65% 0.15 290)', illustration: 'underwriter', desc: 'Review carrier risk faster, generate underwriting summaries, and monitor safety trends across a book of business.', caps: ['Carrier risk briefs', 'Crash & inspection trends', 'BASIC category movement', 'Risk scoring', 'Portfolio monitoring'] },
  ];
  const [active, setActive] = useState(0);
  return (
    <section id="use-cases" className="lp-section" style={{ background: 'var(--bg1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="lp-container">
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span className="lp-section-label">Use Cases</span>
          <h2 className="lp-section-title">Built for every team that touches DOT risk.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {cards.map((card, i) => (
            <div key={i} onClick={() => setActive(i)} style={{ background: active === i ? 'var(--bg)' : 'var(--bg2)', border: `1px solid ${active === i ? card.color + '55' : 'var(--border)'}`, borderRadius: 14, cursor: 'pointer', transition: 'all 0.2s', position: 'relative', overflow: 'hidden', boxShadow: active === i ? `0 0 24px ${card.color}18` : 'none' }}>
              {active === i && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: card.color, opacity: 0.7, zIndex: 1 }} />}
              <div style={{ position: 'relative', height: 140, overflow: 'hidden', background: 'var(--bg2)', filter: active === i ? 'none' : 'brightness(0.92) saturate(0.85)', transition: 'filter 0.3s' }}>
                <PersonaIllustration kind={card.illustration} color={card.color} />
                <div style={{ position: 'absolute', top: 10, left: 10 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, background: `${card.color}30`, border: `1px solid ${card.color}50`, backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={card.icon} size={13} color={card.color} />
                  </div>
                </div>
              </div>
              <div style={{ padding: '14px 18px 20px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 7, letterSpacing: '-0.01em' }}>For {card.audience}</div>
                <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 14 }}>{card.desc}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {card.caps.map((cap, j) => (
                    <div key={j} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <div style={{ width: 4, height: 4, borderRadius: '50%', background: card.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 11.5, color: 'var(--text-dim)' }}>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── FEATURE GRID ─────────────────────────────────────────────────────────────
const FeatureGrid = () => {
  const features = [
    { icon: 'grid', title: 'FMCSA / CSA / SAFER Intelligence', desc: 'Pull together public and connected DOT data into one operational view.' },
    { icon: 'shield', title: 'BASIC Category Analysis', desc: 'Understand risk across Unsafe Driving, HOS Compliance, Driver Fitness, Vehicle Maintenance, and more.' },
    { icon: 'doc', title: 'Inspection & Violation Review', desc: 'Analyze inspection history, violation codes, severity, recurrence, and patterns.' },
    { icon: 'alert', title: 'Out-of-Service Explanation', desc: 'Explain why a violation became OOS and what corrective action is needed.' },
    { icon: 'chat', title: 'AI Safety Advisor Chat', desc: 'Ask questions about DOT compliance, carriers, vehicles, drivers, and violations.' },
    { icon: 'trend', title: 'Carrier Risk Scoring', desc: 'Convert fragmented safety data into a clear risk score and trend.' },
    { icon: 'eye', title: 'Watchlist Monitoring', desc: 'Track carriers, fleets, and risk changes over time with automated alerts.' },
    { icon: 'check', title: 'Corrective Action Recommendations', desc: 'Generate practical steps to reduce risk and prevent repeat violations.' },
    { icon: 'user', title: 'Driver Compliance Guidance', desc: 'Understand driver qualification, CDL, medical card, HOS, and ELD requirements.' },
    { icon: 'truck', title: 'Vehicle Compliance Guidance', desc: 'Analyze GVWR, vehicle type, inspection requirements, and maintenance exposure.' },
    { icon: 'search', title: 'GVWR-Based Requirement Analysis', desc: 'Determine what driver and vehicle compliance requirements apply based on weight.' },
    { icon: 'doc', title: 'Exportable Reports and Memos', desc: 'Create leadership summaries, safety briefs, broker notes, and underwriting summaries.' },
  ];
  return (
    <section className="lp-section" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="lp-container">
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span className="lp-section-label">Platform Capabilities</span>
          <h2 className="lp-section-title">Everything needed to understand DOT risk faster.</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border)', borderRadius: 14, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {features.map((f, i) => (
            <div key={i} style={{ padding: '22px 22px', background: 'var(--bg)', transition: 'background 0.15s', cursor: 'default' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg2)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'var(--bg)')}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,116,255,0.1)', border: '1px solid rgba(0,116,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Icon name={f.icon} size={14} color="var(--blue)" />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 6, letterSpacing: '-0.01em', lineHeight: 1.3 }}>{f.title}</div>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.55 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── PHOTO CALLOUT ────────────────────────────────────────────────────────────
const PhotoCallout = () => (
  <section style={{ position: 'relative', height: 440, overflow: 'hidden' }}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=1600&q=80&auto=format&fit=crop" alt="Commercial truck fleet" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(0.32) saturate(0.7)' }} />
    <div style={{ position: 'absolute', inset: 0, background: 'var(--bg)', opacity: 0.5 }} />
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center' }}>
      <div className="lp-container">
        <div style={{ maxWidth: 560 }}>
          <span className="lp-section-label">The difference</span>
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 46px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.12, color: 'var(--text)', marginBottom: 16 }}>From raw inspection records<br />to plain-English action plans.</h2>
          <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 28 }}>Safety teams shouldn&apos;t need a data science degree to understand their DOT exposure. Axesntra closes the gap between government data and operational decisions.</p>
          <a href="#platform-tour" className="lp-btn-primary" style={{ fontSize: 14 }}>See how it works <Icon name="arrow" size={13} color="white" /></a>
        </div>
      </div>
    </div>
  </section>
);

// ─── PRODUCT TOUR ─────────────────────────────────────────────────────────────
const ProductTour = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [{ label: '01 Search' }, { label: '02 Risk Overview' }, { label: '03 AI Advisor' }, { label: '04 Action Plan' }];

  const SearchScreen = () => (
    <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>Search by any identifier</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'var(--bg)', border: '1px solid rgba(0,116,255,0.4)', borderRadius: 8 }}>
            <Icon name="search" size={14} color="var(--blue)" />
            <span style={{ fontFamily: 'var(--lp-mono)', fontSize: 13, color: 'var(--text-muted)' }}>1234567</span>
            <span style={{ fontFamily: 'var(--lp-mono)', fontSize: 13, color: 'var(--text-dim)' }}>USDOT Number</span>
            <span style={{ marginLeft: 'auto', width: 8, height: 16, background: 'var(--blue)', animation: 'lp-blink 1s step-start infinite', borderRadius: 1 }} />
          </div>
          <Link href="/carrier/search" className="lp-btn-primary">Search</Link>
        </div>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {['USDOT Number', 'Carrier Name', 'VIN', 'Vehicle Type', 'Violation Code', 'Inspection ID'].map((t) => (
          <div key={t} style={{ padding: '5px 12px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6, fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--lp-mono)', cursor: 'pointer' }}>{t}</div>
        ))}
      </div>
      <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)', fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--lp-mono)' }}>Recent searches</div>
        {['USDOT 1234567 — Acme Transport LLC', 'USDOT 7654321 — Blue Ridge Freight', 'VIN 1HGCM82633A004352'].map((item, i) => (
          <div key={i} style={{ padding: '9px 16px', borderBottom: i < 2 ? '1px solid var(--border)' : 'none', fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <Icon name="search" size={11} color="var(--text-dim)" />{item}
          </div>
        ))}
      </div>
    </div>
  );

  const RiskScreen = () => (
    <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
        <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--lp-mono)', marginBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Carrier Risk Score</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ position: 'relative', width: 60, height: 60, flexShrink: 0 }}>
            <svg width="60" height="60" viewBox="0 0 60 60">
              <circle cx="30" cy="30" r="23" fill="none" stroke="var(--bg3)" strokeWidth="4" />
              <circle cx="30" cy="30" r="23" fill="none" stroke="var(--red)" strokeWidth="4" strokeDasharray={`${0.72 * 144.5} 144.5`} strokeDashoffset="36" strokeLinecap="round" transform="rotate(-90 30 30)" />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'var(--lp-mono)', fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>72</span>
            </div>
          </div>
          <div><span className="risk-badge risk-high" style={{ display: 'block', marginBottom: 4 }}>Elevated Risk</span><div style={{ fontFamily: 'var(--lp-mono)', fontSize: 10, color: 'var(--red)' }}>↑ Worsening trend</div></div>
        </div>
      </div>
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 16 }}>
        <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--lp-mono)', marginBottom: 10, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Authority Status</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[['Broker Authority', 'Active'], ['Motor Carrier', 'Active'], ['Freight Forwarder', 'None']].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{k}</span>
              <span className={`risk-badge ${v === 'Active' ? 'risk-low' : ''}`} style={{ fontSize: 9, padding: '1px 6px', ...(v === 'None' ? { background: 'var(--bg3)', color: 'var(--text-dim)', border: '1px solid var(--border)' } : {}) }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 10, padding: 16, gridColumn: '1 / -1' }}>
        <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--lp-mono)', marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>BASIC Category Flags</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[{ label: 'Vehicle Maintenance', pct: 84, color: 'var(--red)' }, { label: 'Crash Indicator', pct: 72, color: 'var(--red)' }, { label: 'Unsafe Driving', pct: 61, color: 'var(--amber)' }, { label: 'HOS Compliance', pct: 47, color: 'var(--amber)' }, { label: 'Driver Fitness', pct: 38, color: 'var(--green)' }, { label: 'Controlled Substances', pct: 12, color: 'var(--green)' }].map((b) => (
            <div key={b.label} style={{ padding: '8px 10px', background: 'var(--bg2)', borderRadius: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{b.label}</span>
                <span style={{ fontFamily: 'var(--lp-mono)', fontSize: 10, color: b.color }}>{b.pct}%</span>
              </div>
              <div className="basic-bar-track"><div className="basic-bar-fill" style={{ width: `${b.pct}%`, background: b.color }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const AIScreen = () => (
    <div style={{ padding: 20, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1 }}><AIChatMock /></div>
    </div>
  );

  const ActionScreen = () => (
    <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>AI-Generated Corrective Action Plan</div>
      <div style={{ fontFamily: 'var(--lp-mono)', fontSize: 10, color: 'var(--text-dim)' }}>USDOT 1234567 · Generated Apr 28, 2026</div>
      {[
        { priority: 'Immediate', icon: 'alert', color: 'var(--red)', task: 'Perform targeted maintenance audit across all units with recent brake and tire violations', assignee: 'Fleet Maintenance', due: '48 hrs' },
        { priority: 'High', icon: 'check', color: 'var(--amber)', task: 'Review and reinforce pre-trip inspection completion for all active drivers', assignee: 'Safety Manager', due: '7 days' },
        { priority: 'High', icon: 'user', color: 'var(--amber)', task: 'Schedule driver coaching sessions — focus on vehicle inspection documentation', assignee: 'Driver Management', due: '14 days' },
        { priority: 'Ongoing', icon: 'eye', color: 'var(--blue)', task: 'Monitor follow-up inspections for Vehicle Maintenance BASIC trend over 30 days', assignee: 'Safety Team', due: '30 days' },
      ].map((item, i) => (
        <div key={i} style={{ padding: '12px 14px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: `${item.color}18`, border: `1px solid ${item.color}35`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon name={item.icon} size={13} color={item.color} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
              <span style={{ fontSize: 10, fontFamily: 'var(--lp-mono)', color: item.color }}>{item.priority}</span>
              <span style={{ fontSize: 12.5, color: 'var(--text)', fontWeight: 500 }}>{item.task}</span>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <span style={{ fontSize: 10.5, color: 'var(--text-dim)' }}>Assign → {item.assignee}</span>
              <span style={{ fontSize: 10.5, color: 'var(--text-dim)' }}>Due: {item.due}</span>
            </div>
          </div>
        </div>
      ))}
      <button className="lp-btn-primary" style={{ alignSelf: 'flex-start', marginTop: 4 }}>
        <Icon name="doc" size={13} color="white" /> Export summary
      </button>
    </div>
  );

  const screens = [SearchScreen, RiskScreen, AIScreen, ActionScreen];
  const ScreenComponent = screens[activeTab];

  return (
    <section id="platform-tour" className="lp-section" style={{ background: 'var(--bg1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="lp-container">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="lp-section-label">Platform Tour</span>
          <h2 className="lp-section-title">Take a tour of the Axesntra platform.</h2>
          <p className="lp-section-sub" style={{ margin: '0 auto' }}>From carrier search to risk analysis to an AI-generated action plan.</p>
        </div>
        <div style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', background: 'var(--bg2)', display: 'flex', gap: 6 }}>
            {tabs.map((tab, i) => (
              <button key={i} onClick={() => setActiveTab(i)} className={`tab-btn${activeTab === i ? ' active' : ''}`} style={{ fontFamily: 'var(--lp-mono)', fontSize: 11 }}>{tab.label}</button>
            ))}
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'lp-pulse-dot 2s ease infinite' }} />
              <span style={{ fontFamily: 'var(--lp-mono)', fontSize: 10, color: 'var(--text-dim)' }}>Live demo data</span>
            </div>
          </div>
          <div style={{ minHeight: 400 }}><ScreenComponent /></div>
        </div>
      </div>
    </section>
  );
};

// ─── MONITORING SECTION ───────────────────────────────────────────────────────
const MonitoringSection = () => {
  const alerts = [
    { color: 'var(--red)', title: 'Vehicle Maintenance crossed risk threshold', detail: 'Risk increased 18% over the last 60 days', time: '2h ago', resp: 'Vehicle Maintenance risk increased 18% over the last 60 days. Recent brake, tire, and lighting violations in 3 inspections indicate a systemic pattern. Review maintenance logs, audit pre-trip inspection completion, and assign corrective actions by vehicle unit.' },
    { color: 'var(--amber)', title: 'New inspection with brake and tire violations', detail: 'USDOT 1234567 · Level I · Apr 28', time: '5h ago', resp: 'New Level I inspection identified brake and tire violations. Both items carry elevated OOS risk if unresolved. Recommend immediate review of the affected vehicle and verification of repair completion before the next dispatch.' },
    { color: 'var(--amber)', title: 'Driver Fitness issue detected', detail: 'Medical card expiration approaching · 2 drivers', time: '1d ago', resp: 'Driver Fitness issues can affect BASIC percentile scores if not resolved before inspection. Prioritize medical card renewals for the 2 flagged drivers to maintain compliance and reduce CSA exposure.' },
    { color: 'var(--red)', title: 'Carrier risk score increased', detail: 'Blue Ridge Freight · Score moved to 78', time: '2d ago', resp: "Blue Ridge Freight's risk score of 78 places them in elevated risk territory. Primary driver is Vehicle Maintenance at 81st percentile. Recommend heightened monitoring and updated carrier review documentation before next load assignment." },
    { color: 'var(--blue)', title: 'Authority status change detected', detail: 'Common carrier authority reinstated', time: '3d ago', resp: 'Authority reinstatement confirms the carrier is eligible to operate under their common carrier authority. Update internal carrier records and confirm insurance verification is current before reactivating in your network.' },
  ];
  const [activeAlert, setActiveAlert] = useState(0);
  return (
    <section className="lp-section" style={{ borderBottom: '1px solid var(--border)' }}>
      <div className="lp-container">
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <span className="lp-section-label">Continuous Monitoring</span>
          <h2 className="lp-section-title">Your AI watches your fleet and carrier network.</h2>
          <p className="lp-section-sub" style={{ margin: '0 auto' }}>Axesntra monitors changes in safety performance, new inspections, OOS events, BASIC category movement, crash indicators, and authority status. It alerts when something needs review.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--lp-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Alert Feed</div>
            <div style={{ background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
              {alerts.map((alert, i) => (
                <div key={i} onClick={() => setActiveAlert(i)} style={{ padding: '12px 16px', borderBottom: i < alerts.length - 1 ? '1px solid var(--border)' : 'none', background: activeAlert === i ? 'var(--bg2)' : 'transparent', cursor: 'pointer', transition: 'background 0.15s', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: alert.color, flexShrink: 0, marginTop: 5 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text)', marginBottom: 2 }}>{alert.title}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{alert.detail}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--lp-mono)', fontSize: 10, color: 'var(--text-dim)', flexShrink: 0 }}>{alert.time}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--lp-mono)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>AI Recommendation</div>
            <div style={{ background: 'var(--bg1)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, display: 'flex', flexDirection: 'column', gap: 14, flex: 1 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon name="shield" size={15} color="white" /></div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>AI Safety Advisor</div>
                  <div style={{ fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--lp-mono)' }}>Responding to: {alerts[activeAlert].title.substring(0, 32)}...</div>
                </div>
              </div>
              <div style={{ padding: '14px 16px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10 }}>
                <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.65 }}>{alerts[activeAlert].resp}</div>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {['View full analysis', 'Assign action items', 'Set follow-up alert', 'Export memo'].map((a, i) => (
                  <button key={i} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 11px', fontSize: 11, color: 'var(--blue)', cursor: 'pointer', fontFamily: 'var(--lp-font)', transition: 'all 0.15s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,116,255,0.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--bg2)'; }}>{a}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── TRUST SECTION ────────────────────────────────────────────────────────────
const TrustSection = () => {
  const points = [
    { icon: 'shield', title: 'Built around DOT and FMCSA workflows', desc: 'Designed for the specific data structures and decision flows safety professionals actually use.' },
    { icon: 'check', title: 'Converts raw data into plain-English explanations', desc: 'No data science expertise required. Ask a question and get a clear, actionable answer.' },
    { icon: 'doc', title: 'Helps document why decisions were made', desc: 'Create a consistent paper trail for carrier approvals, rejections, and risk reviews.' },
    { icon: 'star', title: 'Supports consistent carrier and fleet review', desc: 'Standardize how your team evaluates compliance risk across the entire carrier network.' },
    { icon: 'user', title: 'Designed for safety and compliance teams', desc: 'Not a generic AI tool. Built specifically for DOT, FMCSA, and transportation safety work.' },
    { icon: 'zap', title: 'Focused on operational action', desc: 'Every answer comes with a recommended next step. Axesntra is built to help you act, not just analyze.' },
  ];
  return (
    <section className="lp-section" style={{ background: 'var(--bg1)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
      <div className="lp-container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', marginBottom: 64 }}>
          <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', aspectRatio: '16/10' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&q=80&auto=format&fit=crop" alt="Fleet operations center" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)' }} />
            <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {['Carrier screening', 'Risk documentation', 'Corrective actions', 'Safety reporting'].map((t, i) => (
                  <span key={i} style={{ padding: '4px 10px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--lp-mono)' }}>{t}</span>
                ))}
              </div>
            </div>
          </div>
          <div>
            <span className="lp-section-label">Design Principles</span>
            <h2 className="lp-section-title">Designed for faster, more consistent DOT decisions.</h2>
            <p className="lp-section-sub">Axesntra gives teams better context, faster analysis, and clearer documentation. It doesn&apos;t replace safety professionals — it makes them more effective.</p>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {points.map((p, i) => (
            <div key={i} style={{ padding: '20px 22px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,116,255,0.1)', border: '1px solid rgba(0,116,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                <Icon name={p.icon} size={14} color="var(--blue)" />
              </div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text)', marginBottom: 6, letterSpacing: '-0.01em' }}>{p.title}</div>
              <p style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.6 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── FINAL CTA ────────────────────────────────────────────────────────────────
const LandingFinalCTA = () => (
  <section className="lp-section" style={{ position: 'relative', overflow: 'hidden' }}>
    <div className="lp-container" style={{ textAlign: 'center', position: 'relative' }}>
      <span className="lp-section-label" style={{ justifyContent: 'center', display: 'flex' }}>Get started</span>
      <h2 style={{ fontSize: 'clamp(30px, 4vw, 52px)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.12, marginBottom: 16, maxWidth: 700, margin: '0 auto 16px' }}>
        Ask better DOT questions.<br />
        <span style={{ color: 'var(--blue-bright)' }}>Get clearer safety answers.</span>
      </h2>
      <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.7 }}>
        Bring your USDOT number, fleet profile, vehicle data, or carrier list. Axesntra will show how AI can analyze DOT risk, explain violations, identify compliance gaps, and recommend the next best action.
      </p>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <Link href="/early-access" className="lp-btn-primary" style={{ fontSize: 14, padding: '12px 28px' }}>
          Get Early Access <Icon name="arrow" size={14} color="white" />
        </Link>
        <a href="#platform-tour" className="lp-btn-secondary" style={{ fontSize: 14, padding: '12px 24px' }}>
          <Icon name="zap" size={14} color="var(--text-muted)" /> Take the product tour
        </a>
      </div>
    </div>
  </section>
);

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const LandingFooter = () => (
  <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 0 32px' }}>
    <div className="lp-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="shield" size={14} color="#fff" />
          </div>
          <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.02em' }}>Axesntra</span>
        </div>
        <div style={{ display: 'flex', gap: 24 }}>
          {[['Product', '#platform-tour'], ['AI Safety Advisor', '#ai-advisor'], ['Use Cases', '#use-cases'], ['Resources', '/resources'], ['Pricing', '/pricing'], ['Privacy', '/early-access']].map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize: 12.5, color: 'var(--text-dim)', textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-dim)')}>{label}</a>
          ))}
        </div>
      </div>
      <div style={{ height: 1, background: 'var(--border)', marginBottom: 20 }} />
      <p style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.7, maxWidth: 720 }}>
        Axesntra is for compliance intelligence, monitoring, screening, and decision-support purposes only. It is not an official FMCSA safety rating and does not replace legal, regulatory, or professional compliance advice.
      </p>
      <div style={{ marginTop: 12, fontSize: 11, color: 'var(--text-dim)', fontFamily: 'var(--lp-mono)' }}>© 2026 Axesntra · All rights reserved</div>
    </div>
  </footer>
);

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
export function LandingPage() {
  return (
    <div className="landing-page">
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Nav />
        <main>
          <Hero />
          <LogosBar />
          <ProblemSection />
          <WorkflowSection />
          <AIAdvisorSection />
          <UseCasesSection />
          <FeatureGrid />
          <PhotoCallout />
          <ProductTour />
          <MonitoringSection />
          <TrustSection />
          <LandingFinalCTA />
        </main>
        <LandingFooter />
      </div>
    </div>
  );
}
