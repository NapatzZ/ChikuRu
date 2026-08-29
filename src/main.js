import { createViewport } from './core/viewport.js';
import { createLoop } from './core/loop.js';
import { loadSprites } from './assetLoader.js';
import { createAudio } from './audio.js';
import { Game } from './game.js';

const mount = document.getElementById('app');
const fallback = document.getElementById('boot-fallback');

const viewport = createViewport(mount);
const audio = createAudio();

// Kick sprite loading off immediately; the game renders fine without them.
const spritesPromise = loadSprites();

const game = new Game(viewport, { audio });
spritesPromise.then((sprites) => {
  game.sprites = sprites;
});

const loop = createLoop({
  update: (dt) => game.update(dt),
  render: (alpha) => game.render(alpha, loop.stats)
});

// Audio contexts must be resumed from a user gesture.
function unlockAudio() {
  audio.resume();
}
window.addEventListener('pointerdown', unlockAudio, { once: true });
window.addEventListener('keydown', unlockAudio, { once: true });

document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    game.pauseForBlur();
    loop.stop();
  } else {
    loop.start();
  }
});
window.addEventListener('blur', () => game.pauseForBlur());

if (fallback) fallback.remove();
viewport.canvas.focus();
loop.start();

if (game.debug) window.__chikuru = { game, loop, viewport, audio };
