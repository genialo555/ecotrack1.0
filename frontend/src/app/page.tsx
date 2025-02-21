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
        <ContactSection />
        <Footer />
      </MobileLayout>
    );
  }

  return (
    <main className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <DashboardSection />
      <IntegrationsSection />
      <StatsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
