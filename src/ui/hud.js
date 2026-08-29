import { ARENA } from '../config.js';
import { clamp } from '../util/math.js';

/**
 * Heads-up display. Draws on top of the world every frame in arena
 * coordinates. It owns its own transient state (floating "+N" popups, a hit
 * flash) and subscribes to the bus so `game.js` doesn't have to feed it.
 */
export function createHud(bus) {
  /** @type {{x:number,y:number,text:string,life:number,ttl:number,kind:string}[]} */
  const floaters = [];
  let hitFlash = 0;

  bus.on('enemyKilled', ({ points, x, y }) => {
    floaters.push({ x, y, text: `+${points}`, life: 0.9, ttl: 0.9, kind: 'score' });
  });
  bus.on('playerHit', () => {
    hitFlash = 0.35;
  });

  function reset() {
    floaters.length = 0;
    hitFlash = 0;
  }

  function update(dt) {
    for (let i = floaters.length - 1; i >= 0; i--) {
      floaters[i].life -= dt;
      floaters[i].y -= 28 * dt;
      if (floaters[i].life <= 0) floaters.splice(i, 1);
    }
    if (hitFlash > 0) hitFlash -= dt;
  }

  function render(ctx, model) {
    const { score, hearts, maxHearts, wave, multiplier, comboFill } = model;

    if (hitFlash > 0) {
      ctx.fillStyle = `rgba(255,80,110,${clamp(hitFlash, 0, 0.35) * 0.9})`;
      ctx.fillRect(0, 0, ARENA.width, ARENA.height);
    }

    ctx.textBaseline = 'alphabetic';

    // score, top-left
    ctx.fillStyle = '#fdf6ff';
    ctx.font = '700 26px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(String(score).padStart(6, '0'), 16, 34);

    // multiplier under the score
    if (multiplier > 1) {
      ctx.fillStyle = '#ffd36e';
      ctx.font = '700 16px system-ui, sans-serif';
      ctx.fillText(`x${multiplier}`, 16, 54);
      ctx.fillStyle = 'rgba(255,211,110,0.25)';
      ctx.fillRect(16, 60, 60, 4);
      ctx.fillStyle = '#ffd36e';
      ctx.fillRect(16, 60, 60 * clamp(comboFill ?? 0, 0, 1), 4);
    }

    // hearts, top-right
    ctx.textAlign = 'right';
    ctx.font = '22px system-ui, sans-serif';
    let hx = ARENA.width - 16;
    for (let i = 0; i < maxHearts; i++) {
      ctx.fillStyle = i < hearts ? '#ff5c8a' : 'rgba(255,255,255,0.18)';
      ctx.fillText('♥', hx, 34);
      hx -= 26;
    }

    // wave / time, top-centre
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '600 15px system-ui, sans-serif';
    ctx.fillText(wave ? `WAVE ${wave}` : '', ARENA.width / 2, 30);

    // floating popups
    ctx.font = '700 18px system-ui, sans-serif';
    for (const f of floaters) {
      const a = clamp(f.life / f.ttl, 0, 1);
      ctx.fillStyle = f.kind === 'score' ? `rgba(255,238,170,${a})` : `rgba(255,120,150,${a})`;
      ctx.textAlign = 'center';
      ctx.fillText(f.text, f.x, f.y);
    }
  }

  return { reset, update, render, addFloater: (f) => floaters.push(f) };
}
