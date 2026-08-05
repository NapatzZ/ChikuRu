import { TAU } from './util/math.js';

/**
 * Keyboard + pointer input. Owns no game logic — just current state plus a
 * per-frame "just pressed" set that callers must clear with `endFrame()`.
 */
const KEY_ACTIONS = {
  KeyW: 'up', ArrowUp: 'up',
  KeyS: 'down', ArrowDown: 'down',
  KeyA: 'left', ArrowLeft: 'left',
  KeyD: 'right', ArrowRight: 'right',
  Space: 'fire',
  KeyP: 'pause',
  KeyM: 'mute',
  Enter: 'confirm',
  Escape: 'pause'
};

export function createInput(viewport) {
  const down = new Set();          // held actions
  const pressed = new Set();       // actions that went down this frame
  const pointer = { x: 0, y: 0, down: false };

  function onKeyDown(e) {
    const action = KEY_ACTIONS[e.code];
    if (!action) return;
    // Space / arrows would scroll the page otherwise.
    if (e.code === 'Space' || e.code.startsWith('Arrow')) e.preventDefault();
    if (!down.has(action)) pressed.add(action);
    down.add(action);
  }

  function onKeyUp(e) {
    const action = KEY_ACTIONS[e.code];
    if (action) down.delete(action);
  }

  function onPointerMove(e) {
    const p = viewport.toArena(e.clientX, e.clientY);
    pointer.x = p.x;
    pointer.y = p.y;
  }

  function onPointerDown(e) {
    onPointerMove(e);
    pointer.down = true;
    pressed.add('fire');
  }

  function onPointerUp() {
    pointer.down = false;
  }

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', () => down.clear());
  viewport.canvas.addEventListener('pointermove', onPointerMove);
  viewport.canvas.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointerup', onPointerUp);

  return {
    pointer,
    isDown: (action) => down.has(action),
    justPressed: (action) => pressed.has(action),
    /** Firing is either the held key or a held pointer. */
    wantsFire: () => down.has('fire') || pointer.down,
    /** Movement axis as a vector in [-1,1]; not yet normalised. */
    moveAxis() {
      return {
        x: (down.has('right') ? 1 : 0) - (down.has('left') ? 1 : 0),
        y: (down.has('down') ? 1 : 0) - (down.has('up') ? 1 : 0)
      };
    },
    /** Angle from a point toward the pointer, in radians [0, TAU). */
    aimFrom(x, y) {
      return (Math.atan2(pointer.y - y, pointer.x - x) + TAU) % TAU;
    },
    endFrame() {
      pressed.clear();
    }
  };
}
