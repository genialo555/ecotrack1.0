'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthContext } from '@/components/providers/auth-provider';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthContext();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a2632] to-[#242f3e]">
      <div className="container mx-auto px-4 py-12">
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-16">
          <div className="text-2xl font-bold text-emerald-500">EcoTrack</div>
          <div className="space-x-4">
            <Link 
              href="/login" 
              className="px-6 py-2 text-gray-300 hover:text-white transition-colors"
            >
              Connexion
            </Link>
            <Link
              href="/register"
              className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
            >
              Inscription
            </Link>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6">
            Suivez votre impact environnemental
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Mesurez, analysez et réduisez votre empreinte carbone liée aux déplacements.
            Une solution simple pour agir concrètement pour l'environnement.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center px-8 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors text-lg font-medium"
          >
            Commencer gratuitement
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-[#1a2632]/50 p-6 rounded-xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Suivi détaillé</h3>
            <p className="text-gray-300">
              Visualisez vos émissions de CO2 par trajet et suivez votre évolution au fil du temps.
            </p>
          </div>

          <div className="bg-[#1a2632]/50 p-6 rounded-xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Comparaison des modes</h3>
            <p className="text-gray-300">
              Comparez l'impact des différents modes de transport pour faire les meilleurs choix.
            </p>
          </div>

          <div className="bg-[#1a2632]/50 p-6 rounded-xl backdrop-blur-sm">
            <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Objectifs personnalisés</h3>
            <p className="text-gray-300">
              Fixez-vous des objectifs de réduction et suivez vos progrès mois après mois.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
