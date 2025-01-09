import React from 'react';

interface CardBackgroundProps {
  variant?: 'scatter' | 'wave' | 'grid';
  color?: string;
  opacity?: number;
  animate?: boolean;
}

// Deterministic pseudo-random number generator
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

const CardBackground: React.FC<CardBackgroundProps> = ({
  variant = 'scatter',
  color = 'emerald',
  opacity = 0.03,
  animate = true,
}) => {
  const getColorClass = () => {
    const baseColor = `bg-${color}-100/20`;
    const darkColor = `dark:bg-${color}-900/10`;
    return `${baseColor} ${darkColor}`;
  };

  const getOpacityClass = () => {
    return `opacity-${opacity * 100}`;
  };

  // Generate deterministic particle properties
  const getParticleProps = (index: number) => {
    const size = 2 + (seededRandom(index) * 4);
    const x = seededRandom(index + 1) * 100;
    const y = seededRandom(index + 2) * 100;
    const delay = seededRandom(index + 3) * 3;
    
    return {
      size: size.toFixed(2),
      x: x.toFixed(2),
      y: y.toFixed(2),
      delay: delay.toFixed(2)
    };
  };

  if (variant === 'scatter') {
    return (
      <div className={`absolute inset-0 ${getOpacityClass()} dark:opacity-[${opacity * 1.5}] overflow-hidden`}>
        {Array.from({ length: 50 }).map((_, i) => {
          const { size, x, y, delay } = getParticleProps(i);
          return (
            <div
              key={i}
              className={`absolute rounded-full ${getColorClass()} ${animate ? 'animate-pulse-slow' : ''}`}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${x}%`,
                top: `${y}%`,
                animationDelay: `${delay}s`
              }}
            />
          );
        })}
      </div>
    );
  }

  if (variant === 'wave') {
    return (
      <div className={`absolute inset-0 ${getOpacityClass()} overflow-hidden`}>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 via-sky-400/20 to-orange-300/30 bg-[length:400%_400%] animate-gradient-slow"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-orange-400/30 via-amber-300/20 to-blue-400/30 bg-[length:400%_400%] animate-gradient-slow-reverse"></div>
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={`absolute inset-0 z-0 ${getOpacityClass()} dark:opacity-[${opacity * 1.5}]`}>
        <div className="absolute inset-0 grid grid-cols-6 gap-2">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className={`h-full w-full bg-${color}-500/10 dark:bg-${color}-400/5 rounded-lg transform transition-all duration-1000 ${
                animate ? 'animate-pulse' : ''
              }`}
              style={{
                animationDelay: `${i * 100}ms`,
                opacity: 0.1 + (i % 3) * 0.1
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return null;
};

export default CardBackground;
