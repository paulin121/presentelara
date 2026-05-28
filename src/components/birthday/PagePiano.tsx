
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PagePianoProps {
  onComplete: () => void;
}

// Happy Birthday notes: C C D C F E | C C D C G F | C C C5 A F E D | Bb Bb A F G F
const HAPPY_BIRTHDAY_SEQUENCE = [
  { note: "C4", label: "C", isBlack: false, keyIndex: 0 },
  { note: "C4", label: "C", isBlack: false, keyIndex: 0 },
  { note: "D4", label: "D", isBlack: false, keyIndex: 1 },
  { note: "C4", label: "C", isBlack: false, keyIndex: 0 },
  { note: "F4", label: "F", isBlack: false, keyIndex: 3 },
  { note: "E4", label: "E", isBlack: false, keyIndex: 2 },
  { note: "C4", label: "C", isBlack: false, keyIndex: 0 },
  { note: "C4", label: "C", isBlack: false, keyIndex: 0 },
  { note: "D4", label: "D", isBlack: false, keyIndex: 1 },
  { note: "C4", label: "C", isBlack: false, keyIndex: 0 },
  { note: "G4", label: "G", isBlack: false, keyIndex: 4 },
  { note: "F4", label: "F", isBlack: false, keyIndex: 3 },
];

const WHITE_KEYS = ["C", "D", "E", "F", "G", "A", "B"];
const NOTE_FREQUENCIES: Record<string, number> = {
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25,
};

