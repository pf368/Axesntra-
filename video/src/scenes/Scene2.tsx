/**
 * Scene 2: Risk Brief Builder (global frames 90–230, local 0–140)
 *
 * A carrier risk card builds itself on screen:
 *   0–20   : card slides up + fades in
 *   20–50  : header section appears
 *   40–70  : risk badge + trend badge pop in
 *   60–100 : three "At-a-Glance" row cards slide in staggered
 *   90–130 : AI Safety Advisor bar slides up from bottom
 *   130–140: subtle pulse glow on the card
 */
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

function useSpring(frame: number, delay: number, fps: number, config = { damping: 14, stiffness: 80 }) {
  return spring({ frame: Math.max(0, frame - delay), fps, config });
}

const AT_A_GLANCE = [
  { label: 'Top Driver of Risk',       value: 'Vehicle Maintenance Deficiencies' },
  { label: 'Leading Score Contributor', value: 'Maintenance · 32%' },
  { label: 'Recommended Action',        value: 'Weekly maintenance gate audit' },
];

function Badge({
  bg,
  border,
  dot,
  text,
}: {
  bg: string;
  border: string;
  dot: string;
  text: string;
}) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: 999,
        padding: '8px 16px',
        fontSize: 18,
        fontWeight: 700,
        color: dot,
      }}
    >
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot, flexShrink: 0 }} />
      {text}
    </span>
  );
}

export function Scene2() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Card entrance
  const cardProgress = useSpring(frame, 0, fps, { damping: 18, stiffness: 90 });
  const cardY = interpolate(cardProgress, [0, 1], [80, 0]);
  const cardOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  // Header
  const headerOpacity = interpolate(frame, [18, 36], [0, 1], { extrapolateRight: 'clamp' });

  // Risk badge
  const badgeProgress = useSpring(frame, 36, fps);
  const badgeScale = interpolate(badgeProgress, [0, 1], [0.6, 1]);
  const badgeOpacity = badgeProgress;

  // Trend badge
  const trendProgress = useSpring(frame, 44, fps);
  const trendScale = interpolate(trendProgress, [0, 1], [0.6, 1]);

  // At-a-glance rows
  const rowDelays = [60, 74, 88];

  // AI bar
  const aiProgress = useSpring(frame, 110, fps, { damping: 16, stiffness: 100 });
  const aiY = interpolate(aiProgress, [0, 1], [40, 0]);
  const aiOpacity = aiProgress;

  // Outer glow pulse (frames 130+)
  const glowIntensity = frame > 130
    ? 0.15 + 0.1 * Math.sin(((frame - 130) / 30) * Math.PI * 2)
    : 0;

  // Fade out
  const fadeOut = interpolate(frame, [125, 140], [1, 0], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut,
      }}
    >
      {/* Subtle grid */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }} aria-hidden>
        <defs>
          <pattern id="g2" width="48" height="48" patternUnits="userSpaceOnUse">
            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#94a3b8" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#g2)" />
      </svg>

      {/* Outer glow */}
      <div
        style={{
          position: 'absolute',
          width: 760,
          height: 700,
          borderRadius: 32,
          background: `radial-gradient(ellipse, rgba(59,130,246,${glowIntensity}), transparent 70%)`,
          filter: 'blur(40px)',
        }}
      />

      {/* Card */}
      <div
        style={{
          width: 680,
          background: '#ffffff',
          borderRadius: 24,
          overflow: 'hidden',
          transform: `translateY(${cardY}px)`,
          opacity: cardOpacity,
          boxShadow: `0 40px 120px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)`,
        }}
      >
        {/* Dark header */}
        <div
          style={{
            background: '#0f172a',
            padding: '28px 36px',
            borderBottom: '1px solid rgba(148,163,184,0.15)',
            opacity: headerOpacity,
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#64748b',
              marginBottom: 8,
            }}
          >
            Carrier Risk Brief
          </p>
          <h3 style={{ fontSize: 28, fontWeight: 700, color: '#ffffff', margin: 0, lineHeight: 1.2 }}>
            ACME Transport LLC
          </h3>
          <p style={{ fontSize: 15, color: '#64748b', marginTop: 4 }}>USDOT 491180 | MC 123456</p>
        </div>

        {/* Two-column body */}
        <div style={{ display: 'flex', gap: 0 }}>
          {/* Left: badges */}
          <div style={{ flex: 1, padding: '28px 28px 28px 36px', borderRight: '1px solid #f1f5f9' }}>
            {/* Risk Assessment */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 10 }}>
                Risk Assessment
              </p>
              <div style={{ transform: `scale(${badgeScale})`, transformOrigin: 'left center', opacity: badgeOpacity }}>
                <Badge bg="#fef3c7" border="#fde68a" dot="#d97706" text="Elevated" />
              </div>
            </div>

            {/* 12-Month Trend */}
            <div style={{ marginBottom: 24 }}>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 10 }}>
                12-Month Trend
              </p>
              <div style={{ transform: `scale(${trendScale})`, transformOrigin: 'left center', opacity: trendProgress }}>
                <Badge bg="#fef2f2" border="#fecaca" dot="#ef4444" text="↗ Worsening" />
              </div>
            </div>

            {/* Confidence */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 8 }}>
                Confidence
              </p>
              <p style={{ fontSize: 18, fontWeight: 700, color: '#0f172a' }}>Moderate</p>
            </div>
          </div>

          {/* Right: At-a-Glance */}
          <div style={{ flex: 1, padding: '28px 36px 28px 28px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 16 }}>
              At-a-Glance
            </p>

            {AT_A_GLANCE.map((item, i) => {
              const rowProg = useSpring(frame, rowDelays[i], fps);
              const rowX = interpolate(rowProg, [0, 1], [40, 0]);
              return (
                <div
                  key={item.label}
                  style={{
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    borderLeft: '4px solid #f97316',
                    padding: '12px 16px',
                    marginBottom: 12,
                    transform: `translateX(${rowX}px)`,
                    opacity: rowProg,
                    background: 'linear-gradient(to right, rgba(249,115,22,0.06), transparent 40%)',
                  }}
                >
                  <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#94a3b8', marginBottom: 4 }}>
                    {item.label}
                  </p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Safety Advisor bar */}
        <div
          style={{
            background: '#0f172a',
            padding: '18px 36px',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            transform: `translateY(${aiY}px)`,
            opacity: aiOpacity,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              background: 'rgba(20,184,166,0.2)',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {/* Sparkles icon (inline SVG) */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2dd4bf" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.582a.5.5 0 0 1 0 .962L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2dd4bf' }}>
              AI Safety Advisor
            </p>
            <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 2 }}>Risk Analysis &amp; Recommendations</p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}
