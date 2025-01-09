import React from 'react';

interface TopNavProps {
  onAddJourney: () => void;
  onOpenSettings: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onAddJourney, onOpenSettings }) => {
  return (
    <nav className="bg-background border-b border-subtle">
      <div className="container h-header flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onAddJourney}
            className="btn btn-primary gap-2"
          >
            <span className="icon icon-plus" />
            Nouveau trajet
          </button>

          <button
            onClick={onOpenSettings}
            className="btn btn-ghost"
            aria-label="Settings"
          >
            <span className="icon icon-settings text-muted" />
          </button>
        </div>
      </div>
    </nav>
  );
};
