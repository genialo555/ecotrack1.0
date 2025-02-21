'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { useEffect, useState } from 'react';
import { useCurrentSection } from '@/hooks/useCurrentSection';
import { Button } from '../common/Button';
import clsx from 'clsx';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const currentSection = useCurrentSection();

  // Handle mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check authentication status
  const checkAuth = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/auth/validate`, {
        credentials: 'include'
      });
      
      // Update auth state based on response
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    }
  };

  // Handle scroll and auth
  useEffect(() => {
    if (!mounted) return;

    const handleScroll = () => {
      if (typeof window === 'undefined') return;
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    checkAuth(); // Check auth when component mounts

    // Set up an interval to check auth status periodically
    const authCheckInterval = setInterval(checkAuth, 30000); // Check every 30 seconds

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll);
        clearInterval(authCheckInterval);
      }
    };
  }, [mounted]);

  // Check auth when route changes
  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(false);
        router.push('/login');
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      setIsAuthenticated(false);
      router.push('/login');
    }
  };

  // Get link style based on current section and path
  const getLinkStyle = (path: string) => {
    const isFeatures = path === '/features';
    const baseStyle = "relative group px-3 py-2 text-sm rounded-md transition-all duration-300";
    const isActive = currentSection === 'features' && isFeatures && mounted;
    
    return clsx(baseStyle, {
      'bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-gray-200/20 dark:border-gray-700/20': isActive,
    });
  };

  // Get text style based on current section
  const getTextStyle = (isFeatures: boolean = false) => {
    const baseStyle = "font-semibold transition-all duration-300";
    const gradientStyle = "text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-orange-500 to-green-500 bg-[length:200%_100%] bg-[position:0%] group-hover:bg-[position:100%]";
    
    if (currentSection === 'features' && isFeatures) {
      return `${baseStyle} ${gradientStyle} text-lg`;
    }
    return `${baseStyle} ${gradientStyle}`;
  };

  // Render a simplified version during SSR
  if (!mounted) {
    return (
      <nav className={clsx(
        'relative w-full backdrop-blur-sm transition-all duration-300',
        scrolled ? 'bg-base-100/80' : 'bg-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <nav className="hidden lg:flex items-center space-x-6">
                {/* Navigation items */}
              </nav>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={clsx(
      'relative backdrop-blur-sm transition-all duration-300',
      scrolled ? 'bg-base-100/80' : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <nav className="hidden lg:flex items-center space-x-6">
              <Link href="/features" className={getLinkStyle('/features')}>
                <span className={getTextStyle(true)}>
                  Fonctionnalités
                </span>
              </Link>
              <Link href="/about" className={getLinkStyle('/about')}>
                <span className={getTextStyle()}>
                  À propos
                </span>
              </Link>
              <Link href="/contact" className={getLinkStyle('/contact')}>
                <span className={getTextStyle()}>
                  Contact
                </span>
              </Link>
              <Link href="/demo" className={getLinkStyle('/demo')}>
                <span className={getTextStyle()}>
                  Demo
                </span>
              </Link>
              <Link href="/blog" className={getLinkStyle('/blog')}>
                <span className={getTextStyle()}>
                  Blog
                </span>
              </Link>
            </nav>

            {/* Theme Toggle and Auth */}
            <div className="flex items-center gap-2">
              <ThemeToggle />
              {isAuthenticated ? (
                <Button
                  onClick={handleLogout}
                  variant={currentSection === 'features' ? 'halo-outline' : 'halo'}
                  className="!py-2 !px-5 !text-lg border-2 border-black/20"
                >
                  Déconnexion
                </Button>
              ) : (
                <div onClick={() => router.push('/login')}>
                  <Button
                    variant={currentSection === 'features' ? 'halo-outline' : 'halo'}
                    className="!py-2 !px-5 !text-lg border-2 border-black/20"
                  >
                    Connexion
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
