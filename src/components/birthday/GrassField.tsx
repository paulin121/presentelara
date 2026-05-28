
"use client";

import { useEffect, useRef } from "react";

interface GrassFieldProps {
  mouseX: number;
  mouseY: number;
}

interface GrassBlade {
  x: number;
  baseY: number;
  height: number;
  width: number;
  color: string;
  swayOffset: number;
  swaySpeed: number;
}

export default function GrassField({ mouseX, mouseY }: GrassFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bladesRef = useRef<GrassBlade[]>([]);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateBlades();
    };

    const generateBlades = () => {
      const blades: GrassBlade[] = [];
      const count = Math.floor(canvas.width / 4);
      const grassColors = ["#7CB87C", "#8BC88B", "#6AAB6A", "#9DD49D", "#5A9A5A", "#A8D8A8"];
      for (let i = 0; i < count; i++) {
        blades.push({
          x: (i / count) * canvas.width + Math.random() * 8 - 4,
          baseY: canvas.height * 0.72 + Math.random() * 20,
          height: 30 + Math.random() * 50,
          width: 2 + Math.random() * 3,
          color: grassColors[Math.floor(Math.random() * grassColors.length)],
          swayOffset: Math.random() * Math.PI * 2,
          swaySpeed: 0.5 + Math.random() * 1,
        });
      }
      bladesRef.current = blades;
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      timeRef.current += 0.02;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      bladesRef.current.forEach((blade) => {
        const distX = (mouseX / window.innerWidth) * canvas.width - blade.x;
        const distY = (mouseY / window.innerHeight) * canvas.height - blade.baseY;
        const dist = Math.sqrt(distX * distX + distY * distY);
        const influence = Math.max(0, 1 - dist / 200) * 0.4;
        const mouseAngle = influence * (distX > 0 ? 0.3 : -0.3);
        const windSway = Math.sin(timeRef.current * blade.swaySpeed + blade.swayOffset) * 0.08;
        const totalSway = windSway + mouseAngle;

        ctx.save();
        ctx.translate(blade.x, blade.baseY);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        const cp1x = totalSway * blade.height * 0.5;
        const cp1y = -blade.height * 0.5;
        const cp2x = totalSway * blade.height;
        const cp2y = -blade.height * 0.8;
        const endX = totalSway * blade.height * 1.2;
        const endY = -blade.height;
        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
        ctx.lineWidth = blade.width;
        ctx.strokeStyle = blade.color;
        ctx.lineCap = "round";
        ctx.globalAlpha = 0.85;
        ctx.stroke();
        ctx.restore();
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [mouseX, mouseY]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />;
}
