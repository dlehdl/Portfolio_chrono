import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface FuryGaugeProps {
  value: number;
  max: number;
  isDecaying: boolean;
}

export const FuryGauge: React.FC<FuryGaugeProps> = ({ value, max, isDecaying }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  const controls = useAnimation();
  
  // Shake animation when high fury
  useEffect(() => {
    if (percentage > 80) {
      controls.start({
        x: [0, -1, 1, -1, 0],
        transition: { repeat: Infinity, duration: 0.2 }
      });
    } else {
      controls.stop();
      controls.set({ x: 0 });
    }
  }, [percentage, controls]);

  return (
    <motion.div 
      className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center"
      animate={controls}
    >
      {/* Background Track */}
      <svg className="absolute inset-0 w-full h-full rotate-[-90deg]" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          stroke="#27272a"
          strokeWidth="6"
        />
        {/* Fill Track */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="transparent"
          stroke={percentage > 90 ? '#ef4444' : '#b91c1c'}
          strokeWidth="6"
          strokeDasharray="283" // 2 * pi * 45
          strokeDashoffset={283 - (283 * percentage) / 100}
          strokeLinecap="round"
          className="filter drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]"
          initial={{ strokeDashoffset: 283 }}
          animate={{ 
            strokeDashoffset: 283 - (283 * percentage) / 100,
            stroke: percentage >= 100 ? '#fca5a5' : '#b91c1c'
          }}
          transition={{ type: "spring", stiffness: 50, damping: 15 }}
        />
      </svg>

      {/* Inner Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
        <motion.div
          animate={{ scale: percentage >= 100 ? [1, 1.1, 1] : 1 }}
          transition={{ repeat: percentage >= 100 ? Infinity : 0, duration: 0.5 }}
        >
          <div className="text-zinc-500 font-display text-sm tracking-[0.2em] mb-1">FURY</div>
          <div className={`text-6xl font-black font-sans tabular-nums tracking-tighter ${percentage === 100 ? 'text-white glow-text' : 'text-berserker-400'}`}>
            {Math.floor(value)}
          </div>
          <div className="text-zinc-600 text-xs mt-2 uppercase tracking-wider font-bold">
            {isDecaying && value > 0 ? (
              <span className="flex items-center gap-1 text-zinc-500 animate-pulse">
                ▼ Decaying
              </span>
            ) : percentage === 100 ? (
              <span className="text-white animate-pulse">MAXIMUM</span>
            ) : (
              <span>/ {max}</span>
            )}
          </div>
        </motion.div>
      </div>

      {/* Decorative Particles/Glow behind */}
      <div className={`absolute inset-0 rounded-full blur-[60px] transition-opacity duration-500 ${percentage > 0 ? 'bg-berserker-600/20' : 'bg-transparent'}`} />
      
      {/* Burst Effect when full */}
      {percentage === 100 && (
         <motion.div
           initial={{ opacity: 0, scale: 0.8 }}
           animate={{ opacity: [0, 0.5, 0], scale: [0.8, 1.2, 1.4] }}
           transition={{ repeat: Infinity, duration: 2 }}
           className="absolute inset-0 border-2 border-berserker-400 rounded-full"
         />
      )}
    </motion.div>
  );
};
