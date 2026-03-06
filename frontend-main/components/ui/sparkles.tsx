"use client";
import React, { useMemo } from "react";
import { motion } from "motion/react";
import { cn } from "../../lib/utils";

interface SparklesProps {
  className?: string;
  particleColor?: string;
  particleDensity?: number;
  minSize?: number;
  maxSize?: number;
}

export const SparklesCore = ({
  className,
  particleColor = "#FFFFFF",
  particleDensity = 100,
  minSize = 0.4,
  maxSize = 1.5,
}: SparklesProps) => {
  const particles = useMemo(() => {
    return Array.from({ length: particleDensity }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (maxSize - minSize) + minSize,
      duration: Math.random() * 2 + 1,
      delay: Math.random() * 2,
    }));
  }, [particleDensity, minSize, maxSize]);

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: particleColor,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
