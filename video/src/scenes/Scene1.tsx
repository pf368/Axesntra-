/**
 * Scene 1: Live Carrier Feed (global frames 0–110, local 0–110)
 *
 * Left half  — scrolling terminal showing FMCSA data rows being fetched
 * Right half — three stat cards staggering in from the right
 */
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const TERMINAL_LINES = [
  'Fetching USDOT 491180 …',
  '> carrier_name   : ACME Transport LLC',
  '> operation_type : Interstate',
  '> power_units    : 42',
  '> drivers        : 38',
  '> inspections    : 127',
  '> oos_vehicles   : 14  (11.02%)',
  '> crashes_12mo   : 3',
  '> hazmat_permit  : false',
  'Scoring risk vectors …',
  '> maintenance    : 32 / 100',
  '> driver_safety  : 48 / 100',
  '> crash_risk     : 61 / 100',
  '> hazmat         : 0  / 100',
  '> trend          : WORSENING',
  'Generating brief …  done ✓',
];

const STATS = [
  { value: '600,000+', label: 'Active USDOT carriers tracked' },
  { value: '5',        label: 'Risk categories scored per carrier' },
  { value: 'Daily',   label: 'Updates via FMCSA SMS feed' },
];

function Terminal({ frame }: { frame: number }) {
  const visibleCount = Math.floor(interpolate(frame, [0, 90], [0, TERMINAL_LINES.length], { extrapolateRight: 'clamp' }));

  return (
    <div
      style={{
        background: '#0d1117',
        border: '1px solid rgba(148,163,184,0.12)',
        borderRadius: 16,
        padding: '32px 36px',
        fontFamily: '"Fira Code", "Cascadia Code", monospace',
        fontSize: 20,
        lineHeight: 1.75,
        color: '#e2e8f0',
        height: '100%',
        overflow: 'hidden',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
      }}
    >
      {/* Menu bar dots */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
          <div key={c} style={{ width: 14, height: 14, borderRadius: '50%', background: c }} />
        ))}
        <span style={{ marginLeft: 'auto', color: '#64748b', fontSize: 16 }}>
          axesntra — fmcsa-fetch
        </span>
      </div>

      {/* Terminal lines */}
      {TERMINAL_LINES.slice(0, visibleCount).map((line, i) => {
        const isComment = line.startsWith('>');
        return (
          <div
            key={i}
            style={{
              color: isComment ? '#94a3b8' : '#7dd3fc',
              opacity: 1,
              display: 'flex',
              alignItems: 'baseline',
              gap: 8,
            }}
          >
            {!isComment && (
              <span style={{ color: '#22c55e', userSelect: 'none' }}>$</span>
            )}
            <span>{line}</span>
            {/* Blinking cursor on the last visible line */}
            {i === visibleCount - 1 && (
              <span
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 22,
                  background: '#7dd3fc',
                  marginLeft: 2,
                  opacity: Math.floor(frame / 8) % 2 === 0 ? 1 : 0,
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function StatCard({
  stat,
  delay,
  frame,
  fps,
}: {
  stat: (typeof STATS)[number];
  delay: number;
  frame: number;
  fps: number;
}) {
  const progress = spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 80 } });
  const translateX = interpolate(progress, [0, 1], [120, 0]);
  const opacity = interpolate(progress, [0, 0.3], [0, 1]);

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(148,163,184,0.12)',
        borderRadius: 16,
        padding: '32px 36px',
        transform: `translateX(${translateX}px)`,
        opacity,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}
    >
      <p
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1,
          letterSpacing: '-0.03em',
          margin: 0,
        }}
      >
        {stat.value}
      </p>
      <p
        style={{
          fontSize: 20,
          color: '#94a3b8',
          marginTop: 10,
          fontWeight: 400,
        }}
      >
        {stat.label}
      </p>
    </div>
  );
}

export function Scene1() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const overallOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [90, 110], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        opacity: overallOpacity * fadeOut,
        padding: '80px 100px',
        display: 'flex',
        flexDirection: 'row',
        gap: 60,
        alignItems: 'center',
      }}
    >
      {/* Subtle grid overlay */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}
        aria-hidden
      >
        <defs>
          <pattern id="g1" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#94a3b8" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g1)" />
      </svg>

      {/* Left: terminal */}
      <div style={{ flex: 1.1, height: '100%', minWidth: 0 }}>
        <Terminal frame={frame} />
      </div>

      {/* Right: stat cards */}
      <div style={{ flex: 0.9, display: 'flex', flexDirection: 'column', gap: 28, justifyContent: 'center' }}>
        {/* Label */}
        <p
          style={{
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#3b82f6',
            opacity: interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' }),
          }}
        >
          Carrier Intelligence Platform
        </p>

        {STATS.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} delay={10 + i * 14} frame={frame} fps={fps} />
        ))}
      </div>
    </AbsoluteFill>
  );
}
