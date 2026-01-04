'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface RevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export const Reveal = ({ 
  children, 
  width = "100%", 
  delay = 0.2, 
  direction = "up" 
}: RevealProps) => {
  const directions = {
    up: { y: 20, x: 0 },
    down: { y: -20, x: 0 },
    left: { x: 20, y: 0 },
    right: { x: -20, y: 0 },
  };

  return (
    <motion.div
      variants={{
        hidden: { 
          opacity: 0, 
          y: directions[direction].y, 
          x: directions[direction].x 
        },
        visible: { 
          opacity: 1, 
          y: 0, 
          x: 0 
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ 
        duration: 0.6, 
        delay: delay,
        ease: "easeOut"
      }}
      style={{ width }}
    >
      {children}
    </motion.div>
  );
};
