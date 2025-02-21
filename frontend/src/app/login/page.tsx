'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import VideoSection from '@/components/login/VideoSection';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Attempting login with:', { email });
      
      const response = await api.post('/auth/login', {
        email,
        password
      });

      console.log('Login response:', response.data);

      // Get user profile after login
      const profileResponse = await api.get('/auth/profile');
      const profileData = profileResponse.data;

      console.log('Profile data:', profileData);

      // Use profile data for role check
      if (!profileData.role) {
        console.error('No role found in profile data');
        throw new Error('Erreur de rôle utilisateur');
      }

      // Normalize role to lowercase for comparison
      const userRole = profileData.role.toLowerCase();

      // Store normalized role in localStorage for future checks
      localStorage.setItem('userRole', userRole);

      // Redirect based on role
      if (userRole === 'admin') {
        console.log('Admin login - redirecting to admin dashboard');
        router.push('/dashboard/admin');
      } else {
        console.log('User login - redirecting to user dashboard');
        router.push('/dashboard/user');
      }
      
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', {
          data: err.response.data,
          status: err.response.status,
          headers: err.response.headers,
        });
        setError(err.response.data?.message || 'Identifiants invalides');
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError('Erreur de connexion au serveur');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up request:', err.message);
        setError('Erreur lors de la tentative de connexion');
      }
    }
  };

  return (
    <main className="relative min-h-screen">
      <VideoSection />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="card w-full max-w-[450px] bg-base-100/80 backdrop-blur-md shadow-xl">
          <div className="card-body p-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Se connecter
              </h1>
              <p className="text-lg text-base-content/60">
                Accédez à votre espace
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <input
                  type="email"
                  placeholder="Email"
                  className="input input-bordered w-full"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <input
                  type="password"
                  placeholder="Mot de passe"
                  className="input input-bordered w-full"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <div className="text-error text-sm text-center">
                  {error}
                </div>
              )}

              <button type="submit" className="btn btn-primary w-full">
                Se connecter
              </button>
            </form>

            <div className="divider">OU</div>

            <button className="btn w-full bg-red-600 text-white border-none hover:bg-red-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z"/>
              </svg>
              Se connecter avec Google
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}