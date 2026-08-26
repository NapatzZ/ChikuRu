import { ARENA } from '../config.js';

/**
 * Creates the game canvas, keeps it sized to the window at the device pixel
 * ratio, and letterboxes the fixed logical arena inside it.
 *
 * All game drawing happens in arena coordinates (0..ARENA.width,
 * 0..ARENA.height); the transform set on each `beginFrame()` handles DPI and
 * letterbox offset.
 */
export function createViewport(mount) {
  const canvas = document.createElement('canvas');
  canvas.id = 'game';
  canvas.tabIndex = 0; // focusable so keyboard input works without a click
  canvas.setAttribute('aria-label', 'ChikuRu game. Move with WASD or arrows, aim with the mouse, hold space to shoot.');
  const ctx = canvas.getContext('2d');
  mount.appendChild(canvas);

  const layout = { scale: 1, offsetX: 0, offsetY: 0, dpr: 1 };

  function resize() {
    const dpr = window.devicePixelRatio || 1;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    canvas.style.width = vw + 'px';
    canvas.style.height = vh + 'px';
    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);

    const scale = Math.min(vw / ARENA.width, vh / ARENA.height);
    layout.dpr = dpr;
    layout.scale = scale;
    layout.offsetX = (vw - ARENA.width * scale) / 2;
    layout.offsetY = (vh - ARENA.height * scale) / 2;
  }

  /** Reset the transform for a new frame and clear the whole canvas. */
  function beginFrame() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const s = layout.scale * layout.dpr;
    ctx.setTransform(s, 0, 0, s, layout.offsetX * layout.dpr, layout.offsetY * layout.dpr);
  }

  /** Map a client (pointer) coordinate into arena space. */
  function toArena(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left - layout.offsetX) / layout.scale,
      y: (clientY - rect.top - layout.offsetY) / layout.scale
    };
  }

  resize();
  window.addEventListener('resize', resize);

  return { canvas, ctx, layout, beginFrame, toArena, resize };
}
