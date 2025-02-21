import React from 'react';
import { PerformanceCard } from '../PerformanceCard';

export function PerformanceSection() {
  return (
    <div className="lg:col-span-2">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Performance de la Flotte</h2>
          <div className="w-full h-[300px]">
            <PerformanceCard />
          </div>
        </div>
      </div>
    </div>
  );
}
