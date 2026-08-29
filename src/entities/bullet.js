import { ARENA, BULLET } from '../config.js';
import { Pool } from '../util/pool.js';
import { TAU } from '../util/math.js';

/**
 * Player bullets. Pooled — `createBulletPool()` pre-allocates, and the game
 * acquires/releases rather than `new`-ing per shot.
 */
export function createBulletPool() {
  return new Pool(BULLET.poolSize, () => ({
    x: 0, y: 0, vx: 0, vy: 0, life: 0, alive: false
  }));
}

export function fireBullet(pool, muzzle) {
  const b = pool.acquire();
  if (!b) return; // pool full — silently drop, cadence makes this rare
  b.x = muzzle.x;
  b.y = muzzle.y;
  b.vx = Math.cos(muzzle.angle) * BULLET.speed;
  b.vy = Math.sin(muzzle.angle) * BULLET.speed;
  b.life = BULLET.lifeSeconds;
}

export function updateBullets(pool, dt) {
  pool.forEachActive((b) => {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;
    const off =
      b.life <= 0 ||
      b.x < -20 || b.x > ARENA.width + 20 ||
      b.y < -20 || b.y > ARENA.height + 20;
    if (off) pool.release(b);
  });
}

export function renderBullets(pool, ctx) {
  ctx.fillStyle = '#ffe08a';
  pool.forEachActive((b) => {
    ctx.beginPath();
    ctx.arc(b.x, b.y, BULLET.radius, 0, TAU);
    ctx.fill();
  });
}
