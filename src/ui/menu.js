import { ARENA } from '../config.js';

/** Title screen. Pure draw function; `game.js` handles the Start input. */

export const CONTROLS = [
  ['Move', 'WASD / Arrows'],
  ['Aim', 'Mouse'],
  ['Shoot', 'Hold Space / Click'],
  ['Pause', 'P'],
  ['Mute', 'M']
];

export function drawMenu(ctx, { best }) {
  ctx.fillStyle = 'rgba(12,10,24,0.55)';
  ctx.fillRect(0, 0, ARENA.width, ARENA.height);

  const cx = ARENA.width / 2;
  ctx.textAlign = 'center';

  ctx.fillStyle = '#fdf6ff';
  ctx.font = '800 64px system-ui, sans-serif';
  ctx.fillText('ChikuRu', cx, ARENA.height * 0.26);

  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = '18px system-ui, sans-serif';
  ctx.fillText('Shoot the blobs. Don’t let them touch you.', cx, ARENA.height * 0.26 + 42);

  ctx.textAlign = 'left';
  ctx.font = '16px system-ui, sans-serif';
  let y = ARENA.height * 0.44;
  for (const [label, keys] of CONTROLS) {
    ctx.fillStyle = 'rgba(255,255,255,0.55)';
    ctx.fillText(label, cx - 120, y);
    ctx.fillStyle = '#fdf6ff';
    ctx.fillText(keys, cx - 10, y);
    y += 28;
  }

  if (best > 0) {
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffd36e';
    ctx.font = '600 18px system-ui, sans-serif';
    ctx.fillText(`Best  ${String(best).padStart(6, '0')}`, cx, y + 24);
  }

  ctx.textAlign = 'center';
  ctx.fillStyle = '#fdf6ff';
  ctx.font = '700 22px system-ui, sans-serif';
  ctx.fillText('Press Enter to start', cx, ARENA.height * 0.8);
}
