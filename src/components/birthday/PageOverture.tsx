
"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Petal {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface PageOvertureProps {
  onComplete: () => void;
}

const PETAL_COLORS = [
  "rgba(255, 182, 193, 0.9)",
  "rgba(255, 218, 230, 0.9)",
  "rgba(255, 200, 215, 0.85)",
  "rgba(255, 240, 245, 0.8)",
  "rgba(255, 160, 180, 0.85)",
];

const GOLD_COLORS = [
  "rgba(255, 215, 0, 0.9)",
  "rgba(255, 235, 100, 0.85)",
  "rgba(255, 200, 50, 0.8)",
  "rgba(255, 248, 180, 0.9)",
];

export default function PageOverture({ onComplete }: PageOvertureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const explodedRef = useRef(false);
  const [phase, setPhase] = useState<"orb" | "explosion" | "title" | "exit">("orb");
  const [orbClicked, setOrbClicked] = useState(false);
  const idCounterRef = useRef(0);

  const spawnExplosion = useCallback((cx: number, cy: number) => {
    const newPetals: Petal[] = [];
    const newParticles: Particle[] = [];

    for (let i = 0; i < 200; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 2;
      newPetals.push({
        id: idCounterRef.current++,
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 8,
        size: Math.random() * 14 + 6,
        opacity: 1,
        color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
        life: 0,
        maxLife: 120 + Math.random() * 80,
      });
    }

    for (let i = 0; i < 150; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 15 + 3;
      newParticles.push({
        id: idCounterRef.current++,
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 8,
        size: Math.random() * 5 + 1,
        opacity: 1,
        color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
        life: 0,
        maxLife: 80 + Math.random() * 60,
      });
    }

    petalsRef.current = newPetals;
    particlesRef.current = newParticles;
  }, []);

  const drawPetal = useCallback((ctx: CanvasRenderingContext2D, petal: Petal) => {
    ctx.save();
    ctx.translate(petal.x, petal.y);
    ctx.rotate((petal.rotation * Math.PI) / 180);
    ctx.globalAlpha = petal.opacity;
    ctx.fillStyle = petal.color;
    ctx.shadowBlur = 8;
    ctx.shadowColor = "rgba(255, 150, 180, 0.5)";

    ctx.beginPath();
    ctx.moveTo(0, -petal.size / 2);
    ctx.bezierCurveTo(
      petal.size / 2, -petal.size / 2,
      petal.size / 2, petal.size / 2,
      0, petal.size / 2
    );
    ctx.bezierCurveTo(
      -petal.size / 2, petal.size / 2,
      -petal.size / 2, -petal.size / 2,
      0, -petal.size / 2
    );
    ctx.fill();
    ctx.restore();
  }, []);

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

      // Update and draw petals
      petalsRef.current = petalsRef.current.filter((p) => p.life < p.maxLife);
      for (const petal of petalsRef.current) {
        petal.life++;
        petal.x += petal.vx;
        petal.y += petal.vy;
        petal.vy += 0.15;
        petal.vx *= 0.99;
        petal.rotation += petal.rotationSpeed;
        petal.opacity = Math.max(0, 1 - petal.life / petal.maxLife);
        drawPetal(ctx, petal);
      }

      // Update and draw gold particles
      particlesRef.current = particlesRef.current.filter((p) => p.life < p.maxLife);
      for (const particle of particlesRef.current) {
        particle.life++;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += 0.2;
        particle.vx *= 0.98;
        particle.opacity = Math.max(0, 1 - particle.life / particle.maxLife);

        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(255, 215, 0, 0.8)";
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [drawPetal]);

  const handleOrbClick = useCallback(() => {
    if (explodedRef.current) return;
    explodedRef.current = true;
    setOrbClicked(true);
    setPhase("explosion");

    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 2;
    spawnExplosion(cx, cy);

    setTimeout(() => setPhase("title"), 1800);
  }, [spawnExplosion]);

  const handleStart = useCallback(() => {
    setPhase("exit");
    setTimeout(() => onComplete(), 900);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 mesh-gradient overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${200 + i * 80}px`,
              height: `${200 + i * 80}px`,
              background: i % 2 === 0
                ? "radial-gradient(circle, rgba(255,222,233,0.4) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(181,255,252,0.3) 0%, transparent 70%)",
              left: `${10 + i * 18}%`,
              top: `${10 + i * 15}%`,
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -20, 30, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Petal/particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* Orb */}
      <AnimatePresence>
        {phase === "orb" && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 3 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              onClick={handleOrbClick}
              className="relative flex items-center justify-center rounded-full glass orb-pulse"
              style={{
                width: "180px",
                height: "180px",
                background: "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.6) 0%, rgba(255,222,233,0.3) 40%, rgba(181,255,252,0.2) 100%)",
                border: "1px solid rgba(255,255,255,0.6)",
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              {/* Inner glow rings */}
              <div className="absolute inset-0 rounded-full" style={{
                background: "radial-gradient(circle at 40% 30%, rgba(255,255,255,0.4) 0%, transparent 60%)",
              }} />
              <div className="absolute rounded-full" style={{
                width: "140px", height: "140px",
                border: "1px solid rgba(255,200,220,0.4)",
              }} />
              <div className="absolute rounded-full" style={{
                width: "100px", height: "100px",
                border: "1px solid rgba(255,200,220,0.3)",
              }} />
              <span
                className="relative z-10 text-sm tracking-[0.3em] uppercase"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  color: "rgba(180, 100, 130, 0.9)",
                  fontWeight: 300,
                }}
              >
                Toque!
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explosion flash */}
      <AnimatePresence>
        {orbClicked && (
          <motion.div
            className="absolute inset-0 z-30 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.8, 0] }}
            transition={{ duration: 0.4, times: [0, 0.2, 1] }}
            style={{ background: "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,222,233,0.5) 50%, transparent 100%)" }}
          />
        )}
      </AnimatePresence>

      {/* Title phase */}
      <AnimatePresence>
        {(phase === "title" || phase === "exit") && (
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "exit" ? 0 : 1 }}
            transition={{ duration: phase === "exit" ? 0.8 : 1.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="text-center mb-16"
            >
              <div
                className="text-7xl md:text-9xl mb-4 tracking-widest"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontWeight: 300,
                  background: "linear-gradient(135deg, rgba(180,80,120,0.9) 0%, rgba(255,150,180,0.8) 50%, rgba(255,215,0,0.9) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "none",
                  letterSpacing: "0.15em",
                }}
              >
                Feliz
              </div>
              <div
                className="text-7xl md:text-9xl tracking-widest"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontWeight: 300,
                  background: "linear-gradient(135deg, rgba(255,215,0,0.9) 0%, rgba(255,150,180,0.8) 50%, rgba(181,255,252,0.9) 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  letterSpacing: "0.15em",
                }}
              >
                Aniversário amor!
              </div>
            </motion.div>

            <motion.button
              onClick={handleStart}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="relative px-12 py-4 rounded-full glass breathing-glow"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontWeight: 300,
                fontSize: "1.1rem",
                letterSpacing: "0.3em",
                color: "rgba(160, 80, 110, 0.9)",
                border: "1px solid rgba(255,200,220,0.5)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10 uppercase tracking-widest">Começar</span>
              <div className="absolute inset-0 rounded-full" style={{
                background: "linear-gradient(135deg, rgba(255,222,233,0.3) 0%, rgba(181,255,252,0.2) 100%)",
              }} />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
