import { AUDIO } from './config.js';
import { storage } from './storage.js';

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
  let muted = storage.get('muted', false) === true;

  function ensureContext() {
    if (ctx) return;
    const Ctor = window.AudioContext || window.webkitAudioContext;
    if (!Ctor) return;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : AUDIO.masterGain;
    master.connect(ctx.destination);
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
      storage.set('muted', muted);
      return muted;
    },
    play
  };
}
