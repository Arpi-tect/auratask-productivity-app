import React from 'react';

/**
 * Replicates the custom glowing neon AuraTask logo.
 * Supports icon-only view or full-text brand view.
 */
const Logo = ({ showText = false, className = "w-10 h-10", pulse = false }) => {
  return (
    <div className={`flex items-center gap-3.5 select-none ${pulse ? 'animate-pulse-slow' : ''}`}>
      {/* GLOWING SVG ICON */}
      <svg 
        className={className} 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Violet to Cyan Gradient */}
          <linearGradient id="neonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" /> {/* violet-400 */}
            <stop offset="50%" stopColor="#818cf8" /> {/* indigo-400 */}
            <stop offset="100%" stopColor="#22d3ee" /> {/* cyan-400 */}
          </linearGradient>

          {/* Simple Cyan Gradient */}
          <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          {/* Neon Glow Filter */}
          <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="blur" /> {/* Double layer for extra glow depth */}
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer Circular Glow Ring (Partially broken in top/bottom right like original) */}
        <path 
          d="M 30,12 A 40,40 0 1,1 12,58" 
          stroke="url(#neonGradient)" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          filter="url(#neonGlow)"
        />
        <path 
          d="M 82,24 A 40,40 0 0,1 84,40" 
          stroke="url(#neonGradient)" 
          strokeWidth="3.5" 
          strokeLinecap="round" 
          filter="url(#neonGlow)"
        />

        {/* Left Hand Speed Lines */}
        <line x1="8" y1="32" x2="22" y2="32" stroke="url(#neonGradient)" strokeWidth="3" strokeLinecap="round" filter="url(#neonGlow)" />
        <line x1="4" y1="41" x2="26" y2="41" stroke="url(#neonGradient)" strokeWidth="3.5" strokeLinecap="round" filter="url(#neonGlow)" />
        <line x1="8" y1="50" x2="18" y2="50" stroke="url(#neonGradient)" strokeWidth="3" strokeLinecap="round" filter="url(#neonGlow)" />

        {/* Central Rounded Checklist Rect */}
        <rect 
          x="35" 
          y="22" 
          width="36" 
          height="36" 
          rx="6" 
          stroke="url(#neonGradient)" 
          strokeWidth="4" 
          filter="url(#neonGlow)"
        />

        {/* Subtask 1 Circle & Line */}
        <circle cx="43" cy="30" r="3.5" stroke="url(#neonGradient)" strokeWidth="2.5" filter="url(#neonGlow)" />
        <path d="M 41,30 L 42.5,31.5 L 45,28" stroke="url(#neonGradient)" strokeWidth="2" strokeLinecap="round" strokeJoinround="round" />
        <line x1="51" y1="30" x2="63" y2="30" stroke="url(#neonGradient)" strokeWidth="2.5" strokeLinecap="round" filter="url(#neonGlow)" />

        {/* Subtask 2 Circle & Line */}
        <circle cx="43" cy="39" r="3.5" stroke="url(#neonGradient)" strokeWidth="2.5" filter="url(#neonGlow)" />
        <path d="M 41,39 L 42.5,40.5 L 45,37" stroke="url(#neonGradient)" strokeWidth="2" strokeLinecap="round" strokeJoinround="round" />
        <line x1="51" y1="39" x2="63" y2="39" stroke="url(#neonGradient)" strokeWidth="2.5" strokeLinecap="round" filter="url(#neonGlow)" />

        {/* Subtask 3 (Empty Checklist Circle & Line) */}
        <circle cx="43" cy="48" r="3.5" stroke="url(#neonGradient)" strokeWidth="2.5" filter="url(#neonGlow)" />
        <line x1="51" y1="48" x2="59" y2="48" stroke="url(#neonGradient)" strokeWidth="2.5" strokeLinecap="round" filter="url(#neonGlow)" />

        {/* Bottom Right Clock Icon (Overlapping card) */}
        <circle 
          cx="70" 
          cy="48" 
          r="12" 
          fill="#030712" /* Masks background checklist border */
          stroke="url(#cyanGradient)" 
          strokeWidth="4" 
          filter="url(#neonGlow)"
        />
        {/* Clock Hands */}
        <path 
          d="M 70,41.5 L 70,48 L 75,51" 
          stroke="url(#cyanGradient)" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeJoinround="round"
          filter="url(#neonGlow)"
        />
      </svg>

      {/* OPTIONAL BRAND BRAND TEXT DETAILS */}
      {showText && (
        <div className="flex flex-col">
          <span className="text-2xl font-extrabold tracking-widest font-display bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-cyan-400">
            AURATASK
          </span>
          <span className="text-[9px] uppercase font-bold tracking-[0.3em] text-gray-500 mt-0.5">
            Focus. Plan. Achieve.
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
