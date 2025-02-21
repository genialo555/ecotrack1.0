'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export const Sidenav = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const NavLink = ({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) => {
    const active = isActive(href);
    const isHome = href === '/';
    
    return (
      <Link
        href={href}
        className={`
          group flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-300
          ${active 
            ? isHome 
              ? 'text-white bg-gradient-to-r from-green-500 via-emerald-500 to-orange-500'
              : 'text-white bg-gradient-to-r from-emerald-800 via-emerald-700 to-orange-700' 
            : 'hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-500 hover:via-green-500 hover:to-emerald-500 font-medium'
          }
          ${!active && 'hover:bg-gradient-to-r hover:from-transparent hover:via-green-100/90 hover:to-orange-200/95 dark:hover:via-green-800/90 dark:hover:to-orange-700/95'}
        `}
      >
        <div className={`
          w-6 h-6 flex-shrink-0 transition-colors duration-300
          ${active 
            ? isHome
              ? 'text-emerald-100'
              : 'text-orange-100' 
            : 'text-base-content/80 dark:text-white/80 group-hover:text-emerald-500 dark:group-hover:text-orange-400'
          }
        `}>
          {icon}
        </div>
        <span className={`
          text-base whitespace-nowrap overflow-hidden transition-all duration-300 font-medium
          ${isCollapsed ? 'w-0 opacity-0' : 'w-40 opacity-100'}
          ${!active && 'text-base-content/90 dark:text-white/90 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:via-sky-400 group-hover:to-blue-500'}
        `}>
          {children}
        </span>
      </Link>
    );
  };

  return (
    <aside 
      className={`
        fixed top-0 left-0 h-screen z-[999] transition-all duration-300 py-4
        ${isCollapsed ? 'w-20 bg-transparent' : 'w-72 bg-base-300/20 backdrop-blur-sm'}
      `}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <nav className="h-full flex flex-col gap-3 px-3">
        <NavLink 
          href="/" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          }
        >
          Accueil
        </NavLink>
        <NavLink 
          href="/dashboard" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
            </svg>
          }
        >
          Tableau de bord
        </NavLink>
        <NavLink 
          href="/documents" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          }
        >
          Documents
        </NavLink>
        <NavLink 
          href="/settings" 
          icon={
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          }
        >
          Paramètres
        </NavLink>
      </nav>
    </aside>
  );
};
