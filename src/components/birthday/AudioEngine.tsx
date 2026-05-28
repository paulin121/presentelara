
"use client";

import { useEffect, useRef, useCallback } from "react";

interface AudioEngineProps {
  onReady: (playNote: (noteIndex: number) => void) => void;
}

// Happy Birthday note frequencies (C4 = 261.63 Hz)
const NOTE_FREQUENCIES: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25,
  D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99,
};

// Happy Birthday first 12 notes: C C D C F E | C C D C G F
export const HAPPY_BIRTHDAY_NOTES = ["C4", "C4", "D4", "C4", "F4", "E4", "C4", "C4", "D4", "C4", "G4", "F4"];

function createPianoNote(ctx: AudioContext, frequency: number, duration: number = 1.5) {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const filterNode = ctx.createBiquadFilter();

  oscillator.connect(filterNode);
  filterNode.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  // Add harmonics for richer piano sound
  const osc2 = ctx.createOscillator();
  const gain2 = ctx.createGain();
  osc2.connect(gain2);
  gain2.connect(ctx.destination);
  osc2.type = "sine";
  osc2.frequency.setValueAtTime(frequency * 2, ctx.currentTime);
  gain2.gain.setValueAtTime(0.08, ctx.currentTime);
  gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration * 0.8);

  filterNode.type = "lowpass";
  filterNode.frequency.setValueAtTime(3000, ctx.currentTime);
  filterNode.Q.setValueAtTime(1, ctx.currentTime);

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.15, ctx.currentTime + 0.3);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
  osc2.start(ctx.currentTime);
  osc2.stop(ctx.currentTime + duration);
}

export default function AudioEngine({ onReady }: AudioEngineProps) {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playNote = useCallback((noteIndex: number) => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume();
    const noteName = HAPPY_BIRTHDAY_NOTES[noteIndex];
    const freq = NOTE_FREQUENCIES[noteName];
    if (freq) createPianoNote(ctx, freq);
  }, []);

  useEffect(() => {
    onReady(playNote);
  }, [onReady, playNote]);

  return null;
}

