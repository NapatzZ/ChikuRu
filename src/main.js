import { createViewport } from './core/viewport.js';
import { createLoop } from './core/loop.js';
import { Game } from './game.js';

const mount = document.getElementById('app');
const fallback = document.getElementById('boot-fallback');
if (fallback) fallback.remove();

const viewport = createViewport(mount);
const game = new Game(viewport);

const loop = createLoop({
  update: (dt) => game.update(dt),
  render: (alpha) => game.render(alpha, loop.stats)
});

// Pause the clock while the tab is hidden so we don't fast-forward on return.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) loop.stop();
  else loop.start();
});

loop.start();

if (game.debug) window.__chikuru = { game, loop, viewport };
