import { ARENA } from './config.js';

/**
 * Orchestrator. Holds the world and delegates behaviour to entities/systems.
 * Keep this file thin: wiring and state transitions only.
 */
export class Game {
  constructor(viewport) {
    this.viewport = viewport;
    this.ctx = viewport.ctx;
    this.state = 'playing'; // menu | playing | paused | gameover  (grows in Sprint 4)
    this.time = 0;
    this.debug = new URLSearchParams(window.location.search).has('debug');
  }

  update(dt) {
    if (this.state !== 'playing') return;
    this.time += dt;
  }

  render(_alpha, stats) {
    const { ctx } = this;
    this.viewport.beginFrame();
    this.#drawBackdrop(ctx);
    if (this.debug) this.#drawDebug(ctx, stats);
  }

  #drawBackdrop(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, ARENA.height);
    g.addColorStop(0, '#241f3d');
    g.addColorStop(1, '#151228');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, ARENA.width, ARENA.height);

    // subtle arena border so the letterbox edge is visible
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, ARENA.width - 2, ARENA.height - 2);
  }

  #drawDebug(ctx, stats) {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '14px ui-monospace, monospace';
    ctx.textAlign = 'left';
    const fps = stats ? stats.fps : 0;
    const ups = stats ? stats.updates : 0;
    ctx.fillText(`state=${this.state}  t=${this.time.toFixed(1)}s  fps=${fps}  steps/frame=${ups}`, 12, 20);
  }
}
