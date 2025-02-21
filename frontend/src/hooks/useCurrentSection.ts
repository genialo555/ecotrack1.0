import { useState, useEffect } from 'react';

export type Section = 'hero' | 'features' | 'other';

export const useCurrentSection = () => {
  const [currentSection, setCurrentSection] = useState<Section>('hero');
  const [isMounted, setIsMounted] = useState(false);

  // Handle mounting
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Handle scroll detection
  useEffect(() => {
    if (!isMounted) return;
    
    const handleScroll = () => {
      if (typeof window === 'undefined') return;

      const heroSection = document.getElementById('hero-section');
      const featuresSection = document.getElementById('features-section');

      if (!heroSection || !featuresSection) return;

      const scrollPosition = window.scrollY + 100; // Offset for navbar height
      const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
      const featuresBottom = featuresSection.offsetTop + featuresSection.offsetHeight;

      if (scrollPosition < heroBottom) {
        setCurrentSection('hero');
      } else if (scrollPosition >= heroBottom && scrollPosition <= featuresBottom) {
        setCurrentSection('features');
      } else {
        setCurrentSection('other');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [isMounted]);

  // During SSR and initial mount, return 'hero' as default
  if (!isMounted) return 'hero';

  return currentSection;
};
