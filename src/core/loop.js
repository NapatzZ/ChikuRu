import { LOOP } from '../config.js';

/**
 * Fixed-timestep loop with render interpolation.
 *
 *   update(dt)     — called 0..n times per frame with a constant dt
 *   render(alpha)  — called once per frame; alpha in [0,1) is how far we are
 *                    between the last and next simulation step
 *
 * The accumulator is clamped so a long stall (tab switch, breakpoint) can't
 * trigger a "spiral of death" of catch-up updates.
 */
export function createLoop({ update, render }) {
  let rafId = 0;
  let running = false;
  let last = 0;
  let accumulator = 0;
  const stats = { fps: 0, updates: 0, _frames: 0, _acc: 0 };

  function frame(now) {
    if (!running) return;
    const seconds = (now - last) / 1000;
    last = now;

    accumulator += Math.min(seconds, LOOP.maxFrameTime);

    let steps = 0;
    while (accumulator >= LOOP.fixedDt) {
      update(LOOP.fixedDt);
      accumulator -= LOOP.fixedDt;
      steps++;
    }

    render(accumulator / LOOP.fixedDt);

    // rolling 1s counters for the debug overlay
    stats.updates = steps;
    stats._frames++;
    stats._acc += seconds;
    if (stats._acc >= 1) {
      stats.fps = Math.round(stats._frames / stats._acc);
      stats._frames = 0;
      stats._acc = 0;
    }

    rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    last = performance.now();
    accumulator = 0;
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    cancelAnimationFrame(rafId);
  }

  return { start, stop, stats, get running() { return running; } };
}
