'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../common/Button';
import { useInView } from 'react-intersection-observer';

interface Integration {
  name: string;
  description: string;
  url: string;
  logo: string;
  color: string;
  shortDesc: string;
  highlight: string;
}

export default function IntegrationsSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const autoPlayRef = useRef<NodeJS.Timeout>();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
    rootMargin: '0px'
  });

  useEffect(() => {
    // Force dark mode when section is in view
    if (inView) {
      const html = document.documentElement;
      const originalTheme = html.getAttribute('data-theme');
      html.setAttribute('data-theme', 'dark');
      
      return () => {
        if (originalTheme) {
          html.setAttribute('data-theme', originalTheme);
        } else {
          html.removeAttribute('data-theme');
        }
      };
    }
  }, [inView]);

  useEffect(() => {
    if (isAutoPlaying && inView) {
      autoPlayRef.current = setInterval(() => {
        setHoveredIndex((prev) => (prev === null || prev >= integrations.length - 1 ? 0 : prev + 1));
      }, 3000);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, inView]);

  const handleMouseEnter = (index: number) => {
    setIsAutoPlaying(false);
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  const integrations: Integration[] = [
    {
      name: 'Power BI',
      description: 'Create rich, interactive data visualizations and reports with Microsoft Power BI integration.',
      url: 'https://powerbi.microsoft.com/',
      logo: 'https://raw.githubusercontent.com/microsoft/PowerBI-Icons/main/SVG/Power-BI.svg',
      color: 'from-[#FFB900] to-[#FF2000]',
      shortDesc: 'Interactive data visualization',
      highlight: '100+',
    },
    {
      name: 'Tableau',
      description: 'Transform your data into actionable insights with Tableau\'s powerful analytics platform.',
      url: 'https://www.tableau.com/',
      logo: 'https://cdns.tblsft.com/sites/all/themes/tabwat/logo.png',
      color: 'from-[#1F77B4] to-[#1E4B73]',
      shortDesc: 'Advanced analytics platform',
      highlight: '50+',
    },
    {
      name: 'Google Analytics',
      description: 'Track and analyze your website traffic with Google Analytics comprehensive tools.',
      url: 'https://analytics.google.com/',
      logo: 'https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg',
      color: 'from-[#FF9900] to-[#FF4500]',
      shortDesc: 'Web analytics service',
      highlight: '200+',
    },
    {
      name: 'Salesforce',
      description: 'Intégrez vos données environnementales avec Salesforce CRM.',
      url: 'https://www.salesforce.com/',
      logo: 'https://www.salesforce.com/content/dam/sfdc-docs/www/resources/campaign-assets/live-long-and-propser/images/logo.png',
      color: 'from-blue-500 via-sky-400 to-indigo-600',
      shortDesc: 'CRM Integration',
      highlight: '150+',
    },
    {
      name: 'SAP',
      description: 'Connectez-vous à SAP pour une gestion complète.',
      url: 'https://www.sap.com/',
      logo: 'https://www.sap.com/dam/application/shared/logos/sap-logo-svg.svg',
      color: 'from-blue-600 via-indigo-500 to-purple-600',
      shortDesc: 'ERP Integration',
      highlight: '75+',
    },
    {
      name: 'Microsoft Excel',
      description: 'Exportez et analysez vos données dans Excel.',
      url: 'https://www.microsoft.com/excel',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/3/34/Microsoft_Office_Excel_%282019%E2%80%93present%29.svg',
      color: 'from-green-500 via-emerald-400 to-teal-600',
      shortDesc: 'Export & Analyse',
      highlight: '300+',
    }
  ];

  return (
    <section ref={ref} className="w-full h-screen py-16 overflow-hidden bg-gray-900">
      <div className="container mx-auto relative h-full flex flex-col justify-center">
        <div className="flex flex-col items-center justify-center text-center mb-16 relative z-10">
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-primary to-success transition-all duration-[1500ms] whitespace-normal break-words max-w-5xl ml-auto leading-normal tracking-normal py-2`}>
            Intégrations Complètes
          </h2>
          <p className={`text-xl text-gray-300 max-w-3xl ml-auto`}>
            <span className="font-bold">
              Connectez vos outils préférés et optimisez votre gestion de flotte
            </span>
          </p>
        </div>

        <div className="flex justify-between items-start max-w-[1200px] mx-auto relative">
          {/* Left side - Cards that appear on hover */}
          <div className="w-[422px] relative h-[575px] -mt-32 -ml-8">
            {integrations.map((integration, index) => (
              <div
                key={`card-${integration.name}`}
                className={`absolute inset-0 transition-all duration-500 transform
                  ${hoveredIndex === index 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-4 scale-95 pointer-events-none'}`}
              >
                {/* Shape Card - Now overlaid on content */}
                <div className="absolute inset-0 rounded-[1.25rem] overflow-hidden">
                  <div className="absolute inset-0">
                    {integration.name === 'Power BI' && (
                      <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="powerbi-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FFB900" />
                            <stop offset="60%" stopColor="#FF4800" />
                            <stop offset="100%" stopColor="#FF2000" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,0 L100,0 L100,100 Q70,90 80,50 Q90,10 0,0"
                          fill="url(#powerbi-gradient)"
                          className="opacity-95"
                        />
                      </svg>
                    )}
                    {integration.name === 'Tableau' && (
                      <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="tableau-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#1F77B4" />
                            <stop offset="60%" stopColor="#2B5D8F" />
                            <stop offset="100%" stopColor="#1E4B73" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,0 
                             C15,0 25,0 35,0
                             C45,0 50,5 55,10
                             C60,15 60,20 60,25
                             L60,75
                             C60,80 60,85 55,90
                             C50,95 45,100 35,100
                             C25,100 15,100 0,100
                             Z"
                          fill="url(#tableau-gradient)"
                          className="opacity-95"
                        />
                      </svg>
                    )}
                    {integration.name === 'Google Analytics' && (
                      <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="analytics-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#FF9900" />
                            <stop offset="60%" stopColor="#FF5733" />
                            <stop offset="100%" stopColor="#FF4500" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,0 
                             L100,0
                             L100,100
                             L0,100
                             Z"
                          fill="url(#analytics-gradient)"
                          className="opacity-95"
                        />
                        <path
                          d="M10,45
                             A7,7 0 1,1 10,59
                             A7,7 0 1,1 10,45
                             M50,15
                             A7,7 0 1,1 50,29
                             A7,7 0 1,1 50,15
                             M90,75
                             A7,7 0 1,1 90,89
                             A7,7 0 1,1 90,75"
                          fill="white"
                          className="opacity-90"
                        />
                        <path
                          d="M10,52 L50,22 L90,82"
                          stroke="white"
                          strokeWidth="5"
                          fill="none"
                          className="opacity-90"
                        />
                      </svg>
                    )}
                    {integration.name === 'Salesforce' && (
                      <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="salesforce-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#00A1E0" />
                            <stop offset="50%" stopColor="#1CE783" />
                            <stop offset="100%" stopColor="#00A1E0" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,0 
                             C20,0 40,10 50,30
                             C60,50 80,60 100,60
                             L100,100
                             L0,100
                             Z"
                          fill="url(#salesforce-gradient)"
                          className="opacity-95"
                        />
                      </svg>
                    )}
                    {integration.name === 'SAP' && (
                      <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="sap-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3366CC" />
                            <stop offset="50%" stopColor="#6666FF" />
                            <stop offset="100%" stopColor="#9933FF" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,0 
                             L100,0
                             L100,100
                             C80,90 60,95 40,85
                             C20,75 10,80 0,70
                             Z"
                          fill="url(#sap-gradient)"
                          className="opacity-95"
                        />
                      </svg>
                    )}
                    {integration.name === 'Microsoft Excel' && (
                      <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="excel-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#217346" />
                            <stop offset="50%" stopColor="#1E9651" />
                            <stop offset="100%" stopColor="#1AB559" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M0,0 
                             L100,0
                             L100,100
                             L0,100
                             C10,80 30,60 20,40
                             C10,20 0,10 0,0
                             Z"
                          fill="url(#excel-gradient)"
                          className="opacity-95"
                        />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-start p-8">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <img 
                        src={integration.logo} 
                        alt={integration.name}
                        className="w-14 h-14 object-contain bg-white rounded-lg p-2"
                      />
                      <h3 className="text-2xl font-bold tracking-tight text-black white-stroke
                        [text-shadow:_1.5px_1.5px_0_rgb(255_255_255_/_60%),
                                    -1.5px_-1.5px_0_rgb(255_255_255_/_60%),
                                    1.5px_-1.5px_0_rgb(255_255_255_/_60%),
                                    -1.5px_1.5px_0_rgb(255_255_255_/_60%)]">
                        {integration.name}
                      </h3>
                    </div>
                    <p className="text-base font-medium text-black white-stroke
                      [text-shadow:_0.75px_0.75px_0_rgb(255_255_255_/_50%),
                                  -0.75px_-0.75px_0_rgb(255_255_255_/_50%),
                                  0.75px_-0.75px_0_rgb(255_255_255_/_50%),
                                  -0.75px_0.75px_0_rgb(255_255_255_/_50%)]">
                      {integration.shortDesc}
                    </p>
                    <p className="text-base font-medium leading-relaxed text-black white-stroke
                      [text-shadow:_0.75px_0.75px_0_rgb(255_255_255_/_50%),
                                  -0.75px_-0.75px_0_rgb(255_255_255_/_50%),
                                  0.75px_-0.75px_0_rgb(255_255_255_/_50%),
                                  -0.75px_0.75px_0_rgb(255_255_255_/_50%)]">
                      {integration.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right side - List of integrations */}
          <div className="w-1/2 pl-20" onMouseLeave={handleMouseLeave}>
            <ul className="space-y-6">
              {integrations.map((integration, index) => (
                <li 
                  key={`list-${integration.name}`}
                  className="transform transition-all duration-300"
                >
                  <button
                    onMouseEnter={() => handleMouseEnter(index)}
                    className={`text-3xl sm:text-4xl font-medium tracking-tight transition-all duration-500
                      ${hoveredIndex === index 
                        ? `bg-gradient-to-r ${integration.color} bg-clip-text text-transparent scale-105` 
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                      }
                    `}
                  >
                    {integration.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Additional decorative elements */}
        <div className="absolute w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full" />
          <div className="absolute top-3/4 right-1/4 w-40 h-40 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full" />
          <div className="absolute bottom-1/4 left-1/2 w-36 h-36 bg-gradient-to-r from-secondary/20 to-accent/20 rounded-full" />
        </div>
      </div>
    </section>
  );
}
