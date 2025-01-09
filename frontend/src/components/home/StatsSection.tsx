'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import CardBackground from '../common/CardBackground';

const StatsSection: React.FC = (): React.ReactElement => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false,
    rootMargin: '-100px 0px -100px 0px',
  });

  // Combined stats from the second snippet (adapt or expand as needed)
  const stats = [
    {
      title: 'Performance Flotte',
      description: 'Mise à jour en temps réel',
      value: 'Temps Réel',
      highlight: 'primary',
      bgClass: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20'
    },
    {
      title: 'Réduction Émissions',
      description: 'Objectif Annuel:',
      value: '65%',
      progress: 65,
      highlight: 'success',
      bgClass: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20'
    }
  ];

  // Combined certifications from the second snippet (adapt or expand as needed)
  const certifications = [
    {
      name: 'Green Fleet',
      description: 'Certification de flotte écologique',
      status: 'En cours',
      year: '2024',
      features: [
        'Réduction des émissions',
        'Optimisation des trajets',
        'Véhicules électriques'
      ]
    },
    {
      name: 'ECO2 Standard',
      description: 'Standard environnemental',
      status: '',
      year: '2023',
      features: [
        'Conformité environnementale',
        'Gestion des déchets',
        'Efficacité énergétique'
      ]
    }
  ];

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-gradient-to-b from-orange-50 to-white dark:from-blue-950 dark:to-gray-950 py-12 md:py-24 snap-mandatory"
      style={{ scrollBehavior: 'smooth' }}
    >
      {/* Background animations */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
      </div>

      {/* Use the container & padding from the first snippet */}
      <div className="relative mx-auto container px-4 md:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mx-auto text-center mb-12 md:mb-24">
          <h2
            className={`text-4xl font-bold bg-gradient-to-r from-primary to-success bg-clip-text text-transparent mb-4
            ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-300`}
          >
            Impact Environnemental
          </h2>
          <p
            className={`text-lg text-base-content/70 dark:text-white/70
            ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'} transition-all duration-300`}
          >
            <span className="font-bold">
              Suivez vos progrès et votre impact sur l'environnement en temps réel
            </span>
          </p>
        </div>

        {/* Stats Grid with merged responsive styling */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto mb-24 scroll-smooth max-w-[1612px]"
          style={{
            height: '1600px', // from the second snippet
            scrollSnapType: 'y mandatory',
            scrollPadding: '2rem',
            overscrollBehavior: 'contain'
          }}
        >
          {/* =============== */}
          {/* Performance Flotte */}
          {/* =============== */}
          <div
            className={`relative rounded-3xl p-8 md:p-16 backdrop-blur-xl overflow-hidden bg-white/90 dark:bg-gray-900/50
            transform transition-all duration-300 ease-out
            hover:scale-[1.02] hover:shadow-lg
            shadow-md
            dark:shadow-[0_0_30px_-12px_rgba(255,255,255,0.2)]
            ${inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
            style={{
              // Additional responsive minHeight from the first snippet
              height: 'calc(1600px / 2 - 12px)',
              minHeight: '400px',
              scrollSnapAlign: 'start',
              scrollSnapStop: 'always'
            }}
          >
            {/* Background Graph (from the second snippet) */}
            <div className="absolute inset-0 z-0">
              <svg className="w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="areaGradient1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgb(249, 115, 22)" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="rgb(249, 115, 22)" stopOpacity="0.2" />
                  </linearGradient>
                  <linearGradient id="areaGradient2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.1" />
                  </linearGradient>
                </defs>

                {/* Background grid lines */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <line
                    key={`v${i}`}
                    x1={i * 10}
                    y1="0"
                    x2={i * 10}
                    y2="100"
                    stroke="currentColor"
                    strokeWidth="0.1"
                    className="text-gray-400/20"
                  />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <line
                    key={`h${i}`}
                    x1="0"
                    y1={i * 10}
                    x2="100"
                    y2={i * 10}
                    stroke="currentColor"
                    strokeWidth="0.1"
                    className="text-gray-400/20"
                  />
                ))}

                {/* Graph areas */}
                <path
                  d="M0,40 C20,30 40,45 60,35 S80,45 100,30 L100,100 L0,100 Z"
                  fill="url(#areaGradient1)"
                  className="transition-all duration-1000"
                />
                <path
                  d="M0,50 C30,40 50,55 70,45 S90,55 100,40 L100,100 L0,100 Z"
                  fill="url(#areaGradient2)"
                  className="transition-all duration-1000"
                />

                {/* Graph lines */}
                <path
                  d="M0,40 C20,30 40,45 60,35 S80,45 100,30"
                  stroke="rgb(249, 115, 22)"
                  strokeWidth="0.8"
                  fill="none"
                  className="transition-all duration-1000"
                />
                <path
                  d="M0,50 C30,40 50,55 70,45 S90,55 100,40"
                  stroke="rgb(59, 130, 246)"
                  strokeWidth="0.5"
                  fill="none"
                  className="transition-all duration-1000"
                />
              </svg>
            </div>
            {/* Animated overlay */}
            <div className="absolute inset-0 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/10 dark:to-white/0"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 mix-blend-overlay"></div>
            </div>
            {/* Foreground content */}
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="space-y-8">
                <h3 className="text-5xl font-medium tracking-tight bg-gradient-to-r from-emerald-500 via-orange-500 to-blue-500 bg-clip-text text-transparent">
                  Performance Flotte
                </h3>
                <p className="text-xl text-gray-500 dark:text-gray-400">Mise à jour</p>
              </div>
              <div className="mt-12">
                <div className="text-7xl font-semibold bg-gradient-to-r from-emerald-500 via-orange-500 to-blue-500 bg-clip-text text-transparent">
                  En temps Réel
                </div>
              </div>
            </div>
          </div>

          {/* =============== */}
          {/* Réduction Émissions */}
          {/* =============== */}
          <div
            className={`relative rounded-3xl p-8 md:p-16 backdrop-blur-xl overflow-hidden bg-white/90 dark:bg-gray-900/50
            transform transition-all duration-300 ease-out
            hover:scale-[1.02] hover:shadow-lg
            shadow-md
            dark:shadow-[0_0_30px_-12px_rgba(255,255,255,0.2)]
            ${inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
            style={{
              height: 'calc(1600px / 2 - 12px)',
              scrollBehavior: 'smooth',
              scrollSnapAlign: 'center'
            }}
          >
            {/* Background Graph */}
            <div className="absolute inset-0 z-0">
              <svg className="w-full h-full opacity-35" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="columnGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgb(220, 38, 38)" stopOpacity="0.7" />
                    <stop offset="50%" stopColor="rgb(234, 179, 8)" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0.7" />
                  </linearGradient>
                </defs>

                {/* Bar columns */}
                {Array.from({ length: 12 }).map((_, i) => {
                  const height = 40 + Math.sin(i * 0.5) * 20;
                  return (
                    <rect
                      key={i}
                      x={i * 8 + 2}
                      y={90 - height}
                      width="6"
                      height={height}
                      fill="url(#columnGradient)"
                      className="transition-all duration-1000"
                    />
                  );
                })}

                {/* Background grid lines */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <line
                    key={`v${i}`}
                    x1={i * 10}
                    y1="0"
                    x2={i * 10}
                    y2="100"
                    stroke="currentColor"
                    strokeWidth="0.1"
                    className="text-gray-400/20"
                  />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <line
                    key={`h${i}`}
                    x1="0"
                    y1={i * 10}
                    x2="100"
                    y2={i * 10}
                    stroke="currentColor"
                    strokeWidth="0.1"
                    className="text-gray-400/20"
                  />
                ))}
              </svg>
            </div>
            <div className="absolute inset-0 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/10 dark:to-white/0"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 to-amber-500/10 dark:from-orange-600/5 dark:to-amber-500/5"></div>
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="space-y-8">
                <h3 className="text-5xl font-medium tracking-tight bg-gradient-to-r from-emerald-500 via-orange-500 to-blue-500 bg-clip-text text-transparent">
                  Réduction Émissions
                </h3>
                <p className="text-xl text-gray-500 dark:text-gray-400">Objectif Annuel:</p>
              </div>
              <div className="mt-12">
                <div className="text-7xl font-semibold bg-gradient-to-r from-emerald-500 via-orange-500 to-blue-500 bg-clip-text text-transparent mb-8">
                  -30%
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between text-xl">
                    <span className="text-gray-600 dark:text-gray-400">Progression</span>
                    <span className="font-medium text-gray-900 dark:text-white" />
                  </div>
                  <div className="h-3 bg-gray-200/50 dark:bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-orange-600 to-amber-500 transition-all duration-1000"
                      // Animate the bar only when inView
                      style={{ width: inView ? '75%' : '0%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* =============== */}
          {/* Green Fleet */}
          {/* =============== */}
          <div
            className={`hidden md:block relative rounded-3xl p-8 md:p-16 backdrop-blur-xl overflow-hidden bg-white/90 dark:bg-gray-900/50
            transform transition-all duration-300 ease-out
            hover:scale-[1.02] hover:shadow-lg
            shadow-md
            dark:shadow-[0_0_30px_-12px_rgba(255,255,255,0.2)]
            ${inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
            style={{
              height: 'calc(1600px / 2 - 12px)',
              scrollBehavior: 'smooth',
              scrollSnapAlign: 'center'
            }}
          >
            {/* Background Graph */}
            <div className="absolute inset-0 z-[1]">
              <svg className="w-full h-full opacity-60" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="pieGradient1" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="pieGradient2" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgb(249, 115, 22)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="rgb(249, 115, 22)" stopOpacity="0.7" />
                  </linearGradient>
                  <linearGradient id="pieGradient3" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgb(220, 38, 38)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="rgb(220, 38, 38)" stopOpacity="0.7" />
                  </linearGradient>
                </defs>

                {/* Pie chart slices */}
                <g transform="translate(50, 50)">
                  {/* Green slice (60%) */}
                  <path
                    d="M 0 0 L 0 -40 A 40 40 0 0 1 34.64 -20 Z"
                    fill="url(#pieGradient1)"
                    className="transition-all duration-1000"
                  />
                  {/* Orange slice (25%) */}
                  <path
                    d="M 0 0 L 34.64 -20 A 40 40 0 0 1 40 0 Z"
                    fill="url(#pieGradient2)"
                    className="transition-all duration-1000"
                  />
                  {/* Red slice (15%) */}
                  <path
                    d="M 0 0 L 40 0 A 40 40 0 0 1 34.64 20 Z"
                    fill="url(#pieGradient3)"
                    className="transition-all duration-1000"
                  />
                </g>
              </svg>
            </div>
            <div className="absolute inset-0 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/10 dark:to-white/0"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 mix-blend-overlay"></div>
            </div>
            <div className="relative z-[2] h-full flex flex-col justify-between">
              <div className="space-y-8">
                <h3 className="text-5xl font-medium tracking-tight bg-gradient-to-r from-emerald-500 via-orange-500 to-blue-500 bg-clip-text text-transparent">
                  Green Fleet
                </h3>
                <p className="text-xl text-gray-500 dark:text-gray-400">
                  Certification de flotte écologique
                </p>
              </div>
              <div className="mt-12">
                <div className="text-7xl font-semibold bg-gradient-to-r from-emerald-500 via-orange-500 to-blue-500 bg-clip-text text-transparent mb-8">
                  {/* Could display certification status here if desired */}
                </div>
              </div>
            </div>
          </div>

          {/* =============== */}
          {/* ECO2 */}
          {/* =============== */}
          <div
            className={`hidden md:block relative rounded-3xl p-8 md:p-16 backdrop-blur-xl overflow-hidden bg-white/90 dark:bg-gray-900/50
            transform transition-all duration-300 ease-out
            hover:scale-[1.02] hover:shadow-lg
            shadow-md
            dark:shadow-[0_0_30px_-12px_rgba(255,255,255,0.2)]
            ${inView ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`}
            style={{
              height: 'calc(1600px / 2 - 12px)',
              scrollBehavior: 'smooth',
              scrollSnapAlign: 'center'
            }}
          >
            {/* Background Graph */}
            <div className="absolute inset-0 z-[1]">
              <svg className="w-full h-full opacity-70" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="circleGradient1" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.4" />
                  </linearGradient>
                  <linearGradient id="circleGradient2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgb(34, 197, 94)" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="rgb(34, 197, 94)" stopOpacity="0.5" />
                  </linearGradient>
                  <linearGradient id="circleGradient3" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgb(249, 115, 22)" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="rgb(249, 115, 22)" stopOpacity="0.6" />
                  </linearGradient>
                  <linearGradient id="circleGradient4" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgb(220, 38, 38)" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="rgb(220, 38, 38)" stopOpacity="0.7" />
                  </linearGradient>
                </defs>

                {/* Concentric circles */}
                <g transform="translate(50, 50)">
                  <circle r="31.5" fill="url(#circleGradient1)" className="transition-all duration-1000" />
                  <circle r="24.5" fill="url(#circleGradient2)" className="transition-all duration-1000" />
                  <circle r="17.5" fill="url(#circleGradient3)" className="transition-all duration-1000" />
                  <circle r="10.5" fill="url(#circleGradient4)" className="transition-all duration-1000" />
                </g>
              </svg>
            </div>
            <div className="absolute inset-0 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/0 dark:from-white/10 dark:to-white/0"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/5 dark:to-indigo-500/5 mix-blend-overlay"></div>
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="space-y-8">
                <h3 className="text-7xl font-bold tracking-tight bg-gradient-to-r from-emerald-500 via-orange-500 to-blue-500 bg-clip-text text-transparent">
                  ECO2
                </h3>
                <div className="flex items-center space-x-4">
                  <p className="text-xl text-gray-500 dark:text-gray-400">Standard environnemental</p>
                  {/* Decorative mini “cone” chart */}
                  <svg className="w-20 h-20 opacity-60" viewBox="0 0 100 100">
                    <defs>
                      <linearGradient id="coneGradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="currentColor" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="currentColor" stopOpacity="0.3" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M50,20 L80,80 L20,80 Z"
                      fill="url(#coneGradient)"
                      className="text-emerald-500 dark:text-emerald-400"
                    />
                    {/* Horizontal lines */}
                    <line
                      x1="30"
                      y1="65"
                      x2="70"
                      y2="65"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-gray-400/30"
                    />
                    <line
                      x1="35"
                      y1="55"
                      x2="65"
                      y2="55"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-gray-400/30"
                    />
                    <line
                      x1="40"
                      y1="45"
                      x2="60"
                      y2="45"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-gray-400/30"
                    />
                    <line
                      x1="45"
                      y1="35"
                      x2="55"
                      y2="35"
                      stroke="currentColor"
                      strokeWidth="0.5"
                      className="text-gray-400/30"
                    />
                  </svg>
                </div>
              </div>
              <div className="mt-12">
                <div className="text-7xl font-semibold bg-gradient-to-r from-emerald-500 via-orange-500 to-blue-500 bg-clip-text text-transparent mb-8">
                  {/* Could display year or status here if desired */}
                </div>
              </div>
            </div>
          </div>
          {/* End of ECO2 */}
        </div>
        {/* End of Stats Grid */}
      </div>
    </section>
  );
};

export default StatsSection;
