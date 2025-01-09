import React from 'react';

interface SettingsModalProps {
  userEmail?: string;
  onClose: () => void;
}

export const SettingsContent: React.FC<SettingsModalProps> = ({
  userEmail,
  onClose,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          value={userEmail || ''}
          disabled
          className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
          aria-disabled="true"
        />
      </div>
      <div className="flex justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          aria-label="Fermer les paramètres"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Paramètres</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Fermer</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            {/* Paramètres de notification */}
            <div>
              <h4 className="font-medium mb-2">Notifications</h4>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary"
                />
                <span>Notifications par email</span>
              </label>
            </div>

            {/* Préférences d'affichage */}
            <div>
              <h4 className="font-medium mb-2">Affichage</h4>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-primary"
                />
                <span>Mode sombre</span>
              </label>
            </div>

            {/* Unités de mesure */}
            <div>
              <h4 className="font-medium mb-2">Unités de mesure</h4>
              <select className="form-select w-full">
                <option value="metric">Métrique (km)</option>
                <option value="imperial">Impérial (miles)</option>
              </select>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              className="px-4 py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark"
              onClick={() => {
                // Sauvegarder les paramètres
                onClose();
              }}
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
