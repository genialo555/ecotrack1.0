'use client';

import { AdminDashboard } from './AdminDashboard';

export default function AdminDashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800"> 
      <AdminDashboard />
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { UserInfoSection } from '@/app/dashboard/sections/UserInfoSection';
import { QuickActionsSection } from '@/app/dashboard/sections/QuickActionsSection';
import { AdminStatsSection } from '@/app/dashboard/sections/AdminStatsSection';

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'ADMIN' | 'USER';
  isActive: boolean;
  created_at?: string;
}

const formatDate = (dateString?: string) => {
  if (!dateString) {
    return 'Date non disponible';
  }

  try {
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    
    if (isNaN(date.getTime())) {
      console.error('Invalid date:', dateString);
      return 'Date non disponible';
    }

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date non disponible';
  }
};
