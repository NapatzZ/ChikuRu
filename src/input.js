import { TAU } from './util/math.js';

/**
 * Keyboard + pointer input. Owns no game logic — just current state plus a
 * per-frame "just pressed" set that callers must clear with `endFrame()`.
 *
 * Pointer events unify mouse and touch. On a coarse pointer (touch) we also
 * expose the held-pointer position as a movement target so the player can be
 * dragged around; on a fine pointer the pointer only aims.
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
  const down = new Set(); // held actions
  const pressed = new Set(); // actions that went down this frame
  const pointer = { x: 0, y: 0, down: false, moved: false };
  const coarse =
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(pointer: coarse)').matches
      : false;

  function onKeyDown(e) {
    const action = KEY_ACTIONS[e.code];
    if (!action) return;
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
    pointer.moved = true;
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
  window.addEventListener('blur', () => {
    down.clear();
    pointer.down = false;
  });
  viewport.canvas.addEventListener('pointermove', onPointerMove);
  viewport.canvas.addEventListener('pointerdown', onPointerDown);
  // Listen on window so a drag that leaves the canvas still updates.
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);

  return {
    pointer,
    isCoarsePointer: coarse,
    isDown: (action) => down.has(action),
    justPressed: (action) => pressed.has(action),
    wantsFire: () => down.has('fire') || pointer.down,

    /** Keyboard movement axis in [-1,1] (not normalised). */
    moveAxis() {
      return {
        x: (down.has('right') ? 1 : 0) - (down.has('left') ? 1 : 0),
        y: (down.has('down') ? 1 : 0) - (down.has('up') ? 1 : 0)
      };
    },

    /** On touch: the point to steer toward while held, else null. */
    moveTarget() {
      return coarse && pointer.down ? { x: pointer.x, y: pointer.y } : null;
    },

    /**
     * Aim angle from a point toward the pointer. Until the pointer has moved
     * (fresh load, keyboard-only player) this returns "straight up" so shots
     * don't all fly to the arena origin.
     */
    aimFrom(x, y) {
      if (!pointer.moved) return -Math.PI / 2;
      return (Math.atan2(pointer.y - y, pointer.x - x) + TAU) % TAU;
    },

    endFrame() {
      pressed.clear();
    }
  };
}
