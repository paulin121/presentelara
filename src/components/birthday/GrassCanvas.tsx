
"use client";

import { useEffect, useRef } from "react";

interface GrassBlade {
  x: number;
  baseHeight: number;
  width: number;
  color: string;
  swayOffset: number;
  swaySpeed: number;
}

interface Props {
  mouseX: number;
  mouseY: number;
}

export default function GrassCanvas({ mouseX, mouseY }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bladesRef = useRef<GrassBlade[]>([]);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({ x: mouseX, y: mouseY });

  useEffect(() => {
    mouseRef.current = { x: mouseX, y: mouseY };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initBlades();
    };

    const GRASS_COLORS = [
      "#4CAF50", "#66BB6A", "#81C784", "#388E3C",
      "#43A047", "#2E7D32", "#558B2F", "#7CB342",
    ];

    const initBlades = () => {
      bladesRef.current = [];
      const count = Math.floor(canvas.width / 6);
      for (let i = 0; i < count; i++) {
        bladesRef.current.push({
          x: (i / count) * canvas.width + (Math.random() - 0.5) * 8,
          baseHeight: 40 + Math.random() * 60,
          width: 2 + Math.random() * 3,
          color: GRASS_COLORS[Math.floor(Math.random() * GRASS_COLORS.length)],
          swayOffset: Math.random() * Math.PI * 2,
          swaySpeed: 0.5 + Math.random() * 1,
        });
      }
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const groundY = canvas.height * 0.72;
      const mx = mouseRef.current.x;

      bladesRef.current.forEach(blade => {
        const dist = Math.abs(blade.x - mx);
        const influence = Math.max(0, 1 - dist / 200);
        const mouseDir = blade.x < mx ? -1 : 1;
        const mouseSway = influence * mouseDir * -25;

        const naturalSway = Math.sin(time * 0.001 * blade.swaySpeed + blade.swayOffset) * 8;
        const totalSway = naturalSway + mouseSway;

        const tipX = blade.x + totalSway;
        const tipY = groundY - blade.baseHeight;
        const ctrlX = blade.x + totalSway * 0.6;
        const ctrlY = groundY - blade.baseHeight * 0.5;

        ctx.beginPath();
        ctx.moveTo(blade.x, groundY);
        ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
        ctx.lineWidth = blade.width;
        ctx.strokeStyle = blade.color;
        ctx.globalAlpha = 0.85;
        ctx.stroke();
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
    />
  );
}

