
"use client";

import { motion } from "framer-motion";

interface SceneTransitionProps {
  isActive: boolean;
  direction?: "in" | "out";
}

export default function SceneTransition({ isActive, direction = "in" }: SceneTransitionProps) {
  if (!isActive) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 pointer-events-none"
      style={{
        background: "radial-gradient(circle at center, rgba(255,222,233,0.95) 0%, rgba(181,255,252,0.9) 100%)",
      }}
      initial={{ opacity: direction === "in" ? 1 : 0, scale: direction === "in" ? 0.5 : 1 }}
      animate={{ opacity: 0, scale: direction === "in" ? 1 : 2 }}
      transition={{ duration: 0.8, ease: "easeInOut" }}
    />
  );
}
