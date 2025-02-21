import { useState, useEffect } from 'react';
import { Vehicle, CreateVehicleDto } from '@/types/vehicle';
import { User } from '@/types/user';
import { vehicleService } from '@/services/vehicle.service';
import { vehicleOptions } from '@/data/vehicleOptions';

interface VehicleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateVehicleDto) => Promise<void>;
  users: User[];
  initialData?: Vehicle;
}

export default function VehicleForm({ isOpen, onClose, onSubmit, users, initialData }: VehicleFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateVehicleDto>({
    type: '',
    brand: '',
    model: '',
    co2_rate: undefined,
    specs: {},
    user_id: '',
    is_active: true
  });

  // Get available brands for selected type
  const availableBrands = vehicleOptions.find(t => t.value === formData.type)?.brands || [];
  
  // Get available models for selected brand
  const availableModels = availableBrands.find(b => b.value === formData.brand)?.models || [];

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type,
        brand: initialData.brand,
        model: initialData.model,
        co2_rate: initialData.co2_rate,
        specs: initialData.specs || {},
        user_id: initialData.user_id,
        is_active: initialData.is_active
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log('Submitting form data:', formData);
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update vehicle details when type/brand/model changes
  useEffect(() => {
    if (formData.type && formData.brand && formData.model) {
      const details = vehicleService.getVehicleDetails(formData.type, formData.brand, formData.model);
      if (details) {
        setFormData(prev => ({
          ...prev,
          co2_rate: details.co2_rate,
          specs: details.specs || {}
        }));
      }
    }
  }, [formData.type, formData.brand, formData.model]);

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="font-bold text-lg mb-4">
          {initialData ? 'Edit Vehicle' : 'Add New Vehicle'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Vehicle Type */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Vehicle Type</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value, brand: '', model: '' }))}
              required
            >
              <option key="type-default" value="">Select type</option>
              {vehicleOptions.map(type => (
                <option key={`type-${type.value}`} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Brand */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Brand</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.brand}
              onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value, model: '' }))}
              required
              disabled={!formData.type}
            >
              <option key="brand-default" value="">Select brand</option>
              {availableBrands.map(brand => (
                <option key={`brand-${brand.value}`} value={brand.value}>
                  {brand.label}
                </option>
              ))}
            </select>
          </div>

          {/* Vehicle Model */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Model</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.model}
              onChange={(e) => setFormData(prev => ({ ...prev, model: e.target.value }))}
              required
              disabled={!formData.brand}
            >
              <option key="model-default" value="">Select model</option>
              {availableModels.map(model => (
                <option key={`model-${model.value}`} value={model.value}>
                  {model.label}
                </option>
              ))}
            </select>
          </div>

          {/* Assign to User */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">Assign to User</span>
            </label>
            <select
              className="select select-bordered w-full"
              value={formData.user_id || ''}
              onChange={(e) => {
                const value = e.target.value;
                console.log('Selected user_id:', value);
                setFormData(prev => ({
                  ...prev,
                  user_id: value || undefined
                }));
              }}
            >
              <option key="user-default" value="">Select user (optional)</option>
              {users.map(user => (
                <option key={`user-${user.id}`} value={user.id}>
                  {user.first_name} {user.last_name} ({user.email})
                </option>
              ))}
            </select>
          </div>

          {/* Active Status */}
          <div className="form-control">
            <label className="label cursor-pointer justify-start gap-4">
              <input
                type="checkbox"
                className="toggle toggle-primary"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              />
              <span className="label-text">Active</span>
            </label>
          </div>

          {/* Form Actions */}
          <div className="modal-action">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : initialData ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
