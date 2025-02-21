import React from 'react';

export function ObjectivesSection() {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">Objectifs Environnementaux</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span>Réduction CO2</span>
              <span className="text-success">32/30%</span>
            </div>
            <progress className="progress progress-success" value="32" max="30"></progress>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span>Efficacité Énergétique</span>
              <span className="text-primary">86/100%</span>
            </div>
            <progress className="progress progress-primary" value="86" max="100"></progress>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span>Recyclage</span>
              <span className="text-secondary">75/100%</span>
            </div>
            <progress className="progress progress-secondary" value="75" max="100"></progress>
          </div>
        </div>
      </div>
    </div>
  );
}
