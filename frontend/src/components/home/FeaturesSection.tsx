'use client';

import React, { useEffect } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { useInView } from 'react-intersection-observer';

interface Feature {
  title: string;
  description: string;
  image?: string;
}

const FeaturesSection: React.FC = () => {
  const { ref, inView } = useInView({
    threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5],  // Multiple thresholds to trigger as user scrolls
    triggerOnce: false,
    rootMargin: '-10% 0px'
  });

  const getDelayForIndex = (index: number, feature: any) => {
    // Special delay for circular card and specific route card
    if (feature.title === 'LIA') {
      return 4000; // Last card
    }
    if (feature.title === "Trouvez n'importe quel itinéraire") {
      return 2000; // Second to last card
    }
    
    // Each card gets its own delay, spaced 200ms apart for a quicker sequence
    return index * 200;
  };

  const getAnimationClass = (delay: number = 0) => `
    transition-all duration-1000 ease-out
    ${inView 
      ? `opacity-100 transform scale-100 translate-y-0 ${delay ? `delay-[${delay}ms]` : ''}`
      : 'opacity-0 transform scale-75 translate-y-4'
    }
  `;

  const features: Feature[] = [
    {
      title: 'Notes & Documents',
      description: 'Gérez facilement vos documents et autres notes .',
      image: '/images/features/gestiondeprojet .jpeg'
    },
    {
      title: 'Gestion des Tâches',
      description: 'Planifiez et suivez vos tâches quotidiennes efficacement.',
      image: '/images/features/ressource mangement.jpeg'
    },
    {
      title: 'economisez des ressources',
      description: 'Optimisez vos ressources efficacement',
      image: '/images/features/gestiondeprojet .jpeg'
    },
    {
      title: 'Planning Intelligent',
      description: 'Optimisez votre temps avec notre système de planification intelligent.',
      image: '/images/features/planning.jpeg'
    },
    {
      title: 'Suivi en Temps Réel',
      description: 'Suivez vos données en temps réel.',
      image: '/images/features/suivi en temps reel .jpeg'
    },
    {
      title: "Chat d'Équipe",
      description: 'Coordonnez instantanément votre équipe .',
      image: '/images/features/chat.jpeg'
    },
    {
      title: "Trouvez n'importe quel itinéraire",
      description: 'Découvrez les meilleurs itinéraires .',
      image: '/images/features/itineraire .jpeg'
    },
    {
      title: 'Gestion de Projets',
      description: 'Gérez vos projets RSE de manière centralisée.',
      image: '/images/features/ressource .jpeg'
    },
    {
      title: 'Chat Intégré',
      description: 'Communiquez efficacement avec votre équipe.',
      image: '/images/features/gestionde.jpeg'
    },
    {
      title: 'Intégration API',
      description: 'Connectez facilement vos outils grâce à notre API .',
      image: '/images/features/ressource mangement.jpeg'
    },
    {
      title: 'LIA',
      description: 'Votre assistant virtuel ',
      image: '/images/features/ai.jpeg'
    }
  ];

  useEffect(() => {
    // Force dark mode for this section
    const html = document.documentElement;
    const originalTheme = html.getAttribute('data-theme');
    html.setAttribute('data-theme', 'dark');
    
    // Cleanup function to restore original theme when component unmounts
    return () => {
      if (originalTheme) {
        html.setAttribute('data-theme', originalTheme);
      } else {
        html.removeAttribute('data-theme');
      }
    };
  }, []);

  return (
    <section id="features" className="relative min-h-screen py-24 -mt-24 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-left mb-12">
            <h2 className="text-4xl font-bold tracking-tight text-white mb-4">
              Découvrez les outils qui vous aideront à optimiser votre impact environnemental
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl">
              Des solutions innovantes pour une gestion durable et efficace de vos ressources.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-9 auto-rows-[minmax(150px,auto)] gap-4 max-w-[1400px] mx-auto relative">
          {features.map((feature, index) => {
            const isCenter = feature.title === 'Suivi en Temps Réel';
            const isCircular = feature.title === 'LIA' || feature.title === 'economisez des ressources';
            let cardClasses = '';
            
            // Center the main card and wrap others around
            switch(index) {
              case 0: // Notes & Documents - Square
                cardClasses = 'col-span-2 row-span-2 col-start-2 row-start-2';
                break;
              case 1: // Gestion des Tâches - Square
                cardClasses = 'col-span-2 row-span-2 col-start-1 row-start-4';
                break;
              case 2: // economisez des ressources - Square
                cardClasses = 'col-span-2 row-span-2 col-start-1 row-start-5 z-[30]';
                break;
              case 3: // Planning Intelligent - Wide
                cardClasses = 'col-span-3 row-span-2 col-start-3 row-start-1';
                break;
              case 4: // Suivi en Temps Réel - Large Square (Center)
                cardClasses = 'col-span-3 row-span-4 col-start-4 row-start-2 z-[30]';
                break;
              case 5: // Chat d'Équipe - Square
                cardClasses = 'col-span-2 row-span-2 col-start-7 row-start-2';
                break;
              case 6: // Trouvez n'importe quel itinéraire - Wide
                cardClasses = 'col-span-3 row-span-2 col-start-3 row-start-4 z-[40]';
                break;
              case 7: // Gestion de Projets - Square
                cardClasses = 'col-span-2 row-span-2 col-start-7 row-start-4 -translate-x-[16.58%]';
                break;
              case 8: // Chat Intégré - Square
                cardClasses = 'col-span-2 row-span-2 col-start-7 row-start-4 -translate-x-[15.18%] z-[140]';
                break;
              case 9: // Intégration API - Square
                cardClasses = 'col-span-3 row-span-2 col-start-6 row-start-1 translate-x-[16.18%]';
                break;
              case 10: // LIA - Circular card 1 - Top right
                cardClasses = 'col-span-3 row-span-2 col-start-8 row-start-1 z-[180] translate-x-[-3cm]translate-y-[-3cm]';
                break;
              default:
                cardClasses = 'col-span-1 row-span-3';
            }

            return (
              <div
                key={feature.title}
                ref={ref}
                className={`group relative ${isCircular ? 'rounded-full' : 'rounded-3xl'} ${
                  feature.title === 'LIA' ? 'scale-[0.536] -translate-y-[4cm] translate-x-[4cm] aspect-square w-[200px] h-[200px] flex items-center justify-center' : 
                  feature.title === 'economisez des ressources' ? 'scale-[0.67] -translate-y-[4cm] -translate-x-[4cm]' : 
                  ''
                } p-6 
                  ${cardClasses}
                  backdrop-blur-xl
                  transform transition-all duration-1000 ease-out
                  hover:scale-[1.03] hover:-translate-y-1
                  shadow-[0_4px_6px_-1px_rgba(0,0,0,0.3),0_2px_4px_-2px_rgba(0,0,0,0.2),0_20px_40px_-12px_rgba(0,0,0,0.5)]
                  hover:shadow-[0_10px_20px_-5px_rgba(0,0,0,0.4),0_4px_8px_-4px_rgba(0,0,0,0.3),0_35px_60px_-15px_rgba(0,0,0,0.6)]
                  bg-gray-800/80
                  before:content-[''] before:absolute before:inset-0 before:rounded-3xl
                  before:bg-gradient-to-br before:from-gray-900/90 before:to-gray-800/50
                  after:content-[''] after:absolute after:inset-0 after:rounded-3xl
                  after:bg-gradient-to-br after:from-black/20 after:to-black/40
                  overflow-hidden
                  ${feature.title === 'Suivi en Temps Réel' ? 'z-[30]' : 
                    feature.title === 'Chat Intégré' ? 'z-[150]' :
                    feature.title === 'LIA' ? 'z-[100]' :
                    feature.title === 'Rapports Automatisés' || feature.title === 'Analyses Détaillées' ? 'z-[15]' : 
                    feature.title === 'Gestion de Projets' ? 'z-[9]' :
                    feature.title === 'Intégration API' ? 'z-[4]' :
                    feature.title === 'Notes & Documents' ? 'z-[7]' :
                    feature.title === "Chat d'Équipe" ? 'z-[6]' :
                    feature.title === "Trouvez n'importe quel itinéraire" ? 'z-[40]' :
                    'z-0'
                  }
                  ${getAnimationClass(getDelayForIndex(index, feature))}
                `}
              >
                {/* Background gradient */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <div className={`absolute inset-0 opacity-30 bg-gradient-to-br ${
                      isCenter 
                        ? 'from-blue-500/40 via-purple-500/30 to-pink-500/40' 
                        : index === 0
                        ? 'from-emerald-500/30 via-teal-500/30 to-green-700/30'
                        : index === 1
                        ? 'from-blue-500/30 via-indigo-500/30 to-violet-700/30'
                        : index === 2
                        ? 'from-orange-500/30 via-amber-500/30 to-yellow-700/30'
                        : index === 4
                        ? 'from-pink-500/30 via-rose-500/30 to-red-700/30'
                        : index === 5
                        ? 'from-cyan-500/30 via-sky-500/30 to-blue-700/30'
                        : index === 6
                        ? 'from-purple-500/30 via-fuchsia-500/30 to-pink-700/30'
                        : 'from-slate-500/30 via-gray-500/30 to-zinc-700/30'
                    }`} />
                  </div>
                </div>

                {/* Image */}
                {feature.image && (
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <img src={feature.image} alt={feature.title} className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Content */}
                <div className={`relative z-10 h-full flex flex-col ${isCircular ? 'justify-center items-center text-center' : 'justify-between text-right'}`}>
                  <div>
                    <h3 className={`${
                      isCenter ? 'text-3xl md:text-4xl mb-4' : 
                      isCircular ? 'text-2xl md:text-3xl' :
                      'text-xl md:text-2xl'
                    } font-bold text-white`}>
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-gray-300">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Center card indicator */}
                {isCenter && (
                  <div className="absolute bottom-5 left-5 w-3 h-3 rounded-full bg-primary animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
