
"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PageFinaleProps {
  onReplay: () => void;
}

const LETTER_TEXT = [
  "Para a mulher da minha vida...",
  "",
  "Neste dia especial, quero que você saiba que sua presença neste mundo é o melhor presente — não só para quem te conhece, mas para cada cantinho do universo que já foi tocado pela sua beleza incrível e maravilhosa.",
  "",
  "Que nesse novo ciclo você possa desfrutar de todas as melhores coisas do mundo meu amor, oro todos os dias para que os seus sonhos sejam realizados, porque eles são os meus também.",
  "",
  "Você merece todas as coisas boas do mundo inteiro!",
  "",
  "Feliz aniversário meu amor, eu te amo muito e quero passar mais 80 aniversários ao seu lado, com a nossa família dos sonhos. Nenhum presente vai conseguir expressar todo o amor que eu tenho por você. FELIZ ANIVERSÁRIOO LINDAA 🌸",
];

interface GrassBlade {
  id: number;
  x: number;
  height: number;
  width: number;
  color: string;
  swayOffset: number;
}

export default function PageFinale({ onReplay }: PageFinaleProps) {
  const [letterOpen, setLetterOpen] = useState(false);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showEnding, setShowEnding] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [grassBlades] = useState<GrassBlade[]>(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: (i / 80) * 100 + (Math.random() - 0.5) * 2,
      height: 30 + Math.random() * 50,
      width: 3 + Math.random() * 4,
      color: `rgba(${80 + Math.random() * 40}, ${160 + Math.random() * 60}, ${60 + Math.random() * 40}, ${0.6 + Math.random() * 0.4})`,
      swayOffset: Math.random() * Math.PI * 2,
    }))
  );
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  // Animate grass on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timeRef.current += 0.02;

      const groundY = canvas.height * 0.72;

      for (const blade of grassBlades) {
        const bx = (blade.x / 100) * canvas.width;
        const mouseDist = Math.abs(mousePos.x - blade.x / 100);
        const mouseInfluence = Math.max(0, 1 - mouseDist * 4) * (mousePos.x > blade.x / 100 ? 1 : -1);
        const sway = Math.sin(timeRef.current + blade.swayOffset) * 8 + mouseInfluence * 20;

        ctx.save();
        ctx.strokeStyle = blade.color;
        ctx.lineWidth = blade.width;
        ctx.lineCap = "round";
        ctx.shadowBlur = 3;
        ctx.shadowColor = "rgba(100,180,80,0.3)";

        ctx.beginPath();
        ctx.moveTo(bx, groundY);
        ctx.quadraticCurveTo(
          bx + sway * 0.5,
          groundY - blade.height * 0.5,
          bx + sway,
          groundY - blade.height
        );
        ctx.stroke();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [grassBlades, mousePos]);

  const handleOpenLetter = useCallback(() => {
    setLetterOpen(true);
    let line = 0;
    const interval = setInterval(() => {
      line++;
      setVisibleLines(line);
      if (line >= LETTER_TEXT.length) {
        clearInterval(interval);
        setTimeout(() => setShowEnding(true), 800);
      }
    }, 400);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Sky gradient */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #87CEEB 0%, #B8E4FF 25%, #D4F0C0 55%, #8BC34A 70%, #6A9E3A 100%)",
      }} />

      {/* Sun */}
      <div className="absolute" style={{
        top: "8%", right: "15%",
        width: "80px", height: "80px",
        background: "radial-gradient(circle, rgba(255,240,180,1) 0%, rgba(255,220,100,0.8) 40%, transparent 70%)",
        borderRadius: "50%",
        boxShadow: "0 0 60px rgba(255,220,100,0.5), 0 0 120px rgba(255,200,50,0.2)",
      }} />

      {/* Clouds */}
      {[
        { x: "5%", y: "8%", w: 160, h: 50 },
        { x: "35%", y: "5%", w: 120, h: 40 },
        { x: "65%", y: "12%", w: 180, h: 55 },
        { x: "80%", y: "6%", w: 100, h: 35 },
      ].map((cloud, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: cloud.x, top: cloud.y,
            width: `${cloud.w}px`, height: `${cloud.h}px`,
            background: "rgba(255,255,255,0.85)",
            filter: "blur(6px)",
          }}
          animate={{ x: [0, 20, 0] }}
          transition={{ duration: 15 + i * 4, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}

      {/* Grass canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Ground */}
      <div className="absolute bottom-0 left-0 right-0" style={{
        height: "30%",
        background: "linear-gradient(to top, rgba(80,140,50,0.8) 0%, rgba(100,170,60,0.6) 40%, transparent 100%)",
      }} />

      {/* Animated characters */}
      <div className="absolute" style={{ bottom: "28%", left: "15%" }}>
        {/* Cat */}
        <motion.div
          animate={{ x: [0, 15, 0, -10, 0], y: [0, -5, 0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="relative" style={{ width: "50px", height: "50px" }}>
            {/* Cat body */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full" style={{
              width: "30px", height: "25px",
              background: "rgba(255,200,150,0.9)",
            }} />
            {/* Cat head */}
            <div className="absolute rounded-full" style={{
              width: "24px", height: "22px",
              background: "rgba(255,200,150,0.9)",
              top: "5px", left: "50%", transform: "translateX(-50%)",
            }}>
              {/* Ears */}
              <div className="absolute" style={{
                width: 0, height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderBottom: "10px solid rgba(255,200,150,0.9)",
                top: "-8px", left: "1px",
              }} />
              <div className="absolute" style={{
                width: 0, height: 0,
                borderLeft: "5px solid transparent",
                borderRight: "5px solid transparent",
                borderBottom: "10px solid rgba(255,200,150,0.9)",
                top: "-8px", right: "1px",
              }} />
              {/* Eyes */}
              <div className="absolute rounded-full" style={{
                width: "4px", height: "4px",
                background: "rgba(80,40,20,0.9)",
                top: "7px", left: "4px",
              }} />
              <div className="absolute rounded-full" style={{
                width: "4px", height: "4px",
                background: "rgba(80,40,20,0.9)",
                top: "7px", right: "4px",
              }} />
            </div>
            {/* Tail */}
            <div className="absolute" style={{
              width: "20px", height: "6px",
              background: "rgba(255,200,150,0.9)",
              borderRadius: "0 10px 10px 0",
              bottom: "8px", right: "-15px",
              transform: "rotate(-20deg)",
            }} />
          </div>
        </motion.div>
      </div>

      <div className="absolute" style={{ bottom: "27%", left: "22%" }}>
        {/* Puppy */}
        <motion.div
          animate={{ x: [0, -12, 5, 0], y: [0, -8, 0, -4, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        >
          <div className="relative" style={{ width: "55px", height: "55px" }}>
            {/* Puppy body */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-2xl" style={{
              width: "35px", height: "28px",
              background: "rgba(180,140,100,0.9)",
            }} />
            {/* Puppy head */}
            <div className="absolute rounded-full" style={{
              width: "28px", height: "26px",
              background: "rgba(180,140,100,0.9)",
              top: "3px", left: "50%", transform: "translateX(-50%)",
            }}>
              {/* Floppy ears */}
              <div className="absolute rounded-b-full" style={{
                width: "12px", height: "18px",
                background: "rgba(150,110,70,0.9)",
                top: "2px", left: "-8px",
              }} />
              <div className="absolute rounded-b-full" style={{
                width: "12px", height: "18px",
                background: "rgba(150,110,70,0.9)",
                top: "2px", right: "-8px",
              }} />
              {/* Eyes */}
              <div className="absolute rounded-full" style={{
                width: "5px", height: "5px",
                background: "rgba(60,30,10,0.9)",
                top: "8px", left: "4px",
              }} />
              <div className="absolute rounded-full" style={{
                width: "5px", height: "5px",
                background: "rgba(60,30,10,0.9)",
                top: "8px", right: "4px",
              }} />
              {/* Nose */}
              <div className="absolute rounded-full" style={{
                width: "6px", height: "4px",
                background: "rgba(80,40,20,0.9)",
                bottom: "5px", left: "50%", transform: "translateX(-50%)",
              }} />
            </div>
            {/* Tail wagging */}
            <motion.div
              className="absolute"
              style={{
                width: "18px", height: "5px",
                background: "rgba(180,140,100,0.9)",
                borderRadius: "0 10px 10px 0",
                bottom: "12px", right: "-12px",
              }}
              animate={{ rotate: [-30, 30, -30] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>

      {/* Floating flowers */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-lg"
          style={{
            left: `${10 + i * 11}%`,
            bottom: `${25 + Math.random() * 10}%`,
          }}
          animate={{
            y: [0, -10, 0],
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
        >
          {["🌸", "🌼", "🌺", "🌷", "🌻", "💐", "🌹", "🌸"][i]}
        </motion.div>
      ))}

      {/* Letter prompt */}
      <AnimatePresence>
        {!letterOpen && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
          >
            <motion.button
              onClick={handleOpenLetter}
              className="glass rounded-3xl p-8 text-center max-w-xs mx-4"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="text-4xl mb-3">💌</div>
              <p style={{
                fontFamily: "var(--font-cormorant)",
                color: "rgba(120,60,90,0.9)",
                fontSize: "1.1rem",
                letterSpacing: "0.1em",
              }}>
                Uma carta para voce!
              </p>
              <p className="mt-2" style={{
                fontFamily: "var(--font-cormorant)",
                color: "rgba(150,80,110,0.6)",
                fontSize: "0.8rem",
                letterSpacing: "0.05em",
              }}>
                clique para abrir
              </p>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letter */}
      <AnimatePresence>
        {letterOpen && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="relative rounded-3xl p-10 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              style={{
                background: "linear-gradient(135deg, rgba(255,248,220,0.97) 0%, rgba(255,235,180,0.95) 50%, rgba(255,245,210,0.97) 100%)",
                border: "1px solid rgba(220,190,140,0.5)",
                boxShadow: "0 20px 60px rgba(180,140,80,0.2), 0 0 0 1px rgba(220,190,140,0.3)",
              }}
              initial={{ scaleY: 0, originY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Parchment texture overlay */}
              <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{
                background: "repeating-linear-gradient(0deg, transparent, transparent 28px, rgba(180,140,80,0.05) 28px, rgba(180,140,80,0.05) 29px)",
              }} />

              {/* Letter header */}
              <div className="text-center mb-8">
                <div className="text-3xl mb-2">🌸</div>
                <div style={{
                  fontFamily: "var(--font-dancing)",
                  fontSize: "1.8rem",
                  color: "rgba(160,100,60,0.8)",
                }}>
                  Com todo o meu coração
                </div>
                <div className="mt-2 h-px" style={{
                  background: "linear-gradient(90deg, transparent, rgba(180,140,80,0.4), transparent)",
                }} />
              </div>

              {/* Letter content */}
              <div className="space-y-4">
                {LETTER_TEXT.slice(0, visibleLines).map((line, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      fontFamily: "var(--font-dancing)",
                      fontSize: line === "" ? "0.5rem" : "1.15rem",
                      color: "rgba(120,70,40,0.85)",
                      lineHeight: 1.8,
                      minHeight: line === "" ? "0.5rem" : undefined,
                    }}
                  >
                    {line}
                  </motion.p>
                ))}
              </div>

              {/* Ending options */}
              <AnimatePresence>
                {showEnding && (
                  <motion.div
                    className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <motion.button
                      onClick={onReplay}
                      className="px-8 py-3 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,150,180,0.7), rgba(255,222,233,0.8))",
                        fontFamily: "var(--font-cormorant)",
                        color: "rgba(140,60,90,0.9)",
                        letterSpacing: "0.2em",
                        border: "1px solid rgba(255,180,200,0.5)",
                        fontSize: "0.9rem",
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      ↺ Replay
                    </motion.button>
                    <motion.button
                      onClick={() => {
                        const content = LETTER_TEXT.join("\n");
                        const blob = new Blob([content], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url;
                        a.download = "birthday-letter.txt";
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="px-8 py-3 rounded-full"
                      style={{
                        background: "linear-gradient(135deg, rgba(255,215,0,0.5), rgba(255,235,150,0.6))",
                        fontFamily: "var(--font-cormorant)",
                        color: "rgba(140,100,20,0.9)",
                        letterSpacing: "0.2em",
                        border: "1px solid rgba(255,215,0,0.4)",
                        fontSize: "0.9rem",
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      💾 Save the Memory
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
