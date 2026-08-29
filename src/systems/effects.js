import { rand } from '../util/math.js';
import { prefersReducedMotion } from '../util/env.js';

/**
 * Camera shake + hit-stop. Both are no-ops when the user prefers reduced
 * motion. `step(dt)` is called once per frame and returns the simulation dt to
 * actually use (0 during hit-stop) plus the camera offset to translate by.
 */
export function createEffects() {
  const reduced = prefersReducedMotion();
  let shakeT = 0;
  let shakeDur = 1;
  let shakeMag = 0;
  let stopT = 0;

  return {
    shake(magnitude, seconds) {
      if (reduced) return;
      shakeMag = Math.max(shakeMag, magnitude);
      shakeT = Math.max(shakeT, seconds);
      shakeDur = Math.max(shakeDur, seconds);
    },
    hitStop(seconds) {
      if (reduced) return;
      stopT = Math.max(stopT, seconds);
    },
    reset() {
      shakeT = stopT = 0;
      shakeMag = 0;
    },
    step(dt) {
      let simDt = dt;
      if (stopT > 0) {
        stopT -= dt;
        simDt = 0;
      }

      let ox = 0;
      let oy = 0;
      if (shakeT > 0) {
        shakeT -= dt;
        const k = Math.max(0, shakeT / shakeDur); // 1 -> 0
        const amp = shakeMag * k * k;
        ox = rand(-amp, amp);
        oy = rand(-amp, amp);
        if (shakeT <= 0) shakeMag = 0;
      }
      return { simDt, ox, oy };
    }
  };
}
