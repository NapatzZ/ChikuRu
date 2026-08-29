/**
 * Minimal synchronous event bus. Systems talk through this instead of holding
 * references to each other — collision emits `enemyKilled`, the scoreboard and
 * (later) particles/audio listen.
 */
export function createEventBus() {
  const listeners = new Map(); // name -> Set<fn>

  return {
    on(name, fn) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(fn);
      return () => listeners.get(name)?.delete(fn);
    },
    emit(name, payload) {
      const set = listeners.get(name);
      if (!set) return;
      for (const fn of set) fn(payload);
    },
    clear() {
      listeners.clear();
    }
  };
}
