'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { MathGrid, MathOverlay } from './math';

const HeroBackground = ({ inView }: { inView: boolean }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (inView) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [inView]);

  return (
    <>
      <div className="absolute inset-0 overflow-hidden">
        <div className="relative w-full h-full">
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              inView ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <source 
              src={'/videos/city-chaos.mp4'}
              type="video/mp4"
            />
          </video>
          <div className="relative w-full h-full">
            <MathOverlay />
            <MathGrid />
          </div>
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-base-100/90 via-transparent to-base-200/90 dark:from-base-300/90 dark:to-base-200/90" 
        style={{ 
          background: `linear-gradient(161.8deg, 
            var(--tw-gradient-from) 0%, 
            transparent 61.8%, 
            var(--tw-gradient-to) 100%
          )`,
          backdropFilter: 'blur(4px)'
        }} 
      />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.02] dark:bg-grid-white/[0.05]" />
      </div>
    </>
  );
};

const HeroContent = ({ isVisible }: { isVisible: boolean }) => {
  const getAnimationClass = (delay: number) => 
    `animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both ${
      isVisible ? `delay-[${delay}ms]` : ''
    }`;

  return (
    <div className="container mx-auto relative p-0 z-50 h-screen flex items-center">
      <div className="flex flex-col items-start text-left gap-8 max-w-4xl mx-auto px-8">
        <h1 className={`${getAnimationClass(1000)} 
          text-7xl md:text-8xl lg:text-9xl font-bold
          bg-gradient-to-r from-orange-500 to-green-400
          text-transparent bg-clip-text
          drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`}>
          EcoTrack
        </h1>

        <h2 className={`${getAnimationClass(1500)}
          text-4xl md:text-5xl lg:text-6xl font-bold
          text-white max-w-3xl
          drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]`}>
          Surveillez et gérez vos données environnementales en toute simplicité
        </h2>
        <p className={`${getAnimationClass(2000)} text-lg md:text-xl lg:text-2xl text-white max-w-2xl`}>
          Optimisez votre empreinte carbone et votre consommation d'énergie avec notre solution complète de suivi environnemental.
        </p>
        <div className="flex flex-row items-center gap-4 sm:gap-[45px] mt-4">
          <button
            className={`${getAnimationClass(2500)} 
              btn btn-primary text-lg px-8 py-4 h-auto
              hover:scale-105 transition-transform duration-300
              shadow-lg shadow-primary/25`}
          >
            Commencer
          </button>
          <button
            className={`${getAnimationClass(2750)} 
              btn btn-outline text-lg px-8 py-4 h-auto
              hover:scale-105 transition-transform duration-300
              shadow-lg shadow-base-content/10`}
          >
            En savoir plus
          </button>
        </div>
      </div>
    </div>
  );
};

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView) {
      setIsVisible(true);
    }
  }, [inView]);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-base-100">
      <div ref={ref} className="w-full h-full relative">
        <HeroBackground inView={inView} />
        <HeroContent isVisible={isVisible} />
      </div>
    </section>
  );
};

export default HeroSection;
