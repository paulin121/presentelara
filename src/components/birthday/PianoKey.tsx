
"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface PianoKeyProps {
  note: string;
  isBlack?: boolean;
  isActive?: boolean;
  isHighlighted?: boolean;
  onPress: (note: string) => void;
  index: number;
}

export default function PianoKey({ note, isBlack, isActive, isHighlighted, onPress, index }: PianoKeyProps) {
  const [pressed, setPressed] = useState(false);

  const handlePress = () => {
    setPressed(true);
    onPress(note);
    setTimeout(() => setPressed(false), 300);
  };

  if (isBlack) {
    return (
      <motion.button
        onClick={handlePress}
        className="absolute z-10 rounded-b-md"
        style={{
          width: "7%",
          height: "60%",
          top: 0,
          left: `${index}%`,
          background: pressed
            ? "linear-gradient(180deg, #FFD700 0%, #333 100%)"
            : "linear-gradient(180deg, #2a2a2a 0%, #111 100%)",
          boxShadow: pressed
            ? "0 0 20px rgba(255,215,0,0.8), 0 4px 8px rgba(0,0,0,0.5)"
            : "0 4px 8px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        animate={isHighlighted ? {
          boxShadow: ["0 0 0px rgba(255,215,0,0)", "0 0 30px rgba(255,215,0,0.9)", "0 0 0px rgba(255,215,0,0)"],
        } : {}}
        transition={{ duration: 0.8, repeat: isHighlighted ? Infinity : 0 }}
        whileTap={{ scaleY: 0.95 }}
      />
    );
  }

  return (
    <motion.button
      onClick={handlePress}
      className="relative rounded-b-lg flex items-end justify-center pb-3"
      style={{
        flex: 1,
        height: "100%",
        background: pressed
          ? "linear-gradient(180deg, #FFE4E1 0%, #FFD700 100%)"
          : isHighlighted
          ? "linear-gradient(180deg, rgba(255,222,233,0.9) 0%, rgba(255,182,193,0.7) 100%)"
          : "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(240,230,240,0.9) 100%)",
        boxShadow: pressed
          ? "0 0 30px rgba(255,215,0,0.6), inset 0 2px 4px rgba(0,0,0,0.1)"
          : "0 4px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)",
        border: "1px solid rgba(200,180,200,0.4)",
        backdropFilter: "blur(10px)",
        margin: "0 1px",
      }}
      animate={isHighlighted ? {
        background: [
          "linear-gradient(180deg, rgba(255,222,233,0.9) 0%, rgba(255,182,193,0.7) 100%)",
          "linear-gradient(180deg, rgba(255,215,0,0.3) 0%, rgba(255,182,193,0.9) 100%)",
          "linear-gradient(180deg, rgba(255,222,233,0.9) 0%, rgba(255,182,193,0.7) 100%)",
        ],
      } : {}}
      transition={{ duration: 0.8, repeat: isHighlighted ? Infinity : 0 }}
      whileTap={{ scaleY: 0.97 }}
    >
      {pressed && (
        <motion.div
          className="absolute inset-0 rounded-b-lg"
          style={{ background: "radial-gradient(circle at 50% 80%, rgba(255,215,0,0.4) 0%, transparent 70%)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.3 }}
        />
      )}
      <span className="text-xs opacity-30" style={{ fontFamily: "var(--font-inter)", color: "#8B7B8B" }}>
        {note.replace(/\d/, "")}
      </span>
    </motion.button>
  );
}
