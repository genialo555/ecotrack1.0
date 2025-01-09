// components/Modal.tsx
import React from 'react';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  ariaLabel?: string;
}

const Modal: React.FC<ModalProps> = ({ children, isOpen, onClose, title, ariaLabel }) => {
  if (!isOpen) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-label={ariaLabel}
    >
      <div 
        className="bg-gray-900/95 text-white rounded-lg shadow-xl w-11/12 max-w-md p-6 relative border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
        )}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/70 hover:text-white/90 transition-colors"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
