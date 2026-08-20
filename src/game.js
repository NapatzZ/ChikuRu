import { ARENA, PLAYER, JUICE, ENEMIES } from './config.js';
import { createInput } from './input.js';
import { createEventBus } from './util/events.js';
import { Player } from './entities/player.js';
import { createBulletPool, fireBullet, updateBullets, renderBullets } from './entities/bullet.js';
import { createEnemyPool, updateEnemies, renderEnemies } from './entities/enemy.js';
import { createParticlePool, emitBurst, updateParticles, renderParticles } from './entities/particle.js';
import { createSpawner } from './systems/spawner.js';
import { createWaveDirector } from './systems/waves.js';
import { resolveBulletsVsEnemies, resolveEnemiesVsPlayer } from './systems/collision.js';
import { createScoreboard } from './systems/scoreboard.js';
import { createEffects } from './systems/effects.js';
import { createHud } from './ui/hud.js';

/**
 * Orchestrator. Holds the world and delegates behaviour to entities/systems.
 * Keep this file thin: wiring and state transitions only.
 */
export class Game {
  constructor(viewport) {
    this.viewport = viewport;
    this.ctx = viewport.ctx;
    this.input = createInput(viewport);
    this.bus = createEventBus();
    this.state = 'playing'; // menu | playing | paused | gameover  (grows in Sprint 4)
    this.time = 0;
    this.debug = new URLSearchParams(window.location.search).has('debug');

    this.player = new Player();
    this.bullets = createBulletPool();
    this.enemies = createEnemyPool();
    this.particles = createParticlePool();
    this.effects = createEffects();
    this.cam = { ox: 0, oy: 0 };
    this.scoreboard = createScoreboard(this.bus);
    this.hud = createHud(this.bus);

    this.waves = createWaveDirector();
    this.spawner = createSpawner(this.enemies, {
      getInterval: () => this.waves.interval,
      pickType: () => this.waves.pickType()
    });
    this.speedMul = 1;
    this.wave = 1;

    this.bus.on('enemyKilled', ({ x, y, type }) => {
      emitBurst(this.particles, x, y, JUICE.killBurst, ENEMIES[type].color);
    });
    this.bus.on('enemyHit', ({ x, y }) => {
      emitBurst(this.particles, x, y, JUICE.killBurst, 'rgba(255,255,255,0.8)');
    });
    this.bus.on('playerHit', ({ x, y }) => {
      emitBurst(this.particles, x, y, JUICE.hitBurst, '#ff5c8a');
      this.effects.shake(JUICE.shakeOnHit.magnitude, JUICE.shakeOnHit.seconds);
      this.effects.hitStop(JUICE.hitStopSeconds);
      if (this.player.hearts <= 0) this.state = 'gameover';
    });
  }

  restart() {
    this.time = 0;
    this.player.reset();
    this.bullets.releaseAll();
    this.enemies.releaseAll();
    this.particles.releaseAll();
    this.effects.reset();
    this.spawner.reset();
    this.waves.reset();
    this.scoreboard.reset();
    this.hud.reset();
    this.speedMul = 1;
    this.wave = 1;
    this.state = 'playing';
  }

  update(dt) {
    // Shake decays and hit-stop freezes the sim; both use real dt.
    const { simDt, ox, oy } = this.effects.step(dt);
    this.cam.ox = ox;
    this.cam.oy = oy;

    if (this.state === 'playing' && simDt > 0) {
      this.time += simDt;
      this.player.update(simDt, this.input);
      const shot = this.player.tryFire(this.input);
      if (shot) fireBullet(this.bullets, shot);
      updateBullets(this.bullets, simDt);

      this.waves.update(simDt);
      this.speedMul = this.waves.speedMul;
      this.wave = this.waves.wave;
      this.spawner.update(simDt, this);
      updateEnemies(this.enemies, simDt, this.player, this.speedMul);

      resolveBulletsVsEnemies(this.bullets, this.enemies, this.bus);
      resolveEnemiesVsPlayer(this.enemies, this.player, this.bus);
    } else if (this.state === 'gameover') {
      // keep rendering; wait for a restart input
      if (this.input.justPressed('confirm') || this.input.justPressed('fire')) {
        this.restart();
      }
    }
    updateParticles(this.particles, simDt > 0 ? simDt : dt);
    this.hud.update(dt);
    this.input.endFrame();
  }

  render(_alpha, stats) {
    const { ctx } = this;
    this.viewport.beginFrame();
    this.#drawBackdrop(ctx);
    // Camera shake: the world moves with the offset; backdrop and HUD don't.
    ctx.save();
    ctx.translate(this.cam.ox, this.cam.oy);
    renderEnemies(this.enemies, ctx, this.sprites);
    renderBullets(this.bullets, ctx);
    this.player.render(ctx, this.sprites);
    renderParticles(this.particles, ctx);
    ctx.restore();

    this.hud.render(ctx, {
      score: this.scoreboard.state.score,
      hearts: this.player.hearts,
      maxHearts: PLAYER.startHearts,
      wave: this.wave,
      multiplier: this.scoreboard.state.multiplier,
      comboFill: 0
    });
    const banner = this.waves.banner();
    if (banner && this.state === 'playing') this.#drawBanner(ctx, banner);
    if (this.state === 'gameover') this.#drawGameOver(ctx);
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

  #drawBanner(ctx, text) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.font = '700 40px system-ui, sans-serif';
    ctx.fillText(text, ARENA.width / 2, ARENA.height * 0.32);
    ctx.restore();
  }

  #drawGameOver(ctx) {
    ctx.fillStyle = 'rgba(12,10,24,0.72)';
    ctx.fillRect(0, 0, ARENA.width, ARENA.height);
    ctx.fillStyle = '#fdf6ff';
    ctx.textAlign = 'center';
    ctx.font = '48px system-ui, sans-serif';
    ctx.fillText('Game Over', ARENA.width / 2, ARENA.height / 2 - 20);
    ctx.font = '20px system-ui, sans-serif';
    ctx.fillText(`Score ${this.scoreboard.state.score}`, ARENA.width / 2, ARENA.height / 2 + 18);
    ctx.fillText('Press Enter to play again', ARENA.width / 2, ARENA.height / 2 + 52);
  }

  #drawDebug(ctx, stats) {
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.font = '14px ui-monospace, monospace';
    ctx.textAlign = 'left';
    const fps = stats ? stats.fps : 0;
    const ups = stats ? stats.updates : 0;
    ctx.fillText(
      `state=${this.state}  t=${this.time.toFixed(1)}s  fps=${fps}  steps/frame=${ups}  ` +
        `hearts=${this.player.hearts}  enemies=${this.enemies.activeCount}  kills=${this.scoreboard.state.kills}`,
      12,
      44
    );
  }
}