export default function PagePiano({ onComplete }: PagePianoProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeKey, setActiveKey] = useState<number | null>(null);
  const [lightTrails, setLightTrails] = useState<{ id: number; keyIndex: number }[]>([]);
  const [completed, setCompleted] = useState(false);
  const [phase, setPhase] = useState<"intro" | "playing" | "complete" | "exit">("intro");
  const audioCtxRef = useRef<AudioContext | null>(null);
  const trailIdRef = useRef(0);
  const completedRef = useRef(false);

  const getAudioCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioCtxRef.current;
  }, []);

  const playNote = useCallback((frequency: number) => {
    const ctx = getAudioCtx();
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filterNode = ctx.createBiquadFilter();

    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

    // Add harmonics for piano-like sound
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(frequency * 2, ctx.currentTime);
    gain2.gain.setValueAtTime(0.15, ctx.currentTime);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

    filterNode.type = "lowpass";
    filterNode.frequency.setValueAtTime(3000, ctx.currentTime);

    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 2);
    osc2.start(ctx.currentTime);
    osc2.stop(ctx.currentTime + 1.5);
  }, [getAudioCtx]);

  const handleKeyPress = useCallback((keyIndex: number) => {
    if (completedRef.current) return;
    const expected = HAPPY_BIRTHDAY_SEQUENCE[currentStep];
    if (expected.keyIndex !== keyIndex) return;

    const note = HAPPY_BIRTHDAY_SEQUENCE[currentStep].note;
    const freq = NOTE_FREQUENCIES[note];
    if (freq) playNote(freq);

    setActiveKey(keyIndex);
    setTimeout(() => setActiveKey(null), 200);

    // Add light trail
    const trailId = trailIdRef.current++;
    setLightTrails((prev) => [...prev, { id: trailId, keyIndex }]);
    setTimeout(() => {
      setLightTrails((prev) => prev.filter((t) => t.id !== trailId));
    }, 800);

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    if (nextStep >= HAPPY_BIRTHDAY_SEQUENCE.length) {
      completedRef.current = true;
      setCompleted(true);
      setPhase("complete");
      setTimeout(() => {
        setPhase("exit");
        setTimeout(() => onComplete(), 1000);
      }, 2500);
    }
  }, [currentStep, playNote, onComplete]);

  // Descending light hints
  const [hints, setHints] = useState<{ id: number; keyIndex: number; top: number }[]>([]);
  const hintIdRef = useRef(0);

  useEffect(() => {
    if (phase !== "playing" || completed) return;
    const expected = HAPPY_BIRTHDAY_SEQUENCE[currentStep];
    const hintId = hintIdRef.current++;
    setHints([{ id: hintId, keyIndex: expected.keyIndex, top: 0 }]);
  }, [currentStep, phase, completed]);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{
      background: "linear-gradient(180deg, #87CEEB 0%, #B0E0FF 30%, #E8F4FD 60%, #F0F8FF 100%)",
    }}>
      {/* Animated sky clouds */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${120 + i * 60}px`,
            height: `${40 + i * 20}px`,
            background: "rgba(255,255,255,0.7)",
            top: `${5 + i * 8}%`,
            left: `${-10 + i * 18}%`,
            filter: "blur(8px)",
          }}
          animate={{ x: [0, 40, 0] }}
          transition={{ duration: 20 + i * 5, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Soft gradient overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-64" style={{
        background: "linear-gradient(to top, rgba(255,240,248,0.9) 0%, transparent 100%)",
      }} />

      {/* Intro overlay */}
      <AnimatePresence>
        {phase === "intro" && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="glass rounded-3xl p-12 text-center max-w-md mx-4">
              <div className="text-5xl mb-4">🎹</div>
              <h2 className="text-3xl mb-3" style={{
                fontFamily: "var(--font-cormorant)",
                fontWeight: 300,
                color: "rgba(100, 60, 120, 0.9)",
              }}>
                A melodia...
              </h2>
              <p className="text-sm mb-8 leading-relaxed" style={{
                fontFamily: "var(--font-cormorant)",
                color: "rgba(120, 80, 140, 0.7)",
                letterSpacing: "0.05em",
              }}>
               Siga a luz e toque as primeiras 12 notas de Parabéns pra Você no piano abaixo linda!
              </p>
              <motion.button
                onClick={() => setPhase("playing")}
                className="px-10 py-3 rounded-full glass"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  color: "rgba(140, 60, 100, 0.9)",
                  border: "1px solid rgba(255,200,220,0.5)",
                  letterSpacing: "0.2em",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
             Estou pronta
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      {phase === "playing" && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
          <div className="glass rounded-full px-6 py-3 flex items-center gap-3">
            <span style={{ fontFamily: "var(--font-cormorant)", color: "rgba(120,60,100,0.8)", fontSize: "0.9rem" }}>
              Nota {currentStep + 1} / {HAPPY_BIRTHDAY_SEQUENCE.length}
            </span>
            <div className="flex gap-1">
              {HAPPY_BIRTHDAY_SEQUENCE.map((_, i) => (
                <div
                  key={i}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: "8px",
                    height: "8px",
                    background: i < currentStep
                      ? "rgba(255,150,180,0.9)"
                      : i === currentStep
                      ? "rgba(255,215,0,0.9)"
                      : "rgba(200,180,210,0.4)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Completion message */}
      <AnimatePresence>
        {phase === "complete" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="glass rounded-3xl p-12 text-center">
              <div className="text-6xl mb-4">✨</div>
              <h2 className="text-4xl" style={{
                fontFamily: "var(--font-cormorant)",
                fontWeight: 300,
                background: "linear-gradient(135deg, rgba(180,80,120,0.9), rgba(255,215,0,0.9))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Perfeito mds!
              </h2>
              <p className="mt-3" style={{
                fontFamily: "var(--font-cormorant)",
                color: "rgba(120,60,100,0.7)",
                letterSpacing: "0.1em",
              }}>
                A melodia continua...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Piano */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-0">
        {/* Hint light trails */}
        <div className="relative w-full max-w-2xl h-40 mb-0">
          {phase === "playing" && hints.map((hint) => (
            <motion.div
              key={hint.id}
              className="absolute bottom-0 rounded-full"
              style={{
                width: "20px",
                height: "80px",
                left: `calc(${(hint.keyIndex / WHITE_KEYS.length) * 100}% + ${(1 / WHITE_KEYS.length) * 50}% - 10px)`,
                background: "linear-gradient(to bottom, transparent, rgba(255,215,0,0.8), rgba(255,150,180,0.9))",
                filter: "blur(3px)",
              }}
              initial={{ y: -120, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeIn" }}
            />
          ))}

          {/* Light trails on key press */}
          {lightTrails.map((trail) => (
            <motion.div
              key={trail.id}
              className="absolute bottom-0 rounded-full pointer-events-none"
              style={{
                width: "16px",
                height: "60px",
                left: `calc(${(trail.keyIndex / WHITE_KEYS.length) * 100}% + ${(1 / WHITE_KEYS.length) * 50}% - 8px)`,
                background: "linear-gradient(to top, rgba(255,150,180,0.9), rgba(255,215,0,0.6), transparent)",
                filter: "blur(4px)",
              }}
              initial={{ y: 0, opacity: 1, scaleY: 1 }}
              animate={{ y: -80, opacity: 0, scaleY: 0.3 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          ))}
        </div>

        {/* Piano body */}
        <div
          className="relative w-full max-w-2xl glass rounded-t-3xl"
          style={{
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(30px)",
            border: "1px solid rgba(255,255,255,0.4)",
            borderBottom: "none",
            padding: "20px 20px 0",
          }}
        >
          {/* Piano top decoration */}
          <div className="flex justify-center mb-4">
            <div className="h-1 w-32 rounded-full" style={{
              background: "linear-gradient(90deg, transparent, rgba(255,200,220,0.6), transparent)",
            }} />
          </div>

          {/* Keys container */}
          <div className="relative flex justify-center" style={{ height: "140px" }}>
            <div className="relative flex" style={{ width: `${WHITE_KEYS.length * 60}px` }}>
              {/* White keys */}
              {WHITE_KEYS.map((key, i) => {
                const isNextKey = phase === "playing" && HAPPY_BIRTHDAY_SEQUENCE[currentStep]?.keyIndex === i;
                return (
                  <motion.button
                    key={key}
                    onClick={() => handleKeyPress(i)}
                    className={`piano-key-white ${activeKey === i ? "active" : ""}`}
                    style={{
                      width: "54px",
                      height: "130px",
                      margin: "0 3px",
                      position: "relative",
                      zIndex: 1,
                      outline: isNextKey ? "2px solid rgba(255,215,0,0.8)" : "none",
                      boxShadow: isNextKey
                        ? "0 0 20px rgba(255,215,0,0.6), 0 4px 15px rgba(180,150,200,0.3)"
                        : undefined,
                    }}
                    whileTap={{ y: 3 }}
                  >
                    <span className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs" style={{
                      color: "rgba(150,100,170,0.5)",
                      fontFamily: "var(--font-cormorant)",
                    }}>
                      {key}
                    </span>
                  </motion.button>
                );
              })}

              {/* Black keys */}
              {[0, 1, null, 3, 4, 5].map((whiteKeyIndex, i) => {
                if (whiteKeyIndex === null) return null;
                return (
                  <div
                    key={i}
                    className="piano-key-black absolute"
                    style={{
                      width: "36px",
                      height: "85px",
                      top: 0,
                      left: `${whiteKeyIndex * 60 + 39}px`,
                      zIndex: 2,
                    }}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Exit overlay */}
      <AnimatePresence>
        {phase === "exit" && (
          <motion.div
            className="absolute inset-0 z-40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ background: "linear-gradient(135deg, rgba(255,222,233,0.95), rgba(181,255,252,0.95))" }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
