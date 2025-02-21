'use client';

import { useInView } from 'react-intersection-observer';
import { useState } from 'react';

const Footer: React.FC = (): React.ReactElement => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative bg-white/40 dark:bg-base-300/40 shadow-sm backdrop-blur-sm border-t border-black/5 dark:border-white/5 mt-auto"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Liens rapides */}
          <div className="space-y-2">
            <h4 className="text-base font-semibold text-base-content/90 dark:text-white/90">
              Liens Rapides
            </h4>
            <nav className="flex flex-col space-y-1">
              {['Accueil', 'Services', 'À Propos'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm text-base-content/70 dark:text-white/70 hover:text-primary dark:hover:text-primary"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          {/* Informations de contact */}
          <div className="space-y-2">
            <h4 className="text-base font-semibold text-base-content/90 dark:text-white/90">
              Contact
            </h4>
            <nav className="flex flex-col space-y-1">
              <a
                href="mailto:contact@ecotrak.fr"
                className="text-sm text-base-content/70 dark:text-white/70 hover:text-primary dark:hover:text-primary"
              >
                contact@ecotrak.fr
              </a>
              <a
                href="tel:+33123456789"
                className="text-sm text-base-content/70 dark:text-white/70 hover:text-primary dark:hover:text-primary"
              >
                +33 1 23 45 67 89
              </a>
            </nav>
          </div>

          {/* Réseaux sociaux */}
          <div className="space-y-2">
            <h4 className="text-base font-semibold text-base-content/90 dark:text-white/90">
              Suivez-nous
            </h4>
            <nav className="flex flex-col space-y-1">
              {['LinkedIn', 'Twitter', 'Facebook'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-sm text-base-content/70 dark:text-white/70 hover:text-primary dark:hover:text-primary"
                >
                  {social}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Section des droits d'auteur */}
        <div className="text-center text-sm text-base-content/60 dark:text-white/60">
          &copy; {currentYear} Ecotrak. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
