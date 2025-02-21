import { useState, useEffect } from 'react';
import { Vehicle } from '@/types/vehicle';
import { User } from '@/types/user';
import { vehicleService } from '@/services/vehicle.service';
import { userService } from '@/services/user.service';
import VehicleForm from '../components/VehicleForm';
import { VehicleDetails } from '@/types/vehicleOptions';

export const VehicleManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch vehicles and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesData, usersData] = await Promise.all([
          vehicleService.getAll(),
          userService.getAllUsers()
        ]);
        setVehicles(vehiclesData);
        setUsers(usersData);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Normaliser les données du véhicule pour l'affichage
  const normalizeVehicle = (vehicle: Vehicle): Vehicle & VehicleDetails => {
    const details = vehicleService.getVehicleDetails(vehicle.type, vehicle.brand, vehicle.model);
    return {
      ...vehicle,
      ...details,
      co2_rate: vehicle.co2_rate ?? details?.co2_rate,
      specs: vehicle.specs ?? details?.specs ?? {}
    };
  };

  // Rafraîchir les données après chaque modification
  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors
      
      const [vehiclesData, usersData] = await Promise.all([
        vehicleService.getAll(),
        userService.getAllUsers()
      ]);

      if (!Array.isArray(vehiclesData)) {
        console.error('Vehicles data is not an array:', vehiclesData);
        throw new Error('Invalid vehicles data format');
      }
      
      if (!Array.isArray(usersData)) {
        console.error('Users data is not an array:', usersData);
        throw new Error('Invalid users data format');
      }

      setVehicles(vehiclesData);
      setUsers(usersData);
    } catch (err: any) {
      console.error('Error refreshing data:', err);
      setError(typeof err === 'string' ? err : 'Failed to refresh data');
      // Keep the old data if refresh fails
      setVehicles(prev => prev);
      setUsers(prev => prev);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  // Filter and normalize vehicles
  const filteredVehicles = vehicles
    .map(normalizeVehicle)
    .filter(vehicle => {
      const assignedUser = users.find(u => u.id === vehicle.user?.id);
      const searchString = `${vehicle.brand} ${vehicle.model} ${vehicle.user?.email || ''} ${vehicle.user?.first_name || ''} ${vehicle.user?.last_name || ''}`.toLowerCase();
      return searchString.includes(searchTerm.toLowerCase());
    });

  const formatCO2Rate = (rate: number | undefined | null): string => {
    if (rate === undefined || rate === null) return '0 g/km';
    const numRate = Number(rate);
    if (isNaN(numRate)) return '0 g/km';
    return `${numRate.toFixed(numRate % 1 === 0 ? 0 : 2)} g/km`;
  };

  const handleAddEdit = async (data: any) => {
    try {
      setError(null); // Clear previous errors
      if (editingVehicle) {
        const updated = await vehicleService.update(editingVehicle.id, {
          ...data,
          co2_rate: parseFloat(data.co2_rate) || 0,
          specs: data.specs || {}
        });
        console.log('Vehicle updated:', updated);
        await refreshData();
      } else {
        const created = await vehicleService.create({
          ...data,
          co2_rate: parseFloat(data.co2_rate) || 0,
          specs: data.specs || {}
        });
        console.log('Vehicle created:', created);
        await refreshData();
      }
      setShowForm(false);
      setEditingVehicle(undefined);
    } catch (err: any) {
      console.error('Error saving vehicle:', err);
      setError(typeof err === 'string' ? err : 'Failed to save vehicle');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vehicle?')) return;
    
    try {
      setError(null); // Clear previous errors
      await vehicleService.delete(id);
      await refreshData();
    } catch (err: any) {
      console.error('Error deleting vehicle:', err);
      setError(typeof err === 'string' ? err : 'Failed to delete vehicle');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 p-4 rounded-lg">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="form-control w-full md:w-auto">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search vehicles..."
                className="input input-bordered w-full md:w-80 bg-white/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-square bg-emerald-500 border-emerald-600 hover:bg-emerald-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="white">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingVehicle(undefined);
              setShowForm(true);
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Vehicle
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      ) : error ? (
        <div className="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white/50 rounded-lg shadow-lg">
          <table className="table table-zebra w-full">
            <thead className="bg-emerald-500/10 text-emerald-900">
              <tr>
                <th>Vehicle</th>
                <th>Type</th>
                <th>Assigned To</th>
                <th>CO₂ Rate</th>
                <th>Specs</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredVehicles.map((vehicle) => {
                return (
                  <tr key={vehicle.id} className="hover:bg-emerald-50">
                    <td className="font-medium">
                      {vehicle.brand} {vehicle.model}
                    </td>
                    <td>
                      <span className={`badge ${vehicle.type ? 'badge-ghost' : 'badge-error'}`}>
                        {vehicle.type || 'Unknown'}
                      </span>
                    </td>
                    <td>
                      {vehicle.user ? (
                        <div className="flex items-center gap-2">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-8">
                              <span>{vehicle.user.first_name?.[0]}{vehicle.user.last_name?.[0]}</span>
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">{vehicle.user.first_name} {vehicle.user.last_name}</span>
                            <div className="text-sm text-gray-500">{vehicle.user.email}</div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400">Unassigned</span>
                      )}
                    </td>
                    <td>
                      <span className={`${!vehicle.co2_rate || vehicle.co2_rate === 0 ? 'text-green-600' : 'text-amber-600'}`}>
                        {formatCO2Rate(vehicle.co2_rate)}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(vehicle.specs || {}).map(([key, value]) => (
                          <span key={key} className="badge badge-sm">
                            {key}: {value}
                          </span>
                        ))}
                        {(!vehicle.specs || Object.keys(vehicle.specs).length === 0) && (
                          <span className="text-gray-400 text-sm">No specifications</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-ghost btn-sm text-blue-600 hover:bg-blue-50"
                          onClick={() => {
                            setEditingVehicle(vehicle);
                            setShowForm(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-ghost btn-sm text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(vehicle.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredVehicles.length === 0 && (
            <div className="text-center py-8">
              <div className="text-lg font-semibold">No vehicles found</div>
              <p className="text-gray-500">Try adjusting your search terms</p>
            </div>
          )}
        </div>
      )}

      <VehicleForm
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingVehicle(undefined);
        }}
        onSubmit={handleAddEdit}
        users={users}
        initialData={editingVehicle}
      />
    </div>
  );
};
