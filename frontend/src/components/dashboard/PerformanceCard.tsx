'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';

interface PerformanceCardProps {
  title: string;
  subtitle: string;
  value: string;
  icon: React.ReactNode;
  progress?: number;
  index?: number;
}

export const PerformanceCard: React.FC<PerformanceCardProps> = ({
  title,
  subtitle,
  value,
  icon,
  progress,
  index = 0
}) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false
  });

  return (
    <div
      ref={ref}
      className={`bg-base-100 dark:bg-base-300 rounded-xl p-6 shadow-lg
        border border-base-200 dark:border-base-200/10 
        transition-all duration-[2000ms] transform
        ${inView 
          ? `opacity-100 translate-y-0 scale-100 delay-[${400 + index * 200}ms]` 
          : 'opacity-0 translate-y-8 scale-95'
        }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg transition-all duration-[1500ms] transform
            ${inView 
              ? `opacity-100 scale-100 delay-[${600 + index * 200}ms] 
                 ${title.includes('Performance') ? 'bg-primary/20 text-primary' : 'bg-success/20 text-success'}`
              : 'opacity-0 scale-90'
            }`}
          >
            {icon}
          </div>
          <div>
            <h3 className={`font-semibold transition-all duration-[1500ms]
              ${inView 
                ? `opacity-100 translate-y-0 delay-[${800 + index * 200}ms]` 
                : 'opacity-0 translate-y-4'
              }`}
            >
              {title}
            </h3>
            <p className={`text-sm text-base-content/70 dark:text-white/70 transition-all duration-[1500ms]
              ${inView 
                ? `opacity-100 translate-y-0 delay-[${900 + index * 200}ms]` 
                : 'opacity-0 translate-y-4'
              }`}
            >
              {subtitle}
            </p>
          </div>
        </div>
        <div className={`text-2xl font-bold transition-all duration-[1500ms]
          ${inView 
            ? `opacity-100 scale-100 delay-[${1000 + index * 200}ms]` 
            : 'opacity-0 scale-90'
          }`}
        >
          {value}
        </div>
      </div>

      {progress !== undefined && (
        <div className="relative pt-2">
          <div className="overflow-hidden h-2 text-xs flex rounded bg-base-200 dark:bg-base-200/30">
            <div
              style={{ width: `${progress}%` }}
              className={`transition-all duration-[2500ms] ease-out rounded bg-success
                ${inView 
                  ? `opacity-100 delay-[${1200 + index * 200}ms] w-[${progress}%]` 
                  : 'opacity-0 w-0'
                }`}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};
