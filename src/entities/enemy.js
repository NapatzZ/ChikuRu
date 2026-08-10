import { ARENA, ENEMIES, ENEMY_POOL_SIZE } from '../config.js';
import { Pool } from '../util/pool.js';
import { normalize, clamp, TAU } from '../util/math.js';

/**
 * Enemies are pooled structs. Movement is chosen by `def.behaviour` so adding
 * an archetype is a config entry plus (maybe) one function here.
 */
export function createEnemyPool() {
  return new Pool(ENEMY_POOL_SIZE, () => ({
    type: 'chiikawa',
    x: 0, y: 0, vx: 0, vy: 0,
    radius: 20, hp: 1, maxHp: 1, points: 100,
    phase: 0, dashTimer: 0,
    alive: false
  }));
}

export function spawnEnemy(pool, type, x, y) {
  const def = ENEMIES[type];
  if (!def) throw new Error(`unknown enemy type: ${type}`);
  const e = pool.acquire();
  if (!e) return null;
  e.type = type;
  e.x = x;
  e.y = y;
  e.vx = 0;
  e.vy = def.speed;
  e.radius = def.radius;
  e.hp = def.hp;
  e.maxHp = def.hp;
  e.points = def.points;
  e.phase = Math.random() * TAU;
  e.dashTimer = 0;
  return e;
}

const BEHAVIOURS = {
  // Drifts down while steering slowly toward the player.
  homing(e, def, dt, target, speedMul) {
    const speed = def.speed * speedMul;
    const want = normalize(target.x - e.x, target.y - e.y);
    const cur = normalize(e.vx, e.vy || 1);
    const blend = clamp(def.turnRate * dt, 0, 1);
    const nx = cur.x + (want.x - cur.x) * blend;
    const ny = cur.y + (want.y - cur.y) * blend;
    const dir = normalize(nx, ny);
    e.vx = dir.x * speed;
    e.vy = dir.y * speed;
  },

  // Straight descent with a sine-wave sideways wobble.
  weave(e, def, dt, _target, speedMul) {
    e.phase += dt * (def.weaveFreq || 2.4);
    e.vx = Math.cos(e.phase) * (def.weaveAmp || 90);
    e.vy = def.speed * speedMul;
  },

  // Mostly drifts, then dashes toward the player in bursts.
  dasher(e, def, dt, target, speedMul) {
    e.dashTimer -= dt;
    if (e.dashTimer <= 0) {
      const dir = normalize(target.x - e.x, target.y - e.y);
      const burst = (def.dashSpeed || 320) * speedMul;
      e.vx = dir.x * burst;
      e.vy = dir.y * burst;
      e.dashTimer = def.dashEvery || 1.1;
    } else {
      // decay back toward a slow fall
      e.vx *= 0.94;
      e.vy += (def.speed * speedMul - e.vy) * 0.06;
    }
  },

  // Slow, unwavering descent. Tanky.
  drift(e, def, _dt, _target, speedMul) {
    e.vx = 0;
    e.vy = def.speed * speedMul;
  }
};

export function updateEnemies(pool, dt, target, speedMul) {
  pool.forEachActive((e) => {
    const def = ENEMIES[e.type];
    (BEHAVIOURS[def.behaviour] || BEHAVIOURS.drift)(e, def, dt, target, speedMul);
    e.x += e.vx * dt;
    e.y += e.vy * dt;
    // keep horizontally on-screen; let them fall off the bottom naturally
    e.x = clamp(e.x, e.radius, ARENA.width - e.radius);
  });
}

export function renderEnemies(pool, ctx, sprites) {
  pool.forEachActive((e) => {
    const def = ENEMIES[e.type];
    const sprite = sprites && sprites.get && sprites.get(e.type);
    ctx.save();
    ctx.translate(e.x, e.y);
    if (sprite) {
      const s = e.radius * 2.4;
      ctx.drawImage(sprite, -s / 2, -s / 2, s, s);
    } else {
      drawBlob(ctx, e.radius, def.color);
    }
    if (e.maxHp > 1) drawHpPips(ctx, e);
    ctx.restore();
  });
}

function drawBlob(ctx, radius, color) {
  ctx.fillStyle = color;
  ctx.strokeStyle = 'rgba(0,0,0,0.35)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, TAU);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#2a2118';
  ctx.beginPath();
  ctx.arc(-radius * 0.32, -radius * 0.1, radius * 0.12, 0, TAU);
  ctx.arc(radius * 0.32, -radius * 0.1, radius * 0.12, 0, TAU);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,138,138,0.5)';
  ctx.beginPath();
  ctx.arc(-radius * 0.5, radius * 0.22, radius * 0.16, 0, TAU);
  ctx.arc(radius * 0.5, radius * 0.22, radius * 0.16, 0, TAU);
  ctx.fill();
}

function drawHpPips(ctx, e) {
  const w = e.radius * 1.6;
  const x0 = -w / 2;
  const y = -e.radius - 10;
  for (let i = 0; i < e.maxHp; i++) {
    ctx.fillStyle = i < e.hp ? '#8affc1' : 'rgba(255,255,255,0.2)';
    ctx.fillRect(x0 + (w / e.maxHp) * i + 1, y, w / e.maxHp - 2, 4);
  }
}
