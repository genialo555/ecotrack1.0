import React, { useEffect, useState } from 'react';
import seedrandom from 'seedrandom';

const GridOverlay = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Create a seeded random number generator
  const rng = seedrandom('ecotrak-grid');

  // Generate consistent random positions
  const elements = [...Array(6)].map((_, i) => ({
    left: `${rng() * 100}%`,
    top: `${rng() * 100}%`,
    delay: `${rng() * 8}s`,
    rotation: `${rng() * 360}deg`,
    symbol: ['∑', '∫', 'π', 'CO₂', 'kWh', '°C'][Math.floor(rng() * 6)]
  }));

  return (
    <div className="absolute inset-0 z-[2] overflow-hidden opacity-45">
      <svg
        className="absolute w-[200%] h-[200%] -left-1/2 -top-1/2 animate-grid-float"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="graph-pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            {/* Main grid lines */}
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="rgba(255, 255, 255, 0.5)"
              strokeWidth="0.3"
            />
            {/* Random diagonal lines */}
            <path
              d="M 0 0 L 20 20 M 40 0 L 20 20 M 0 40 L 20 20"
              fill="none"
              stroke="rgba(255, 255, 255, 0.3)"
              strokeWidth="0.2"
            />
            {/* Small connecting lines */}
            <path
              d="M 10 0 L 10 10 M 20 0 L 20 20 M 30 0 L 30 10
                 M 0 10 L 10 10 M 0 20 L 20 20 M 0 30 L 10 30"
              fill="none"
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="0.15"
            />
            {/* Random dots */}
            <circle cx="10" cy="10" r="0.5" fill="rgba(255, 255, 255, 0.4)" />
            <circle cx="30" cy="30" r="0.5" fill="rgba(255, 255, 255, 0.4)" />
            <circle cx="20" cy="20" r="0.7" fill="rgba(255, 255, 255, 0.5)" />
            
            {/* Numbers and symbols */}
            <text x="25" y="35" fontSize="3" fill="rgba(255, 255, 255, 0.3)">∑</text>
            <text x="15" y="25" fontSize="3" fill="rgba(255, 255, 255, 0.3)">π</text>
          </pattern>
          <linearGradient id="fade" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.8" />
            <stop offset="50%" stopColor="white" stopOpacity="0.2" />
            <stop offset="100%" stopColor="white" stopOpacity="0.8" />
          </linearGradient>
          <mask id="grid-mask">
            <rect width="100%" height="100%" fill="url(#fade)" />
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="url(#graph-pattern)" mask="url(#grid-mask)">
          <animateTransform
            attributeName="transform"
            type="translate"
            from="-40,-40"
            to="0,0"
            dur="30s"
            repeatCount="indefinite"
          />
        </rect>
      </svg>

      {/* Floating Numbers Layer */}
      <div className="absolute inset-0 overflow-hidden">
        {elements.map((el, i) => {
          const animations = [
            'animate-fade-in-out',
            'animate-fade-pulse',
            'animate-fade-wave'
          ];
          const animation = animations[i % 3];
          
          return (
            <div
              key={i}
              className={`absolute ${animation} text-white/25 font-mono text-sm`}
              style={{
                left: el.left,
                top: el.top,
                animationDelay: el.delay,
                transform: `rotate(${el.rotation})`,
              }}
            >
              {el.symbol}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GridOverlay;
