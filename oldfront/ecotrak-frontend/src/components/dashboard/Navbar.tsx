import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavbarProps {
  userEmail?: string;
  onLogout?: () => void;
  onOpenSidebar?: () => void;
}

const navItems = [
  {
    label: 'Vue d\'ensemble',
    href: '/dashboard',
    icon: 'dashboard'
  },
  {
    label: 'Trajets',
    href: '/dashboard/journeys',
    icon: 'route'
  },
  {
    label: 'Statistiques',
    href: '/dashboard/stats',
    icon: 'chart'
  },
  {
    label: 'Rapports',
    href: '/dashboard/reports',
    icon: 'report'
  }
];

export const Navbar: React.FC<NavbarProps> = ({ userEmail, onLogout, onOpenSidebar }) => {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={onOpenSidebar}
        className="lg:hidden fixed left-4 top-4 z-50 p-2 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
        aria-label="Toggle Menu"
      >
        <span className="icon icon-menu text-primary" />
      </button>

      {/* Main Navigation */}
      <nav className="w-sidebar bg-background border-r border-subtle">
        {/* Logo */}
        <div className="h-header flex items-center px-6 border-b border-subtle">
          <Link href="/dashboard" className="text-xl font-bold text-primary">
            EcoTrak
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors
                  ${isActive 
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-muted hover:bg-subtle'
                  }`}
              >
                <span className={`icon icon-${item.icon}`} />
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-subtle">
          <div className="flex items-center gap-3 px-4 py-2">
            <span className="icon icon-user text-muted" />
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{userEmail?.split('@')[0]}</div>
              <div className="text-sm text-muted truncate">{userEmail}</div>
            </div>
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 rounded-lg hover:bg-subtle transition-colors"
                aria-label="Logout"
              >
                <span className="icon icon-logout text-muted" />
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};
