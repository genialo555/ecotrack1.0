import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  bgColor?: string;
}

export const StatCard: React.FC<StatCardProps> = React.memo(({ title, value, bgColor }) => (
  <div className={`rounded-xl p-4 shadow-md backdrop-blur bg-white/10 border border-white/20 ${bgColor ?? ''}`}>
    <div className="text-white">
      <p className="text-sm uppercase tracking-wider opacity-80">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  </div>
));
