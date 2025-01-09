'use client';

import { useInView } from 'react-intersection-observer';
import { useEffect, useState } from 'react';

const Footer: React.FC = (): React.ReactElement => {
  const currentYear = new Date().getFullYear();
  const [isExpanded, setIsExpanded] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false,
    rootMargin: '-100px 0px',
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const isNearBottom = documentHeight - scrollPosition < 100;
      setIsExpanded(isNearBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <footer ref={ref} className={`relative bg-white/40 dark:bg-base-300/40 shadow-sm backdrop-blur-sm border-t border-black/5 dark:border-white/5 transition-all duration-500 ease-in-out ${
      isExpanded ? 'py-16' : 'py-2'
    }`}>
      <div className="container mx-auto px-4">
        {/* Main Content - Only visible when expanded */}
        <div className={`overflow-hidden transition-all duration-500 ${
          isExpanded ? 'max-h-[1000px] opacity-100 mb-8' : 'max-h-0 opacity-0'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Quick Links */}
            <div className="space-y-2">
              <h4 className="text-base font-semibold text-base-content/90 dark:text-white/90">Liens Rapides</h4>
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

            {/* Contact */}
            <div className="space-y-2">
              <h4 className="text-base font-semibold text-base-content/90 dark:text-white/90">Contact</h4>
              <div className="space-y-1">
                <p className="text-sm text-base-content/70 dark:text-white/70">
                  contact@ecotrack.fr
                </p>
                <p className="text-sm text-base-content/70 dark:text-white/70">
                  +33 1 23 45 67 89
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-2">
              <h4 className="text-base font-semibold text-base-content/90 dark:text-white/90">Suivez-nous</h4>
              <div className="flex space-x-4">
                {['Twitter', 'LinkedIn', 'Facebook'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="text-base-content/70 dark:text-white/70 hover:text-primary dark:hover:text-primary"
                  >
                    <span className="text-sm">{social}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom - Always Visible */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-base-content/70 dark:text-white/70">
            &copy; {currentYear} EcoTrack
          </p>
          <div className="flex items-center space-x-4">
            <div className={`flex space-x-4 transition-all duration-500 ${
              isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}>
              <a href="#" className="text-xs text-base-content/70 dark:text-white/70 hover:text-primary">
                Confidentialité
              </a>
              <a href="#" className="text-xs text-base-content/70 dark:text-white/70 hover:text-primary">
                CGU
              </a>
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-primary hover:text-primary/80 transition-colors p-1.5 bg-white/10 hover:bg-white/20 rounded-full shadow-sm"
              aria-label={isExpanded ? "Réduire le footer" : "Développer le footer"}
            >
              <svg
                className={`w-5 h-5 transform transition-transform duration-500 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth={2.5}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
