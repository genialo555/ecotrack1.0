import React from 'react';

interface IntegrationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  glowColor: string;
  className?: string;
}

export const IntegrationCard: React.FC<IntegrationCardProps> = ({
  title,
  description,
  icon,
  glowColor,
  className = ''
}) => {
  return (
    <div className={`relative flex-1 bg-black/90 p-8 backdrop-blur-sm ${className}`}>
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-base-200/10">
            {icon}
          </div>
          <h3 className="text-2xl font-semibold text-white">
            {title}
          </h3>
        </div>
        <p className="text-gray-400 text-lg">
          {description}
        </p>
      </div>
      
      {/* Gradient background */}
      <div className={`absolute inset-0 -z-0 bg-gradient-to-br ${glowColor} opacity-10`} />
    </div>
  );
};
