/**
 * Headless smoke test. Stubs just enough of the DOM / Web Audio API to run the
 * real game loop for ~30 simulated seconds and assert nothing throws and the
 * core state stays sane. Not a substitute for playtesting — it catches
 * "undefined is not a function" regressions before they reach a browser.
 *
 *   node test/smoke.mjs
 */
const noop = () => {};

function fakeCtx() {
  return new Proxy(
    {},
    {
      get: (_t, p) => {
        if (p === 'createLinearGradient') return () => ({ addColorStop: noop });
        if (p === 'measureText') return () => ({ width: 10 });
        if (p === 'canvas') return { width: 720, height: 960 };
        return noop;
      },
      set: () => true
    }
  );
}

globalThis.window = {
  innerWidth: 1200,
  innerHeight: 900,
  devicePixelRatio: 2,
  location: { search: '' },
  addEventListener: noop,
  matchMedia: () => ({ matches: false }),
  AudioContext: function () {
    return {
      state: 'suspended',
      currentTime: 0,
      destination: {},
      createGain: () => ({
        gain: {
          value: 0,
          setValueAtTime: noop,
          linearRampToValueAtTime: noop,
          exponentialRampToValueAtTime: noop
        },
        connect: (x) => x
      }),
      createOscillator: () => ({
        type: '',
        frequency: { setValueAtTime: noop, exponentialRampToValueAtTime: noop },
        connect: (x) => x,
        start: noop,
        stop: noop
      }),
      resume: noop
    };
  }
};
globalThis.document = {
  hidden: false,
  getElementById: () => ({ appendChild: noop, remove: noop, textContent: '' }),
  createElement: () => ({
    id: '',
    style: {},
    width: 0,
    height: 0,
    getContext: fakeCtx,
    getBoundingClientRect: () => ({ left: 0, top: 0 }),
    addEventListener: noop
  }),
  addEventListener: noop
};
globalThis.performance = { now: () => Date.now() };
const _store = new Map();
globalThis.localStorage = {
  getItem: (k) => (_store.has(k) ? _store.get(k) : null),
  setItem: (k, v) => _store.set(k, String(v)),
  removeItem: (k) => _store.delete(k)
};
globalThis.Image = function () {
  setTimeout(() => this.onerror && this.onerror(), 0);
};
globalThis.requestAnimationFrame = noop;
globalThis.cancelAnimationFrame = noop;

const { createViewport } = await import('../src/core/viewport.js');
const { Game } = await import('../src/game.js');
const { createAudio } = await import('../src/audio.js');

function assert(cond, msg) {
  if (!cond) {
    console.error('FAIL:', msg);
    process.exit(1);
  }
}

const viewport = createViewport(document.getElementById('app'));
const game = new Game(viewport, { audio: createAudio() });

assert(game.state === 'menu', `should boot into the menu, got ${game.state}`);
game.restart(); // leave the title screen

// Keep the headless player alive so the wave curve gets exercised.
game.player.hit = () => false;

const dt = 1 / 120;
for (let i = 0; i < 120 * 30; i++) {
  game.update(dt);
  if (i % 30 === 0) game.render(0, { fps: 60, updates: 2 });
}

assert(game.wave >= 2, `wave should advance past 1 in 30s, got ${game.wave}`);
assert(game.enemies.activeCount >= 0, 'enemy count went negative');
assert(game.state === 'playing', `expected still playing, got ${game.state}`);

// Score path
const before = game.scoreboard.state.score;
game.bus.emit('enemyKilled', { type: 'chiikawa', points: 100, x: 50, y: 50 });
assert(game.scoreboard.state.score === before + 100, 'score did not increase on kill');

// Combo path: enough kills should push the multiplier above x1
for (let i = 0; i < 12; i++) {
  game.bus.emit('enemyKilled', { type: 'chiikawa', points: 100, x: 50, y: 50 });
}
assert(game.combo.multiplier > 1, `combo multiplier stuck at x${game.combo.multiplier}`);

// Game-over + persistence path
game.player.hit = () => true;
game.player.hearts = 0;
game.bus.emit('playerHit', { x: 50, y: 50 });
assert(game.state === 'gameover', 'did not enter game over at 0 hearts');
assert(game.isNewBest, 'first run should be a new best');

const reboot = new Game(viewport, { audio: createAudio() });
assert(reboot.best === game.best, `best score did not persist (${reboot.best} vs ${game.best})`);

console.log(
  `PASS  wave=${game.wave}  score=${game.scoreboard.state.score}  ` +
    `mult=x${game.combo.multiplier}  best=${reboot.best}`
);
