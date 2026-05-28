
"use client";

import { useEffect, useRef } from "react";

interface Sparkle {
  x: number;
  y: number;
  size: number;
  opacity: number;
  life: number;
  maxLife: number;
  vx: number;
  vy: number;
  hue: number;
}

export default function GlobalClientEffects() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const sparklesRef = useRef<Sparkle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animFrameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const cursor = cursorRef.current;
    if (!canvas || !cursor) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      if (cursor) {
        cursor.style.left = `${e.clientX}px`;
        cursor.style.top = `${e.clientY}px`;
      }

      // Spawn sparkles
      for (let i = 0; i < 3; i++) {
        const hue = Math.random() > 0.5 ? 340 + Math.random() * 30 : 180 + Math.random() * 40;
        sparklesRef.current.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          size: Math.random() * 4 + 1,
          opacity: 1,
          life: 0,
          maxLife: 30 + Math.random() * 20,
          vx: (Math.random() - 0.5) * 2,
          vy: (Math.random() - 0.5) * 2 - 1,
          hue,
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      sparklesRef.current = sparklesRef.current.filter((s) => s.life < s.maxLife);

      for (const s of sparklesRef.current) {
        s.life++;
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.05;
        s.opacity = 1 - s.life / s.maxLife;

        ctx.save();
        ctx.globalAlpha = s.opacity;
        ctx.fillStyle = `hsl(${s.hue}, 90%, 75%)`;
        ctx.shadowBlur = 6;
        ctx.shadowColor = `hsl(${s.hue}, 90%, 75%)`;

        // Draw star shape
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2;
          const r = i % 2 === 0 ? s.size : s.size * 0.4;
          ctx.lineTo(
            s.x + r * Math.cos(angle),
            s.y + r * Math.sin(angle)
          );
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <>
      {/* Sparkle canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-[9999]"
        style={{ mixBlendMode: "screen" }}
      />
      {/* Custom cursor */}
      <div
        ref={cursorRef}
        className="fixed pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "14px",
          height: "14px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,200,220,1) 0%, rgba(255,150,180,0.8) 50%, transparent 100%)",
          boxShadow: "0 0 10px rgba(255,150,180,0.8), 0 0 20px rgba(255,150,180,0.4)",
          transition: "transform 0.05s ease",
        }}
      />
    </>
  );
}
