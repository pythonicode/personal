"use client";

import { motion } from "motion/react";

export function Wiggle({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      animate={{
        rotate: [0, -5, 0],
        transition: {
          duration: 0.5,
          repeat: Infinity,
          repeatDelay: 4,
          ease: "easeInOut"
        }
      }}
    >
      {children}
    </motion.div>
  );
}
