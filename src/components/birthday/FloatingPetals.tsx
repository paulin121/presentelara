
"use client";

import { useEffect, useRef } from "react";

interface Petal {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  phase: number;
}

const PETAL_COLORS = [
  "rgba(255, 182, 193, 0.7)",
  "rgba(255, 222, 233, 0.8)",
  "rgba(255, 160, 180, 0.6)",
  "rgba(255, 200, 215, 0.75)",
  "rgba(255, 240, 245, 0.9)",
  "rgba(255, 215, 230, 0.7)",
];

function createPetal(canvasWidth: number): Petal {
  return {
    x: Math.random() * canvasWidth,
    y: -20,
    size: Math.random() * 10 + 5,
    speed: Math.random() * 0.8 + 0.3,
    drift: (Math.random() - 0.5) * 0.5,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.04,
    opacity: Math.random() * 0.5 + 0.3,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    phase: Math.random() * Math.PI * 2,
  };
}

function drawPetal(ctx: CanvasRenderingContext2D, petal: Petal, time: number) {
  ctx.save();
  ctx.translate(petal.x, petal.y);
  ctx.rotate(petal.rotation + Math.sin(time * 0.001 + petal.phase) * 0.3);
  ctx.globalAlpha = petal.opacity;
  ctx.fillStyle = petal.color;
  ctx.beginPath();
  ctx.ellipse(0, 0, petal.size * 0.5, petal.size, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export default function FloatingPetals() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const petalsRef = useRef<Petal[]>([]);
  const animFrameRef = useRef<number>(0);

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

    for (let i = 0; i < 25; i++) {
      const p = createPetal(canvas.width);
      p.y = Math.random() * canvas.height;
      petalsRef.current.push(p);
    }

    let lastSpawn = 0;
    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (time - lastSpawn > 800 && petalsRef.current.length < 40) {
        petalsRef.current.push(createPetal(canvas.width));
        lastSpawn = time;
      }

      petalsRef.current = petalsRef.current.filter(p => p.y < canvas.height + 30);

      petalsRef.current.forEach(petal => {
        petal.y += petal.speed;
        petal.x += petal.drift + Math.sin(time * 0.0008 + petal.phase) * 0.4;
        petal.rotation += petal.rotationSpeed;
        drawPetal(ctx, petal, time);
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
    />
  );
}
