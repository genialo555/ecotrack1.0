'use client';

import React, { useEffect } from 'react';
import { X as CloseIcon } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className = '',
}) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }

    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div 
        className={`
          relative bg-background dark:bg-background/95 rounded-lg 
          shadow-xl dark:shadow-2xl dark:shadow-black/20 
          max-h-[90vh] overflow-auto
          border border-border/50 dark:border-border/20
          ${className}
        `}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        {(title || onClose) && (
          <div className="flex items-center justify-between p-4 border-b border-border/50 dark:border-border/20">
            {title && (
              <h2 id="modal-title" className="text-lg font-semibold text-foreground/90">
                {title}
              </h2>
            )}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-muted/80 dark:hover:bg-muted/20 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <CloseIcon className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};
