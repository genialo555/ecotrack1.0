/* eslint-disable @typescript-eslint/no-unused-vars */
// src/lib/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '../services/auth.service';
import { User, UserRole } from '../types/auth';

function convertToUserRole(role: string): UserRole {
 switch (role.toUpperCase()) {
   case 'ADMIN':
     return UserRole.ADMIN;
   case 'USER':
     return UserRole.USER;
   default:
     throw new Error(`Rôle inconnu : ${role}`);
 }
}

export function useAuth() {
 const [user, setUser] = useState<User | null>(null);
 const [isAuthenticated, setIsAuthenticated] = useState(false);
 const [loading, setLoading] = useState(true);
 const router = useRouter();

 // Vérification initiale de l'authentification
 const checkAuth = useCallback(async () => {
   try {
     console.log('🔍 Vérification de l\'authentification');
     const userData = await AuthService.getCurrentUser();
     
     const userWithRole = {
       ...userData,
       role: convertToUserRole(userData.role),
     };
     
     setUser(userWithRole);
     setIsAuthenticated(true);
     console.log('✅ Utilisateur authentifié:', userWithRole.email);
   } catch (error) {
     console.log('❌ Non authentifié');
     setUser(null);
     setIsAuthenticated(false);
     // Ne pas rediriger si on est déjà sur la page de login
     if (window.location.pathname !== '/login') {
       router.push('/login');
     }
   } finally {
     setLoading(false);
   }
 }, [router]);

 useEffect(() => {
   checkAuth();
 }, [checkAuth]);

 const login = useCallback(async (email: string, password: string) => {
   setLoading(true);
   try {
     console.log('🔒 Tentative de connexion:', email);
     const response = await AuthService.login(email, password);
     
     const userData = {
       ...response.user,
       role: convertToUserRole(response.user.role),
     };
     
     setUser(userData);
     setIsAuthenticated(true);
     console.log('✅ Connexion réussie pour:', email);
     
     // La redirection sera gérée par le middleware
     return userData;
   } catch (error) {
     console.error('❌ Erreur de connexion:', error);
     setUser(null);
     setIsAuthenticated(false);
     throw error;
   } finally {
     setLoading(false);
   }
 }, []);

 const logout = useCallback(async () => {
   try {
     console.log('🚪 Déconnexion...');
     setLoading(true);
     await AuthService.logout();
     
     setUser(null);
     setIsAuthenticated(false);
     
     router.push('/login');
     console.log('✅ Déconnexion réussie');
   } catch (error) {
     console.error('❌ Erreur de déconnexion:', error);
     throw error;
   } finally {
     setLoading(false);
   }
 }, [router]);

 return {
   user,
   isAuthenticated,
   loading,
   login,
   logout,
   checkAuth, // Exposé pour permettre de rafraîchir l'état si nécessaire
 };
}