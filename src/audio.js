import { AUDIO } from './config.js';

/**
 * All sound is synthesised at runtime — no audio files in the repo. Each cue is
 * a single oscillator with a frequency sweep and a short gain envelope, routed
 * through a master gain.
 *
 * The AudioContext starts suspended (autoplay policy); call `resume()` from the
 * first user gesture.
 */
export function createAudio() {
  let ctx = null;
  let master = null;
  let muted = readMuted();

  function ensureContext() {
    if (ctx) return;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : AUDIO.masterGain;
    master.connect(ctx.destination);
  }

  function readMuted() {
    try {
      return localStorage.getItem(AUDIO.storageKey) === '1';
    } catch {
      return false;
    }
  }

  function persistMuted() {
    try {
      localStorage.setItem(AUDIO.storageKey, muted ? '1' : '0');
    } catch {
      /* storage unavailable — mute is session-only, fine */
    }
  }

  function play(name) {
    const cue = AUDIO.cues[name];
    if (!cue || muted) return;
    ensureContext();
    if (!ctx || ctx.state !== 'running') return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = cue.type;
    osc.frequency.setValueAtTime(cue.freq, now);
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(1, cue.freqEnd),
      now + cue.duration
    );
    // click-free envelope
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(cue.gain, now + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + cue.duration);

    osc.connect(gain).connect(master);
    osc.start(now);
    osc.stop(now + cue.duration + 0.02);
  }

  return {
    get muted() {
      return muted;
    },
    resume() {
      ensureContext();
      if (ctx && ctx.state === 'suspended') ctx.resume();
    },
    toggleMute() {
      muted = !muted;
      if (master) {
        master.gain.value = muted ? 0 : AUDIO.masterGain;
      }
      persistMuted();
      return muted;
    },
    play
  };
}
