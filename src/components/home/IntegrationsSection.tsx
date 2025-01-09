'use client';

import React from 'react';
import { Button } from '../common/Button';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface Integration {
  name: string;
  description: string;
  url: string;
}

const IntegrationsSection: React.FC = (): React.ReactElement => {
  const { ref, inView } = useScrollAnimation();

  const getAnimationClass = (delay: number = 0) => `
    transition-all duration-[2000ms] ease-out
    ${inView 
      ? `opacity-100 transform translate-y-0 ${delay ? `delay-[${delay}ms]` : ''}`
      : 'opacity-0 transform translate-y-8'
    }
  `;

  const integrations: Integration[] = [
    {
      name: 'Power BI',
      description: 'Connectez vos données environnementales à Power BI pour des analyses avancées.',
      url: 'https://powerbi.microsoft.com/'
    },
    {
      name: 'Tableau',
      description: 'Créez des tableaux de bord interactifs avec Tableau.',
      url: 'https://www.tableau.com/'
    },
    {
      name: 'Google Analytics',
      description: 'Mesurez l\'impact de vos initiatives environnementales.',
      url: 'https://analytics.google.com/'
    }
  ];

  return (
    <section id="integrations" ref={ref} className="min-h-screen flex items-center relative bg-base-100 dark:bg-base-300">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] dark:bg-grid-white/[0.05]" />
        <div className={`absolute -top-20 -left-20 w-40 h-40 rounded-full bg-primary/20 blur-3xl transition-all duration-[2500ms] ${
          inView ? 'opacity-100 transform translate-y-0 delay-[800ms]' : 'opacity-0 -translate-y-full'
        }`}></div>
        <div className={`absolute top-40 -right-20 w-60 h-60 rounded-full bg-accent/20 blur-3xl transition-all duration-[2500ms] ${
          inView ? 'opacity-100 transform translate-x-0 delay-[1200ms]' : 'opacity-0 translate-x-full'
        }`}></div>
        <div className={`absolute -bottom-20 left-1/4 w-80 h-80 rounded-full bg-secondary/20 blur-3xl transition-all duration-[2500ms] ${
          inView ? 'opacity-100 transform translate-y-0 delay-[1600ms]' : 'opacity-0 translate-y-full'
        }`}></div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className={`text-center mb-24 transition-all duration-[2000ms] transform ${
          inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
        }`}>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary transition-all duration-[1500ms] whitespace-normal break-words max-w-5xl mx-auto leading-normal tracking-normal py-2 ${
            inView ? 'opacity-100 transform translate-y-0 delay-[400ms]' : 'opacity-0 -translate-y-4'
          }`}>
            Intégrations & Connectivité
          </h2>
          <p className={`text-xl text-base-content/70 dark:text-white/70 max-w-3xl mx-auto transition-all duration-[1500ms] ${
            inView ? 'opacity-100 transform translate-y-0 delay-[600ms]' : 'opacity-0 translate-y-4'
          }`}>
            <span className="font-bold">Connectez vos outils préférés et optimisez votre flux de travail</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {integrations.map((integration, index) => (
            <div
              key={integration.name}
              className={`group relative rounded-3xl p-10 
                backdrop-blur-xl
                transform transition-all duration-1000 ease-out
                hover:scale-[1.02] hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)]
                shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)]
                dark:shadow-[0_0_70px_-12px_rgba(255,255,255,0.3)]
                dark:hover:shadow-[0_0_100px_-12px_rgba(255,255,255,0.5)]
                bg-white/90 dark:bg-gray-900/50
                overflow-hidden h-[596px]
                ${inView 
                  ? `opacity-100 translate-y-0 scale-100 delay-[${800 + index * 200}ms]`
                  : 'opacity-0 translate-y-8 scale-95'
                }`}
            >
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex-grow space-y-8">
                  <h3 className="text-4xl font-medium tracking-tight bg-gradient-to-r from-emerald-500 via-orange-500 to-blue-500 bg-clip-text text-transparent animate-gradient-x bg-[length:200%_100%]">
                    {integration.name}
                  </h3>
                  <p className="text-lg text-base-content/70 dark:text-white/70 font-bold">
                    {integration.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
