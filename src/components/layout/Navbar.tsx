'use client';

import Link from 'next/link';
import { ThemeToggle } from './ThemeToggle';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`
      fixed top-2 left-0 right-0 z-30 transition-all duration-300 mx-4 rounded-full
      ${scrolled 
        ? 'bg-gradient-to-t from-green-100/20 via-white/60 to-white/80 dark:from-green-900/20 dark:via-gray-900/60 dark:to-gray-900/80 backdrop-blur-sm' 
        : 'bg-gradient-to-t from-green-100/10 via-white/40 to-white/60 dark:from-green-900/10 dark:via-gray-900/40 dark:to-gray-900/60 backdrop-blur-sm'
      }
    `}>
      <div className="flex justify-between items-center px-6 py-2">
        <div className="flex-shrink-0">
          <Image src="/logo.png" width={40} height={40} alt="Logo" className="w-10 h-10" />
        </div>
        <div className="flex items-center gap-4">
          {/* Navigation links - only visible on large screens */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/features" className="group px-3 py-2 text-sm rounded-md">
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-orange-500 to-green-500 bg-[length:200%_100%] bg-[position:0%] group-hover:bg-[position:100%] transition-all duration-300">
                Fonctionnalités
              </span>
            </Link>
            <Link href="/about" className="group px-3 py-2 text-sm rounded-md">
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-orange-500 to-green-500 bg-[length:200%_100%] bg-[position:0%] group-hover:bg-[position:100%] transition-all duration-300">
                À propos
              </span>
            </Link>
            <Link href="/contact" className="group px-3 py-2 text-sm rounded-md">
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-orange-500 to-green-500 bg-[length:200%_100%] bg-[position:0%] group-hover:bg-[position:100%] transition-all duration-300">
                Contact
              </span>
            </Link>
            <Link href="/demo" className="group px-3 py-2 text-sm rounded-md">
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-orange-500 to-green-500 bg-[length:200%_100%] bg-[position:0%] group-hover:bg-[position:100%] transition-all duration-300">
                Demo
              </span>
            </Link>
            <Link href="/blog" className="group px-3 py-2 text-sm rounded-md">
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-orange-500 to-green-500 bg-[length:200%_100%] bg-[position:0%] group-hover:bg-[position:100%] transition-all duration-300">
                Blog
              </span>
            </Link>
          </nav>
          <ThemeToggle />
          <Link 
            href="/login" 
            className="group inline-flex items-center justify-center bg-orange-500 hover:bg-gradient-to-r hover:from-green-500 hover:via-green-600 hover:to-green-500 rounded-full px-7 py-2.5 transition-all duration-300 shadow-[0_2px_10px_rgba(249,115,22,0.3)] hover:shadow-[0_3px_15px_rgba(34,197,94,0.5)]"
          >
            <span className="text-sm font-semibold text-white">
              Connexion
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
