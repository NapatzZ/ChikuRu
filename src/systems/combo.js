import { COMBO } from '../config.js';

/**
 * Combo meter. Kills without taking a hit raise a multiplier (x1..x5). The
 * meter fully resets if `decaySeconds` pass with no kill, or immediately on a
 * player hit.
 *
 * `attach(bus)` is called *after* the scoreboard subscribes, so a kill is
 * scored at the multiplier that was active *before* it, then the multiplier
 * ticks up.
 */
export function createCombo() {
  let kills = 0;
  let timer = 0;
  let multiplier = 1;

  function recompute() {
    let m = 1;
    for (let i = 0; i < COMBO.thresholds.length; i++) {
      if (kills >= COMBO.thresholds[i]) m = i + 1;
    }
    multiplier = Math.min(m, COMBO.max);
  }

  function drop() {
    kills = 0;
    timer = 0;
    multiplier = 1;
  }

  return {
    get multiplier() {
      return multiplier;
    },
    /** 0..1 remaining on the decay timer, for the HUD bar. */
    get fill() {
      return COMBO.decaySeconds > 0 ? Math.max(0, timer / COMBO.decaySeconds) : 0;
    },
    reset: drop,
    attach(bus) {
      bus.on('enemyKilled', () => {
        kills++;
        timer = COMBO.decaySeconds;
        recompute();
      });
      bus.on('playerHit', drop);
    },
    update(dt) {
      if (timer > 0) {
        timer -= dt;
        if (timer <= 0) drop();
      }
    }
  };
}
