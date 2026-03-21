/**
 * AxesntraPromo — 1920×1080, 30 fps, 300 frames (10 seconds)
 *
 * Scene 1 :  frames   0–110  — Live carrier feed / terminal + stat cards
 * Scene 2 :  frames  90–230  — Risk brief card builds itself
 * Scene 3 :  frames 220–300  — Logo reveal with line-draw + glow
 *
 * Scenes overlap by ~10–20 frames; each handles its own fade in/out.
 */
import { AbsoluteFill, Sequence } from 'remotion';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';
import { Scene3 } from './scenes/Scene3';

export function AxesntraPromo() {
  return (
    <AbsoluteFill style={{ background: '#0f172a', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Scene 1: frames 0–110 */}
      <Sequence from={0} durationInFrames={110}>
        <Scene1 />
      </Sequence>

      {/* Scene 2: frames 90–230 (local duration 140) */}
      <Sequence from={90} durationInFrames={140}>
        <Scene2 />
      </Sequence>

      {/* Scene 3: frames 220–300 (local duration 80) */}
      <Sequence from={220} durationInFrames={80}>
        <Scene3 />
      </Sequence>
    </AbsoluteFill>
  );
}
