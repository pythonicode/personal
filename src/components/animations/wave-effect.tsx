"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/css";

interface WaveEffectProps {
  children: React.ReactNode;
  color?: string;
  className?: string;
  duration?: number;
}

export function WaveEffect({
  children,
  color,
  className,
  duration = 0.6,
}: WaveEffectProps) {
  const [keyValue, setKeyValue] = useState<number>(0);
  const [ripple, setRipple] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [showRipple, setShowRipple] = useState<boolean>(false);
  const [direction, setDirection] = useState<"out" | "in">("in");

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.width / 2;

    setKeyValue((prev) => prev + 1);
    setRipple({ x, y });
    setDirection("out");
    setShowRipple(true);
  };

  const handleMouseExit = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.width / 2;

    setKeyValue((prev) => prev+1);
    setRipple({ x, y });
    setDirection("in");
  };

  return (
    <div
      className={cn("inline-flex relative overflow-hidden", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseExit}
    >
      {children}
      {showRipple && (
        <motion.span
          key={keyValue}
          className={cn(
            "absolute aspect-square bg-black dark:bg-white bg-opacity-10 dark:bg-opacity-10 rounded-full pointer-events-none start-0 top-0",
            color
          )}
          initial={{ 
            opacity: direction === "in" ? 1 : 0,
            scale: direction === "in" ? 3.5 : 0.5 
          }}
          animate={{ 
            opacity: direction === "in" ? 0 : 1,
            scale: direction === "in" ? 0.5 : 3.5
          }}
          transition={{ duration, ease: "easeOut" }}
          style={{
            top: ripple.y,
            left: ripple.x,
            width: "100%",
          }}
        />
      )}
    </div>
  );
}
