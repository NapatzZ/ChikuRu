import { ARENA, SPAWN } from '../config.js';
import { rand } from '../util/math.js';
import { spawnEnemy } from '../entities/enemy.js';

/**
 * Timer-driven spawner. It does not decide difficulty — it asks a provider for
 * the current interval and enemy type each time it fires. In Sprint 2 that
 * provider is a constant; the wave director replaces it in Sprint 3.
 */
export function createSpawner(pool, { getInterval, pickType }) {
  let timer = SPAWN.startDelay;

  return {
    reset() {
      timer = SPAWN.startDelay;
    },
    update(dt, context) {
      timer -= dt;
      if (timer > 0) return;
      timer += getInterval(context);
      const type = pickType(context);
      const x = rand(SPAWN.marginX, ARENA.width - SPAWN.marginX);
      spawnEnemy(pool, type, x, -30);
    }
  };
}
