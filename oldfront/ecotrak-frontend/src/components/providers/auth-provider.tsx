'use client';

import { createContext, useContext, ReactNode, useCallback } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { User } from '@/lib/types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  // Ne montrer l'écran de chargement que pendant l'initialisation
  const loadingScreen = (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500"></div>
        <p className="mt-2 text-gray-500">Chargement...</p>
      </div>
    </div>
  );

  // Afficher le loading screen uniquement lors de l'initialisation
  if (auth.loading && !auth.user) {
    return loadingScreen;
  }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }

  // Memoize les fonctions pour éviter les re-renders inutiles
  const login = useCallback(async (email: string, password: string) => {
    try {
      console.log('🔒 AuthContext - Tentative de connexion');
      await context.login(email, password);
      console.log('✅ AuthContext - Connexion réussie');
    } catch (error) {
      console.error('❌ AuthContext - Erreur de connexion:', error);
      throw error;
    }
  }, [context.login]);

  const logout = useCallback(async () => {
    try {
      console.log('🚪 AuthContext - Tentative de déconnexion');
      await context.logout();
      console.log('✅ AuthContext - Déconnexion réussie');
    } catch (error) {
      console.error('❌ AuthContext - Erreur de déconnexion:', error);
      throw error;
    }
  }, [context.logout]);

  return {
    ...context,
    login,
    logout,
  };
}