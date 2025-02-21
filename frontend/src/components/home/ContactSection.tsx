'use client';

import React, { useState } from 'react';
import { ContactForm } from './ContactForm';
import { NewsletterForm } from './NewsletterForm';
import ServiceClient from './ServiceClient';
import Ressources from './Ressources';

const ContactSection: React.FC = () => {
  const [activeCard, setActiveCard] = useState<string>('newsletter');
  const [isFormFocused, setIsFormFocused] = useState(false);

  const cards = [
    {
      id: 'newsletter',
      title: 'Restez informé',
      description: 'Recevez nos actualités en vous abonnant.',
      component: <NewsletterForm getAnimationClass={(delay?: number) => ''} />,
    },
    {
      id: 'contact',
      title: 'Contact',
      subTitle: 'Contactez-nous',
      description: 'Nous sommes là pour répondre à vos questions.',
      component: <ContactForm />,
    },
    {
      id: 'support',
      title: 'Support',
      description: 'Notre équipe est disponible 24/7 pour vous aider.',
      component: <ServiceClient />,
    },
    {
      id: 'resources',
      title: 'Ressources',
      description: 'Explorez notre base de connaissances.',
      component: <Ressources />,
    },
  ];

  const handleMouseEnter = (cardId: string) => {
    if (!isFormFocused) {
      setActiveCard(cardId);
    }
  };

  const handleMouseLeave = () => {
    if (!isFormFocused) {
      setActiveCard('newsletter');
    }
  };

  const handleFormFocus = () => {
    setIsFormFocused(true);
  };

  const handleFormBlur = (e: React.FocusEvent) => {
    // Vérifie si le nouvel élément focusé est aussi un élément du formulaire
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget?.closest('form')) {
      setIsFormFocused(false);
      setActiveCard('newsletter');
    }
  };

  return (
    <section 
      className="relative py-20 overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: 'url("/images/features/contact.jpg")',
      }}
    >
      {/* Dark overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-base-300/90 to-base-100/90 dark:from-base-100/95 dark:to-base-300/95" />
      
      {/* Éléments d'animation en arrière-plan */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-16 -top-16 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-blob" />
        <div className="absolute right-32 top-32 w-48 h-48 bg-secondary/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute left-1/2 bottom-8 w-56 h-56 bg-accent/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-12 text-base-content dark:text-white">
          Contactez-nous
        </h2>

        <div className="relative flex justify-center items-start">
          <div className="relative flex space-x-8">
            {cards.map((card, index) => (
              <div
                key={card.id}
                className={`
                  relative flex-shrink-0 
                  transition-all duration-500 ease-in-out 
                  bg-base-100/80 backdrop-blur-lg dark:bg-base-300/80
                  rounded-lg shadow-lg overflow-hidden
                  hover:shadow-xl
                  ${activeCard === card.id ? 'w-[800px] h-[796px]' : 'w-24 h-[796px]'}
                  ${activeCard === card.id ? 'z-30' : 'z-20'}
                `}
                onMouseEnter={() => handleMouseEnter(card.id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Titre vertical */}
                <div
                  className={`
                    absolute top-0 left-0 h-full w-full flex items-center justify-center
                    transform -rotate-90 origin-center transition-all duration-500
                    ${activeCard === card.id ? 'opacity-0 pointer-events-none' : 'opacity-100'}
                  `}
                >
                  <h3 className="text-lg font-bold text-base-content dark:text-white text-center">
                    {card.title}
                  </h3>
                </div>

                {/* Contenu détaillé */}
                <div
                  className={`
                    absolute inset-0 p-8 transition-all duration-500
                    ${activeCard === card.id ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                  `}
                  onFocus={handleFormFocus}
                  onBlur={handleFormBlur}
                >
                  <h3 className="text-2xl font-bold mb-4 text-base-content dark:text-white">
                    {card.subTitle || card.title}
                  </h3>
                  <p className="text-base-content/70 dark:text-white/70 mb-6">
                    {card.description}
                  </p>
                  {card.component && (
                    <div className="mt-4 overflow-y-auto max-h-[600px] relative">
                      {card.component}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;