'use client';

import { ReactNode } from 'react';
import { useMediaQuery } from 'react-responsive';
import MobileLayout from '@/components/layout/MobileLayout';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import DashboardSection from '@/components/home/DashboardSection';
import IntegrationsSection from '@/components/home/IntegrationsSection';
import StatsSection from '@/components/home/StatsSection';
import ContactSection from '@/components/home/ContactSection';
import Footer from '@/components/layout/Footer';

export default function HomePage(): ReactNode {
  const isMobile = useMediaQuery({ maxWidth: 640 });

  if (isMobile) {
    return (
      <MobileLayout>
        <HeroSection />
        <FeaturesSection />
        <DashboardSection />
        <IntegrationsSection />
        <StatsSection />
        <ContactSection />
        <Footer />
      </MobileLayout>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-y-auto scrollbar-thin scrollbar-track-transparent dark:scrollbar-thumb-transparent scrollbar-thumb-black/20">
      <div className="invisible h-12 sm:h-14 md:h-16 lg:h-20 xl:h-24 w-full"></div> {/* Responsive invisible padding for navbar */}
      <main className="w-full overflow-visible md:h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] xl:h-[calc(100vh-6rem)] 
        md:snap-y md:snap-mandatory
        scroll-smooth"
      >
        <div className="md:snap-start min-h-screen flex flex-col">
          <HeroSection />
        </div>
        <div className="md:snap-start min-h-screen flex flex-col">
          <FeaturesSection />
        </div>
        <div className="md:snap-start min-h-screen flex flex-col">
          <DashboardSection />
        </div>
        <div className="md:snap-start min-h-screen flex flex-col">
          <IntegrationsSection />
        </div>
        <div className="md:snap-start min-h-screen flex flex-col">
          <StatsSection />
        </div>
        <div className="md:snap-start min-h-screen flex flex-col">
          <ContactSection />
        </div>
        <div className="hidden md:block mt-auto">
          <Footer />
        </div>
      </main>
    </div>
  );
}
