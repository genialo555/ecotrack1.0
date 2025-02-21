'use client';

import { useState } from 'react';
import { useUsers } from '@/lib/hooks/useUsers';
import { useRealtimeMonitoring } from '@/lib/hooks/useRealtimeMonitoring';
import { StatCard } from '@/components/ui/stat-card';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { UserRole } from '@/lib/types/user';
import { Users, Car, Leaf, TrendingUp, PlusIcon, TrashIcon } from 'lucide-react';

interface Journey {
  id: string;
  user: { email: string };
  startPoint: string;
  endPoint: string;
  transportMode: string;
  estimatedEmissions: number;
}

interface RealtimeEmission {
  timestamp: string;
  value: number;
  trend: string;
}

interface MonitoringData {
  activeUsers: number;
  currentJourneys: Journey[];
  totalEmissionsToday: number;
  realtimeEmissions: RealtimeEmission[];
}

export default function AdminDashboard() {
  const { users, loading: usersLoading, error: usersError, createUser, deleteUser } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: UserRole.USER,
    companyId: ''
  });
  const [formError, setFormError] = useState('');

  const { 
    activeUsers, 
    currentJourneys, 
    totalEmissionsToday, 
    realtimeEmissions 
  }: MonitoringData = useRealtimeMonitoring();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(formData);
      setIsModalOpen(false);
      setFormData({ email: '', password: '', role: UserRole.USER, companyId: '' });
    } catch (error: unknown) {
      console.error('Error creating user:', error);
      setFormError('Erreur lors de la création de l\'utilisateur');
    }
  };

  const roleOptions = [
    { label: 'Utilisateur', value: UserRole.USER },
    { label: 'Administrateur', value: UserRole.ADMIN },
 
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Dashboard Header */}
      <div className="mb-12">
        <h1 className="text-3xl font-bold mb-2">Tableau de bord Admin</h1>
        <p className="text-muted-foreground">Gestion des utilisateurs et monitoring en temps réel</p>
      </div>

      {/* Real-Time Monitoring Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Monitoring en temps réel</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Utilisateurs Actifs"
            value={activeUsers}
            icon={Users}
          />
          <StatCard
            title="Trajets en cours"
            value={currentJourneys.length}
            icon={Car}
          />
          <StatCard
            title="Émissions aujourd'hui"
            value={`${totalEmissionsToday.toFixed(2)} kgCO2`}
            icon={Leaf}
          />
          <StatCard
            title="Variation"
            value={realtimeEmissions[realtimeEmissions.length - 1]?.trend || "0%"}
            icon={TrendingUp}
          />
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Trajets en cours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentJourneys.map((journey) => (
                <div key={journey.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{journey.user.email}</p>
                    <p className="text-sm text-muted-foreground">
                      {journey.startPoint} → {journey.endPoint}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {journey.transportMode}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {journey.estimatedEmissions} kgCO2
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* User Management Section */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Gestion des Utilisateurs</h2>
          <Button onClick={() => setIsModalOpen(true)}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Nouvel Utilisateur
          </Button>
        </div>

        {usersLoading && <div>Chargement...</div>}
        {usersError && <div>Erreur: {usersError.message}</div>}

        <div className="grid grid-cols-1 gap-4">
          {users.map((user) => (
            <Card key={user.id}>
              <CardContent className="flex justify-between items-center p-4">
                <div>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-sm text-gray-500">Rôle: {user.role}</p>
                  {user.companyId && (
                    <p className="text-sm text-gray-500">ID Entreprise: {user.companyId}</p>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteUser(user.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Ajouter un utilisateur"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <Alert variant="destructive">
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">Mot de passe</label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium">Rôle</label>
              <Select
                value={formData.role}
                onChange={(value) => setFormData(prev => ({ ...prev, role: value }))}
                options={roleOptions}
                placeholder="Sélectionner un rôle"
              />
            </div>

      

            <div className="flex justify-end gap-2">
              <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                Créer
              </Button>
            </div>
          </form>
        </Modal>
      </section>
    </div>
  );
}