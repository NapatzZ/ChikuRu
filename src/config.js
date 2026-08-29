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
 * `entities/enemy.js`. Extra fields are read by that behaviour only.
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
  },
  hachiware: {
    behaviour: 'weave',
    radius: 19,
    speed: 120,
    hp: 1,
    points: 150,
    weaveAmp: 96,      // px/s sideways
    weaveFreq: 2.6,    // rad/s
    color: '#bfe6f2'
  },
  usagi: {
    behaviour: 'dasher',
    radius: 17,
    speed: 70,         // slow drift between dashes
    hp: 1,
    points: 200,
    dashSpeed: 340,
    dashEvery: 1.0,    // seconds between bursts
    color: '#ffd8a8'
  },
  rakko: {
    behaviour: 'drift',
    radius: 30,
    speed: 58,
    hp: 3,
    points: 300,
    color: '#c9b8a8'
  }
});

/** Order used for interim random spawning until the wave director (#11). */
export const ENEMY_TYPES = Object.freeze(['chiikawa', 'hachiware', 'usagi', 'rakko']);

export const ENEMY_POOL_SIZE = 128;

/** Sprite names the asset loader tries to fetch (#14). */
export const SPRITE_NAMES = Object.freeze(['player', 'chiikawa', 'hachiware', 'usagi', 'rakko']);

export const AUDIO = Object.freeze({
  masterGain: 0.35,
  storageKey: 'chikuru:muted',
  // name -> { type, freq, freqEnd, duration, gain }
  cues: {
    shoot: { type: 'square', freq: 660, freqEnd: 520, duration: 0.06, gain: 0.25 },
    hit: { type: 'triangle', freq: 320, freqEnd: 140, duration: 0.12, gain: 0.5 },
    playerHit: { type: 'sawtooth', freq: 180, freqEnd: 60, duration: 0.3, gain: 0.7 },
    wave: { type: 'sine', freq: 440, freqEnd: 880, duration: 0.25, gain: 0.4 },
    gameover: { type: 'sawtooth', freq: 300, freqEnd: 70, duration: 0.7, gain: 0.6 }
  }
});

export const JUICE = Object.freeze({
  particlePoolSize: 400,
  killBurst: { count: 14, speed: 220, size: 4, life: 0.55, drag: 2.6, gravity: 260 },
  hitBurst: { count: 18, speed: 180, size: 5, life: 0.7, drag: 2.0, gravity: 40 },
  shakeOnHit: { magnitude: 14, seconds: 0.35 },
  hitStopSeconds: 0.08 // frozen sim time on a player hit
});

export const COMBO = Object.freeze({
  // Combo multiplier is stubbed at x1 in Sprint 2; full logic lands in #16.
  decaySeconds: 2.5,
  thresholds: [0, 4, 9, 16, 25], // kills needed for x1..x5
  max: 5
});

export const SPAWN = Object.freeze({
  startDelay: 1.5,     // grace period at the start of a run
  baseInterval: 1.5,   // seconds between spawns at wave 1
  minInterval: 0.38,   // floor once difficulty has ramped
  marginX: 40          // keep spawns away from the very edge
});

/**
 * Difficulty curve. The wave director advances one wave every
 * `secondsPerWave`, shortens the spawn interval geometrically, raises the
 * enemy speed multiplier linearly (capped), and lerps the spawn-type weights
 * from `weightsStart` toward `weightsEnd` over `weightsRampWaves`.
 */
export const WAVES = Object.freeze({
  secondsPerWave: 20,
  intervalFalloff: 0.86,   // interval *= this each wave
  speedPerWave: 0.07,      // +7% enemy speed per wave
  speedMax: 2.2,
  bannerSeconds: 1.6,
  weightsStart: [8, 3, 1, 0],   // chiikawa, hachiware, usagi, rakko
  weightsEnd: [3, 5, 4, 3],
  weightsRampWaves: 8
});
