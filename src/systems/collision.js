import { dist2 } from '../util/math.js';

/**
 * All gameplay collisions are circle vs circle. These helpers mutate the pools
 * and emit events; they never touch score or HUD directly.
 *
 * Events:
 *   enemyKilled  { type, points, x, y }
 *   enemyHit     { x, y }                 — damaged but still alive
 *   playerHit    { x, y }                 — a hit that got through i-frames
 */
export function resolveBulletsVsEnemies(bullets, enemies, bus) {
  bullets.forEachActive((b) => {
    enemies.forEachActive((e) => {
      if (!b.alive) return; // bullet already consumed this frame
      const r = b.radius + e.radius;
      if (dist2(b.x, b.y, e.x, e.y) > r * r) return;

      bullets.release(b);
      e.hp -= 1;
      if (e.hp <= 0) {
        bus.emit('enemyKilled', { type: e.type, points: e.points, x: e.x, y: e.y });
        enemies.release(e);
      } else {
        bus.emit('enemyHit', { x: e.x, y: e.y });
      }
    });
  });
}

export function resolveEnemiesVsPlayer(enemies, player, bus) {
  enemies.forEachActive((e) => {
    const r = e.radius + player.radius;
    if (dist2(e.x, e.y, player.x, player.y) > r * r) return;

    // The enemy is spent on contact regardless of i-frames, so it can't sit
    // on the player and drain hearts once the invuln window opens.
    const landed = player.hit();
    enemies.release(e);
    if (landed) bus.emit('playerHit', { x: player.x, y: player.y });
  });
}
