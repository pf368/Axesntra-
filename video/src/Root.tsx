import { Composition } from 'remotion';
import { AxesntraPromo } from './AxesntraPromo';

export function Root() {
  return (
    <Composition
      id="AxesntraPromo"
      component={AxesntraPromo}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  );
}
