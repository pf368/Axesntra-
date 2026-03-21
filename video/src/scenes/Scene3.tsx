/**
 * Scene 3: Logo Reveal (global frames 220–300, local 0–80)
 *
 *  0–30  : SVG shield outline draws itself (stroke-dashoffset animation)
 *  20–50 : "Axesntra" wordmark fades + slides up
 *  40–65 : tagline fades in
 *  55–80 : blue glow pulses outward and fades (loop: ~0.7 Hz)
 */
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// Approximate perimeter of the shield path so we can animate stroke-dashoffset
const SHIELD_PERIMETER = 260;

export function Scene3() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // --- Line draw (0–35) ---
  const drawProgress = interpolate(frame, [0, 35], [0, 1], { extrapolateRight: 'clamp' });
  const dashOffset = interpolate(drawProgress, [0, 1], [SHIELD_PERIMETER, 0]);

  // --- Shield fill fade (20–45) ---
  const fillOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: 'clamp' });

  // --- Wordmark (25–55) ---
  const wordProgress = spring({ frame: Math.max(0, frame - 25), fps, config: { damping: 18, stiffness: 90 } });
  const wordY = interpolate(wordProgress, [0, 1], [20, 0]);
  const wordOpacity = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: 'clamp' });

  // --- Tagline (45–65) ---
  const tagOpacity = interpolate(frame, [45, 65], [0, 1], { extrapolateRight: 'clamp' });

  // --- Glow pulse (55–80) ---
  const glowBase = frame >= 55 ? 1 : 0;
  const glowPulse = glowBase * (0.5 + 0.5 * Math.sin(((frame - 55) / 25) * Math.PI * 2));
  const glowRadius = interpolate(glowPulse, [0, 1], [200, 320]);
  const glowOpacity = interpolate(glowPulse, [0, 1], [0.08, 0.22]);

  return (
    <AbsoluteFill
      style={{
        background: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0,
      }}
    >
      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          width: glowRadius * 2,
          height: glowRadius * 2,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(59,130,246,${glowOpacity}), transparent 70%)`,
          filter: 'blur(32px)',
        }}
      />

      {/* Shield icon */}
      <svg
        width="120"
        height="120"
        viewBox="0 0 24 24"
        fill="none"
        style={{ marginBottom: 32 }}
      >
        {/* Fill layer */}
        <path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          fill="rgba(59,130,246,0.18)"
          style={{ opacity: fillOpacity }}
        />
        {/* Stroke draw layer */}
        <path
          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
          stroke="#3b82f6"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            strokeDasharray: SHIELD_PERIMETER,
            strokeDashoffset: dashOffset,
          }}
        />
        {/* Inner check mark — fades in with fill */}
        <path
          d="M9 12l2 2 4-4"
          stroke="#60a5fa"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: fillOpacity }}
        />
      </svg>

      {/* Wordmark */}
      <h1
        style={{
          fontSize: 96,
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-0.04em',
          lineHeight: 1,
          margin: 0,
          transform: `translateY(${wordY}px)`,
          opacity: wordOpacity,
        }}
      >
        Axesntra
      </h1>

      {/* Tagline */}
      <p
        style={{
          fontSize: 26,
          fontWeight: 400,
          color: '#94a3b8',
          marginTop: 20,
          letterSpacing: '0.01em',
          opacity: tagOpacity,
        }}
      >
        Carrier intelligence for teams that move risk.
      </p>
    </AbsoluteFill>
  );
}
