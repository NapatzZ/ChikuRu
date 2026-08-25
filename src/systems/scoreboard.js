/**
 * Owns the running score and kill count. Subscribes to the event bus so it
 * never has to be called from the game loop directly.
 *
 * `getMultiplier` is read at the moment of each kill (the combo system, #16).
 * It defaults to `1` so the scoreboard works standalone / in tests.
 */
export function createScoreboard(bus, getMultiplier = () => 1) {
  const state = {
    score: 0,
    kills: 0,
    multiplier: 1,
    lastGain: null // { points, x, y } for floating text, consumed by the HUD
  };

  const offKill = bus.on('enemyKilled', ({ points, x, y }) => {
    const multiplier = getMultiplier();
    const gain = points * multiplier;
    state.multiplier = multiplier;
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
