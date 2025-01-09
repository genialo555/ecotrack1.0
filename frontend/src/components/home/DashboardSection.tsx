'use client';

import React from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Button } from '../common/Button';
import Link from 'next/link';

const DashboardSection: React.FC = (): React.ReactElement => {
  const { ref, inView } = useScrollAnimation();

  const getAnimationClass = (delay: number = 0) => `
    transition-all duration-[2000ms] ease-out
    ${inView 
      ? `opacity-100 transform translate-y-0 ${delay ? `delay-[${delay}ms]` : ''}`
      : 'opacity-0 transform translate-y-8'
    }
  `;

  return (
    <section ref={ref} className="min-h-screen flex items-center relative bg-base-100 dark:bg-base-300 overflow-hidden">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8">
            <div className={`space-y-6 transition-all duration-[2000ms] transform ${
              inView ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 -translate-x-full scale-95'
            }`}>
              <h2 className={`text-4xl font-bold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent transition-all duration-[1500ms] ${
                inView ? 'opacity-100 transform translate-y-0 delay-[400ms]' : 'opacity-0 -translate-y-4'
              }`}>
                Tableau de Bord Intuitif
              </h2>
              <p className={`text-xl text-base-content/70 dark:text-white/70 transition-all duration-[1500ms] ${
                inView ? 'opacity-100 transform translate-y-0 delay-[600ms]' : 'opacity-0 translate-y-4'
              }`}>
                Visualisez et analysez vos données environnementales en un coup d'œil grâce à notre interface intuitive.
              </p>
            </div>

            {/* Feature List */}
            <div className="space-y-4">
              {[
                'Visualisation des données en temps réel',
                'Rapports détaillés et personnalisables',
                'Alertes et notifications configurables',
                'Export des données en plusieurs formats'
              ].map((feature, index) => (
                <div
                  key={feature}
                  className={`flex items-center space-x-3 transition-all duration-[2000ms] transform ${
                    inView 
                      ? `opacity-100 translate-x-0 scale-100 delay-[${800 + index * 200}ms]`
                      : 'opacity-0 -translate-x-full scale-95'
                  }`}
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <svg className="w-4 h-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-base-content/80 dark:text-white/80">{feature}</span>
                </div>
              ))}
            </div>

            {/* Demo Button */}
            <div className={`mt-8 transition-all duration-[2000ms] transform ${
              inView 
                ? 'opacity-100 translate-y-0 scale-100 delay-[1600ms]'
                : 'opacity-0 translate-y-4 scale-95'
            }`}>
              <Link href="/demo">
                <Button variant="primary">
                  Essayer la démo
                </Button>
              </Link>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className={`relative transition-all duration-[2000ms] transform ${
            inView ? 'opacity-100 translate-x-0 scale-100 delay-[400ms]' : 'opacity-0 translate-x-full scale-95'
          }`}>
            <div className="relative bg-base-200 dark:bg-base-100 rounded-xl shadow-2xl overflow-hidden">
              {/* Dashboard Header */}
              <div className={`p-4 border-b border-base-300 dark:border-base-200 transition-all duration-[1500ms] ${
                inView ? 'opacity-100 transform translate-y-0 delay-[800ms]' : 'opacity-0 -translate-y-4'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 rounded bg-base-300 dark:bg-base-200"></div>
                    <div className="w-2 h-2 rounded-full bg-base-300 dark:bg-base-200"></div>
                  </div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-6 space-y-6">
                {/* Chart Placeholders */}
                {[
                  { width: 'w-full', height: 'h-40' },
                  { width: 'w-2/3', height: 'h-32' },
                  { width: 'w-3/4', height: 'h-24' }
                ].map((dims, index) => (
                  <div
                    key={index}
                    className={`${dims.width} ${dims.height} rounded-lg bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 transition-all duration-[2000ms] transform ${
                      inView 
                        ? `opacity-100 translate-y-0 scale-100 delay-[${1200 + index * 200}ms]`
                        : 'opacity-0 translate-y-8 scale-95'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* Decorative Elements */}
            <div className={`absolute -bottom-6 -right-6 w-32 h-32 bg-primary/30 rounded-full blur-2xl transition-all duration-[2000ms] ${
              inView ? 'opacity-100 transform scale-100 delay-[1800ms]' : 'opacity-0 scale-50'
            }`}></div>
            <div className={`absolute -top-6 -left-6 w-24 h-24 bg-secondary/30 rounded-full blur-2xl transition-all duration-[2000ms] ${
              inView ? 'opacity-100 transform scale-100 delay-[2000ms]' : 'opacity-0 scale-50'
            }`}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;
