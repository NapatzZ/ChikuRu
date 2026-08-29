import { ARENA } from '../config.js';

/**
 * Overlays for the paused and game-over states. Pure draw functions. The title
 * screen lives in `menu.js`; `game.js` owns all state transitions.
 */

function dim(ctx, alpha) {
  ctx.fillStyle = `rgba(12,10,24,${alpha})`;
  ctx.fillRect(0, 0, ARENA.width, ARENA.height);
}

function centerText(ctx, text, y, font, color = '#fdf6ff') {
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.fillText(text, ARENA.width / 2, y);
}

export function drawPause(ctx) {
  dim(ctx, 0.6);
  centerText(ctx, 'Paused', ARENA.height / 2 - 10, '700 44px system-ui, sans-serif');
  centerText(
    ctx,
    'Press P to resume',
    ARENA.height / 2 + 30,
    '18px system-ui, sans-serif',
    'rgba(255,255,255,0.75)'
  );
}

export function drawGameOver(ctx, { score, best, isNewBest }) {
  dim(ctx, 0.74);
  centerText(ctx, 'Game Over', ARENA.height / 2 - 48, '800 52px system-ui, sans-serif');
  centerText(
    ctx,
    `Score  ${String(score).padStart(6, '0')}`,
    ARENA.height / 2 + 4,
    '600 22px system-ui, sans-serif'
  );
  centerText(
    ctx,
    isNewBest ? 'New best!' : `Best  ${String(best).padStart(6, '0')}`,
    ARENA.height / 2 + 34,
    '600 18px system-ui, sans-serif',
    '#ffd36e'
  );
  centerText(
    ctx,
    'Press Enter to play again',
    ARENA.height / 2 + 78,
    '700 20px system-ui, sans-serif'
  );
}
