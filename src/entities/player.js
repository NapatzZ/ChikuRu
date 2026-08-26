import { ARENA, PLAYER } from '../config.js';
import { clamp, normalize, TAU } from '../util/math.js';

/**
 * The player character. Moves under keyboard/pointer input, stays inside the
 * arena, and fires on a capped cadence. Hearts / i-frames live here; the
 * collision system calls `hit()` and reads `hearts`.
 */
export class Player {
  constructor() {
    this.radius = PLAYER.radius;
    this.reset();
  }

  reset() {
    this.x = ARENA.width / 2;
    this.y = ARENA.height * PLAYER.spawnY;
    this.vx = 0;
    this.vy = 0;
    this.hearts = PLAYER.startHearts;
    this.invuln = 0;
    this.fireCooldown = 0;
    this.facing = -Math.PI / 2; // up
  }

  get isInvulnerable() {
    return this.invuln > 0;
  }

  update(dt, input) {
    const target = input.moveTarget();
    if (target) {
      // Touch: ease toward the finger, capped at the normal move speed.
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      const dist = Math.hypot(dx, dy);
      const step = Math.min(PLAYER.speed, dist / Math.max(dt, 1e-4));
      const dir = normalize(dx, dy);
      this.vx = dir.x * step;
      this.vy = dir.y * step;
    } else {
      const axis = input.moveAxis();
      const dir = normalize(axis.x, axis.y);
      this.vx = dir.x * PLAYER.speed;
      this.vy = dir.y * PLAYER.speed;
    }

    this.x = clamp(this.x + this.vx * dt, this.radius, ARENA.width - this.radius);
    this.y = clamp(this.y + this.vy * dt, this.radius, ARENA.height - this.radius);

    // Touch is single-stick: always fire upward. Mouse aims freely.
    this.facing = input.isCoarsePointer ? -Math.PI / 2 : input.aimFrom(this.x, this.y);

    if (this.invuln > 0) this.invuln -= dt;
    if (this.fireCooldown > 0) this.fireCooldown -= dt;
  }

  /** Returns a {x,y,angle} muzzle description if a shot is allowed, else null. */
  tryFire(input) {
    if (this.fireCooldown > 0 || !input.wantsFire()) return null;
    this.fireCooldown = 1 / PLAYER.fireRate;
    const angle = this.facing;
    return {
      x: this.x + Math.cos(angle) * (this.radius + 2),
      y: this.y + Math.sin(angle) * (this.radius + 2),
      angle
    };
  }

  /** Apply one hit. Returns true if it landed (i.e. not during i-frames). */
  hit() {
    if (this.invuln > 0 || this.hearts <= 0) return false;
    this.hearts--;
    this.invuln = PLAYER.invulnSeconds;
    return true;
  }

  render(ctx, sprites) {
    const blink = this.isInvulnerable && Math.floor(this.invuln * 20) % 2 === 0;
    ctx.save();
    ctx.translate(this.x, this.y);
    if (blink) ctx.globalAlpha = 0.35;

    const sprite = sprites && sprites.get && sprites.get('player');
    if (sprite) {
      const s = this.radius * 2.4;
      ctx.drawImage(sprite, -s / 2, -s / 2, s, s);
    } else {
      this.#drawBlob(ctx);
    }

    // aim tick
    ctx.rotate(this.facing);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(this.radius, 0);
    ctx.lineTo(this.radius + 10, 0);
    ctx.stroke();
    ctx.restore();
  }

  #drawBlob(ctx) {
    ctx.fillStyle = '#fef1c7';
    ctx.strokeStyle = '#3a2f1c';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, TAU);
    ctx.fill();
    ctx.stroke();
    // eyes
    ctx.fillStyle = '#2a2118';
    ctx.beginPath();
    ctx.arc(-7, -3, 2.6, 0, TAU);
    ctx.arc(7, -3, 2.6, 0, TAU);
    ctx.fill();
    // cheeks
    ctx.fillStyle = 'rgba(255,138,138,0.55)';
    ctx.beginPath();
    ctx.arc(-11, 5, 3.4, 0, TAU);
    ctx.arc(11, 5, 3.4, 0, TAU);
    ctx.fill();
  }
}
