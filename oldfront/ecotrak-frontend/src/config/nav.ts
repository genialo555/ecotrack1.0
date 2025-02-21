import type { LucideIcon } from 'lucide-react';
import { Home, Map, BarChart2, Settings, Car } from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  disabled?: boolean;
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Map',
    href: '/map',
    icon: Map,
  },
  {
    title: 'Statistics',
    href: '/stats',
    icon: BarChart2,
  },
  {
    title: 'Vehicles',
    href: '/vehicles',
    icon: Car,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];
