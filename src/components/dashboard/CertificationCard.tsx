'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';

interface CertificationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  index?: number;
}

export const CertificationCard: React.FC<CertificationCardProps> = ({
  title,
  description,
  icon,
  index = 0
}) => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false
  });

  return (
    <div
      ref={ref}
      className={`bg-base-100 dark:bg-base-300 rounded-xl p-6 shadow-lg hover:shadow-xl 
        border border-base-200 dark:border-base-200/10 
        transition-all duration-[2000ms] transform cursor-pointer
        hover:scale-[1.02] hover:-translate-y-1
        ${inView 
          ? `opacity-100 translate-y-0 scale-100 delay-[${400 + index * 200}ms]` 
          : 'opacity-0 translate-y-8 scale-95'
        }`}
    >
      <div className="flex items-start space-x-4">
        <div className={`p-3 rounded-lg transition-all duration-[1500ms] transform
          ${inView 
            ? `opacity-100 scale-100 delay-[${600 + index * 200}ms] 
               ${title === 'ISO 14001' ? 'bg-primary/20 text-primary' :
                 title === 'Green Fleet' ? 'bg-success/20 text-success' :
                 'bg-secondary/20 text-secondary'}`
            : 'opacity-0 scale-90'
          }`}
        >
          {icon}
        </div>
        <div>
          <h3 className={`font-semibold text-lg mb-1 transition-all duration-[1500ms]
            ${inView 
              ? `opacity-100 translate-y-0 delay-[${800 + index * 200}ms]` 
              : 'opacity-0 translate-y-4'
            }`}
          >
            {title}
          </h3>
          <p className={`text-base-content/70 dark:text-white/70 text-sm transition-all duration-[1500ms]
            ${inView 
              ? `opacity-100 translate-y-0 delay-[${1000 + index * 200}ms]` 
              : 'opacity-0 translate-y-4'
            }`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};
