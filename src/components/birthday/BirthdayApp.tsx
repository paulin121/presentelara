
"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageOverture from "./PageOverture";
import PagePiano from "./PagePiano";
import PageCakeRoom from "./PageCakeRoom";
import PageFinale from "./PageFinale";

type Scene = "overture" | "piano" | "cake" | "finale";

const SCENE_ORDER: Scene[] = ["overture", "piano", "cake", "finale"];

export default function BirthdayApp() {
  const [currentScene, setCurrentScene] = useState<Scene>("overture");
  const [transitioning, setTransitioning] = useState(false);

  const goToScene = useCallback((scene: Scene) => {
    if (transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      setCurrentScene(scene);
      setTransitioning(false);
    }, 300);
  }, [transitioning]);

  const handleOvertureComplete = useCallback(() => goToScene("piano"), [goToScene]);
  const handlePianoComplete = useCallback(() => goToScene("cake"), [goToScene]);
  const handleCakeComplete = useCallback(() => goToScene("finale"), [goToScene]);
  const handleReplay = useCallback(() => goToScene("overture"), [goToScene]);

  // Chapter indicator
  const chapterIndex = SCENE_ORDER.indexOf(currentScene);
  const chapterLabels = ["I", "II", "III", "IV"];
  const chapterNames = ["Overture", "Melody", "Ritual", "Finale"];

  return (
    <div className="fixed inset-0 overflow-hidden" style={{ perspective: "1000px" }}>
      {/* Scene renderer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 0.85, filter: "blur(20px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.15, filter: "blur(20px)" }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {currentScene === "overture" && (
            <PageOverture onComplete={handleOvertureComplete} />
          )}
          {currentScene === "piano" && (
            <PagePiano onComplete={handlePianoComplete} />
          )}
          {currentScene === "cake" && (
            <PageCakeRoom onComplete={handleCakeComplete} />
          )}
          {currentScene === "finale" && (
            <PageFinale onReplay={handleReplay} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Chapter indicator */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <motion.div
          className="glass rounded-full px-6 py-2 flex items-center gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          {SCENE_ORDER.map((scene, i) => (
            <div key={scene} className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 transition-all duration-500"
                style={{ opacity: i === chapterIndex ? 1 : 0.35 }}
              >
                <div
                  className="rounded-full transition-all duration-500"
                  style={{
                    width: i === chapterIndex ? "8px" : "5px",
                    height: i === chapterIndex ? "8px" : "5px",
                    background: i === chapterIndex
                      ? "linear-gradient(135deg, rgba(255,150,180,1), rgba(255,215,0,0.9))"
                      : "rgba(180,140,160,0.5)",
                  }}
                />
                {i === chapterIndex && (
                  <span style={{
                    fontFamily: "var(--font-cormorant)",
                    fontSize: "0.7rem",
                    color: "rgba(140,70,100,0.8)",
                    letterSpacing: "0.15em",
                    whiteSpace: "nowrap",
                  }}>
                    {chapterLabels[i]}. {chapterNames[i]}
                  </span>
                )}
              </div>
              {i < SCENE_ORDER.length - 1 && (
                <div style={{
                  width: "20px", height: "1px",
                  background: "rgba(180,140,160,0.3)",
                }} />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
