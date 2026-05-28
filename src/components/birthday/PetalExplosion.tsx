
"use client";

import { useEffect, useRef } from "react";

interface ExplosionPetal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  gravity: number;
  life: number;
  maxLife: number;
}

interface GoldParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  color: string;
}

const EXPLOSION_COLORS = [
  "#FFB3CC", "#FFDEE9", "#FF69B4", "#FFD700", "#FFF0A0",
  "#FF1493", "#FFE4E1", "#B5FFFC", "#87CEEB", "#FFC0CB",
];

const GOLD_COLORS = ["#FFD700", "#FFF0A0", "#FFEC8B", "#FFD700", "#FFFACD"];

interface Props {
  active: boolean;
  originX: number;
  originY: number;
  onComplete?: () => void;
}

export default function PetalExplosion({ active, originX, originY, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<ExplosionPetal[]>([]);
  const goldRef = useRef<GoldParticle[]>([]);
  const animRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);
  const completedRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    completedRef.current = false;

    // Create petals
    petalsRef.current = Array.from({ length: 120 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 3;
      return {
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 6,
        size: Math.random() * 14 + 5,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.15,
        opacity: 1,
        color: EXPLOSION_COLORS[Math.floor(Math.random() * EXPLOSION_COLORS.length)],
        gravity: 0.15 + Math.random() * 0.1,
        life: 0,
        maxLife: 120 + Math.random() * 80,
      };
    });

    // Create gold particles
    goldRef.current = Array.from({ length: 80 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 15 + 5;
      return {
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - Math.random() * 8,
        size: Math.random() * 4 + 1,
        opacity: 1,
        life: 0,
        maxLife: 80 + Math.random() * 60,
        color: GOLD_COLORS[Math.floor(Math.random() * GOLD_COLORS.length)],
      };
    });

    startTimeRef.current = performance.now();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let allDone = true;

      // Draw bloom glow
      const elapsed = performance.now() - startTimeRef.current;
      if (elapsed < 600) {
        const bloomAlpha = Math.max(0, 1 - elapsed / 600) * 0.6;
        const gradient = ctx.createRadialGradient(originX, originY, 0, originX, originY, 200);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${bloomAlpha})`);
        gradient.addColorStop(0.3, `rgba(255, 220, 240, ${bloomAlpha * 0.6})`);
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Draw petals
      petalsRef.current.forEach(p => {
        if (p.life >= p.maxLife) return;
        allDone = false;
        p.life++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, 1 - p.life / p.maxLife);

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.4, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw gold particles
      goldRef.current.forEach(g => {
        if (g.life >= g.maxLife) return;
        allDone = false;
        g.life++;
        g.x += g.vx;
        g.y += g.vy;
        g.vy += 0.2;
        g.vx *= 0.98;
        g.opacity = Math.max(0, 1 - g.life / g.maxLife);

        ctx.save();
        ctx.globalAlpha = g.opacity;
        ctx.fillStyle = g.color;
        ctx.shadowColor = g.color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      if (allDone && !completedRef.current) {
        completedRef.current = true;
        onComplete?.();
        return;
      }

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animRef.current);
  }, [active, originX, originY, onComplete]);

  if (!active) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
}
