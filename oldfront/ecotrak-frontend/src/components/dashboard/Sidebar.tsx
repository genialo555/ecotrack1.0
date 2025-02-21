import React from 'react';
import { X, Plus, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  onLogout: () => void;
  onOpenAddJourneyModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  userEmail,
  onLogout,
  onOpenAddJourneyModal,
}) => {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 bottom-0 w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-lime-600">EcoTrack</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            <div className="space-y-4">
              {/* User Info */}
              <div className="pb-4 border-b">
                <div className="text-sm text-gray-500">Connecté en tant que</div>
                <div className="font-medium truncate">{userEmail}</div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => {
                    onOpenAddJourneyModal();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-100 rounded-lg"
                >
                  <Plus className="w-5 h-5" />
                  <span>Ajouter un trajet</span>
                </button>

                <button
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Déconnexion</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
