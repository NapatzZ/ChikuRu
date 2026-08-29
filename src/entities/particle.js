import { JUICE } from '../config.js';
import { Pool } from '../util/pool.js';
import { rand, TAU } from '../util/math.js';

/** Pooled decorative particles. Purely cosmetic — no gameplay reads these. */
export function createParticlePool() {
  return new Pool(JUICE.particlePoolSize, () => ({
    x: 0, y: 0, vx: 0, vy: 0,
    life: 0, ttl: 1, size: 3, drag: 2, gravity: 0,
    color: '#fff', alive: false
  }));
}

/**
 * Radial burst of particles from a point.
 * `spec` is one of the JUICE.*Burst blocks; `color` overrides per call.
 */
export function emitBurst(pool, x, y, spec, color) {
  for (let i = 0; i < spec.count; i++) {
    const p = pool.acquire();
    if (!p) return; // pool full — drop the rest, it's only visual
    const a = rand(0, TAU);
    const speed = spec.speed * rand(0.35, 1);
    p.x = x;
    p.y = y;
    p.vx = Math.cos(a) * speed;
    p.vy = Math.sin(a) * speed;
    p.ttl = p.life = spec.life * rand(0.7, 1.1);
    p.size = spec.size * rand(0.7, 1.2);
    p.drag = spec.drag;
    p.gravity = spec.gravity;
    p.color = color || '#ffe08a';
  }
}

export function updateParticles(pool, dt) {
  pool.forEachActive((p) => {
    const damp = Math.max(0, 1 - p.drag * dt);
    p.vx *= damp;
    p.vy = p.vy * damp + p.gravity * dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life -= dt;
    if (p.life <= 0) pool.release(p);
  });
}

export function renderParticles(pool, ctx) {
  pool.forEachActive((p) => {
    ctx.globalAlpha = Math.max(0, p.life / p.ttl);
    ctx.fillStyle = p.color;
    ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
  });
  ctx.globalAlpha = 1;
}
