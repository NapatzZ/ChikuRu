// Single source of truth for tunable numbers. Systems import from here so the
// balance pass in each sprint is a one-file diff.

/** Logical play area in CSS pixels. Everything is drawn in these coordinates. */
export const ARENA = Object.freeze({ width: 720, height: 960 });

export const LOOP = Object.freeze({
  // 120 Hz simulation regardless of display refresh rate.
  fixedDt: 1 / 120,
  // Never step more than this much wall-clock time in one frame (tab-switch guard).
  maxFrameTime: 0.25
});

export const PLAYER = Object.freeze({
  radius: 22,
  speed: 340,          // px/s — 360 felt twitchy in playtest
  startHearts: 3,
  invulnSeconds: 1.2,  // i-frames after taking a hit
  fireRate: 8,         // shots/s
  spawnY: 0.82         // fraction of arena height
});

export const BULLET = Object.freeze({
  speed: 780,          // px/s
  radius: 6,
  lifeSeconds: 1.8,
  poolSize: 256
});

/**
 * Enemy archetypes. `behaviour` picks the movement function in
 * `entities/enemy.js`. More types land in Sprint 3.
 */
export const ENEMIES = Object.freeze({
  chiikawa: {
    behaviour: 'homing',
    radius: 20,
    speed: 82,         // px/s, before the wave multiplier
    hp: 1,
    points: 100,
    turnRate: 1.4,     // rad/s toward the player
    color: '#f6ead0'
  }
});

export const ENEMY_POOL_SIZE = 128;

export const SPAWN = Object.freeze({
  startDelay: 1.5,     // grace period at the start of a run
  baseInterval: 1.5,   // seconds between spawns at wave 1
  minInterval: 0.38,   // floor once difficulty has ramped
  marginX: 40          // keep spawns away from the very edge
});
