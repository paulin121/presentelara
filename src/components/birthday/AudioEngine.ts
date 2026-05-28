
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
  }
  return audioCtx;
}

const NOTE_FREQUENCIES: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.0, A4: 440.0, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46,
  G5: 783.99, A5: 880.0, B5: 987.77,
  "C#4": 277.18, "D#4": 311.13, "F#4": 369.99,
  "G#4": 415.3, "A#4": 466.16,
  "C#5": 554.37, "D#5": 622.25, "F#5": 739.99,
  "G#5": 830.61, "A#5": 932.33,
};

export function playPianoNote(note: string, duration = 1.5) {
  const ctx = getAudioContext();
  const freq = NOTE_FREQUENCIES[note];
  if (!freq) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const filterNode = ctx.createBiquadFilter();

  oscillator.connect(filterNode);
  filterNode.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(freq * 0.999, ctx.currentTime + duration);

  filterNode.type = "lowpass";
  filterNode.frequency.setValueAtTime(3000, ctx.currentTime);
  filterNode.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + duration);

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);

  // Add harmonics for richer piano sound
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(freq * 2, ctx.currentTime);
  gain2.gain.setValueAtTime(0, ctx.currentTime);
  gain2.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.01);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration * 0.7);
  osc2.start(ctx.currentTime);
  osc2.stop(ctx.currentTime + duration * 0.7);
}

export function playSuccessChime() {
  const ctx = getAudioContext();
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.15);
    gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.15);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + i * 0.15 + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.15 + 1.5);
    osc.start(ctx.currentTime + i * 0.15);
    osc.stop(ctx.currentTime + i * 0.15 + 1.5);
  });
}

export function playAmbientBGM(onStop?: () => void): () => void {
  const ctx = getAudioContext();
  let stopped = false;
  const gainMaster = ctx.createGain();
  gainMaster.gain.setValueAtTime(0.08, ctx.currentTime);
  gainMaster.connect(ctx.destination);

  const chordNotes = [261.63, 329.63, 392.0, 523.25];
  const oscillators: OscillatorNode[] = [];

  chordNotes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(gainMaster);
    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.3 - i * 0.05, ctx.currentTime);
    osc.start(ctx.currentTime);
    oscillators.push(osc);
  });

  return () => {
    if (stopped) return;
    stopped = true;
    gainMaster.gain.linearRampToValueAtTime(0, ctx.currentTime + 2);
    setTimeout(() => {
      oscillators.forEach((o) => { try { o.stop(); } catch (_) {} });
      onStop?.();
    }, 2000);
  };
}
