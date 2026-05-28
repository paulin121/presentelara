
"use client";

import { motion } from "framer-motion";

interface FloatingOrb {
  id: number;
  size: number;
  x: string;
  y: string;
  color: string;
  duration: number;
  delay: number;
}

const ORBS: FloatingOrb[] = [
  { id: 1, size: 400, x: "10%", y: "20%", color: "rgba(255,222,233,0.5)", duration: 8, delay: 0 },
  { id: 2, size: 300, x: "70%", y: "10%", color: "rgba(181,255,252,0.4)", duration: 10, delay: 2 },
  { id: 3, size: 350, x: "50%", y: "60%", color: "rgba(255,182,193,0.35)", duration: 12, delay: 1 },
  { id: 4, size: 250, x: "85%", y: "70%", color: "rgba(255,248,220,0.45)", duration: 9, delay: 3 },
  { id: 5, size: 200, x: "20%", y: "75%", color: "rgba(181,255,252,0.3)", duration: 11, delay: 0.5 },
];

export default function MeshBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-80" />
      {ORBS.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full blur-3xl"
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            background: orb.color,
            transform: "translate(-50%, -50%)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 20, -10, 0],
            y: [0, -15, 10, 0],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
