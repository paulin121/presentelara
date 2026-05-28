
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CakeSceneProps {
  onComplete: () => void;
}

type CakePhase = "room" | "zoomed" | "wish" | "countdown" | "blowout" | "blessing";

export default function CakeScene({ onComplete }: CakeSceneProps) {
  const [phase, setPhase] = useState<CakePhase>("room");
  const [countdown, setCountdown] = useState(10);
  const [transitioning, setTransitioning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleCakeClick = useCallback(() => {
    if (phase !== "room") return;
    setPhase("zoomed");
    setTimeout(() => setPhase("wish"), 1200);
  }, [phase]);

  const handleWish = useCallback(() => {
    setPhase("countdown");
    setCountdown(10);
    intervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const handleBlowCandle = useCallback(() => {
    if (phase !== "countdown" || countdown > 0) return;
    clearInterval(intervalRef.current!);
    setPhase("blowout");
    setTimeout(() => setPhase("blessing"), 800);
    setTimeout(() => {
      setTransitioning(true);
      setTimeout(onComplete, 1500);
    }, 5000);
  }, [phase, countdown, onComplete]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  return (
    <motion.div
      className="relative w-full h-full flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: transitioning ? 0 : 1 }}
      transition={{ duration: 1.5 }}
    >
      {/* Room Background */}
      <div className="absolute inset-0" style={{
        background: phase === "countdown" || phase === "blowout"
          ? "linear-gradient(180deg, #1a0a0a 0%, #2d1515 50%, #1a0a0a 100%)"
          : "linear-gradient(180deg, #FFF0E8 0%, #FFE4D0 30%, #FFDEC8 60%, #FFD4B8 100%)"
      }} />

      {/* Sunlight rays (room phase) */}
      {(phase === "room" || phase === "zoomed" || phase === "wish") && (
        <div className="absolute inset-0 pointer-events-none">
          {[15, 30, 45].map((angle, i) => (
            <motion.div
              key={i}
              className="absolute top-0 right-0"
              style={{
                width: 3,
                height: "70%",
                background: "linear-gradient(180deg, rgba(255,220,150,0.3) 0%, transparent 100%)",
                transformOrigin: "top right",
                transform: `rotate(${angle}deg)`,
                filter: "blur(20px)",
              }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      )}

      {/* Isometric Room Floor */}
      {(phase === "room" || phase === "zoomed" || phase === "wish") && (
        <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{
          background: "linear-gradient(180deg, rgba(255,220,190,0.3) 0%, rgba(240,200,170,0.6) 100%)",
          borderTop: "1px solid rgba(255,200,160,0.4)",
        }} />
      )}

      {/* White Flash on blowout */}
      <AnimatePresence>
        {phase === "blowout" && (
          <motion.div
            className="absolute inset-0 z-50 bg-white pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>

      {/* Cake */}
      <AnimatePresence>
        {(phase === "room" || phase === "zoomed" || phase === "wish" || phase === "countdown") && (
          <motion.div
            className="relative z-10 flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{
              scale: phase === "zoomed" ? 1.8 : phase === "wish" ? 1.6 : phase === "countdown" ? 1.4 : 1,
              opacity: 1,
            }}
            transition={{ duration: 0.8, ease: [0.34, 1.56, 0.64, 1] }}
            onClick={phase === "room" ? handleCakeClick : undefined}
            style={{ cursor: phase === "room" ? "none" : "default" }}
          >
            {/* Candle */}
            <div className="relative flex flex-col items-center mb-1">
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{
                  background: "radial-gradient(circle, #FFF8DC 0%, #FFD700 40%, #FF8C00 70%, transparent 100%)",
                  boxShadow: "0 0 20px rgba(255,200,0,0.8), 0 0 40px rgba(255,150,0,0.4)",
                }}
                animate={{
                  scaleX: [1, 0.8, 1.1, 0.9, 1],
                  scaleY: [1, 1.2, 0.9, 1.1, 1],
                  rotate: [-2, 2, -1, 3, -2],
                }}
                transition={{ duration: 0.4, repeat: Infinity }}
              />
              <div className="w-2 h-8 rounded-sm" style={{ background: "linear-gradient(180deg, #FFF8DC 0%, #F5DEB3 100%)" }} />
            </div>

            {/* Cake tiers */}
            <div className="flex flex-col items-center gap-0">
              {/* Top tier */}
              <div className="relative w-28 h-14 rounded-t-2xl rounded-b-lg flex items-center justify-center overflow-hidden"
                style={{ background: "linear-gradient(180deg, #FFF0F5 0%, #FFD1DC 100%)", border: "2px solid rgba(255,182,193,0.6)" }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl">🌸</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-3" style={{ background: "rgba(255,182,193,0.4)" }} />
              </div>
              {/* Middle tier */}
              <div className="relative w-40 h-16 flex items-center justify-center overflow-hidden"
                style={{ background: "linear-gradient(180deg, #FFF8DC 0%, #FAEBD7 100%)", border: "2px solid rgba(255,215,0,0.4)" }}>
                <span className="text-sm tracking-widest" style={{ fontFamily: "var(--font-dancing)", color: "#C8A080" }}>Happy Birthday</span>
                <div className="absolute bottom-0 left-0 right-0 h-3" style={{ background: "rgba(255,215,0,0.2)" }} />
              </div>
              {/* Bottom tier */}
              <div className="relative w-52 h-16 rounded-b-2xl flex items-center justify-center overflow-hidden"
                style={{ background: "linear-gradient(180deg, #FFE4E1 0%, #FFDAB9 100%)", border: "2px solid rgba(255,160,122,0.4)" }}>
                <div className="flex gap-2">
                  {["🌸", "✨", "🌸"].map((e, i) => <span key={i} className="text-lg">{e}</span>)}
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="w-64 h-4 rounded-full mt-1" style={{
              background: "linear-gradient(180deg, rgba(255,255,255,0.6) 0%, rgba(240,220,200,0.8) 100%)",
              boxShadow: "0 4px 20px rgba(200,160,120,0.3)",
              backdropFilter: "blur(10px)",
            }} />

            {phase === "room" && (
              <motion.p
                className="mt-6 text-sm tracking-widest uppercase"
                style={{ fontFamily: "var(--font-inter)", color: "rgba(180,140,120,0.8)" }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Click the cake ✦
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wish prompt */}
      <AnimatePresence>
        {phase === "wish" && (
          <motion.div
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={handleWish}
              className="glass px-10 py-4 rounded-full text-lg"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "#8B6B8B",
                border: "1px solid rgba(255,182,193,0.5)",
              }}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(255,182,193,0.6)" }}
              whileTap={{ scale: 0.97 }}
              animate={{ boxShadow: ["0 0 20px rgba(255,182,193,0.3)", "0 0 40px rgba(255,182,193,0.6)", "0 0 20px rgba(255,182,193,0.3)"] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🕯️ Make a Wish
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Countdown */}
      <AnimatePresence>
        {phase === "countdown" && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={countdown}
                className="text-center"
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {countdown > 0 ? (
                  <span
                    className="text-9xl font-light animate-gold-pulse"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {countdown}
                  </span>
                ) : (
                  <motion.button
                    onClick={handleBlowCandle}
                    className="flex flex-col items-center gap-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <span className="text-6xl">🕯️</span>
                    <span
                      className="text-2xl tracking-widest text-gold"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      Blow it out!
                    </span>
                  </motion.button>
                )}
              </motion.div>
            </AnimatePresence>
            {countdown > 0 && (
              <p className="mt-8 text-sm tracking-widest" style={{ fontFamily: "var(--font-inter)", color: "rgba(255,215,0,0.6)" }}>
                Close your eyes and make a wish...
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blessing */}
      <AnimatePresence>
        {phase === "blessing" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30"
            style={{ background: "linear-gradient(135deg, rgba(255,222,233,0.95) 0%, rgba(181,255,252,0.95) 100%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="text-center px-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
            >
              <motion.p
                className="text-6xl mb-6"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.p>
              <h2
                className="text-5xl font-light mb-4"
                style={{
                  fontFamily: "var(--font-playfair)",
                  background: "linear-gradient(135deg, #C8A0C8 0%, #A0C8D4 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                May your wish come true
              </h2>
              <p className="text-lg font-light" style={{ fontFamily: "var(--font-dancing)", color: "#A08090", fontSize: "1.5rem" }}>
                Every dream you hold is worth chasing ✦
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
