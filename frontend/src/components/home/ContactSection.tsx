'use client';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import { ContactForm } from './ContactForm';
import { NewsletterForm } from './NewsletterForm';

const ContactSection: React.FC = (): React.ReactElement => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: false,
    rootMargin: '-100px 0px',
  });

  const getAnimationClass = (delay: number = 0) => `
    transition-all duration-[2000ms] ease-out
    ${inView 
      ? `opacity-100 transform translate-y-0 ${delay ? `delay-[${delay}ms]` : ''}`
      : 'opacity-0 transform translate-y-8'
    }
  `;

  return (
    <section ref={ref} className="min-h-screen flex items-center relative bg-gradient-to-b from-base-300 to-base-100 dark:from-base-100 dark:to-base-300 overflow-hidden pt-0 pb-16">
      {/* Background Decorations */}
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

      <div className="container mx-auto px-4 relative z-10 pt-0 pb-24 sm:pb-24 sm:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className={`bg-base-100/40 dark:bg-base-300/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/5 transition-all duration-[2000ms] ${
            inView ? 'opacity-100 transform translate-x-0 scale-100' : 'opacity-0 -translate-x-full scale-95'
          }`}>
            <div className="mb-8">
              <h2 className={`text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent transition-all duration-[1500ms] ${
                inView ? 'opacity-100 transform translate-y-0 delay-[400ms]' : 'opacity-0 -translate-y-4'
              }`}>
                Contactez-<span className="text-base-content dark:text-white">nous</span>
              </h2>
              <p className={`text-xl text-base-content/70 dark:text-white/70 transition-all duration-[1500ms] ${
                inView ? 'opacity-100 transform translate-y-0 delay-[600ms]' : 'opacity-0 translate-y-4'
              }`}>
                Nous sommes là pour répondre à vos questions
              </p>
            </div>
            <div className={`transition-all duration-[1500ms] ${
              inView ? 'opacity-100 transform translate-y-0 delay-[800ms]' : 'opacity-0 translate-y-8'
            }`}>
              <ContactForm getAnimationClass={getAnimationClass} />
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-16">
            <div className={`bg-base-100/40 dark:bg-base-300/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/5 transition-all duration-[2000ms] ${
              inView ? 'opacity-100 transform translate-x-0 scale-100 delay-[400ms]' : 'opacity-0 translate-x-full scale-95'
            }`}>
              <div className="mb-8">
                <h2 className={`text-4xl font-bold mb-4 transition-all duration-[1500ms] ${
                  inView ? 'opacity-100 transform translate-y-0 delay-[800ms]' : 'opacity-0 -translate-y-4'
                }`}>
                  <span className="text-primary">Restez</span>{' '}
                  <span className="text-base-content dark:text-white">Informé</span>
                </h2>
                <p className={`text-xl text-base-content/70 dark:text-white/70 transition-all duration-[1500ms] ${
                  inView ? 'opacity-100 transform translate-y-0 delay-[1000ms]' : 'opacity-0 translate-y-4'
                }`}>
                  Abonnez-vous à notre newsletter pour recevoir nos dernières actualités
                </p>
              </div>
              <div className={`transition-all duration-[1500ms] ${
                inView ? 'opacity-100 transform translate-y-0 delay-[1200ms]' : 'opacity-0 translate-y-8'
              }`}>
                <NewsletterForm getAnimationClass={getAnimationClass} className="" />
              </div>
            </div>

            {/* Info Cards - Hidden on small screens */}
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  title: 'Support Client',
                  description: 'Notre équipe est disponible 24/7 pour vous aider',
                  icon: (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  )
                },
                {
                  title: 'Ressources',
                  description: 'Accédez à notre base de connaissances',
                  icon: (
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  )
                }
              ].map((card, index) => (
                <div 
                  key={card.title}
                  className={`bg-base-100/40 dark:bg-base-300/40 backdrop-blur-xl rounded-full w-40 h-40 shadow-xl border border-white/5 hover:shadow-2xl transition-all duration-[2000ms] transform hover:scale-105 group ${
                    inView 
                      ? `opacity-100 translate-y-0 scale-100 delay-[${1600 + index * 200}ms]` 
                      : 'opacity-0 translate-y-8 scale-95'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center h-full text-center relative">
                    <div className="w-36 h-36 flex items-center justify-center bg-gradient-to-br from-orange-500/20 via-sky-500/20 to-blue-500/20 rounded-full group-hover:scale-90 transition-transform">
                      <div className="text-orange-500 dark:text-orange-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-300">
                        {card.icon}
                      </div>
                    </div>
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-base-100/95 dark:bg-base-300/95 p-3 rounded-xl shadow-xl min-w-[200px] pointer-events-none z-[10001]">
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-r-[16px] border-r-base-100/95 dark:border-r-base-300/95 border-b-8 border-b-transparent"></div>
                      <h3 className="text-lg font-bold mb-1 text-base-content dark:text-white">{card.title}</h3>
                      <p className="text-sm text-base-content/70 dark:text-white/70">{card.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
