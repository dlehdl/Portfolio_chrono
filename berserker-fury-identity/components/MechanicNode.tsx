import React from 'react';
import { motion } from 'framer-motion';

interface MechanicNodeProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  isActive: boolean;
  description: string;
  highlightColor?: string;
  onClick?: () => void;
  isButton?: boolean;
}

export const MechanicNode: React.FC<MechanicNodeProps> = ({
  title,
  subtitle,
  icon,
  isActive,
  description,
  highlightColor = "text-berserker-500",
  onClick,
  isButton = false
}) => {
  return (
    <div className="flex flex-col items-center text-center space-y-4 max-w-[280px] relative group">
      {/* Title Section */}
      <div className="uppercase tracking-widest text-xs text-zinc-500 font-display">
        {subtitle}
      </div>

      {/* Icon Container */}
      <motion.button
        whileHover={isButton ? { scale: 1.05 } : {}}
        whileTap={isButton ? { scale: 0.95 } : {}}
        onClick={onClick}
        disabled={!isButton}
        className={`
          relative w-24 h-24 rounded-full border-2 flex items-center justify-center
          transition-all duration-300 z-10 bg-zinc-900/80 backdrop-blur-sm
          ${isActive 
            ? `border-berserker-500 shadow-[0_0_30px_rgba(220,38,38,0.4)]` 
            : 'border-zinc-800 text-zinc-600'}
          ${isButton ? 'cursor-pointer hover:border-zinc-500' : 'cursor-default'}
        `}
      >
        <div className={`transition-colors duration-300 ${isActive ? 'text-white' : 'text-zinc-600'}`}>
          {icon}
        </div>
        
        {/* Ripple Effect for active state */}
        {isActive && (
          <motion.div
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="absolute inset-0 rounded-full border border-berserker-500"
          />
        )}
      </motion.button>

      {/* Description Section */}
      <div className="space-y-1">
        <h3 className={`text-xl font-bold transition-colors duration-300 ${isActive ? 'text-white' : 'text-zinc-500'}`}>
          {title}
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed min-h-[40px]">
          {description}
        </p>
      </div>
      
      {/* Connecting Line (Decorative) */}
      <div className="hidden md:block absolute top-12 left-1/2 -z-10 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-800 to-transparent" />
    </div>
  );
};
