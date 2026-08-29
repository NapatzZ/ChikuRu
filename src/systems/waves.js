import { SPAWN, WAVES, ENEMY_TYPES } from '../config.js';
import { clamp, lerp, weightedIndex } from '../util/math.js';

/**
 * Owns the run's difficulty over time. `game.js` reads `wave` / `speedMul` and
 * hands `interval` + `pickType` to the spawner.
 *
 *   const director = createWaveDirector();
 *   director.update(dt);          // advances elapsed time / wave index
 *   director.speedMul;            // feed to updateEnemies
 *   director.interval;            // seconds between spawns right now
 *   director.pickType();          // weighted enemy type for the current wave
 *   director.consumeBanner();     // 'WAVE 3' once, when the wave just changed
 */
export function createWaveDirector() {
  const state = {
    elapsed: 0,
    wave: 1,
    speedMul: 1,
    interval: SPAWN.baseInterval,
    weights: WAVES.weightsStart.slice(),
    _banner: 0
  };

  function recompute() {
    const w = state.wave;
    state.interval = Math.max(
      SPAWN.minInterval,
      SPAWN.baseInterval * Math.pow(WAVES.intervalFalloff, w - 1)
    );
    state.speedMul = clamp(1 + WAVES.speedPerWave * (w - 1), 1, WAVES.speedMax);

    const t = clamp((w - 1) / WAVES.weightsRampWaves, 0, 1);
    state.weights = WAVES.weightsStart.map((s, i) => lerp(s, WAVES.weightsEnd[i], t));
  }

  recompute();

  return {
    state,
    get wave() { return state.wave; },
    get speedMul() { return state.speedMul; },
    get interval() { return state.interval; },

    reset() {
      state.elapsed = 0;
      state.wave = 1;
      state._banner = 0;
      recompute();
    },

    update(dt) {
      state.elapsed += dt;
      const target = 1 + Math.floor(state.elapsed / WAVES.secondsPerWave);
      if (target !== state.wave) {
        state.wave = target;
        state._banner = WAVES.bannerSeconds;
        recompute();
      } else if (state._banner > 0) {
        state._banner -= dt;
      }
    },

    pickType() {
      return ENEMY_TYPES[weightedIndex(state.weights)];
    },

    /** Returns a banner string while one is active, else null. */
    banner() {
      return state._banner > 0 ? `WAVE ${state.wave}` : null;
    }
  };
}
