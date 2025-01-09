'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '../common/Button';

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.querySelector('#features');
    featuresSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const getAnimationClass = (delay: number = 0) => `
    transition-all duration-[2000ms] ease-out
    ${isVisible 
      ? `opacity-100 transform translate-y-0 ${delay ? `delay-[${delay}ms]` : ''}`
      : 'opacity-0 transform translate-y-8'
    }
  `;

  return (
    <section className="min-h-screen flex items-center relative bg-gradient-to-b from-base-100 to-base-200 dark:from-base-300 dark:to-base-200 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] dark:bg-grid-white/[0.05]" />
        <div className={`absolute -top-20 -left-20 w-40 h-40 rounded-full bg-primary/20 blur-3xl transition-all duration-[2500ms] ${
          isVisible ? 'opacity-100 transform translate-y-0 delay-[800ms]' : 'opacity-0 -translate-y-full'
        }`}></div>
        <div className={`absolute top-40 -right-20 w-60 h-60 rounded-full bg-accent/20 blur-3xl transition-all duration-[2500ms] ${
          isVisible ? 'opacity-100 transform translate-x-0 delay-[1200ms]' : 'opacity-0 translate-x-full'
        }`}></div>
        <div className={`absolute -bottom-20 left-1/4 w-80 h-80 rounded-full bg-secondary/20 blur-3xl transition-all duration-[2500ms] ${
          isVisible ? 'opacity-100 transform translate-y-0 delay-[1600ms]' : 'opacity-0 translate-y-full'
        }`}></div>
      </div>

      <div className="container mx-auto relative p-0">
        <div className="flex flex-col items-center text-center gap-8 max-w-4xl mx-auto">
          <h1 className={`${getAnimationClass(1000)} text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-orange-500 via-primary to-green-500 bg-[size:200%_200%] animate-gradient-x bg-clip-text text-transparent`}>
            EcoTrack
          </h1>
          <h2 className={`${getAnimationClass(1500)} text-2xl md:text-3xl lg:text-4xl font-semibold bg-gradient-to-r from-orange-400 via-primary to-green-400 bg-[size:200%_200%] animate-gradient-x bg-clip-text text-transparent`}>
            Surveillez et gérez vos données environnementales en toute simplicité
          </h2>
          <p className={`${getAnimationClass(2000)} text-lg md:text-xl lg:text-2xl text-base-content/90 dark:text-white/90 max-w-3xl`}>
            Optimisez votre empreinte carbone et votre consommation d'énergie avec notre solution complète de suivi environnemental.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className={`${getAnimationClass(2500)}`}>
              <Link href="/demo">
                <Button variant="primary">
                  Essayer la démo
                </Button>
              </Link>
            </div>
            <div className={`${getAnimationClass(2800)}`}>
              <Button variant="secondary" onClick={scrollToFeatures}>
                En savoir plus
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
        isVisible 
          ? 'opacity-100 transform translate-y-0 delay-[3600ms]' 
          : 'opacity-0 transform translate-y-4'
      }`}>
        <button 
          onClick={scrollToFeatures}
          className="btn btn-circle btn-ghost text-primary hover:bg-base-200 animate-bounce"
          aria-label="Voir les fonctionnalités"
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
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
