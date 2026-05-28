
"use client";

import { useEffect, useRef } from "react";

interface Petal {
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
  type: "petal" | "particle";
}

interface PetalCanvasProps {
  exploding: boolean;
  centerX?: number;
  centerY?: number;
}

const PETAL_COLORS = ["#FFB6C1", "#FF69B4", "#FFD700", "#FFDEE9", "#FFC0CB", "#B5FFFC", "#FFF8DC"];

export default function PetalCanvas({ exploding, centerX, centerY }: PetalCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const animFrameRef = useRef<number>(0);
  const explodedRef = useRef(false);

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

    const cx = centerX ?? canvas.width / 2;
    const cy = centerY ?? canvas.height / 2;

    if (exploding && !explodedRef.current) {
      explodedRef.current = true;
      const newPetals: Petal[] = [];
      for (let i = 0; i < 220; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 12 + 3;
        const isPetal = Math.random() > 0.3;
        newPetals.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 6,
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.2,
          size: isPetal ? Math.random() * 14 + 6 : Math.random() * 5 + 2,
          opacity: 1,
          color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
          life: 0,
          maxLife: Math.random() * 120 + 80,
          type: isPetal ? "petal" : "particle",
        });
      }
      petalsRef.current = newPetals;
    }

    const drawPetal = (ctx: CanvasRenderingContext2D, p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;
      if (p.type === "petal") {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size * 0.5, p.size, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(p.size * 0.3, 0, p.size * 0.4, p.size * 0.8, Math.PI / 4, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}88`;
        ctx.fill();
      } else {
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petalsRef.current = petalsRef.current.filter((p) => p.life < p.maxLife);
      petalsRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        p.life++;
        p.opacity = Math.max(0, 1 - p.life / p.maxLife);
        drawPetal(ctx, p);
      });
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [exploding, centerX, centerY]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
    />
  );
}
