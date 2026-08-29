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
  speed: 360,          // px/s
  startHearts: 3,
  invulnSeconds: 1.2,  // i-frames after taking a hit
  fireRate: 7,         // shots/s
  spawnY: 0.82         // fraction of arena height
});

export const BULLET = Object.freeze({
  speed: 780,          // px/s
  radius: 6,
  lifeSeconds: 1.8,
  poolSize: 256
});
