'use client';

import React, { useEffect, useState } from 'react';

interface Journey {
  id: string;
  user_id: string;
  vehicle_id: string;
  transport_mode: string;
  start_location: string;
  end_location: string;
  distance_km: number;
  co2_emissions: number;
  created_at: string;
}

export const JourneyManagement: React.FC = () => {
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof Journey>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchJourneys = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/journeys`, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch journeys');
        }
        
        const data = await response.json();
        setJourneys(data);
      } catch (err) {
        console.error('Error fetching journeys:', err);
        setError('Failed to load journeys');
      } finally {
        setLoading(false);
      }
    };

    fetchJourneys();
  }, []);

  const filteredAndSortedJourneys = journeys
    .filter(journey => 
      journey.start_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journey.end_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journey.transport_mode.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortDirection === 'asc'
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    });

  const handleSort = (field: keyof Journey) => {
    if (field === sortField) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: keyof Journey) => {
    if (field !== sortField) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="form-control w-full max-w-xs">
          <div className="join">
            <input 
              type="text" 
              placeholder="Search journeys..." 
              className="input input-bordered join-item w-full" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="btn join-item"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>
        <button className="btn btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Journey
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th onClick={() => handleSort('transport_mode')} className="cursor-pointer hover:bg-base-200">
                Mode {getSortIcon('transport_mode')}
              </th>
              <th onClick={() => handleSort('start_location')} className="cursor-pointer hover:bg-base-200">
                Start {getSortIcon('start_location')}
              </th>
              <th onClick={() => handleSort('end_location')} className="cursor-pointer hover:bg-base-200">
                End {getSortIcon('end_location')}
              </th>
              <th onClick={() => handleSort('distance_km')} className="cursor-pointer hover:bg-base-200">
                Distance {getSortIcon('distance_km')}
              </th>
              <th onClick={() => handleSort('co2_emissions')} className="cursor-pointer hover:bg-base-200">
                CO2 {getSortIcon('co2_emissions')}
              </th>
              <th onClick={() => handleSort('created_at')} className="cursor-pointer hover:bg-base-200">
                Date {getSortIcon('created_at')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedJourneys.map(journey => (
              <tr key={journey.id}>
                <td>
                  <div className="badge badge-ghost">{journey.transport_mode}</div>
                </td>
                <td>{journey.start_location}</td>
                <td>{journey.end_location}</td>
                <td>{journey.distance_km} km</td>
                <td>
                  <div className="badge badge-primary">{journey.co2_emissions} kg</div>
                </td>
                <td>{new Date(journey.created_at).toLocaleDateString()}</td>
                <td>
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </label>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                      <li><a>View Details</a></li>
                      <li><a>Export Data</a></li>
                      <li><a className="text-error">Delete Journey</a></li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredAndSortedJourneys.length === 0 && (
        <div className="text-center py-8">
          <div className="text-lg font-semibold">No journeys found</div>
          <p className="text-gray-500">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};
