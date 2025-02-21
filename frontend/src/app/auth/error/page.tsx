'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (error) {
      console.error('Auth error:', error);
    }
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Erreur d&apos;authentification
          </h2>
        </div>
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-bold">Une erreur est survenue</h3>
            <div className="text-sm">
              {error === 'Configuration' && 'Erreur de configuration. Veuillez contacter l\'administrateur.'}
              {error === 'AccessDenied' && 'Accès refusé. Vous n\'avez pas les permissions nécessaires.'}
              {error === 'Verification' && 'Erreur de vérification. Veuillez réessayer.'}
              {!error && 'Une erreur inconnue est survenue.'}
            </div>
          </div>
        </div>
        <div className="text-center">
          <a href="/auth/signin" className="text-primary hover:text-primary-focus">
            Retour à la page de connexion
          </a>
        </div>
      </div>
    </div>
  );
}
