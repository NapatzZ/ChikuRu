/**
 * Owns the running score and kill count. Subscribes to the event bus so it
 * never has to be called from the game loop directly.
 *
 * The combo multiplier is a stub (always 1) until Sprint 4 (#16); the hook is
 * here so scoring code doesn't change when it lands.
 */
export function createScoreboard(bus) {
  const state = {
    score: 0,
    kills: 0,
    multiplier: 1,
    lastGain: null // { points, x, y } for floating text, consumed by the HUD
  };

  const offKill = bus.on('enemyKilled', ({ points, x, y }) => {
    const gain = points * state.multiplier;
    state.score += gain;
    state.kills += 1;
    state.lastGain = { points: gain, x, y, at: performance.now() };
  });

  return {
    state,
    reset() {
      state.score = 0;
      state.kills = 0;
      state.multiplier = 1;
      state.lastGain = null;
    },
    dispose() {
      offKill();
    }
  };
}
