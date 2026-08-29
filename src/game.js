import { ARENA, SPAWN } from './config.js';
import { createInput } from './input.js';
import { Player } from './entities/player.js';
import { createBulletPool, fireBullet, updateBullets, renderBullets } from './entities/bullet.js';
import { createEnemyPool, updateEnemies, renderEnemies } from './entities/enemy.js';
import { createSpawner } from './systems/spawner.js';

/**
 * Orchestrator. Holds the world and delegates behaviour to entities/systems.
 * Keep this file thin: wiring and state transitions only.
 */
export class Game {
  constructor(viewport) {
    this.viewport = viewport;
    this.ctx = viewport.ctx;
    this.input = createInput(viewport);
    this.state = 'playing'; // menu | playing | paused | gameover  (grows in Sprint 4)
    this.time = 0;
    this.debug = new URLSearchParams(window.location.search).has('debug');

    this.player = new Player();
    this.bullets = createBulletPool();
    this.enemies = createEnemyPool();

    // Sprint 2: constant difficulty. The wave director replaces these in #11.
    this.spawner = createSpawner(this.enemies, {
      getInterval: () => SPAWN.baseInterval,
      pickType: () => 'chiikawa'
    });
    this.speedMul = 1;
  }

  restart() {
    this.time = 0;
    this.player.reset();
    this.bullets.releaseAll();
    this.enemies.releaseAll();
    this.spawner.reset();
    this.state = 'playing';
  }

  update(dt) {
    if (this.state === 'playing') {
      this.time += dt;
      this.player.update(dt, this.input);
      const shot = this.player.tryFire(this.input);
      if (shot) fireBullet(this.bullets, shot);
      updateBullets(this.bullets, dt);

      this.spawner.update(dt, this);
      updateEnemies(this.enemies, dt, this.player, this.speedMul);
    }
    this.input.endFrame();
  }

  render(_alpha, stats) {
    const { ctx } = this;
    this.viewport.beginFrame();
    this.#drawBackdrop(ctx);
    renderEnemies(this.enemies, ctx, this.sprites);
    renderBullets(this.bullets, ctx);
    this.player.render(ctx, this.sprites);
    if (this.debug) this.#drawDebug(ctx, stats);
  }

  #drawBackdrop(ctx) {
    const g = ctx.createLinearGradient(0, 0, 0, ARENA.height);
    g.addColorStop(0, '#241f3d');
    g.addColorStop(1, '#151228');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, ARENA.width, ARENA.height);

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
    ctx.fillText(
      `state=${this.state}  t=${this.time.toFixed(1)}s  fps=${fps}  steps/frame=${ups}  ` +
        `hearts=${this.player.hearts}  enemies=${this.enemies.activeCount}`,
      12,
      20
    );
  }
}
