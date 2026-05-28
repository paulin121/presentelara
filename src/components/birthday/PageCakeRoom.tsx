
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PageCakeRoomProps {
  onComplete: () => void;
}

type RoomPhase = "room" | "zoom" | "wish" | "countdown" | "blowout" | "blessing" | "exit";

export default function PageCakeRoom({ onComplete }: PageCakeRoomProps) {
  const [phase, setPhase] = useState<RoomPhase>("room");
  const [countdown, setCountdown] = useState(10);
  const [candleLit, setCandleLit] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleCakeClick = useCallback(() => {
    if (phase !== "room") return;
    setPhase("zoom");
    setTimeout(() => setPhase("wish"), 1200);
  }, [phase]);

  const handleMakeWish = useCallback(() => {
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
    if (countdown > 0) return;
    setCandleLit(false);
    setPhase("blowout");
    setTimeout(() => setPhase("blessing"), 1500);
  }, [countdown]);

  const handleContinue = useCallback(() => {
    setPhase("exit");
    setTimeout(() => onComplete(), 1000);
  }, [onComplete]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden" style={{
      background: "linear-gradient(160deg, #FFF8F0 0%, #FFE4CC 40%, #FFDEE9 100%)",
    }}>
      {/* Room ambient light */}
      <div className="absolute inset-0">
        <div className="absolute" style={{
          top: "10%", left: "20%",
          width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(255,220,150,0.3) 0%, transparent 70%)",
          filter: "blur(40px)",
        }} />
        <div className="absolute" style={{
          bottom: "20%", right: "15%",
          width: "250px", height: "250px",
          background: "radial-gradient(circle, rgba(255,182,193,0.25) 0%, transparent 70%)",
          filter: "blur(30px)",
        }} />
      </div>

      {/* Isometric room illustration */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="relative"
          animate={phase === "zoom" ? { scale: 2.5, y: -50 } : { scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{ transformOrigin: "center 60%" }}
        >
          {/* Room floor */}
          <div className="relative" style={{ width: "500px", height: "400px" }}>
            {/* Back wall */}
            <div className="absolute inset-0 rounded-3xl" style={{
              background: "linear-gradient(160deg, rgba(255,248,240,0.9) 0%, rgba(255,235,210,0.8) 100%)",
              border: "1px solid rgba(255,200,180,0.3)",
            }} />

            {/* Window with sunlight */}
            <div className="absolute top-8 right-12 rounded-2xl overflow-hidden" style={{
              width: "100px", height: "80px",
              background: "linear-gradient(135deg, rgba(255,240,180,0.9), rgba(181,255,252,0.7))",
              border: "2px solid rgba(255,220,180,0.6)",
              boxShadow: "0 0 30px rgba(255,220,150,0.4)",
            }}>
              <div className="absolute inset-0" style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 100%)",
              }} />
              {/* Window cross */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="absolute w-full h-0.5" style={{ background: "rgba(255,200,150,0.4)" }} />
                <div className="absolute h-full w-0.5" style={{ background: "rgba(255,200,150,0.4)" }} />
              </div>
            </div>

            {/* Sunlight beam */}
            <div className="absolute" style={{
              top: "8px", right: "12px",
              width: "200px", height: "200px",
              background: "linear-gradient(135deg, rgba(255,240,180,0.15) 0%, transparent 70%)",
              transformOrigin: "top right",
              transform: "rotate(20deg)",
            }} />

            {/* Floating table */}
            <motion.div
              className="absolute"
              style={{ bottom: "60px", left: "50%", transform: "translateX(-50%)" }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Table top */}
              <div className="rounded-2xl" style={{
                width: "200px", height: "12px",
                background: "linear-gradient(to bottom, rgba(255,235,200,0.95), rgba(240,210,170,0.9))",
                boxShadow: "0 4px 20px rgba(200,150,100,0.3)",
                border: "1px solid rgba(255,220,180,0.5)",
              }} />

              {/* Cake on table */}
              <motion.div
                className="absolute -top-28 left-1/2 -translate-x-1/2"
                onClick={handleCakeClick}
                style={{ cursor: "none" }}
                whileHover={phase === "room" ? { scale: 1.05 } : {}}
                whileTap={phase === "room" ? { scale: 0.95 } : {}}
              >
                {/* Cake layers */}
                <div className="relative flex flex-col items-center">
                  {/* Top tier */}
                  <div className="rounded-xl" style={{
                    width: "60px", height: "35px",
                    background: "linear-gradient(to bottom, rgba(255,240,245,0.95), rgba(255,210,230,0.9))",
                    border: "1px solid rgba(255,200,220,0.5)",
                    boxShadow: "0 2px 10px rgba(255,150,180,0.2)",
                  }}>
                    {/* Frosting drips */}
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="absolute bottom-0 rounded-b-full" style={{
                        width: "8px", height: "10px",
                        background: "rgba(255,255,255,0.9)",
                        left: `${8 + i * 14}px`,
                        transform: "translateY(50%)",
                      }} />
                    ))}
                  </div>

                  {/* Middle tier */}
                  <div className="rounded-xl -mt-1" style={{
                    width: "80px", height: "40px",
                    background: "linear-gradient(to bottom, rgba(255,220,235,0.95), rgba(255,190,215,0.9))",
                    border: "1px solid rgba(255,180,210,0.5)",
                    boxShadow: "0 3px 12px rgba(255,130,170,0.2)",
                  }}>
                    {/* Decorative dots */}
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="absolute rounded-full" style={{
                        width: "5px", height: "5px",
                        background: "rgba(255,215,0,0.8)",
                        top: "50%", left: `${8 + i * 14}px`,
                        transform: "translateY(-50%)",
                      }} />
                    ))}
                  </div>

                  {/* Bottom tier */}
                  <div className="rounded-xl -mt-1" style={{
                    width: "100px", height: "45px",
                    background: "linear-gradient(to bottom, rgba(255,200,220,0.95), rgba(255,170,200,0.9))",
                    border: "1px solid rgba(255,160,195,0.5)",
                    boxShadow: "0 4px 15px rgba(255,100,150,0.2)",
                  }}>
                    {/* Strawberry decorations */}
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="absolute" style={{
                        width: "10px", height: "12px",
                        background: "rgba(220,50,80,0.8)",
                        borderRadius: "50% 50% 40% 40%",
                        top: "8px", left: `${15 + i * 30}px`,
                      }} />
                    ))}
                  </div>

                  {/* Candle */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div style={{
                      width: "6px", height: "28px",
                      background: "linear-gradient(to bottom, rgba(255,240,200,0.9), rgba(255,215,100,0.8))",
                      borderRadius: "3px",
                    }} />
                    {/* Flame */}
                    {candleLit && (
                      <motion.div
                        className="absolute -top-5"
                        animate={{
                          scaleX: [1, 0.9, 1.1, 0.95, 1],
                          scaleY: [1, 1.1, 0.95, 1.05, 1],
                          rotate: [-2, 2, -1, 3, -2],
                        }}
                        transition={{ duration: 0.3, repeat: Infinity }}
                      >
                        <div style={{
                          width: "10px", height: "18px",
                          background: "radial-gradient(ellipse at 50% 80%, rgba(255,200,50,1) 0%, rgba(255,120,0,0.8) 50%, transparent 100%)",
                          borderRadius: "50% 50% 30% 30%",
                          filter: "blur(1px)",
                          boxShadow: "0 0 10px rgba(255,180,0,0.8), 0 0 20px rgba(255,100,0,0.4)",
                        }} />
                      </motion.div>
                    )}
                  </div>

                  {/* Click hint */}
                  {phase === "room" && (
                    <motion.div
                      className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span style={{
                        fontFamily: "var(--font-cormorant)",
                        fontSize: "0.7rem",
                        color: "rgba(180,100,130,0.7)",
                        letterSpacing: "0.1em",
                      }}>
                       clica no bolo princesa!
                      </span>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {/* Table legs */}
              {[-70, 70].map((x, i) => (
                <div key={i} className="absolute top-3" style={{
                  width: "8px", height: "50px",
                  background: "linear-gradient(to bottom, rgba(220,190,150,0.9), rgba(200,170,130,0.8))",
                  left: `${100 + x - 4}px`,
                  borderRadius: "0 0 4px 4px",
                }} />
              ))}
            </motion.div>

            {/* Floor */}
            <div className="absolute bottom-0 left-0 right-0 h-16 rounded-b-3xl" style={{
              background: "linear-gradient(to top, rgba(240,220,200,0.6), transparent)",
            }} />

            {/* Decorative elements */}
            <div className="absolute top-12 left-8">
              {/* Small plant */}
              <div style={{ width: "30px", height: "40px" }}>
                <div className="rounded-full" style={{
                  width: "20px", height: "20px",
                  background: "rgba(100,180,100,0.7)",
                  marginLeft: "5px",
                }} />
                <div className="rounded-b-lg" style={{
                  width: "14px", height: "20px",
                  background: "rgba(180,140,100,0.6)",
                  marginLeft: "8px",
                }} />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Wish overlay */}
      <AnimatePresence>
        {phase === "wish" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0" style={{
              background: "rgba(0,0,0,0.3)",
              backdropFilter: "blur(4px)",
            }} />
            <motion.div
              className="relative glass rounded-3xl p-12 text-center max-w-sm mx-4"
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="text-5xl mb-4">🕯️</div>
              <h2 className="text-3xl mb-3" style={{
                fontFamily: "var(--font-cormorant)",
                fontWeight: 300,
                color: "rgba(160,80,110,0.9)",
              }}>
                Faça um pedido!
              </h2>
              <p className="text-sm mb-8" style={{
                fontFamily: "var(--font-cormorant)",
                color: "rgba(140,80,110,0.7)",
                letterSpacing: "0.05em",
              }}>
                Close your eyes, hold your wish in your heart, then click below.
              </p>
              <motion.button
                onClick={handleMakeWish}
                className="px-10 py-3 rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(255,150,180,0.8), rgba(255,215,0,0.6))",
                  fontFamily: "var(--font-cormorant)",
                  color: "rgba(255,255,255,0.95)",
                  letterSpacing: "0.2em",
                  border: "1px solid rgba(255,200,220,0.5)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Estou pedindo...
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Countdown overlay */}
      <AnimatePresence>
        {phase === "countdown" && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0" style={{
              background: "rgba(10,5,20,0.85)",
            }} />
            {/* Candle glow in dark */}
            <div className="absolute" style={{
              top: "40%", left: "50%", transform: "translate(-50%, -50%)",
              width: "200px", height: "200px",
              background: "radial-gradient(circle, rgba(255,200,50,0.3) 0%, rgba(255,100,0,0.1) 40%, transparent 70%)",
              filter: "blur(20px)",
            }} />

            <motion.div
              key={countdown}
              className="relative z-10 text-center"
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {countdown > 0 ? (
                <>
                  <div style={{
                    fontSize: "8rem",
                    fontFamily: "var(--font-cormorant)",
                    fontWeight: 300,
                    background: "linear-gradient(135deg, rgba(255,215,0,1), rgba(255,180,50,0.8))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    lineHeight: 1,
                  }}>
                    {countdown}
                  </div>
                  <p style={{
                    fontFamily: "var(--font-cormorant)",
                    color: "rgba(255,200,150,0.6)",
                    letterSpacing: "0.3em",
                    fontSize: "0.9rem",
                  }}>
                    segure seu desejo
                  </p>
                </>
              ) : (
                <motion.button
                  onClick={handleBlowCandle}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center gap-4"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div style={{
                    fontSize: "4rem",
                    fontFamily: "var(--font-cormorant)",
                    fontWeight: 300,
                    color: "rgba(255,215,0,0.9)",
                    letterSpacing: "0.1em",
                  }}>
                    🕯️
                  </div>
                  <div className="px-10 py-3 rounded-full" style={{
                    background: "linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,150,50,0.2))",
                    border: "1px solid rgba(255,215,0,0.4)",
                    fontFamily: "var(--font-cormorant)",
                    color: "rgba(255,215,0,0.9)",
                    letterSpacing: "0.3em",
                    fontSize: "1.1rem",
                  }}>
                    Apaga a velinha
                  </div>
                </motion.button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blowout flash */}
      <AnimatePresence>
        {phase === "blowout" && (
          <motion.div
            className="absolute inset-0 z-40 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.8, 0] }}
            transition={{ duration: 1.5, times: [0, 0.2, 0.5, 1] }}
            style={{ background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,240,200,0.8) 40%, rgba(255,222,233,0.5) 100%)" }}
          />
        )}
      </AnimatePresence>

      {/* Blessing message */}
      <AnimatePresence>
        {phase === "blessing" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute inset-0 mesh-gradient" />
            <motion.div
              className="relative glass rounded-3xl p-12 text-center max-w-lg mx-4"
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", damping: 20 }}
            >
              <div className="text-5xl mb-6">✨</div>
              <h2 className="text-4xl mb-4" style={{
                fontFamily: "var(--font-cormorant)",
                fontWeight: 300,
                background: "linear-gradient(135deg, rgba(180,80,120,0.9), rgba(255,215,0,0.9))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Deus vai analisar seu pedido...
              </h2>
              <p className="mb-8 leading-relaxed" style={{
                fontFamily: "var(--font-cormorant)",
                color: "rgba(140,80,110,0.8)",
                fontSize: "1.1rem",
                letterSpacing: "0.05em",
              }}>
              Que cada sonho que você guarda floresça em algo lindo amor, porque voce merece!
              </p>
              <motion.button
                onClick={handleContinue}
                className="px-10 py-3 rounded-full"
                style={{
                  background: "linear-gradient(135deg, rgba(255,150,180,0.7), rgba(181,255,252,0.5))",
                  fontFamily: "var(--font-cormorant)",
                  color: "rgba(140,60,100,0.9)",
                  letterSpacing: "0.2em",
                  border: "1px solid rgba(255,200,220,0.5)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Continuar
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Exit transition */}
      <AnimatePresence>
        {phase === "exit" && (
          <motion.div
            className="absolute inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ background: "linear-gradient(135deg, rgba(200,240,220,0.95), rgba(181,255,252,0.95))" }}
            transition={{ duration: 1 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
