'use client';

import { Card } from '@/components/common/Card';
import { UserIcon } from '@/components/common/Icons'; // Assuming the UserIcon is imported from this location

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'ADMIN' | 'USER';
  isActive: boolean;
  created_at?: string;
}

interface UserInfoSectionProps {
  user: User;
  isAdmin?: boolean;
}

const formatDate = (dateString?: string) => {
  if (!dateString) {
    return 'Date non disponible';
  }

  try {
    const [day, month, year] = dateString.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    
    if (isNaN(date.getTime())) {
      return 'Date non disponible';
    }

    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  } catch (error) {
    return 'Date non disponible';
  }
};

export function UserInfoSection({ user, isAdmin = false }: UserInfoSectionProps) {
  return (
    <Card 
      title="Informations Personnelles"
      description="Vos informations de profil"
      icon={<UserIcon className="w-6 h-6" />}
      className="bg-base-200 rounded-lg p-6 col-span-2"
    >
      <h2 className="text-2xl font-semibold mb-4">Vos informations</h2>
      <div className="space-y-3">
        <p><span className="font-medium">Email:</span> {user.email}</p>
        <p><span className="font-medium">Rôle:</span> {isAdmin ? 'Administrateur' : 'Utilisateur'}</p>
        <p><span className="font-medium">Statut:</span> {user.isActive ? 'Actif' : 'Inactif'}</p>
        <p><span className="font-medium">Membre depuis:</span> {formatDate(user.created_at)}</p>
      </div>
    </Card>
  );
}
