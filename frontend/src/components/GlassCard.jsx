import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

/**
 * Reusable premium Glassmorphism card container
 */
const GlassCard = ({ 
  children, 
  className, 
  animate = false,
  hover = false,
  onClick,
  ...props
}) => {
  const Component = animate ? motion.div : 'div';
  
  const styles = clsx(
    'glass-card rounded-2xl p-6 relative overflow-hidden',
    hover && 'glass-card-hover',
    className
  );

  return (
    <Component
      className={styles}
      onClick={onClick}
      {...(animate && {
        whileHover: hover ? { y: -3, transition: { duration: 0.2 } } : {},
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.35 }
      })}
      {...props}
    >
      {/* Dynamic glow corner overlay */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      
      {children}
    </Component>
  );
};

export default GlassCard;
