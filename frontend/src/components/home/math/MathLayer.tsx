import React, { useMemo } from 'react';
import { MathText, generatePoints, generateCurvedPath } from '.';

interface MathLayerProps {
  count: number;
  gridBased?: boolean;
  showConnectors?: boolean;
  showCurves?: boolean;
}

const MathLayer = ({ count, gridBased = false, showConnectors = false, showCurves = false }: MathLayerProps) => {
  const points = useMemo(() => generatePoints(count, gridBased), [count, gridBased]);
  const curves = useMemo(() => 
    Array.from({ length: 3 }, (_, i) => generateCurvedPath(i * 1000))
  , []);

  return (
    <svg 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ mixBlendMode: 'overlay' }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {showCurves && curves.map((curve, i) => (
        <g key={`curve-${i}`}>
          <path
            d={curve.path}
            stroke="white"
            fill="none"
            strokeWidth="1.5"
            style={{
              opacity: curve.opacity,
              animation: `dash ${curve.duration}s linear infinite`
            }}
          />
        </g>
      ))}

      {showConnectors && points.map((point, i) => (
        <g key={`connector-${i}`} style={{ filter: 'brightness(1.5)' }}>
          <line
            x1={`${point.x}%`}
            y1={`${point.y}%`}
            x2={`${point.x + 20}%`}
            y2={`${point.y + 20}%`}
            stroke="white"
            strokeWidth="1.2"
            style={{
              animation: `fade ${point.animationDuration}s infinite`,
              opacity: 0.3
            }}
          />
          <polygon
            points={`${point.x + 20}%,${point.y + 20}% ${point.x + 19}%,${point.y + 19}% ${point.x + 21}%,${point.y + 19}%`}
            fill="white"
            style={{
              animation: `fade ${point.animationDuration}s infinite`,
              opacity: 0.3
            }}
          />
        </g>
      ))}

      {points.map((point, i) => (
        <g key={`point-${i}`} style={{ filter: 'url(#glow)' }}>
          {gridBased && (
            <>
              <circle
                cx={`${point.x}%`}
                cy={`${point.y}%`}
                r="2.7"
                fill="white"
                style={{
                  opacity: point.opacity
                }}
              />
              <circle
                cx={`${point.x}%`}
                cy={`${point.y}%`}
                r="7.2"
                fill="none"
                stroke="white"
                strokeWidth="0.8"
                style={{ opacity: point.opacity * 0.5 }}
              />
            </>
          )}
          <MathText
            x={`${point.x}%`}
            y={`${point.y}%`}
            width="240"
            height="60"
            transform={`translate(-120, -30) scale(${point.scale})`}
            style={{
              color: 'white',
              opacity: point.opacity,
              fontSize: '24px'
            }}
            formula={point.formula}
          />
        </g>
      ))}
      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: 500;
          }
        }
        @keyframes fade {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </svg>
  );
};

export const MathGrid = () => (
  <MathLayer count={16} gridBased showConnectors showCurves />
);

export const MathOverlay = () => (
  <MathLayer count={6} showCurves />
);
