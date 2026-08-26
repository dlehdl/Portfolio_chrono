import React from 'react';
import { motion } from 'framer-motion';

interface SectionProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  theme?: 'dark' | 'light';
  variant?: 'archival';
}

const Section: React.FC<SectionProps> = ({ id, children, className = "", title, subtitle, theme = 'dark', variant }) => {
  const isLight = theme === 'light';
  const isArchival = variant === 'archival' && isLight;
  const headerBorder = isArchival ? 'border-archival-ink/30' : isLight ? 'border-[#1A1A1A]/40' : 'border-gold';
  const headerSub = isArchival ? 'text-archival-ink/80 font-archival-mono tracking-[0.25em]' : isLight ? 'text-[#2D2D2D] tracking-[0.25em]' : 'text-gold tracking-[0.2em]';
  const headerTitle = isArchival ? 'text-archival-ink font-archival-serif' : isLight ? 'text-[#1A1A1A]' : 'text-stone-100';

  return (
    <section id={id} className={`min-h-screen w-full py-24 relative border-b ${isArchival ? 'border-archival-ink/10' : isLight ? 'border-[#1A1A1A]/15' : 'border-white/5'} ${className}`} style={isArchival ? { borderBottomWidth: '0.5px' } : undefined}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {(title || subtitle) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className={`mb-16 pl-6 ${isArchival ? 'border-l' : 'border-l-2'} ${headerBorder}`}
            style={isArchival ? { borderLeftWidth: '0.5px' } : undefined}
          >
            {subtitle && <span className={`${headerSub} text-sm font-medium uppercase block mb-2`}>{subtitle}</span>}
            {title && <h2 className={`text-2xl md:text-3xl font-light ${headerTitle}`} style={{ letterSpacing: '0.15em' }}>{title}</h2>}
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
};

export default Section;